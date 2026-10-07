# Relatório da rodada de SEO local — 07/10/2026

Base auditada: `f970f3f`. Status: **concluída**. Implementação do Codex, revisada e corrigida pelo Claude em duas passagens (ver [seo-colaboracao.md](seo-colaboracao.md)); conferências finais na seção 6. A tarefa foi executada somente neste repositório.

## 1. Diagnóstico inicial

12 HTML, 11 indexáveis. A base já tinha metadados únicos, canonicals, sitemap, autoria, imagens com dimensões e links internos válidos. A lacuna principal era comercial: serviços na home levavam ao WhatsApp, sem páginas para entender seu atendimento. Encontrados também description ausente na 404, tipo de empresa inconsistente entre home e artigos e teste estático desatualizado. Inventário completo em [auditoria-seo-local.md](auditoria-seo-local.md) e [auditoria-antes.json](evidencias/2026-10-07/seo-local/auditoria-antes.json).

## 2. Arquivos criados

Páginas em `publicar/`:

- `contabilidade-empresarial.html`;
- `regularizacao-baixa-cnpj.html`;
- `calculos-trabalhistas.html`;
- `consultoria-financeira.html`;
- `escolha-de-regime-tributario.html`.

Documentação: esta entrega, auditoria e `seo-colaboracao.md`. Ferramentas: `auditoria-seo-local.py`, `revisao-seo-local.js`, `interacoes-seo-local.js`, `rio-comparacao-seo-local.js` e `comparar-rio-seo-local.py`. Evidências ficam em `docs/evidencias/2026-10-07/seo-local/`. Não há novos assets de imagem/fontes nem dependências de produção.

## 3. Arquivos alterados

Os 12 HTML anteriores (home, hub, nove guias e 404), `sitemap.xml`, `llms.txt`, `assets/css/site.css` (somente classes para links novos), `LEIA-ME.md`, `perguntas-para-aprovar.md`, `docs/testes/LEIA-ME.md` e `validacao-estatica.cjs`. Registros de handoff/colaboração receberão o fechamento da revisão. JavaScript, fotos, fontes, estrutura.css, robots, headers e manifest preservados.

## 4. Melhorias e arquitetura

Home → serviço → WhatsApp, com o contato direto original também disponível. Os três cards têm links secundários; as cinco linhas mantêm WhatsApp e seus serviços são acessíveis pela linha compacta “Saiba como funciona”. Guias informativos mantêm suas URLs e regras, com atendimento relacionado no CTA existente. Não foi criada uma página comercial concorrente para cada guia.

H1 e os dois parágrafos aprovados da abertura preservados após revisão; endereço do escritório próximo da abertura, na linha de confiança. Gabriela, CRC, telefone e endereço consistentes. WebPage/Service/BreadcrumbList com IDs estáveis; empresa única por identidade, sem ratings estruturados. Autora das meta tags corresponde à autoria visível dos artigos. Sitemap local com 16 URLs indexáveis; 404 continua noindex e fora dele.

## 5. O que não foi incorporado

- Troca de contador como serviço anunciado: não confirmada pela Gabriela.
- Folha mensal completa/eSocial: material interno só confirma os cálculos, não esse contrato.
- “Planejamento tributário” amplo: URL e oferta ficaram limitadas à escolha do regime comprovada nas FAQs.
- Lista de inclusões do plano de R$ 150, entregáveis novos e respostas internas ainda não aprovadas.
- Páginas por cidade, keyword stuffing, avaliações estruturadas e promessa de ranking/recomendação por IA.

A revisão inicialmente sugeriu excluir consultoria. O serviço está confirmado nas fontes internas e na FAQ pública sobre organizar contas/custos; o Claude aceitou mantê-lo sem inventar entregáveis. A revisão também propôs datas antigas para documentos alterados: datas de revisão técnica continuam antigas; lastmod do sitemap identifica a mudança real de conteúdo/navegação do documento em 07/10. Isso não representa nova consulta à legislação.

## 6. Testes e evidências

