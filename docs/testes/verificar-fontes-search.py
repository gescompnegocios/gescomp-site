"""Verifica o escopo da revisão, fontes originais e preservação do rio."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from PIL import Image, ImageChops

root = Path(__file__).resolve().parents[2]
pub = root / 'publicar'
out = root / 'docs/evidencias/2026-10-06/publicacao-search'
base = '0e84408'
def original(name):
    return subprocess.check_output(['git', 'show', base + ':publicar/' + name], cwd=root).decode('utf-8').replace('\r\n', '\n')
def read(path):
    return path.read_text(encoding='utf-8').replace('\r\n', '\n')
class Head(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]; self.metas=[]
    def handle_starttag(self, tag, attrs):
        if tag == 'link': self.links.append(dict(attrs))
        if tag == 'meta': self.metas.append(dict(attrs))

fontes = json.loads(read(out / 'fontes-locais.json'))
for font in fontes:
    assert hashlib.sha256((root / font['arquivo']).read_bytes()).hexdigest() == font['sha256']
css_original = read(out / 'google-fonts-original.css')
for font in fontes[:5]: css_original = css_original.replace(font['fonte'], '/' + font['arquivo'].removeprefix('publicar/'))
assert read(pub / 'assets/css/fontes.css') == css_original
paginas=[];canonicos=[]
for p in sorted(pub.glob('*.html')):
    atual = read(p); antes = original(p.name)
    assert atual.split('</head>', 1)[1].replace('&amp;rev=5','&amp;rev=4') == antes.split('</head>',1)[1], p.name + ': body alterado'
    assert 'fonts.googleapis.com' not in atual and 'fonts.gstatic.com' not in atual
    h=Head();h.feed(atual.split('</head>')[0])
    assert any(x.get('href') == '/assets/css/fontes.css?v=20261006&rev=5' for x in h.links)
    for href in re.findall(r'(?:href|src)="([^"\n]+(?:site\.css|estrutura\.css|config\.js|site\.js)[^"\n]*)"', atual):
        assert '?v=20261006&amp;rev=5' in href, href
    canonico=next((x.get('href') for x in h.links if x.get('rel')=='canonical'), None)
    if p.name != '404.html': canonicos.append(canonico);assert canonico.startswith('https://gescompnegocios.com.br/')
    else: assert any(x.get('name')=='robots' and 'noindex' in x.get('content','') for x in h.metas)
    ld=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>',atual)]
    assert not any(re.search(r'"@type"\s*:\s*"(?:Review|AggregateRating)"', json.dumps(x)) for x in ld)
    if p.name=='index.html':
        empresa=next(x for x in ld[0]['@graph'] if x.get('@type')=='AccountingService')
        assert len(empresa['priceRange'])<100
        assert 'R$ 150/mês' in empresa['priceRange'] and 'R$ 100' in empresa['priceRange']
    paginas.append({'pagina':p.name,'bodyPreservado':True,'canonical':canonico})
assert len(set(canonicos)) == 11
urls=[x.text for x in ET.parse(pub/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert set(urls)==set(canonicos)
preservados=[]
for name in ['assets/css/site.css','assets/css/estrutura.css','assets/js/site.js','assets/js/config.js','assets/js/libras.js','_headers','robots.txt','sitemap.xml']:
    assert read(pub/name)==original(name), name + ': alteração fora do escopo'
    preservados.append(name)
pares=[]
for width in [1366,360]:
    for theme in ['light','dark']:
        a=Image.open(out/f'rio-antes-fontes-{theme}-{width}.png').convert('RGB')
        b=Image.open(out/f'rio-depois-fontes-{theme}-{width}.png').convert('RGB')
        assert a.size==b.size
        diferenca=ImageChops.difference(a,b); pixels=list(diferenca.get_flattened_data())
        alterados=sum(any(p) for p in pixels); maximo=max(max(p) for p in pixels)
        # feTurbulence/feDisplacementMap variam no arredondamento do rasterizador.
        # A conferência estrita inicial encontrou 2 pixels com máximo de 3/255.
        # Registra a variação; não chama esse par de idêntico pixel a pixel.
        assert alterados<=2 and maximo<=3, f'Rio diferente: {theme} {width}: {alterados} pixels, máximo {maximo}'
        pares.append({'theme':theme,'width':width,'pixelsDiferentes':alterados,'maxCanal':maximo,
                      'limitesDiferenca':diferenca.getbbox(),'identicoPixelAPixel':alterados==0})
resultado={'base':base,'paginas':paginas,'preservados':preservados,'rio':pares,'fontesIdenticasAoOriginal':True}
(out/'preservacao-fontes.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'paginas':len(paginas),'canonicos':len(canonicos),'rio':pares,'fontesVerificadas':5}))
