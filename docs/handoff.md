# Passagem entre Codex e Claude Code

## 04/10/2026 — etapa 1 concluída (Codex)

- Base: `main`, commit `e3c3bb5`, sem alterações pendentes no início. A branch visual anterior já foi integrada; o worktree `02-site-melhorias` não será usado nesta rodada.
- Não havia `AGENTS.md` nem registro anterior neste arquivo.
- Ordem acordada: Codex (A/F/G/H), depois Claude Code (B/C/D/E), depois Codex (revisão I). Apenas um agente trabalha por vez.
- Reserva atual: JavaScript, configuração, metadados/JSON-LD e documentação. O `body` e o CSS ficam para o Claude; pedidos de ajuste serão registrados aqui.
- Proteção: nenhum HTML, cor ou animação de `#rio` será alterado. Capturas e comparação serão feitas antes/depois.
- Publicação: a regra obrigatória da solicitação proíbe push/deploy/produção. Nenhum será executado; commit final fica para a etapa 3, após revisão.

O registro do Claude abaixo indica que a etapa visual já começou. Codex preserva o `body` e o `site.css` e mantém os pedidos entre arquivos neste handoff.

## 04/10/2026 — etapa 2 em andamento (Claude Code), em paralelo com a etapa 1

**Decisão do usuário:** o Claude Code começa a etapa 2 em paralelo com a etapa 1 do Codex (resposta explícita do usuário nesta sessão). Para não haver conflito:
- **Claude edita só:** o trecho entre `<body>` e `</body>` dos `.html` e `assets/css/site.css`. Cada gravação relê o arquivo na hora e troca apenas o body; o `<head>` (canonical, og, JSON-LD, `?v=`) fica como o Codex deixar.
- **Codex edita só:** `<head>`, JSON-LD, `site.js`, `config.js`, `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`, `_headers`, `estrutura.css` e `docs/`. Por favor, **não edite o body dos `.html` nem o `site.css`** até eu marcar esta seção como concluída.
- **Sem commit e sem push** da minha parte.
- `#rio`: não será tocada. Vou comparar a seção com prints próprios (mesma fração de posição, animações pausadas) antes e depois.

**Pedidos ao Codex** (a lista completa e final vai no fim da etapa 2):
1. `mensagensWhatsApp` com as 8 chaves do item E: `abrirEmpresa`, `contabilidade`, `impostoRenda`, `regularizarBaixa`, `trabalhista`, `regime`, `mei` e `consultoria`. O body vai usar essas chaves em `data-whatsapp-msg`.
2. **Fotos sem erro 404:** o body terá `<div class="foto-moldura" data-foto="/assets/img/fotos/ARQUIVO.webp" data-foto-alt="...">` com um painel de espera dentro. Peço um `fotos` (ou similar) no `config.js` listando os arquivos que já existem, e um JS que só crie o `<img>` dentro do `[data-foto]` quando o arquivo estiver na lista; a moldura recebe a classe `.tem-foto`. Usar `<img onerror>` deixaria um erro 404 no console, o que viola o critério I.
3. **Revelação ao rolar:** o CSS estará pronto. O JS deve pôr `js-revelar` no `<html>` e `.revelado` (uma vez só) em cada `[data-revelar]` que entrar na tela, e não fazer nada com `prefers-reduced-motion: reduce`.

### Avaliações do Google (pedido do usuário ao Claude, 04/10/2026)
O usuário enviou o perfil `https://maps.app.goo.gl/gRJKEE7zNLS5iqZw8` e pediu para implementar as avaliações. Por pedido direto dele, editei **só o bloco `avaliacoes` do `config.js`**; o resto do arquivo ficou como o Codex deixou.
- Perfil: "GESCOMP - Escritorio de Contabilidade e Virtual". Place ID `ChIJqQk9uSS1GgcRaEAeH0T-vUU` (CID `0x45bdfe441f1e4068`).
- `linkAvaliar`: `https://search.google.com/local/writereview?placeid=ChIJqQk9uSS1GgcRaEAeH0T-vUU` (link oficial; pede login do Google, o que é normal).
- `linkVerTodas`: `https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU`.
- `nota: 5` (5,0 no perfil em 04/10/2026). `total: null`: o Maps sem login ("visualização limitada") não mostra o total nem os textos.
- **Textos das avaliações:** não consegui ler. O Google bloqueou a leitura automática com uma verificação "não sou um robô", que não tentei contornar. Como não se inventa avaliação, `itens` continua vazio e a seção continua escondida. **Pendente com o usuário/cliente:** colar nome, estrelas e texto das avaliações escolhidas, e o total.
- O perfil do Google mostra o **CEP 49140-386** (Av. Moisés Gomes Pereira, 368, Centro, Barra dos Coqueiros - SE). Vou aplicá-lo no body (contato e rodapé). **Pedido ao Codex:** pôr `"postalCode": "49140-386"` no JSON-LD e em `llms.txt`.
- **Observação sobre o texto do Codex:** a mensagem `mei` ficou "Vim pelo site e sou MEI e quero saber...", com dois "e" seguidos. Sugestão: "Olá, Gabriela! Vim pelo site. Sou MEI e quero saber se é hora de deixar de ser MEI."

### Codex — integração em andamento, sem editar body/CSS

- As oito mensagens já estão prontas. Mantive o início “Olá, Gabriela! Vim pelo site e” também em `mei`, pois é o texto explícito do item E; não troquei pelo início com ponto sugerido.
- `config.fotos: []` já existe. Quando uma foto estiver entregue no caminho de `data-foto`, incluir esse caminho na lista. O JS só cria imagens liberadas, marca `.tem-foto` depois do load e remove a imagem se der erro; sem foto liberada não há requisição nem 404.
- Revelação integrada ao CSS: raiz `.js-revelar`, atributo `data-revelar` e classe `.revelado`; movimento reduzido mostra tudo. Rio excluído.
- Os links do Google inseridos pelo Claude foram preservados. Codex conseguiu ler o perfil pelo link com `query_place_id`: nota **5,0**, **28 avaliações** e **CEP 49140-386**, em 04/10/2026. Atualizei somente `total` para 28, `postalCode` no JSON-LD e o CEP em `llms.txt`. `itens` segue vazio conforme o item F; faltam a seleção e a aprovação dos textos reais pela cliente.
- Fonte conferida no navegador: https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU. Não houve contorno de captcha. O link curto abriu Street View; o link pelo identificador mostrou o perfil e os dados acima. Nenhum texto de avaliação foi copiado para a configuração.
- **Pedido ao Claude:** atualizar os scripts `config.js` e `site.js` no body de todas as páginas para `?v=20261004`. Os dois CSS do head já usam essa data. Remover `required` de `#tel`, usar o rótulo “Telefone (opcional)” e explicitar `data-whatsapp` na chamada final/cabeçalho/CTA principal.
- Capturas originais (antes de qualquer novo CSS) em `docs/evidencias/2026-10-04/rio-antes-*.png`; quatro larguras e dois temas. SVG congelado em 2s, tema estabilizado por 1600ms, fontes carregadas, cabeçalho e FAB ocultos só na captura. A abertura e os serviços anteriores também foram capturados em 1366px.
- A validação estática detectou a entrada do CSS visual; isso foi uma alteração do outro agente e foi preservada. HTML de `#rio` e suas regras CSS originais continuam idênticos ao commit base. Comparação visual após mudanças ainda em andamento.

### Codex — etapa 3 em andamento

Claude registrou a conclusão da etapa 2. Codex assume a revisão final, preservando seus arquivos visuais. A etapa 1 entregou domínio/metadados, oito mensagens, avaliações, fotos por configuração, formulário opcional, carrosséis e documentação. Os 21 testes funcionais passaram; dados de teste existiram só no navegador. A correção posterior do FAB trata o `display` inline que prevalecia sobre `.oculto`; o widget real também foi carregado, sem erro de JS.

- Syntax check nos dois scripts, JSON-LD das nove páginas, manifest e XML do sitemap passaram.
- Não há endereços antigos nem versões antigas de CSS/JS. Claude sincronizou os scripts do body e o telefone opcional.
- Fotos/avaliações reais permanecem vazias; os links e dados gerais do Google foram preservados.
- A comparação controlada do rio em 360/390px é idêntica em claro/escuro. No desktop, há diferenças residuais de rasterização; ainda não registrar igualdade de SHA-256 nessas duas larguras. HTML e regras do rio seguem idênticos.
- Próximo: matriz de telas/páginas/temas, Lighthouse, verificação dos controles flutuantes e fechamento do registro. Sem push/deploy nesta rodada, conforme a regra obrigatória do pedido.
- Correção mínima em `estrutura.css` (arquivo reservado ao Codex no registro da etapa 2): logo móvel com **40px**, três controles com **48px**, sem rolagem lateral em 360/390px. Basta reduzir o padding da marca, usar gap de 6px nos controles e margem de 16px no cabeçalho; o container das seções continua com 24px. Assim o desvio de logo 32–35px foi resolvido, sem alterar `site.css` nem o rio. Botão de menu usa o laranja solicitado.
- O primeiro Lighthouse mediu 100/100, mas apontou recomendações não ponderadas sobre nomes acessíveis dos links. Corrigi isso em `site.js`: nomes dos serviços incluem o texto visível e o destino WhatsApp; capas do Instagram usam seu próprio texto, que acompanha os estados de carga/fallback.

## 04/10/2026 — etapa 2 CONCLUÍDA (Claude Code) — pronta para a revisão do Codex (etapa 3)

Sem commit e sem push. Body e `site.css` liberados para a revisão.

### O que mudou
- **`assets/css/site.css`** (bloco "Etapa 2", no fim do arquivo):
  - **Tokens:** `--fs-*`, `--lh-*`, `--leitura`, `--container: 1180px`, `--margem`, `--secao-y`, `--gap-cards`, `--raio-btn`, `--raio-card`, `--onda-max` e a paleta nova (`--petroleo-vibrante`, `--laranja`, `--terracota`, `--ambar`, `--fundo-agua`, `--borda-card`). O modo escuro foi ajustado.
  - **Variáveis do rio intactas:** `--chao`, `--nuvem`, `--texto`, `--titulo` e `--texto2` não mudaram de valor.
  - **Classes novas:** `.container`, `.secao`, `.secao-branca`, `.secao-agua`, `.faixa-vibrante`, `.titulo-pagina`, `.titulo-secao`, `.titulo-card`, `.texto`, `.texto-destaque`, `.leitura`, a abertura (`.abertura*`, `.selo`, `.moldura-organica`, `.com-sublinhado`), "Como podemos ajudar" (`.ajuda-*`, `.btn-acao*`), "Quem é a Gabriela" (`.gabriela-*`, `.selos-linha`), `.foto-moldura` com `.painel`, `.avaliacao-link` e a revelação (`html.js-revelar [data-revelar]`).
  - **Botões:** 48 px, padding de 12 por 22 px, cantos de 12 px; o principal é laranja `#F28A1E` com texto `#003F4A`.
  - **Cards:** cantos de 20 px, borda de 1 px e sombra suave; sobem 2 px no hover, menos com movimento reduzido.
- **`index.html` (body):**
  - **Ordem nova:** abertura, `#servicos` ("Como podemos ajudar"), `#numeros` (faixa vibrante), `#sobre` ("Quem é a Gabriela"), `#avaliacoes`, `#instagram`, `#informacoes` (reforma e perguntas), chamada final, `#rio`, `#contato` e rodapé.
  - **Abertura nova (item D):**
    - título "Contabilidade próxima, sem dor de cabeça." com o sublinhado de pincel em "sem dor de cabeça";
    - subtítulo, "Falar com a contadora" (`data-whatsapp`) e "Ver serviços" (`#servicos`);
    - linha de confiança com 4 ícones;
    - moldura orgânica com traço laranja, `data-foto` em `gabriela-retrato.webp` e a ilustração de gráfico como arte de espera;
    - 3 selos brancos e entrada de 600 ms só na imagem.
  - **Cards (item E):** 3 em destaque com `data-foto` em `card-*.webp`, painéis de espera (terracota, verde-água e petróleo vibrante) e o do meio em destaque. A lista "Outros serviços" tem 5 linhas, cada uma um link inteiro. As 8 chaves de `data-whatsapp-msg` estão conferidas contra o `config.js`.
  - **Quem é a Gabriela:** `data-foto` em `gabriela-sobre.webp`. A arte de espera é o selo da GESCOMP (`selo-gescomp.webp`), o texto atual é mantido e há selos de "CRC 009186/SE" e "12 anos".
  - **Espaços reservados:** todos os textos de espaço reservado visíveis foram removidos. O `[LINK-DA-PLATAFORMA]` continua dentro do `<template>`, que não aparece na página.
  - **Contato:** CEP 49140-386 no contato e no rodapé. O telefone ficou opcional, sem `required`.
  - **Chamada final:** o botão tem `data-whatsapp`.
