// Rodar com Playwright MCP; contexto próprio, sem modificar a página de outro agente.
// Instagram/VLibras simulados: esta matriz verifica apenas os ajustes locais de abertura/logos.
async(shared)=>{
 const c=await shared.context().browser().newContext(),p=await c.newPage(),cases=[];
 const axePath='C:/Users/fabri/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js';
 try{
  await p.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
  await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
  await p.emulateMedia({reducedMotion:'reduce'});
  for(const page of ['index','informacoes','abrir-empresa','imposto-de-renda','mei','simples-nacional','pro-labore-e-lucros','departamento-pessoal','calendario-fiscal','404']){
   const sizes=page==='index'?[[1366,768],[1920,1080],[390,844],[360,800]]:[[1366,768],[390,844],[360,800]];
   for(const [width,height] of sizes){
    await p.setViewportSize({width,height});
    const errors=[],http=[];
    const js=e=>errors.push(e.message),consoleError=m=>{if(m.type()==='error')errors.push(m.text());};
    const response=r=>{if(r.url().startsWith('http://127.0.0.1:8080/')&&r.status()>=400)http.push({url:r.url(),status:r.status()});};
    p.on('pageerror',js);p.on('console',consoleError);p.on('response',response);
    await p.goto('http://127.0.0.1:8080/'+(page==='index'?'':page+'.html'),{waitUntil:'networkidle'});
    await p.evaluate(()=>document.fonts.ready);
    await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
    await p.addScriptTag({path:axePath});
    for(const theme of ['light','dark']){
     await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
     const header=p.locator('header img:visible');
     await header.evaluate(e=>e.decode());
     const footer=p.locator('.gc-rodape-logo');
     if(await footer.count()){await footer.scrollIntoViewIfNeeded();await footer.evaluate(e=>e.decode());}
     const layout=await p.evaluate(()=>{
      const visible=e=>e.getBoundingClientRect().height>0;
      const measure=e=>{
       const r=e.getBoundingClientRect(),style=getComputedStyle(e),link=e.closest('a'),s=getComputedStyle(link);
       return{src:e.currentSrc,alt:e.alt,width:r.width,height:r.height,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight,declaredWidth:e.getAttribute('width'),declaredHeight:e.getAttribute('height'),picture:e.parentElement.tagName==='PICTURE',source:e.parentElement.querySelector('source')?.getAttribute('srcset'),blend:style.mixBlendMode,filter:style.filter,background:s.backgroundColor,padding:s.padding,border:s.borderWidth,shadow:s.boxShadow,pillSvg:link.querySelectorAll('svg').length};
      };
      const h=document.querySelector('#inicio .abertura-texto h1'),span=h?.querySelector('.grifo-pincel'),sub=[...document.querySelectorAll('#inicio .abertura-sub')];
      const image=[...document.querySelectorAll('header img')].find(visible),control=[...document.querySelectorAll('.gc-navegacao,.gc-cabecalho-acoes')].find(visible);
      const mid=e=>{const r=e.getBoundingClientRect();return r.y+r.height/2;};
      return{overflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,header:[...document.querySelectorAll('header img')].filter(visible).map(measure),footer:[...document.querySelectorAll('.gc-rodape-logo')].map(measure),alignment:control?Math.abs(mid(image)-mid(control)):0,hero:h?{title:h.textContent,lines:Math.round(h.clientHeight/parseFloat(getComputedStyle(h).lineHeight)),font:getComputedStyle(h).fontSize,span:span?.textContent,fragments:span?.getClientRects().length,background:span?getComputedStyle(span).backgroundImage:null,repeat:span?getComputedStyle(span).backgroundRepeat:null,backgroundSize:span?getComputedStyle(span).backgroundSize:null,decoration:span?getComputedStyle(span).boxDecorationBreak:null,svg:h.querySelectorAll('svg').length,paragraphs:sub.map(e=>({text:e.textContent,font:getComputedStyle(e).fontSize,color:getComputedStyle(e).color,strong:e.querySelector('strong')?getComputedStyle(e.querySelector('strong')).fontWeight:null})),heroPrice:/R\$/.test(document.querySelector('.abertura-texto').textContent),servicePrices:[...document.querySelectorAll('.ajuda-preco')].map(e=>e.textContent)}:null};
     });
     // Keyboard input establishes :focus-visible, then focus each visible brand link.
     await p.keyboard.press('Tab');
     const focus=[];
     for(const selector of ['header a:has(img):visible','.gc-rodape-marca']){
      const a=p.locator(selector).first();if(!await a.count())continue;
      await a.focus();focus.push(await a.evaluate(e=>({visible:e.matches(':focus-visible'),outline:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth,href:e.getAttribute('href')})));
     }
     const axe=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
     cases.push({page,width,height,theme,...layout,focus,errors:[...errors],http:[...http],axe});
    }
    p.off('pageerror',js);p.off('console',consoleError);p.off('response',response);
   }
  }
  // Simular navegador sem suporte a WebP retirando apenas os <source> nas fixtures.
  await p.setViewportSize({width:390,height:844});await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
  await p.evaluate(()=>{document.querySelectorAll('header picture source,footer picture source').forEach(e=>e.remove());document.querySelectorAll('header img,footer img').forEach(e=>e.loading='eager');});
  await p.waitForFunction(()=>[...document.querySelectorAll('header img,footer img')].every(e=>e.complete&&e.naturalWidth>0&&e.currentSrc.endsWith('.png')));
  const fallback=await p.locator('header img,footer img').evaluateAll(es=>es.map(e=>({src:e.currentSrc,width:e.naturalWidth,height:e.naturalHeight})));
  return{base:'5953ec4',date:'2026-10-06',externalServices:'simulated',cases,fallback};
 }finally{await c.close();}
}
