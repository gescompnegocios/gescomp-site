// Playwright MCP; servidor local 8091. Bloqueia toda conexão externa.
async (shared) => {
  const ctx=await shared.context().browser().newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  await ctx.route('**/*',async r=>{
    const url=new URL(r.request().url());
    if(url.origin!=='http://127.0.0.1:8091')return r.fulfill({status:200,contentType:'application/javascript',body:''});
    // Emulação local das URLs limpas; não verifica redirects de produção.
    if(url.pathname!=='/'&&!url.pathname.split('/').pop().includes('.'))url.pathname+='.html';
    return r.continue({url:url.href});
  });
  const p=await ctx.newPage(),results=[];
  const check=(name,ok,detail)=>{results.push({name,passed:!!ok,detail});if(!ok)throw new Error(name+': '+JSON.stringify(detail));};
  for(const width of [1366,390,360]){
    await p.setViewportSize({width,height:width===1366?768:844});
    await p.goto('http://127.0.0.1:8091/');
    const links=await p.locator('#servicos [data-whatsapp-msg]').evaluateAll(nodes=>nodes.map(a=>({key:a.dataset.whatsappMsg,correct:new URL(a.href).searchParams.get('text')===window.GESCOMP_CONFIG.mensagensWhatsApp[a.dataset.whatsappMsg]})));
    check('Oito contatos diretos preservados em '+width,links.length===8&&links.every(a=>a.correct),links);
    const focus=[];
    for(let i=0;i<72;i++){
      await p.keyboard.press('Tab');
      const f=await p.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {tag:e.tagName,id:e.id,outline:s.outlineStyle,width:parseFloat(s.outlineWidth),text:e.textContent.slice(0,65)};});
      if(f.tag!=='BODY'&&(!f.width||f.outline==='none'))focus.push(f);
    }
    check('Foco visível em 72 passos em '+width,focus.length===0,focus);
    if(width<700){
      const b=p.locator('#botao-menu');await b.focus();await p.keyboard.press('Enter');check('Menu pelo teclado em '+width,await b.getAttribute('aria-expanded')==='true');await p.keyboard.press('Escape');check('Escape fecha e devolve foco em '+width,await b.evaluate(e=>e===document.activeElement&&e.getAttribute('aria-expanded')==='false'));
    }
    const faq=p.locator('#informacoes summary').first();await faq.focus();await p.keyboard.press('Enter');check('FAQ pelo teclado em '+width,await faq.evaluate(e=>e.parentElement.open));
    await p.evaluate(()=>{window.open=url=>{window.__formUrl=url;return null;};});
    await p.locator('#nome').fill('Teste local');
    const options=await p.locator('#assunto option').evaluateAll(o=>o.map(a=>a.value).filter(Boolean));
    await p.locator('#assunto').selectOption(options[0]);
    await p.locator('#form-contato').evaluate(f=>f.requestSubmit());
    const form=await p.evaluate(()=>({url:window.__formUrl,phoneRequired:document.querySelector('#tel').required}));
    check('Formulário sem telefone e sem envio externo em '+width,!!form.url&&!form.phoneRequired&&!new URL(form.url).searchParams.get('text').includes('Telefone:'),{phoneRequired:form.phoneRequired,openedLocally:!!form.url});
    const target=p.locator('#servicos a[href="/contabilidade-empresarial"]');await target.click();
    check('Home → serviço por link HTML em '+width,(await p.locator('h1').innerText())==='Contabilidade para sua empresa');
    const wa=await p.locator('main [data-whatsapp-msg]').getAttribute('href');check('Serviço → contato correto em '+width,new URL(wa).searchParams.get('text').includes('quero contabilidade para a minha empresa'));
  }
  await p.setViewportSize({width:1366,height:768});await p.emulateMedia({reducedMotion:'no-preference'});await p.goto('http://127.0.0.1:8091/');await p.locator('#rio').scrollIntoViewIfNeeded();
  const sample=()=>p.evaluate(()=>{const svg=document.querySelector('.rio-cena');return {time:svg.getCurrentTime(),paused:svg.animationsPaused(),transforms:['46s','5.2s','34s'].map(d=>{const g=svg.querySelector('animateTransform[dur="'+d+'"]').parentElement,m=g.transform.animVal.getItem(0).matrix;return[m.a,m.b,m.c,m.d,m.e,m.f];})};});
  const before=await sample();await p.waitForTimeout(500);const after=await sample();check('Barco, coqueiro e pássaro animados',!after.paused&&after.time>before.time&&after.transforms.every((v,i)=>JSON.stringify(v)!==JSON.stringify(before.transforms[i])),{before,after});
  await p.evaluate(()=>document.querySelector('[data-acao="tema"]').click());await p.waitForTimeout(350);const middle=await p.evaluate(()=>({sun:+getComputedStyle(document.querySelector('.rio-sol')).opacity,moon:+getComputedStyle(document.querySelector('.rio-lua')).opacity}));await p.waitForTimeout(1400);const end=await p.evaluate(()=>({sun:+getComputedStyle(document.querySelector('.rio-sol')).opacity,moon:+getComputedStyle(document.querySelector('.rio-lua')).opacity}));check('Transição sol/lua preservada',middle.sun>0&&middle.sun<1&&middle.moon>0&&middle.moon<1&&end.sun===0&&end.moon===1,{middle,end});
  // Capturas comparáveis com os mesmos viewports da linha de base e SMIL congelado.
  await p.emulateMedia({reducedMotion:'reduce'});
  for(const width of [1366,1920,390,360]){
    await p.setViewportSize({width,height:width>=1000?1080:844});await p.goto('http://127.0.0.1:8091/');await p.evaluate(()=>document.fonts.ready);
    for(const theme of ['light','dark']){
      await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);await p.waitForTimeout(2100);await p.evaluate(()=>{document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations?.();s.setCurrentTime?.(0);});document.getAnimations().forEach(a=>a.pause());});
      const dir='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-07/seo-local/';
      await p.locator('#inicio').screenshot({path:dir+'depois-inicio-'+width+'-'+theme+'.png'});
      await p.locator('#rio').screenshot({path:dir+'depois-rio-'+width+'-'+theme+'.png'});
      await p.locator('#servicos').screenshot({path:dir+'depois-cards-'+width+'-'+theme+'.png'});
    }
  }
  await ctx.close();
  // Sem JavaScript: conteúdo, preços, navegação e contatos dos serviços continuam no HTML.
  const nojs=await shared.context().browser().newContext({javaScriptEnabled:false,serviceWorkers:'block'});
  await nojs.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:8091'?r.continue():r.fulfill({status:200,body:''}));
  const q=await nojs.newPage();await q.goto('http://127.0.0.1:8091/contabilidade-empresarial.html');
  check('Conteúdo e contato sem JavaScript',(await q.locator('h1').count())===1&&(await q.locator('main [data-whatsapp-msg]').getAttribute('href')).startsWith('https://wa.me/'));
  await nojs.close();return {localOnly:true,externalConnections:0,checks:results};
}
