"""Converte as imagens geradas para WebP; não altera seu conteúdo semântico."""
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

raiz = Path(__file__).resolve().parents[2]
manifesto = raiz / 'docs/evidencias/2026-10-04/imagens-geradas.json'
dados = json.loads(manifesto.read_text(encoding='utf-8'))
miniaturas = []
for item in dados['assets']:
    origem = Path(item['original'])
    imagem = Image.open(origem).convert('RGB')
    tamanho = (1200, 630) if item['name'].startswith('og-') else (1200, 900)
    final = ImageOps.fit(imagem, tamanho, method=Image.Resampling.LANCZOS)
    destino = raiz / item['output']
    destino.parent.mkdir(parents=True, exist_ok=True)
    for qualidade in (86, 82, 78, 74, 70):
        final.save(destino, 'WEBP', quality=qualidade, method=6)
        if destino.stat().st_size < 300_000:
            break
    assert destino.stat().st_size < 300_000, destino
    item['largura'], item['altura'] = tamanho
    item['bytes'] = destino.stat().st_size
    miniaturas.append((item['name'], ImageOps.fit(final, (300, 225))))
    print(f"{item['output']}: {item['bytes']} bytes")

# Folha de contato apenas para inspeção dos arquivos, fora da pasta publicada.
folha = Image.new('RGB', (1200, 260 * ((len(miniaturas) + 3) // 4)), '#E3F4F2')
desenho = ImageDraw.Draw(folha)
for indice, (nome, miniatura) in enumerate(miniaturas):
    x, y = (indice % 4) * 300, (indice // 4) * 260
    folha.paste(miniatura, (x, y))
    desenho.text((x + 8, y + 233), nome, fill='#003F4A')
folha.save(raiz / 'docs/evidencias/2026-10-04/contato-imagens-geradas.jpg', quality=90)
manifesto.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
