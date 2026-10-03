# 02 – Site

```
02-site/
├── publicar/     ← arquivos servidos pela hospedagem do site
├── conteudo/     ← textos de cada página, para revisão
├── design/       ← cópia dos arquivos do canvas
└── docs/         ← pendências, roteiro de atualização e decisões
```

## Hospedagem atual e domínio

O site está no Worker `gescomp-site`, em `https://gescomp-site.gescompnegocios.workers.dev`. O domínio final é **gescompnegocios.com.br**, comprado no Registro.br e ainda aguardando conexão à Cloudflare.

Os endereços oficiais nos arquivos usam o endereço ativo do Worker até o domínio final funcionar com HTTPS. Veja o passo 1 de `docs/roteiro-de-atualizacao.md` para conectar o domínio ao Worker e depois atualizar esses endereços.

## Como publicar no Cloudflare Pages (alternativa)

**Opção 1 – Envio direto (mais simples)**
1. Entre em https://dash.cloudflare.com → Workers & Pages → Create → aba Pages → Upload assets.
2. Dê o nome `gescomp` ao projeto e envie a pasta `publicar` (ou um ZIP com o conteúdo dela).
3. O site fica no ar em `gescomp.pages.dev`. Para atualizar, crie uma nova implantação (Create deployment) com a pasta nova.

**Opção 2 – Pelo GitHub**
1. Coloque **apenas** o conteúdo de `02-site` em um repositório **privado** (nunca suba a pasta `01-empresa`).
2. No Cloudflare: Create → Pages → Connect to Git.
3. Build command: deixe em branco. Build output directory: `publicar`.

**Domínio:** veja o passo 1 de `docs/roteiro-de-atualizacao.md`.

## Como executar localmente

No terminal, a partir da pasta raiz `GESCOMP`, execute `npx.cmd wrangler pages dev ./02-site/publicar` (Windows). Nos demais sistemas, use `npx wrangler pages dev ./02-site/publicar`.

Abra o endereço informado no terminal, normalmente `http://localhost:8788`. Encerre com `Ctrl + C`. O projeto não precisa de uma etapa de build.

## Como funciona
- **Endereços sem `.html`:** o Cloudflare Pages mostra as páginas como `/mei`, `/informacoes` etc. Links, mapa do site e endereços oficiais já estão nesse formato.
- **WhatsApp e formulário:** já configurados em `publicar/assets/js/config.js` com (79) 98877-1430 e escritoriogescomp@gmail.com. Para trocar, edite esse arquivo.
- **Visual:** regras de tema, animações e responsividade em `publicar/assets/css/site.css`; estilos comuns do cabeçalho e rodapé em `publicar/assets/css/estrutura.css`. Estilos específicos e ilustrações também usam atributos `style` nos HTMLs. O JavaScript compartilhado está em `publicar/assets/js/site.js`.
- **Cabeçalhos e cache:** `publicar/_headers` define segurança, cache de 7 dias para imagens e ícones em `/assets/` e revalidação a cada visita para `/assets/js/` e `/assets/css/`. Assim, uma correção no JavaScript ou no CSS chega na hora a quem já visitou o site. Ao trocar uma imagem, use um nome de arquivo novo.
- **Versão dos arquivos (evita cache antigo):** todas as páginas carregam `assets/css/site.css`, `assets/css/estrutura.css`, `assets/js/config.js` e `assets/js/site.js` com `?v=AAAAMMDD` no fim (hoje: `?v=20261003`). **Esse número deve mudar a cada atualização desses arquivos**, inclusive quando só o `config.js` mudar (mensagens, vídeos, avaliações). Use a data do dia da publicação; se publicar mais de uma vez no mesmo dia, acrescente uma letra (`20261003b`). Troque em todos os `.html` de uma vez. No terminal, dentro de `publicar/`: `sed -i "s/?v=20261003/?v=AAAAMMDD/g" *.html`, com a data nova no lugar de AAAAMMDD. Sem isso, quem já visitou o site pode continuar vendo a versão anterior.
- **"Reduzir movimento":** se o aparelho estiver com as animações desligadas (no Windows: Configurações → Acessibilidade → Efeitos visuais → Efeitos de animação), o site respeita a escolha. Os números de Resultados aparecem prontos, sem contar, e o carrossel não passa sozinho. Para ver as animações ao testar, ligue esse efeito.
- **Página de erro:** `publicar/404.html` é usada automaticamente.
- **SEO:** título, descrição e dados estruturados em cada página; `sitemap.xml`, `robots.txt` (liberado para Google, Bing e robôs de IA) e `llms.txt`.