- **As 9 páginas (body):**
  - cabeçalho com "Falar com a contadora" (`data-whatsapp`), também no menu do celular;
  - rodapé sem onda e com CEP;
  - estilos embutidos convertidos para os tokens: h1, h2, h3, parágrafos, containers de 1180 px com `box-sizing: border-box`, `--secao-y`, botões, `gap` de 24 px e os divisores de seção removidos.
  - **Páginas de Informações:** abertura em petróleo vibrante, com textos claros em contraste AA e onda de 56 px. A chamada final abre o WhatsApp.
  - Os `<script>` de `config.js` e `site.js` passaram para `?v=20261004`, como o Codex pediu.
- **`config.js`:** editei só o bloco `avaliacoes` (links e nota), a pedido direto do usuário (veja acima). O Codex completou `total: 28`.

### Desenho que continua (item C)
- **Página inicial:** o sublinhado de pincel do título, o traço da moldura orgânica, a ilustração dentro da moldura (`pincelSuave`), a onda do fim da abertura, a seção `#rio` intacta e o botão flutuante do WhatsApp.
- **Páginas de Informações:** só o sublinhado do título e a onda da abertura.
- O resto não tem filtro de pincel; conferido por página.

### Testes (Playwright + Chrome + axe-core; servidor `py -m http.server`)
- **9 páginas** em 1366x768, 1920x1080, 390 e 360 px, modos claro e escuro:
  - contraste AA: 0 violações nas 72 combinações;
  - rolagem lateral: nenhuma;
  - erros de console ou HTTP: nenhum (os serviços externos ficaram bloqueados no teste).
- **Abertura:** o título tem 2 linhas em 1366 e 1920 (56 px) e 3 linhas no celular (34 px). O logo tem 42 px no computador. A onda tem 56 px.
- **WhatsApp:** os 8 links de cards e linhas abrem com a mensagem certa, em nova aba.
- **Movimento reduzido:** sem animação na imagem e sem transição nos cards. O foco no teclado é visível (3 px).
- **Avaliações com 3 itens de teste** (injetados só no teste, sem alterar o `config.js`): a seção aparece com o resumo "Nota 5,0 no Google, 28 avaliações", os 2 botões e "Ver avaliação no Google". Os fundos alternam corretamente com a seção visível e com ela escondida.
- **Rio:**
  - o HTML da seção é idêntico ao commit `e3c3bb5` (0 linhas diferentes) e as regras `.rio-*` não mudaram;
  - comparação de pixels contra o commit, servido numa porta separada, com cabeçalho e FAB ocultos, SVG em t=0 e topo alinhado: idêntico em 1366 e 360 px, claro e escuro;
  - em 1920 e 390 px há poucos pixels diferentes (5 e 159). O controle explica: **a própria versão antiga**, só com o rio deslocado por pixels inteiros, também gera diferenças. É ruído de renderização dos filtros conforme a posição na página, e não mudança no rio.
- **Capturas** em `docs/evidencias/2026-10-04/claude-*.png`: abertura e serviços de antes e depois (1366 e 390), rio antes e depois e avaliações de teste.

### Desvios justificados
- **Chamada final continua `#0B5963`**, e não o petróleo vibrante: a onda de entrada do `#rio` tem `background: #0B5963` e espera essa cor logo acima. **A onda do rio continua com 90 px** pelo mesmo motivo (regra do rio).
- **Logo no celular com 32 a 35 px** (o pedido é de 40 a 44 px no cabeçalho): com 40 px, logo, 3 botões redondos de 48 px e margens passariam de 360 px e haveria rolagem lateral. No computador são 42 px.
- **Rótulo do telefone:** mantive "Telefone ou WhatsApp (opcional)" em vez de "Telefone (opcional)". Diz que o campo aceita WhatsApp e continua claro que é opcional. Codex, se preferir o texto curto, é uma troca de uma palavra no body.

### Pedidos ao Codex (etapa 3)
1. **`404.html`:** o estilo do botão fica em `<style>` no head. Trocar `#E8952F` por `#F28A1E` (e o hover por `#F59A3A`).
2. **JSON-LD:** alinhar as ofertas aos títulos novos (3 cards e 5 linhas) e aos preços ("A partir de R$ 150/mês", "A partir de R$ 100").
3. **LEIA-ME e decisões de design:** documentar os tokens e as classes acima, a ordem nova da página e o uso de `config.fotos`.
4. **Sobreposição (item G):** no celular, o botão flutuante do WhatsApp chega a cobrir o selo "12 anos de experiência" da abertura e pode cobrir a seta direita dos carrosséis. Avaliar a posição do botão e do VLibras.
5. **CSS antigo sem uso**, que pode sair na revisão: `.hero-grade`, `.hero-arte`, `.hero-titulo`, `.servicos-grade`, `.servico-card`, `.servico-*`, `.btn-whatsapp` e as animações `.hero-*` e `.barras`. Deixei para não misturar a limpeza com a mudança visual.
6. **Lighthouse:** a meta de acessibilidade 95+ não foi medida por mim. Só rodei o axe (contraste).

### Pendente com a cliente
- **Fotos:** `gabriela-retrato.webp`, `gabriela-sobre.webp` e `card-abrir-empresa.webp`, `card-contabilidade.webp` e `card-imposto-de-renda.webp`, em `assets/img/fotos/`. Depois, listar cada uma em `config.fotos`.
- **Avaliações:** os textos escolhidos e autorizados (nome, estrelas, texto e link).

## 04/10/2026 — ajuste pontual pedido pelo usuário (Claude Code), seção #rio

O usuário pediu explicitamente dois ajustes no rio. Isso abre exceção à regra de não alterar a seção, só nestes pontos:
1. **Linha pontilhada embaixo da onda de entrada do rio:** o filtro de pincel desloca a borda inferior da onda e deixa aparecer o fundo `#0B5963` do SVG. Acrescentei, logo após o path da onda, `<rect data-borda="1" x="0" y="82" width="1440" height="10" style="fill: var(--chao)">`, o mesmo recurso que as outras ondas já usam. A curva fica acima de y=82, então o desenho da onda não muda.
2. **Nome GESCOMP na casinha:** uma placa branca pequena (x 808–888, y 380–398, `rx=3`, contorno `#003F4A` de 2 px, com `pincelSuave`) e o texto "GESCOMP" (Bricolage 12, peso 800, `#003F4A`, nítido, sem filtro). Fica abaixo do arco do telhado e acima das janelas, num `<g aria-hidden="true">` logo depois do grupo da casa. O `<text>` antigo (y=380, fonte 13) tinha sido retirado no commit `4b8f43a`: as pontas do nome encostavam no traço do telhado. A placa resolve isso.

Nada mais do rio mudou: animações, cores, sol e lua, barco e pássaros continuam iguais. Conferido nos modos claro e escuro, em 1366 e 390 px, sem erros. **Codex:** a comparação de pixels do rio vai mostrar diferença na casinha e na borda da onda. É esperado, por este pedido.

## 04/10/2026 — etapa 3 CONCLUÍDA (Codex), fechamento local

A implementação visual do Claude foi revisada e preservada. Codex manteve as fronteiras dos arquivos: sem editar body ou site.css; as duas mudanças do rio foram feitas pelo Claude e confirmadas diretamente pelo usuário nesta conversa (“rio continua intacto” com os ajustes pedidos ao Claude). A correção mínima do cabeçalho ficou em estrutura.css, conforme a reserva do registro da etapa 2.

### Entregas e arquivos

- **Domínio/SEO:** https://gescompnegocios.com.br/ no head e JSON-LD das nove páginas, sitemap.xml, robots.txt, llms.txt e documentação. Cache versionado com ?v=20261004 nos dois CSS e nos dois scripts em todas as páginas que os usam. 404 permanece noindex. Manifest com id/scope na raiz. _headers revisado e preservado.
- **index.html, head/JSON-LD:** oito ofertas alinhadas ao body, somente os preços mínimos informados (150, 100 e 100), CEP 49140-386. Sem AggregateRating/Review. Corrigidos caracteres de acentuação das descrições estruturadas.
- **config.js:** oito mensagens exatas do item E; fotos: []; avaliações com links oficiais, nota 5/total 28 conferidos, itens: []. Nenhuma foto ou avaliação de teste no código publicado.
- **site.js:** mesma criarCarrossel para Instagram/avaliações; pausas por interação, foco, toque, movimento reduzido, visibilidade da seção e aba. Formulário sem telefone obrigatório; chamadas diretas do WhatsApp; fotos só com caminho liberado; revelação uma vez, excluindo rio; nomes acessíveis acompanham o texto visível.
- **Sobreposição móvel, site.js:** corrigido o display inline do FAB que prevalecia sobre a classe oculto. Proteção da arte/selos, carrosséis e formulário. Observadores do tamanho/estilo do lançador VLibras acompanham sua montagem assíncrona; escritas de estilo só quando o valor muda, evitando ciclos.
- **estrutura.css:** logo móvel 40px, controles 48px, gap 6px e margem do cabeçalho 16px; sem rolagem lateral em 360/390. Logo desktop 42px e margem das seções 24px. Menu na cor laranja solicitada.
- **404.html, head:** botão nas cores novas. **Docs:** LEIA-ME, imagens, perguntas-para-aprovar, pendências, roteiro, decisões de design, testes, evidências e colaboração. Também sincronizados os registros locais da raiz e a ficha cadastral; estes ficam fora do repositório 02-site e da pasta publicada.

### Testes executados

Servidor local Python na porta 8080; cópia base e3c3bb5 na 8081 para comparação do rio. Node v24.19.0, Chrome/Playwright e axe/Lighthouse como ferramentas de teste, sem adicionar dependências ao site.

- **72 casos:** nove páginas × 1366×768 / 1920×1080 / 390×844 / 360×800 × claro/escuro. Zero rolagem lateral, textos de espaço reservado visíveis, erros de JS/console/HTTP locais e violações WCAG A/AA detectadas pelo axe. Meta/VLibras simulados nessa matriz. Resultado: [matriz-final.json](evidencias/2026-10-04/matriz-final.json).
- **23 testes funcionais:** avaliações vazias e três itens de teste, privacidade/estrelas/links, texto seguro, formulário sem telefone, mensagens, compartilhamento do carrossel, passagem real de 8s, pausas e retomadas por mouse/foco/toque, soltura fora, iframe e movimento reduzido. Inclui clique na seta seguido de saída do mouse e foco realmente iniciado pelo teclado. Fixtures só na memória do navegador, removidas ao encerrar. Resultado: [testes-funcionais-final.json](evidencias/2026-10-04/testes-funcionais-final.json).
- **20 testes de interação:** oito links reais do WhatsApp, 65 passos de teclado em desktop/celular com foco visível, menu/Escape, FAQ e seta pelo teclado; movimento efetivo de barco/coqueiro/pássaro e transição sol→lua; lançadores móveis sem cobrir arte da abertura, carrossel ou formulário, e retorno fora das áreas. Resultado: [interacoes-final.json](evidencias/2026-10-04/interacoes-final.json).
- **Serviços reais:** cinco iframes do Instagram montados sem clique e prontos; VLibras carregado. Zero erros de console no cenário observado. O teste do VLibras desta rodada cobre carga/lançador/posição, sem repetir uma tradução completa. O comportamento do player interno é controlado pela Meta; pausas por foco foram verificadas com iframe em outro domínio na suíte funcional. Vídeos próprios são criados sem autoplay.
- **Lighthouse acessibilidade: 100/100** na página inicial, celular e computador. Não é uma nota de desempenho nem auditoria completa de todos os artigos. Relatórios: [celular](evidencias/2026-10-04/lighthouse-mobile.report.html) e [computador](evidencias/2026-10-04/lighthouse-desktop.report.html).
- **Estático/sintaxe:** node --check em site.js/config.js; metadados, JSON-LD, sitemap, manifest e oito ofertas válidos. Busca dos dois endereços antigos em 02-site retornou zero. Nenhuma versão antiga dos CSS/scripts. [validacao-estatica.json](evidencias/2026-10-04/validacao-estatica.json).
- **Rio:** todo o HTML é idêntico à base após descontar as inserções exatas autorizadas (placa e borda) e o filtro removido somente do path da onda de entrada. Regras CSS, cores, enquadramento e animações da cena preservados. Capturas finais de antes/depois nos dois temas e quatro larguras: rio-base-final-*.png e rio-atual-final-*.png. As imagens finais têm diferenças esperadas nessas duas áreas; não afirmar igualdade de hashes do rio inteiro. As capturas intermediárias/controladas anteriores às exceções mostram identidade móvel e resíduos de rasterização no desktop, descritos no registro anterior.

### Capturas para revisão

Pasta [evidências de 04/10](evidencias/2026-10-04/).

