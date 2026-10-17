# Ajustes das quatro referências visuais — 17/10/2026

Base: `48467333f78bbc1a86a24001ccd9c595440c6ab0`, main limpa no início. Trabalho restrito à inicial, CSS correspondente e duas entradas da lista de fotos; mensagens e comportamento do WhatsApp preservados.

| Referência | Resultado |
|---|---|
| Entrada no desktop | Respiros superior/inferior reduzidos, com ajuste adicional para janelas até 700 px de altura. Em 1366 × 600, o fim da abertura passou de 645,9 para 559,3 px; a onda e o começo da próxima seção agora aparecem. Nas janelas maiores, a redução é menor. |
| Botões no celular | “Ver serviços” tem a mesma largura e altura do WhatsApp abaixo de 600 px. Conferidos 320/360/390/500 px; ambos com 50 px de altura. |
| Serviços | Primeira e terceira fotos substituídas pelas capas dos respectivos serviços, já licenciadas no acervo e com variantes responsivas. Links abaixo dos CTAs centralizados; no desktop, reservado espaço comum de duas linhas para manter as ações alinhadas. |
| Institucional | Título/introdução e história em duas colunas no desktop, empilhados no celular. Removidas as margens padrão de 17 px dos parágrafos: antes havia 54 px entre os blocos; agora o intervalo é 16 px. Textos oficiais e cartões de missão, visão e valores preservados. |

Arquivos de produto: `publicar/index.html`, `publicar/assets/css/site.css`, `publicar/assets/js/config.js` e somente o lastmod da inicial em `publicar/sitemap.xml`. Novas versões de CSS/config na inicial evitam cache antigo. Fontes das duas fotos registradas em `imagens-reais-fontes.md`.

Validação de navegador: 20 cenários, dez tamanhos entre 320 e 1920 px, claro/escuro, sem falhas de overflow, recursos locais ou JavaScript. Verificadas dimensões iguais dos botões móveis, centralização dos links, carga das três imagens, tema, menu e destinos WhatsApp. Instagram e VLibras bloqueados nessa matriz local; nenhum envio real. Comparação visual com capturas anteriores e posteriores.

Preservação estática: texto visível da inicial, links e mensagens comerciais, artigos, rio, contato, rodapé, avaliações e Instagram conferidos contra a base. Sintaxe dos três scripts e diff sem erros. As datas da revisão editorial dos artigos permanecem em 16/10; esta rodada trata dos quatro ajustes visuais. Evidências em `evidencias/2026-10-17/visuais/`.

Commit/push seguem a autorização da tarefa; confirmação do hash remoto e da publicação é feita no fechamento da conversa.
