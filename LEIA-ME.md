# Site da GESCOMP

HTML, CSS e JavaScript puros, sem framework, bibliotecas adicionais ou etapa de build. Responsável técnica: **Gabriela do Nascimento Vieira — CRC 009186/SE**.

```text
02-site/
├── publicar/                  arquivos servidos pelo Cloudflare Worker
│   ├── *.html                 página inicial, informações e 404
│   ├── assets/css/            site.css e estrutura.css
│   ├── assets/js/             config.js, site.js e libras.js
│   ├── assets/img/fotos/      imagens dos cards e futuros retratos reais
│   └── sitemap.xml, robots.txt, llms.txt, site.webmanifest, _headers
├── conteudo/                  cópias de textos para revisão
├── design/                    arquivos de referência anteriores
└── docs/                      handoff, imagens, aprovação e evidências
```

## Domínio e hospedagem

O domínio oficial é **https://gescompnegocios.com.br/**. Canonical, compartilhamento, JSON-LD, sitemap, robots e llms usam esse endereço. Em 06/10/2026, HTTPS e www foram consolidados na Cloudflare com redirecionamentos 301. A propriedade do Search Console está verificada, a inicial está indexada e `https://gescompnegocios.com.br/sitemap.xml?v=20261006` foi processado com 11 páginas. Resultados e acompanhamento em [google-search-console.md](docs/google-search-console.md).

Hospedagem existente: Cloudflare Workers, Worker `gescomp-site`, com integração ao GitHub. Somente `publicar/` é servida; `docs/`, `conteudo/`, `design/` e os dados privados da empresa não são publicados. Não há comando de build. Verificação e roteiro externo em [roteiro-de-atualizacao.md](docs/roteiro-de-atualizacao.md).

O pedido posterior de 06/10/2026 autoriza Codex a revisar, fazer commit e push normal para main e configurar Search Console/Cloudflare. A integração existente publica após o push; esta rodada não executa deploy manual. As alterações recentes de desempenho e da faixa de Informações feitas pelo Claude são preservadas.

## Executar localmente

```bash
cd 02-site/publicar
python3 -m http.server 8080
```

No Windows deste ambiente, use `py -3 -m http.server 8080 --bind 127.0.0.1` na mesma pasta. Abra http://127.0.0.1:8080/ e encerre com Ctrl+C. O servidor Python serve as páginas internas com `.html` (por exemplo, `/mei.html`). Os endereços sem extensão do site são tratados pelo Cloudflare; o servidor Python não reproduz esse roteamento nem `_headers`.

Para testar também o comportamento da hospedagem, o Wrangler já disponível pode servir `publicar/` localmente. Não é uma dependência do site.

## Estrutura da página

A página segue esta ordem: abertura → Como podemos ajudar (`#servicos`) → Como funciona (`#como-funciona`) → números → Quem é a Gabriela (`#sobre`) → avaliações → Instagram → faixa de Informações e dúvidas → chamada final → `#rio` → contato → rodapé.

Abertura sem gráfico nem selos: a foto real de Gabriela aparece somente no computador, depois de entregue e liberada em config.fotos. Enquanto ela não chega, `.abertura-prova` mostra a nota e um depoimento real configurados em `avaliacoes`; `destaque` escolhe o nome completo da lista. Sem itens válidos, o destaque também fica escondido. A futura foto substitui esse card. `#como-funciona` tem três passos e um convite para conversar sobre troca de contador, sem prometer condições ainda não aprovadas.

Sobre usa `.gabriela-midia` e `.gabriela-citacao`: a frase do texto original da empresa aparece enquanto a foto real está pendente. Depois de liberada, a foto fica acima dela. O carregamento imediato dessa moldura evita que o estado oculto impeça a carga. A versão em primeira pessoa permanece em [rascunhos para aprovação](docs/perguntas-para-aprovar.md).

Serviços com três cards fotográficos e cinco linhas de Outros serviços. Cards, capas de Informações, 404 e compartilhamento usam fotos reais distintas da web, sem pessoas, guardadas localmente; licenças e fontes em [imagens-reais-fontes.md](docs/imagens-reais-fontes.md). A grade reúne nove assuntos em três colunas amplas, duas no tablet e uma no celular. O painel e seus nove artigos têm autoria e `.cta-contexto`, com a mensagem do WhatsApp correspondente ao assunto. Inclui `/fim-escala-6x1` e `/novo-limite-mei`, que distinguem propostas das regras vigentes e identificam fontes oficiais consultadas em 06/10/2026. Requisitos em [imagens.md](docs/imagens.md); revisão em [handoff.md](docs/handoff.md).

