# Auditoria específica da ampliação de 10/10/2026. Sem dependências Python externas.
# Uso: python -X utf8 docs/testes/validar-conteudo-20261010.py
# A preservação integral usa o snapshot ignorado desta sessão, quando disponível.
# Em outro checkout, essa etapa fica explicitamente sem snapshot; as demais são executadas.
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
from urllib.parse import urlsplit, unquote
from decimal import Decimal as D
import re, json, hashlib, subprocess, xml.etree.ElementTree as ET

repo = Path(__file__).resolve().parents[2]
pub = repo / 'publicar'
base = repo / '.playwright-mcp/conteudo-20261010/antes-codex/publicar'
slugs = ['informacoes', 'imposto-de-renda', 'mei', 'simples-nacional', 'abrir-empresa', 'pro-labore-e-lucros', 'departamento-pessoal', 'calendario-fiscal', 'fim-escala-6x1', 'novo-limite-mei']
out = repo / 'docs/evidencias/2026-10-10/conteudo-seo'
out.mkdir(parents=True, exist_ok=True)
errors, rows, parsed = [], [], {}

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.ids=[]; self.links=[]; self.assets=[]; self.meta={}; self.canonical=[]; self.h1=0; self.text=[]; self.skip=0; self.body=False; self.issues=[]; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='body': self.body=True
        if tag in ('script','style','svg'): self.skip+=1
        if a.get('id'): self.ids.append(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
        if tag=='a':
            self.links.append(a.get('href',''))
            if a.get('target')=='_blank' and 'noopener' not in a.get('rel',''): self.issues.append('link externo sem noopener')
        for attr in ('src','href'):
            if a.get(attr,'').startswith('/assets/'): self.assets.append(a[attr])
        if tag=='img' and 'alt' not in a: self.issues.append('imagem sem alt')
        if any('\\' in (v or '') for k,v in attrs if k in ('class','href','id','target','rel')): self.issues.append('atributo com barra indevida')
    def handle_endtag(self, tag):
        if tag in ('script','style','svg'): self.skip-=1
    def handle_data(self, text):
        if self.body and not self.skip and text.strip(): self.text.append(text.strip())

def check(value, message):
    if not value: errors.append(message)
def norm(s): return re.sub(r'\s+', ' ', unescape(re.sub(r'<[^>]+>', ' ', s))).strip()

for p in pub.glob('*.html'):
    h=p.read_text(encoding='utf-8'); q=Page(h); parsed[p.name]=(h,q)
    title=re.search(r'<title>(.*?)</title>',h,re.S).group(1)
    url='https://gescompnegocios.com.br/'+('' if p.name=='index.html' else p.stem)
    check(q.h1==1,p.name+': H1')
    check(len(q.ids)==len(set(q.ids)),p.name+': IDs repetidos')
    if p.name != '404.html': check(q.canonical==[url],p.name+': canonical')
    check(q.meta.get('description'),p.name+': descrição ausente')
    if p.name != '404.html':
        check(q.meta.get('og:url')==url,p.name+': OG URL')
        check(q.meta.get('og:title')==title and q.meta.get('twitter:title')==title,p.name+': títulos divergentes')
        check(q.meta.get('og:description')==q.meta.get('description') and q.meta.get('twitter:description')==q.meta.get('description'),p.name+': descrições divergentes')
    check(not q.issues,p.name+': '+str(q.issues))
    for asset in q.assets: check((pub/urlsplit(asset).path.lstrip('/')).exists(),p.name+': asset '+asset)
    for script in re.findall(r'<script type="application/ld\+json">(.*?)</script>',h,re.S):
        g=json.loads(script)
        for n in g.get('@graph',[g]):
            check(n.get('@type') not in ('AggregateRating','Review'),p.name+': avaliações estruturadas')
            if n.get('@type')=='Article' and p.stem in slugs:
                check(n.get('dateModified')=='2026-10-10',p.name+': modificação Article')
                for link in n.get('citation',[]): check(link in q.links,p.name+': fonte invisível '+link)
            if n.get('@type')=='FAQPage':
                for faq in n.get('mainEntity',[]):
                    check(norm(faq['name']) in norm(' '.join(q.text)),p.name+': pergunta estruturada invisível')
                    check(norm(faq['acceptedAnswer']['text']) in norm(' '.join(q.text)),p.name+': resposta estruturada divergente')
    if p.stem in slugs:
        check('Atualizado em 10/10/2026' in h,p.name+': revisão visível')
        check('<details' not in h[h.index('<main'):h.index('</main>')],p.name+': FAQ accordion voltou')
        check('class="artigo-corpo"' in h,p.name+': estrutura Claude')
    rows.append({'pagina':p.name,'titulo':title,'palavrasBody':len(' '.join(q.text).split()),'ids':len(q.ids)})

check(len(set(r['titulo'] for r in rows))==len(rows),'títulos duplicados')
check(len(set(q.meta['description'] for _,q in parsed.values()))==len(rows),'descrições duplicadas')
for name,(h,q) in parsed.items():
    for link in q.links:
        u=urlsplit(link)
        if u.scheme or not link or not (link.startswith('/') or link.startswith('#')): continue
        path=u.path.strip('/')
        target=(('index.html' if not path else path if path.endswith('.html') else path+'.html') if not link.startswith('#') else name)
        if target in parsed:
            if u.fragment: check(unquote(u.fragment) in parsed[target][1].ids,name+': fragmento ausente '+link)
        elif not path.startswith('assets/'):
            check(False,name+': página ausente '+link)

sitemap=ET.parse(pub/'sitemap.xml')
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls=sitemap.findall('s:url',ns)
check(len(urls)==16,'URLs sitemap')
for node in urls:
    u=urlsplit(node.find('s:loc',ns).text); name=u.path.strip('/') or 'index'; filename=name+'.html'
    check(filename in parsed,'sitemap sem HTML '+filename)
    check('noindex' not in parsed[filename][1].meta['robots'],'noindex no sitemap')
    if name in slugs: check(node.find('s:lastmod',ns).text=='2026-10-10','sitemap modificação '+name)
check('noindex' in parsed['404.html'][1].meta['robots'],'404 indexável')

# Preservação do Codex é contra o snapshot após a estrutura do Claude, não uma base histórica incompatível.
unchanged=[]
reviewed_claude=[]
for p in (base.rglob('*') if base.exists() else []):
    if not p.is_file(): continue
    relative=p.relative_to(base); current=pub/relative
    if relative.as_posix()=='sitemap.xml' or (relative.suffix=='.html' and relative.stem in slugs): continue
    identical = p.read_bytes()==current.read_bytes()
    if relative.as_posix()=='assets/css/site.css' and not identical:
        # Duas mudanças posteriores, descritas no handoff pelo Claude em 10/10.
        # Só esse delta literal é aceito; qualquer outro continua falhando.
        before_css = p.read_text(encoding='utf-8')
        expected_css = before_css.replace('.artigo-secao.proposta-aviso{padding:', '.artigo-secao.proposta-aviso{scroll-margin-top:0;padding:', 1)
        expected_css = expected_css.replace('.leia-mais{padding:0 var(--margem) var(--secao-y);scroll-margin-top:calc(var(--folga-ancora) - clamp(40px,5vw,56px))}', '.leia-mais{padding:0 var(--margem) var(--secao-y)}\nsection.leia-mais[id]{scroll-margin-top:calc(var(--folga-ancora) - clamp(40px,5vw,56px))}', 1)
        if expected_css == current.read_text(encoding='utf-8'):
            reviewed_claude.append({'arquivo':relative.as_posix(),'delta':'Somente margens de âncora de proposta-aviso e section.leia-mais[id], registrado pelo Claude'})
            continue
    check(identical,'fora do escopo Codex: '+relative.as_posix())
    if identical: unchanged.append(relative.as_posix())
rio=lambda h: re.search(r'<section id="rio"[^>]*>.*?</section>',h,re.S).group(0)
head=subprocess.run(['git','show','9c948b3:publicar/index.html'],cwd=repo,check=True,capture_output=True).stdout.decode('utf-8')
check(rio(head)==rio(parsed['index.html'][0]),'rio alterado desde Git inicial')

# Exemplos próprios: verifica a conta usando decimais, sem depender da implementação HTML.
check(D('5200')*D('.275')-D('908.73')==D('521.27'),'IR tabela')
check(D('978.62')-D('.133145')*D('6000')==D('179.75'),'redução IR')
check(D('521.27')-D('179.75')==D('341.52'),'IR final')
check((D('240000')*D('.073')-D('5940'))/D('240000')*D('20000')==D('965'),'DAS comércio')
check(D('6750')*6==D('40500') and D('40500')*D('1.2')==D('48600'),'MEI proporcional')
check(D('60000')*D('.1')==D('6000') and D('3000')*D('.08')==D('240'),'dividendos e FGTS')

report={'data':'2026-10-10','paginas':rows,'urlsSitemap':len(urls),'snapshotClaudeDisponivel':base.exists(),'arquivosPreservadosContraSnapshotClaude':len(unchanged),'deltasPosterioresClaudeRevisados':reviewed_claude,'rioHtmlIntactoContraGitInicial':rio(head)==rio(parsed['index.html'][0]),'exemplosDecimaisConferidos':6,'erros':sorted(set(errors))}
(out/'validacao-estatica.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'paginas':len(rows),'urlsSitemap':len(urls),'preservados':len(unchanged),'erros':report['erros']},ensure_ascii=False))
raise SystemExit(1 if errors else 0)
