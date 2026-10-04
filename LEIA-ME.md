# Site da GESCOMP

HTML, CSS e JavaScript puros, sem framework, bibliotecas adicionais ou etapa de build. Contadora: **Gabriela do Nascimento Vieira — CRC 009186/SE**.

```text
02-site/
├── publicar/                  arquivos servidos pelo Cloudflare Worker
│   ├── *.html                 página inicial, informações e 404
│   ├── assets/css/            site.css e estrutura.css
│   ├── assets/js/             config.js, site.js e libras.js
│   ├── assets/img/fotos/      fotos reais, quando entregues
│   └── sitemap.xml, robots.txt, llms.txt, site.webmanifest, _headers
├── conteudo/                  cópias de textos para revisão
├── design/                    arquivos de referência anteriores
└── docs/                      handoff, imagens, aprovação e evidências
```

## Domínio e hospedagem

O domínio oficial é **https://gescompnegocios.com.br/**. Canonical, compartilhamento, JSON-LD, sitemap, robots e llms usam esse endereço. Conferido em 04/10/2026: DNS na Cloudflare (alec/dora) e HTTPS com resposta 200 na raiz, sitemap, robots, llms e imagem Open Graph. A versão no ar ainda usa assets de 03/10; esta rodada atualiza os arquivos localmente.

Hospedagem existente: Cloudflare Workers, Worker `gescomp-site`, com integração ao GitHub. Somente `publicar/` é servida; `docs/`, `conteudo/`, `design/` e os dados privados da empresa não são publicados. Não há comando de build. Verificação e roteiro externo em [roteiro-de-atualizacao.md](docs/roteiro-de-atualizacao.md).

Nesta rodada, a regra obrigatória do usuário proíbe push, deploy e alterações em produção. Codex preparou a configuração, Claude concluiu o visual e Codex revisou a integração. O fechamento é um commit local. Alterar o GitHub pode disparar publicação automática, portanto não fazer push enquanto essa restrição estiver vigente.

## Executar localmente

```bash
cd 02-site/publicar
python3 -m http.server 8080
```

No Windows deste ambiente, use `py -3 -m http.server 8080 --bind 127.0.0.1` na mesma pasta. Abra http://127.0.0.1:8080/ e encerre com Ctrl+C. O servidor Python serve as páginas internas com `.html` (por exemplo, `/mei.html`). Os endereços sem extensão do site são tratados pelo Cloudflare; o servidor Python não reproduz esse roteamento nem `_headers`.

Para testar também o comportamento da hospedagem, o Wrangler já disponível pode servir `publicar/` localmente. Não é uma dependência do site.

## Estrutura da página

A página segue esta ordem: abertura → Como podemos ajudar (`#servicos`) → números → Quem é a Gabriela (`#sobre`) → avaliações → Instagram → faixa de Informações e dúvidas → chamada final → `#rio` → contato → rodapé.

Abertura com texto à esquerda e imagem à direita; até o retrato chegar, aparece a arte de gráfico. Serviços com três cards e cinco linhas de Outros serviços. Fotos ausentes usam arte de espera, sem textos de espaço reservado. Requisitos e nomes em [imagens.md](docs/imagens.md). Implementação e revisão registradas em [handoff.md](docs/handoff.md).

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

`data-whatsapp` usa `mensagemPadrao`. Cada card/linha usa `data-whatsapp-msg` com uma das chaves abaixo, todas começando com “Olá, Gabriela! Vim pelo site e”:

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

Em `config.js`, `avaliacoes` contém `linkAvaliar`, `linkVerTodas`, `nota`, `total` e `itens: [{ nome, texto, estrelas, link }]`. Os links do perfil do Google já foram informados; nota 5,0 e total 28 foram conferidos no perfil em 04/10/2026. **A lista `itens` permanece vazia** até a escolha e aprovação dos textos reais pela Gabriela, e a seção fica escondida.

