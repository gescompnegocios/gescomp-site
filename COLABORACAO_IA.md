# Colaboração entre IAs (Codex e Claude Code)

Registro resumido. O detalhamento de cada etapa, os pedidos e as pendências ficam em `docs/handoff.md`.

| Data | Agente | Etapa | Situação |
|---|---|---|---|
| 04/10/2026 | Codex | 1 (A, F, G, H): domínio, SEO, JS, config, docs | concluída |
| 04/10/2026 | Claude Code | 2 (B, C, D, E): body dos `.html` e `site.css`, mais avaliações do Google a pedido do usuário | **concluída**, sem commit; detalhes, testes e pedidos em `docs/handoff.md` |
| 04/10/2026 | Codex | 3 (I): revisão, testes e fechamento local | concluída no commit local `c390783`, incluindo ajuste acessível autorizado; sem push/deploy |
| 04/10/2026 | Codex | Revisão adicional: imagens, gráfico anterior, WhatsApp, avaliações e hover | concluída e validada; entrega versionada localmente na main, sem push/deploy |

Revisão: 72 casos de páginas/telas/temas, 23 testes funcionais e 20 testes de interação aprovados. Lighthouse: 100/100 de acessibilidade no celular e computador. Instagram real com cinco embeds prontos; VLibras real carregado, sem erros nos cenários verificados. O usuário confirmou as duas áreas de ajuste no rio: placa e onda lisa; o restante é idêntico ao HTML base, com regras da cena e animações preservadas.

Atualização posterior do usuário: autorizou imagens geradas sem pessoas, textos ou logos falsos e a seleção de avaliações reais do Google. Codex integrou 13 imagens (3 cards, 8 capas, 404 e compartilhamento), recuperou o gráfico largo anterior, restaurou o WhatsApp flutuante desde a abertura e corrigiu contraste no hover. Três avaliações reais renderizadas com primeiro nome e inicial. Fontes e prompts em `docs/evidencias/2026-10-04/`.

Revisão adicional: 80 cenários em dez páginas, quatro telas e dois temas; 47 testes de imagens/hover/avaliações/retrato, 23 funcionais e 20 de interação aprovados. Instagram real com cinco embeds prontos; VLibras real carregado e sem sobrepor controles no celular. Lighthouse acessibilidade 100/100 no celular e computador. Rio com HTML e CSS da cena idênticos a `c390783`; oito pares de capturas controladas sem nenhum pixel diferente. Evidências e limites em `docs/handoff.md`.

Pendências atuais: retratos reais da Gabriela, foto real do escritório, aprovação das respostas de contratação e publicação externa autorizada da nova versão. Avaliações e imagens ilustrativas dos serviços já entregues. Sem push/deploy nesta rodada.

## 04/10/2026 — nova rodada concluída pelo Codex

O último pedido substitui a preferência anterior por gráfico/imagens geradas. Cinco avaliações reais, resumo somente “5 estrelas no Google”, cards de tamanho comum, ciclo contínuo sem cópias e gesto no celular sem setas. Setas no computador afastadas do texto. Grade dos assuntos em 3/2/1 colunas. Sete fotografias reais licenciadas da web substituem as artes nos cards, capas e 404; compartilhamento também fotográfico. Treze arquivos gerados sem referências removidos da pasta publicada.

Gráfico e selos da abertura removidos; moldura reservada à foto real de Gabriela e somente no computador. O usuário confirmou que ela ainda não chegou. Rio integralmente preservado: HTML/CSS idênticos a 5d4dc81 e zero pixels diferentes nos oito pares.

Testes: 80 cenários, 31 verificações específicas, 23 funcionais, prova de várias voltas do ciclo e Lighthouse acessibilidade 100/100 no celular/computador. Cinco embeds reais prontos; permissão unload validada com os cabeçalhos locais simulados. Três avisos de recursos desconhecidos continuam nas respostas do Instagram e dependem da Meta; não são cabeçalhos do site nem foram mascarados. Fontes, capturas e limites em docs/handoff.md.

