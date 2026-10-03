# Decisões de design

- **Estilo:** desde 03/10/2026, visual sóbrio com o traço desenhado só em pontos-chave (veja "Visual sóbrio" abaixo). Antes era "pintura" com bordas de pincel, ondas pintadas e textura de tela em tudo.
- **Fontes:** Bricolage Grotesque (títulos) e Figtree (textos).
- **Abertura:** fundo petróleo escuro igual ao rodapé; no celular, texto primeiro e arte depois; título com cidade e benefício ("Contabilidade em Aracaju para sua empresa crescer sem dor de cabeça.").
- **Animações:** curtas (cerca de 1 s na abertura) e números que contam em cerca de 3 s; respeitam quem desativa animações no aparelho.
- **Modo claro e escuro:** o site sempre abre no modo claro; o botão de sol e lua alterna durante a visita, sem guardar a escolha. No escuro, o sol da cena do Rio Sergipe vira lua.
- **Cena do Rio Sergipe:** ilustração animada na seção antes do Contato (escritório de frente para o rio).
- **WhatsApp:** botão flutuante com o símbolo do WhatsApp pintado; aparece depois de rolar a página e some no formulário.
- **Formulário:** abre o WhatsApp com a mensagem pronta (o Cloudflare Pages não envia formulários por conta própria).
- **Retirado a pedido:** etiqueta "Escritório de contabilidade em Aracaju, SE" da abertura; destaque de "Escritório virtual".
- **Cursos e comunidade:** seção pronta e escondida dentro de `index.html` (`<template id="secao-cursos">`). Para ativar, apague as linhas `<template ...>` e `</template>` e troque `[LINK-DA-PLATAFORMA]`.
- **Acessibilidade:** contraste conferido, foco visível no teclado, textos alternativos, leitura correta dos números para leitores de tela.

## Atualização de conteúdo (01/10/2026), sem mudança de design
- **Local:** o escritório físico fica em Barra dos Coqueiros. O título da abertura passou a ser "Contabilidade na Grande Aracaju para sua empresa crescer sem dor de cabeça." (Barra dos Coqueiros faz parte da Grande Aracaju).
- **Nome e logo:** "Gestão Empresarial e Planejamento Contábil", com a logo nova (cabeçalho, rodapé, selo, ícones e imagem de compartilhamento).
- **Números:** 12 anos de experiência (dela, desde 2014; o CNPJ é de 2026), +200 clientes atendidos, +50 contratos ativos e 5 estados.
- **Serviços:** os 6 cartões seguem os serviços dela, com preços "a partir de".
- **Perguntas frequentes:** bloco novo no fim da seção de Serviços, no mesmo formato das páginas de Informações.
- **Próximo passo de design (pedido dela):** mais partes com jeito de "rabisco", menos sério, possivelmente mais claro; manter a cena do rio como está.

## Atualização de 03/10/2026
- **Abertura:** o escritório atende online. Título: "Contabilidade próxima para a sua empresa crescer sem dor de cabeça." e subtítulo com "Atendimento online, de onde você estiver". A linha de confiança mostra "Atendimento online". Sem falar de forma direta em "todo o Brasil" na abertura (só nos dados para o Google).
- **Carrossel "A GESCOMP no Instagram":** nova seção entre Sobre e Resultados, com botão "Seguir @gescomp_ no Instagram".
  - **Vídeos visíveis direto:** os embeds oficiais do Instagram carregam sozinhos quando a seção chega perto da tela, sem clique. A capa pintada fica só como espaço reservado enquanto o vídeo carrega (e como link, se o Instagram falhar ou se não houver JavaScript). Se o Instagram só demorar, o link é provisório: o vídeo toma o lugar da capa assim que carrega. Consequência: o site se conecta à Meta em toda visita que chega à seção, o que deve constar numa futura política de privacidade.
  - **Sem botão de pausa:** a passagem automática (8 s, volta ao início) para sozinha com mouse em cima, foco de teclado, toque ou clique dentro de um vídeo, aba em segundo plano e "reduzir movimento". Depois de assistir, volta com cerca de 3 s de atraso, para não tirar o vídeo da tela de repente.
  - **Setas:** botões redondos lisos (petróleo `#0B5963`, ícone branco) nas laterais, no meio da altura do carrossel, longe dos controles do vídeo. Escondidas com um único vídeo ou quando todos cabem na tela.
  - **Vídeo próprio:** a lista também aceita `.mp4` e `.webm`, exibidos com os controles do navegador. Nesses vídeos, o play e o pause reais controlam a passagem.
- **VLibras:** script oficial do governo nas nove páginas principais, com o foco do botão nas cores do site. O ajuste em `assets/js/libras.js` posiciona o botão no lado direito, logo acima do WhatsApp, para ficar visível sem cobrir texto nem as setas do carrossel. O painel e a tradução continuam oficiais.
- **Páginas de Informações:** textos e descrições sem foco em Aracaju (ex.: "Junta Comercial do seu estado").

## Visual sóbrio (03/10/2026, branch `melhorias-visual-sobrio`)
Objetivo: aparência mais profissional de contabilidade, mantendo a identidade.

**Página inicial ("nível 2")**
- **Continua desenhado:** sublinhado de pincel do título da abertura (e do título do formulário); ilustração da abertura (barras, curva e círculo da foto), um pouco menor e com pincel mais suave (filtros novos `pincelSuave` e `pincelMedio`); moldura da foto no Sobre e a ilustração da mesa; três ondas: fim da abertura, entrada do rio e topo do rodapé; botão flutuante do WhatsApp.
- **Seção do Rio Sergipe intacta:** ilustração, barco, sol e lua, animações, modo escuro e o botão "Como chegar". Ela segue usando os filtros originais `pincel`, `pincelForte` e `pincelBotao`, que não foram alterados.
- **Fica limpo:** botões retangulares com cantos de 12 px (principal âmbar `#E8952F` com texto `#003F4A`; secundários com borda de 2 px); cards e caixas com borda de 1 px `var(--linha)`, cantos de 18 a 20 px e sombra suave; ícones em quadrados arredondados de cor sólida; botões do cabeçalho em círculos lisos; formulário em cartão branco com campos retos (borda de 1,5 px, cantos de 10 px); sem textura de tela; as outras transições entre seções ficaram retas.
- **Título da abertura** mais contido: `clamp(40px, 4.6vw, 64px)`, peso 700.
- **Números de Resultados:** o traço pintado atrás de cada número virou um sublinhado reto, com a mesma animação.
- **Cores:** laranja só em botões de ação, sublinhados e avisos; ícones de cards em tons de petróleo.
- **Serviços:** a lista virou 6 cards de ação com "Falar no WhatsApp" e mensagem pronta para cada assunto (grade de 3, 2 e 1 colunas).
- **Avaliações:** seção "O que dizem nossos clientes" depois de Resultados, escondida até haver avaliações no `config.js`.

**Páginas de Informações ("nível 3")**
- Só o sublinhado do título e a onda do fim da abertura ficam desenhados. Ilustração da abertura, linha do tempo, cards, tabelas, etiquetas de valores, perguntas frequentes e botões ficam limpos.

**Acessibilidade:** contraste WCAG AA conferido com axe-core em todas as páginas, nos modos claro e escuro, no computador e no celular. Etiquetas com texto branco usam terracota `#B65A0C` (4,7:1) no lugar do laranja `#D87319`.
