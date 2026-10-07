// Antes de rodar, gravar git show f970f3f:publicar/index.html em
// publicar/__seo_base_local.html. REMOVER esse arquivo temporário depois.
// Apenas elimina os efeitos das seções externas ao rio e dos elementos fixos na captura.
async (shared) => {
 const c=await shared.context().browser().newContext({serviceWorkers:'block',reducedMotion:'reduce'});
 await c.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:8091'?r.continue():r.fulfill({status:200,contentType:'application/javascript',body:''}));
 const p=await c.newPage(),results=[];
 for(const width of [1366,1920,390,360]){
  await p.setViewportSize({width,height:width===1366?768:width===1920?1080:844});
  for(const phase of ['antes','depois']){
   await p.goto('http://127.0.0.1:8091/'+(phase==='antes'?'__seo_base_local.html':'index.html'));
   await p.addStyleTag({content:'html{overflow-y:scroll!important;scroll-behavior:auto!important}.gc-cabecalho,footer,main> :not(#rio),a[data-whatsapp][style*="fixed"]{display:none!important}'});
   await p.evaluate(()=>document.fonts.ready);
   for(const theme of ['light','dark']){
    await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);await p.waitForTimeout(2100);
    await p.evaluate(()=>{document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations?.();s.setCurrentTime?.(0);});document.getAnimations().forEach(a=>a.pause());window.scrollTo(0,0);});
    const box=await p.locator('#rio').boundingBox();
    await p.locator('#rio').screenshot({animations:'disabled',path:'C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-07/seo-local/controlado-'+phase+'-rio-'+width+'-'+theme+'.png'});
    results.push({width,phase,theme,box});
   }
  }
 }
 await c.close();return {localOnly:true,externalConnections:0,captures:results};
}
