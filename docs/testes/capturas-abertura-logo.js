async(shared)=>{
const context=await shared.context().browser().newContext(),p=await context.newPage(),records=[];
const dir='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-06/';
const version='depois';
try{
 await p.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.emulateMedia({reducedMotion:'reduce'});
 for(const [width,height] of [[1366,768],[1920,1080],[390,844],[360,800]]){
  await p.setViewportSize({width,height});
  for(const theme of ['light','dark']){
   await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
   await p.evaluate(async t=>{await document.fonts.ready;document.documentElement.setAttribute('data-theme',t);},theme);
   await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
   for(const [name,selector] of [['abertura','#inicio'],['cabecalho','.gc-cabecalho'],['rodape','.gc-rodape']]){
    if(name==='cabecalho')await p.evaluate(()=>scrollTo(0,0));
    const element=p.locator(selector);
    await element.scrollIntoViewIfNeeded();
    if(name==='rodape')await p.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.gc-rodape img')].map(e=>e.decode().catch(()=>{})));});
    const filename=name+'-'+version+'-'+theme+'-'+width+'.png';
    await element.screenshot({path:dir+filename});
    records.push({name,version,theme,width,height,filename});
   }
   await p.addStyleTag({content:'html{overflow-y:scroll!important}.gc-cabecalho,#fab{display:none!important}#rio{width:'+(width-15)+'px!important}'});
   await p.evaluate(()=>{const rio=document.querySelector('#rio'),main=rio.parentElement;for(const el of main.children)if(el!==rio)el.style.display='none';main.style.padding='0';main.style.margin='0';scrollTo(0,0);for(const s of document.querySelectorAll('svg'))if(s.pauseAnimations){s.pauseAnimations();s.setCurrentTime(2);}});
   await p.waitForTimeout(1800);
   const rio=p.locator('#rio'),rect=await rio.boundingBox();
   // Tall private viewport prevents a different vertical crop on mobile.
   await p.setViewportSize({width,height:1400});
   const filename='rio-'+version+'-'+theme+'-'+width+'.png';
   await p.screenshot({path:dir+filename,clip:{x:0,y:0,width:width-15,height:Math.ceil(rect.height)}});
   records.push({name:'rio',version,theme,width,filename,rect});
   await p.setViewportSize({width,height});
  }
 }
 return records;
}finally{await context.close();}
}