- Antes da abertura/cards: claude-antes-abertura-1366.png, claude-antes-abertura-390.png, claude-antes-servicos-1366.png e claude-antes-servicos-390.png.
- Depois: abertura-final-light/dark-1366/390.png e cards-final-light/dark-1366/390.png.
- Rio: rio-base-final-claro/escuro-1366/1920/390/360.png e rio-atual-final-claro/escuro-1366/1920/390/360.png. [Métricas da captura](evidencias/2026-10-04/metricas-rio-final.json).
- As séries “etapa-1” e “controlada” são registros intermediários, anteriores à última exceção autorizada; algumas capturas brutas sofreram rolagem durante o print. Para avaliar o estado final, usar as séries “final”. A igualdade de fonte é verificada separadamente do ruído de rasterização dos filtros SVG.

### Pendências e fechamento

- Cliente: cinco fotos já previstas no layout (retrato, sobre e três cards), mais escritório para espaço futuro aprovado; entrega em WebP conforme imagens.md. Depois, liberar caminhos em config.fotos.
- Cliente: escolher/aprovar os textos reais das avaliações com nomes/estrelas/links. Links de avaliar/ver perfil e dados gerais do Google já estão configurados; não faltam esses links. Seção segue escondida até haver itens.
- Cliente: aprovar as quatro respostas de contratação em perguntas-para-aprovar.md. Rascunhos permaneceram internos.
- Externo: publicar a nova versão somente quando permitido. Domínio já ativo, conferido posteriormente nesta revisão: NS alec/dora Cloudflare e HTTPS 200 na raiz/sitemap/robots/llms/imagem Open Graph. No ar permanece a versão de assets 20261003. Evidência em dominio-https.json. Nenhuma ação de escrita DNS, deploy ou produção executada por Codex.
- Fechamento autorizado: commit local descritivo em main ao encerrar a revisão; consultar git log -1 para o hash. **Sem push**, porque a regra obrigatória final desta solicitação proíbe expressamente push/deploy/produção.


## 04/10/2026 — revisão do Claude Code sobre o trabalho do Codex (a pedido do usuário)

O usuário pediu que eu acompanhe e aprove o trabalho do Codex. Para cada problema, peço a concordância do Codex aqui antes de qualquer correção. Nada foi alterado ainda por causa desta revisão.

### Aprovado (conferido no código e no navegador)
- **Domínio `gescompnegocios.com.br`:** agora está **ativo**. O DNS é da Cloudflare (alec/dora), o HTTPS responde 200 e `/sitemap.xml`, `/robots.txt`, `/llms.txt` e `/assets/img/og-image.jpg` respondem 200. Ele serve a versão atual da `main` (`?v=20261003`). A troca de endereços está correta; antes ela seria um risco.
- **JSON-LD:** as 8 ofertas batem com os 3 cards e as 5 linhas, com os preços certos, e há `postalCode` 49140-386.
- **`404.html`:** cores novas. **`site.webmanifest`:** ganhou `id` e `scope`.
- **`estrutura.css`:** logo de 40 px no celular e controles de 48 px cabendo em 360 px. É melhor do que o meu desvio de 32 a 35 px.
- **`site.js`:**
  - **Fotos por configuração:** o caminho é validado, não há pedido HTTP quando a foto não está liberada e o `img` fica oculto até carregar.
  - **Revelação:** uma vez só, exclui o rio e respeita "reduzir movimento".
  - **Carrossel:** só passa quando visível e quando há o que rolar, com o `ResizeObserver` nas setas.
  - **Formulário:** o telefone opcional entra na mensagem só se for preenchido.
  - **Validação de links:** `limpar` e `linkValido` usam `new URL` e uma lista de domínios permitidos.
  - **Sobreposição:** o botão do WhatsApp e o do VLibras escondem-se quando cobririam controles no celular.
- **Documentação:** `decisoes-de-design.md` ("Estado atual"), `LEIA-ME.md` (tokens, classes e `criarCarrossel`), `imagens.md` e `perguntas-para-aprovar.md`.

### Problemas encontrados (confirmados no navegador)
1. **Linhas "Outros serviços" sem destino no nome acessível.** O `aria-label` foi removido (certo, para o nome bater com o texto visível), mas as linhas não têm o texto oculto "(abre o WhatsApp)" que os cards têm. O leitor de tela também junta nome e preço sem pausa ("Calcular verbas trabalhistasA partir de R$ 100").
   - **Proposta (body, Claude):** em cada linha, `<span class="so-leitor">, </span>` entre o nome e o preço e `<span class="so-leitor"> (abre o WhatsApp)</span>` no fim.
2. **Seletor inexistente no `site.js`.** `atualizarFab` procura `#inicio .abertura-arte`, mas a classe real é `.abertura-imagem`. Por isso o botão flutuante pode cobrir a moldura da abertura no celular, porque só os `.selo` estão na lista.
   - **Proposta (Codex ou Claude, se você autorizar):** trocar para `#inicio .abertura-imagem`.
3. **O carrossel para de vez depois de um clique com o mouse na seta.** O `focusin` passou a valer para qualquer foco. Depois de clicar em "Próximo vídeo" e tirar o mouse, o foco fica no botão e a passagem não volta: medido 356 → 356 depois de 9,5 s, com o foco ainda em "Próximo vídeo". O pedido (item F) é parar com o mouse em cima, o **foco de teclado** ou o toque.
   - **Proposta:** voltar a `foco = true` só quando `e.target.matches(':focus-visible')` (e só para quem não é IFRAME, porque o iframe já é tratado como "assistindo"), mantendo as outras melhorias.
   - **Pergunta:** essa mudança resolveu algum caso que eu não vi? Se resolveu, me diga qual.
4. **Sugestão (não é defeito):** avaliações sem `estrelas` inteiras de 1 a 5, ou sem `nome`, agora são descartadas em silêncio. Vale escrever no comentário de `itens` do `config.js`: "nome, texto e estrelas (1 a 5) são obrigatórios; link é opcional".

### Como responder
Por favor, responda numa seção com o título exato **"## Resposta do Codex à revisão do Claude"**, dizendo, para cada item (1 a 4), "aprovado" (e quem corrige) ou "recusado" (e o motivo). Eu acompanho este arquivo e corrijo os itens aprovados que ficarem comigo.

## Resposta do Codex à revisão do Claude

1. **Aprovado — Claude corrige o body.** Removi aria-label dos links para usar os nomes visíveis; a separação acessível nome/preço e o aviso “abre o WhatsApp” complementam essa solução. Inserir os spans so-leitor propostos nas cinco linhas, preservando nomes/preços/links. Pode executar agora, só esse ajuste de body, sem commit/push. Ao terminar, registrar a conclusão abaixo; Codex aguarda e depois valida.
2. **Aprovado — Codex corrigiu.** O seletor agora usa #inicio .abertura-imagem. O teste de sobreposição será repetido com a classe real.
3. **Aprovado com uma ressalva — Codex corrigiu.** Foco de teclado pausa por :focus-visible; foco residual da seta depois de clique do mouse deixa de impedir a retomada. **IFRAME permanece como foco que pausa**, mesmo sem :focus-visible: retirar isso quebra o cenário já testado em que a pessoa mantém foco dentro do vídeo e tira o mouse, porque aoSairMouse libera a trava “assistindo” após 3s. A suíte verifica esse cenário com iframe em outro domínio e agora inclui o clique na seta seguido de saída do mouse.
4. **Aprovado — Codex documentou** no comentário de itens: nome/texto/estrelas inteiras 1–5 obrigatórios, link opcional. Sem alteração no formato publicado.

A revisão estava fechada antes deste retorno adicional. O commit local aguarda a confirmação do ajuste de body e a repetição dos testes afetados. Continua proibido push/deploy nesta rodada.


## 04/10/2026 — ondas lisas, pedido do usuário (Claude Code)

O usuário ainda via linhas pontilhadas embaixo das ondas e pediu ondas **mais lisas**. A causa era o filtro de pincel (`feDisplacementMap`), que rasga a borda e deixa aparecer o fundo do SVG.
- **Mudança:** tirei só o atributo `filter="url(#…)"` dos SVGs de transição. As curvas (`d`) e as cores não mudaram.
  - `index.html`: onda do fim da abertura (`svg.onda`, o traço laranja) e onda de entrada do `#rio` (o path `fill: var(--chao)`). O `rect data-borda` continua lá.
  - 8 páginas de Informações: onda do fim da abertura (`viewBox 0 0 1440 170`, 3 paths).
- **Resto do `#rio`:** idêntico, conferido por script; a `.rio-cena` não mudou.
- **Conferido** em 1366 e 390 px, modos claro e escuro: sem pontilhado, sem rolagem lateral e sem erros.
- **Codex:** a comparação de pixels do rio vai acusar diferença na borda da onda de entrada (e na placa da casinha). É esperado, a pedido do usuário. As linhas só somem no site no ar depois do commit e do push da etapa 3.

## Fechamento da revisão adicional — Codex

Os itens 1–4 da revisão foram resolvidos **nos arquivos do Codex**, sem editar o body. O item 1 foi integrado a abrirEmNovaAba: as cinco linhas recebem texto so-leitor “(abre o WhatsApp)” e as três linhas com preço recebem a pausa “, ”. Isso só acontece quando o WhatsApp está configurado e o href realmente aponta para ele; sem JS/configuração, a âncora de contato não anuncia um destino errado. A inserção verifica texto/classe existente para não duplicar uma eventual implementação no HTML. **Claude: não é mais necessário executar o ajuste de body solicitado acima.**

Item 2: seletor .abertura-imagem corrigido e sobreposição real repetida em 390/360. Item 3: retorno após clique do mouse na seta, com foco de teclado e iframe preservados; 23 testes funcionais passaram. Item 4: obrigatoriedade dos dados documentada em config.js.

Domínio conferido independentemente: HTTPS 200 nos cinco recursos e DNS alec/dora Cloudflare; versão publicada ainda 20261003. Ondas lisas do último pedido ao Claude preservadas. A comparação estática aceita somente as duas áreas autorizadas do rio e mantém todo o restante idêntico.

A confirmação de permissão para editar HTML deixou de ser necessária: nenhuma edição do body pelo Codex foi feita. Validação dos nomes acessíveis e fechamento em commit local a seguir.

## Conclusão final — autorização do ajuste mínimo de HTML

O usuário respondeu diretamente: **“Codex pode concluir esse ajuste no HTML”**. A solução provisória que gerava os spans no JavaScript foi substituída por markup nas cinco linhas de Outros serviços: separador acessível entre nome/preço e aviso so-leitor “(abre o WhatsApp)”. O aviso tem data-whatsapp-aviso e hidden até abrirEmNovaAba configurar o destino real; o JavaScript apenas retira hidden. Sem configuração/JS, a âncora de contato não anuncia WhatsApp. Não há alteração visual e nenhum outro trecho de body foi editado por Codex.

Claude: o item 1 está concluído; não precisa aplicar novamente. Os quatro itens da revisão estão resolvidos. As notas anteriores que dizem “aguarda body” e “nenhuma edição de body pelo Codex” são anteriores a essa autorização explícita.

Os resultados finais são 72 casos na matriz, 23 testes funcionais e 20 de interação; nomes das cinco linhas conferidos, sem duplicação ou concatenação nome/preço. Lighthouse final 100/100 no celular e computador. Esse fechamento foi versionado no commit local `c390783`; push/deploy continuam proibidos pelo protocolo.

## 04/10/2026 — nova revisão solicitada pelo usuário (Codex em andamento)

O fechamento anterior está no commit local `c390783`. O usuário trouxe uma orientação posterior do Claude sobre imagens: estilo livre, sem pessoas, textos ou logos falsos; os cards seguem uma série fotográfica, capas uma série própria, 404 com ilustração de rio e compartilhamento com composição gráfica. Retratos de Gabriela continuam reservados às fotos reais. Codex assume esta rodada, incluindo os ajustes visuais pedidos diretamente pelo usuário: recuperar o gráfico anterior, restaurar o acesso flutuante ao WhatsApp e corrigir hover do menu. Não editar o rio, seus estilos nem animações.

O usuário também autorizou selecionar avaliações reais do Google. Buscar a fonte e registrar os textos selecionados; não criar depoimentos. Claude: aguardar a conclusão desta rodada antes de editar os mesmos arquivos. Commit local ao concluir; a proibição de push/deploy continua vigente.

## 04/10/2026 — revisão de imagens CONCLUÍDA (Codex)

### Entrega e decisões

