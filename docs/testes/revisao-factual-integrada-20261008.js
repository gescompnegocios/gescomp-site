// Smoke test local da versão final: assets reais do checkout; SDKs externos simulados.
async (page) => {
  const pages = ['index','informacoes','abrir-empresa','imposto-de-renda','mei','simples-nacional','pro-labore-e-lucros','departamento-pessoal','calendario-fiscal','fim-escala-6x1','novo-limite-mei','contabilidade-empresarial','calculos-trabalhistas','consultoria-financeira','escolha-de-regime-tributario','regularizacao-baixa-cnpj','404'];
  const ctx = await page.context().browser().newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  const blocked = new Set();
  await ctx.route('**/*', async route => {
    const req=route.request(), url=new URL(req.url());
    if(url.origin==='http://127.0.0.1:8091') return route.continue();
    blocked.add(url.origin);
    return route.fulfill({status:200,contentType:req.resourceType()==='script'?'application/javascript':'text/plain',body:''});
  });
  const p=await ctx.newPage(), results=[];
  let errors=[],consoleErrors=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  for (const width of [1366,1920,390,360]) {
    await p.setViewportSize({width,height:width===1366?768:width===1920?1080:844});
    for (const slug of pages) {
      errors=[];consoleErrors=[];
      const response=await p.goto('http://127.0.0.1:8091/'+slug+'.html',{waitUntil:'load'});
      await p.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);return document.fonts.ready;});
      for(const theme of ['light','dark']) {
        await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
        await p.waitForTimeout(600);
        const state=await p.evaluate(()=>({
          overflow:document.documentElement.scrollWidth>innerWidth,
          h1:document.querySelectorAll('h1').length,
          brokenImages:[...document.images].filter(i=>i.complete && !i.naturalWidth && !i.hidden && i.getClientRects().length).map(i=>i.src),
          whatsapp:[...document.querySelectorAll('[data-whatsapp-msg]')].map(a=>({key:a.dataset.whatsappMsg,correct:new URL(a.href).searchParams.get('text')===window.GESCOMP_CONFIG.mensagensWhatsApp[a.dataset.whatsappMsg]})),
          cache:[...document.querySelectorAll('script[src],link[href]')].map(e=>e.src||e.href).filter(u=>/\/assets\/(css\/site\.css|js\/(config|site)\.js)/.test(u)).map(u=>({url:u,correct:new URL(u).searchParams.get('v')==='20261008' && new URL(u).searchParams.get('rev')==='12'}))
        }));
        results.push({page:slug,width,theme,status:response.status(),...state,errors:[...errors],consoleErrors:[...consoleErrors]});
      }
    }
  }
  await ctx.close();
  const failures=results.filter(r=>r.status!==200||r.overflow||r.h1!==1||r.brokenImages.length||r.errors.length||r.consoleErrors.length||r.whatsapp.some(a=>!a.correct)||r.cache.some(a=>!a.correct));
  return {data:'2026-10-08',localOnly:true,externalConnections:0,siteJs:'checkout integrado cd11fb2; sem substituir site.js',blockedOrigins:[...blocked],cases:results.length,failures,results};
}