Arquivos: HTML/metadados/fotos, site.js, config.js, site.css, _headers, docs e LEIA-ME. Sem alteração fora do pedido; sem frameworks, bibliotecas de execução, push, deploy ou produção. Etapa pronta para revisão em sequência pelo Claude; não restaurar gráfico, selos, total de avaliações ou imagens geradas. Retratos reais, escritório e respostas da cliente continuam pendentes. Fechamento em commit local descritivo na main.

## 04/10/2026 — Codex aguardando a entrega visual do Claude

Na conferência anterior ao commit, Codex encontrou o registro de 18:47 do Claude em docs/handoff.md, ainda EM ANDAMENTO. Nenhum commit desta rodada foi feito. Codex não editará os arquivos visuais reservados enquanto esse registro estiver ativo. Os testes fotos-reais documentados acima descrevem a versão concluída antes do novo plano visual; após a entrega, serão repetidos os testes afetados e revisada a integração antes do commit local. Push/deploy continuam proibidos.

## 04/10/2026 — integração final concluída pelo Codex após a entrega do Claude

Claude marcou a entrega CONCLUÍDO e liberou os arquivos. Codex revisou seus nove pedidos: corrigiu o carregamento futuro da foto na moldura oculta de Sobre, ligou nota/depoimento da abertura ao config.js, manteve capa do Instagram até MOUNTED da janela/origem corretas, reduziu contagem para 1600ms, variou fotos e retirou textos em inglês do caderno/calendário. Oito fotos reais finais, fontes documentadas; versões de CSS/JS com rev=2. Rascunho em primeira pessoa permanece somente para aprovação interna.

Verificação final: 80 cenários, 31 verificações específicas, 23 funcionais e 16 da integração aprovados. Lighthouse acessibilidade 100/100, celular/computador. Rio literalmente preservado e oito pares sem pixels diferentes. Cinco embeds reais carregados com imagens, vídeos inicialmente pausados; zero erros JS e violações unload no teste com cabeçalhos locais simulados. Três avisos dos cabeçalhos da Meta continuam externos.

LEIA-ME, decisões, pendências, fontes e evidências atualizados; detalhes em docs/handoff.md. Commit único local das duas rodadas na main; nenhum push/deploy/produção. Nenhuma pendência de código nos nove pedidos do Claude. Faltam fotos da cliente, aprovações dos textos e decisões abertas registradas no handoff. A nota de espera anterior foi encerrada por esta entrega.

## 04/10/2026 — Claude Code: plano visual revisado concluído (sem commit)

Registro de 18:47 em `docs/handoff.md` marcado como CONCLUÍDO. `index.html`, as 8 páginas de Informações e `site.css` estão liberados para o Codex. O trabalho foi feito por cima da rodada de fotos reais, sem desfazer nada dela.

O que entrou:
- **Abertura:** card com a prova real do Google (5,0 e a avaliação do Marcelo S.), que dá lugar ao retrato quando ele existir.
- **"Como funciona":** seção nova com 3 passos e o convite para quem pensa em trocar de contador.
- **Números:** faixa com fundo claro.
- **"Quem é a Gabriela":** textos factuais e a citação dela no lugar do selo.
- **Botão flutuante do WhatsApp:** pulso finito.
- **Hub de Informações:** sem o ícone redundante nos cards com foto.
- **Páginas de Informações:** autoria e chamado de WhatsApp contextual em cada uma.
- **Microinterações:** só quando "reduzir movimento" está desligado.

Testes:
- 9 páginas × 4 larguras × 2 temas: 0 violações de contraste AA, sem rolagem lateral e sem erros;
- chamados novos abrem o WhatsApp com a mensagem certa;
- "reduzir movimento" e foco visível conferidos;
- rio com HTML e CSS idênticos a `5d4dc81`.

Para o Codex, detalhes em `docs/handoff.md`:
- fotos com texto em inglês legível (MEI e calendário) e fotos repetidas;
- Instagram com cards brancos enquanto carrega;
- contagem dos números em cerca de 1,6 s;
- `?v=` novo;
- documentação das seções novas;
- texto em primeira pessoa da Gabriela para aprovação;
- revisão e commit único das duas rodadas, sem push nem deploy.

## 06/10/2026 — Codex: revisão e implementação dos dois ajustes de abertura/logo