A faixa de Informações da inicial é uma lista editorial (`.mudancas`): título "O que está mudando e pode impactar sua empresa" e três artigos numerados — Reforma tributária (`/informacoes#reforma-tributaria`), Fim da escala 6x1 e Novo limite do MEI —, com fios finos como o FAQ logo abaixo. Sem caixa, ícone, descrição nem etiquetas (pedido do usuário). Três colunas a partir de 700 px; no celular, lista com seta à direita.

**O rio é protegido:** preservar animações, cores, filtros da cena, enquadramento e aparência em claro/escuro. O usuário confirmou duas áreas de ajuste implementadas pelo Claude: placa “GESCOMP” na casa e correção da onda (cobertura da borda e retirada do filtro só do path de transição, para ficar liso). A validação estática compara todo o restante com o commit base. Os prints ficam em `docs/evidencias/2026-10-04/`.

## Tokens de CSS

| Grupo | Valores solicitados |
|---|---|
| Fontes | Bricolage Grotesque nos títulos; Figtree no corpo |
| Corpo | 16px; destaque 17px; linha 1.6; leitura até 65ch |
| Títulos | H1 `clamp(34px,4.2vw,56px)`, peso 700; H2 `clamp(26px,2.8vw,38px)`; H3 20–22px; linha 1.15 |
| Espaços | escala de 4/8px; seções 80–96px no desktop, 48–64px no celular; gap de cards 24px |
| Container | 1180px, margens laterais de 24px |
| Botões | altura 48px; padding 12px 22px; fonte 15–16px; raio 12px; secundário com borda de 2px |
| Cards | raio 20px; borda de 1px; sombra suave; hover de 2px, desligado com movimento reduzido |
| Marca | petróleo profundo `#003F4A`, petróleo vibrante `#0A7A82`, verde-água `#E3F4F2`, borda `#BFE6E2`, laranja `#F28A1E`, terracota `#C4572A`, âmbar `#FFB547` |
| Contraste | branco no petróleo vibrante; petróleo profundo no laranja; terracota só em detalhes ou texto grande em negrito; AA em claro/escuro |
| Desenho | rio, sublinhado da abertura, moldura da Gabriela, até duas ondas e WhatsApp flutuante |

Os tokens estão no bloco “Etapa 2” de `site.css`: `--fs-*`, `--lh-*`, `--leitura`, `--container`, `--margem`, `--secao-y`, `--gap-cards`, `--raio-btn`, `--raio-card` e cores. Classes principais: `.container`, `.secao`, `.titulo-pagina`, `.titulo-secao`, `.titulo-card`, `.texto`, `.texto-destaque`, `.abertura*`, `.ajuda-*`, `.gabriela-*` e `.foto-moldura`.

Não recolorir o rio para aplicar a paleta. A chamada imediatamente anterior mantém `#0B5963` e a onda do rio mantém 90px para preservar sua transição; as demais ondas têm 56px. Cabeçalho e rodapé também usam `estrutura.css`. Logo com 42px no computador e 40px no celular; margens de 16px no cabeçalho móvel permitem três controles de 48px em 360px. As seções continuam com margens de 24px.

A revelação ao rolar usa `data-revelar`: `site.js` aplica `js-revelar` na raiz e depois `revelado` no item, uma única vez. O CSS faz fade-up de até 400ms, visível sem JS e com movimento reduzido. Não aplicar à seção `#rio`, a seus descendentes ou a um ancestral dela.

## WhatsApp e formulário

Telefone configurado: (79) 98877-1430. E-mail de fallback: escritoriogescomp@gmail.com. Ambos ficam em `publicar/assets/js/config.js`.

`data-whatsapp` usa `mensagemPadrao`. Cada card/linha usa `data-whatsapp-msg` com uma das chaves abaixo, todas começando com “Olá, equipe GESCOMP! Vim pelo site e”:

