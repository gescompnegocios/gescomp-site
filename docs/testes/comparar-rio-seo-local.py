"""Compara imagens já capturadas; usa Pillow disponível, sem editar nenhuma imagem."""
from pathlib import Path
from PIL import Image, ImageChops
import json

folder=Path(__file__).resolve().parents[1]/'evidencias/2026-10-07/seo-local'
results=[]
for width in (1366,1920,390,360):
    for theme in ('light','dark'):
        a=Image.open(folder/f'controlado-antes-rio-{width}-{theme}.png').convert('RGB')
        b=Image.open(folder/f'controlado-depois-rio-{width}-{theme}.png').convert('RGB')
        equal=a.size==b.size and ImageChops.difference(a,b).getbbox() is None
        results.append({'width':width,'theme':theme,'before':a.size,'after':b.size,'identical':equal})
(folder/'comparacao-rio-controlado.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'cases':len(results),'identical':all(r['identical'] for r in results)}))
assert all(r['identical'] for r in results), 'Há diferenças nas capturas estabilizadas do rio'