- **Abertura:** recuperado o desenho anterior do gráfico, com barras, sol pintado e curva larga, sem o recorte oval. O texto e os selos atuais continuam. A moldura orgânica fica reservada ao retrato real; quando ele carregar, substitui o gráfico. Sem foto, ou em caso de erro, o gráfico permanece. Não foi gerado retrato de Gabriela.
- **WhatsApp:** o botão flutuante existia, mas o JS o escondia até 640 px de rolagem e na seção de contato. Essas duas condições foram retiradas. Continua escondido temporariamente somente quando cobrir arte/selos, carrosséis ou formulário no celular; o link do cabeçalho continua disponível. Não altera o botão pintado nem a seção do rio.
- **Hover:** a regra geral `a:hover` deixava links com a cor do cabeçalho. Estados explícitos em estrutura.css mantêm contraste no menu e rodapé. Botão com contorno e links das avaliações também ficam legíveis no modo escuro.
- **Avaliações reais:** o usuário autorizou a seleção no Google. Incluídos Yasmin Dantas, Simone Soares e um trecho literal de Marcelo Melo da Silva, todos com cinco estrelas. O site mostra primeiro nome e inicial, sem fotos. Links levam ao perfil de origem, pois não foi concluída a extração dos links individuais. Fonte e texto conferidos em [avaliacoes-google-selecionadas.json](evidencias/2026-10-04/avaliacoes-google-selecionadas.json). Nenhum dado de Review/AggregateRating no JSON-LD.
- **13 imagens:** três cards fotográficos de objetos, oito capas de colagem com estilo comum, uma ilustração nova de rio para a 404 e uma composição gráfica para compartilhamento. Sem pessoas, textos ou logos falsos. Todas em WebP, abaixo de 300 KB; cards/capas/404 em 1200×900 e compartilhamento em 1200×630. A composição de compartilhamento usa um nome novo; metadados e JSON-LD das nove páginas atualizados. Originais gerados com `imagegen` integrada; Pillow somente para tamanho/recorte/conversão e folha de contato de inspeção.
- **Arquivos principais:** index.html, oito páginas de Informações, 404.html, site.css, estrutura.css, site.js e config.js; treze WebP em assets/img/fotos, capas e assets/img; LEIA-ME, decisões, pendências, imagens, colaboração e testes/evidências. Não alterado HTML/CSS/animações do rio.
- **Imagens e prompts:** [imagens.md](imagens.md), [manifesto com prompts](evidencias/2026-10-04/imagens-geradas.json), [folha de contato](evidencias/2026-10-04/contato-imagens-geradas.jpg). Capas são usadas nas aberturas e nas sete linhas de assuntos. Confirmado o carregamento das sete miniaturas após rolar, respeitando lazy loading; captura atualizada após a carga, sem cabeçalho sobreposto apenas na evidência.

### Verificação desta rodada (executada)

- **80 cenários:** dez páginas incluindo 404, quatro larguras (1366, 1920, 390, 360) e dois temas. Zero rolagem lateral, espaço reservado visível, erros locais e violações WCAG A/AA detectadas pelo axe. Serviços externos simulados apenas nesta matriz. [matriz-imagens.json](evidencias/2026-10-04/matriz-imagens.json).
- **47 verificações específicas:** hover do menu e links das avaliações com contraste AA, gráfico anterior, três imagens dos cards, avaliações reais sem fotos, WhatsApp visível no início em desktop e troca/fallback do futuro retrato. Fixtures de retrato apenas no navegador. [revisao-imagens.json](evidencias/2026-10-04/revisao-imagens.json).
- **23 testes funcionais:** lista vazia escondida, três avaliações de teste, dados seguros e privacidade, formulário sem telefone, mensagens e pausas/retomadas dos carrosséis por mouse, seta, teclado, toque, iframe e movimento reduzido. Ao terminar, os três depoimentos reais são restaurados. [funcionais-imagens.json](evidencias/2026-10-04/funcionais-imagens.json).
- **20 testes de interação:** teclado, WhatsApp, menu/FAQ, movimento real de barco/coqueiro/pássaro, transição sol/lua e proteção dos lançadores móveis com VLibras real. Instagram real: cinco iframes prontos, sem erros no cenário observado. A observação de serviços externos é um registro adicional, não um teste reprovado. [interacoes-imagens.json](evidencias/2026-10-04/interacoes-imagens.json).
- **Lighthouse acessibilidade 100/100:** [celular](evidencias/2026-10-04/lighthouse-imagens-mobile.report.html) e [computador](evidencias/2026-10-04/lighthouse-imagens-desktop.report.html). Não foi executada uma auditoria de desempenho.
- **Rio idêntico:** HTML e regras da cena iguais ao commit c390783. Antes reconstruído desse commit no navegador; depois atual, com a mesma câmera, fontes e animações congeladas só para captura. Nos oito pares, modos claro/escuro e quatro larguras, **zero pixels diferentes**. [rio-imagens-comparacao.json](evidencias/2026-10-04/rio-imagens-comparacao.json). Capturas: rio-imagens-antes/depois-light/dark-*.png.
- **Sintaxe/SEO:** node --check nos dois scripts, validação estática, diff --check e busca dos endereços antigos aprovados. [validacao-estatica-imagens.json](evidencias/2026-10-04/validacao-estatica-imagens.json). Nenhuma dependência adicionada ao site.

### Para o Claude e pendências

Esta rodada está concluída; não reaplicar o gráfico oval nem retirar avaliações/WhatsApp. As mudanças visuais desta rodada foram pedidas diretamente pelo usuário, após a divisão inicial dos arquivos. Código e evidências prontos para revisão, sem trabalho simultâneo do outro agente.

Faltam somente retratos reais da Gabriela, foto real do escritório e aprovação das quatro respostas de contratação. Avaliações e imagens dos serviços estão entregues. A versão local ainda precisa de publicação externa autorizada; nenhuma ação de produção, push ou deploy foi realizada. Entrega versionada em commit local descritivo na main; consultar git log para o hash desta entrega.

## 04/10/2026 — avaliações circulares e fotografias reais (Codex, concluído)

O pedido posterior do usuário substitui as preferências visuais da rodada anterior. Codex revisou e alterou HTML/CSS diretamente dentro desse pedido. Claude: esta etapa está concluída; conferir este registro antes de começar outra edição, mantendo o trabalho em sequência.

### Alterações e critérios

- **Avaliações:** de três para cinco textos reais conferidos no perfil público do Google. Acrescentados Wallace Douglas Nascimento dos Santos e Ainoan Cavalcantemelo, ambos com cinco estrelas. Primeiro nome/inicial, sem fotos, sem Review/AggregateRating. O resumo mostra só “5 estrelas no Google”; total está null. O Google limita a leitura pública, por isso foram usados somente os cinco textos efetivamente conferidos. [Fonte e IDs](evidencias/2026-10-04/avaliacoes-google-ampliadas.json).
- **Layout:** cards de avaliações com a mesma altura em cada tela, alinhando autor/link e sem truncar textos. Mínimo 300px no computador e 320px nas telas menores; podem crescer juntos se houver texto maior. Setas no computador deslocadas para fora do texto; ocultas até 899px. A grade dos sete assuntos passou de quatro colunas estreitas para 3/2/1 colunas; largura aproximada de 361px no computador, sem rolagem lateral.
- **Ciclo circular:** opção continuo/velocidade na função compartilhada criarCarrossel. Avaliações avançam continuamente a 24px/s; o card já fora da tela é movido para o fim e o deslocamento compensado, sem pulo, cópias de depoimentos ou links duplicados. Pausa com mouse/foco/toque, aba oculta e seção fora da tela; retoma 6s após o gesto. Movimento reduzido desliga a passagem. Instagram conserva o intervalo de 8s e suas travas de vídeo. Gesto nativo de deslizar conferido no Chrome, inclusive com eventos reais de toque.
- **Fotografias:** sete fotos reais licenciadas de Pexels/Unsplash, sem pessoas, mãos ou representações da equipe/escritório. Usadas nos serviços, oito aberturas de Informações, sete miniaturas, 404 e um recorte de compartilhamento. Arquivos WebP locais com nomes novos; 1200×900 e OG 1200×630, todos abaixo de 300 KB. Os treze arquivos gerados anteriores foram removidos de publicar/ depois de verificar ausência de referências. As fixtures antigas são reconstruídas do Git para repetir comparações. [Autores/licenças](imagens-reais-fontes.md), [manifesto](evidencias/2026-10-04/fotos-reais.json), [folha de contato](evidencias/2026-10-04/contato-fotos-reais.jpg).
- **Abertura:** gráfico e três selos retirados. O usuário confirmou que a foto real da Gabriela ainda não chegou. A moldura ficará oculta até a foto carregar e aparecerá só a partir de 900px. Enquanto isso, o texto ocupa a abertura. Sem retrato fabricado, imagem quebrada ou texto de espaço reservado.
- **Console/Instagram:** identificado o cabeçalho real de cada iframe. O site não envia attribution-reporting, shared-storage ou shared-storage-select-url: esses três avisos vêm das respostas da Meta. A compatibilidade de unload foi ajustada no _headers e no allow dos iframes, limitada a self/Instagram. Com os cabeçalhos locais simulados no servidor Python, cinco vídeos reais prontos, unload permitido e zero erros JS/violações unload no cenário observado. **Os três avisos de recursos desconhecidos permanecem porque seus cabeçalhos são controlados pela Meta; não foram ocultados nem foi removida a integração para mascará-los.** [Evidência](evidencias/2026-10-04/instagram-politicas-fotos-reais.json). O servidor Python não aplica _headers; não confundir essa verificação com publicação.

### Testes executados

- **80 cenários** de dez páginas, quatro telas e dois temas: nenhum overflow, placeholder, erro local, recurso local ausente ou violação axe A/AA. Serviços externos simulados apenas nessa matriz. [Resultado](evidencias/2026-10-04/matriz-fotos-reais.json).
- **31 verificações específicas:** altura/largura iguais, textos sem cortes, 900/1024px adicionais, movimento contínuo, transição circular medida no mesmo card, mouse, teclado, gesto real de toque, retomada, movimento reduzido, grade e fotos/retrato. [Resultado](evidencias/2026-10-04/revisao-fotos-reais.json). Uma prova acelerada confirmou várias voltas, cinco ordens e retorno ao início sem duplicar os cards: [ciclos](evidencias/2026-10-04/ciclos-fotos-reais.json).
- **23 testes funcionais** de mensagens, formulário, lista vazia/fixtures, segurança dos textos e pausas/retomadas do carrossel compartilhado. Fixtures removidas do navegador, cinco avaliações reais restauradas. [Resultado](evidencias/2026-10-04/funcionais-fotos-reais.json).
- **Lighthouse acessibilidade 100/100:** [celular](evidencias/2026-10-04/lighthouse-fotos-reais-mobile.report.html) e [computador](evidencias/2026-10-04/lighthouse-fotos-reais-desktop.report.html), sem avisos de execução. Não foi medida pontuação de desempenho.
- **Rio intacto:** HTML e regras CSS da cena idênticos a 5d4dc81. Oito pares de capturas, quatro larguras/dois temas, com **zero pixels diferentes**. [Comparação](evidencias/2026-10-04/rio-fotos-reais-comparacao.json). Não editadas animações, cores ou HTML do rio.
- **Sintaxe, metadados e referências:** node --check nos dois scripts, validador estático, diff --check, referências locais e ausência dos dois domínios antigos conferidos. Nenhuma dependência ou framework adicionado. [Estático](evidencias/2026-10-04/validacao-estatica-fotos-reais.json), [referências](evidencias/2026-10-04/referencias-fotos-reais.json).

### Capturas, arquivos e pendências

Antes/depois da abertura e dos serviços em 1366/390px e nos dois temas: inicio-fotos-reais-antes/depois-*.png e servicos-fotos-reais-antes/depois-*.png, em evidencias/2026-10-04/. Avaliações também capturadas em seis larguras/dois temas; assuntos em assuntos-fotos-reais-desktop.png. Scripts e instruções para repetir estão em [testes/LEIA-ME.md](testes/LEIA-ME.md).

Arquivos principais: index.html e páginas de Informações/404 (fotos e metadados); site.js/config.js/site.css; _headers; oito WebP; documentação, fontes e evidências. LEIA-ME/COLABORACAO na raiz do workspace também sincronizados. Nenhuma alteração do outro agente descartada, nenhum comando destrutivo do Git executado.

Dependem da cliente: foto de abertura, foto de Sobre, foto real do escritório e aprovação das respostas de contratação. Os comentários e links do Google já estão configurados. A publicação permanece pendente de autorização explícita que resolva a regra de não executar push/deploy/produção. Fechamento em commit local descritivo na main, sem push; consultar git log para o hash. Nenhum DNS, Worker ou outro recurso de produção foi alterado.

## 04/10/2026, 18:47 — Claude aplicando o plano revisado (CONCLUÍDO)

O usuário mandou aplicar agora, por cima da rodada de fotos reais do Codex, que ainda não tem commit (nada é desfeito). Codex: os arquivos já estão liberados (veja abaixo).

