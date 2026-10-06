/* Conferência da sessão temporária aberta para este pedido (porta 9336).
   Usa o CDP nativo quando a conexão Playwright de todas as abas não responde.
   Não lê cookies, tokens, senhas nem o perfil principal do usuário.
   Uso: node painel-search-cdp.cjs google|cloudflare [arquivo de expressão JS]
   As expressões são ações/revisões explícitas do roteiro, não código do site. */
const fs = require('node:fs');
const path = require('node:path');
const host = {google: 'search.google.com', cloudflare: 'dash.cloudflare.com'}[process.argv[2]];
if (!host) throw new Error('Painel inválido');
const root = path.resolve(__dirname, '../..');
const fallback = `JSON.stringify({url:location.href,title:document.title,body:document.body.innerText,controls:[...document.querySelectorAll('input,button,[role="button"]')].map(e=>({tag:e.tagName,type:e.type,role:e.getAttribute('role'),aria:e.getAttribute('aria-label'),text:e.innerText?.slice(0,180),visible:!!e.getClientRects().length})).filter(e=>e.visible)})`;
let expression = fallback;
if (process.argv[3] && !['--inspect','--click','--navigate','--sitemap','--screenshot'].includes(process.argv[3])) {
  const source = path.resolve(process.argv[3]);
  if (!source.startsWith(root + path.sep)) throw new Error('Expressão fora do projeto');
  expression = fs.readFileSync(source, 'utf8');
}
async function main() {
  const targets = await fetch('http://127.0.0.1:9336/json/list', {signal: AbortSignal.timeout(15000)}).then(r=>r.json());
  const page = targets.find(t=>t.type === 'page' && new URL(t.url).hostname === host);
  if (!page) throw new Error('Painel autenticado não encontrado');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{ws.close();reject(new Error('Conexão CDP excedeu 8 segundos'));},8000);
    ws.addEventListener('open',()=>{clearTimeout(timer);resolve();},{once:true});
    ws.addEventListener('error',e=>{clearTimeout(timer);reject(e);},{once:true});
  });
  let seq=0;
  const pending=new Map();
  ws.addEventListener('message',event=>{
    const data=JSON.parse(event.data),request=pending.get(data.id);
    if(request){pending.delete(data.id);data.error?request.reject(new Error(data.error.message)):request.resolve(data.result);}
  });
  function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
  const guard = setTimeout(()=>{ws.close();process.stderr.write('Tempo excedido\n');process.exitCode=1;},40000);
  try {
    if(process.argv[3]==='--sitemap'){
      const url=process.argv[4],u=new URL(url);
      if(host!=='search.google.com'||u.origin!=='https://gescompnegocios.com.br'||u.pathname!=='/sitemap.xml')throw new Error('Sitemap inválido');
      await send('Page.bringToFront');
      const focused=await send('Runtime.evaluate',{expression:`(()=>{if(!location.pathname.startsWith('/search-console/sitemaps'))throw Error('Tela inesperada');const e=document.querySelector('input[aria-label="Insira o URL do sitemap"]');if(!e||!e.getClientRects().length)throw Error('Campo ausente');e.focus();e.select();return true;})()`,returnByValue:true});
      if(focused.exceptionDetails)throw new Error('Tela de envio indisponível');
      await send('Input.insertText',{text:url});
      const submitted=await send('Runtime.evaluate',{expression:`(()=>{const e=[...document.querySelectorAll('button,[role="button"]')].find(e=>e.innerText.trim()==='ENVIAR'&&e.getClientRects().length);if(!e)throw Error('Enviar ausente');e.click();return true;})()`,returnByValue:true});
      if(submitted.exceptionDetails)throw new Error('Envio indisponível');
      await new Promise(resolve=>setTimeout(resolve,3500));
    }
    if(process.argv[3]==='--navigate'){
      const url=process.argv[4];
      if(new URL(url).hostname!==host)throw new Error('Navegação fora do painel');
      await send('Page.bringToFront');
      await send('Page.navigate',{url});
      await new Promise(resolve=>setTimeout(resolve,2000));
    }
    if(process.argv[3]==='--click'){
      const label=process.argv[4];
      if(!label)throw new Error('Controle ausente');
      await send('Page.bringToFront');
      const clicked=await send('Runtime.evaluate',{expression:`(()=>{const label=${JSON.stringify(label)}.toLocaleLowerCase();const es=[...document.querySelectorAll('button,[role="button"],[role="menuitem"],a')].filter(e=>{const t=(e.innerText||e.getAttribute('aria-label')||'').trim().toLocaleLowerCase();return e.getClientRects().length&&getComputedStyle(e).visibility==='visible'&&(t===label||t.split(String.fromCharCode(10)).some(line=>line.trim()===label)||t.endsWith('\\n'+label))});if(es.length!==1)throw Error('Controle ausente ou ambíguo: '+es.length);es[0].scrollIntoView({block:'nearest'});const r=es[0].getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`,returnByValue:true});
      if(clicked.exceptionDetails)throw new Error('Controle ausente ou ambíguo');
      const point=clicked.result.value;
      await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
      await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
      await new Promise(resolve=>setTimeout(resolve,2000));
    }
    if(process.argv[3]==='--inspect'){
      const url=process.argv[4];
      if(host!=='search.google.com'||new URL(url).origin!=='https://gescompnegocios.com.br')throw new Error('URL/propriedade inválida');
      await send('Page.bringToFront');
      const focus=await send('Runtime.evaluate',{expression:`(()=>{const e=document.querySelector('input[aria-label="Inspecionar qualquer URL de gescompnegocios.com.br"]');if(!e)throw Error('Campo ausente');e.focus();e.select();return true;})()`,returnByValue:true});
      if(focus.exceptionDetails)throw new Error('Inspeção indisponível');
      await send('Input.insertText',{text:url});
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
      await new Promise(resolve=>setTimeout(resolve,3500));
    }
    if(process.argv[3]==='--screenshot'){
      const file=path.resolve(process.argv[4]||'');
      if(!process.argv[4]||!file.startsWith(root+path.sep)||path.extname(file)!=='.png')throw new Error('Captura fora do projeto ou formato inválido');
      await send('Page.bringToFront');
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:false});
      fs.writeFileSync(file,Buffer.from(shot.data,'base64'));
    }
    const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    const value = result.result.value;
    process.stdout.write(typeof value==='string' ? value : JSON.stringify(value));
  } finally {clearTimeout(guard);ws.close();}
}
main().catch(e=>{process.stderr.write(e.message+'\n');process.exitCode=1;});
