"""Verifica o escopo da correção mobile contra o commit anterior."""
from pathlib import Path
import re
import subprocess
import json

root = Path(__file__).resolve().parents[2]
pub = root / 'publicar'
def before(path):
    return subprocess.check_output(['git', 'show', '5d0f72e:publicar/' + path], cwd=root).decode('utf-8').replace('\r\n', '\n')
def read(path):
    return (pub / path).read_text(encoding='utf-8')
for page in pub.glob('*.html'):
    assert read(page.name) == before(page.name).replace('?v=20261006&amp;rev=3', '?v=20261006&amp;rev=4'), page.name
css = read('assets/css/site.css')
old_rule = '@media (max-width:779px){#instagram .carrossel-seta'
new_rule = '@media (max-width:779px),(hover:none) and (pointer:coarse){#instagram .carrossel-seta'
assert css == before('assets/css/site.css').replace(old_rule, new_rule)
assert read('assets/js/site.js').split('/* WhatsApp')[0] == before('assets/js/site.js').split('/* WhatsApp')[0]
assert read('assets/js/config.js') == before('assets/js/config.js')
assert read('assets/js/libras.js') == before('assets/js/libras.js')
rio = lambda s: re.search(r'<section\b[^>]*\bid="rio"[^>]*>.*?</section>', s, re.S)[0]
assert rio(read('index.html')) == rio(before('index.html'))
print(json.dumps({'scopeVerified': True, 'rioUnchanged': True, 'pagesWithOnlyCacheChanged': len(list(pub.glob('*.html')))}))
