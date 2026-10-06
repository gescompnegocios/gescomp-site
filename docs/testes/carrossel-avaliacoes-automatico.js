async(shared)=>{
const c=await shared.context().browser().newContext({hasTouch:true}),p=await c.newPage(),casos=[];
try{
 await p.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.emulateMedia({reducedMotion:'no-preference'});
 for(const width of [1366,360]){
  await p.setViewportSize({width,height:850});
  for(const theme of ['light','dark']){
   await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
   await p.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.style.scrollBehavior='auto';},theme);
   await p.locator('#avaliacoes').scrollIntoViewIfNeeded();await p.waitForTimeout(250);
   await p.evaluate(()=>{window.reviews=[...document.querySelectorAll('#avaliacoes [data-slide]')];window.phase=()=>{const t=document.querySelector('#avaliacoes [data-carrossel-trilha]'),n=reviews.length,step=t.children[1].offsetLeft-t.children[0].offsetLeft;return {phase:reviews.indexOf(t.firstElementChild)*step+t.scrollLeft-(parseFloat(t.style.getPropertyValue('--desliza'))||0),total:step*n,time:performance.now()};};});
   async function medir(acao){
    const inicio=await p.evaluate(()=>phase());await acao();await p.waitForTimeout(1050);const fim=await p.evaluate(()=>phase());
    return {acao:acao.name,velocidade:((fim.phase-inicio.phase+fim.total)%fim.total)/((fim.time-inicio.time)/1000)};
   }
   const medidas=[];
   medidas.push(await medir(async function semInteracao(){}));
   medidas.push(await medir(async function mouse(){await p.locator('#avaliacoes [data-carrossel]').hover();}));
   medidas.push(await medir(async function foco(){await p.evaluate(()=>document.querySelector('#avaliacoes .avaliacao-link').focus({preventScroll:true}));}));
   medidas.push(await medir(async function toque(){await p.locator('#avaliacoes [data-carrossel]').dispatchEvent('pointerdown',{pointerType:'touch',pointerId:9});await p.locator('#avaliacoes [data-carrossel]').dispatchEvent('pointerup',{pointerType:'touch',pointerId:9});}));
   medidas.push(await medir(async function arrasto(){const b=await p.locator('#avaliacoes [data-carrossel]').boundingBox();await p.mouse.move(b.x+b.width*0.7,b.y+100);await p.mouse.down();await p.mouse.move(b.x+b.width*0.2,b.y+100,{steps:12});await p.mouse.up();}));
   medidas.push(await medir(async function rodaHorizontal(){await p.mouse.wheel(400,0);}));
   medidas.push(await medir(async function setasTeclado(){await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowLeft');}));
   medidas.push(await medir(async function focoNativoForaDaFaixa(){await p.evaluate(()=>{const t=document.querySelector('#avaliacoes [data-carrossel-trilha]');t.lastElementChild.querySelector('a').focus();});}));
   const beforeReduce=await p.evaluate(()=>phase());await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(50);const a=await p.evaluate(()=>phase());await p.waitForTimeout(250);const b=await p.evaluate(()=>phase());await p.emulateMedia({reducedMotion:'no-preference'});
   casos.push({width,theme,medidas,reduzidoEstavel:Math.abs(b.phase-a.phase)<0.01,setas:await p.locator('#avaliacoes button[data-carrossel-anterior],#avaliacoes button[data-carrossel-proximo]').count(),tamanhos:await p.locator('#avaliacoes [data-slide]').evaluateAll(es=>es.map(e=>({w:e.offsetWidth,h:e.offsetHeight}))),overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  }
 }
 // Rodar quadros de tempo virtual verifica voltas completas sem esperar minutos.
 await p.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await p.locator('#avaliacoes').scrollIntoViewIfNeeded();await p.waitForTimeout(250);
 await p.clock.install();
 await p.evaluate(()=>{window.t=document.querySelector('#avaliacoes [data-carrossel-trilha]');window.trocas=0;window.itens=[...t.children];window.obs=new MutationObserver(ms=>{trocas+=ms.filter(m=>m.removedNodes.length).length;});obs.observe(t,{childList:true});});
 await p.clock.runFor(140000);
 const voltas=await p.evaluate(()=>({trocas,quantidade:t.children.length,identidadesUnicas:new Set([...t.children]).size,originais:itens.every(i=>[...t.children].includes(i)),fase:t.scrollLeft}));
 await p.clock.resume();
 // A função compartilhada mantém setas e pausas no modo usado pelo Instagram.
 const instagram=await p.evaluate(async()=>{
  const r=document.createElement('div');r.style.cssText='position:fixed;top:100px;left:0;width:300px;z-index:99999;background:white';r.innerHTML='<button data-carrossel-anterior>Anterior</button><div data-carrossel-trilha style="display:flex;overflow:auto;width:300px"><div data-slide style="flex:0 0 300px">1</div><div data-slide style="flex:0 0 300px">2</div><div data-slide style="flex:0 0 300px">3</div></div><button data-carrossel-proximo>Próximo</button>';document.body.append(r);
  const api=criarCarrossel(r,{intervalo:200});const sleep=ms=>new Promise(ok=>setTimeout(ok,ms));await sleep(550);const automatico=api.trilha.scrollLeft>0;
  r.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}));await sleep(400);const x=api.trilha.scrollLeft;await sleep(500);const hoverPausa=Math.abs(api.trilha.scrollLeft-x)<1;
  r.dispatchEvent(new PointerEvent('pointerleave',{pointerType:'mouse'}));await sleep(550);const retoma=api.trilha.scrollLeft!==x;
  api.travar('video',true);await sleep(400);const y=api.trilha.scrollLeft;await sleep(500);const videoPausa=Math.abs(api.trilha.scrollLeft-y)<1;api.travar('video',false);
  const setas=[...r.querySelectorAll('button')].every(b=>!b.hidden);r.remove();return {automatico,hoverPausa,retoma,videoPausa,setas};
 });
 return {casos,voltas,instagram};
}finally{await c.close();}
}