- A seção fica escondida sem itens válidos. Cada item precisa de nome, texto e estrelas inteiras de 1 a 5; dados incompletos não recebem uma nota inventada.
- O site mostra só primeiro nome e inicial do último sobrenome, sem foto. As estrelas têm texto acessível, por exemplo “5 de 5 estrelas”. O texto é inserido por `textContent`.
- `link` válido gera “Ver avaliação no Google”. `linkAvaliar` e `linkVerTodas` controlam seus botões, escondidos quando vazios ou inválidos. São aceitos somente links HTTPS do Google ou seus encurtadores conhecidos.
- Nota/total só aparecem com ambos preenchidos e válidos. Não adicionar `AggregateRating` ou `Review` no JSON-LD.
- Avaliações de teste devem existir só no navegador de teste, nunca na configuração publicada.

## Carrosséis e movimento

Instagram e avaliações usam a mesma função `criarCarrossel`, com `data-carrossel`, `data-carrossel-trilha`, `data-slide`, `data-carrossel-anterior`, `data-carrossel-proximo` e `data-carrossel-aviso`. A lista deve ter `tabindex="0"`, nome acessível e aviso `aria-live="polite"`.

Passagem a cada 8s com rolagem suave. Para com mouse em cima, foco de teclado, foco dentro de iframe, toque, aba escondida, seção fora da tela e movimento reduzido; não agenda passagem se todos os cards couberem. Após clique de mouse na seta, sair do carrossel permite a retomada. Setas e teclas ←/→ continuam funcionando. Sem botão Pausar.

Os links do Instagram ficam em `instagramReels`. Apenas posts públicos; também são aceitos vídeos próprios `.mp4`/`.webm`. Embeds e vídeos são montados sem clique, a cerca de 400px da tela. Vídeos próprios não usam autoplay; embeds seguem o comportamento da Meta. O foco dentro do iframe trava a passagem; sair do vídeo libera a trava após cerca de 3s. O site não pode inspecionar o play/pause de um iframe de outro domínio. Falha externa mantém um link utilizável; carga lenta libera a capa após 20s e continua aguardando o iframe.

Movimento reduzido desliga passagem automática, contadores e revelação. O comportamento já existente das animações do rio é preservado.

## Libras, cache e SEO

O VLibras oficial é externo; `libras.js` posiciona seu botão. No celular, o JS oculta temporariamente os lançadores flutuantes quando cobririam a arte/selos da abertura, carrosséis ou formulário, preservando o painel aberto do VLibras. Falhas da Meta/VLibras devem ser registradas separadamente de erros do site.

`_headers` mantém segurança e cache de sete dias para imagens, com revalidação para CSS/JS. `site.css`, `estrutura.css`, `config.js` e `site.js` usam `?v=20261004` em todas as páginas. Se houver outra publicação na mesma data, use um sufixo novo.

Canonical, Open Graph, Twitter e JSON-LD usam o domínio final. `sitemap.xml` lista as nove páginas, `robots.txt` aponta para ele e `llms.txt` reúne dados e links públicos. `404.html` permanece com `noindex`. Manifest usa caminhos relativos, `id` e `scope` na raiz. `_headers` vale para assets estáticos do Worker, conforme [documentação Cloudflare](https://developers.cloudflare.com/workers/static-assets/headers/).

As páginas de Informações mantêm suas datas de revisão e regras existentes. Esta rodada não é uma nova auditoria tributária. Consulte `docs/revisao-03-10-2026.md` antes de alterar conteúdo legal.

## Próximas entregas

Fotos reais otimizadas, textos das avaliações escolhidas e aprovação das respostas de contratação em [perguntas-para-aprovar.md](docs/perguntas-para-aprovar.md). Essas respostas são internas e não podem entrar no site antes da aprovação. Os links e dados gerais do Google já estão configurados (fonte no handoff).

Para ativar uma foto entregue, adicionar seu caminho a `fotos` em `config.js`, por exemplo `'/assets/img/fotos/gabriela-retrato.webp'`. O HTML define `data-foto` e `data-foto-alt` na `.foto-moldura`. Só uma foto listada é buscada; após o carregamento a moldura recebe `.tem-foto`. Um erro de carga remove a imagem e mantém a arte de espera. Não listar arquivos que ainda não existem.

Leia `docs/handoff.md` e `COLABORACAO_IA.md` antes de editar. Scripts e evidências da revisão ficam em `docs/testes/` e `docs/evidencias/2026-10-04/`; o handoff descreve o alcance dos testes, as capturas e as limitações externas.
