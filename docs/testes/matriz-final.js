// Playwright MCP: dez páginas × quatro telas × dois temas. Axe é apenas ferramenta de teste.
async (compartilhada) => {
  const contexto=await compartilhada.context().browser().newContext();
  const page=await contexto.newPage();
  const resultado=[];
  const axePath='C:/Users/fabri/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js';
  try{
    await page.route('https://vlibras.gov.br/app/vlibras-plugin.js',r=>r.fulfill({contentType:'application/javascript',body:''}));
    await page.route('https://www.instagram.com/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
    await page.emulateMedia({reducedMotion:'reduce'});
    const paginas=['index','informacoes','abrir-empresa','imposto-de-renda','mei','simples-nacional','pro-labore-e-lucros','departamento-pessoal','calendario-fiscal','404'];
    for(const nome of paginas){
      for(const [width,height] of [[1366,768],[1920,1080],[390,844],[360,800]]){
        await page.setViewportSize({width,height});
        const erros=[],http=[];
        const erro=e=>erros.push(e.message);
        const consoleErro=m=>{if(m.type()==='error')erros.push(m.text());};
        const resposta=r=>{if(r.url().startsWith('http://127.0.0.1:8080/')&&r.status()>=400)http.push({url:r.url(),status:r.status()});};
        page.on('pageerror',erro);page.on('console',consoleErro);page.on('response',resposta);
        await page.goto('http://127.0.0.1:8080/'+(nome==='index'?'':nome+'.html'),{waitUntil:'networkidle'});
        await page.evaluate(()=>document.fonts.ready);
        await page.addScriptTag({path:axePath});
        for(const theme of ['light','dark']){
          await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
          await page.waitForTimeout(1700);
          const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,largura:innerWidth,scrollWidth:document.documentElement.scrollWidth,placeholders:/\[(?:Foto|NOME|LINK-DA-PLATAFORMA|USUARIO|E-MAIL)/i.test(document.body.innerText),mensagens:[...document.querySelectorAll('[data-whatsapp-msg]')].map(e=>({chave:e.getAttribute('data-whatsapp-msg'),mensagem:new URL(e.href).searchParams.get('text')}))}));
          const axe=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
          resultado.push({pagina:nome,width,height,theme,...layout,erros:[...erros],http:[...http],axe});
        }
        page.off('pageerror',erro);page.off('console',consoleErro);page.off('response',resposta);
      }
    }
    return resultado;
  }finally{await contexto.close();}
}