| Chave | Ação |
|---|---|
| `abrirEmpresa` | abrir meu CNPJ |
| `contabilidade` | contratar contabilidade |
| `impostoRenda` | declarar meu IR |
| `regularizarBaixa` | regularizar ou dar baixa no CNPJ |
| `trabalhista` | calcular verbas trabalhistas |
| `regime` | escolher o regime de impostos |
| `mei` | deixar de ser MEI |
| `consultoria` | consultar sobre gestão administrativa e financeira |

O HTML usa as oito chaves acima. Preços visíveis e ofertas do JSON-LD precisam permanecer alinhados: contabilidade a partir de R$ 150/mês, IR e cálculos a partir de R$ 100. Não criar outros preços.

O cabeçalho e as chamadas têm `data-whatsapp` e recebem a mensagem padrão via JS. A faixa “Falar com a GESCOMP” abre o WhatsApp direto. Links de navegação ao contato continuam sendo âncoras.

O formulário abre uma mensagem com nome e assunto. Telefone e mensagem são opcionais; linhas vazias são omitidas. HTML e JS estão sincronizados, com rótulo “Telefone ou WhatsApp (opcional)”. Sem WhatsApp configurado, o envio usa o e-mail. Nenhum dado do formulário é armazenado pelo site.

## Avaliações

Em `config.js`, `avaliacoes` contém `linkAvaliar`, `linkVerTodas`, `nota`, `total`, `destaque` e `itens: [{ nome, texto, estrelas, link }]`. Cinco textos reais foram conferidos no perfil em 04/10/2026, com autorização do usuário. O resumo exibe apenas “5 estrelas no Google”, sem quantidade; total fica null. `destaque` escolhe o nome completo do depoimento da abertura, que usa a mesma nota/texto/link da lista. Os links levam ao perfil de origem. Fonte e trechos em [avaliacoes-google-ampliadas.json](docs/evidencias/2026-10-04/avaliacoes-google-ampliadas.json).

- A seção fica escondida sem itens válidos. Cada item precisa de nome, texto e estrelas inteiras de 1 a 5; dados incompletos não recebem uma nota inventada.
- O site mostra só primeiro nome e inicial do último sobrenome, sem foto. As estrelas têm texto acessível, por exemplo “5 de 5 estrelas”. O texto é inserido por `textContent`.
- `link` válido gera “Ver avaliação no Google”. `linkAvaliar` e `linkVerTodas` controlam seus botões, escondidos quando vazios ou inválidos. São aceitos somente links HTTPS do Google ou seus encurtadores conhecidos.
- Somente a nota válida aparece no resumo. Não publicar a quantidade nem adicionar `AggregateRating` ou `Review` no JSON-LD.
- Avaliações de teste devem existir só no navegador de teste, nunca na configuração publicada.

## Carrosséis e movimento

Instagram e avaliações usam a mesma função `criarCarrossel`, com `data-carrossel`, `data-carrossel-trilha` e `data-slide`. No Instagram, as setas, o `tabindex="0"` da lista e o aviso `aria-live="polite"` permitem navegação manual. As avaliações não têm esses controles; seus links para o Google continuam acessíveis por teclado.

Instagram passa a cada 8s com rolagem suave. Avaliações usam `continuo: true`, `velocidade: 36` (px/s, 20% acima da versão anterior) e `somenteAutomatico: true`, com a mesma animação fracionária e ciclo sem salto: o primeiro card já fora da tela é movido para o fim e a rolagem compensada. Não há cópias de avaliações ou links duplicados. Cards mantêm largura/altura comuns por tela; até 779px, a largura é `min(320px, 100vw - 100px)`: 260px em 360 e 290px em 390, com altura mínima de 320px. A pedido do usuário em 06/10, não existem setas em nenhuma largura; mouse, foco, toque, roda e teclas não pausam nem navegam nas avaliações. Arrastar horizontalmente não muda a faixa; rolar a página verticalmente continua funcionando. O foco em um link fora da faixa não desloca a fase da animação.

O Instagram mantém as pausas com mouse, foco, iframe e toque; depois do toque, espera 6s. Até 779px ou em aparelho de toque sem hover, `ocultarSetasNoCelular` e CSS escondem as setas; o usuário passa com o dedo, inclusive iniciando o gesto no iframe. No computador, as setas continuam funcionando; teclas ←/→ também permanecem disponíveis. Sem botão Pausar. Ambos preservam as proteções existentes para aba escondida, seção fora da tela e movimento reduzido. Com poucos itens, a função usa a passagem convencional; se todos couberem, permanece parada.

