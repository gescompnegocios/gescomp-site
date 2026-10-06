"""Compara capturas da cena estabilizada; não altera arquivos publicados."""
from pathlib import Path
import json
import sys
from PIL import Image, ImageChops

folder = Path(__file__).resolve().parents[1] / 'evidencias/2026-10-06/seo-informacoes'
rows = []
prefix = 'rio' if '--transicao' in sys.argv else 'rio-estavel'
for width in [1366, 360]:
    for theme in ['light', 'dark']:
        before = Image.open(folder / f'{prefix}-antes-{theme}-{width}.png').convert('RGB')
        after = Image.open(folder / f'{prefix}-depois-{theme}-{width}.png').convert('RGB')
        assert before.size == after.size
        diff = ImageChops.difference(before, after)
        pixels = list(diff.get_flattened_data())
        rows.append({'width': width, 'theme': theme, 'size': before.size,
                     'pixelsDifferent': sum(any(v for v in p) for p in pixels),
                     'maxChannelDelta': max(max(p) for p in pixels),
                     'identical': diff.getbbox() is None})
result = {'cases': rows, 'identical': all(r['identical'] for r in rows)}
name = 'rio-transicao-comparacao.json' if '--transicao' in sys.argv else 'rio-comparacao.json'
(folder / name).write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result))
