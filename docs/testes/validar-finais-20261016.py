"""Verificação desta entrega, sem regravar evidências históricas."""
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
from urllib.parse import urlsplit, unquote
import json,re,subprocess,xml.etree.ElementTree as ET
repo=Path(__file__).resolve().parents[2]
pub=repo/'publicar'
base='116546769d54b99791b9202d01d07d7653002589'
errors=[]
def check(ok,msg):
    if not ok:errors.append(msg)
def git(path):return subprocess.check_output(['git','show',base+':'+path],cwd=repo).decode('utf-8').replace('\r\n','\n')
class Doc(HTMLParser):
    def __init__(self,s):
        super().__init__(convert_charrefs=True);self.ids=[];self.links=[];self.assets=[];self.h1=0;self.feed(s)
    def handle_starttag(self,t,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if t=='a':self.links.append(a.get('href',''))
        if t=='h1':self.h1+=1
        if t in ['script','img'] and a.get('src'):self.assets.append(a['src'])
        if t=='link' and a.get('href','').startswith('/'):self.assets.append(a['href'])
        if t=='img':
            check('alt' in a and 'width' in a and 'height' in a,'Imagem sem atributos: '+a.get('src',''))
docs={p.name:Doc(p.read_text(encoding='utf-8')) for p in pub.glob('*.html')}
for name,d in docs.items():
    check(d.h1==1,name+': H1')
    check(len(set(d.ids))==len(d.ids),name+': IDs duplicados')
    s=(pub/name).read_text(encoding='utf-8')
    body=re.sub(r'<script\b.*?</script>|<svg\b.*?</svg>','',s,flags=re.S)
    norm=lambda v:' '.join(re.sub(r'<[^>]*>',' ',unescape(v)).split())
    visible=norm(body)
    for ld in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S):
        nodes=json.loads(ld)['@graph']
        for n in nodes:
            if n['@type']=='FAQPage':
                for q in n['mainEntity']:
                    check(norm(q['name']) in visible,name+': FAQ sem pergunta visível')
                    check(norm(q['acceptedAnswer']['text']) in visible,name+': FAQ sem resposta visível')
            if n['@type'] in ['WebSite','AccountingService']:
                check('GECOMP' not in str(n.get('alternateName',[])),name+': não inventar marca alternativa')
            if n['@type']=='Article':
                for u in n.get('citation',[]):check(unescape(u) in unescape(s.split('</head>')[1]),name+': fonte sem link visível '+u)
    check(not re.search(r'um (?:de|dos) nossos contadores|nossos contadores|um de nossos profissionais|Ela analisa',s,re.I),name+': chamada antiga')
    for asset in d.assets:check((pub/unquote(urlsplit(asset).path).lstrip('/')).exists(),name+': recurso '+asset)
    for href in d.links:
        u=urlsplit(href)
        if u.scheme or u.netloc or not href:continue
        if href=='[LINK-DA-PLATAFORMA]' and href in git('publicar/'+name):continue # Bloco oculto preexistente.
        target=unquote(u.path).lstrip('/')
        target=target or (name if href.startswith('#') else 'index.html')
        if not Path(target).suffix:target+='.html'
        check((pub/target).exists(),name+': link '+href)
        if u.fragment and target in docs:check(unquote(u.fragment) in docs[target].ids,name+': âncora '+href)
    if name not in ['receita-sintonia-terceiro-ciclo-2026.html','simples-nacional-balanco-outubro-2026.html','cbs-documentos-fiscais-outubro-2026.html']:
        old=git('publicar/'+name)
        # Pedido posterior autoriza revisão editorial/SEO de todos os guias e serviços.
        # Preservação continua sendo exigida para rotas, IDs, rodapés e WhatsApp abaixo.
        # Links e mensagens comerciais permanecem exatamente como na base.
        wa=lambda h:re.findall(r'<a\b[^>]*(?:data-whatsapp|wa.me)[^>]*>',h)
        check(wa(old)==wa(s),name+': links WhatsApp alterados')
        check(set(Doc(old).ids)<=set(d.ids),name+': IDs antigos removidos')
        footer=lambda h:re.findall(r'<footer\b.*?</footer>',h,re.S)
        check(footer(old)==footer(s),name+': rodapé alterado')
home=(pub/'index.html').read_text(encoding='utf-8');old=git('publicar/index.html')
section=lambda h,id:re.search(r'<section id="'+id+r'".*?</section>',h,re.S)[0]
for ident in ['rio','contato','avaliacoes','instagram']:
    check(section(home,ident)==section(old,ident),'Seção preservada: '+ident)
for f in ['site.js','config.js','libras.js']:check((pub/'assets/js'/f).read_text(encoding='utf-8')==git('publicar/assets/js/'+f),'JS alterado: '+f)
css=(pub/'assets/css/site.css').read_text(encoding='utf-8');check(css.startswith(git('publicar/assets/css/site.css')),'CSS anterior alterado')
check('Analisamos seu caso' in home and 'Você fala com nossa equipe' in home,'Como funciona')
check(home.count('class="institucional-cartao')==3,'Três cartões institucionais')
check(home.count('class="mudancas-numero"')==3,'Três notícias na inicial')
check(re.search(r'<h1\b.*?</h1>',home,re.S)[0]==re.search(r'<h1\b.*?</h1>',old,re.S)[0],'Título principal alterado')
for phrase in ['Tiramos todas as suas dúvidas de forma clara, transparente e acessível.','Gabriela do Nascimento Vieira','009186/SE','Nossa missão','Nossa visão','Nossos valores']:check(phrase in home,'Texto ausente: '+phrase)
check('Quem é a Gabriela' not in home and 'gabriela-grade' not in home,'Bloco biográfico removido no pedido posterior')
check('Pesquisou por GECOMP?' in home,'FAQ de identificação da marca')
for name,d in docs.items():
    if name in ['index.html','404.html']:continue
    s=(pub/name).read_text(encoding='utf-8')
    check('16/10/2026' in s,name+': revisão visível em 16/10')
    for data in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S):
        for n in json.loads(data)['@graph']:
            if n['@type']=='Article':check(n['dateModified']=='2026-10-16',name+': data de revisão estruturada')
scale=(pub/'fim-escala-6x1.html').read_text(encoding='utf-8')
check('A proposta ainda não é uma regra em vigor' not in scale and 'Emenda Constitucional 141' in scale,'Escala 6x1: promulgação atualizada')
mei=(pub/'novo-limite-mei.html').read_text(encoding='utf-8')
check('aguardava despacho' not in mei and 'aguarda sanção' in mei,'MEI: situação legislativa atualizada')
tree=ET.parse(pub/'sitemap.xml');urls=[x.text for x in tree.findall('.//{*}loc') if x.text.startswith('https://gescompnegocios.com.br/')]
pages=[p for p in urls if '/assets/' not in p]
check(len(pages)==19,'Sitemap: 19 páginas')
for url in pages:
    name=urlsplit(url).path.strip('/') or 'index'
    check(name+'.html' in docs,'Sitemap inexistente: '+url)
result={'base':base,'html':len(docs),'urlsSitemap':len(pages),'erros':errors}
out=repo/'docs/evidencias/2026-10-16';out.mkdir(parents=True,exist_ok=True)
(out/'validacao-estatica.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
raise SystemExit(bool(errors))
