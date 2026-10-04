// Playwright MCP, servidor Python local; não envia mensagens nem grava fixtures no site.
async (compartilhada) => {
 const contexto=await compartilhada.context().browser().newContext();
 const page=await contexto.newPage(),resultados=[];
 const dir='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-04/';
 const conferir=(nome,ok,detalhe)=>{resultados.push({nome,aprovado:!!ok,detalhe});if(!ok)throw new Error(nome+': '+JSON.stringify(detalhe));};
 try{
 await page.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await page.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1366,390]){
  await page.setViewportSize({width,height:844});
  await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
  const links=await page.locator('[data-whatsapp-msg]').evaluateAll(es=>es.map(e=>({chave:e.dataset.whatsappMsg,correto:new URL(e.href).searchParams.get('text')===window.GESCOMP_CONFIG.mensagensWhatsApp[e.dataset.whatsappMsg],target:e.target,rel:e.rel})));
  conferir('Oito links reais do WhatsApp em '+width,links.length===8&&links.every(e=>e.correto&&e.target==='_blank'&&e.rel.includes('noopener')),links);
  const falhas=[];
  for(let n=0;n<65;n++){
   await page.keyboard.press('Tab');
   const foco=await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return{tag:e.tagName,id:e.id,rotulo:e.innerText?.slice(0,70)||e.getAttribute('aria-label'),visivel:parseFloat(s.outlineWidth)>0&&s.outlineStyle!=='none'};});
   if(foco.tag!=='BODY'&&!foco.visivel)falhas.push(foco);
  }
  conferir('Foco visível em 65 passos de teclado em '+width,falhas.length===0,falhas);
  if(width===390){
   const b=page.locator('#botao-menu');await b.focus();await page.keyboard.press('Enter');
   conferir('Menu abre pelo teclado',await b.getAttribute('aria-expanded')==='true');
   await page.keyboard.press('Tab');await page.keyboard.press('Escape');
   conferir('Escape fecha menu e devolve foco',await b.evaluate(e=>e===document.activeElement&&e.getAttribute('aria-expanded')==='false'));
  }
  const faq=page.locator('#informacoes details').first();
  await faq.locator('summary').focus();await page.keyboard.press('Enter');
  conferir('Pergunta abre pelo teclado em '+width,await faq.evaluate(e=>e.open));
  await page.keyboard.press('Enter');
  const trilha=page.locator('#instagram [data-carrossel-trilha]');await trilha.evaluate(e=>e.scrollLeft=0);await trilha.focus();const x=await trilha.evaluate(e=>e.scrollLeft);await page.keyboard.press('ArrowRight');
  conferir('Seta do carrossel pelo teclado em '+width,await trilha.evaluate(e=>e.scrollLeft)>x);
 }
 await page.setViewportSize({width:1366,height:768});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
 await page.locator('#rio').scrollIntoViewIfNeeded();
 const lerAnimacoes=()=>page.evaluate(()=>{const svg=document.querySelector('.rio-cena');return{tempo:svg.getCurrentTime(),pausado:svg.animationsPaused(),transformacoes:['46s','5.2s','34s'].map(d=>{const g=svg.querySelector('animateTransform[dur="'+d+'"]').parentElement,m=g.transform.animVal.getItem(0).matrix;return[m.a,m.b,m.c,m.d,m.e,m.f];})};});
 const antes=await lerAnimacoes();await page.waitForTimeout(500);const depois=await lerAnimacoes();
 conferir('Barco, coqueiro e pássaro continuam animados',!depois.pausado&&depois.tempo>antes.tempo&&depois.transformacoes.every((m,i)=>JSON.stringify(m)!==JSON.stringify(antes.transformacoes[i])),{antes,depois});
 await page.evaluate(()=>document.querySelector('[data-acao="tema"]').click());
 await page.waitForTimeout(350);
 const meio=await page.evaluate(()=>({sol:Number(getComputedStyle(document.querySelector('.rio-sol')).opacity),lua:Number(getComputedStyle(document.querySelector('.rio-lua')).opacity)}));
 await page.waitForTimeout(1400);
 const fim=await page.evaluate(()=>({sol:Number(getComputedStyle(document.querySelector('.rio-sol')).opacity),lua:Number(getComputedStyle(document.querySelector('.rio-lua')).opacity)}));
 conferir('Transição sol para lua preservada',meio.sol>0&&meio.sol<1&&meio.lua>0&&meio.lua<1&&fim.sol===0&&fim.lua===1,{meio,fim});
 for(const width of [1366,390]){
  await page.setViewportSize({width,height:1400});await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  for(const theme of ['light','dark']){
   await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);await page.waitForTimeout(1700);
   await page.locator('#inicio').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
   await page.locator('#inicio').screenshot({path:dir+'abertura-final-'+theme+'-'+width+'.png'});
   await page.locator('#servicos').scrollIntoViewIfNeeded();await page.waitForTimeout(450);
   await page.locator('#servicos').screenshot({path:dir+'cards-final-'+theme+'-'+width+'.png'});
  }
 }
 await page.unroute('https://vlibras.gov.br/app/vlibras-plugin.js');
 await page.unroute('https://www.instagram.com/**');
 await page.setViewportSize({width:390,height:844});
 const externos=[];page.on('console',m=>{if(m.type()==='error')externos.push(m.text());});
 await page.goto('http://127.0.0.1:8080/',{waitUntil:'domcontentloaded'});
 await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
 await page.waitForFunction(()=>window.VLibrasWidget&&window.VLibrasWidget.access&&window.VLibrasWidget.access.getBoundingClientRect().width>0&&window.VLibrasWidget.access.style.bottom,{timeout:15000});
 const posicionar=async(selector,top)=>{await page.locator(selector).evaluate((e,t)=>window.scrollBy(0,e.getBoundingClientRect().top-t),top);await page.waitForTimeout(1500);return page.evaluate(()=>({fab:getComputedStyle(document.querySelector('#fab')).display,libras:getComputedStyle(window.VLibrasWidget.access).visibility,access:window.VLibrasWidget.access.getBoundingClientRect().toJSON(),car:document.querySelector('#instagram [data-carrossel]').getBoundingClientRect().toJSON(),focus:document.activeElement.tagName,shadowfocus:window.VLibrasWidget.access.getRootNode().activeElement?.tagName}));};
 for(const width of [390,360]){
  await page.setViewportSize({width,height:844});
  const hero=await posicionar('#inicio .abertura-imagem',500);
  conferir('Lançadores não cobrem a arte da abertura em '+width,hero.fab==='none'&&hero.libras==='hidden',hero);
  const car=await posicionar('#instagram [data-carrossel]',300);
  conferir('Lançadores não cobrem carrossel em '+width,car.fab==='none'&&car.libras==='hidden',car);
  const form=await posicionar('#form-contato',120);
  conferir('Lançadores não cobrem formulário em '+width,form.fab==='none'&&form.libras==='hidden',form);
  await page.locator('#rio').evaluate(e=>window.scrollBy(0,e.getBoundingClientRect().top));await page.waitForTimeout(300);
  const livre=await page.evaluate(()=>({fab:getComputedStyle(document.querySelector('#fab')).display,libras:getComputedStyle(window.VLibrasWidget.access).visibility}));
  conferir('Lançadores voltam fora dos controles em '+width,livre.fab!=='none'&&livre.libras==='visible',livre);
 }
 await posicionar('#instagram [data-carrossel]',120);
 await page.waitForTimeout(12000);
 const meta=await page.locator('#instagram').evaluate(e=>({frames:e.querySelectorAll('iframe').length,prontos:e.querySelectorAll('.ig-midia.pronto').length,links:[...e.querySelectorAll('[data-reel]')].map(a=>({href:a.href,visivel:getComputedStyle(a).display!=='none'}))}));
 resultados.push({nome:'Serviços externos reais — observação',detalhe:{meta,erros:externos}});
 return resultados;
 }finally{await contexto.close();}
}
