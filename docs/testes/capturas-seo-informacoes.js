async(shared)=>{
const c=await shared.context().browser().newContext(),p=await c.newPage(),paths=[];
const folder='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-06/seo-informacoes/';
try{
 await p.route('https://vlibras.gov.br/**',r=>r.fulfill({body:'',contentType:'application/javascript'}));
 await p.route('https://www.instagram.com/**',r=>r.fulfill({body:'',contentType:'application/javascript'}));
 await p.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1366,360])for(const theme of ['light','dark']){
  await p.setViewportSize({width,height:800});await p.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
  await p.evaluate(async t=>{await document.fonts.ready;document.documentElement.dataset.theme=t;const s=document.querySelector('.rio-cena');s.pauseAnimations();s.setCurrentTime(0);},theme);
  await p.locator('#rio').scrollIntoViewIfNeeded();await p.waitForTimeout(800);
  const path=folder+'rio-depois-'+theme+'-'+width+'.png';await p.locator('#rio').screenshot({path});paths.push(path);
  const reviews=folder+'avaliacoes-depois-'+theme+'-'+width+'.png';await p.locator('#avaliacoes').screenshot({path:reviews});paths.push(reviews);
  for(const page of ['informacoes','fim-escala-6x1','novo-limite-mei']){
   await p.goto('http://127.0.0.1:8080/'+page+'.html',{waitUntil:'networkidle'});
   await p.evaluate(async t=>{await document.fonts.ready;document.documentElement.dataset.theme=t;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));},theme);
   const shot=folder+page+'-depois-'+theme+'-'+width+'.png';await p.screenshot({path:shot,fullPage:true});paths.push(shot);
  }
 }
 return {paths};
}finally{await c.close();}
}