## Vídeos do Instagram (carrossel)
- Os links ficam em `publicar/assets/js/config.js`, na lista `instagramReels`. Para incluir um vídeo, cole o link (pode ser do jeito que o Instagram copia, com `?stkn=...`), salve e publique de novo. Para tirar, apague a linha.
- Os posts precisam ser **públicos**.
- **Vídeo próprio:** a lista também aceita arquivos `.mp4` ou `.webm`. Coloque o arquivo em `publicar/assets/videos/` e cole o caminho na lista (ex.: `'/assets/videos/apresentacao.mp4'`). Ele aparece com os controles do navegador, sem tocar sozinho. Prefira arquivos leves (até uns 10 MB).
- **Carregamento:** os vídeos aparecem prontos no site, sem precisar tocar para carregar. O `embed.js` do Instagram e os vídeos só são buscados quando a seção chega perto da tela (cerca de 400 px antes). Enquanto carregam, aparece a capa pintada. Se o Instagram demorar mais de 20 s, a capa vira um link provisório para abrir o vídeo no Instagram, e o vídeo substitui a capa sozinho assim que terminar de carregar. Se o `embed.js` não carregar (bloqueado ou fora do ar), as capas ficam como link. Sem JavaScript, aparecem as capas com link para cada Reel.
- **Privacidade:** como os embeds carregam sozinhos, o navegador de quem rola até essa seção se conecta à Meta (Instagram) em toda visita. Cite isso numa futura política de privacidade do site.
- **Passagem automática:** um vídeo a cada 8 segundos, com rolagem suave, voltando ao início no fim. Todos os vídeos começam pausados. A passagem para enquanto o mouse está sobre o carrossel, enquanto há foco de teclado dentro dele, com a aba em segundo plano e para quem ativou "reduzir movimento" no aparelho (aí também não há rolagem suave).
- **Parar ao assistir:**
  - *Vídeo próprio:* o carrossel para no "play" e volta cerca de 3 s depois do "pause" ou do fim do vídeo. Se o vídeo sair da área visível do carrossel, ele é pausado.
  - *Instagram:* o embed é um iframe de outro domínio, então o site não consegue saber se o vídeo está tocando ou pausado. O site deduz: quando a pessoa clica ou toca dentro do vídeo, o foco vai para o iframe e o carrossel para. Ele volta cerca de 3 s depois de a pessoa clicar ou tocar fora, tirar o mouse do carrossel, usar as setas ou o vídeo sair da tela. Se a pessoa pausar o Reel pelo próprio botão do Instagram e continuar com o mouse parado em cima, o carrossel continua parado até ela sair dali.
- **Controles:** setas redondas lisas (petróleo, ícone branco) nas laterais, no meio da altura do carrossel (52 px no computador, 44 px no celular). Também funcionam as teclas ← e → com a lista de vídeos focada. As setas somem quando há um único vídeo ou quando todos cabem na tela.

## Cards de serviços (WhatsApp)
- A seção **Serviços** da página inicial tem 6 cards: Abrir meu CNPJ; Contabilidade para a minha empresa; Imposto de Renda; Cálculos trabalhistas; Qual o melhor regime de impostos?; Sou MEI. É hora de mudar?
- Títulos, textos e preços ficam no `publicar/index.html` (o Google lê esse conteúdo). Os preços também estão nas ofertas dos dados estruturados (`application/ld+json`) da mesma página: se mudar um preço, mude nos dois lugares.
- **Mensagens do WhatsApp:** ficam em `publicar/assets/js/config.js`, no objeto `mensagensWhatsApp`. Cada card aponta para a sua mensagem pelo atributo `data-whatsapp-msg` (`abrirCnpj`, `contabilidade`, `impostoDeRenda`, `calculosTrabalhistas`, `regimeDeImpostos`, `mei`). Para mudar o texto, troque só o que está entre aspas. Se um nome não existir, o card usa a `mensagemPadrao`.
- O botão abre o WhatsApp do número configurado em `config.js`, em nova aba, com a mensagem pronta. Sem JavaScript, leva ao formulário de contato.

