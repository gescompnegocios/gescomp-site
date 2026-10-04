/* Configurações do site da GESCOMP.
   Edite apenas os valores entre aspas e publique o site de novo. */
window.GESCOMP_CONFIG = {
  // WhatsApp que recebe os clientes: código do país + DDD + número, só números.
  // Exemplo: '5579999999999'. Enquanto estiver vazio, os botões levam ao formulário.
  whatsapp: '5579988771430',

  // Mensagem que já aparece escrita quando o cliente toca em "Falar no WhatsApp".
  mensagemPadrao: 'Olá! Vim pelo site da GESCOMP e gostaria de atendimento.',

  // Mensagens dos cards e das linhas de "Como podemos ajudar". Cada link aponta para uma destas
  // mensagens pelo nome (atributo data-whatsapp-msg no index.html). Para mudar o texto que
  // aparece no WhatsApp, troque só o que está entre aspas. Se um nome não existir aqui,
  // o card usa a mensagemPadrao acima.
  mensagensWhatsApp: {
    abrirEmpresa: 'Olá, Gabriela! Vim pelo site e quero abrir um CNPJ. Pode me orientar?',
    contabilidade: 'Olá, Gabriela! Vim pelo site e quero contabilidade para a minha empresa. Como funciona e qual o valor?',
    impostoRenda: 'Olá, Gabriela! Vim pelo site e quero fazer meu Imposto de Renda com vocês. Como funciona?',
    regularizarBaixa: 'Olá, Gabriela! Vim pelo site e preciso regularizar ou dar baixa em um CNPJ.',
    trabalhista: 'Olá, Gabriela! Vim pelo site e preciso de um cálculo trabalhista.',
    regime: 'Olá, Gabriela! Vim pelo site e quero saber qual o melhor regime de impostos para a minha empresa.',
    mei: 'Olá, Gabriela! Vim pelo site e sou MEI e quero saber se é hora de deixar de ser MEI.',
    consultoria: 'Olá, Gabriela! Vim pelo site e quero saber mais sobre a consultoria administrativa e financeira.'
  },

  // Avaliações de clientes (seção "O que dizem nossos clientes", depois de "Quem é a Gabriela").
  // Enquanto a lista "itens" estiver vazia, a seção fica escondida no site.
  avaliacoes: {
    // Link para o cliente deixar uma avaliação no Google. No Perfil da Empresa no Google,
    // use "Pedir avaliações" e copie o link (formato https://g.page/r/CODIGO/review).
    // Vazio = o botão "Avaliar a GESCOMP no Google" não aparece.
    // Link oficial de avaliação, montado com o identificador do perfil no Google
    // (place ID ChIJqQk9uSS1GgcRaEAeH0T-vUU, do perfil "GESCOMP - Escritorio de Contabilidade e Virtual").
    linkAvaliar: 'https://search.google.com/local/writereview?placeid=ChIJqQk9uSS1GgcRaEAeH0T-vUU',

    // Link que abre as avaliações da GESCOMP no Google (por exemplo, o link do perfil no Google Maps).
    // Vazio = o botão "Ver todas as avaliações no Google" não aparece.
    linkVerTodas: 'https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU',

    // Nota conferida no perfil do Google em 04/10/2026. O site mostra só as estrelas.
    // A quantidade de avaliações não é publicada.
    nota: 5,
    total: null,
    // Nome completo de uma avaliação da lista para destacar na abertura. Sem correspondência,
    // usa o primeiro item válido; a lista vazia também esconde o destaque.
    destaque: 'Marcelo Melo da Silva',

    // Avaliações reais selecionadas do Google em 04/10/2026, autorizadas pelo usuário.
    // O texto de Marcelo é um trecho literal; a fonte completa está no perfil vinculado.
    // Nome, texto e estrelas
    // inteiras de 1 a 5 são obrigatórios; link é opcional. Uma por bloco:
    //   { nome: 'Maria Souza', texto: 'Texto original aprovado', estrelas: 5, link: '' },
    // No site aparece só o primeiro nome e a inicial do sobrenome (ex.: "Maria S."), sem foto.
    // Não ofereça desconto nem brinde em troca de avaliação: o Google proíbe.
    itens: [
      { nome: 'Yasmin Dantas', texto: 'A melhor contadora!\nConfio demais em Gabi', estrelas: 5, link: 'https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU' },
      { nome: 'Simone Soares', texto: 'Atendimento de qualidade. Super indico', estrelas: 5, link: 'https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU' },
      { nome: 'Marcelo Melo da Silva', texto: 'Empresa com grande profissionalismo, dúvidas tiradas com clareza, atendimento excepcional. Desde que conheci não larguei!', estrelas: 5, link: 'https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU' },
      { nome: 'Wallace Douglas Nascimento dos Santos', texto: 'Escritório eficiente e transparente. Atendimento de excelência.', estrelas: 5, link: 'https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU' },
      { nome: 'Ainoan Cavalcantemelo', texto: 'Profissional excelente e responsável!', estrelas: 5, link: 'https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU' }
    ]
  },

  // Fotos já entregues e conferidas em publicar/assets/img/fotos/.
  // Inclua o caminho só depois que o arquivo existir; lista vazia mantém a arte de espera.
  // Exemplo de caminho: '/assets/img/fotos/gabriela-retrato.webp'.
  fotos: [
    '/assets/img/fotos/empresa-real-20261004.webp',
    '/assets/img/fotos/contabilidade-real-20261004.webp',
    '/assets/img/fotos/documentos-reais-20261004.webp'
  ],

  // E-mail usado pelo formulário se o WhatsApp ainda não estiver configurado.
  email: 'escritoriogescomp@gmail.com',

  // Vídeos do carrossel "A GESCOMP no Instagram" (página inicial).
  // Cole o link de cada Reel ou post público, um por linha, entre aspas e com vírgula no fim.
  // Pode colar o link do jeito que o Instagram copia: o site limpa o final (?stkn=..., ?igsh=...).
  // Também aceita vídeo próprio terminado em .mp4 ou .webm (ex.: '/assets/videos/apresentacao.mp4').
  instagramReels: [
    'https://www.instagram.com/reel/DbynBYHpN_N/',
    'https://www.instagram.com/reel/DbQ4v35u7Rb/',
    'https://www.instagram.com/reel/DbWFtMyOKwH/',
    'https://www.instagram.com/reel/Dc815Ibu2np/',
    'https://www.instagram.com/reel/DdycreEMXQQ/',
  ]
};