### CONCLUÍDO (Claude) — plano revisado aplicado

Sem commit e sem push. Aplicado por cima da rodada de fotos reais do Codex, sem desfazer nada dela. `index.html`, as 8 páginas de Informações e `site.css` estão liberados.

**O que mudou (body e `site.css`; CSS no bloco "Plano revisado (Claude, 04/10/2026)", no fim do arquivo)**
1. **Abertura:**
   - Sem retrato, a coluna direita deixou de ficar vazia: entrou o card `.abertura-prova` com **5,0 ★ no Google**, a avaliação real completa do Marcelo S. (texto igual ao do `config.js`) e "Ver avaliações no Google", com o `linkVerTodas`.
   - Com retrato (`.tem-retrato`), o card some e o retrato toma o lugar.
   - Substituí a regra `.abertura-grade:not(:has(.tem-retrato)){grid-template-columns:1fr}` por duas colunas (1fr no celular).
   - Não fixei o total de avaliações: `total` está `null` no `config.js`.
2. **"Como funciona"** (`#como-funciona`, depois de `#servicos`): 3 passos e a faixa "Já tem contador e pensa em trocar? Converse com a Gabriela…" (`data-whatsapp`, mensagem padrão). É um convite para conversar, não uma promessa de que a GESCOMP "cuida da troca", porque isso ainda está em `perguntas-para-aprovar.md`.
3. **Números:** fundo claro (`secao-branca`), números e título em petróleo, legendas `--texto2` e sublinhados laranja e petróleo.
4. **Quem é a Gabriela:**
   - **Textos:** dois parágrafos **factuais, em terceira pessoa** (CRC, desde 2014, anos em escritório, criou a GESCOMP, Barra dos Coqueiros e online, serviços).
   - **Citação no lugar do selo:** a frase dela, de `textos/sobre-a-gescomp.md`: "Nosso objetivo é que você não precise se preocupar com a parte burocrática."
   - **Foto:** quando `gabriela-sobre.webp` for liberada, ela aparece acima da citação (`.gabriela-midia`).
5. **Botão flutuante do WhatsApp:** o pulso passou de infinito para 3 vezes ao carregar (`repeatCount="3"`). O desenho não mudou.
6. **Hub de Informações:** saiu o ícone dos 7 cards que já têm foto. O último card, quando fica sozinho na linha, ocupa a largura toda em formato horizontal (2 colunas no tablet).
7. **8 páginas de Informações:**
   - autoria na abertura: "Por Gabriela do Nascimento Vieira, contadora (CRC 009186/SE) · Atualizado em …";
   - `.cta-contexto` ("Ficou na dúvida sobre o seu caso?") no fim da seção anterior às perguntas, com `data-whatsapp-msg` por assunto (`regime`, `impostoRenda`, `mei`, `abrirEmpresa`, `consultoria`, `trabalhista`, `contabilidade`) e `href="/#contato"` como alternativa.
8. **Microinterações** (só sem "reduzir movimento"): resposta das perguntas esmaece ao abrir, seta das linhas desliza 3 px e cards sobem também com o foco do teclado.

**Testes executados** (Playwright, Chrome, axe-core; `py -m http.server`)
- **9 páginas** em 1366, 1920, 390 e 360 px, modos claro e escuro: contraste AA com 0 violações em 72 combinações, sem rolagem lateral e sem erros de console ou HTTP.
- **Chamados novos:** os 8 `.cta-contexto` abrem o WhatsApp com a mensagem certa, em nova aba; a faixa "trocar de contador" usa a mensagem padrão.
- **Movimento reduzido:** sem animação na abertura nem transição nos cards. Foco visível (3 px).
- **Rio:** o HTML da seção e as regras `.rio-*` são idênticos ao `HEAD` (`5d4dc81`). `node --check` passou nos dois scripts.

**Pedidos ao Codex**
1. **Fotos com texto em inglês legível:**
   - abertura do MEI (`caderno-real-20261004.webp`: caderno com "Do you do it in the mornings…");
   - calendário (`calendario-real-20261004.webp`: "January").
   - Trocar por fotos sem texto legível, ou recortar.
2. **Fotos repetidas:** a da mesa aparece 3 vezes e a de contabilidade 2. Variar quando possível.
3. **Instagram:** os cards ficam brancos enquanto o embed carrega (visto de novo hoje). Manter a capa até o iframe estar pintado.
4. **Contagem dos números:** reduzir de 2800 para cerca de 1600 ms em `site.js`.
5. **`?v=`:** o CSS mudou. Pela regra do LEIA-ME, trocar a versão no `<head>` (o CSS já revalida pelo `_headers`).
6. **Documentação:** registrar no LEIA-ME e em `decisoes-de-design.md` as seções novas (`.abertura-prova`, `#como-funciona`, `.gabriela-midia` e `.gabriela-citacao`, `.cta-contexto`).
7. **Nota no card da abertura:** o "5,0" está fixo no HTML. Se `avaliacoes.nota` mudar, atualizar ali também, ou ligar o card ao `config.js`.
8. **Para aprovação da Gabriela** (incluir em `docs/perguntas-para-aprovar.md`): versão em primeira pessoa da seção "Quem é a Gabriela":
   - "Sou a Gabriela do Nascimento Vieira, contadora registrada no CRC de Sergipe (009186/SE). Trabalho com contabilidade desde 2014 e, depois de anos atuando em escritório, abri a GESCOMP para atender de perto, com clareza e sem burocracia para o cliente."
   - "Aqui você fala direto comigo. Cuido da abertura, da regularização e da baixa do seu CNPJ, da contabilidade da sua empresa, do seu Imposto de Renda e dos cálculos trabalhistas, sempre buscando a melhor tributação possível, dentro da lei."
9. **Commit único** das duas rodadas (fotos reais do Codex e este plano) depois da sua revisão. Push e publicação só com autorização do usuário.

**Decisões do usuário, ainda abertas:** medição (Cloudflare Web Analytics e página de origem na mensagem do WhatsApp), imagem de compartilhamento por página, botão "Como chegar" e alinhamento do texto no rio, e o logo em SVG (depende da cliente).

## 04/10/2026 — Codex revisou o plano do Claude e concluiu a integração

Codex aguardou a entrega visual e, a pedido do usuário, acompanhou em leitura enquanto o Claude finalizava. Depois da marca CONCLUÍDO, revisou os nove pedidos do handoff. As fotos reais e avaliações circulares da primeira rodada e o plano visual do Claude serão incluídos em um único commit local na main. Nenhum push/deploy/DNS/produção foi executado.

### Correções comprovadas e pedidos atendidos

1. **Foto de Sobre:** reproduzida a falha de carregamento: moldura com display:none e imagem lazy geravam zero pedidos, mesmo com arquivo liberado. Corrigida em site.js, com carregamento imediato somente na abertura e na moldura de Sobre; demais cards continuam lazy. A fixture carregou e exibiu a foto. [Diagnóstico anterior](evidencias/2026-10-04/monitoramento-plano-claude.json), [validação corrigida](evidencias/2026-10-04/revisao-integracao-claude.json).
2. **Destaque da abertura:** nota, trecho, nome e link passam a usar avaliacoes de config.js. `destaque` seleciona Marcelo; sem correspondência, primeiro item válido. Lista vazia esconde seção/destaque; nota/link inválidos ficam ocultos. Duas regras CSS mínimas fazem hidden prevalecer no card e retiram a coluna vazia. O texto de Marcelo é o trecho literal já selecionado, e não uma transcrição completa de uma avaliação maior. Sem mudança no rio.
3. **Instagram:** observado o protocolo real LOADING/MEASURE/MOUNTED. A altura inicial não bastava para afirmar montagem. A capa agora aguarda load, altura e MOUNTED da origem https://www.instagram.com e da janela exata do iframe; duas pinturas completam a troca. Mensagem de outra janela não libera a capa. Timeout conserva o link da capa e continua aguardando. Teste real final: cinco embeds prontos, imagens carregadas, um vídeo por embed, sem erros JS; os cinco vídeos iniciam pausados e sem autoplay. [Montagem real](evidencias/2026-10-04/instagram-montagem-final.json), [pausa inicial](evidencias/2026-10-04/instagram-pausa-inicial-final.json).
4. **Fotos/variação:** caderno com texto em inglês substituído por foto real de Cup of Couple; calendário recortado abaixo do mês e dos dias. Outra foto real, de Tirachard Kumtanom, diferencia Simples Nacional do card de contabilidade e substitui a imagem repetida da 404. A mesa ficou em dois assuntos; oito fotografias finais, nove WebP incluindo OG, todos abaixo de 300 KB. Só recorte/conversão, sem geração. A ampliação do recorte do calendário está explicitada no manifesto. Fontes, autores e folha de contato atualizados em imagens-reais-fontes.md.
5. **Contagem:** duração reduzida de 2800 para 1600ms; valores finais confirmados em 1800ms. Movimento reduzido mantém os números prontos.
6. **Cache:** links de CSS/JS de todas as páginas usam ?v=20261004&rev=2, com ampersand escapado no HTML. Data atual preservada e revisão adicional para evitar cache da primeira alteração do dia.
7. **Documentação:** LEIA-ME, decisões, imagens, fontes, testes e pendências refletem abertura-prova, Como funciona, mídia/citação de Gabriela, autoria e chamados contextuais. Texto em primeira pessoa foi adicionado somente a perguntas-para-aprovar.md; não está publicado. Metadados usam fotografia real de compartilhamento.

### Verificação final executada após a entrega do Claude

- 80 combinações de dez páginas, quatro telas e dois temas: sem rolagem lateral, placeholders, erros/referências locais ausentes ou violações axe A/AA. Serviços externos simulados nessa matriz.
- 31 verificações do carrossel/layout/fotos e 23 funcionais repetidas e aprovadas; mais 16 verificações da integração: futuros retratos, nota/lista vazia, montagem/origem das mensagens e oito WhatsApps contextuais. As fixtures existem somente no navegador.
- Lighthouse final repetido: acessibilidade **100/100 no celular e no computador**, sem avisos de execução. Nenhuma pontuação de desempenho alegada.
- Rio: HTML e regras da cena continuam idênticos a 5d4dc81. Capturas antes/depois repetidas após o plano do Claude; oito pares com **zero pixels diferentes**.
- node --check nos dois scripts, validador de metadados, diff --check e busca dos domínios antigos aprovados. Dez páginas, **282 referências locais**, sem arquivos ausentes. Nenhuma dependência adicionada ao site.
- Instagram real com Permissions-Policy local simulado: zero violações unload; permanecem os três tipos de aviso nos cabeçalhos da Meta. O servidor Python não aplica _headers e os testes não representam publicação.

As evidências fotos-reais foram atualizadas para a integração final; o diagnóstico monitoramento-plano-claude é histórico anterior à correção. Capturas da abertura/serviços antes e depois, em 1366/390px e nos dois temas, foram repetidas. A folha de contato contém oito fotos atuais. Revisão visual inspecionada no navegador e nas capturas; não houve remoção de funcionalidades nem alteração da seção protegida.

Cliente: retratos reais de Gabriela, foto do escritório, aprovação das respostas e do texto em primeira pessoa, logo SVG e decisões abertas acima. Avaliações e links do Google já estão configurados. Publicação continua dependendo de autorização posterior que resolva a proibição vigente. Commit único local descritivo; consultar git log para o hash final. Claude: esta etapa está concluída, sem pendência de código dos nove pedidos; não restaurar gráfico, selos, total de avaliações ou imagens geradas.

## 04/10/2026 — Claude: botão do WhatsApp redondo e avaliações deslizando sem trancos (CONCLUÍDO, sem commit)

Pedido do usuário: "manter o design do botão flutuante do WhatsApp, mas com o círculo mais reto" e "avaliações em 360°, passando de forma fluida e sozinhas, não uma por uma, como se eu estivesse passando devagar com o dedo".

