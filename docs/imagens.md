# Imagens para o site

Todos os arquivos finais ficam em `publicar/assets/img/fotos/`, em **WebP e abaixo de 300 KB por arquivo**. Os caminhos usados no HTML começam em `/assets/img/fotos/`. Guardar os originais fora de `publicar/`.

| Nome | Proporção | Tamanho mínimo | Onde aparece |
|---|---|---|---|
| `gabriela-retrato.webp` | 4:5 | 1200 × 1500 px | Abertura, com moldura orgânica e traço laranja |
| `gabriela-sobre.webp` | 4:5 | 1200 × 1500 px | Quem é a Gabriela |
| `escritorio.webp` | 16:10 | 1600 × 1000 px | Escritório/contato, quando houver espaço aprovado no layout |
| `card-abrir-empresa.webp` | 4:3 | 1200 × 900 px | Card Abrir minha empresa |
| `card-contabilidade.webp` | 4:3 | 1200 × 900 px | Card Contabilidade para minha empresa |
| `card-imposto-de-renda.webp` | 4:3 | 1200 × 900 px | Card Fazer meu Imposto de Renda |

## Entrega e uso

- Os retratos da Gabriela e a foto do escritório dependem de arquivos reais fornecidos por ela. Não gerar retratos, equipe ou clientes. Nos cards, capas, 404 e compartilhamento, o usuário autorizou imagens geradas sem pessoas, textos ou logos falsos.
- Recortar nas proporções da tabela sem distorcer. Preservar rosto e mãos na área central para o recorte no celular.
- Definir `width`, `height` e texto alternativo descritivo no HTML. Imagens abaixo da abertura podem usar `loading="lazy"` e `decoding="async"`.
- Enquanto não houver o retrato, usar a ilustração atual do gráfico na abertura. Nos cards, usar arte de espera com cor da marca, ícone de linha e onda sutil. Sem textos de espaço reservado.
- Foto ausente ou erro de carregamento mantém a arte de espera; não há ícone de imagem quebrada. O body usa `data-foto` e `data-foto-alt`; o JavaScript só busca arquivos liberados na lista `fotos` do `config.js`.
- Fotografias e artes de espera não podem alterar a seção `#rio`.
- Ao substituir uma imagem publicada, mudar o nome (por exemplo, `gabriela-retrato-v2.webp`) no arquivo, em `data-foto` e em `config.fotos` para evitar cache antigo. A lista aceita caminhos WebP locais sem parâmetros na URL.

Os retratos e a foto real do escritório ainda precisam ser entregues. Os três cards agora usam imagens fotográficas geradas com objetos genéricos, sem representar o escritório ou pessoas reais da GESCOMP.

## Imagens geradas em 04/10/2026

- **Cards:** três composições fotográficas de mesa, papelaria e calculadora, em `assets/img/fotos/card-*.webp`, 1200 × 900 px. Mesma luz e paleta entre os três.
- **Capas:** oito colagens de papel e objetos, em `assets/img/capas/capa-*.webp`, 1200 × 900 px. Usadas na abertura das oito páginas de Informações; as sete capas de assuntos também aparecem na listagem.
- **404:** `assets/img/rio-404.webp`, 1200 × 900 px, ilustração nova inspirada no estilo do rio. Nenhuma mudança em `#rio`.
- **Compartilhamento:** `assets/img/og-composicao-20261004.webp`, 1200 × 630 px. Composição gráfica sem texto ou logo; novo nome evita cache da imagem anterior.
- Todos os 13 arquivos têm menos de 300 KB. Gerados com a ferramenta integrada `imagegen`; Pillow foi usado somente para recorte, tamanho, conversão WebP e uma folha de contato para inspeção.
- Prompts completos, arquivos de origem e medidas: [imagens-geradas.json](evidencias/2026-10-04/imagens-geradas.json). [Folha de contato](evidencias/2026-10-04/contato-imagens-geradas.jpg).

A abertura voltou ao gráfico largo anterior enquanto o retrato não chega. Quando a foto real carregar, a moldura orgânica substitui esse gráfico automaticamente.
