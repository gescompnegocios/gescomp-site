"""Confere indexação, links, metadados, conteúdo e preservação contra a base da entrega."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib
import json
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / 'publicar'
ORIGIN = 'https://gescompnegocios.com.br'
BASE = 'da4904d'
OUT = ROOT / 'docs/evidencias/2026-10-06/seo-informacoes'

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.attrs = []; self.text = []; self.script = False; self.templates = 0
    def handle_starttag(self, tag, attrs):
        if tag == 'template': self.templates += 1; return
        if self.templates: return
        self.attrs.append((tag, dict(attrs)))
        if tag in ['script', 'style']: self.script = True
    def handle_endtag(self, tag):
        if tag == 'template': self.templates -= 1; return
        if self.templates: return
        if tag in ['script', 'style']: self.script = False
    def handle_data(self, data):
        if not self.script and not self.templates: self.text.append(data)

def read(path): return path.read_text(encoding='utf-8')
def original(path):
    return subprocess.check_output(['git', 'show', BASE + ':publicar/' + path], cwd=ROOT).decode('utf-8').replace('\r\n', '\n')
def route(name): return '/' if name == 'index.html' else '/' + name.removesuffix('.html')
def local(path):
    path = unquote(path).lstrip('/')
    target = PUB / path
    if not path: return PUB / 'index.html'
    if not target.suffix: target = target.with_suffix('.html')
    return target

rows = []; titles = set(); canonicals = set(); failures = []
for p in sorted(PUB.glob('*.html')):
    s = read(p); page = Page(); page.feed(s)
    assert '\ufffd' not in s, p.name
    assert sum(t == 'h1' for t, _ in page.attrs) == 1, p.name
    assert s.startswith('<!doctype html>') and 'lang="pt-BR"' in s, p.name
    attrs = {(a.get('name') or a.get('property')): a.get('content') for t, a in page.attrs if t == 'meta'}
    if p.name == '404.html':
        assert 'noindex' in attrs['robots']; continue
    title = re.search(r'<title>(.*?)</title>', s)[1]
    assert title not in titles; titles.add(title)
    canonical = next(a['href'] for t, a in page.attrs if t == 'link' and a.get('rel') == 'canonical')
    assert canonical == ORIGIN + route(p.name), (p.name, canonical)
    assert canonical not in canonicals; canonicals.add(canonical)
    assert attrs['og:url'] == canonical
    assert attrs['og:title'] == title == attrs['twitter:title']
    assert attrs['description'] == attrs['og:description'] == attrs['twitter:description']
    assert 'index, follow' in attrs['robots'] and 'nosnippet' not in attrs['robots']
    assert attrs['og:image'] == attrs['twitter:image'] and local(urlsplit(attrs['og:image']).path).is_file()
    graph = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)[1])['@graph']
    assert not any(n['@type'] in ['AggregateRating', 'Review'] for n in graph)
    persons = [n for n in graph if n.get('@type') == 'Person']; assert len(persons) == 1
    assert persons[0]['name'] == 'Gabriela do Nascimento Vieira'
    for node in graph:
        if node['@type'] == 'Article':
            assert node['author']['@id'] == persons[0]['@id']
            assert node['headline'] in ''.join(page.text)
            assert node['mainEntityOfPage'] == canonical
            assert node['dateModified'] >= node['datePublished']
        elif node['@type'] == 'AccountingService':
            assert node['address']['addressLocality'] == 'Barra dos Coqueiros'
        elif node['@type'] == 'BreadcrumbList':
            for item in node['itemListElement']:
                assert local(urlsplit(item['item']).path).is_file()
    for tag, a in page.attrs:
        if tag == 'a' and a.get('target') == '_blank': assert 'noopener' in a.get('rel', '').split()
        for key in ['href', 'src', 'srcset']:
            value = a.get(key, '')
            if not value or ',' in value or value.startswith(('#', 'data:', 'mailto:', 'tel:')): continue
            u = urlsplit(value)
            if u.scheme or u.netloc: continue
            assert local(u.path).is_file(), (p.name, key, value)
            if u.fragment and tag == 'a':
                target = read(local(u.path)) if local(u.path).suffix == '.html' else ''
                assert re.search(r'\bid="' + re.escape(u.fragment) + '"', target), (p.name, value)
        if tag in ['link', 'script']:
            value = a.get('href') or a.get('src', '')
            if re.search(r'/assets/(?:css/(?:site|estrutura)\.css|js/(?:site|config)\.js)', value):
                assert '?v=20261006&rev=3' in value, (p.name, value)
    rows.append({'page': p.name, 'title': title, 'canonical': canonical, 'structuredTypes': [n['@type'] for n in graph]})

ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'i': 'http://www.google.com/schemas/sitemap-image/1.1'}
sitemap = ET.parse(PUB / 'sitemap.xml')
urls = [n.text for n in sitemap.findall('s:url/s:loc', ns)]
assert len(urls) == len(set(urls)) == 11
assert set(urls) == canonicals
assert all(local(urlsplit(u).path).is_file() for u in urls)
assert all(local(urlsplit(n.text).path).is_file() for n in sitemap.findall('s:url/i:image/i:loc', ns))
assert 'Sitemap: ' + ORIGIN + '/sitemap.xml' in read(PUB / 'robots.txt')
assert not re.search(r'Disallow:\s*/\s*$', read(PUB / 'robots.txt'), re.M)
hub = read(PUB / 'informacoes.html'); catalog = hub[hub.index('id="outros-assuntos"'):]
assert catalog.count('class="cartao assunto-cartao"') == 9
assert '/fim-escala-6x1' in catalog and '/novo-limite-mei' in catalog
assert 'substitui o PIS, a Cofins e o IPI' not in hub
assert 'R$ 81 mil' in read(PUB / 'novo-limite-mei.html')
assert 'ainda não é uma regra em vigor' in read(PUB / 'fim-escala-6x1.html')
for name in ['fim-escala-6x1', 'novo-limite-mei']:
    s = read(PUB / (name + '.html')); assert 'Fontes oficiais' in s and '2026-10-06' in s
    assert ORIGIN + '/' + name in read(PUB / 'llms.txt')

rio = lambda s: re.search(r'<section\b[^>]*\bid="rio"[^>]*>.*?</section>', s, re.S)[0]
assert rio(read(PUB / 'index.html')) == rio(original('index.html'))
css = read(PUB / 'assets/css/site.css'); before_css = original('assets/css/site.css')
for line in before_css.splitlines():
    if re.search(r'\.rio-|\.janela-|--rio|--sol|--lua|--agua|--ceu', line): assert line in css
assert read(PUB / 'assets/css/estrutura.css') == original('assets/css/estrutura.css')
assert read(PUB / 'assets/js/libras.js') == original('assets/js/libras.js')
assert read(PUB / 'assets/js/config.js') == original('assets/js/config.js')
assert read(PUB / '_headers') == original('_headers')
assert read(PUB / 'assets/js/site.js').split('/* WhatsApp')[0] == original('assets/js/site.js').split('/* WhatsApp')[0]
assert read(PUB / 'index.html').split('<body')[1] == original('index.html').split('<body')[1].replace('rev=2', 'rev=3')
images = json.loads(read(OUT / 'fontes-fotos.json'))
old = json.loads(read(ROOT / 'docs/evidencias/2026-10-06/avaliacoes-fotos/fontes-fotos-cc0.json'))
old_hashes = set(re.findall(r'[a-f0-9]{64}', json.dumps(old)))
assert len({p['originalSha256'] for p in images}) == 4
assert not any(p['originalSha256'] in old_hashes for p in images)
result = {'base': BASE, 'pages': rows, 'sitemapURLs': urls, 'rioIdentical': True, 'rioSha256': hashlib.sha256(rio(read(PUB / 'index.html')).encode()).hexdigest(), 'headersUnchanged': True, 'newOriginalPhotos': len(images), 'passed': True}
(OUT / 'seo-estatico.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'passed': True, 'indexablePages': len(rows), 'sitemapURLs': len(urls), 'rioIdentical': True, 'newOriginalPhotos': len(images)}))
