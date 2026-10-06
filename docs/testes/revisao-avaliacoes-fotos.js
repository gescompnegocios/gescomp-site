async(shared)=>{
const c=await shared.context().browser().newContext(),p=await c.newPage(),casos=[],erros=[];
const base='http://127.0.0.1:8080/',axe='C:/Users/fabri/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js';
try{
 await p.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.emulateMedia({reducedMotion:'reduce'});
 p.on('pageerror',e=>erros.push(String(e)));
 p.on('console',e=>{if(e.type()==='error')erros.push(e.text());});
 p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)erros.push(r.status()+' '+r.url());});
 const paginas=['index.html','informacoes.html','abrir-empresa.html','imposto-de-renda.html','mei.html','simples-nacional.html','pro-labore-e-lucros.html','departamento-pessoal.html','calendario-fiscal.html','404.html'];
 for(const pagina of paginas){
  for(const [width,height] of [[1366,768],[1920,1080],[390,844],[360,800]]){
   await p.setViewportSize({width,height});
   for(const theme of ['light','dark']){
    await p.goto(base+pagina,{waitUntil:'networkidle'});
    await p.evaluate(async t=>{document.documentElement.dataset.theme=t;await document.fonts.ready;const imgs=[...document.images];for(const img of imgs)img.loading='eager';await Promise.all(imgs.map(i=>i.decode().catch(()=>{})));},theme);
    await p.addScriptTag({path:axe});
    const result=await p.evaluate(async()=>{
     const imgs=[...document.images].filter(i=>i.currentSrc.includes('/assets/img/fotos/'));
     const fotos=imgs.map(i=>({src:new URL(i.currentSrc).pathname,carregada:i.complete&&i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight}));
     const falhas=(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.length}));
     return {overflow:document.documentElement.scrollWidth>innerWidth,fotos,falhas,avaliacoesSetas:document.querySelectorAll('#avaliacoes [data-carrossel-anterior],#avaliacoes [data-carrossel-proximo]').length,contador:document.querySelector('[data-contador="6"]')?.textContent,estados:document.querySelector('[data-contador="6"]')?.parentElement.textContent};
    });
    casos.push({pagina,width,height,theme,...result});
   }
  }
 }
 return {casos,erros,resumo:{combinacoes:casos.length,overflow:casos.filter(c=>c.overflow).length,violacoes:casos.filter(c=>c.falhas.length).length,fotosAusentes:casos.flatMap(c=>c.fotos).filter(f=>!f.carregada).length}};
}finally{await c.close();}
}