Handoff lido; main inicialmente limpa, base `5953ec4`, sem entrega do Claude para este pedido. Codex assumiu a implementação inicial conforme o protocolo. Pedido atual autoriza explicitamente commit e push para main.

H1 e dois parágrafos da abertura aplicados exatamente como solicitados; span com grifo SVG de fundo e quebra clonada por linha. H1 limitado a 50px só na abertura para cumprir duas linhas no computador; subtítulos, botões, confiança e preços dos serviços preservados. Logos transparentes fornecidas copiadas sem edição; cabeçalhos (inclusive 404) com negativa compacta de 40/34px, rodapés com negativa completa de 64px, WebP e reserva PNG. Retiradas caixa/pílula/mistura, mantido foco visível. Cache dos CSS/scripts existentes com data 20261006; scripts e JSON-LD preservados.

Arquivos: dez HTML de `publicar/`, `assets/css/site.css`, `assets/css/estrutura.css`, `assets/img/grifo-pincel.svg`, oito arquivos em `assets/img/logo/`, handoff, registro de colaboração e evidências/ferramentas locais em docs. Nenhum framework nem biblioteca no site.

Conferências executadas: 62 combinações de páginas/telas/temas, sem rolagem lateral, erros locais ou violações axe A/AA. H1 em duas linhas em 1366/1920; grifo em dois fragmentos em 390/360. Logos alinhadas, PNG de reserva carregado e foco de 3px. Node syntax check e diff --check aprovados; busca de mix-blend-mode sem resultados. Serviços externos simulados na matriz.

Rio: HTML, CSS e variáveis literalmente preservados. Oito pares de capturas: sete idênticos pixel a pixel; escuro de 1366 com 12 pixels de arredondamento de 1/255 por canal, sem diferença visual. Detalhes e links antes/depois em `docs/handoff.md` e `docs/evidencias/2026-10-06/`.

Nenhuma pendência destes ajustes. Foto real da cliente continua pendente e não foi substituída. Commit e push normal da entrega atual para main autorizados; sem execução de deploy ou mudança de DNS.

## 06/10/2026 — Codex: avaliações automáticas, Bahia e fotografias distintas

Base `531dc6c`, Git inicialmente limpo, sem mudança simultânea do Claude identificada. A pedido do usuário, avaliações mantêm cinco cards originais e 30 px/s, sem setas ou interferência de mouse/foco/toque/arrasto/roda/teclas. Corrigido deslocamento nativo ao focar link fora da faixa; animação não reinicia. Links do Google, rolagem vertical, movimento reduzido e proteções de visibilidade mantidos. Instagram preservado.

Bahia incluída, contador visual/acessível 5 → 6 e JSON-LD/llms sincronizados. Fotos repetidas substituídas por 19 originais visíveis distintos com declaração CC0, sem pessoas/mãos/manequins ou retratos desenhados; outra foto para compartilhar a inicial. Fontes, ampliação dos recortes e hashes em docs/imagens-reais-fontes.md; 28 WebP locais abaixo de 150 KB, sem geração por IA. Arquivos anteriores preservados; cache `20261006&rev=2`.

Testes: 80 combinações (dez páginas/quatro telas/dois temas), sem overflow, fotos ausentes, erros locais ou violações axe A/AA; serviços externos simulados. Teste controlado: 32 interações mantêm fase e aproximadamente 30 px/s; duas voltas completas em desktop/celular com cinco originais. Fixture Instagram confirmou pausas, retomada, trava de vídeo e setas. Rio literalmente preservado em HTML/CSS/módulo inicial, quatro pares de PNG idênticos. Evidências/ferramentas em docs/evidencias/2026-10-06/avaliacoes-fotos/ e docs/testes/.

Arquivos: dez HTML, site.js, config.js, site.css (só avaliações), llms.txt, WebP, LEIA-ME, docs/imagens*.md, handoff, evidências e este registro. Commit/push normal para main conforme autorização persistente. Sem deploy manual/DNS. Pendência externa: fotos reais da Gabriela/escritório. Claude pode continuar após esta entrega, preservando os comportamentos e a seleção sem repetições.