Os links do Instagram ficam em `instagramReels`. Apenas posts públicos; também são aceitos vídeos próprios `.mp4`/`.webm`. Embeds e vídeos são montados sem clique, a cerca de 400px da tela. A capa do embed permanece até load, altura e mensagem MOUNTED da origem/janela corretas; duas pinturas completam a troca. Vídeos próprios não usam autoplay; embeds seguem o comportamento da Meta. O foco dentro do iframe trava a passagem; sair do vídeo libera a trava após cerca de 3s. O site não pode inspecionar o play/pause de um iframe de outro domínio. Falha externa mantém um link utilizável; carga lenta libera o link da capa após 20s e continua aguardando o iframe.

Movimento reduzido desliga passagem automática, contadores e revelação. O comportamento já existente das animações do rio é preservado.

## Libras, cache e SEO

O VLibras oficial é externo; `libras.js` posiciona seu botão. No celular, o JS oculta temporariamente os lançadores flutuantes quando cobririam a arte/selos da abertura, carrosséis ou formulário, preservando o painel aberto do VLibras. Falhas da Meta/VLibras devem ser registradas separadamente de erros do site.

`_headers` mantém segurança e cache de 30 dias para imagens e ícones, de 1 ano (immutable) para fontes versionadas e revalidação para CSS/JS. Autoriza unload somente em self e https://www.instagram.com para compatibilidade com o SDK da Meta; os iframes recebem a mesma permissão restrita. Os três avisos de recursos desconhecidos vêm dos cabeçalhos do Instagram e não podem ser removidos pelo HTML local. Evidências e limites em docs/evidencias/2026-10-04/instagram-politicas-fotos-reais.json. `site.css`, `estrutura.css`, `config.js` e `site.js` usam `?v=20261007&rev=10` em todas as páginas locais, escapado com `&amp;` no HTML. `fonts.css` mantém sua versão anterior, pois não mudou. Se houver outra publicação na mesma data, use uma revisão nova.

