// Referência: HTML do commit c390783 em .playwright-mcp/rio-antes-imagens.html.
// O CSS da cena é idêntico; esconder outras seções e congelar SMIL só para a captura.
async(compartilhada)=>{
 const c=await compartilhada.context().browser().newContext(),p=await c.newPage(),dados=[];
 const dir='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-04/';
 try{
  await p.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
  await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
  await p.route('http://127.0.0.1:8080/rio-antes',r=>r.fulfill({contentType:'text/html; charset=utf-8',path:'C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/.playwright-mcp/rio-antes-imagens.html'}));
  for(const width of [1366,1920,390,360]){
   await p.setViewportSize({width,height:1400});
   for(const [url,versao] of [['/rio-antes','antes'],['/','depois']]){
    await p.goto('http://127.0.0.1:8080'+url,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
    await p.addStyleTag({content:'html{scroll-behavior:auto!important;overflow-y:scroll!important}.gc-cabecalho,#fab{display:none!important}#rio{width:'+(width-15)+'px!important}'});
    await p.evaluate(()=>{const rio=document.getElementById('rio'),main=rio.parentElement;for(const el of main.children)if(el!==rio)el.style.display='none';main.style.padding='0';main.style.margin='0';scrollTo(0,0);for(const svg of document.querySelectorAll('svg'))if(svg.pauseAnimations){svg.pauseAnimations();svg.setCurrentTime(2);}});
    for(const theme of ['light','dark']){
     await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);await p.waitForTimeout(1700);
     const rect=await p.locator('#rio').boundingBox(),nome='rio-imagens-'+versao+'-'+theme+'-'+width+'.png';
     await p.screenshot({path:dir+nome,clip:{x:0,y:0,width:width-15,height:Math.ceil(rect.height)}});
     dados.push({width,theme,versao,nome,rect});
    }
   }
  }
  return dados;
 }finally{await c.close();}
}
