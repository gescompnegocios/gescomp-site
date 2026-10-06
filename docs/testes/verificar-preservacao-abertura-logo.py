"""Verifica o escopo desta entrega contra 5953ec4 e as capturas controladas do rio."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
from PIL import Image, ImageChops

raiz = Path(__file__).resolve().parents[2]
base = '5953ec4'
evidencias = raiz / 'docs/evidencias/2026-10-06'

def original(nome):
    return subprocess.check_output(['git', 'show', f'{base}:publicar/{nome}'], cwd=raiz).decode('utf-8').replace('\r\n', '\n')

def atual(nome):
    return (raiz / 'publicar' / nome).read_text(encoding='utf-8')

def limpar_html(html, nome):
    html = re.sub(r'(/assets/(?:css/(?:site|estrutura)\.css|js/(?:config|site)\.js))\?v=[^"\s]+', r'\1?CACHE', html)
    html = re.sub(r'<link rel="preload" as="image" href="/assets/img/(?:logo/)?logo-gescomp[^" ]+" type="image/webp">', '<!-- LOGO PRELOAD -->', html)
    html = re.sub(r'<a\b[^>]*class="gc-(?:cabecalho-marca(?:-mobile)?|rodape-marca)"[^>]*>[\s\S]*?</a>', '<!-- LOGO -->', html)
    if nome == 'index.html':
        html = re.sub(r'<h1 class="abertura-titulo titulo-pagina">.*?</h1>', '<!-- TITULO -->', html)
        html = re.sub(r'<p class="abertura-sub">.*?</p>\n?', '', html)
    if nome == '404.html':
        html = re.sub(r'<header>[\s\S]*?</header>', '<!-- CABECALHO 404 -->', html)
        for linha in ['.gc-cabecalho-marca{display:inline-flex;text-decoration:none}', '.gc-cabecalho-logo{display:block;width:auto;height:40px}', '@media(max-width:779px){.gc-cabecalho-logo{height:34px}}']:
            html = html.replace(linha + '\n', '')
    return re.sub(r'\n+', '\n', html)

paginas = sorted((raiz / 'publicar').glob('*.html'))
cache = []
for pagina in paginas:
    antes, depois = original(pagina.name), atual(pagina.name)
    assert limpar_html(antes, pagina.name) == limpar_html(depois, pagina.name), f'Alteração fora do escopo: {pagina.name}'
    urls = re.findall(r'/assets/(?:css/(?:site|estrutura)\.css|js/(?:config|site)\.js)\?v=([^"\s]+)', depois)
    assert all(v == '20261006' for v in urls), (pagina.name, urls)
    assert len(urls) == (0 if pagina.name == '404.html' else 4)
    cache.append({'pagina': pagina.name, 'links': len(urls), 'versao': '20261006'})

for nome in ['assets/js/site.js', 'assets/js/config.js', 'assets/img/logo-gescomp.webp', 'assets/img/logo-gescomp.png']:
    antes = subprocess.check_output(['git', 'show', f'{base}:publicar/{nome}'], cwd=raiz)
    depois = (raiz / 'publicar' / nome).read_bytes()
    if nome.endswith('.js'):
        antes, depois = antes.replace(b'\r\n', b'\n'), depois.replace(b'\r\n', b'\n')
    assert antes == depois, f'Arquivo protegido mudou: {nome}'

rio = lambda html: re.search(r'<section id="rio"[\s\S]*?</section>', html).group()
assert rio(original('index.html')) == rio(atual('index.html')), 'HTML do rio mudou'

def limpar_css_site(css):
    css = re.sub(r'^\.gc-cabecalho \.gc-cabecalho-logo(?:-mobile)?\{[^\n]+\}\n', '', css, flags=re.M)
    css = re.sub(r'^\.abertura-titulo\{[^\n]+\}\n', '', css, flags=re.M)
    css = re.sub(r'^\.(?:grifo-pincel|abertura-sub strong)\{[^\n]+\}\n', '', css, flags=re.M)
    return css

assert limpar_css_site(original('assets/css/site.css')) == limpar_css_site(atual('assets/css/site.css')), 'CSS fora de logos/H1/grifo mudou'

def limpar_css_estrutura(css):
    # Apenas regras de imagem/link da marca e comentário de altura móvel.
    linhas = []
    for linha in css.splitlines():
        if re.search(r'\.gc-(?:cabecalho|rodape)-(?:logo(?:-mobile)?|marca(?:-mobile)?)\s*\{', linha):
            continue
        if linha.startswith('.gc-cabecalho-marca, .gc-cabecalho-marca-mobile, .gc-rodape-marca'):
            continue
        if linha.startswith('/* Cabeçalho móvel: logo de '):
            continue
        linhas.append(linha)
    return '\n'.join(linhas)

assert limpar_css_estrutura(original('assets/css/estrutura.css')) == limpar_css_estrutura(atual('assets/css/estrutura.css')), 'Estrutura fora das logos mudou'
assert 'mix-blend-mode' not in atual('assets/css/site.css') + atual('assets/css/estrutura.css')

pares = []
for largura in (1366, 1920, 390, 360):
    for tema in ('light', 'dark'):
        a = Image.open(evidencias / f'rio-antes-{tema}-{largura}.png').convert('RGB')
        b = Image.open(evidencias / f'rio-depois-{tema}-{largura}.png').convert('RGB')
        assert a.size == b.size
        delta = ImageChops.difference(a, b)
        ler_pixels = getattr(delta, 'get_flattened_data', delta.getdata)
        pixels = sum(1 for pixel in ler_pixels() if pixel != (0, 0, 0))
        maximo = max(limite[1] for limite in delta.getextrema())
        # O rasterizador pode arredondar cores em 1/255. Registrar o valor real;
        # HTML e CSS acima são comparados literalmente, sem tolerância.
        assert maximo <= 1 and pixels / (a.width * a.height) < .0001, (largura, tema, pixels, maximo)
        pares.append({'largura': largura, 'tema': tema, 'tamanho': a.size, 'pixelsDiferentes': pixels, 'diferencaMaximaPorCanal': maximo})

logos = []
for arquivo in sorted((raiz / 'publicar/assets/img/logo').glob('logo-gescomp-*')):
    fornecido = Path('C:/Users/fabri/Downloads/logos-gescomp') / arquivo.name
    assert arquivo.read_bytes() == fornecido.read_bytes(), f'Logo alterada: {arquivo.name}'
    with Image.open(arquivo) as img:
        assert 'A' in img.getbands() and img.getchannel('A').getextrema() == (0, 255)
        logos.append({'arquivo': arquivo.name, 'tamanho': img.size, 'sha256': hashlib.sha256(arquivo.read_bytes()).hexdigest()})
assert len(logos) == 8
resultado = {'base': base, 'escopoPreservado': True, 'scriptsELogoAnteriorPreservados': True, 'rioHtmlECssIdenticos': True, 'rioSha256': hashlib.sha256(rio(atual('index.html')).encode()).hexdigest(), 'cache': cache, 'logosOriginais': logos, 'rioPixels': pares}
(evidencias / 'preservacao-abertura-logo.json').write_text(json.dumps(resultado, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(json.dumps(resultado, ensure_ascii=False))
