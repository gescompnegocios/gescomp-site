# Conteúdo e SEO — revisão de 10/10/2026

O Codex ampliou os dez guias de Informações, preservando a estrutura editorial que o Claude gravou nesta rodada. Foram acrescentadas 22 seções, exemplos próprios, links entre assuntos e fontes oficiais. Não houve edição de CSS, JavaScript, fotos, serviços contratados, biografia, formulário, avaliações ou rio pelo Codex.

## Colaboração e limite de responsabilidade

Base Git inicial: `9c948b3`, limpa. Durante a pesquisa, o Claude gravou a coluna de leitura, sumário, perguntas incorporadas ao artigo, recomendações sem fotos e atualização dos recursos compartilhados. Essas alterações preexistiam à integração do conteúdo e foram mantidas.

Não há ponte direta para a sessão do Claude no VS Code. O pedido foi deixado no handoff e o Rafael informou a tarefa dele. Depois, informou que não conseguia avisá-lo. O Codex integrou acréscimos separados usando as classes existentes, após preparar todo o texto, com snapshot dos arquivos atuais e verificação de igualdade antes de cada gravação. Não ocorreu detecção de edição concorrente nos arquivos gravados. O Claude confirmou depois no handoff que terminou as dez estruturas e não voltaria a editar seus bodies; registrou também os componentes a usar e seus testes anteriores à integração.

## Acréscimos e fontes principais