Canonical, Open Graph, Twitter e JSON-LD usam o domínio final. O sitemap local lista 16 páginas indexáveis após a rodada de SEO de 07/10 (a base tinha 11); `robots.txt` aponta para ele e `llms.txt` reúne dados e links públicos. Gabriela é identificada como Person e autora dos artigos; a inicial mantém AccountingService com endereço e serviços reais. O painel tem CollectionPage e ItemList com nove assuntos. `404.html` permanece com `noindex`. Manifest usa caminhos relativos, `id` e `scope` na raiz. `_headers` vale para assets estáticos do Worker, conforme [documentação Cloudflare](https://developers.cloudflare.com/workers/static-assets/headers/). Roteiro de cadastro, envio do sitemap e pendências externas em [google-search-console.md](docs/google-search-console.md); não existe garantia de posição ou recomendação por IA.

As páginas de Informações mantêm suas datas de revisão e regras existentes. Esta rodada não é uma nova auditoria tributária. Consulte `docs/revisao-03-10-2026.md` antes de alterar conteúdo legal.

## Links internos e cabeçalho fixo

O cabeçalho fica fixo no topo. Para os links internos (`#servicos`, `#sobre`, `#contato`, `/informacoes#reforma-tributaria` etc.) não pararem atrás dele, `site.css` usa `html{scroll-padding-top:var(--cabecalho)}` e desconta o respiro interno das seções com `scroll-margin-top` negativo (`--folga-ancora`: 14 px). O `site.js` atualiza `--cabecalho` com a altura real do cabeçalho na carga e no redimensionamento (sem medir com o menu do celular aberto). Seção nova com `id` e padding diferente de `--secao-y`: acrescente uma regra própria, como a de `#reforma-tributaria`.

## Componentes dos artigos

As páginas de Informações e os guias usam componentes com classe em `site.css` (bloco "Artigos — padrão"), não mais estilo inline caso a caso. Ao escrever um artigo novo, use estas classes:

- **Tabela** (`.artigo-linhas` > `.artigo-tabela-linha`, três `div`s por linha):
  - cada célula traz `.artigo-tabela-rotulo` e depois `.artigo-tabela-valor`, `.artigo-tabela-destaque` (número em negrito, como a alíquota, **sem pílula**) ou `.artigo-tabela-obs`;
  - no computador, o rótulo aparece só na primeira linha; nas outras fica só para leitores de tela;
  - no celular, as linhas empilham com rótulo.
- **Agenda de datas** (`.artigo-linhas` > `.artigo-agenda-linha`): `.artigo-agenda-data` (com `destaque`, em laranja, ou `periodo`, em petróleo-claro) e `.artigo-agenda-texto`. A data é texto marcado por um fio, não pílula.
- **Grade de cards** (`.artigo-cards`): as colunas seguem a quantidade de cards. 2 viram 2 colunas, 3 viram 3, **4 viram 2×2** e 5 ou mais viram 3; no celular, 1 coluna.
- **Marcadores** (`.marcador` com `-contorno`, `-cbs` ou `-ibs`): retângulos com raio de 6 px. Não use etiqueta arredondada ou centralizada.
- **Fontes oficiais** (`aside.artigo-fontes` com `h2.artigo-fontes-titulo`, `ul.artigo-fontes-lista` e `p.artigo-fontes-nota`):
  - fecham a coluna de texto do artigo (fim de `.artigo-texto`);
  - a lista tem 2 colunas e ícone de link externo.

- **Páginas de proposta** (`.conteudo-artigo`, como `fim-escala-6x1` e `novo-limite-mei`): mesmos componentes em versão de classe. São eles: `section.artigo-faq` > `div.artigo-faq-lista` com `<summary><span>pergunta</span>` + ícone `.faq-icone`, `ul.artigo-lista-check` (✓), `section.artigo-fontes` e `nav.artigo-outros`.

`docs/testes/padronizar-artigos.js` converteu os 8 artigos e `docs/testes/padronizar-propostas.js` as 2 páginas de proposta de 08/10/2026. Ele só grava se o texto visível, os links, os `id`s e o JSON-LD de cada página continuarem idênticos.

### Esqueleto da página de artigo (10/10/2026)

Os 10 artigos (`informacoes` e os 9 guias e propostas) seguem o mesmo esqueleto, do bloco "Artigos — página" de `site.css`. Entre a abertura (`#inicio`) e a faixa verde final, a página tem:

```html
<div class="artigo-corpo">
  <nav class="artigo-sumario" aria-labelledby="sumario-titulo"><p class="artigo-sumario-titulo" id="sumario-titulo">Neste artigo</p><ol><li><a href="#id-da-secao">Título da seção</a></li>…</ol></nav>
  <div class="artigo-texto">
    <section id="id-da-secao" class="artigo-secao"><h2 class="titulo-secao">Título</h2><p>Texto…</p>…</section>
    …
    <aside class="artigo-fontes" aria-labelledby="fontes-titulo">…</aside>
  </div>
</div>
<section class="leia-mais"><div class="leia-mais-interno"><h2 class="titulo-secao">Veja também</h2><ul class="mudancas-lista"><li><a class="mudancas-item" href="/…"><span class="mudancas-titulo">…</span><span class="mudancas-texto">…</span><span class="mudancas-ler">Ler artigo<svg …></svg></span></a></li>…</ul><a class="leia-mais-todos" href="/informacoes">Ver todos os assuntos<svg …></svg></a></div></section>
```

- **Fundo:** o corpo usa uma cor só (`--chao`). Não crie faixas `background: var(--superficie)` de largura total.
- **Seção nova:** use `section.artigo-secao` com `id` e `h2.titulo-secao`, e acrescente o mesmo item no sumário (`href="#id"`, com o texto exato do título). `site.js` marca o trecho em leitura.
- **Texto corrido:** `<p>` e `<ul>` sem classe dentro da seção já saem no padrão. A lista com ✓ é `ul.artigo-lista-check`.
- **Perguntas:** não use FAQ em sanfona (`<details>`) nos artigos. Cada pergunta vira `h3.artigo-pergunta` seguida da resposta em `<p>`, na seção a que se refere. O JSON-LD FAQPage continua válido porque as perguntas e as respostas ficam visíveis.
- **Veja também:** é a mesma lista `.mudancas-*` da inicial, sem número e sem foto. São 3 colunas no computador e uma embaixo da outra no celular.
- **Cards** dentro da coluna: no máximo 2 por linha.
- **Aviso no topo** das páginas de proposta: `section.artigo-secao.proposta-aviso`.

`docs/testes/padronizar-paginas-artigo.js` fez a conversão, com travas de texto, links, `id`s e conteúdo fora do `<main>`. Ele só serve para a conversão inicial: depois dela, as páginas já não têm `<details>` e o script para.

## Desempenho

- **Fontes locais:** Bricolage Grotesque e Figtree ficam em `assets/fonts/` (licença OFL) e são declaradas em `assets/css/fontes.css`, um `@font-face` por arquivo. As duas fontes latinas são pré-carregadas no `<head>`. Não volte ao Google Fonts: ele adicionava dois domínios e uma cadeia de requisições antes do primeiro desenho.
- **Imagens responsivas:** fotos de cards, capas, miniaturas e 404 têm versões `-480` e `-720` ao lado do original de 1200 px, usadas por `srcset`/`sizes` no HTML e no `site.js`. Ao incluir uma foto nova, rode `py docs/testes/gerar-variantes-imagens.py` (requer Pillow). Logos e glifo do WhatsApp também têm versões do tamanho exibido (`-480`, `-600`, `-128`).
- **VLibras:** o plugin oficial é pedido por `libras.js` só depois do `load` e com o navegador ocioso.
- **Botão flutuante:** a primeira medição de sobreposição espera o próximo quadro, evitando layout forçado durante a carga.
- **Ao publicar:** troque o `rev` do `?v=` de CSS e JS em todas as páginas.

## Próximas entregas

Retratos reais da Gabriela, foto real do escritório e aprovação das respostas de contratação em [perguntas-para-aprovar.md](docs/perguntas-para-aprovar.md). Essas respostas são internas e não podem entrar no site antes da aprovação. Avaliações reais e imagens dos cards/capas já estão configuradas; detalhes no handoff e em [imagens.md](docs/imagens.md).

Para ativar uma foto entregue, adicionar seu caminho a `fotos` em `config.js`, por exemplo `'/assets/img/fotos/gabriela-retrato.webp'`. O HTML define `data-foto` e `data-foto-alt` na `.foto-moldura`. Só uma foto listada é buscada; após o carregamento a moldura recebe `.tem-foto`. Um erro de carga remove a imagem e mantém a arte de espera. Não listar arquivos que ainda não existem.

Leia `docs/handoff.md` e `COLABORACAO_IA.md` antes de editar. Scripts e evidências da revisão ficam em `docs/testes/` e `docs/evidencias/2026-10-04/`; o handoff descreve o alcance dos testes, as capturas e as limitações externas.

## SEO local e páginas de serviços — 07/10/2026

Cinco páginas de atendimento: `/contabilidade-empresarial`, `/regularizacao-baixa-cnpj`, `/calculos-trabalhistas`, `/consultoria-financeira` e `/escolha-de-regime-tributario`. Guias de abertura, IR e MEI mantêm suas URLs e recebem atendimento contextual. Links da home e dos guias levam aos serviços; o WhatsApp direto permanece disponível. As novas páginas usam WebPage, Service e BreadcrumbList com IDs estáveis e provider GESCOMP; não usam Review/AggregateRating.

Detalhes ainda não aprovados não entram no conteúdo: troca de contador, execução mensal completa de folha e inclusões do plano de R$ 150. A consultoria é um serviço confirmado, mas seu escopo detalhado continua a combinar. Datas de consulta técnica dos artigos permanecem; lastmod do sitemap descreve a edição real do documento, não uma nova conferência da legislação.

Diagnóstico em [auditoria-seo-local.md](docs/auditoria-seo-local.md); coordenação e decisões da revisão em [seo-colaboracao.md](docs/seo-colaboracao.md). Evidências e scripts desta rodada ficam em `docs/evidencias/2026-10-07/seo-local/` e `docs/testes/*seo-local*`. A rodada é exclusivamente local: não acessa Google, Search Console, Business Profile ou Cloudflare, nem executa deploy/push. O sitemap novo ainda precisa ser publicado em uma rodada autorizada.
