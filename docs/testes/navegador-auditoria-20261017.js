async (page) => {
  // Uma única página já aberta; sem contexts adicionais nem consultas simultâneas.
  const origin=page.auditOrigin || 'http://127.0.0.1:8091';
  const local=origin.includes('127.0.0.1');
  const paths=['/','/informacoes','/receita-sintonia-terceiro-ciclo-2026','/simples-nacional-balanco-outubro-2026','/cbs-documentos-fiscais-outubro-2026','/abrir-empresa','/calculos-trabalhistas','/calendario-fiscal','/consultoria-financeira','/contabilidade-empresarial','/departamento-pessoal','/escolha-de-regime-tributario','/fim-escala-6x1','/imposto-de-renda','/mei','/novo-limite-mei','/pro-labore-e-lucros','/regularizacao-baixa-cnpj','/simples-nacional'];
  const results=[],errors=[],interactions=[];
  page.auditProgress=results;
  page.setDefaultNavigationTimeout(12000);
  page.setDefaultTimeout(6000);
  const errorHandler=e=>errors.push(e.message);
  page.on('pageerror',errorHandler);
  await page.unroute('**/*');
  await page.route('**/*',async route=>{
    const u=new URL(route.request().url());
    if(u.origin!==origin)return route.abort();
    if(local&&u.pathname!=='/'&&!u.pathname.split('/').pop().includes('.')){
      u.pathname+='.html';return route.continue({url:u.href});
    }
    return route.continue();
  });
  await page.emulateMedia({reducedMotion:'reduce'});
  try {
    for(const path of (page.auditPaths || paths)){
      const response=await page.goto(origin+path,{waitUntil:'domcontentloaded'});
      await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]));
      for(const width of (page.auditWidths || [320,390,768,1366])){
        await page.setViewportSize({width,height:900});
        for(const theme of ['light','dark']){
          const now=await page.evaluate(()=>document.documentElement.dataset.theme);
          if(now!==theme)await page.locator('[data-acao="tema"]:visible').first().evaluate(e=>e.click());
          const data=await page.evaluate(()=>{
            const visible=e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height;
            const cards=[...document.querySelectorAll('.institucional-cartao')];
            return {theme:document.documentElement.dataset.theme,overflow:document.documentElement.scrollWidth>innerWidth,
              h1:document.querySelectorAll('h1').length,
              broken:[...document.images].filter(e=>visible(e)&&e.complete&&!e.naturalWidth).map(e=>e.src),
              clipped:[...document.querySelectorAll('.institucional p,.institucional li,.artigo-texto p,h1')].filter(e=>{const r=e.getBoundingClientRect();return visible(e)&&(r.left<0||r.right>innerWidth+1||e.scrollWidth>e.clientWidth+1);}).map(e=>e.textContent.slice(0,60)),
              cards:cards.length,news:document.querySelectorAll('.mudancas>ol>li').length,
              wa:[...document.querySelectorAll('[data-whatsapp],[data-whatsapp-msg]')].filter(e=>!e.href.startsWith('https://wa.me/5579988771430?text=')).length};
          });
          const failed=[];
          if(response.status()!==200)failed.push('HTTP '+response.status());
          if(data.theme!==theme)failed.push('tema');
          if(data.overflow||data.clipped.length)failed.push('corte/overflow '+JSON.stringify(data.clipped));
          if(data.h1!==1||data.broken.length||data.wa)failed.push('H1/imagem/WhatsApp');
          if(path==='/'&&(data.cards!==3||data.news!==3))failed.push('quantidade institucional/notícias');
          results.push({path,width,theme,errors:failed});
        }
      }
    }
    if(page.auditInteractions!==false){
    await page.setViewportSize({width:390,height:844});await page.goto(origin+'/');
    const menu=page.locator('#botao-menu');await menu.focus();await page.keyboard.press('Enter');
    interactions.push({name:'menu por teclado',ok:await menu.getAttribute('aria-expanded')==='true'});
    await page.keyboard.press('Escape');
    interactions.push({name:'Escape fecha menu e devolve foco',ok:await menu.evaluate(e=>e.getAttribute('aria-expanded')==='false'&&document.activeElement===e)});
    const faq=page.locator('#informacoes summary').first();await faq.focus();await page.keyboard.press('Enter');
    interactions.push({name:'FAQ por teclado',ok:await faq.evaluate(e=>e.parentElement.open)});
    const buttons=await page.locator('.abertura-acoes a').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
    interactions.push({name:'botões móveis com mesmas dimensões',ok:buttons.length===2&&Math.abs(buttons[0].w-buttons[1].w)<1&&Math.abs(buttons[0].h-buttons[1].h)<1});
    const wa=await page.locator('#servicos [data-whatsapp-msg]').evaluateAll(es=>es.every(e=>new URL(e.href).searchParams.get('text')===window.GESCOMP_CONFIG.mensagensWhatsApp[e.dataset.whatsappMsg]));
    interactions.push({name:'mensagens contextuais do WhatsApp',ok:wa});
    await page.evaluate(()=>{window.__auditOpen=window.open;window.open=u=>{window.__auditForm=u;return null;};});
    await page.locator('#nome').fill('Teste local');
    const values=await page.locator('#assunto option').evaluateAll(es=>es.map(e=>e.value).filter(Boolean));
    await page.locator('#assunto').selectOption(values[0]);
    await page.locator('#form-contato').evaluate(e=>e.requestSubmit());
    interactions.push({name:'formulário sem telefone, sem envio externo',ok:await page.evaluate(()=>!!window.__auditForm&&!document.querySelector('#tel').required&&new URL(window.__auditForm).hostname==='wa.me')});
    await page.evaluate(()=>{window.open=window.__auditOpen;});
    await page.locator('#servicos a[href="/contabilidade-empresarial"]').click({timeout:8000});
    interactions.push({name:'home para serviço',ok:(await page.locator('h1').innerText())==='Contabilidade para sua empresa'});
    await page.goto(origin+'/fim-escala-6x1');
    await page.locator('.artigo-sumario a').last().click({timeout:8000});
    interactions.push({name:'sumário do artigo',ok:page.url().includes('#planejamento-da-jornada-sem-antecipar-lei')});
    }
    return {origin,scenarios:results.length,failures:results.filter(r=>r.errors.length),pageErrors:errors,interactions};
  } finally {page.removeListener('pageerror',errorHandler);}
}
