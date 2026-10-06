"""Gera as versões menores das imagens do site para o celular (desempenho).

Ferramenta de manutenção; não faz parte da execução do site. Requer Pillow.
Uso, a partir de 02-site:  py docs/testes/gerar-variantes-imagens.py

- Fotos de cards, capas e página 404 (1200x900): cria NOME-480.webp e NOME-720.webp ao lado do original.
  O HTML e o site.js escolhem entre 480w, 720w e o original de 1200w com srcset/sizes.
- Logos e glifo do WhatsApp: cria uma versão do tamanho realmente exibido (com folga para telas 3x).
Ao incluir uma foto nova de card/capa, rode este script e use as três larguras no srcset.
"""
from pathlib import Path
from PIL import Image

raiz = Path(__file__).resolve().parents[2]
img = raiz / 'publicar/assets/img'
PREFIXOS = ('servico-', 'assunto-', 'capa-', 'pagina-nao-encontrada-')
LARGURAS = (480, 720)


def salvar(imagem, destino, qualidade, **extra):
    destino.parent.mkdir(parents=True, exist_ok=True)
    imagem.save(destino, 'WEBP', quality=qualidade, method=6, **extra)
    return destino.stat().st_size


resumo = []
for origem in sorted((img / 'fotos').glob('*.webp')):
    if not origem.name.startswith(PREFIXOS) or origem.stem.endswith(('-480', '-720')):
        continue
    base = Image.open(origem).convert('RGB')
    for largura in LARGURAS:
        altura = round(base.height * largura / base.width)
        menor = base.resize((largura, altura), Image.Resampling.LANCZOS)
        destino = origem.with_name(f'{origem.stem}-{largura}.webp')
        tamanho = salvar(menor, destino, 80)
        resumo.append((destino.name, tamanho))

# Logos: o cabeçalho mostra 135 a 159 px e o rodapé 261 px; telas 2x e 3x pedem 480 e 600 px.
for nome, largura in (('logo-gescomp-negativa-compacta', 480), ('logo-gescomp-negativa', 600)):
    origem = Image.open(img / 'logo' / f'{nome}.webp').convert('RGBA')
    menor = origem.resize((largura, round(origem.height * largura / origem.width)), Image.Resampling.LANCZOS)
    destino = img / 'logo' / f'{nome}-{largura}.webp'
    resumo.append((destino.name, salvar(menor, destino, 90, alpha_quality=100)))

# Glifo do WhatsApp: no máximo 38 px na tela; 128 px cobre telas 3x.
glifo = Image.open(img / 'whatsapp-glifo.webp').convert('RGBA')
menor = glifo.resize((128, round(glifo.height * 128 / glifo.width)), Image.Resampling.LANCZOS)
resumo.append(('whatsapp-glifo-128.webp', salvar(menor, img / 'whatsapp-glifo-128.webp', 90, alpha_quality=100)))

for nome, tamanho in resumo:
    print(f'{nome}: {tamanho} bytes')
print(f'{len(resumo)} arquivos, {sum(t for _, t in resumo)} bytes no total')