| Página | Conteúdo acrescentado ou corrigido | Fonte primária |
|---|---|---|
| Informações/reforma | Documento fiscal não equivale a recolhimento; NFS-e nacional para prestadores ME/EPP do Simples em 1º/11/2026; preparação operacional e efeito sobre clientes/compras | [Receita: Resolução CGSN 191/2026](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/agosto/simples-nacional-nfs-e-nacional-sera-obrigatoria-para-me-e-epp-a-partir-de-1o-de-novembro-de-2026), [LC 214/2025](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm) |
| Imposto de Renda | Exemplo com rendimento de R$ 6.000 e deduções hipotéticas de R$ 800; duas fontes de renda; retenção não equivale a obrigação de declarar; quatro fatos geradores dos dividendos | [Tabela oficial de 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026), [Lei 15.270/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm) |
| MEI | Abertura em julho, limite proporcional e efeitos do excesso; controle de receita bruta e documentos | [LC 123/2006, arts. 18-A e 18-C](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm), [Relatório Mensal do Empreendedor](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/relatorio-mensal) |
| Simples Nacional | Exemplo próprio de alíquota efetiva do Anexo I; diferença entre ingressar no Simples e escolher CBS/IBS fora do DAS; protocolos e pendências | [LC 123/2006, Anexo I](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm), [Receita: prazos atualizados de outubro](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/setembro/simples-nacional-2027-entenda-os-novos-prazos-e-faca-sua-escolha-com-consciencia-e-tranquilidade/) |
| Abrir empresa | Viabilidade antes do aluguel; licenciamento conforme atividade; organização de dados/CNAEs e primeira operação | [Redesim](https://www.gov.br/empresas-e-negocios/pt-br/redesim/abrir-cnpj), [Receita: primeiro CNPJ alfanumérico em 31/07/2026](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/julho/receita-federal-gera-o-primeiro-cnpj-em-formato-alfanumerico) |
| Pró-labore/lucros | Saldo bancário não comprova lucro; documentos; operações do mesmo mês; EFD-Reinf e tratamento de dividendos sem retenção | [Lei 15.270/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm), [Receita: recolhimento de dividendos](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/agosto/receita-federal-orienta-sobre-os-procedimentos-para-o-recolhimento-do-imposto-de-renda-retido-na-fonte-sobre-lucros-e-dividendos), [FAQ da EFD-Reinf](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/perguntas-frequentes/sped/efd-reinf/efdr/2-eventos-da-efd-reinf/2-13-6-como-declarar-o) |
| Funcionários/folha | Preparação da admissão; ponto por estabelecimento; bruto, líquido e custo; exemplo de FGTS; aviso de férias | [CLT](https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm), [NR-7](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-07-atualizada-2022-1.pdf), [Lei 8.036/1990](https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm) |
| Calendário | Competência, declaração e pagamento separados; rotina de comprovantes; obrigações conforme regime; NFS-e em novembro | [Agenda da Receita — outubro de 2026](https://www.gov.br/receitafederal/pt-br/assuntos/agenda-tributaria/2026/Outubro/dia-15-10-2026), [LC 123/2006](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm) |
| Escala 6x1 | Movimentação de 09/10; comparação PEC 221/148; regras atuais e simulação de jornada | [Ficha PEC 221](https://www25.senado.leg.br/web/atividade/materias/-/materia/174386), [Ficha PEC 148](https://www25.senado.leg.br/web/atividade/materias/-/materia/124067), [texto explicado pela Câmara](https://www.camara.leg.br/noticias/1277141-camara-aprova-em-dois-turnos-fim-da-escala-6x1-com-jornada-maxima-de-40-horas-semanais) |
| Novo limite MEI | Comparação PLP 108, 67 e 186; urgência/apensamento/rito; crescimento usando o teto vigente | [PLP 108](https://www.camara.leg.br/proposicoesWeb/fichadetramitacao/?idProposicao=2295251), [PLP 67](https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2487549), [PLP 186](https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2635476) |

Os projetos não foram apresentados como leis vigentes. Na PEC 221, a ficha registra quarta discussão na pauta de 13/10, futura neste corte, e não uma aprovação realizada. Não reproduzimos datas de uma notícia do Senado de 09/10 que contém inconsistência entre dia do mês e dia da semana. PDFs de pareceres do Senado exigiram verificação de segurança: as fichas legislativas e explicações oficiais acessíveis foram usadas, sem afirmar leitura desses PDFs.

A liminar sobre lucros de 2025 aparece como fato histórico. Não foi confirmado um desfecho posterior do referendo; os dois artigos pedem conferir a decisão aplicável ao caso. O calendário e os critérios da declaração de IR de 2027 não foram inventados.

## SEO implementado e conferido

- Conteúdo em HTML, fontes próximas aos fatos, links descritivos entre guias/serviços e 22 novos destinos no sumário existente.
- Título de Informações explicita a reforma tributária de 2026; OG e Twitter acompanham.
- `Article.citation` aponta apenas para fontes visíveis; `dateModified` e a revisão visível dos dez guias refletem 10/10. Datas originais de publicação preservadas.
- Sitemap permanece com 16 URLs; `lastmod` de 10/10 somente nos dez guias realmente ampliados. Inicial e serviços conservam a revisão de conteúdo de 08/10. O endereço de submissão aceito continua `sitemap.xml?v=20261006`.
- Perguntas que o Claude integrou em subtítulos continuam visíveis, com respostas correspondentes ao `FAQPage` existente. Não há blocos `<details>` no corpo desses artigos nem promessa de resultado especial de FAQ no Google.
- Marca, escritório real em Barra dos Coqueiros/Grande Aracaju e atendimento on-line continuam consistentes. Não cadastramos “GECOMP” ou “GEESCOMP” como marcas, não criamos páginas por cidade e não repetimos palavras apenas para classificar.

O [guia oficial do Google para recursos de IA](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) orienta conteúdo útil e SEO comum: não há tamanho ideal de página, arquivo especial ou marcação que garanta recomendação. A ampliação atende dúvidas concretas; não segue uma meta de palavras. O [guia de conteúdo útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) reforça esse critério.

## Verificações realmente executadas

- 17 HTML: JSON-LD, títulos/descrições únicos, canonical/OG/Twitter das 16 indexáveis, fontes visíveis, destinos e fragmentos internos, recursos locais e 404 noindex. Seis contas de exemplos verificadas com aritmética decimal.
- 168 arquivos idênticos ao snapshot após o trabalho visual do Claude, incluindo JavaScript e inicial. O CSS recebeu depois somente duas correções de âncora do Claude (`proposta-aviso` e `section.leia-mais[id]`), revisadas separadamente; o teste aceita apenas esse delta exato, sem ignorar outras mudanças. HTML do rio também igual ao Git inicial `9c948b3`.
- Navegador: 80 cenários dos dez guias em 1366×768, 1920×1080, 390×844 e 360×844, claro/escuro; mais dez cliques no sumário em 360px. Sem overflow, imagem quebrada, atributo escapado indevidamente ou erro próprio de console. Uma aba/contexto por vez, fornecedores externos simulados; isso não valida Instagram/VLibras reais nem mede Lighthouse.
- Conferências posteriores: quatro cenários do parágrafo corrigido de IR e 12 verificações das âncoras revistas pelo Claude, em 1366/360 px e dois temas. Os títulos ficaram abaixo do cabeçalho. Total: 106 cenários aprovados. O teste específico de âncoras inicialmente reutilizava o mesmo hash após voltar ao topo; corrigido o reset da URL de teste, os dois temas passaram sem alteração no site.
- Dois pares de capturas completas do rio (345×876), claro/escuro, idênticos pixel a pixel. Animações congeladas apenas na captura, sem mudança no site.
- `node --check` de `site.js` e `config.js`; `git diff --check`.
- Acesso público em 10/10: inicial, contabilidade empresarial, robots e sitemap HTTP 200; marca/títulos anteriores já publicados, robots permite Googlebot, sitemap retorna XML com 16 URLs. Não foi uma inspeção autenticada nem prova de indexação/classificação.

Evidências: [conteudo-seo](evidencias/2026-10-10/conteudo-seo/). A matriz foi executada depois de integrar os textos; os dois ajustes posteriores no parágrafo de IR tiveram uma conferência específica adicional. O primeiro teste de navegador foi interrompido por um seletor CSS do próprio teste que não escapava ID iniciado por número; corrigido para `getElementById`, a matriz completa passou. Nenhuma alteração no site foi necessária para isso.

## Publicação e acompanhamento

Esta rodada está local, sem commit/push/deploy solicitado no pedido atual. Após publicação, conferir as dez URLs na Inspeção de URL, acompanhar indexação e consultas por marca, serviços e localização. O histórico do Search Console está em [google-search-console.md](google-search-console.md); nenhum relatório da conta foi consultado nesta rodada. Nem primeiro lugar nem inclusão em resposta de IA podem ser garantidos.

Pendências da cliente continuam separadas: fotos reais da Gabriela/escritório e aprovação de respostas comerciais/escopo do plano. Não foram inventadas inclusões, preços ou prazos de serviço para alongar as cinco páginas comerciais.
