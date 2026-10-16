# Atualizações finais solicitadas por Gabriela — 16/10/2026

Base anterior à tarefa: `116546769d54b99791b9202d01d07d7653002589`, branch `main`, árvore limpa. A consulta remota antes da publicação confirmou o mesmo hash em `origin/main`. A base permite comparar e reverter esta entrega sem reescrever histórico.

O projeto serve HTML/CSS/JavaScript estáticos de `publicar/`, sem dependências de execução, TypeScript, lint configurado ou etapa de build. A hospedagem existente é o Worker `gescomp-site`, integrado ao GitHub. Esta entrega usa o push normal; não modifica Cloudflare, DNS, integrações, credenciais ou configuração de deploy.

## Pedidos e resultados

- Título principal, grifo e primeiro texto da abertura preservados integralmente.
- Atendimento atualizado para “Atendimento personalizado, presencial ou on-line, sem demora e sem respostas automáticas.”, mantendo o destaque em negrito no primeiro trecho.
- CTA principal, cabeçalho, menu e chamadas equivalentes padronizados para “Fale com nossa equipe”. Preservados href, atributos de WhatsApp, telefone e todas as mensagens configuradas. O botão principal mantém 336 px no desktop e respeita a largura disponível no celular; “Ver serviços” permanece intacto.
- “Como podemos ajudar”: substituída somente a referência aos contadores por “nossa equipe”; apresentação e cartões de serviços mantidos.
- “Quem é a GESCOMP”: três parágrafos oficiais completos na seção existente de Sobre. Abaixo, missão em largura completa, visão e valores lado a lado no desktop; empilhamento missão/visão/valores abaixo de 900 px. Valores com seis ícones de traço. Reutilizados tokens de cor, tipografia, borda, raio e sombra dos cartões existentes, sem novas animações.
- Biografia individual, citação, moldura de foto e credenciais da Gabriela preservadas. Removido somente o parágrafo institucional repetido que encerrava a biografia, pois a nova apresentação já cobre esse conteúdo.
- “Como funciona”: “Você fala com nossa equipe”, “Analisamos seu caso” e descrição na primeira pessoa do plural. Primeiro descritivo e terceiro cartão preservados.
- Chamadas comerciais revisadas também nos artigos, metadados, FAQ estruturada e `llms.txt`. Nenhuma alteração no nome, histórico ou registro profissional da Gabriela.
- Notícias: três publicações verificadas diretamente na Receita Federal, todas dentro dos últimos sete dias. Três itens na inicial e nove no hub de Informações, com as novas notícias primeiro. Páginas antigas e respectivos IDs/URLs preservados, inclusive nos links relacionados.

## Notícias e referências

Pesquisa realizada em **16/10/2026**, priorizando Receita Federal, eSocial e Sefaz/SE. As três selecionadas têm relevância direta para serviços contábeis e não exigiram ampliar a janela de sete dias. Fonte e horários conferidos na página original, separadamente da data de consulta. Os textos são sínteses próprias; não há autoria individual atribuída à Gabriela.

