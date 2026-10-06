"""Atualiza somente head, preço estruturado aprovado e revisão dos assets."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
links = '''<link rel="preload" as="font" href="/assets/fonts/bricolage-v9-latin.woff2" type="font/woff2" crossorigin>
<link rel="preload" as="font" href="/assets/fonts/figtree-v9-latin.woff2" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fontes.css?v=20261006&amp;rev=5">'''
alterados = []
for path in sorted((root / 'publicar').glob('*.html')):
    texto = path.read_text(encoding='utf-8')
    atualizado, ocorrencias = re.subn(
        r'<link rel="preconnect" href="https://fonts.googleapis.com">\s*'
        r'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\s*'
        r'<link href="https://fonts.googleapis.com/[^"\n]+" rel="stylesheet">', links, texto)
    assert ocorrencias == 1, path.name
    atualizado = atualizado.replace('?v=20261006&rev=4', '?v=20261006&rev=5')
    atualizado = atualizado.replace('?v=20261006&amp;rev=4', '?v=20261006&amp;rev=5')
    if path.name == 'index.html':
        assert atualizado.count('   "telephone": "+55-79-98877-1430",') == 1
        atualizado = atualizado.replace('   "telephone": "+55-79-98877-1430",',
            '   "priceRange": "Contabilidade: a partir de R$ 150/mês; IR e cálculos: a partir de R$ 100",\n'
            '   "telephone": "+55-79-98877-1430",')
    path.write_text(atualizado, encoding='utf-8', newline='\n')
    alterados.append(path.name)
print('Atualizadas ' + str(len(alterados)) + ' paginas: ' + ', '.join(alterados))
