async(shared)=>{
 const c=await shared.context().browser().newContext(),p=await c.newPage(),dir='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/',files=[];let antes=false;
 try{
  await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));await p.route('https://vlibras.gov.br/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
  await p.route('http://127.0.0.1:8080/antes-visual',r=>r.fulfill({contentType:'text/html; charset=utf-8',path:dir+'.playwright-mcp/rio-antes-fotos.html'}));
  await p.route('**/assets/img/**',r=>{const asset=new URL(r.request().url()).pathname.split('/assets/img/')[1];return antes&&(/^(fotos\/card-|capas\/capa-)/.test(asset)||asset==='rio-404.webp'||asset==='og-composicao-20261004.webp')?r.fulfill({contentType:'image/webp',path:dir+'.playwright-mcp/antes-fotos/'+asset}):r.continue();});
  for(const [url,file,type] of [['**/assets/css/site.css*','site-antes-fotos.css','text/css'],['**/assets/js/site.js*','site-antes-fotos.js','application/javascript'],['**/assets/js/config.js*','config-antes-fotos.js','application/javascript']])await p.route(url,r=>antes?r.fulfill({contentType:type+'; charset=utf-8',path:dir+'.playwright-mcp/'+file}):r.continue());
  await p.emulateMedia({reducedMotion:'reduce'});
  for(const width of [1366,390]){
   await p.setViewportSize({width,height:900});
   for(const version of ['antes','depois']){
    antes=version==='antes';await p.goto('http://127.0.0.1:8080/'+(antes?'antes-visual':''));await p.evaluate(()=>document.fonts.ready);
    for(const theme of ['light','dark']){
     await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);await p.waitForTimeout(700);
     for(const id of ['inicio','servicos']){
      await p.locator('#'+id).scrollIntoViewIfNeeded();await p.locator('#'+id+' img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));
      await p.waitForFunction(id=>[...document.querySelectorAll('#'+id+' img')].every(e=>e.complete&&e.naturalWidth>0),id);
      await p.locator('.gc-cabecalho').evaluate(e=>e.style.visibility='hidden');
      const name=id+'-fotos-reais-'+version+'-'+theme+'-'+width+'.png';await p.locator('#'+id).screenshot({path:dir+'docs/evidencias/2026-10-04/'+name});files.push(name);
      await p.locator('.gc-cabecalho').evaluate(e=>e.style.visibility='');
     }
    }
   }
  }
  antes=false;await p.setViewportSize({width:1366,height:900});await p.goto('http://127.0.0.1:8080/informacoes.html');await p.locator('#outros-assuntos').scrollIntoViewIfNeeded();
  await p.locator('.assunto-miniatura').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await p.waitForFunction(()=>[...document.querySelectorAll('.assunto-miniatura')].every(e=>e.complete&&e.naturalWidth>0));
  await p.locator('.gc-cabecalho').evaluate(e=>e.style.visibility='hidden');await p.locator('#outros-assuntos').screenshot({path:dir+'docs/evidencias/2026-10-04/assuntos-fotos-reais-desktop.png'});return files;
 }finally{await c.close();}
}
