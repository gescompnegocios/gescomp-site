// Executado pelo Playwright MCP, com o servidor Python na porta 8080.
// Fixtures só em memória: não grava avaliações nem fotos em publicar/.
async (paginaCompartilhada) => {
  const contexto = await paginaCompartilhada.context().browser().newContext();
  const page = await contexto.newPage();
  try {
  const base = 'http://127.0.0.1:8080';
  const resultados = [];
  const erros = [];
  const conferir = (nome, ok, detalhe) => {
    resultados.push({ nome, aprovado: !!ok, detalhe });
    if (!ok) throw new Error(nome + ': ' + JSON.stringify(detalhe));
  };
  const onError = e => erros.push(e.message);
  page.on('pageerror', onError);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('https://vlibras.gov.br/app/vlibras-plugin.js', r => r.fulfill({ contentType: 'application/javascript', body: '' }));
  // Simula só a entrega da Meta, mantendo iframe em outro domínio e os eventos reais do navegador.
  await page.route('https://www.instagram.com/**', r => r.fulfill({
    contentType: r.request().url().endsWith('/embed.js') ? 'application/javascript; charset=utf-8' : 'text/html; charset=utf-8',
    body: r.request().url().endsWith('/embed.js') ? `window.instgrm={Embeds:{process:function(){document.querySelectorAll('blockquote.instagram-media').forEach(function(b){var f=document.createElement('iframe');f.className='instagram-media';f.style.height='420px';f.src=b.getAttribute('data-instgrm-permalink').split('?')[0]+'embed/';b.replaceWith(f);});}}};` : '<!doctype html><html lang="pt-BR"><body><button>Vídeo de teste</button><script>addEventListener("load",function(){parent.postMessage(JSON.stringify({type:"MOUNTED"}),"http://127.0.0.1:8080");});</script></body></html>'
  }));
  const cfgOriginal = await (await page.request.get(base + '/assets/js/config.js')).text();
  await page.route('**/assets/js/config.js*', r => r.fulfill({contentType:'application/javascript',body:cfgOriginal+'\nwindow.GESCOMP_CONFIG.avaliacoes.itens=[];'}));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  conferir('Avaliações vazias escondidas', await page.locator('#avaliacoes').evaluate(e => e.hidden && getComputedStyle(e).display === 'none'));
  await page.evaluate(() => { window.__aberturas = []; window.open = (...args) => { window.__aberturas.push(args); return null; }; });
  await page.locator('#nome').fill('Contato de teste');
  await page.locator('#assunto').selectOption({ label: 'Outro assunto' });
  await page.locator('#form-contato button[type=submit]').click();
  const formulario = await page.evaluate(() => ({ required: document.querySelector('#tel').required, aberturas: window.__aberturas, status: document.querySelector('#form-status').textContent }));
  const mensagem = new URL(formulario.aberturas[0][0]).searchParams.get('text');
  conferir('Formulário envia sem telefone', !formulario.required && mensagem.includes('Nome: Contato de teste') && mensagem.includes('Assunto: Outro assunto') && !mensagem.includes('Telefone:'), formulario);
  const chamadas = await page.locator('.gc-cabecalho-contato,a.btn').evaluateAll(es => es.filter(e => e.textContent.includes('Falar com a GESCOMP') || e.classList.contains('gc-cabecalho-contato')).map(e => e.href));
  conferir('Chamadas abrem WhatsApp direto', chamadas.length >= 2 && chamadas.every(u => new URL(u).hostname === 'wa.me'), chamadas);
  await page.unroute('**/assets/js/config.js*');
  const mensagens = {
    abrirEmpresa: 'Olá, Gabriela! Vim pelo site e quero abrir um CNPJ. Pode me orientar?',
    contabilidade: 'Olá, Gabriela! Vim pelo site e quero contabilidade para a minha empresa. Como funciona e qual o valor?',
    impostoRenda: 'Olá, Gabriela! Vim pelo site e quero fazer meu Imposto de Renda com vocês. Como funciona?',
    regularizarBaixa: 'Olá, Gabriela! Vim pelo site e preciso regularizar ou dar baixa em um CNPJ.',
    trabalhista: 'Olá, Gabriela! Vim pelo site e preciso de um cálculo trabalhista.',
    regime: 'Olá, Gabriela! Vim pelo site e quero saber qual o melhor regime de impostos para a minha empresa.',
    mei: 'Olá, Gabriela! Vim pelo site e sou MEI e quero saber se é hora de deixar de ser MEI.',
    consultoria: 'Olá, Gabriela! Vim pelo site e quero saber mais sobre a consultoria administrativa e financeira.'
  };
  const fixture = `
    window.GESCOMP_CONFIG.avaliacoes={linkAvaliar:'',linkVerTodas:'',nota:null,total:null,itens:[
      {nome:'Ana de Teste',texto:'Avaliação de teste — não publicar.',estrelas:5,link:'https://www.google.com/maps/'},
      {nome:'Bruno de Teste',texto:'<img src=x onerror=alert(1)> Texto de teste — não publicar.',estrelas:4,link:'javascript:alert(1)'},
      {nome:'Carla de Teste',texto:'Terceira avaliação de teste — não publicar.',estrelas:3,link:''}
    ]};
    var fixture=document.createElement('div');fixture.hidden=true;fixture.id='fixture-mensagens';
    ${JSON.stringify(Object.keys(mensagens))}.forEach(function(chave){var a=document.createElement('a');a.setAttribute('data-whatsapp-msg',chave);fixture.appendChild(a);});
    var foto=document.createElement('div');foto.setAttribute('data-foto','/assets/img/fotos/arquivo-ainda-nao-entregue.webp');fixture.appendChild(foto);document.body.appendChild(fixture);
  `;
  await page.route('**/assets/js/config.js*', r => r.fulfill({ contentType: 'application/javascript', body: cfgOriginal + fixture }));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const links = await page.locator('#fixture-mensagens a').evaluateAll(es => es.map(e => ({ chave: e.getAttribute('data-whatsapp-msg'), href: e.href, rel: e.rel, target: e.target })));
  conferir('Oito mensagens específicas', links.length === 8 && links.every(e => new URL(e.href).searchParams.get('text') === mensagens[e.chave] && new URL(e.href).pathname === '/5579988771430' && e.rel.includes('noopener') && e.target === '_blank'), links);
  conferir('Foto ausente mantém painel sem img', await page.locator('#fixture-mensagens [data-foto] img').count() === 0);
  const reviews = await page.locator('#avaliacoes').evaluate(e => ({ hidden: e.hidden, cards: e.querySelectorAll('[data-slide]').length, autores: [...e.querySelectorAll('.avaliacao-autor')].map(a => a.textContent), estrelas: [...e.querySelectorAll('.avaliacao-estrelas .so-leitor')].map(a => a.textContent), links: e.querySelectorAll('.avaliacao-link').length, fotos: e.querySelectorAll('img').length, botoes: [...e.querySelectorAll('[data-avaliacoes-avaliar],[data-avaliacoes-ver]')].map(a => getComputedStyle(a).display), resumo: e.querySelector('[data-avaliacoes-resumo]').hidden, texto: e.textContent }));
  conferir('Três avaliações renderizam com privacidade', !reviews.hidden && reviews.cards === 3 && reviews.autores.join('|') === 'Ana T.|Bruno T.|Carla T.' && reviews.estrelas.join('|') === '5 de 5 estrelas|4 de 5 estrelas|3 de 5 estrelas' && reviews.links === 1 && reviews.fotos === 0 && reviews.texto.includes('<img src=x onerror=alert(1)>'), reviews);
  conferir('Links e resumo vazios escondidos', reviews.botoes.every(d => d === 'none') && reviews.resumo, reviews);
  await page.locator('#avaliacoes').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(8800);
  conferir('Avaliações passam automaticamente', await page.locator('#avaliacoes [data-carrossel-trilha]').evaluate(e => e.scrollLeft > 0));
  await page.locator('#instagram').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  conferir('Embeds montados sem clique', await page.locator('#instagram iframe').count() === 5 && await page.locator('#instagram .ig-midia.pronto').count() === 5);
  await page.locator('#instagram iframe').first().contentFrame().getByRole('button', { name: 'Vídeo de teste' }).click();
  const posicao = await page.locator('#instagram [data-carrossel-trilha]').evaluate(e => e.scrollLeft);
  await page.mouse.move(0, 0);
  // Foco continua no iframe: mantém a pausa, mesmo após a saída do mouse.
  await page.waitForTimeout(8700);
  const posicaoDepois = await page.locator('#instagram [data-carrossel-trilha]').evaluate(e => e.scrollLeft);
  conferir('Foco dentro do iframe impede passagem', Math.abs(posicao - posicaoDepois) < 2, { posicao, posicaoDepois });
  await page.evaluate(() => {
    const r = document.createElement('div'); r.id='fixture-carrossel'; r.style.cssText='position:fixed;left:10px;top:140px;width:180px;z-index:99999;background:white';
    r.innerHTML='<div data-carrossel-trilha tabindex="0" style="position:relative;display:flex;width:180px;height:70px;overflow:auto"><div data-slide style="flex:0 0 180px">1</div><div data-slide style="flex:0 0 180px">2</div><div data-slide style="flex:0 0 180px">3</div></div><button type="button" data-carrossel-proximo>Próximo</button>';
    document.body.appendChild(r); const t=r.firstChild; t.scrollTo=function(o){this.scrollLeft=o.left;}; window.__carTeste=criarCarrossel(r,{intervalo:350});
  });
  const x = () => page.locator('#fixture-carrossel [data-carrossel-trilha]').evaluate(e => e.scrollLeft);
  await page.mouse.move(0, 0); await page.waitForTimeout(430); let antes=await x();
  conferir('Carrossel de prova passa sozinho', antes > 0, antes);
  await page.locator('#fixture-carrossel').hover(); await page.waitForTimeout(500);
  conferir('Mouse pausa', await x() === antes);
  await page.mouse.move(0,0); await page.waitForTimeout(430);
  conferir('Saída do mouse retoma', await x() !== antes);
  await page.locator('#fixture-carrossel [data-carrossel-proximo]').click(); antes=await x(); await page.waitForTimeout(500);
  conferir('Clique na seta permanece parado com mouse em cima', await x() === antes);
  await page.mouse.move(0,0); await page.waitForTimeout(430);
  conferir('Após clique do mouse, sair da seta retoma', await x() !== antes);
  await page.keyboard.press('Tab'); await page.locator('#fixture-carrossel [data-carrossel-trilha]').focus(); antes=await x(); await page.waitForTimeout(500);
  conferir('Foco pausa', await x() === antes);
  await page.locator('#fixture-carrossel [data-carrossel-trilha]').evaluate(e => e.blur()); await page.waitForTimeout(430);
  conferir('Saída do foco retoma', await x() !== antes);
  await page.locator('#fixture-carrossel').dispatchEvent('pointerdown', { pointerType:'touch' }); antes=await x(); await page.waitForTimeout(500);
  conferir('Toque pausa', await x() === antes);
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerup',{pointerType:'touch'}))); await page.waitForTimeout(6500);
  conferir('Soltar toque fora também retoma', await x() !== antes);
  await page.emulateMedia({reducedMotion:'reduce'}); antes=await x(); await page.waitForTimeout(800);
  conferir('Movimento reduzido impede passagem', await x() === antes);
  await page.evaluate(() => window.__carTeste.navegar(1));
  conferir('Seta manual funciona com movimento reduzido', await x() !== antes);
  conferir('Sem erro de JavaScript do site', erros.length === 0, erros);
  await page.unroute('**/assets/js/config.js*');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/',{waitUntil:'networkidle'});
  conferir('Dados de teste removidos, avaliações reais restauradas', await page.evaluate(() => window.GESCOMP_CONFIG.avaliacoes.itens.length === 5 && !document.querySelector('#avaliacoes').hidden && !document.querySelector('#avaliacoes').textContent.includes('Ana T.')));
  page.off('pageerror',onError);
  return resultados;
  } finally {
    await contexto.close();
  }
}
