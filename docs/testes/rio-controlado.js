// Playwright MCP: base e3c3bb5 na porta 8081 e versão atual na 8080.
// Isola o rio apenas no navegador para excluir rolagem suave e diferenças de posição da página.
async (compartilhada) => {
  const contexto = await compartilhada.context().browser().newContext();
  const page = await contexto.newPage();
  const dir = 'C:/Users/fabri/Desktop/Trabalhos_Rafa_Dev/GESCOMP/02-site/docs/evidencias/2026-10-04/';
  const resultados = [];
  try {
    await page.route('https://vlibras.gov.br/app/vlibras-plugin.js', r => r.fulfill({contentType:'application/javascript',body:''}));
    await page.route('https://www.instagram.com/**', r => r.fulfill({contentType:'application/javascript',body:''}));
    for(const [width,height] of [[1366,768],[1920,1080],[390,844],[360,800]]){
      // Câmera alta para fotografar a seção inteira sem redimensionamento automático do screenshot.
      // A largura útil do navegador Windows é viewport menos a barra vertical de 15px.
      await page.setViewportSize({width,height:1400});
      for(const [porta,versao] of [[8081,'base'],[8080,'atual']]){
        await page.goto('http://127.0.0.1:'+porta+'/',{waitUntil:'networkidle'});
        await page.evaluate(()=>document.fonts.ready);
        await page.addStyleTag({content:'html{scroll-behavior:auto!important;overflow-y:scroll!important}.gc-cabecalho,#fab{display:none!important}#rio{width:'+(width-15)+'px!important}'});
        await page.evaluate(()=>{
          const rio=document.querySelector('#rio'),main=rio.parentElement;
          for(const e of main.children)if(e!==rio)e.style.display='none';
          for(const e of document.body.children)if(!e.contains(rio)&&e.tagName!=='SVG')e.style.display='none';
          main.style.margin='0';main.style.padding='0';window.scrollTo(0,0);
          for(const svg of document.querySelectorAll('svg'))if(svg.pauseAnimations){svg.pauseAnimations();svg.setCurrentTime(2);}
        });
        for(const theme of ['light','dark']){
          await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
          await page.waitForTimeout(1700);
          const nome='rio-'+versao+'-controlada-'+(theme==='light'?'claro':'escuro')+'-'+width+'.png';
          const rect=await page.locator('#rio').boundingBox();
          await page.screenshot({path:dir+nome,clip:{x:0,y:0,width:width-15,height:Math.ceil(rect.height)}});
          resultados.push(await page.locator('#rio').evaluate((rio,info)=>{const r=rio.getBoundingClientRect(),s=rio.querySelector('.rio-cena');return{...info,rect:{x:r.x,y:r.y,width:r.width,height:r.height},tempo:s.getCurrentTime(),pausado:s.animationsPaused()};},{width,theme,versao,nome}));
        }
      }
    }
    return resultados;
  }finally{await contexto.close();}
}
