// Rodar em Playwright browser_run_code_unsafe por filename. Só localhost:8091.
// Change pages/widths para repetir um subconjunto; nunca usa uma conta autenticada.
async (page) => {
  const pages = page.seoOnlyPages || ['index','informacoes','abrir-empresa','imposto-de-renda','mei','simples-nacional','pro-labore-e-lucros','departamento-pessoal','calendario-fiscal','fim-escala-6x1','novo-limite-mei'];
  const ctx = await page.context().browser().newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  const blocked = new Set();
  await ctx.route('**/*', async route => {
    const req=route.request(), url=new URL(req.url());
    if (url.origin==='http://127.0.0.1:8091' && url.pathname==='/assets/js/site.js') return route.fulfill({contentType:'application/javascript',path:'C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-08/revisao-factual/site-publicado-9b67307.js'});
    if (url.origin==='http://127.0.0.1:8091') return route.continue();
    blocked.add(url.origin);
    // Nenhum SDK é executado ou contato externo efetuado; evita erros artificiais de rede bloqueada.
    return route.fulfill({status:200,contentType:req.resourceType()==='script'?'application/javascript':'text/plain',body:''});
  });
  const p=await ctx.newPage(), results=[];
  let errors=[],consoleErrors=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  for (const width of page.seoOnlyWidths || [1366,1920,390,360]) {
    await p.setViewportSize({width,height:width===1366?768:width===1920?1080:844});
    for (const slug of pages) {
      errors=[];consoleErrors=[];
      await p.goto('http://127.0.0.1:8091/'+slug+'.html',{waitUntil:'load'});
      await p.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);return document.fonts.ready;});
      await p.addScriptTag({path:'C:/Users/fabri/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js'});
      for (const theme of page.seoOnlyThemes || ['light','dark']) {
        await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
        await p.waitForTimeout(2100);
        const state=await p.evaluate(async()=>{
          const a=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
          return {
            overflow:document.documentElement.scrollWidth>innerWidth,
            violations:a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),
            h1:document.querySelectorAll('h1').length,
            brokenImages:[...document.images].filter(i=>i.complete && !i.naturalWidth && !i.hidden && i.getClientRects().length).map(i=>i.src),
            headingLines:Math.round(document.querySelector('h1').getBoundingClientRect().height/parseFloat(getComputedStyle(document.querySelector('h1')).lineHeight)),
            whatsapp:[...document.querySelectorAll('[data-whatsapp-msg]')].map(a=>({key:a.dataset.whatsappMsg,correct:new URL(a.href).searchParams.get('text')===window.GESCOMP_CONFIG.mensagensWhatsApp[a.dataset.whatsappMsg]})),
            serviceLinks:document.querySelectorAll('#servicos a[href^="/"],main a[href^="/"]').length
          };
        });
        results.push({page:slug,width,theme,...state,errors:[...errors],consoleErrors:[...consoleErrors]});
      }
    }
  }
  await ctx.close();
  return {localOnly:true,externalConnections:0,siteJs:'9b67307 (edição externa em andamento excluída)',blockedOrigins:[...blocked],results};
}
