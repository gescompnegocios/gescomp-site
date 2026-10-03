/* Configurações do site da GESCOMP.
   Edite apenas os valores entre aspas e publique o site de novo. */
window.GESCOMP_CONFIG = {
  // WhatsApp que recebe os clientes: código do país + DDD + número, só números.
  // Exemplo: '5579999999999'. Enquanto estiver vazio, os botões levam ao formulário.
  whatsapp: '5579988771430',

  // Mensagem que já aparece escrita quando o cliente toca em "Falar no WhatsApp".
  mensagemPadrao: 'Olá! Vim pelo site da GESCOMP e gostaria de atendimento.',

  // Mensagens dos cards de "Serviços" (página inicial). Cada card aponta para uma destas
  // mensagens pelo nome (atributo data-whatsapp-msg no index.html). Para mudar o texto que
  // aparece no WhatsApp, troque só o que está entre aspas. Se um nome não existir aqui,
  // o card usa a mensagemPadrao acima.
  mensagensWhatsApp: {
    abrirCnpj: 'Olá, Gabriela! Vim pelo site e quero abrir um CNPJ. Pode me orientar?',
    contabilidade: 'Olá, Gabriela! Vim pelo site e quero contabilidade para a minha empresa. Como funciona e qual o valor?',
    impostoDeRenda: 'Olá, Gabriela! Vim pelo site e quero fazer meu Imposto de Renda com vocês. Como funciona?',
    calculosTrabalhistas: 'Olá, Gabriela! Vim pelo site e preciso de um cálculo trabalhista. Pode me ajudar?',
    regimeDeImpostos: 'Olá, Gabriela! Vim pelo site e quero saber qual o melhor regime de impostos para a minha empresa.',
    mei: 'Olá, Gabriela! Vim pelo site. Sou MEI e quero saber se já é hora de deixar de ser MEI.'
  },

  // Avaliações de clientes (seção "O que dizem nossos clientes", logo depois de Resultados).
  // Enquanto a lista "itens" estiver vazia, a seção fica escondida no site.
  avaliacoes: {
    // Link para o cliente deixar uma avaliação no Google. No Perfil da Empresa no Google,
    // use "Pedir avaliações" e copie o link (formato https://g.page/r/CODIGO/review).
    // Vazio = o botão "Avaliar a GESCOMP no Google" não aparece.
    linkAvaliar: '',

    // Link que abre as avaliações da GESCOMP no Google (por exemplo, o link do perfil no Google Maps).
    // Vazio = o botão "Ver todas as avaliações no Google" não aparece.
    linkVerTodas: '',

    // Nota média e número de avaliações, como aparecem no Google (ex.: nota: 4.9, total: 37).
    // O resumo "Nota 4,9 no Google, 37 avaliações" só aparece se os dois estiverem preenchidos.
    nota: null,
    total: null,

    // Avaliações escolhidas, copiadas do Google com o texto original. Uma por bloco:
    //   { nome: 'Maria Souza', texto: 'Atendimento excelente...', estrelas: 5 },
    // No site aparece só o primeiro nome e a inicial do sobrenome (ex.: "Maria S."), sem foto.
    // Não ofereça desconto nem brinde em troca de avaliação: o Google proíbe.
    itens: [
    ]
  },

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
