async (page) => {
  const origin='http://127.0.0.1:8091';
  const paths=['/','/informacoes','/receita-sintonia-terceiro-ciclo-2026','/simples-nacional-balanco-outubro-2026','/cbs-documentos-fiscais-outubro-2026','/abrir-empresa','/calculos-trabalhistas','/calendario-fiscal','/consultoria-financeira','/contabilidade-empresarial','/departamento-pessoal','/escolha-de-regime-tributario','/fim-escala-6x1','/imposto-de-renda','/mei','/novo-limite-mei','/pro-labore-e-lucros','/regularizacao-baixa-cnpj','/simples-nacional'];
  const results=[];const errors=[];
  for(const width of [320,390,768,1366]){
    const ctx=await page.context().browser().newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    await ctx.route('**/*',async route=>{
      const url=new URL(route.request().url());
      if(url.origin!==origin)return route.abort();
      if(url.pathname!=='/'&&!url.pathname.split('/').pop().includes('.')){
        url.pathname+='.html';return route.fulfill({response:await route.fetch({url:url.href})});
      }
      return route.continue();
    });
    const p=await ctx.newPage();p.on('pageerror',e=>errors.push({width,error:e.message}));
    for(const path of paths){
      const response=await p.goto(origin+path);await p.evaluate(()=>document.fonts.ready);
      for(const theme of ['light','dark']){
        if(theme==='dark')await p.locator('[data-acao="tema"]:visible').first().click();
        const data=await p.evaluate(()=>{
          const visible=e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height;
          const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
          const cards=[...document.querySelectorAll('.institucional-cartao')];
          return {
            theme:document.documentElement.dataset.theme,overflow:document.documentElement.scrollWidth>innerWidth,
            h1:document.querySelectorAll('h1').length,
            broken:[...document.images].filter(e=>visible(e)&&e.complete&&!e.naturalWidth).map(e=>e.src),
            cardOverflow:cards.some(e=>e.scrollWidth>e.clientWidth),cards:cards.map(box),
            clipped:[...document.querySelectorAll('.institucional p,.institucional li,.artigo-texto p,h1')].filter(e=>{const r=e.getBoundingClientRect();return visible(e)&&(r.left<0||r.right>innerWidth+1);}).map(e=>e.textContent.slice(0,70)),
            news:document.querySelectorAll('.mudancas>ol>li').length,
            wa:[...document.querySelectorAll('[data-whatsapp],[data-whatsapp-msg]')].filter(e=>!e.href.startsWith('https://wa.me/5579988771430?text=')).length
          };
        });
        const fails=[];
        if(response.status()!==200)fails.push('HTTP '+response.status());
        if(data.theme!==theme)fails.push('tema');
        if(data.overflow||data.cardOverflow||data.clipped.length)fails.push('overflow/corte '+JSON.stringify(data.clipped));
        if(data.h1!==1||data.broken.length||data.wa)fails.push('H1/imagem/WhatsApp');
        if(path==='/'&&(data.cards.length!==3||data.news!==3))fails.push('quantidade');
        if(path==='/'&&width<900&&!(data.cards[0].y<data.cards[1].y&&data.cards[1].y<data.cards[2].y))fails.push('ordem mobile');
        if(path==='/'&&width===1366&&Math.abs(data.cards[1].y-data.cards[2].y)>1)fails.push('grade desktop');
        results.push({width,path,theme,errors:fails});
      }
    }
    await p.goto(origin+'/');
    if(width<900){await p.locator('#botao-menu').click();if(await p.locator('#botao-menu').getAttribute('aria-expanded')!=='true')errors.push({width,error:'menu não abre'});await p.locator('#botao-menu').click();}
    const dir='C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/.playwright-mcp/finais-20261016';
    await p.screenshot({path:dir+'/final-'+width+'-light.png'});
    await p.locator('[data-acao="tema"]:visible').first().click();
    await p.screenshot({path:dir+'/final-'+width+'-dark.png'});
    await p.locator('.institucional').screenshot({path:dir+'/institucional-'+width+'-dark.png'});
    await ctx.close();
  }
  return {scenarios:results.length,failures:results.filter(r=>r.errors.length),errors};
}
