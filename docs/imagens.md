# Imagens para o site

Todos os arquivos de foto ficam em publicar/assets/img/fotos/, em **WebP e abaixo de 300 KB por arquivo**. O usuário pediu substituir as imagens geradas por fotos reais da web; a versão atual está descrita em [imagens-reais-fontes.md](imagens-reais-fontes.md), com autores e licenças. Guardar os originais fora de publicar/.

| Nome | Proporção | Tamanho mínimo | Onde aparece |
|---|---|---|---|
| `gabriela-retrato.webp` | 4:5 | 1200 × 1500 px | Abertura somente no computador, com moldura orgânica e sem selos |
| `gabriela-sobre.webp` | 4:5 | 1200 × 1500 px | Quem é a Gabriela |
| `escritorio.webp` | 16:10 | 1600 × 1000 px | Escritório/contato, quando houver espaço aprovado no layout |
| `empresa-real-20261004.webp` | 4:3 | 1200 × 900 px | Card Abrir minha empresa e capa do assunto |
| `contabilidade-real-20261004.webp` | 4:3 | 1200 × 900 px | Card Contabilidade para minha empresa |
| `documentos-reais-20261004.webp` | 4:3 | 1200 × 900 px | Card Fazer meu Imposto de Renda e capa do assunto |

## Entrega e uso

- Os retratos da Gabriela e a foto do escritório dependem de arquivos reais fornecidos por ela. O usuário confirmou que o retrato ainda não chegou. Não gerar retratos, equipe ou clientes. Cards, capas, 404 e compartilhamento usam fotografias reais licenciadas da web, sem pessoas.
- Recortar nas proporções da tabela sem distorcer. Preservar rosto e mãos na área central para o recorte no celular.
- Definir `width`, `height` e texto alternativo descritivo no HTML. Imagens abaixo da abertura podem usar `loading="lazy"` e `decoding="async"`; a moldura de Sobre precisa de `eager`, pois permanece oculta até carregar.
- A abertura está sem gráfico e sem selos. Enquanto não houver o retrato, ocultar o bloco da foto. Mesmo depois de entregue, ele permanece oculto em telas menores que 900px. Os cards mantêm painel de espera somente se uma foto falhar, sem texto de espaço reservado.
- Foto ausente ou erro de carregamento mantém a arte de espera; não há ícone de imagem quebrada. O body usa `data-foto` e `data-foto-alt`; o JavaScript só busca arquivos liberados na lista `fotos` do `config.js`.
- Fotografias e artes de espera não podem alterar a seção `#rio`.
- Ao substituir uma imagem publicada, mudar o nome (por exemplo, `gabriela-retrato-v2.webp`) no arquivo, em `data-foto` e em `config.fotos` para evitar cache antigo. A lista aceita caminhos WebP locais sem parâmetros na URL.

Os retratos e a foto real do escritório ainda precisam ser entregues. As fotografias editoriais usadas nos cards e assuntos não representam instalações, equipe ou clientes da GESCOMP. Oito fotos são reaproveitadas em assuntos compatíveis. Caderno do MEI sem texto legível; calendário recortado abaixo do mês/dias em inglês. Cards/capas têm 1200 × 900 px e compartilhamento 1200 × 630 px, todos abaixo de 300 KB.

## Histórico da versão anterior

O commit 5d4dc81 usava 13 imagens geradas com imagegen. Elas foram substituídas por fotografias reais a pedido posterior do usuário. Os prompts e registros antigos continuam apenas como histórico: [imagens-geradas.json](evidencias/2026-10-04/imagens-geradas.json) e [folha antiga](evidencias/2026-10-04/contato-imagens-geradas.jpg). Não reutilizar essas imagens na versão atual.

As fontes e a [folha de contato atual](evidencias/2026-10-04/contato-fotos-reais.jpg) permitem conferir as oito fotografias. A seção #rio e suas ilustrações originais foram preservadas integralmente.