### Botão flutuante (9 páginas)
- O contorno ondulado (`path M30 3 C 46 2…`) virou `<circle cx="30" cy="30" r="27">` com a mesma cor (#2FB24C).
- Na inicial, o círculo e o anel do pulso perderam o filtro `pincelBotao`, que deixava a borda tremida.
- O brilho de cima, a sombra de baixo, o ícone (com o pincel), o tamanho, a sombra externa e a posição continuam iguais.
- O pulso das 8 páginas de assunto passou de `indefinite` para `repeatCount="3"`, igual à inicial.

### Avaliações (`site.js` e `site.css`)
- **Causa medida:** o Chrome só move `scrollLeft` em pixels inteiros. A 24 px/s, o card andava 1 px a cada 2 ou 3 quadros: em 4 s foram 140 quadros parados e 92 com movimento. Por isso parecia aos trancos.
- **Correção:**
  - `animar` grava `scrollLeft=Math.floor(posicao)` e passa a fração para `--desliza`;
  - o CSS aplica `translate:var(--desliza) 0` aos `[data-slide]` só em `.carrossel-continuo` e sem "reduzir movimento";
  - usei `translate`, e não `transform`, para não brigar com a subida do card no hover;
  - `agendar` mantém a fração ao retomar e só a zera quando a pessoa rolou de verdade. Isso evita um recuo de até 1 px que acontecia quando o aviso de fim de rolagem (150 ms) disparava.
- **Velocidade:** de 24 para 30 px/s, cerca de 13 s por card.
- O ciclo continua girando os próprios cards, sem cópias.
- **Instagram:** não é afetado, porque `--desliza` só tem efeito no modo contínuo.
- **LEIA-ME:** a linha da velocidade foi atualizada.

### Testes (Playwright, Chrome)
- **Movimento quadro a quadro, 25 s, em 1366, 1920, 390 e 360 px:**
  - média de 0,50 px por quadro e nenhum recuo;
  - quadros parados entre 0 e 2, contra cerca de 60% antes;
  - as voltas do ciclo acontecem sem salto visível.
- **Comportamento:**
  - anda sozinho (60 px em 2 s);
  - para com o mouse em cima e retoma ao tirar;
  - a seta "próxima" avança;
  - o arraste com o dedo rola e o carrossel retoma sozinho depois do toque;
  - fica parado com "reduzir movimento".
- **Revisão:** `node --check` OK; o rio não foi tocado. O critério de `docs/testes/revisao-fotos-reais.js` (15 a 45 px em 1,2 s) continua atendido, já que 30 px/s dão 36 px.

### Para o Codex
- Revisar e fazer o commit.
- Subir o `?v=` do CSS e do JS (por exemplo, `rev=3`) nas páginas, conforme o LEIA-ME.
- Push e publicação só com autorização do usuário.

## 06/10/2026 — Codex: texto da abertura e logos transparentes (CONCLUÍDO)

Pedido atual limitado à abertura, logos de cabeçalho/rodapé e cache, com commit e push para a main explicitamente autorizados. Esse pedido autoriza o envio desta entrega, apesar das restrições de publicação registradas nas etapas anteriores. Não foi executado comando de deploy nem alterado domínio/DNS.

Codex leu o handoff e conferiu o Git: main limpa, base `5953ec4`, sem implementação ou registro do Claude para este pedido. Assumiu a implementação inicial conforme o item 3 do protocolo de colaboração e concluiu a revisão técnica. Nenhuma mudança preexistente foi descartada.

### Alterações

- `index.html`, somente texto de `#inicio`: H1 “Contabilidade para entender, planejar e crescer.”; grifo em “entender, planejar e crescer.”, incluindo o ponto; dois parágrafos exatamente como pedidos, com “on-line” e destaque de peso 700. Botões, linha de confiança, destaque do Google e preços dos serviços preservados.
- `assets/img/grifo-pincel.svg`: mesmo caminho, cor e filtro do traço anterior, agora como fundo do span com `background-size:100% .35em` e as duas propriedades `box-decoration-break:clone`. SVG antigo removido apenas desse H1. Seu tamanho foi limitado a 50px, exclusivamente na abertura, porque o texto novo produzia três linhas com 56px; ficou em duas nas telas de computador pedidas. Os subtítulos mantêm a regra original de tamanho e cor.
- Dez páginas HTML: cabeçalho usa `<picture>` com logo negativa compacta (WebP/PNG, 794×200), altura 40px no computador e 34px no celular, com o alt solicitado. Nove rodapés existentes usam a negativa completa (1225×300), altura 64px. A 404 recebeu a mesma troca no cabeçalho; não possui rodapé. Links da logo mantêm foco visível e destino original.
- `assets/css/estrutura.css` e regras de logo em `site.css`: retirados fundo claro, padding de caixa e `mix-blend-mode`. Não havia SVG de pílula restante nos links; os demais SVGs foram preservados. Nenhuma sombra foi adicionada à marca; o contorno de foco existente continua funcionando.
- Oito logos de `Downloads/logos-gescomp` copiadas para `assets/img/logo/`, sem edição/conversão; dimensões, transparência e hashes conferidos. Versões coloridas ficam disponíveis para fundos claros. Os arquivos antigos permanecem intactos, inclusive a referência do JSON-LD.
- Links existentes de `site.css`, `estrutura.css`, `config.js` e `site.js` atualizados para `?v=20261006` em todas as páginas que os usam. A 404 mantém seu CSS interno e não usa esses scripts. Conteúdo de `site.js` e `config.js` não alterado.

### Conferências executadas

- Servidor Python local em 127.0.0.1:8080; Playwright em contexto próprio. Homepage em 1366×768, 1920×1080, 390×844 e 360×800, modos claro/escuro. Demais nove páginas em 1366, 390 e 360, ambos os temas: **62 combinações**.
- Sem rolagem lateral, erros de JavaScript/console local ou respostas HTTP locais ausentes. **Zero violações axe A/AA**. Instagram e VLibras simulados nessa matriz; não é uma auditoria de serviços externos nem medição de produção.
- H1 com duas linhas no computador; span do grifo com dois fragmentos nos celulares, alinhados visualmente. Dois parágrafos com a mesma fonte/cor de antes; preço ausente da abertura e mantido nos serviços.
- Logos carregadas em WebP, proporções corretas, alturas 40/34/64px, fundo transparente, alinhamento central com o menu (diferença medida de 0px), sem filtros/mistura/pílula. Reserva PNG carregou ao simular ausência de suporte WebP. Foco visível de 3px nos links, incluindo a 404.
- `node --check` nos dois scripts aprovado; busca `mix-blend-mode` em publicar sem resultados; `git diff --check` aprovado.
- Verificação contra `5953ec4`: HTML fora dos trechos autorizados, CSS fora da tipografia/grifo/logos, scripts e logo antiga preservados. O HTML de `#rio` e todas as regras/variáveis de sua cena são idênticos. Capturas em quatro larguras e dois temas: sete pares com zero pixels diferentes; no par escuro de 1366px, 12 pixels diferem em apenas 1/255 por canal, arredondamento de rasterização. Sem diferença visual da cena ou alteração de suas animações/cores.

### Evidências e reprodução

Relatórios: [matriz de páginas e foco](evidencias/2026-10-06/revisao-abertura-logo.json), [preservação, hashes e comparação do rio](evidencias/2026-10-06/preservacao-abertura-logo.json). Capturas de antes e depois nas quatro larguras e nos dois temas estão em `docs/evidencias/2026-10-06/`, com nomes `abertura|cabecalho|rodape|rio-antes|depois-light|dark-LARGURA.png`.

| Tela/tema | Abertura | Cabeçalho | Rodapé |
| --- | --- | --- | --- |
| 1366 claro | [antes](evidencias/2026-10-06/abertura-antes-light-1366.png) / [depois](evidencias/2026-10-06/abertura-depois-light-1366.png) | [antes](evidencias/2026-10-06/cabecalho-antes-light-1366.png) / [depois](evidencias/2026-10-06/cabecalho-depois-light-1366.png) | [antes](evidencias/2026-10-06/rodape-antes-light-1366.png) / [depois](evidencias/2026-10-06/rodape-depois-light-1366.png) |
| 1366 escuro | [antes](evidencias/2026-10-06/abertura-antes-dark-1366.png) / [depois](evidencias/2026-10-06/abertura-depois-dark-1366.png) | [antes](evidencias/2026-10-06/cabecalho-antes-dark-1366.png) / [depois](evidencias/2026-10-06/cabecalho-depois-dark-1366.png) | [antes](evidencias/2026-10-06/rodape-antes-dark-1366.png) / [depois](evidencias/2026-10-06/rodape-depois-dark-1366.png) |
| 360 claro | [antes](evidencias/2026-10-06/abertura-antes-light-360.png) / [depois](evidencias/2026-10-06/abertura-depois-light-360.png) | [antes](evidencias/2026-10-06/cabecalho-antes-light-360.png) / [depois](evidencias/2026-10-06/cabecalho-depois-light-360.png) | [antes](evidencias/2026-10-06/rodape-antes-light-360.png) / [depois](evidencias/2026-10-06/rodape-depois-light-360.png) |
| 360 escuro | [antes](evidencias/2026-10-06/abertura-antes-dark-360.png) / [depois](evidencias/2026-10-06/abertura-depois-dark-360.png) | [antes](evidencias/2026-10-06/cabecalho-antes-dark-360.png) / [depois](evidencias/2026-10-06/cabecalho-depois-dark-360.png) | [antes](evidencias/2026-10-06/rodape-antes-dark-360.png) / [depois](evidencias/2026-10-06/rodape-depois-dark-360.png) |

Ferramentas desta entrega em `docs/testes/`: `capturas-abertura-logo.js` (Playwright; versão depois), `revisao-abertura-logo.js` (matriz e PNG) e `verificar-preservacao-abertura-logo.py` (baseline fixo, Pillow e arquivos fornecidos). São ferramentas de conferência, sem dependências adicionadas ao site.

Nenhuma pendência de implementação nestes dois ajustes. Claude: manter a nova abertura e as logos; não reintroduzir pílula/blend/SVG inline do antigo H1. Fotos reais de Gabriela continuam pendentes, fora do escopo deste pedido. Commit e envio normal para main; consultar o Git para o hash desta entrega.

## 06/10/2026 — Codex: avaliações automáticas, Bahia e fotos distintas (CONCLUÍDO)

Git inicialmente limpo, base `531dc6c`, sem modificação simultânea do Claude identificada. Codex implementou o pedido posterior do usuário.

- Avaliações conservam a animação fracionária contínua de 30 px/s e os cinco cards originais, sem clones, com `somenteAutomatico: true`. Mouse, foco, toque, arrasto, roda e teclas não pausam nem navegam. Setas e controles de navegação manual removidos do HTML; links do Google e rolagem vertical mantidos. Proteções existentes para movimento reduzido, aba escondida e seção fora da tela permanecem.
- Teste comprovou deslocamento nativo de 28 para 772 px ao focar um link fora da faixa. Corrigido repondo a fase antes da pintura, sem reiniciar a animação: depois, 30 → 30 px, sem salto no quadro seguinte. Instagram preservado.
- Bahia incluída (SE, BA, MA, RJ, SP e MG); contador visual/acessível de 5 para 6; JSON-LD e llms sincronizados. Cidades e demais números preservados.
- 19 posições visíveis usam 19 fotografias reais distintas, sem pessoas/mãos/manequins ou retratos desenhados, com declaração CC0. Outra foto para compartilhar a inicial; assuntos usam a própria capa nos metadados. Fontes, ampliação dos recortes e hashes documentados. 28 WebP novos, máximo 142,3 KB; arquivos anteriores preservados, sem uso nas páginas atuais. Sem imagens geradas.
- Cache CSS/config/site com `?v=20261006&rev=2`. Sem frameworks, bibliotecas ou mudança do layout.

Conferências executadas:

- Dez páginas × quatro telas (1366×768, 1920×1080, 390×844 e 360×800) × dois temas: **80 combinações**, sem overflow, fotos ausentes, erros locais de console/JavaScript ou violações axe A/AA. Servidor Python e Playwright em contexto próprio. Instagram/VLibras simulados na matriz; não é medição Lighthouse nem validação de servidores terceiros.
- Ações reais de mouse/foco/arrasto/roda/teclado e eventos de toque exercitados. Após a correção, teste controlado em 1366/360 e dois temas: 32 interações mantiveram a fase e avançaram aproximadamente 30 px em 1 s. Duas voltas completas em desktop claro/celular escuro: 11/13 transferências em 140 s virtuais, mantendo os cinco originais. Movimento reduzido estável. SVG do rio retirado somente do contexto temporário dessa medição, nunca dos arquivos.
- Modo Instagram da função compartilhada: avanço automático, pausa/retomada com mouse, trava de vídeo e setas funcionaram em fixture. Módulo real do Instagram literalmente preservado.
- Rio: HTML idêntico, hash `ce2a842ce68c416b2b7a60506763b5f9672858a244435d929ba11a1e91e78c89`; CSS fora das duas regras de avaliações, módulo inicial de tema/rio, estrutura.css e libras.js literalmente preservados. Quatro pares de PNG (1366/360, claro/escuro) idênticos pixel a pixel.
- `node --check` nos scripts e `git diff --check` antes do commit. Depoimentos e preços preservados.

[Matriz](evidencias/2026-10-06/avaliacoes-fotos/matriz-paginas.json), [carrossel controlado](evidencias/2026-10-06/avaliacoes-fotos/carrossel-controlado.json), [preservação/hashes](evidencias/2026-10-06/avaliacoes-fotos/preservacao-e-fotos.json), [fontes](imagens-reais-fontes.md) e [folha de contato](evidencias/2026-10-06/avaliacoes-fotos/contato-fotos-cc0.jpg).

Capturas em `docs/evidencias/2026-10-06/avaliacoes-fotos/`: `servicos|avaliacoes|numeros|informacoes|rio-antes|depois-light|dark-1366|360.png`. Serviços: [antes](evidencias/2026-10-06/avaliacoes-fotos/servicos-antes-light-1366.png) / [depois](evidencias/2026-10-06/avaliacoes-fotos/servicos-depois-light-1366.png). Avaliações: [antes](evidencias/2026-10-06/avaliacoes-fotos/avaliacoes-antes-light-1366.png) / [depois](evidencias/2026-10-06/avaliacoes-fotos/avaliacoes-depois-light-1366.png). [Celular](evidencias/2026-10-06/avaliacoes-fotos/avaliacoes-depois-light-360.png).

Arquivos: dez HTML, site.js, config.js, site.css (só avaliações), llms.txt, 28 WebP, LEIA-ME, docs/imagens*.md, ferramentas/evidências, handoff e colaboração. Claude: manter avaliações exclusivamente automáticas e fotos distintas com fontes CC0. Fotos reais da Gabriela/escritório continuam pendentes da cliente; nenhuma pendência de código deste pedido. Commit/push normal para main conforme autorização já registrada; consultar o Git para o hash. Sem deploy manual ou mudança de DNS.

## 06/10/2026 — Codex: texto aprovado de Quem é a Gabriela (CONCLUÍDO)

Pedido direto do usuário aplicado em `publicar/index.html`: substituídos os dois parágrafos pelos quatro fornecidos, exatamente, com nome completo e CRC em `<strong>`. Título, classes/estilos, moldura da foto, citação lateral e credenciais mantidos. Cópia da seção sincronizada em `conteudo/01-index.md`; demais textos desse arquivo não foram revisados.

Git limpo na base `c5e0d71`, sem alterações simultâneas de outro agente. Conferência local no navegador em 1366×768, 1920×1080, 390×844 e 360×800, ambos os temas: oito combinações sem rolagem lateral ou corte do texto; quatro parágrafos e dois trechos em negrito conferidos. Comparação comprovou HTML fora de #sobre literalmente idêntico e igualdade do texto publicado com a cópia Markdown. Sem mudanças em CSS/JS ou imagens. Capturas do rio antes/depois em claro/escuro preservadas em `docs/evidencias/2026-10-06/texto-gabriela/`, junto às capturas da seção e relatórios.

Arquivos: index.html, conteudo/01-index.md, evidências desta alteração e registros de colaboração. Nenhuma pendência deste pedido. Fechamento com commit/push normal para main conforme autorização vigente; sem deploy manual/DNS.


## 06/10/2026 — Codex: novos assuntos, carrosséis no celular e SEO (REVISADO LOCALMENTE)

Base `da4904d`, main inicialmente limpa; handoff e estado do Git examinados, sem alterações simultâneas de outro agente identificadas. Pedido atual implementado pelo Codex. Não foram executados commit, push, deploy, cadastro no Google ou mudanças de conta/DNS/segurança nesta rodada.

### Implementação

- Informações mantém os sete assuntos existentes e ganha dois cards/artigos: `/fim-escala-6x1` e `/novo-limite-mei`. Ambos têm autoria, fontes oficiais, data de consulta real (06/10/2026), perguntas frequentes, links relacionados e WhatsApp contextual. O artigo da escala distingue PEC em discussão de regra vigente; o de MEI distingue o teto geral vigente de R$ 81 mil dos projetos PLP 108/2021 e PLP 186/2026. A tramitação deve ser consultada novamente em futuras revisões.
- Corrigido erro comprovado no painel sobre reforma: CBS substitui PIS/Cofins, não IPI. Texto, diagrama, FAQ e JSON-LD sincronizados, com fonte oficial da PGFN. Demais valores/prazos dos artigos antigos não passaram por uma nova auditoria tributária completa.
- Instagram: até 779px, setas ocultas por CSS e pelo estado JS; navegação nativa pelo dedo. Computador mantém setas. Pausas, retomadas e regras dos vídeos preservadas.
- Avaliações: 30 → 36 px/s (+20%); no celular os cards diminuem 24px: 260px em tela de 360, 290px em 390. Mesma altura por tela, cinco depoimentos reais, sem quantidade de avaliações, setas, clones ou pausa por interação. Proteções de movimento reduzido, aba oculta e seção fora da tela preservadas.
- SEO: títulos/descrições, canonical, Open Graph/Twitter e JSON-LD revisados. Person identifica Gabriela como autora; publisher Organization nos artigos; AccountingService completo na inicial. CollectionPage/ItemList contém os nove assuntos. Sitemap sincronizado com 11 URLs indexáveis e última alteração real; llms sincronizado. Sem AggregateRating/Review, palavras-chave ocultas ou schema especial de IA. Robots e 404 indexação preservados.
- Cache dos CSS/config/site existentes: `?v=20261006&rev=3`. Quatro fotos editoriais reais adicionais, CC0, sem pessoas e com originais distintos dos vinte anteriores. Seis WebP novos de até 90.806 bytes. Fontes/tamanhos/hashes em [imagens-reais-fontes.md](imagens-reais-fontes.md) e [manifesto](evidencias/2026-10-06/seo-informacoes/fontes-fotos.json).

### Conferências executadas

- Python HTTP local, Playwright em contexto separado: 12 páginas (11 indexáveis + 404) × 4 telas (1366×768, 1920×1080, 390×844, 360×800) × claro/escuro = **96 combinações únicas**. Zero rolagem lateral, imagens ausentes, placeholders visíveis, erros locais de console/JS ou violações axe A/AA no resultado final. Instagram/VLibras simulados nessa matriz; fontes reais carregadas. Não é Lighthouse, Rich Results Test do Google ou medição de produção.
- Houve 16 falhas iniciais de contraste no CTA dos dois novos artigos, causadas por uma regra ampla de parágrafo. A regra foi limitada aos parágrafos das seções; os 16 casos passaram no reteste. H1 do artigo 6x1 encurtado e mais oito casos repetidos, com duas linhas no computador. **120 execuções** no total, sem repetir os 80 casos não afetados. [Matriz final](evidencias/2026-10-06/seo-informacoes/matriz-paginas.json), inicial e retestes preservados.
- Instagram real (SDK/iframes da Meta), Chrome móvel 360px com toque: gesto iniciado dentro do vídeo deslocou a faixa de 4 para 314px, com setas ocultas e iframe em estado pronto; zero pageerrors. VLibras simulado somente nesse teste. [Resultado](evidencias/2026-10-06/seo-informacoes/instagram-arraste-real.json). Avisos externos de cabeçalhos da Meta não são uma falha corrigível nestes arquivos e não foram tratados como aprovação de produção.
- Avaliações em 1366/360, ambos os temas: 32 interações preservaram a fase e deslocamento aproximado de 36px em 1s. Em 140s virtuais, 13/17 transferências de cards (desktop claro/celular escuro), mantendo os cinco originais. Sem setas e estáveis com movimento reduzido. Cena SVG retirada apenas do contexto temporário dessa medição para limitar o custo de rasterização. [Resultado](evidencias/2026-10-06/seo-informacoes/carrossel-controlado.json).
- Validação estática: 11 títulos/canonicals coerentes e únicos, imagens e links locais existentes, artigos/autoria/breadcrumbs consistentes, sitemap igual ao conjunto de canonicals, ausência de domínios antigos em publicar, fotos distintas. [Resultado](evidencias/2026-10-06/seo-informacoes/seo-estatico.json). HTML da inicial fora do head literalmente preservado, exceto parâmetros de cache. `node --check` em site.js/config.js/libras.js e `git diff --check` aprovados; busca de domínios antigos e mix-blend-mode sem resultados em publicar. [Conferências finais](evidencias/2026-10-06/seo-informacoes/conferencias-finais.json).
- Rio: HTML, regras da cena/variáveis e módulo inicial de tema/animação idênticos à base. estrutura.css, config.js, libras.js e _headers também literalmente preservados. Capturas iniciais a 800ms pegaram a transição escura de 1,6s em fases diferentes; foram mantidas como evidência. Comparação repetida após a transição, SVG pausado em t=0, com a versão anterior reconstruída em memória do Git: três pares sem um pixel diferente; claro 360 com apenas dois pixels e variação máxima de 3/255 por canal, compatível com arredondamento de rasterização. Mesmos tamanhos e aparência da seção. [Comparação](evidencias/2026-10-06/seo-informacoes/rio-comparacao.json).

Capturas em `evidencias/2026-10-06/seo-informacoes/`: `rio-estavel-antes|depois-light|dark-1366|360.png`, `informacoes|fim-escala-6x1|novo-limite-mei|avaliacoes-depois-light|dark-1366|360.png`. [Painel no computador](evidencias/2026-10-06/seo-informacoes/informacoes-depois-light-1366.png), [MEI no celular](evidencias/2026-10-06/seo-informacoes/novo-limite-mei-depois-dark-360.png), [avaliações no celular](evidencias/2026-10-06/seo-informacoes/avaliacoes-depois-light-360.png).

Ferramentas em `docs/testes/`: `verificar-seo-informacoes.py`, `revisao-seo-informacoes.js`, `carrossel-seo-informacoes.js`, `instagram-arraste-real-mobile.js`, `capturas-seo-informacoes.js`, `capturas-rio-estavel-seo.js` (template com baseline do Git), `comparar-rio-seo-informacoes.py`. `preparar-informacoes-seo.py` documenta a preparação pontual; contém proteção contra repetição sobre a entrega. Não é build nem deve ser executado novamente nos arquivos atuais.

### Arquivos e pendências

Onze HTML de publicar alterados/adicionados; site.css, site.js, sitemap.xml, llms.txt; seis WebP; LEIA-ME, imagens.md, imagens-reais-fontes.md, google-search-console.md, ferramentas/evidências e registros de colaboração. Nenhuma dependência adicionada ao site.

A entrega está local e revisável. Após publicar: seguir [google-search-console.md](google-search-console.md), verificar a propriedade com o TXT específico da conta, enviar sitemap e testar as URLs publicadas. Não existe garantia de posição, indexação ou recomendação em respostas de IA. O teste do Googlebot, o cadastro e métricas reais dependem da conta e da publicação.

A auditoria anterior encontrou HTTP sem redirecionamento para HTTPS, endereço alternativo público e falha de resolução de www. Consolidação dessas versões e políticas Cloudflare continuam pendentes; não foram alteradas sob o pedido anterior de análise sem execução. Retratos reais de Gabriela/escritório e aprovações de contratação continuam dependendo da cliente.

Claude: preservar o rio, avaliações exclusivamente automáticas e fontes/fotos distintas; manter projetos separados de leis vigentes. Não atualizar datas/limites apenas para parecer conteúdo novo. Nenhuma pendência de código comprovada nesta rodada.

### Fechamento solicitado pelo usuário — 06/10/2026

Usuário pediu o commit da entrega e orientou deixar o roteiro quieto por enquanto. Arquivo google-search-console.md mantido exatamente como estava, sem novas edições ou execução das etapas. Commit local na main; nenhum push/deploy neste fechamento. Conferência de diff aprovada; testes da entrega registrados acima permanecem válidos, sem alterações adicionais no código.

## 06/10/2026 — Codex: publicação e execução do roteiro, etapa 1

Novo pedido autoriza explicitamente dois commits/pushes para main e a execução do roteiro. Verificado Git limpo na base 5d0f72e, main remota ainda em da4904d após fetch. No site publicado, CSS/JS rev=2 e setas visíveis em 390px: a revisão anterior estava somente local.

Regra do Instagram passa a abranger até 779px e aparelhos de toque sem hover, inclusive celular horizontal. CSS oculta controles e JS sincroniza hidden ao redimensionar ou mudar a capacidade de entrada. Setas do computador e arraste nativo preservados; avaliações não alteradas. Cache dos assets existentes rev=4 em onze páginas (404 não usa esses assets).

Testes locais: 18 combinações de larguras/temas/entrada e duas mudanças de largura, todas aprovadas. 360/390/844/1024 com toque sem setas; computador 780/1366/1920 com setas; 390/779 sem setas. Gesto real iniciado no iframe desloca 310px, sem pageerrors. Verificação estática: doze HTML idênticos à base exceto cache, CSS alterado apenas nessa regra, módulo inicial de tema/rio, config e Libras preservados. node --check e diff --check aprovados. [Setas](evidencias/2026-10-06/publicacao-search/instagram-setas.json) e [arraste](evidencias/2026-10-06/publicacao-search/instagram-arraste-real.json).

Primeiro commit/push inclui a entrega anterior já comprometida e esta correção. A etapa Google será registrada separadamente após conferir o site publicado. O usuário esclareceu que a propriedade sc-domain:gescompnegocios.com.br já existe; DNS público já contém google-site-verification. Não criar propriedade ou TXT duplicados. Search Console nas ferramentas abriu sem autenticação. A sessão Cloudflare disponível identifica outra conta; conferir vínculo do domínio antes de qualquer alteração de conta/DNS.

## 06/10/2026, 18:50 — Claude: otimização de desempenho (CONCLUÍDO)

Pedido do usuário: otimizar a velocidade do site no celular (PageSpeed), sem mudar a aparência, os textos, as cores nem remover animações, e fazer o commit de tudo no final.

Codex: arquivos liberados.

Encontrei na árvore de trabalho a sua rodada de fontes locais ainda sem commit (`assets/css/fontes.css`, `assets/fonts/`, as `<link>` de fonte nas 12 páginas, `rev=5` e o `priceRange` do JSON-LD da inicial). Mantive tudo e vou incluir no meu commit, ajustando só o que for necessário.

Linha de base (produção, Lighthouse móvel, 3 execuções, máquina ruidosa): desempenho 30, 76 e 80; FCP 3,3 a 3,4 s; LCP 3,7 a 7,9 s; Speed Index 5,1 s; TBT de 0 a 5.240 ms; CLS 0. O LCP é o `<h1>` da abertura. O atraso vem de CSS bloqueante (Google Fonts, `site.css`, `estrutura.css`) e de bytes disputando a banda (fotos de 1200 px mostradas em 362 px).

### Entregue (commit único com a rodada de fontes locais do Codex)
- Fontes locais com `@font-face` reduzido de 20 para 5 blocos (`fontes.css` de 8 KB para 2 KB).
- Fotos, logos e glifo do WhatsApp em tamanhos menores com `srcset`/`sizes` (script `docs/testes/gerar-variantes-imagens.py`); página inicial de 460 para 280 KB.
- VLibras carregado após o `load` (`libras.js`); primeira medição do botão flutuante no próximo quadro (`site.js`).
- `_headers`: fontes 1 ano immutable; imagens e ícones 30 dias. `rev=6` nas páginas.
- Medição local (Lighthouse móvel, execução alternada): FCP de 3,0 s para 1,3 s; LCP de 4,2 s para 2,4 s; bytes de 461 para 279 KB. TBT e Speed Index variam muito nesta máquina (de 200 a 3.900 ms); o pico vem do primeiro layout da página e do VLibras.
- Rio intacto (HTML da seção igual). Não tocado: Cloudflare Web Analytics (beacon injetado pela Cloudflare, pode ser desligado no painel).
- Pendência para medir em produção: rodar o PageSpeed de novo depois da publicação.

## 06/10/2026 — Claude: três assuntos na faixa de Informações da inicial (CONCLUÍDO)

Pedido da Gabriela, via usuário: mostrar na faixa antes de "Dúvidas que nossos clientes sempre têm" também os assuntos Fim da escala 6x1 e Projeto de novo limite para MEI.

- **`index.html`:** o card único virou `.info-painel`, com cabeçalho e lista `.info-destaques` de três links.
  - Cabeçalho: ícone, título "Informações para a sua empresa", o mesmo texto e o mesmo botão "Ler as informações".
  - Reforma tributária leva a `/informacoes#reforma-tributaria`. Os resumos dos outros dois vêm dos cards existentes em `informacoes.html`.
  - Etiquetas: "Em transição desde 2026" e "Proposta em tramitação" (projetos separados das regras em vigor).
- **`site.css`:** bloco "Destaques de Informações". Três colunas a partir de 900 px, uma coluna abaixo disso e linhas compactas com seta abaixo de 640 px. Subida de 2 px e seta deslizando só sem "reduzir movimento".
- **Cache:** `rev=7` em todas as páginas.
- **Testes:** 6 larguras (360 a 1920 px) × claro/escuro, com axe AA 0, sem rolagem lateral e sem erros. Os três links respondem 200. O rio está idêntico ao `d03b023`.

## 06/10/2026 — Claude: faixa de Informações refeita como lista editorial (CONCLUÍDO)

O usuário reprovou o `.info-painel` (caixa grande, ícone, descrição, cards brancos e etiquetas em pílula), que achou com "cara de IA".

- **Formato:** escolhido por ele, `.mudancas` é um `h2.titulo-secao` ("O que está mudando e pode impactar sua empresa") seguido de uma lista numerada 01/02/03.
  - Cada item tem título em Bricolage, uma frase de resumo e "Ler artigo →".
  - Os fios de 1,5 px `var(--linha)` são os mesmos do FAQ.
  - A largura de 860 px alinha o título com "Dúvidas…".
- **Layout:** três colunas a partir de 700 px; no celular, lista com seta à direita.
- **CSS:** o bloco `.info-*` foi removido do `site.css`.
- **Cache:** `rev=8` em todas as páginas.
- **Regra do usuário para os dois agentes:** não usar etiquetas tipo pílula com borda arredondada, caixas grandes em volta de pouco conteúdo nem descrições que repetem o que os itens já dizem. Preferir padrões editoriais de mercado.
- **Testes:** 6 larguras × claro/escuro, com axe AA 0, sem rolagem lateral e sem erros. Os três links respondem 200. O rio está idêntico.

## 06/10/2026 — Codex: Search Console, Cloudflare e fechamento da rodada de fontes

Pedido mais recente restringe esta continuação a Google/Cloudflare e ao código que já estava pendente. Releitura do handoff e Git: Claude concluiu/publicou `d03b023` (desempenho), `e374ef2` e `4ca2d45` (faixa editorial). Suas entregas são preservadas; esta continuação não altera HTML, CSS do site, JS publicado, imagens, textos ou #rio.

### Contas e sitemap: execução real

- Usuário autenticou manualmente `gescompnegocios@gmail.com` no Chrome temporário dedicado. Nenhuma senha, cookie ou token foi incluído no projeto. Search Console confirmou proprietário verificado da propriedade de Domínio; TXT preexistente preservado.
- A inscrição original do sitemap retornava “Não foi possível buscar”, apesar de XML válido/200/application/xml. Teste publicado **do próprio Google** do XML confirmou rastreamento permitido e busca bem-sucedida. Reenviar o endereço original não eliminou o erro.
- Enviado `https://gescompnegocios.com.br/sitemap.xml?v=20261006`: **Processado, 11 páginas, 0 vídeos**, envio/leitura em 06/10. Inscrição antiga removida do painel somente depois de confirmar a nova; nenhum XML ou conteúdo excluído. `robots.txt` aponta agora para o endereço processado. XML/canonicals literalmente preservados. Hipótese de estado anterior de busca/processamento não é uma causa interna comprovada.
- Quatro testes publicados passaram: inicial, Informações, escala 6x1 e limite MEI. As primeiras solicitações manuais retornaram erro genérico do Google: não declaradas como aceitas. Conferência posterior da inicial: **“O URL está no Google” / “A página está indexada”**, HTTPS. Não afirmar que as outras dez páginas já estão indexadas só porque aparecem no sitemap.
- Verificados: IA generativa em **Incluir**, nenhum problema nos relatórios de Ações manuais/Problemas de segurança; relatório de Páginas ainda processando dados. Core Web Vitals sem dados reais suficientes. As ações do Google são comprovadas pela interface da conta, não por user-agent de teste.

### Cloudflare

- Conta correta da GESCOMP, certificados de domínio/wildcard ativos. Ativado **Always Use HTTPS**.
- Adicionado CNAME `www` para domínio oficial, **proxied**, TTL automático; preservados os registros de e-mail/verificação.
- Single Redirect ativo “GESCOMP: www para dominio oficial”: `http*://www.gescompnegocios.com.br/*` → `https://gescompnegocios.com.br/${2}`, **301**, preservar query string.
- Conferência pública: HTTP da raiz → HTTPS 301; HTTP e HTTPS de www → domínio oficial 301, com caminho/parâmetros idênticos; sitemap 200, rota inexistente 404. XML acessível ao Google confirmado pelo teste real e processamento.
- Sessão CLI Wrangler de outra conta mantida intacta; configuração realizada no painel autenticado correto. Consulta CLI anterior em cloudflare-acesso.json é histórica e não significa falta de acesso da conta atual.
- Nenhuma regra adicional de WAF/rate limit nem execução das melhorias de segurança da auditoria. Endereço alternativo de hospedagem mantém canonical oficial e permanece público; não foi desligado. `_redirects` de Workers assets não resolve redirects entre domínios.

### Código pendente já integrado pelo Claude e conferências anteriores

A rodada de fontes do Codex foi incorporada ao commit `d03b023` do Claude: cinco WOFF2 originais do Google, **151.044 bytes**, duas licenças OFL, links/preload locais e priceRange com os preços já publicados. Claude reduziu os 20 blocos @font-face a cinco faces variáveis e aplicou suas otimizações de imagens/VLibras. Não revertê-las. Adicionada proteção em preparar-fontes-search.py para impedir reexecução que sobrescreveria esse CSS otimizado.

Evidências antes dessa integração, preservadas em publicacao-search:

- Matriz local **rev=5**, 12 páginas × quatro telas × dois temas = 96 combinações; sem overflow, imagens faltantes, placeholders, erros locais ou violações axe A/AA. Meta/VLibras simulados nessa matriz. Não valida a revisão visual rev=8 do Claude.
- Rio literalmente preservado em HTML/CSS/módulo inicial na rodada de fontes; comparação estabilizada: três pares de capturas idênticos e claro 360 com dois pixels variando no máximo 3/255 por canal. Comparação estrita inicial detectou esses pixels; limite explícito está registrado. Nenhuma alteração na cena.
- Lighthouse em produção rev=4: primeira execução falhou NO_FCP, repetição completou com **77 desempenho / 100 acessibilidade / 96 boas práticas / 100 SEO**, FCP 3,4s, LCP 4,1s, CLS 0. Teste local da rodada de fontes registrou 62/100/96/100; redes/carga da máquina diferentes, não é comparação de ganho nem comprovação de Core Web Vitals.
- Rich Results Test real do Google encontrou dois itens válidos antes do priceRange; aviso opcional de preço motivou o campo. Não declarar que esse aviso desapareceu sem novo teste publicado.

O verificar-fontes-search.py é específico da base 0e84408/rev=5 e do CSS original com 20 faces. Seus resultados ficam como registro histórico; não executá-lo contra o código posterior do Claude como critério de aceite atual.

Conferência final atual: 11 URLs publicadas com HTTP 200, canonical correspondente e sem noindex/X-Robots-Tag de bloqueio; XML com/sem versão idêntico; redirects 301 preservam parâmetros; rota inexistente 404. Node syntax check em site/config/libras e ferramenta CDP, diff --check aprovados. Hashes dos cinco WOFF2 e duas licenças conferidos, cinco faces otimizadas preservadas. Proteção da preparação interrompe a reexecução antes de rede/escrita, CSS inalterado. Duas verificações do teste precisaram ajuste (menção de @font-face no comentário e codificação de acentos do pipe PowerShell); problemas do teste, sem alteração do CSS. Escopo contra HEAD 4ca2d45: em publicar, somente o ponteiro do sitemap em robots.txt muda. [Resultado estático](evidencias/2026-10-06/publicacao-search/conferencia-final-estatica.json), [HTTP](evidencias/2026-10-06/publicacao-search/http-canonicals-antes-push.json), [painéis reais](evidencias/2026-10-06/publicacao-search/google-cloudflare-paineis.json).

Arquivos desta continuação: robots.txt; LEIA-ME; google-search-console.md; proteção da ferramenta de fontes; ferramentas de conferência dos painéis, evidências e registros de colaboração. Sem dependência de execução nova. Código da cena, formulário, carrosséis e conteúdo do Claude preservados.

Após a publicação, conferir robots e redirects novamente. Acompanhar indexação das demais páginas e métricas quando o Google tiver dados. Revisão do Perfil da Empresa, eventual tratamento do hostname alternativo, fotos reais da cliente e respostas de contratação continuam decisões/insumos separados. Sem promessa de posição ou recomendação pela IA. Fechamento autorizado com commit/push normal para main, sem deploy manual.

**Fechamento efetivo:** commit `5e7d850`, push normal main confirmado; referências local/remota iguais e árvore limpa após envio. Publicação automática conferida: versão nova de robots disponível, mas URL normal inicialmente com cópia antiga no CDN. Custom Purge restrito a **https://gescompnegocios.com.br/robots.txt**, resposta Cloudflare de sucesso. Reteste da URL normal já indica sitemap com ?v=20261006; XML HTTP 200, 11 URLs, redirects HTTP/www 301. Nenhum purge de todo o site/política de cache. [Confirmação](evidencias/2026-10-06/publicacao-search/confirmacao-publicacao.json). Complemento documental registrado em commit separado para preservar o histórico já enviado.
