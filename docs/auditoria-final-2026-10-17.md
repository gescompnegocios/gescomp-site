# Auditoria final — 17/10/2026

## Estado inicial e classificação anterior às correções

Repositório `gescompnegocios/gescomp-site`, diretório `02-site`, branch `main`, árvore limpa. Base de reversão: `d6d19f78abc77bf3207fdaf6f74872bd6287c329`, igual ao remoto consultado nesta execução. Fluxo existente: push em main → integração GitHub → Cloudflare Worker `gescomp-site`, assets `publicar/`. Projeto estático, sem build, TypeScript, lint ou dependências instaladas.

Antes de editar o site, foram comparados por HTTP a inicial, escala 6x1, novo limite MEI, CSS, configuração JS e sitemap: seis respostas 200, conteúdo igual ao Git local após normalizar CRLF e retirar somente o beacon de métricas injetado pela hospedagem. Commits anteriores `4846733` e `d6d19f7` examinados; testes históricos lidos, sem reexecutar scripts de transformação de conteúdo nem sobrescrever evidências antigas.

| Pedido | Classificação inicial | Encaminhamento |
|---|---|---|
| Título e primeira descrição da abertura | Já implementados corretamente | Preservar |
| Texto do atendimento | Parcialmente implementado | Acrescentar somente “seja” |
| CTA, link e linguagem de equipe | Já implementados corretamente | Preservar e testar |
| Como podemos ajudar | Já implementado corretamente | Preservar |
| História oficial, três parágrafos | Já implementada corretamente | Preservar |
| Biografia profissional | Não existe na base, por decisão expressa anterior do usuário | Não remover referências técnicas nem restaurar seção já retirada |
| Missão, visão e seis valores | Já implementados corretamente | Preservar |
| Como funciona, três cartões | Já implementado corretamente | Preservar e testar |
| Quatro ajustes visuais anteriores | Já implementados corretamente | CSS, imagens, alinhamentos e dimensões intocados |
| SEO/GEO e identificação GECOMP/GESCOMP | Necessita apenas de verificação | Validar sem prometer posição ou recomendação por IA |
| 13 artigos, datas, fontes e números | Necessita de verificação individual | Confrontar fontes oficiais; corrigir apenas divergências comprovadas |
| Escala 6x1 | Implementada incorretamente na unidade do prazo | Norma usa dois meses; notícia resumiu como 60 dias |
| PLP 186/2026 | Parcialmente implementado | Conferir condições de contratação e texto aprovado |
| Funcionamento e publicação | Necessita apenas de verificação | Testes sequenciais e conferência do domínio após push |

O anexo diz para não remover a biografia; nenhuma biografia será removida nesta rodada. A seção já estava ausente após o pedido explícito anterior de Rafael. Autoria e responsabilidade técnica de Gabriela permanecem. Essa leitura também respeita a instrução do anexo de não desfazer decisões anteriores.

## Método e limites de recursos

Pesquisas iniciadas nos sete dias anteriores, ampliadas para 15/30/60 dias e para normas anteriores ainda vigentes quando necessário. Uma fonte por transferência e uma página de navegador por vez; sem npm, Lighthouse, builds ou agentes paralelos. Publicação original, alteração editorial, vigência e consulta são registradas separadamente. Fontes apenas acessadas não são consideradas automaticamente validadas quanto ao conteúdo.

## Resultado dos pedidos

| Solicitação | Situação final |
|---|---|
| Título e descrição inicial exatos | Conferidos e preservados |
| Atendimento personalizado, seja presencial ou on-line | Corrigido somente o texto |
| Fale com nossa equipe e contatos | Conferidos; links e mensagens preservados |
| Linguagem institucional sem inventar estrutura | Conferida em 20 HTML |
| Como podemos ajudar | Texto oficial preservado |
| Quem é a GESCOMP | Três parágrafos oficiais preservados, sem duplicação |
| Gabriela | Autoria/CRC preservados; seção anteriormente retirada não foi restaurada |
| Missão, visão e seis valores | Textos e componentes preservados |
| Como funciona | Três cartões preservados e navegação conferida |
| Ajustes de desktop, botões móveis, fotos e alinhamentos anteriores | Preservados; dimensões móveis e carregamento das três fotos conferidos |
| Notícias e guias | 13 confrontados com fontes; três guias corrigidos |
| SEO/GEO | Identidade, canonicais, descoberta, FAQ e conteúdo HTML conferidos; nenhum ranking prometido |
| Design e funcionamento | Estilos intactos; 152 cenários e oito interações aprovados |
| Commit/push/deploy | Autorizados; executar após os controles abaixo e registrar hash/prova no fechamento da entrega |

