"""Compara o rio ao commit anterior e as capturas controladas desta rodada."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
from PIL import Image, ImageChops

raiz = Path(__file__).resolve().parents[2]
base = 'c390783'
antes = subprocess.check_output(['git', 'show', base + ':publicar/index.html'], cwd=raiz).decode('utf-8')
depois = (raiz / 'publicar/index.html').read_text(encoding='utf-8')
rio = lambda html: re.search(r'<section id="rio"[\s\S]*?</section>', html).group(0).replace('\r\n', '\n')
assert rio(antes) == rio(depois), 'HTML do rio mudou nesta rodada'
css_antes = subprocess.check_output(['git', 'show', base + ':publicar/assets/css/site.css'], cwd=raiz).decode('utf-8')
css_depois = (raiz / 'publicar/assets/css/site.css').read_text(encoding='utf-8')
regras = lambda css: [linha for linha in css.splitlines() if re.search(r'\.rio-|\.janela-', linha)]
assert regras(css_antes) == regras(css_depois), 'CSS da cena mudou nesta rodada'
dir = raiz / 'docs/evidencias/2026-10-04'
resultado = {'base': base, 'htmlIdentico': True, 'cssDaCenaIdentico': True, 'rioSha256': hashlib.sha256(rio(depois).encode()).hexdigest(), 'pares': []}
for largura in (1366, 1920, 390, 360):
    for tema in ('light', 'dark'):
        a = Image.open(dir / f'rio-imagens-antes-{tema}-{largura}.png').convert('RGB')
        b = Image.open(dir / f'rio-imagens-depois-{tema}-{largura}.png').convert('RGB')
        assert a.size == b.size
        delta = ImageChops.difference(a, b)
        ler_pixels = getattr(delta, 'get_flattened_data', delta.getdata)
        pixels = sum(1 for p in ler_pixels() if p != (0, 0, 0))
        resultado['pares'].append({'largura': largura, 'tema': tema, 'tamanho': a.size, 'pixelsDiferentes': pixels, 'fracao': pixels / (a.width * a.height), 'areaDiferente': delta.getbbox()})
        # A fonte é idêntica; registrar separadamente o eventual ruído dos filtros SVG.
        assert pixels / (a.width * a.height) < .001, 'Diferença visual material no rio'
(dir / 'rio-imagens-comparacao.json').write_text(json.dumps(resultado, indent=2) + '\n', encoding='utf-8')
print(json.dumps(resultado))
