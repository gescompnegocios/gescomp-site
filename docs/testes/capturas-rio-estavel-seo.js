/* Substituir o marcador BASELINE_JSON com o objeto com JSON.stringify({html,css,js}),
   lendo git show da4904d:publicar/index.html, assets/css/site.css e assets/js/site.js.
   Depois enviar a função completa ao Playwright MCP. O template não usa módulos Node. */
async(shared)=>{
const browser=shared.context().browser(),paths=[];
const originals=/*BASELINE_JSON*/ null,folder='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-06/seo-informacoes/';
for(const version of ['antes','depois']){
 const c=await browser.newContext(),p=await c.newPage();
 try{
  await p.route('https://vlibras.gov.br/**',r=>r.fulfill({body:'',contentType:'application/javascript'}));await p.route('https://www.instagram.com/**',r=>r.fulfill({body:'',contentType:'application/javascript'}));
  if(version==='antes'){
   await p.route('**/index.html',r=>r.fulfill({contentType:'text/html',body:originals.html}));
   await p.route('**/assets/css/site.css?*',r=>r.fulfill({contentType:'text/css',body:originals.css}));
   await p.route('**/assets/js/site.js?*',r=>r.fulfill({contentType:'application/javascript',body:originals.js}));
  }
  await p.emulateMedia({reducedMotion:'reduce'});
  for(const width of [1366,360])for(const theme of ['light','dark']){
   await p.setViewportSize({width,height:800});await p.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
   await p.evaluate(async t=>{await document.fonts.ready;document.documentElement.dataset.theme=t;const s=document.querySelector('.rio-cena');s.pauseAnimations();s.setCurrentTime(0);},theme);
   await p.locator('#rio').scrollIntoViewIfNeeded();await p.waitForTimeout(2000);
   const path=folder+'rio-estavel-'+version+'-'+theme+'-'+width+'.png';await p.locator('#rio').screenshot({path,animations:'disabled'});paths.push(path);
  }
 }finally{await c.close();}
}return {paths,baseline:'da4904d',description:'Antes reconstruído em memória do Git; CSS/HTML/JS da base. Captura após concluir transição de tema, SVG em t=0.'};
}
