// Playwright MCP, servidor Python local. Fixtures de foto ficam apenas no navegador.
async (compartilhada) => {
  const c = await compartilhada.context().browser().newContext();
  const p = await c.newPage();
  const resultados = [], erros = [];
  const conferir = (nome, ok, detalhe) => { resultados.push({nome, aprovado:!!ok, detalhe}); if(!ok) throw new Error(nome+': '+JSON.stringify(detalhe)); };
  const dir = 'C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-04/';
  const contraste = (frente, fundo) => {
    const lum = cor => { const v=cor.match(/[\d.]+/g).slice(0,3).map(n=>Number(n)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722; };
    const a=lum(frente), b=lum(fundo);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  };
  try {
    await p.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
    await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
    await p.emulateMedia({reducedMotion:'reduce'});
    p.on('pageerror',e=>erros.push(e.message));
    for(const [width,height] of [[1366,768],[1920,1080],[390,844],[360,800]]) {
      await p.setViewportSize({width,height});
      await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
      for(const tema of ['light','dark']) {
        await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),tema);
        if(width<780)await p.locator('#botao-menu').click();
        const seletor=width<780?'#menu-mobile .gc-menu-link,#menu-mobile .gc-menu-link-final':'.gc-navegacao-link';
        const links=p.locator(seletor), cores=[];
        for(let i=0;i<await links.count();i++) {
          await links.nth(i).hover();
          const cor=await links.nth(i).evaluate(e=>getComputedStyle(e).color);
          cores.push({texto:await links.nth(i).innerText(),cor,contraste:contraste(cor,'rgb(0,63,74)')});
        }
        conferir('Menu visível no hover '+width+'/'+tema,cores.length===4&&cores.every(e=>e.contraste>=4.5),cores);
        if(width<780)await p.keyboard.press('Escape');
        await p.evaluate(()=>scrollTo(0,0));await p.mouse.move(0,0);
        if(width>=780)conferir('WhatsApp visível desde a abertura '+width+'/'+tema,await p.locator('#fab').isVisible());
        conferir('Gráfico largo anterior '+width+'/'+tema,await p.locator('.grafico-anterior').isVisible()&&!(await p.locator('.abertura-imagem .moldura-organica').isVisible()));
        await p.locator('#servicos').scrollIntoViewIfNeeded();
        await p.waitForFunction(()=>[...document.querySelectorAll('.ajuda-card .foto-moldura')].every(e=>e.classList.contains('tem-foto')));
        const imagens=await p.locator('.ajuda-card .foto-moldura img').evaluateAll(es=>es.map(e=>({src:e.getAttribute('src'),largura:e.naturalWidth,altura:e.naturalHeight})));
        conferir('Três imagens dos cards '+width+'/'+tema,imagens.length===3&&imagens.every(e=>e.largura===1200&&e.altura===900),imagens);
        await p.locator('#avaliacoes').scrollIntoViewIfNeeded();
        const reviews=await p.locator('#avaliacoes').evaluate(e=>({hidden:e.hidden,nomes:[...e.querySelectorAll('.avaliacao-autor')].map(n=>n.textContent),estrelas:[...e.querySelectorAll('.avaliacao-estrelas .so-leitor')].map(n=>n.textContent),fotos:e.querySelectorAll('img').length}));
        conferir('Avaliações reais sem fotos '+width+'/'+tema,!reviews.hidden&&reviews.nomes.join('|')==='Yasmin D.|Simone S.|Marcelo S.'&&reviews.estrelas.every(e=>e==='5 de 5 estrelas')&&reviews.fotos===0,reviews);
        await p.locator('.avaliacao-link').first().hover();
        const cor=await p.locator('.avaliacao-link').first().evaluate(e=>getComputedStyle(e).color);
        const fundo=await p.locator('.avaliacao-card').first().evaluate(e=>getComputedStyle(e).backgroundColor);
        conferir('Link da avaliação visível no hover '+width+'/'+tema,contraste(cor,fundo)>=4.5,{cor,fundo});
        if(width===1366||width===390) {
          await p.evaluate(()=>scrollTo(0,0));
          await p.locator('#inicio').screenshot({path:dir+'abertura-imagens-'+tema+'-'+width+'.png'});
          await p.locator('#servicos').screenshot({path:dir+'cards-imagens-'+tema+'-'+width+'.png'});
          await p.locator('#avaliacoes').screenshot({path:dir+'avaliacoes-reais-'+tema+'-'+width+'.png'});
        }
      }
    }
    const cfg=await (await p.request.get('http://127.0.0.1:8080/assets/js/config.js')).text();
    await p.route('**/assets/js/config.js*',r=>r.fulfill({contentType:'application/javascript',body:cfg+'\nwindow.GESCOMP_CONFIG.fotos.push("/assets/img/fotos/gabriela-retrato.webp");'}));
    const foto=await (await p.request.get('http://127.0.0.1:8080/assets/img/fotos/card-abrir-empresa.webp')).body();
    await p.route('**/assets/img/fotos/gabriela-retrato.webp',r=>r.fulfill({contentType:'image/webp',body:foto}));
    await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
    conferir('Retrato liberado troca o gráfico pela moldura (fixture)',await p.locator('.abertura-imagem.tem-retrato .moldura-organica').isVisible()&&!(await p.locator('.grafico-anterior').isVisible()));
    await p.unroute('**/assets/img/fotos/gabriela-retrato.webp');
    await p.route('**/assets/img/fotos/gabriela-retrato.webp',r=>r.fulfill({status:404,body:''}));
    await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
    conferir('Erro de retrato mantém gráfico, sem imagem quebrada',await p.locator('.grafico-anterior').isVisible()&&await p.locator('.abertura-imagem img').count()===0);
    await p.unroute('**/assets/js/config.js*');await p.unroute('**/assets/img/fotos/gabriela-retrato.webp');
    conferir('Sem erros de JavaScript',erros.length===0,erros);
    return resultados;
  } finally {await c.close();}
}