| Artigo GESCOMP | Data da fonte | Atualização da fonte | Referência oficial |
|---|---|---|---|
| [Receita Sintonia divulga o terceiro ciclo de 2026](https://gescompnegocios.com.br/receita-sintonia-terceiro-ciclo-2026) | 15/10/2026, 19h29 | 15/10/2026, 19h31 | [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/outubro/receita-sintonia-divulga-a-classificacao-do-3o-ciclo-de-2026) |
| [Simples Nacional: Receita atualiza balanço de pedidos](https://gescompnegocios.com.br/simples-nacional-balanco-outubro-2026) | 15/10/2026, 10h22 | 15/10/2026, 13h28 | [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/outubro/receita-federal-atualiza-o-balanco-de-solicitacoes-de-opcao-pelo-simples-nacional-e-pelo-regime-regular-do-ibs-e-da-cbs-3) |
| [CBS aparece em 86% das notas de empresas obrigadas](https://gescompnegocios.com.br/cbs-documentos-fiscais-outubro-2026) | 09/10/2026, 16h45 | Não indicada | [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/outubro/reforma-tributaria-86-dos-documentos-fiscais-de-empresas-obrigadas-ja-trazem-destaque-da-cbs) |

As páginas GESCOMP têm publicação própria em **16/10/2026**, visível e em `Article.datePublished`; as datas das fontes aparecem na bibliografia. No balanço do Simples, o dia 30/10 é apresentado como prazo para regularização de pedidos indeferidos, sem transformá-lo em nova janela geral de opção. Na CBS, preservada a exceção das optantes pelo Simples em 2026 e a distinção entre percentual de documentos e de estabelecimentos.

Imagens: reutilizada a fotografia ilustrativa já licenciada em CC0 no projeto (`capa-novo-limite-mei-cc0-20261006.webp`, variantes e Open Graph), de [PxHere 970472](https://pxhere.com/en/photo/970472), com descrição de mesa/computador/caderno/calculadora. Não representa evento real nem recebeu novas edições. Registro da licença preexistente em `imagens-reais-fontes.md`.

## Arquivos da entrega

| Caminho | Motivo |
|---|---|
| `publicar/index.html` | Textos, apresentação, cartões, passos, três notícias e versão do CSS |
| `publicar/assets/css/site.css` | Somente regras adicionais dos cartões e largura preservada do CTA |
| `publicar/informacoes.html` | Chamadas comerciais e três itens recentes na lista existente; ItemList alinhado |
| `publicar/receita-sintonia-terceiro-ciclo-2026.html` | Novo artigo no modelo existente |
| `publicar/simples-nacional-balanco-outubro-2026.html` | Novo artigo no modelo existente |
| `publicar/cbs-documentos-fiscais-outubro-2026.html` | Novo artigo no modelo existente |
| `publicar/abrir-empresa.html`, `publicar/calculos-trabalhistas.html`, `publicar/calendario-fiscal.html`, `publicar/consultoria-financeira.html`, `publicar/contabilidade-empresarial.html`, `publicar/departamento-pessoal.html`, `publicar/escolha-de-regime-tributario.html`, `publicar/fim-escala-6x1.html`, `publicar/imposto-de-renda.html`, `publicar/mei.html`, `publicar/novo-limite-mei.html`, `publicar/pro-labore-e-lucros.html`, `publicar/regularizacao-baixa-cnpj.html`, `publicar/simples-nacional.html` | Somente comunicação comercial para “nossa equipe”, incluindo cabeçalhos, CTA e metadados equivalentes |
| `publicar/llms.txt` | Referência comercial aos profissionais substituída por “nossa equipe” |
| `publicar/sitemap.xml` | Três URLs novas e lastmod da inicial/hub |
| `docs/testes/validar-finais-20261016.py`, `docs/testes/navegador-finais-20261016.js` | Verificações reproduzíveis desta entrega |
| `docs/evidencias/2026-10-16/` | Resultados e capturas da comparação |
| `docs/atualizacoes-finais-2026-10-16.md`, `docs/handoff.md`, `COLABORACAO_IA.md` | Relatório e registro objetivo da entrega |

## Validação

- `python -X utf8 docs/testes/validar-finais-20261016.py`: **20 HTML, 19 URLs no sitemap, zero erros**. Verificados links locais, fragmentos, recursos, IDs, H1, JSON-LD, atributos de imagens e remoção das chamadas antigas.
- `node --check` em `site.js`, `config.js` e `libras.js`: aprovados. Não há build, lint ou TypeScript aplicáveis neste projeto.
- Playwright: **152 cenários aprovados** — 19 páginas × 320/390/768/1366 px × claro/escuro. Sem overflow ou corte nos textos verificados, imagens quebradas ou exceções JavaScript. Testados os botões reais de tema, o menu móvel, a ordem dos cartões e os destinos de WhatsApp.
- Comparação estática contra o Git inicial: JavaScript e configurações idênticos; CSS anterior integralmente preservado, com regras novas ao final. Seções do rio, contato, avaliações e Instagram, rodapés, IDs antigos e atributos dos links WhatsApp preservados.
- Capturas antes/depois da abertura e novas capturas institucionais em claro/escuro e celular/desktop. Revisão visual sem mudanças não solicitadas na abertura.
- `git diff --check`: aprovado. Nenhum segredo ou alteração de infraestrutura incluído.

Limites: Meta e VLibras foram bloqueados na matriz local, sem envio real de mensagem; seus serviços externos não foram revalidados. O servidor Python emula URLs limpas no teste, sem comprovar cabeçalhos ou deploy. Primeira tentativa do roteiro de navegador parou na página 404, que não tem botão de tema; corrigido o roteiro para as 19 páginas que possuem essa funcionalidade e executada a matriz completa com sucesso. A 404 foi coberta pela validação estática e não foi modificada.

Sem impedimento de implementação conhecido. O bloco oculto de Cursos já continha `[LINK-DA-PLATAFORMA]` na base e permanece fora do escopo. Push e deploy devem ser confirmados depois do commit, com hash remoto e inspeção pública; os testes locais não constituem essa confirmação.
