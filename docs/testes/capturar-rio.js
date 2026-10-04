// Playwright MCP. Mesmas condições das capturas iniciais, sem mudar o produto.
async (compartilhada) => {
  const contexto = await compartilhada.context().browser().newContext();
  const page = await contexto.newPage();
  const dir = 'C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-04/';
  const resultado = [];
  try {
    await page.route('https://vlibras.gov.br/app/vlibras-plugin.js', r => r.fulfill({ contentType:'application/javascript', body:'' }));
    await page.route('https://www.instagram.com/**', r => r.fulfill({ contentType:'application/javascript', body:'' }));
    for (const [width,height] of [[1366,768],[1920,1080],[390,844],[360,800]]) {
      await page.setViewportSize({width,height});
      await page.goto('http://127.0.0.1:8080/', {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({content:'.gc-cabecalho,#fab{visibility:hidden!important}'});
      await page.evaluate(() => { const s=document.querySelector('.rio-cena'); s.pauseAnimations(); s.setCurrentTime(2); });
      for (const theme of ['light','dark']) {
        await page.evaluate(t => document.documentElement.setAttribute('data-theme',t),theme);
        await page.waitForTimeout(1600);
        const nome='rio-depois-etapa-1-'+(theme==='light'?'claro':'escuro')+'-'+width+'.png';
        await page.locator('#rio').screenshot({path:dir+nome});
        resultado.push({nome,width,height,theme});
      }
      if(width===1366){
        await page.evaluate(() => document.documentElement.setAttribute('data-theme','light'));
        await page.waitForTimeout(1600);
        await page.locator('#inicio').screenshot({path:dir+'abertura-depois-etapa-1-1366.png'});
        await page.locator('#servicos').screenshot({path:dir+'servicos-depois-etapa-1-1366.png'});
      }
    }
    return resultado;
  } finally {
    await contexto.close();
  }
}
