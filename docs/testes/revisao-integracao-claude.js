// Revisão dos pedidos do handoff do Claude. Retratos e avaliações de teste só em rotas.
async(shared)=>{
 const c=await shared.context().browser().newContext(),p=await c.newPage(),r=[];
 const base='http://127.0.0.1:8080';
 const check=(nome,ok,dados)=>{r.push({nome,aprovado:!!ok,dados});if(!ok)throw Error(nome+': '+JSON.stringify(dados));};
 try{
  await p.route('https://vlibras.gov.br/**',x=>x.fulfill({body:''}));
  await p.route('https://www.instagram.com/**',x=>x.fulfill({
   contentType:x.request().url().endsWith('/embed.js')?'application/javascript':'text/html',
   body:x.request().url().endsWith('/embed.js')?`window.instgrm={Embeds:{process:function(){document.querySelectorAll('blockquote.instagram-media').forEach(function(b){var f=document.createElement('iframe');f.className='instagram-media';f.style.height='420px';f.src=b.getAttribute('data-instgrm-permalink').split('?')[0]+'embed/';b.replaceWith(f);});}}};`:'<!doctype html><html lang="pt-BR"><body><button>Vídeo</button><script>addEventListener("load",()=>setTimeout(()=>parent.postMessage(JSON.stringify({type:"MOUNTED"}),"http://127.0.0.1:8080"),2500));</script></body></html>'
  }));
  await p.setViewportSize({width:1366,height:768});
  await p.goto(base);await p.evaluate(()=>document.fonts.ready);
  check('Destaque usa texto e nota configurados',await p.locator('.abertura-prova').evaluate(e=>e.querySelector('.prova-numero').textContent==='5,0'&&e.querySelector('.prova-citacao p').textContent.includes(window.GESCOMP_CONFIG.avaliacoes.itens.find(x=>x.nome===window.GESCOMP_CONFIG.avaliacoes.destaque).texto)));
  await p.locator('#instagram').scrollIntoViewIfNeeded();await p.locator('#instagram iframe').first().waitFor();await p.waitForTimeout(400);
  check('Capa permanece com iframe carregado antes de MOUNTED',await p.locator('#instagram .ig-capa').count()===5&&await p.locator('#instagram .ig-midia.pronto').count()===0);
  await p.evaluate(()=>window.dispatchEvent(new MessageEvent('message',{origin:'https://www.instagram.com',source:window,data:JSON.stringify({type:'MOUNTED'})})));
  check('Mensagem de outra janela não libera capas',await p.locator('#instagram .ig-capa').count()===5);
  await p.waitForTimeout(3000);
  check('Montagem válida libera as cinco capas',await p.locator('#instagram .ig-midia.pronto').count()===5&&await p.locator('#instagram .ig-capa').count()===0);
  await p.locator('#numeros').scrollIntoViewIfNeeded();await p.waitForTimeout(1800);
  check('Números completos em até 1,8 segundo',await p.locator('[data-contador]').evaluateAll(es=>es.every(e=>e.textContent===e.dataset.prefixo+Number(e.dataset.contador).toLocaleString('pt-BR'))));
  const config=await(await p.request.get(base+'/assets/js/config.js')).text();
  await p.route('**/assets/js/config.js*',x=>x.fulfill({contentType:'application/javascript',body:config+"\nwindow.GESCOMP_CONFIG.fotos.push('/assets/img/fotos/gabriela-sobre.webp'); window.GESCOMP_CONFIG.avaliacoes.nota=4.3;"}));
  await p.route('**/assets/img/fotos/gabriela-sobre.webp',x=>x.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500"><rect width="1200" height="1500" fill="#003f4a"/></svg>'}));
  await p.goto(base);await p.locator('.gabriela-foto.tem-foto').waitFor();
  check('Foto futura de Sobre carrega apesar da moldura inicial oculta',await p.locator('.gabriela-foto').evaluate(e=>getComputedStyle(e).display!=='none'&&e.querySelector('img').naturalWidth===1200));
  check('Nota da abertura acompanha config.js',await p.locator('.prova-numero').textContent()==='4,3'&&await p.locator('.prova-nota .so-leitor').textContent()==='Nota 4,3 de 5');
  await p.unroute('**/assets/js/config.js*');
  await p.route('**/assets/js/config.js*',x=>x.fulfill({contentType:'application/javascript',body:config+'\nwindow.GESCOMP_CONFIG.avaliacoes.itens=[];'}));
  await p.goto(base);
  check('Lista vazia esconde seção e destaque sem coluna vazia',await p.locator('.abertura-prova').evaluate(e=>e.hidden&&getComputedStyle(e).display==='none'&&getComputedStyle(e.parentElement).gridTemplateColumns.split(' ').length===1)&&!await p.locator('#avaliacoes').isVisible());
  await p.unroute('**/assets/js/config.js*');
  for(const nome of ['informacoes','imposto-de-renda','mei','abrir-empresa','simples-nacional','pro-labore-e-lucros','departamento-pessoal','calendario-fiscal']){
   await p.goto(base+'/'+nome+'.html');
   const link=await p.locator('.cta-contexto a').evaluate(e=>({href:e.href,key:e.dataset.whatsappMsg,target:e.target,expected:window.GESCOMP_CONFIG.mensagensWhatsApp[e.dataset.whatsappMsg]}));
   check('WhatsApp contextual '+nome,new URL(link.href).hostname==='wa.me'&&new URL(link.href).searchParams.get('text')===link.expected&&link.target==='_blank',link);
  }
  return r;
 }finally{await c.close();}
}
