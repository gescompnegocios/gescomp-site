"""Inventário/validação exclusivamente locais, sem rede nem dependências externas."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, urljoin
import json
import re
import sys
import xml.etree.ElementTree as ET
import subprocess
import hashlib
import unicodedata
import gzip
from html import unescape

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / 'publicar'
ORIGIN = 'https://gescompnegocios.com.br'
OUT = ROOT / 'docs/evidencias/2026-10-07/seo-local'
BASE = 'f970f3f'

# Alterações aprovadas depois da base, aplicadas à base antes da comparação: qualquer outra mudança continua acusada.
# 08/10/2026 (Claude): links internos param logo abaixo do cabeçalho fixo (scroll-padding/scroll-margin + medição do cabeçalho).
APROVADAS=[
    ('publicar/assets/css/site.css', "section[id]{scroll-margin-top:84px}", "/* Links internos: nada fica atrás do cabeçalho fixo (--cabecalho, ajustado pelo site.js à altura real)\n   e o respiro interno da seção é descontado, para o título parar logo abaixo do cabeçalho. */\n:root{--cabecalho:76px;--folga-ancora:14px}\n@media (max-width:779px){:root{--cabecalho:68px}}\nhtml{scroll-padding-top:var(--cabecalho)}\nsection[id]{scroll-margin-top:calc(var(--folga-ancora) - var(--secao-y))}\n#reforma-tributaria{scroll-margin-top:calc(var(--folga-ancora) - 40px)}\n#inicio{scroll-margin-top:0}"),
    ('publicar/assets/js/site.js', "var mq=window.matchMedia('(max-width: 779px)');", "// Links internos param abaixo do cabeçalho fixo: --cabecalho (CSS) acompanha a altura real. Com o menu aberto o cabeçalho cresce, então não mede.\nvar cabecalho=document.querySelector('.gc-cabecalho');\nfunction medirCabecalho(){if(cabecalho&&(!mm||mm.hidden)){var a=Math.round(cabecalho.getBoundingClientRect().height);if(a>0)raiz.style.setProperty('--cabecalho',a+'px');}}\nrequestAnimationFrame(medirCabecalho);\nvar mq=window.matchMedia('(max-width: 779px)');"),
    ('publicar/assets/js/site.js', "window.addEventListener('resize',function(){agendarFab();if(!mq.matches)menu(false);});", "window.addEventListener('resize',function(){agendarFab();if(!mq.matches)menu(false);requestAnimationFrame(medirCabecalho);});"),
]


def norm(value):
    text=re.sub(r'<[^>]+>',' ',unescape(value))
    text=' '.join(unicodedata.normalize('NFKC',text).casefold().split())
    return re.sub(r'\s+([.,;:!?])',r'\1',text)

def walk(value):
    if isinstance(value,dict):
        yield value
        for child in value.values():yield from walk(child)
    elif isinstance(value,list):
        for child in value:yield from walk(child)

def git_file(path):
    return subprocess.check_output(['git','show',BASE+':'+path],cwd=ROOT)

def normalized_bytes(value):
    # Git guarda LF; checkouts Windows podem guardar CRLF sem mudança de conteúdo.
    return value.replace(b'\r\n',b'\n')

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags=[]; self.text=[]; self.headings=[]; self.links=[]; self.images=[]
        self.titles=[]; self.jsonld=[]; self.ids=[]
        self.hidden=0; self.templates=0; self.capture=None; self.captured=[]; self.link=None
    def handle_starttag(self, tag, attrs):
        if tag=='template':self.templates+=1;return
        if self.templates:return
        a=dict(attrs); self.tags.append((tag,a))
        if a.get('id'): self.ids.append(a['id'])
        if tag=='a': self.link={'href':a.get('href',''),'texto':[], 'attrs':a}; self.links.append(self.link)
        if tag=='img': self.images.append(a)
        if re.fullmatch('h[1-6]',tag) or tag=='title': self.capture=(tag,a);self.captured=[]
        if tag=='script' and a.get('type')=='application/ld+json': self.capture=(tag,a);self.captured=[]
        if tag in ('script','style','svg','template'): self.hidden+=1
    def handle_endtag(self, tag):
        if tag=='template':self.templates=max(0,self.templates-1);return
        if self.templates:return
        if self.capture and tag==self.capture[0]:
            name,a=self.capture; text=''.join(self.captured).strip()
            if name=='title': self.titles.append(text)
            elif name=='script': self.jsonld.append(text)
            else:self.headings.append({'tag':name,'texto':text,'id':a.get('id')})
            self.capture=None;self.captured=[]
        if tag=='a':self.link=None
        if tag in ('script','style','svg','template'):self.hidden=max(0,self.hidden-1)
    def handle_data(self,data):
        if self.templates:return
        if self.capture:self.captured.append(data)
        if not self.hidden:
            self.text.append(data)
            if self.link:self.link['texto'].append(data)

def local(url, source):
    u=urlsplit(urljoin(ORIGIN+('/' if source.name=='index.html' else '/'+source.stem),url))
    if u.scheme not in ('http','https') or u.netloc!='gescompnegocios.com.br':return None,u
    p=PUB/unquote(u.path).lstrip('/')
    if u.path.endswith('/'):p=p/'index.html'
    elif not p.suffix:p=p.with_suffix('.html')
    return p,u

def scan():
    pages={}; failures=[]; warnings=[]; entities={}
    for path in sorted(PUB.glob('*.html')):
        raw=path.read_text(encoding='utf-8');p=Page();p.feed(raw)
        metas=[a for t,a in p.tags if t=='meta']
        values=lambda name:[a.get('content','') for a in metas if a.get('name')==name]
        canonical=[a.get('href') for t,a in p.tags if t=='link' and a.get('rel')=='canonical']
        graphs=[]
        for block in p.jsonld:
            try:
                j=json.loads(block);graphs.extend(j.get('@graph',[j]))
            except ValueError as e:failures.append([path.name,'JSON-LD inválido',str(e)])
        links=[]
        for a in p.links:
            target,u=local(a['href'],path)
            links.append({'href':a['href'],'texto':' '.join(''.join(a['texto']).split()),'interno':target is not None,'dataWhatsApp':a['attrs'].get('data-whatsapp-msg') or ('padrao' if 'data-whatsapp' in a['attrs'] else None)})
            if target is not None:
                if not target.is_file():failures.append([path.name,'link interno inexistente',a['href']])
                elif u.fragment and target.suffix=='.html' and not re.search(r'\bid=["\']'+re.escape(unquote(u.fragment))+r'["\']',target.read_text(encoding='utf-8')):failures.append([path.name,'âncora inexistente',a['href']])
        body=' '.join(' '.join(p.text).split())
        pages[path.name]={'title':p.titles,'description':values('description'),'canonical':canonical,'robots':values('robots'),'headings':p.headings,'conteudo':body,'palavras':len(body.split()),'links':links,'imagens':p.images,'jsonld':graphs,'ids':p.ids,'bytes':path.stat().st_size}
        for name,vals in [('title',p.titles),('description',values('description')),('robots',values('robots'))]:
            if len(vals)!=1:failures.append([path.name,'quantidade '+name,len(vals)])
        if sum(x['tag']=='h1' for x in p.headings)!=1:failures.append([path.name,'quantidade H1'])
        for im in p.images:
            if 'alt' not in im:failures.append([path.name,'imagem sem alt',im.get('src')])
            if not im.get('width') or not im.get('height'):failures.append([path.name,'imagem sem dimensão',im.get('src')])
        if '\ufffd' in raw:failures.append([path.name,'caractere de substituição'])
        if len(p.ids)!=len(set(p.ids)):failures.append([path.name,'IDs HTML duplicados'])
        if sum(t=='main' for t,a in p.tags)!=1:failures.append([path.name,'quantidade main'])
        if path.name!='404.html':
            if not graphs:failures.append([path.name,'JSON-LD ausente'])
            url=ORIGIN+('/' if path.name=='index.html' else '/'+path.stem)
            for attr in ('og:url',):
                if [a.get('content') for a in metas if a.get('property')==attr]!=[url]:failures.append([path.name,attr+' incorreto'])
            for attr in ('og:image','twitter:image'):
                imgs=[a.get('content') for a in metas if a.get('property')==attr or a.get('name')==attr]
                if len(imgs)!=1:failures.append([path.name,'quantidade '+attr]);continue
                target,u=local(imgs[0],path)
                if not target or not target.is_file():failures.append([path.name,'imagem social inexistente',imgs[0]])
        # Arquivos necessários ao desenho da página, sem buscar nada na rede.
        for tag,a in p.tags:
            sources=[]
            if tag in ('script','img'):sources.append(a.get('src',''))
            if tag=='link' and a.get('rel') in ('stylesheet','preload','icon','manifest','apple-touch-icon'):sources.append(a.get('href',''))
            if tag in ('img','source'):
                sources.extend(x.strip().split()[0] for x in a.get('srcset','').split(',') if x.strip())
            for src in sources:
                if not src:continue
                target,u=local(src,path)
                if target is not None and not target.is_file():failures.append([path.name,'asset inexistente',src])
        for node in walk(graphs):
            typ=node.get('@type');id_=node.get('@id')
            if typ in ('Review','AggregateRating'):failures.append([path.name,'rating não permitido',typ])
            if id_ and typ:entities.setdefault(id_,set()).add(str(typ))
            if id_==ORIGIN+'/#empresa' and typ:
                if typ!='AccountingService':failures.append([path.name,'tipo inconsistente da empresa',typ])
                if node.get('telephone') and re.sub(r'\D','',node['telephone'])!='5579988771430':failures.append([path.name,'telefone inconsistente'])
                if node.get('email') and node['email']!='escritoriogescomp@gmail.com':failures.append([path.name,'email inconsistente'])
                address=node.get('address',{})
                for key,expected in [('addressLocality','Barra dos Coqueiros'),('addressRegion','SE'),('postalCode','49140-386')]:
                    if key in address and address[key]!=expected:failures.append([path.name,'endereço inconsistente',key])
            if id_==ORIGIN+'/#gabriela' and typ:
                if node.get('name')!='Gabriela do Nascimento Vieira':failures.append([path.name,'nome da responsável inconsistente'])
                if node.get('hasCredential',{}).get('name')!='CRC 009186/SE':failures.append([path.name,'CRC inconsistente'])
            if typ=='Service' and node.get('provider') and node['provider']!={'@id':ORIGIN+'/#empresa'}:failures.append([path.name,'provider inconsistente'])
            if typ=='BreadcrumbList':
                items=node.get('itemListElement',[])
                if [i.get('position') for i in items]!=list(range(1,len(items)+1)):failures.append([path.name,'ordem breadcrumb'])
                for item in items:
                    target,u=local(item.get('item',''),path)
                    if not target or not target.is_file():failures.append([path.name,'breadcrumb inexistente',item])
            if typ=='FAQPage':
                for q in node.get('mainEntity',[]):
                    if norm(q.get('name','')) not in norm(body):failures.append([path.name,'pergunta schema não consta no HTML',q.get('name')])
                    if norm(q.get('acceptedAnswer',{}).get('text','')) not in norm(body):warnings.append([path.name,'resposta FAQ exige comparação semântica',q.get('name')])
        if path.name!='404.html' and 'Barra dos Coqueiros' not in body:failures.append([path.name,'localidade do escritório ausente'])
        if any(x in raw for x in ('gescompcontabilidade.com.br','gescomp-site.gescompnegocios.workers.dev')):failures.append([path.name,'domínio antigo'])
        if any(x in raw for x in ('/contabilidade-aracaju','/contabilidade-salvador','/contabilidade-belo-horizonte','/trocar-de-contador')):failures.append([path.name,'URL não autorizada'])
        pages[path.name]['gzipBytes']=len(gzip.compress(raw.encode('utf-8'),mtime=0))
    for id_,types in entities.items():
        if len(types)>1:failures.append(['tipos conflitantes para @id',id_,sorted(types)])
    for name in ('title','description','canonical'):
        groups={}
        for f,p in pages.items():
            for value in p[name]:groups.setdefault(value,[]).append(f)
        for value,files in groups.items():
            if len(files)>1:failures.append(['duplicidade '+name,files,value])
    urls=[e.text for e in ET.parse(PUB/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    indexed=[]
    for f,p in pages.items():
        noindex=any('noindex' in x for x in p['robots'])
        if not noindex:
            expected=ORIGIN+('/' if f=='index.html' else '/'+f.removesuffix('.html'))
            if p['canonical']!=[expected]:failures.append([f,'canonical incorreto',p['canonical'],expected])
            indexed.extend(p['canonical'])
        elif any(c in urls for c in p['canonical']):failures.append([f,'noindex no sitemap'])
    if set(urls)!=set(indexed):failures.append(['sitemap diverge','ausentes',sorted(set(indexed)-set(urls)),'extras',sorted(set(urls)-set(indexed))])
    if len(urls)!=len(set(urls)):failures.append(['sitemap duplicado'])
    for u in urls:
        target,parsed=local(u,PUB/'index.html')
        if parsed.query or parsed.fragment or not target or not target.is_file():failures.append(['URL inválida no sitemap',u])
    # Grafo descoberto do HTML, não depende de JS nem de sitemaps para encontrar serviços.
    edges={f:set() for f in pages};incoming={f:set() for f in pages}
    for f,p in pages.items():
        for link in p['links']:
            target,u=local(link['href'],PUB/f)
            if target and target.name in pages and target.name!=f:
                edges[f].add(target.name);incoming[target.name].add(f)
    found={'index.html'};pending=['index.html']
    while pending:
        for target in edges[pending.pop()]-found:found.add(target);pending.append(target)
    for f in pages:
        if 'noindex' not in ' '.join(pages[f]['robots']) and f not in found:failures.append([f,'página órfã do grafo da home'])
    protected={}
    if '--antes' not in sys.argv:
        for folder in ('assets/css','assets/js'):
            for f in (PUB/folder).glob('*'):
                if not f.is_file():continue
                rel='publicar/'+folder+'/'+f.name;base=normalized_bytes(git_file(rel));current=normalized_bytes(f.read_bytes())
                for arq,antes,depois in APROVADAS:
                    if arq==rel:base=base.replace(antes.encode('utf-8'),depois.encode('utf-8'),1)
                if base!=current:
                    # Claude adicionou somente classes para links novos, sem modificar regras existentes.
                    extra=current[len(base):].decode('utf-8') if current.startswith(base) else None
                    permitted=rel=='publicar/assets/css/site.css' and extra is not None and all(
                        not line.strip() or line.strip().startswith('/* Passagem 1 de SEO') or
                        ('{' in line and re.fullmatch(r'[^{}]+\{[^{}]+\}',line.strip()) and all(
                            re.fullmatch(r'(?:\.ajuda-saiba(?: a)?|(?:\.conteudo-artigo a)?\.link-claro)(?::hover)?',selector.strip())
                            for selector in line.split('{',1)[0].split(',')))
                        for line in extra.splitlines())
                    if not permitted:failures.append([rel,'arquivo protegido alterado'])
                    else:protected['cssBasePreservadaComClassesDeLinksNovos']=True
                protected[rel]=hashlib.sha256(current).hexdigest()
        current=(PUB/'index.html').read_text(encoding='utf-8');base=git_file('publicar/index.html').decode('utf-8')
        rio=lambda s:re.search(r'<section id="rio"[\s\S]*?</section>',s)[0].replace('\r\n','\n')
        if rio(current)!=rio(base):failures.append(['index.html','rio alterado'])
        protected['rioHtmlSha256']=hashlib.sha256(rio(current).encode('utf-8')).hexdigest()
        for rel in ('robots.txt','_headers','site.webmanifest'):
            if normalized_bytes(git_file('publicar/'+rel))!=normalized_bytes((PUB/rel).read_bytes()):failures.append([rel,'infraestrutura fora do escopo alterada'])
        # Fotos/ícones/fontes pré-existentes continuam idênticos à base Git.
        changed=subprocess.check_output(['git','diff','--name-only',BASE,'--','publicar/assets/img','publicar/assets/fonts','publicar/assets/icones'],cwd=ROOT).decode().splitlines()
        if changed:failures.append(['assets visuais alterados',changed])
        manifest=json.loads((PUB/'site.webmanifest').read_text(encoding='utf-8'))
        if manifest.get('id')!='/' or manifest.get('scope')!='/':failures.append(['manifest fora da raiz'])
    return {'base':BASE,'paginas':pages,'sitemap':urls,'falhas':failures,'avisosRevisao':warnings,'redeExterna':False,'protegidos':protected,'grafo':{f:{'saidas':sorted(edges[f]),'entradas':sorted(incoming[f])} for f in pages}}

if __name__=='__main__':
    result=scan();OUT.mkdir(parents=True,exist_ok=True)
    name='auditoria-antes.json' if '--antes' in sys.argv else 'validacao-depois.json'
    (OUT/name).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'relatorio':str((OUT/name).relative_to(ROOT)),'paginas':len(result['paginas']),'falhas':result['falhas']},ensure_ascii=True))
    if '--antes' not in sys.argv and result['falhas']:sys.exit(1)