## Avaliações de clientes
- Seção **"O que dizem nossos clientes"**, logo depois de Resultados. **Fica escondida enquanto não houver avaliações** na configuração.
- Tudo é preenchido em `publicar/assets/js/config.js`, no objeto `avaliacoes`:
  - `linkAvaliar`: link do Google para deixar avaliação (no Perfil da Empresa no Google: "Pedir avaliações"; formato `https://g.page/r/CODIGO/review`). Vazio = o botão "Avaliar a GESCOMP no Google" não aparece.
  - `linkVerTodas`: link que abre as avaliações no Google (por exemplo, o perfil no Google Maps). Vazio = o botão "Ver todas as avaliações no Google" não aparece.
  - `nota` e `total`: como aparecem no Google (ex.: `nota: 4.9, total: 37`). O resumo "Nota 4,9 no Google, 37 avaliações" só aparece com os dois preenchidos.
  - `itens`: as avaliações escolhidas, uma por bloco: `{ nome: "Maria Souza", texto: "...", estrelas: 5 },`. No site aparece só o primeiro nome e a inicial do último sobrenome ("Maria S."), sem foto, com as estrelas e o texto acessível "5 de 5 estrelas".
- Use o texto original da avaliação, com a autorização do cliente. Não ofereça desconto, brinde ou qualquer vantagem em troca de avaliação: o Google proíbe.
- As avaliações **não** entram nos dados estruturados (`AggregateRating`/`Review`): o Google ignora avaliações que a empresa publica sobre si mesma.
- O carrossel funciona como o dos vídeos: um card a cada 8 segundos, para com mouse, foco de teclado, toque e "reduzir movimento"; setas nas laterais e teclas ← e →. Os dois carrosséis usam a mesma função `criarCarrossel` em `publicar/assets/js/site.js`.

## Visual (nível sóbrio)
- **Página inicial ("nível 2"):** botões retangulares com cantos arredondados (12 px), cards com borda fina e sombra suave, ícones em quadrados arredondados de cor sólida, formulário em cartão branco com campos retos e cabeçalho com botões redondos lisos. Laranja só em botões de ação e sublinhados.
- **Continua desenhado:** sublinhado de pincel do título da abertura e do formulário, ilustração da abertura (com pincel mais suave), moldura da foto no Sobre, três ondas (fim da abertura, entrada do rio e topo do rodapé), botão flutuante do WhatsApp e **toda a seção do Rio Sergipe, intacta**.
- **Páginas de Informações ("nível 3"):** só o sublinhado do título e a onda do fim da abertura ficam desenhados; linha do tempo, cards, tabelas, perguntas frequentes e botões ficam limpos.
- As classes dos componentes limpos (`btn`, `cartao`, `icone-solido`, `etiqueta`, `campo`, `servico-card`, `avaliacao-card`, `carrossel-seta`) estão em `publicar/assets/css/site.css`; cabeçalho e rodapé em `publicar/assets/css/estrutura.css`. Os filtros de pincel mais leves das partes mantidas são `pincelSuave` e `pincelMedio`, definidos em cada página (os filtros antigos continuam só para o rio).

## Libras (VLibras)
- O tradutor de Libras do Governo Federal está nas nove páginas principais (botão no lado direito da tela, logo acima do WhatsApp).
- É carregado de `vlibras.gov.br`; se o serviço do governo estiver fora do ar, o botão não aparece, mas o resto do site funciona normalmente.
- `publicar/assets/js/libras.js` posiciona o botão oficial no lado direito, logo acima do botão do WhatsApp e alinhado com ele, respeitando a área segura do aparelho e preservando a abertura e o fechamento do widget. Assim ele fica sempre visível, não cobre texto e fica longe do meio da tela, onde estão as setas do carrossel. No canto inferior esquerdo ele ficava pequeno, sobre o texto, e passava despercebido.
- Testado em 03/10/2026: abertura/fechamento, tradução de texto no computador e celular e seleção de uma palavra da página, com resposta do serviço oficial e avatar carregado.
- Ele não aparece no canvas de design, só no site publicado.
## Páginas
| Arquivo | Endereço |
|---|---|
| `index.html` | `/` |
| `informacoes.html` | `/informacoes` (reforma tributária e links para os assuntos) |
| `imposto-de-renda.html` | `/imposto-de-renda` |
| `mei.html` | `/mei` |
| `simples-nacional.html` | `/simples-nacional` |
| `abrir-empresa.html` | `/abrir-empresa` |
| `pro-labore-e-lucros.html` | `/pro-labore-e-lucros` |
| `departamento-pessoal.html` | `/departamento-pessoal` |
| `calendario-fiscal.html` | `/calendario-fiscal` |

As páginas de Informações têm conteúdo-base de 01/10/2026. Em 03/10/2026 foram revisados os trechos sobre o ano-teste no Simples e a retenção de dividendos nas páginas Simples Nacional, Pró-labore e lucros e Imposto de Renda. Isso não representa uma nova conferência integral de todas as regras tributárias. Veja `docs/revisao-03-10-2026.md`. Revise todo janeiro e quando houver mudanças legais (veja `docs/roteiro-de-atualizacao.md`).