## Pesquisa e revisão individual

Consulta nesta execução: **17/10/2026**. A evidência [fontes.json](evidencias/2026-10-17/auditoria/fontes.json) relaciona cada um dos 13 títulos, suas datas, todas as URLs oficiais e os resultados de acesso. Foram consultadas 67 referências: 66 responderam 200; a ficha processual do STF retornou 403. Isso é prova de acesso, não de validação automática de conteúdo. Notícias foram lidas e confrontadas com normas/manuais pertinentes; propostas foram separadas de regras vigentes. Pesquisas recentes não identificaram atualização posterior comprovada que justificasse substituir as três notícias da Receita já publicadas.

Na tabela, “publicação GESCOMP” é a data original do artigo, mantida. A coluna seguinte identifica a publicação oficial, norma ou período dos dados; não equivale à data de consulta ou vigência.

| Artigo | Publicação GESCOMP | Fonte original/data de referência | Fatos conferidos e resultado |
|---|---|---|---|
| [Reforma tributária](https://gescompnegocios.com.br/informacoes#reforma-tributaria) | 01/10/2026 | [Orientações RFB](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/orientacoes-da-reforma-tributaria): publicação 18/09, atualização 16/10/2026, 10h32; LC 214 de 16/01/2025 | Ano-teste 0,9%/0,1%, dispensa condicionada do art. 348, transição até 2033 e documentos por operação. NFS-e nacional do Simples em novembro é distinta do IBS/CBS em janeiro. Conteúdo preservado. |
| [Simples Nacional](https://gescompnegocios.com.br/simples-nacional) | 01/10/2026 | [Fazenda](https://www.gov.br/fazenda/pt-br/assuntos/noticias/2026/setembro/simples-nacional-2027-tem-novos-prazos-para-microempresas-e-empresas-de-pequeno-porte/): 29/09/2026, 11h51, atualização 12h05; Resolução 194 publicada em 28/09 | Opção encerrada em 15/10, regularização e IBS/CBS até 30/10, cancelamento 03/11–20/12, SIMEI/abertura separados. Limites 360 mil/4,8 milhões, sublimite nacional 3,6 milhões para 2026, fator R de 28%, exemplo 4,825%/R$ 965 conferidos. LC 224: acréscimo relativo de 10% nas presunções sobre parcela acima de 5 milhões, com regras próprias. Sem correção necessária. |
| [MEI](https://gescompnegocios.com.br/mei) | 01/10/2026 | [LC 123](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm), de 14/12/2006; [INSS 2026](https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal), Portaria 13 de 09/01/2026 | Teto geral 81 mil, proporcionalidade 6.750/mês na abertura, um empregado, contribuição de 5% e DAS 82,05/86,05/87,05. Caminhoneiro e excesso de receita têm regras próprias. Propostas não autorizam novo teto. Preservado. |
| [Abertura de empresa](https://gescompnegocios.com.br/abrir-empresa) | 01/10/2026 | [Receita](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/julho/receita-federal-gera-o-primeiro-cnpj-em-formato-alfanumerico): 31/07/2026, 12h15; [Redesim/MAT](https://www.gov.br/empresas-e-negocios/pt-br/redesim/ajuda/inscrever) | Primeira inscrição alfanumérica em julho; 14 caracteres e dígitos finais numéricos; inscrições antigas preservadas. MAT, registro/licenciamento e exceções para MEI, capacidade civil e limites de responsabilidade no Código Civil conferidos. Sem promessa de prazo ou taxa universal. Preservado. |
| [Calendário fiscal](https://gescompnegocios.com.br/calendario-fiscal) | 01/10/2026 | [Agenda RFB outubro/2026](https://www.gov.br/receitafederal/pt-br/assuntos/agenda-tributaria/2026/Outubro/dia-15-10-2026), [MOS eSocial S-1.3/NO 11 de 2026](https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-11-2026-retificada.pdf) e Resolução CGSN 194 | Entrega e pagamento separados; dia 20 antecipado para folha e postergado para DAS quando aplicável. Feriado 20/11: 19/11 para encargos e 23/11 para DAS. 13º de 2026: 30/11 e 18/12; eventos anuais antecipados conforme MOS. DEFIS/DASN são prazos gerais, com exceções expressas. Preservado. |
| [Funcionários e folha](https://gescompnegocios.com.br/departamento-pessoal) | 01/10/2026 | [INSS 2026](https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal), CLT de 01/05/1943, EC 141 publicada em 16/10/2026 | Mínimo 1.621, teto 8.475,55, faixas 7,5%/9%/12%/14%, máximo 988,09; FGTS 8%/aprendiz 2%; admissão, férias, 13º e rescisão confrontados com CLT, leis e manuais. Corrigida somente a chamada que ainda apresentava a emenda como discussão. Revisão editorial/visível: 17/10. |
| [Imposto de Renda](https://gescompnegocios.com.br/imposto-de-renda) | 01/10/2026 | [Tabela RFB 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026) e [Lei 15.270](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm), de 26/11/2025 | Deduções, desconto simplificado 607,20, reduções mensal/anual e fórmulas; exemplo 341,52; retenção de 10% sobre total de dividendos acima de 50 mil por mesma PJ/PF/mês; imposto mínimo e exceções. Calendário de 2027 não inventado. Decisão judicial permanece histórica, sem alegar desfecho atual. Preservado. |
| [Pró-labore e lucros](https://gescompnegocios.com.br/pro-labore-e-lucros) | 01/10/2026 | [Lei 15.270/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm), [orientação RFB de agosto/2026](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/agosto/receita-federal-orienta-sobre-os-procedimentos-para-o-recolhimento-do-imposto-de-renda-retido-na-fonte-sobre-lucros-e-dividendos) | Pró-labore e resultado documentados separadamente; INSS de 11% limitado ao teto, máximo 932,31; duas distribuições de 30 mil sujeitas à regra totalizam retenção de 6 mil, sem deduzir 50 mil. Reinf/DCTFWeb e ressalvas judiciais mantidas. Preservado. |
| [Escala 6x1](https://gescompnegocios.com.br/fim-escala-6x1) | 06/10/2026 | [EC 141](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc141.htm), de 16/10/2026, DOU extra da mesma data; [Agência Senado](https://www12.senado.leg.br/noticias/materias/2026/10/16/congresso-promulga-o-fim-da-escala-6x1-e-aposentadoria-de-agentes-de-saude), 16/10, 12h34 | Notícia resumia o primeiro marco como 60 dias; arts. 6º e 10 dizem dois meses. Corrigida a unidade e explicado o ano subsequente até 40 horas. Acrescentadas ressalvas dos arts. 4º, 8º e 9º e link direto à norma. Revisão editorial/visível: 17/10. |
| [Novo limite do MEI](https://gescompnegocios.com.br/novo-limite-mei) | 06/10/2026 | [Agência Senado](https://www12.senado.leg.br/noticias/materias/2026/10/15/senado-aprova-aumento-do-teto-para-mei-e-perdao-de-dividas), 15/10/2026, 19h32; [ficha/autógrafo](https://www25.senado.leg.br/web/atividade/materias/-/materia/175969), remessa 16/10; [Agência Câmara](https://www.camara.leg.br/noticias/1311288-camara-aprova-novo-limite-de-enquadramento-para-microempreendedor-individual-e-inclui-perdao-de-dividas), 14/10, 19h44 | Projeto continua aguardando sanção na consulta. Propostas 110 mil/2027 e 140 mil/2028 não são teto já vigente. A contratação de até dois empregados foi qualificada pelo âmbito rural e remuneração previstos, de acordo com as duas agências. Acrescentada ficha atual do Senado. Revisão editorial/visível: 17/10. |
| [Balanço do Simples](https://gescompnegocios.com.br/simples-nacional-balanco-outubro-2026) | 16/10/2026 | [RFB](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/outubro/a-receita-federal-divulga-a-atualizacao-dos-numeros-referentes-as-solicitacoes-de-opcao-pelo-simples-nacional-e-pelo-regime-regular-do-ibs-e-da-cbs), 16/10, 15h34, atualização 15h36 | 657.753 pedidos Simples; 917.331 IBS/CBS; 256.607 deferidos e 401.146 indeferidos. Prazo de regularização não reabre opção. Retrato da divulgação preservado. |
| [Receita Sintonia](https://gescompnegocios.com.br/receita-sintonia-terceiro-ciclo-2026) | 16/10/2026 | [RFB](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/outubro/receita-sintonia-divulga-a-classificacao-do-3o-ciclo-de-2026), 15/10, 19h29, atualização 19h31 | Terceiro ciclo com dados de setembro, cerca de 10,99 milhões de PJs; critérios e possibilidade de revisão fundamentada. Sem atribuir opinião à GESCOMP. Preservado. |
| [CBS em documentos fiscais](https://gescompnegocios.com.br/cbs-documentos-fiscais-outubro-2026) | 16/10/2026 | [RFB](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/outubro/reforma-tributaria-86-dos-documentos-fiscais-de-empresas-obrigadas-ja-trazem-destaque-da-cbs), 09/10, 16h45 | 86% refere-se a documentos; 67% a estabelecimentos com destaque em toda ou parte da emissão. Painel atualizado em 08/10, notas até 07/10. Simples fora do levantamento de 2026. Preservado. |

As páginas sem correção mantêm `dateModified` em 16/10: conferência em 17/10 não foi usada para simular nova publicação. As três efetivamente corrigidas têm revisão visível, estruturada e sitemap em 17/10. As datas originais das fontes e dos artigos permanecem. Não foram criadas notícias, URLs ou categorias artificiais nem alterados preços comerciais. Os valores didáticos foram recalculados e identificados como exemplos.

O autógrafo do PLP 186 está ligado pela ficha oficial, mas o download exibiu verificação de segurança nesta ferramenta. Não se afirma ter lido esse PDF; a condição de contratação foi confrontada entre as duas agências oficiais e o estágio legislativo, pela ficha. O STF bloqueou a consulta processual; permanece a ressalva histórica e a necessidade de análise técnica/jurídica de eventual decisão aplicável ao contribuinte.

## Arquivos efetivamente alterados

- `publicar/index.html`: uma palavra no atendimento oficial.
- `publicar/fim-escala-6x1.html`: prazo em meses, exceções relevantes, fonte normativa direta e datas da revisão real.
- `publicar/novo-limite-mei.html`: condições de contratação propostas, estágio na consulta, ficha oficial e datas da revisão real.
- `publicar/departamento-pessoal.html`: chamada sobre emenda promulgada e datas da revisão real.
- `publicar/sitemap.xml`: lastmod apenas dos três guias alterados; inicial já estava em 17/10.
- `docs/testes/{auditoria-final-20261017.py,navegador-auditoria-20261017.js,fontes-auditoria-20261017.py,publicacao-auditoria-20261017.py}`: controles reproduzíveis, sequenciais, sem instalar dependências.
- `docs/evidencias/2026-10-17/auditoria/`: resultados, fontes e quatro capturas; este relatório e entrada de `docs/handoff.md`: registro da entrega.

## Preservação e testes executados

Todos os arquivos de `publicar/assets/` permaneceram iguais à base: CSS, JavaScript, configuração, imagens e fontes. Cabeçalhos, rodapés, atributos de estilo inline, imagens, H1, IDs, contatos e componentes foram comparados com o Git. Nenhuma classe de componente foi alterada; os acréscimos são links de fontes e seus rótulos acessíveis existentes. Somente quebras de linha/altura naturais dos textos podem variar.

Capturas antes/depois em 1366×768 e 390×844 foram conferidas. Os CTAs móveis continuam com dimensões iguais; as três fotos carregaram. Não foi feita comparação de pixels de toda a página, pois conteúdo e animações podem variar.

Comandos executados a partir de `02-site` (Python instalado: `C:/Users/fabri/AppData/Local/Programs/Python/Python314/python.exe`):

| Comando/verificação | Resultado real |
|---|---|
| `python docs/testes/auditoria-final-20261017.py` | 20 HTML, 13 artigos, 19 páginas no sitemap, zero erros; preservação de assets, fontes visíveis/JSON-LD, FAQ, links, IDs e datas |
| `node --check publicar/assets/js/site.js` | Aprovado |
| `node --check publicar/assets/js/config.js` | Aprovado |
| `node --check publicar/assets/js/libras.js` | Aprovado |
| `python docs/testes/fontes-auditoria-20261017.py --completar` | 67 fontes desta execução; 66 HTTP 200 e uma 403 explicitamente registrada; sem paralelismo |
| Playwright, `navegador-auditoria-20261017.js` | 19 páginas × 320/390/768/1366 × claro/escuro = 152 cenários, sem falhas ou exceções JS detectadas |
| Mesmo script, `page.auditPaths=[]; page.auditInteractions=true` | Oito verificações aprovadas: teclado/menu/Escape, FAQ, dimensões, mensagens WhatsApp, formulário simulado, home→serviço e sumário |
| Navegador real no domínio, antes da publicação | Inicial e rodapé abriram; plugin oficial VLibras carregou e expôs botão com nome acessível. Tradução/avatar não acionados |
| `git diff --check` | Aprovado; avisos de normalização LF/CRLF não são erro do conteúdo |

Não há TypeScript, lint ou build configurado. Scripts históricos que modificam conteúdo/imagens não foram executados como se fossem testes. Não foram instalados pacotes nem rodados Lighthouse ou tarefas paralelas.

As primeiras tentativas de navegador falharam e **não contam como aprovadas**: timeout de captura, bloqueio do servidor por logs acumulados e tentativa de servidor síncrono incompatível com conexões antecipadas do navegador. O servidor temporário foi substituído por `ThreadingHTTPServer` silencioso, com a mesma estrutura do servidor Python padrão. A matriz final foi repetida e retornou resultado limpo. Nenhuma dessas mudanças afeta hospedagem ou arquivos públicos.

Conexões externas foram bloqueadas na matriz local, incluindo Meta/VLibras; erros de recurso bloqueado não foram confundidos com exceção JS do site. No teste externo, somente o domínio e o provedor oficial de Libras foram liberados. Não houve mensagem real enviada nem login em conta. O conteúdo continua usando `main#conteudo`; não foi encontrado atalho inicial para pular o cabeçalho na base, uma limitação de acessibilidade preexistente fora das correções autorizadas. Não se declara certificação de acessibilidade completa.

## Publicação e pendências reais

Repositório: `https://github.com/gescompnegocios/gescomp-site.git`; branch: `main`; domínio: `https://gescompnegocios.com.br/`. A entrega usa o push normal e a integração já existente com o Worker `gescomp-site`, sem deploy manual ou mudança de infraestrutura. Após commit/push, executar `python docs/testes/publicacao-auditoria-20261017.py` e comparar `git rev-parse HEAD` com `git ls-remote origin refs/heads/main`. O resultado de publicação, com hash e 28 verificações HTTP, fica em `.playwright-mcp/auditoria-20261017/publicacao.json` (prova local deliberadamente fora do commit). Hash final e resultado efetivo são informados no fechamento, depois da verificação.

Pendências externas de verificação: acesso à ficha processual do STF e ao PDF protegido do autógrafo; nenhum desfecho judicial ou sanção não comprovados foi publicado. Não há promessa de primeiro lugar no Google ou seleção por IA, nem medição nova de indexação. A integração do avatar/tradução de Libras e os serviços da Meta não foram exercitados integralmente, para preservar recursos e o escopo. O placeholder oculto de Cursos já existente permanece fora do escopo.
