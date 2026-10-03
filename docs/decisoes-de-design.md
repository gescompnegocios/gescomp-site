# Decisões de design

- **Estilo:** "pintura" com bordas de pincel, ondas pintadas entre seções e textura de tela, nas cores da logo.
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
  - **Vídeos visíveis direto:** os embeds oficiais do Instagram carregam sozinhos quando a seção chega perto da tela, sem clique. A capa pintada fica só como espaço reservado enquanto o vídeo carrega (e como link, se o Instagram falhar ou se não houver JavaScript). Consequência: o site se conecta à Meta em toda visita que chega à seção, o que deve constar numa futura política de privacidade.
  - **Sem botão de pausa:** a passagem automática (8 s, volta ao início) para sozinha com mouse em cima, foco de teclado, toque ou clique dentro de um vídeo, aba em segundo plano e "reduzir movimento". Depois de assistir, volta com cerca de 3 s de atraso, para não tirar o vídeo da tela de repente.
  - **Setas:** botões redondos pintados (petróleo `#0B5963`, ícone branco) nas laterais, no meio da altura do carrossel, longe dos controles do vídeo. Escondidas com um único vídeo ou quando todos cabem na tela.
  - **Vídeo próprio:** a lista também aceita `.mp4` e `.webm`, exibidos com os controles do navegador. Nesses vídeos, o play e o pause reais controlam a passagem.
- **VLibras:** script oficial do governo nas nove páginas principais, com o foco do botão nas cores do site. O ajuste em `assets/js/libras.js` posiciona o botão no canto inferior esquerdo para evitar sobreposição com WhatsApp e setas; o painel e a tradução continuam oficiais.
- **Páginas de Informações:** textos e descrições sem foco em Aracaju (ex.: "Junta Comercial do seu estado").
