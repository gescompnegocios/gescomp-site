async(shared)=>{
const browser=shared.context().browser(),cases=[];
for(const touch of [false,true]){
 const c=await browser.newContext({hasTouch:touch,isMobile:touch}),p=await c.newPage(),errors=[];
 try{
  p.on('pageerror',e=>errors.push(String(e)));
  await p.route('https://vlibras.gov.br/**',r=>r.fulfill({body:'',contentType:'application/javascript'}));
  await p.emulateMedia({reducedMotion:'reduce'});
  for(const width of (touch?[360,390,844,1024]:[390,779,780,1366,1920])){
   await p.setViewportSize({width,height:touch&&width>779?390:844});
   for(const theme of ['light','dark']){
    await p.goto('http://127.0.0.1:8080/index.html',{waitUntil:'domcontentloaded'});await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    await p.locator('#instagram').scrollIntoViewIfNeeded();await p.waitForTimeout(1000);
    const value=await p.evaluate(()=>({viewport:innerWidth,media:matchMedia('(max-width:779px), (hover:none) and (pointer:coarse)').matches,arrows:[...document.querySelectorAll('#instagram .carrossel-seta')].map(e=>({hidden:e.hidden,display:getComputedStyle(e).display,visible:e.getClientRects().length>0})),overflow:document.documentElement.scrollWidth>innerWidth,reviewArrows:document.querySelectorAll('#avaliacoes .carrossel-seta').length}));
    cases.push({touch,width,theme,...value});
   }
  }
  if(!touch){
   await p.setViewportSize({width:390,height:844});await p.waitForTimeout(100);
   cases.push({resize:true,width:390,hidden:await p.locator('#instagram .carrossel-seta').evaluateAll(es=>es.every(e=>e.hidden&&getComputedStyle(e).display==='none'))});
   await p.setViewportSize({width:1366,height:844});await p.waitForTimeout(100);
   cases.push({resize:true,width:1366,visible:await p.locator('#instagram .carrossel-seta').evaluateAll(es=>es.every(e=>!e.hidden&&getComputedStyle(e).display==='flex'))});
  }
  if(errors.length)throw new Error(errors.join('; '));
 }finally{await c.close();}
}
return {cases,passed:cases.every(x=>x.resize?x.hidden===true||x.visible===true:!x.overflow&&x.reviewArrows===0&&x.arrows.length===2&&x.arrows.every(a=>x.media?a.hidden&&!a.visible:a.visible&&!a.hidden))};
}
