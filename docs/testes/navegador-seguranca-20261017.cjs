// Usa Playwright já instalado via caminho recebido; uma aba e perfil temporário.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.argv[2]);
const origin=process.env.GESCOMP_TEST_ORIGIN||'http://127.0.0.1:8091';
const out=path.resolve('.playwright-mcp/seguranca-tecnica');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu','--renderer-process-limit=2','--js-flags=--max-old-space-size=128']});
 const result={origin,checks:[],violations:[],pageErrors:[],integrationMode:'official-loader-and-redirect-fixture; external iframe contents not exercised'};
 let page,integrations=false;
 const check=(name,ok,detail)=>{result.checks.push({name,ok:!!ok,...(detail?{detail}:{})});fs.writeFileSync(path.join(out,'progresso.json'),JSON.stringify(result));};
 process.once('SIGINT',async()=>{await browser.close();process.exit(130);});
 try{
  page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(25000);
  await page.addInitScript(()=>{window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push({directive:e.effectiveDirective,blocked:e.blockedURI}));});
  page.on('pageerror',e=>result.pageErrors.push(e.message));
  page.on('requestfailed',r=>{if(integrations){result.failedRequests??=[];result.failedRequests.push({url:r.url(),error:r.failure()?.errorText});}});
  // A matriz de conteúdo não precisa carregar fornecedores externos.
  await page.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  for(const route of ['/','/mei','/rota-inexistente-teste-seguranca','/nivel/inexistente']){
   const response=await page.goto(origin+route,{waitUntil:'domcontentloaded'});
   const missing=route.includes('inexistente');
   check(route+': status',response.status()===(missing?404:200));
   check(route+': CSP presente',!!response.headers()['content-security-policy']);
   check(route+': HSTS presente',response.headers()['strict-transport-security']==='max-age=31536000');
   if(missing){check(route+': 404 personalizada e noindex',await page.locator('h1').innerText().then(t=>t.includes('encontr'))&&await page.locator('meta[name="robots"]').getAttribute('content').then(t=>t.includes('noindex')));}
   else{
    for(const width of [390,1366]){
     await page.setViewportSize({width,height:844});
     for(const theme of ['dark','light']){
      await page.locator('[data-acao="tema"]:visible').first().evaluate(e=>e.click());
      check(route+': tema '+theme+' em '+width,await page.evaluate(t=>document.documentElement.dataset.theme===t,theme));
      check(route+': sem overflow em '+width,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
     }
    }
   }
   result.violations.push(...await page.evaluate(()=>window.__csp));
  }
  await page.goto(origin+'/',{waitUntil:'domcontentloaded'});await page.setViewportSize({width:390,height:844});
  await page.locator('#botao-menu').evaluate(e=>e.click());check('menu abre com CSP',await page.locator('#botao-menu').getAttribute('aria-expanded')==='true');await page.keyboard.press('Escape');
  check('WhatsApp mantém destino',await page.locator('#servicos [data-whatsapp-msg]').evaluateAll(es=>es.every(e=>e.href.startsWith('https://wa.me/5579988771430?text='))));
  await page.evaluate(()=>{window.__unexpectedScript=false;const script=document.createElement('script');script.textContent='window.__unexpectedScript=true';document.head.appendChild(script);});
  check('CSP bloqueia script inline injetado',await page.evaluate(()=>!window.__unexpectedScript));
  await page.waitForFunction(()=>window.__csp.some(e=>e.directive==='script-src-elem'&&e.blocked==='inline'));
  check('CSP registra tentativa bloqueada',true);
  // Fixture do loader oficial lido em 17/10: testa CSP sem downloads pesados de avatar.
  await page.unroute('**/*');
  integrations=true;
  await page.route('**/*',r=>{
   const u=new URL(r.request().url());
   if(u.origin===origin)return r.continue();
   if(u.href==='https://vlibras.gov.br/app/vlibras-plugin.js')return r.fulfill({status:302,headers:{location:'https://cdn.jsdelivr.net/gh/spbgovbr-vlibras/vlibras-portal@v7.12.2/app/vlibras-plugin.js'}});
   if(u.hostname==='cdn.jsdelivr.net'&&u.pathname.endsWith('/vlibras-plugin.js'))return r.fulfill({contentType:'application/javascript',body:fs.readFileSync('.playwright-mcp/vlibras-plugin-atual.js','utf8')});
   if(u.hostname==='www.instagram.com'&&u.pathname==='/embed.js')return r.fulfill({contentType:'application/javascript',body:fs.readFileSync('.playwright-mcp/instagram-embed-atual.js','utf8')});
   if(u.hostname==='www.instagram.com')return r.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><title>Fixture de frame</title></html>'});
   if(u.hostname==='vlibras.gov.br')return r.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg"/>'});
   return r.abort();
  });
  await page.goto(origin+'/',{waitUntil:'domcontentloaded'});await page.keyboard.press('Tab');
  await page.waitForFunction(()=>!!window.VLibrasWidget?.initBtn,null,{timeout:10000,polling:100});
  check('VLibras: loader oficial permitido pela CSP',await page.evaluate(()=>!!window.VLibrasWidget?.initBtn));
  await page.locator('#instagram').evaluate(e=>e.scrollIntoView());
  await page.waitForFunction(()=>!!document.querySelector('#instagram iframe'),null,{timeout:10000,polling:100});
  check('Instagram: URL do iframe permitida pela CSP',await page.locator('#instagram iframe').first().getAttribute('src').then(s=>s.startsWith('https://www.instagram.com/')));
  await page.waitForTimeout(1500);result.violations.push(...await page.evaluate(()=>window.__csp));
  result.success=result.checks.every(c=>c.ok)&&result.violations.length===0&&result.pageErrors.length===0;
 }catch(e){result.error=e.message;result.success=false;if(page)result.violations.push(...await page.evaluate(()=>window.__csp||[]).catch(()=>[]));}
 finally{await browser.close();fs.writeFileSync(path.join(out,'navegador.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));}
 process.exitCode=result.success?0:1;
})();
