async(shared)=>{
const c=await shared.context().browser().newContext({hasTouch:true}),p=await c.newPage(),casos=[];
try{
 await p.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 for(const width of [1366,360])for(const theme of ['light','dark']){
  await p.setViewportSize({width,height:850});await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
  await p.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.style.scrollBehavior='auto';},theme);
  await p.locator('#avaliacoes').scrollIntoViewIfNeeded();await p.waitForTimeout(300);
  // Retira a cena SVG somente deste contexto de teste para medir rAF sem carga de rasterização.
  await p.evaluate(()=>document.querySelector('#rio').remove());await p.clock.install({time:new Date('2026-10-06T12:00:00Z')});await p.clock.pauseAt(new Date('2026-10-06T12:00:02Z'));
  await p.evaluate(()=>{window.tr=document.querySelector('#avaliacoes [data-carrossel-trilha]');window.origem=[...tr.children];window.phase=()=>{const passo=tr.children[1].offsetLeft-tr.children[0].offsetLeft;return {p:origem.indexOf(tr.firstElementChild)*passo+tr.scrollLeft-(parseFloat(tr.style.getPropertyValue('--desliza'))||0),total:passo*origem.length};};});
  const medidas=[];
  for(const acao of ['normal','mouse','foco','toque','roda','teclado','focoFora','rolagemForcada']){
   const antes=await p.evaluate(()=>phase());
   const imediata=await p.evaluate(async acao=>{
    const r=tr.parentElement;
    if(acao==='mouse')r.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}));
    if(acao==='foco')tr.querySelector('a').focus({preventScroll:true});
    if(acao==='toque'){r.dispatchEvent(new PointerEvent('pointerdown',{pointerType:'touch'}));r.dispatchEvent(new PointerEvent('pointerup',{pointerType:'touch'}));}
    if(acao==='roda')tr.dispatchEvent(new WheelEvent('wheel',{deltaX:500,bubbles:true}));
    if(acao==='teclado')tr.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
    if(acao==='focoFora'){tr.lastElementChild.querySelector('a').focus();await Promise.resolve();}
    if(acao==='rolagemForcada'){tr.scrollLeft=500;tr.dispatchEvent(new Event('scroll'));}
    return phase();
   },acao);
   await p.clock.runFor(1000);const depois=await p.evaluate(()=>phase());
   const delta=(depois.p-antes.p+depois.total)%depois.total;
   medidas.push({acao,deltaPx:delta,faseMantida:Math.abs(imediata.p-antes.p)<0.01,passou:delta>28&&delta<32});
  }
  await p.evaluate(()=>{window.qtdTrocas=0;new MutationObserver(ms=>qtdTrocas+=ms.filter(m=>m.removedNodes.length).length).observe(tr,{childList:true});});
  const testarCiclo=(width===1366&&theme==='light')||(width===360&&theme==='dark');
  await p.clock.runFor(testarCiclo?140000:1000);
  const ciclos=await p.evaluate(()=>({trocas:qtdTrocas,itens:tr.children.length,originais:origem.every(e=>[...tr.children].includes(e))}));ciclos.testado=testarCiclo;
  await p.emulateMedia({reducedMotion:'reduce'});await p.clock.runFor(20);const a=await p.evaluate(()=>phase());await p.clock.runFor(1000);const b=await p.evaluate(()=>phase());
  casos.push({width,theme,medidas,ciclos,reduzidoEstavel:Math.abs(b.p-a.p)<0.01,semSetas:await p.locator('#avaliacoes [data-carrossel-anterior],#avaliacoes [data-carrossel-proximo]').count()===0});
  await p.emulateMedia({reducedMotion:'no-preference'});await p.clock.resume();
 }
 return {casos,aprovado:casos.every(c=>c.medidas.every(m=>m.passou&&m.faseMantida)&&(!c.ciclos.testado||c.ciclos.trocas>=10)&&c.ciclos.itens===5&&c.ciclos.originais&&c.reduzidoEstavel&&c.semSetas)};
}finally{await c.close();}
}
