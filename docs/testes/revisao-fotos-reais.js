// Playwright MCP. Dados artificiais e retrato fictício apenas em rotas de teste, nunca publicados.
async(shared)=>{
 const c=await shared.context().browser().newContext({hasTouch:true}),p=await c.newPage(),result=[];
 const dir='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-04/';
 function check(nome,ok,detalhe){result.push({nome,aprovado:!!ok,detalhe});if(!ok)throw Error(nome+': '+JSON.stringify(detalhe));}
 const track=()=>p.locator('#avaliacoes [data-carrossel-trilha]');
 const state=()=>track().evaluate(e=>({x:e.scrollLeft,order:[...e.children].map(x=>x.getAttribute('aria-label'))}));
 try{
  await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
  await p.route('https://vlibras.gov.br/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
  await p.setViewportSize({width:1366,height:768});await p.goto('http://127.0.0.1:8080/');await p.evaluate(()=>document.fonts.ready);
  check('Cinco avaliações reais, sem total publicado',await p.locator('#avaliacoes').evaluate(e=>e.querySelectorAll('[data-slide]').length===5&&e.querySelector('[data-avaliacoes-resumo]').textContent==='5 estrelas no Google'&&!/28 avaliações/.test(e.innerText)));
  check('Sem gráfico, selos ou pedido de retrato ausente',await p.locator('#inicio').evaluate(e=>!e.querySelector('.grafico-anterior,.selo')&&!e.querySelector('.abertura-imagem img')&&getComputedStyle(e.querySelector('.abertura-imagem')).display==='none'));
  await p.locator('#avaliacoes').scrollIntoViewIfNeeded();await p.mouse.move(1350,0);await p.waitForTimeout(300);
  let a=await state();await p.waitForTimeout(1200);let b=await state();check('Movimento contínuo em velocidade de leitura',b.x-a.x>15&&b.x-a.x<45,{a,b});
  await p.locator('#avaliacoes .avaliacao-card').first().hover();a=await state();await p.waitForTimeout(650);b=await state();check('Mouse pausa avaliações',Math.abs(a.x-b.x)<2,{a,b});
  // Coloca próximo à fronteira durante a pausa; mede o mesmo card antes/depois da troca.
  const before=await track().evaluate(e=>{e.scrollLeft=e.children[1].offsetLeft-e.children[0].offsetLeft-1;window.__cardAntes=e.children[1];return{x:window.__cardAntes.getBoundingClientRect().x,order:[...e.children].map(x=>x.getAttribute('aria-label'))};});
  await p.mouse.move(1350,0);await p.waitForTimeout(300);
  const after=await track().evaluate(e=>({x:window.__cardAntes.getBoundingClientRect().x,order:[...e.children].map(x=>x.getAttribute('aria-label')),n:e.children.length}));
  check('Fim circular sem salto nem cards duplicados',before.order[0]!==after.order[0]&&Math.abs(after.x-before.x)<15&&after.n===5,{before,after});
  await p.keyboard.press('Tab');await track().focus();a=await state();await p.waitForTimeout(700);b=await state();check('Foco de teclado pausa',Math.abs(a.x-b.x)<2&&a.order.join()===b.order.join(),{a,b});
  await p.keyboard.press('ArrowRight');await p.waitForTimeout(700);b=await state();check('Teclado navega manualmente',b.x!==a.x||a.order.join()!==b.order.join(),{a,b});
  await track().evaluate(e=>e.blur());await p.mouse.move(1350,0);await p.waitForTimeout(1200);
  await p.emulateMedia({reducedMotion:'reduce'});a=await state();await p.waitForTimeout(700);b=await state();check('Movimento reduzido desativa autoplay',a.x===b.x&&a.order.join()===b.order.join(),{a,b});
  for(const width of [1366,1920,1024,900,390,360]){
   await p.setViewportSize({width,height:width<500?844:900});await p.locator('#avaliacoes').scrollIntoViewIfNeeded();
   for(const theme of ['light','dark']){
    await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);await p.waitForTimeout(500);
    const dims=await p.locator('#avaliacoes').evaluate(e=>({sizes:[...e.querySelectorAll('.avaliacao-card')].map(x=>({h:x.getBoundingClientRect().height,w:x.getBoundingClientRect().width,clipped:x.scrollHeight>x.clientHeight+1})),arrows:[...e.querySelectorAll('.carrossel-seta')].map(x=>getComputedStyle(x).display),overflow:document.documentElement.scrollWidth>innerWidth}));
    check('Cards iguais sem cortes '+width+' '+theme,!dims.overflow&&new Set(dims.sizes.map(x=>x.h)).size===1&&new Set(dims.sizes.map(x=>x.w)).size===1&&dims.sizes.every(x=>!x.clipped)&&(width>899||dims.arrows.every(x=>x==='none')),dims);
    await p.locator('.gc-cabecalho').evaluate(e=>e.style.visibility='hidden');
    await p.locator('#avaliacoes').screenshot({path:dir+'avaliacoes-fotos-reais-'+theme+'-'+width+'.png'});
    await p.locator('.gc-cabecalho').evaluate(e=>e.style.visibility='');
   }
  }
  await p.emulateMedia({reducedMotion:'no-preference'});await p.setViewportSize({width:390,height:844});await p.locator('#avaliacoes').scrollIntoViewIfNeeded();await p.mouse.move(0,0);await p.waitForTimeout(150);
  const touchSession=await c.newCDPSession(p),box=await track().boundingBox();
  const touch=(type,x)=>touchSession.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y:box.y+90}]});
  await touch('touchStart',310);a=await state();
  for(let i=1;i<=8;i++){await touch('touchMove',310-i*23);await p.waitForTimeout(30);}await touch('touchEnd',0);await p.waitForTimeout(600);b=await state();
  check('Deslizar com o dedo move cards no celular',Math.abs(b.x-a.x)>100,{a,b});
  a=await state();await p.waitForTimeout(700);b=await state();check('Toque mantém pausa para leitura',Math.abs(b.x-a.x)<2,{a,b});
  await p.waitForTimeout(5500);a=await state();await p.waitForTimeout(900);b=await state();check('Autoplay retoma depois do gesto',Math.abs(b.x-a.x)>10||a.order.join()!==b.order.join(),{a,b});
  await touchSession.detach();
  for(const width of [1366,1920,795,390,360]){
   await p.setViewportSize({width,height:900});await p.goto('http://127.0.0.1:8080/informacoes.html');await p.locator('#outros-assuntos').scrollIntoViewIfNeeded();await p.waitForTimeout(600);
   const grid=await p.locator('.assuntos-grade').evaluate(e=>({columns:getComputedStyle(e).gridTemplateColumns.split(' ').length,width:e.querySelector('.assunto-cartao').getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth}));
   check('Grade ampla e responsiva '+width,grid.columns===(width>1023?3:width>639?2:1)&&grid.width>=275&&!grid.overflow,grid);
  }
  await p.setViewportSize({width:1366,height:768});await p.goto('http://127.0.0.1:8080/');
  await p.locator('#servicos').scrollIntoViewIfNeeded();await p.waitForTimeout(700);
  const photos=await p.locator('.ajuda-card .foto-moldura img').evaluateAll(es=>es.map(e=>({src:e.src,loaded:e.complete&&e.naturalWidth===1200})));
  check('Três fotos reais locais dos serviços',photos.length===3&&photos.every(x=>x.loaded&&/real|reais/.test(x.src)),photos);
  const cfg=await(await p.request.get('http://127.0.0.1:8080/assets/js/config.js')).text();
  await p.route('**/assets/js/config.js*',r=>r.fulfill({contentType:'application/javascript',body:cfg+"\nwindow.GESCOMP_CONFIG.fotos.push('/assets/img/fotos/gabriela-retrato.webp');"}));
  await p.route('**/assets/img/fotos/gabriela-retrato.webp',r=>r.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500"><rect width="1200" height="1500" fill="#003f4a"/></svg>'}));
  await p.goto('http://127.0.0.1:8080/');await p.locator('.tem-retrato').waitFor();check('Retrato real configurável aparece no computador',await p.locator('.abertura-imagem').isVisible());
  await p.setViewportSize({width:390,height:844});check('Retrato permanece oculto no celular',!await p.locator('.abertura-imagem').isVisible());
  return result;
 }finally{await c.close();}
}
