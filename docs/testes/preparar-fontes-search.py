"""Copia os mesmos WOFF2 do CSS original do Google, com as licenças OFL.

Ferramenta pontual desta revisão; não faz parte da execução do site.
"""
from pathlib import Path
import hashlib
import json
import re
import urllib.request

root = Path(__file__).resolve().parents[2]
evidencias = root / 'docs/evidencias/2026-10-06/publicacao-search'
css_original = (evidencias / 'google-fonts-original.css').read_text(encoding='utf-8')
fontes = root / 'publicar/assets/fonts'
fontes.mkdir(exist_ok=True)
urls = list(dict.fromkeys(re.findall(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', css_original)))
nomes = ['bricolage-v9-vietnamese.woff2', 'bricolage-v9-latin-ext.woff2',
         'bricolage-v9-latin.woff2', 'figtree-v9-latin-ext.woff2', 'figtree-v9-latin.woff2']
assert len(urls) == len(nomes) == 5
manifesto = []
css_local = css_original
for url, nome in zip(urls, nomes):
    with urllib.request.urlopen(url, timeout=30) as resposta:
        dados = resposta.read()
    assert dados[:4] == b'wOF2', nome
    destino = fontes / nome
    if destino.exists():
        assert destino.read_bytes() == dados, 'Arquivo preexistente diferente: ' + nome
    else:
        destino.write_bytes(dados)
    manifesto.append({'arquivo': str(destino.relative_to(root)).replace('\\', '/'),
                       'fonte': url, 'bytes': len(dados), 'sha256': hashlib.sha256(dados).hexdigest()})
    css_local = css_local.replace(url, '/assets/fonts/' + nome)
for familia, nome in [('bricolagegrotesque', 'bricolage-OFL.txt'), ('figtree', 'figtree-OFL.txt')]:
    url = 'https://raw.githubusercontent.com/google/fonts/main/ofl/' + familia + '/OFL.txt'
    with urllib.request.urlopen(url, timeout=30) as resposta:
        dados = resposta.read()
    assert b'SIL OPEN FONT LICENSE' in dados
    (fontes / nome).write_bytes(dados)
    manifesto.append({'arquivo': 'publicar/assets/fonts/' + nome, 'fonte': url,
                       'bytes': len(dados), 'sha256': hashlib.sha256(dados).hexdigest()})
(root / 'publicar/assets/css/fontes.css').write_text(css_local, encoding='utf-8', newline='\n')
(evidencias / 'fontes-locais.json').write_text(json.dumps(manifesto, indent=2), encoding='utf-8')
print(json.dumps({'woff2': len(urls), 'bytes': sum(x['bytes'] for x in manifesto[:5]),
                  'licencas': 2, 'css': 'publicar/assets/css/fontes.css'}))
