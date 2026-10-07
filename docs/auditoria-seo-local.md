# Auditoria de SEO local — 07/10/2026

Base: `f970f3f`, árvore publicada inicialmente limpa. Esta rodada não acessa serviços externos. Inventário integral de títulos, descrições, headings, conteúdo, imagens, links e JSON-LD: [auditoria-antes.json](evidencias/2026-10-07/seo-local/auditoria-antes.json). Capturas da abertura e do rio nas quatro larguras, claro/escuro, estão na mesma pasta.

## Diagnóstico antes da implementação

12 arquivos HTML, 11 indexáveis. Canonicals e sitemap concordam; titles/descriptions existentes são distintos; um H1 em cada página. Links internos ativos e dimensões/alt das imagens passam na inspeção estática. A 404 não possui description. O template inativo de cursos não é conteúdo publicado e não será alterado.

| Página | Intenção existente | Decisão |
|---|---|---|
| `/` | Marca, escritório local e contato | Preservar H1; trazer contexto local para o parágrafo e links de serviço para os cards. |
| `/informacoes` | Hub de nove assuntos e reforma tributária | Preservar informações e fontes; ligar orientação tributária ao serviço correspondente. |
| `/abrir-empresa` | Guia de abertura de CNPJ | Manter URL e guia; adicionar atendimento de abertura, sem página concorrente. |
| `/imposto-de-renda` | Regras de IR de 2026 | Manter guia; adicionar atendimento de declaração de pessoa física, sem inventar prazo ou inclusões. |
| `/mei` | Guia de regras e transição de MEI | Adicionar orientação, ligada aos serviços de regime e regularização. |
| `/simples-nacional` | Guia de regras e opções tributárias | Ligar à escolha de regime e contabilidade empresarial. |
| `/pro-labore-e-lucros` | Informação sobre retiradas dos sócios | Ligar à contabilidade e organização financeira. |
| `/departamento-pessoal` | Guia informativo de folha | Ligar aos cálculos trabalhistas; não prometer execução mensal de folha/eSocial. |
| `/calendario-fiscal` | Prazos e obrigações | Ligar à contabilidade empresarial; manter datas da consulta técnica. |
| `/fim-escala-6x1` | Acompanhamento de proposta | Preservar distinção proposta/lei e fontes; ligar ao guia trabalhista e cálculos. |
| `/novo-limite-mei` | Acompanhamento de propostas de teto | Preservar distinção proposta/lei e fontes; ligar à orientação de regime. |
| `/404` | Página de erro, noindex | Adicionar description; continuar fora do sitemap. |

As páginas existentes não são órfãs, mas dependem majoritariamente do hub. Os serviços da home levam ao WhatsApp e não têm páginas próprias para explicar a contratação. Essa é a principal lacuna comercial. Não há justificativa para páginas por cidade ou duplicação dos guias de abertura/IR/MEI.

## Fontes internas e limites do conteúdo

- `01-empresa/textos/servicos-e-precos.md`: abertura, regularização/baixa de CNPJ, contabilidade empresarial, IRPF, cálculos trabalhistas, consultoria administrativa/financeira e orientação de regime/MEI.
- Home e perguntas frequentes já publicadas confirmam orientação sobre faturamento, atividade e regime; justificam uma página de planejamento tributário limitada à escolha de regime, sem prometer economia.
- `docs/perguntas-para-aprovar.md`: troca de contador, escopo do plano de R$ 150 e respostas de contratação ainda aguardam aprovação. Não publicar esses rascunhos. O usuário pediu explicação sobre troca, mas não confirmou o serviço.
- Nome, CRC, endereço e telefone são conferidos entre home, config e llms. Nenhuma nova unidade ou cidade será inventada.
- Esta rodada não revalida legislação na web. Os textos técnicos e suas datas de consulta serão preservados; datas de modificação do documento não significam nova revisão legal.

## Dados estruturados e infraestrutura

O mesmo `#empresa` é AccountingService na home e Organization nos guias. Unificar o tipo, preservando ID e dados verdadeiros. Person/CRC e autoria já existem; corrigir meta author nos artigos para corresponder à autoria visível. Não adicionar Review/AggregateRating. FAQs existentes devem permanecer correspondentes ao texto visível.

`robots.txt`, `_headers`, manifest, CSS e JS foram inspecionados. Não há motivo de SEO para alterar permissões de bots, segurança ou animações. O sitemap parametrizado em robots é uma decisão anterior de cache: mantê-lo nesta rodada local, sem reenviar nada. URLs canônicas das páginas continuam limpas.

O teste antigo `validacao-estatica.cjs` tem expectativas obsoletas de imagem OG, versão de assets, quantidade de URLs e base Git. Deve delegar à validação atual, em vez de apresentar essas falhas históricas como regressões desta rodada.

## Plano de arquitetura

Criar cinco páginas com intenção distinta: contabilidade empresarial, regularização/baixa de CNPJ, cálculos trabalhistas, consultoria financeira e escolha de regime (planejamento tributário). Elas reutilizam os tokens e o cabeçalho/rodapé atuais, sem novos scripts, fontes, imagens ou dependências. WhatsApp continua disponível imediatamente; links secundários nos cards permitem conhecer o serviço antes de contratar. Nas linhas compactas, o link leva ao serviço, que mantém CTA específico.

Preservar o rio literal e CSS/JS completos. Comparar capturas locais com animações congeladas e hashes da base. Testar metadados, grafo de links, sitemap, dados estruturados, responsividade, foco e acessibilidade com toda rede externa bloqueada.