A primeira bateria executou 136 cenários (17 páginas × 1366/1920/390/360 × claro/escuro). Detectou contraste nos links novos dos guias no tema escuro; o defeito foi corrigido e os 44 cenários afetados repetidos passaram. A matriz inicial e o reteste são históricos; haverá uma matriz final após os ajustes de texto/CTA do Claude.

25 verificações de interações passaram: oito mensagens WhatsApp, foco em 72 passos por tela, menu/Escape, FAQ, formulário com telefone opcional e window.open apenas simulado, caminho home → serviço e conteúdo/contato sem JavaScript. Barco, coqueiro e pássaro animados; transição sol/lua confirmada.

Comparação estabilizada do rio: oito pares idênticos pixel a pixel, em claro/escuro e quatro larguras. Fonte HTML do rio igual à base; regras originais CSS e JavaScript preservadas. Capturas comuns tinham diferenças de elementos fixos/transição em curso; isso foi identificado e não é apresentado como regressão ou teste aprovado. Ver [comparacao-rio-controlado.json](evidencias/2026-10-07/seo-local/comparacao-rio-controlado.json).

**Conferência final (Claude, 07/10, depois que o limite do Codex acabou durante os testes):**
- `node docs/testes/validacao-estatica.cjs py`: 17 páginas, 0 falhas, com `node --check` incluído.
- Matriz no navegador, com a rede externa bloqueada: 17 páginas × 1366/390 px × claro/escuro = 68 cenários, 0 violações axe A/AA, sem rolagem lateral, sem erros, um H1 por página, WhatsApp com número e mensagem corretos e 8 âncoras internas válidas.
- `#rio` idêntico ao `f970f3f`, com fim de linha normalizado.
- Teste de mutação da auditoria: o controle passa e os 8 defeitos inseridos são detectados.
- O arquivo temporário `publicar/__seo_base_local.html`, criado pela comparação do rio e não removido por causa da interrupção, foi apagado antes do commit.
- A matriz de 136 cenários do Codex (1920 e 360 px) não chegou a ser repetida após as últimas edições; a de 68 cenários acima cobre as mesmas páginas. O teste antigo não exige mais uma imagem OG única nem nove URLs fixas. Imagens referenciadas abaixo de 300 KB; nenhum novo script, fonte ou imagem. A medição de gzip e tamanhos está em `desempenho-local.json`; não equivale a Lighthouse ou Core Web Vitals de produção.

## 7. Riscos e pendências

Confirmar inclusões e contratação com a cliente e acrescentar exemplos reais aprovados aos serviços, quando existirem. Troca de contador e folha mensal continuam pendentes. Retratos da Gabriela e foto do escritório não foram inventados. SDKs externos de Instagram/VLibras, cabeçalhos de hospedagem e redirects reais não foram acessados nem testados; URLs limpas foram apenas emuladas localmente. Auditoria técnica/legal dos artigos permanece com suas datas existentes.

O ponteiro parametrizado do sitemap em robots vem da correção anterior de cache e foi preservado. Esta rodada não reaplica nem confirma configurações externas. Auditoria automatizada A/AA não substitui todo teste humano e não certifica conformidade completa.

## 8. Limites de busca

As alterações locais só poderão influenciar a busca após publicação autorizada e rastreamento. Indexação, concorrência, relevância e ranking dependem de fatores externos e do tempo; não há garantia de posição, prazo ou recomendação pela IA do Google. Não foi solicitado rastreamento/indexação nesta tarefa.

## 9. Contas externas

**Nesta rodada, Google, Search Console, Google Business Profile e Cloudflare não foram acessados.** Nenhuma conta, DNS, Worker ou configuração externa foi alterada. Navegadores usaram contextos novos, localhost e interceptação de toda requisição externa. Links e referências existentes apenas foram lidos no código, sem abrir seus destinos.

## 10. Publicação e Git

**Nenhum deploy e nenhum push remoto executados nesta rodada.** As páginas e o sitemap novos são locais e não devem ser confundidos com o estado publicado anteriormente. A revisão final e o estado do Git serão registrados em `seo-colaboracao.md` e `handoff.md`; nenhum registro anterior de publicação foi apagado ou reutilizado como prova desta versão.
