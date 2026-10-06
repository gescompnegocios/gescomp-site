async(shared)=>{
const c=await shared.context().browser().newContext(),p=await c.newPage(),casos=[],erros=[];
const base='http://127.0.0.1:8080/',axe='C:/Users/fabri/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js';
try{
 await p.route('https://vlibras.gov.br/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 await p.emulateMedia({reducedMotion:'reduce'});
 p.on('pageerror',e=>erros.push(String(e)));
 p.on('console',e=>{if(e.type()==='error')erros.push(e.text());});
 p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)erros.push(r.status()+' '+r.url());});
 const paginas=['index.html','informacoes.html','abrir-empresa.html','imposto-de-renda.html','mei.html','simples-nacional.html','pro-labore-e-lucros.html','departamento-pessoal.html','calendario-fiscal.html','fim-escala-6x1.html','novo-limite-mei.html','404.html'];
 for(const pagina of paginas)for(const [width,height] of [[1366,768],[1920,1080],[390,844],[360,800]]){
  await p.setViewportSize({width,height});
  for(const theme of ['light','dark']){
   await p.goto(base+pagina,{waitUntil:'networkidle'});
   await p.evaluate(async t=>{document.documentElement.dataset.theme=t;await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));},theme);
   await p.addScriptTag({path:axe});
   const resultado=await p.evaluate(async()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    imagensAusentes:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>new URL(i.currentSrc||i.src).pathname),
    placeholders:/\[Foto|\[LINK-|Lorem ipsum/.test(document.body.innerText),
    violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),
    h1:document.querySelectorAll('h1').length,
    avaliacoes:[...document.querySelectorAll('#avaliacoes [data-slide]')].map(e=>({w:e.offsetWidth,h:e.offsetHeight})),
    setasInstagram:[...document.querySelectorAll('#instagram [data-carrossel-anterior],#instagram [data-carrossel-proximo]')].map(e=>({hidden:e.hidden,display:getComputedStyle(e).display}))
   }));
   casos.push({pagina,width,height,theme,...resultado});
  }
 }
 return {casos,erros,resumo:{combinacoes:casos.length,overflow:casos.filter(c=>c.overflow).length,violacoes:casos.filter(c=>c.violations.length).length,imagensAusentes:casos.filter(c=>c.imagensAusentes.length).length,placeholders:casos.filter(c=>c.placeholders).length}};
}finally{await c.close();}
}
