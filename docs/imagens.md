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

- Usar apenas fotos reais fornecidas e aprovadas pela Gabriela. Confirmar o uso das imagens de outras pessoas retratadas; não usar pessoas de banco de imagens.
- Recortar nas proporções da tabela sem distorcer. Preservar rosto e mãos na área central para o recorte no celular.
- Definir `width`, `height` e texto alternativo descritivo no HTML. Imagens abaixo da abertura podem usar `loading="lazy"` e `decoding="async"`.
- Enquanto não houver o retrato, usar a ilustração atual do gráfico na abertura. Nos cards, usar arte de espera com cor da marca, ícone de linha e onda sutil. Sem textos de espaço reservado.
- Foto ausente ou erro de carregamento mantém a arte de espera; não há ícone de imagem quebrada. O body usa `data-foto` e `data-foto-alt`; o JavaScript só busca arquivos liberados na lista `fotos` do `config.js`.
- Fotografias e artes de espera não podem alterar a seção `#rio`.
- Ao substituir uma imagem publicada, mudar o nome (por exemplo, `gabriela-retrato-v2.webp`) no arquivo, em `data-foto` e em `config.fotos` para evitar cache antigo. A lista aceita caminhos WebP locais sem parâmetros na URL.

Os arquivos ainda precisam ser selecionados, otimizados e entregues nesses nomes. Nenhuma foto foi criada ou inventada na etapa 1.
