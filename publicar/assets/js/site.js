(function(){
var raiz=document.documentElement;
var cenaRio=document.querySelector('.rio-cena');
function retomarRio(){if(cenaRio&&cenaRio.unpauseAnimations)cenaRio.unpauseAnimations();}
retomarRio();
window.addEventListener('pageshow',retomarRio);
document.addEventListener('visibilitychange',function(){if(!document.hidden)retomarRio();});
var reduzir=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var botoesTema=document.querySelectorAll('[data-acao="tema"]');
function sincronizarTema(){var e=raiz.getAttribute('data-theme')==='dark';for(var i=0;i<botoesTema.length;i++)botoesTema[i].setAttribute('aria-pressed',e?'true':'false');}
for(var i=0;i<botoesTema.length;i++)botoesTema[i].addEventListener('click',function(){
var e=raiz.getAttribute('data-theme')!=='dark';raiz.setAttribute('data-theme',e?'dark':'light');
sincronizarTema();});
sincronizarTema();
var bm=document.getElementById('botao-menu'),mm=document.getElementById('menu-mobile');
function menu(abrir){if(!bm||!mm)return;mm.hidden=!abrir;bm.setAttribute('aria-expanded',abrir?'true':'false');bm.setAttribute('aria-label',abrir?'Fechar menu':'Abrir menu');}
if(bm)bm.addEventListener('click',function(){menu(mm.hidden);});
var fechar=document.querySelectorAll('[data-fecha-menu]');
for(var j=0;j<fechar.length;j++)fechar[j].addEventListener('click',function(){menu(false);});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&mm&&!mm.hidden){menu(false);bm.focus();}});
var mq=window.matchMedia('(max-width: 779px)');
var fab=document.getElementById('fab'),contato=document.getElementById('contato');
function atualizarFab(){if(!fab)return;var mobile=mq.matches;var rolou=(window.scrollY||0)>640;var noContato=false;
if(contato){var r=contato.getBoundingClientRect();noContato=r.top<window.innerHeight*0.7&&r.bottom>0;}
fab.classList.toggle('oculto',!rolou||noContato);}
window.addEventListener('scroll',atualizarFab,{passive:true});
window.addEventListener('resize',function(){atualizarFab();if(!mq.matches)menu(false);});
atualizarFab();
if(reduzir){var svgs=document.querySelectorAll('svg:not(.rio-cena)');for(var k=0;k<svgs.length;k++){if(svgs[k].pauseAnimations)svgs[k].pauseAnimations();}return;}
var nums=document.querySelectorAll('[data-contador]'),pinceis=document.querySelectorAll('.pincel-numero'),secao=document.getElementById('numeros');
function fmt(n){return Math.round(n).toLocaleString('pt-BR');}
function desenhar(p){for(var a=0;a<nums.length;a++){var el=nums[a];el.textContent=el.getAttribute('data-prefixo')+fmt(parseFloat(el.getAttribute('data-contador'))*p);}
for(var b=0;b<pinceis.length;b++)pinceis[b].setAttribute('stroke-dashoffset',String(100-100*p));}
if(!secao||!('IntersectionObserver' in window))return;
desenhar(0);
var io=new IntersectionObserver(function(es){for(var c=0;c<es.length;c++){if(es[c].isIntersecting){io.disconnect();var t0=null;
function passo(t){if(t0===null)t0=t;var x=Math.min(1,(t-t0)/2800);desenhar(1-Math.pow(1-x,3));if(x<1)requestAnimationFrame(passo);}
requestAnimationFrame(passo);return;}}},{threshold:0.35});
io.observe(secao);
})();

/* WhatsApp, cards de serviços e formulário de contato (configurados em /assets/js/config.js) */
(function(){
var cfg=window.GESCOMP_CONFIG||{};
var num=String(cfg.whatsapp||'').replace(/\D/g,'');
function wa(texto){return 'https://wa.me/'+num+'?text='+encodeURIComponent(texto);}
function abrirEmNovaAba(el,texto){el.setAttribute('href',wa(texto));el.setAttribute('target','_blank');el.setAttribute('rel','noopener');}
if(num){
  var padrao=cfg.mensagemPadrao||'Olá! Vim pelo site da GESCOMP.';
  var ls=document.querySelectorAll('[data-whatsapp]');for(var i=0;i<ls.length;i++)abrirEmNovaAba(ls[i],padrao);
  // Cada card de serviço aponta para a sua mensagem em mensagensWhatsApp (data-whatsapp-msg).
  var msgs=cfg.mensagensWhatsApp||{}, cards=document.querySelectorAll('[data-whatsapp-msg]');
  for(var j=0;j<cards.length;j++){var k=cards[j].getAttribute('data-whatsapp-msg');abrirEmNovaAba(cards[j],(msgs[k]&&String(msgs[k]).trim())||padrao);}
}
var f=document.getElementById('form-contato');
if(!f)return;
f.addEventListener('submit',function(ev){
ev.preventDefault();
if(f.reportValidity&&!f.reportValidity())return;
function v(id){var e=document.getElementById(id);return e?e.value.trim():'';}
var texto='Olá! Vim pelo site da GESCOMP.\nNome: '+v('nome')+'\nTelefone: '+v('tel')+'\nAssunto: '+v('assunto')+(v('msg')?'\nMensagem: '+v('msg'):'');
var st=document.getElementById('form-status');
if(num){window.open(wa(texto),'_blank','noopener');if(st)st.textContent='Abrimos o WhatsApp com a sua mensagem. Se não abriu, toque no botão verde do WhatsApp.';}
else if(cfg.email){window.location.href='mailto:'+cfg.email+'?subject='+encodeURIComponent('Contato pelo site')+'&body='+encodeURIComponent(texto);}
else if(st){st.textContent='O contato pelo site ainda está sendo configurado. Use o telefone ou o e-mail ao lado.';}
});
})();


/* Carrossel genérico, usado pelos vídeos do Instagram e pelas avaliações.
   Marcação: [data-carrossel] com [data-carrossel-trilha] (os itens têm [data-slide]),
   [data-carrossel-anterior], [data-carrossel-proximo] e [data-carrossel-aviso] (aria-live).
   Passa sozinho a cada 8 s, com rolagem suave, e volta ao início no fim. Para com mouse em cima,
   foco de teclado, toque, aba escondida, "reduzir movimento" e enquanto houver uma trava
   (por exemplo, alguém assistindo a um vídeo). Opções: rotulo, intervalo, aoNavegar, aoSairMouse. */
function criarCarrossel(raiz,op){
  op=op||{};
  var trilha=raiz.querySelector('[data-carrossel-trilha]'); if(!trilha)return null;
  var ant=raiz.querySelector('[data-carrossel-anterior]'), prox=raiz.querySelector('[data-carrossel-proximo]'), aviso=raiz.querySelector('[data-carrossel-aviso]');
  var rotulo=op.rotulo||'Item', intervalo=op.intervalo||8000;
  var mq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  var mouse=false, foco=false, toque=false, travas={}, timer=null, tRolagem=null, tToque=null;
  function slides(){return trilha.querySelectorAll('[data-slide]');}
  function reduzir(){return !!(mq&&mq.matches);}
  function posicoes(s){var p=[],b=s[0].offsetLeft;for(var i=0;i<s.length;i++)p.push(s[i].offsetLeft-b);return p;}
  function maisPerto(p,x){var m=0;for(var i=1;i<p.length;i++)if(Math.abs(p[i]-x)<Math.abs(p[m]-x))m=i;return m;}
  function ir(d,manual){
    var s=slides(), n=s.length; if(n<2)return;
    var p=posicoes(s), max=trilha.scrollWidth-trilha.clientWidth, x=trilha.scrollLeft, i=maisPerto(p,x), alvo;
    if(d>0)alvo=x>=max-4?0:Math.min(p[Math.min(i+1,n-1)],max);
    else alvo=x<=4?max:Math.max(p[Math.max(i-1,0)],0);
    trilha.scrollTo({left:alvo,behavior:reduzir()?'auto':'smooth'});
    if(manual&&aviso)aviso.textContent=rotulo+' '+(maisPerto(p,alvo)+1)+' de '+n;
  }
  function parado(){
    if(reduzir()||slides().length<2||mouse||foco||toque||document.hidden)return true;
    for(var k in travas)if(travas[k])return true;
    return false;
  }
  function agendar(){clearTimeout(timer);timer=null;if(parado())return;timer=setTimeout(function(){timer=null;if(!parado())ir(1,false);agendar();},intervalo);}
  function travar(motivo,sim){if(sim)travas[motivo]=true;else delete travas[motivo];agendar();}
  // Setas só aparecem com mais de um item e quando nem todos cabem na tela.
  function atualizarSetas(){var ver=slides().length>1&&trilha.scrollWidth-trilha.clientWidth>4;if(ant)ant.hidden=!ver;if(prox)prox.hidden=!ver;}
  function navegar(d){if(op.aoNavegar)op.aoNavegar(d);ir(d,true);agendar();}
  raiz.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){mouse=true;agendar();}});
  raiz.addEventListener('pointerleave',function(e){if(e.pointerType!=='mouse')return;mouse=false;if(op.aoSairMouse)op.aoSairMouse();agendar();});
  raiz.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')return;toque=true;clearTimeout(tToque);agendar();});
  function soltarToque(e){if(e.pointerType==='mouse')return;clearTimeout(tToque);tToque=setTimeout(function(){toque=false;agendar();},6000);}
  raiz.addEventListener('pointerup',soltarToque);raiz.addEventListener('pointercancel',soltarToque);
  raiz.addEventListener('focusin',function(e){var t=e.target;if(t.tagName==='IFRAME')return;var teclado=true;try{teclado=t.matches(':focus-visible');}catch(x){}if(teclado){foco=true;agendar();}});
  raiz.addEventListener('focusout',function(e){if(!e.relatedTarget||!raiz.contains(e.relatedTarget)){foco=false;agendar();}});
  document.addEventListener('visibilitychange',agendar);
  if(mq&&mq.addEventListener)mq.addEventListener('change',agendar);
  trilha.addEventListener('scroll',function(){clearTimeout(tRolagem);tRolagem=setTimeout(agendar,150);},{passive:true});
  if(ant)ant.addEventListener('click',function(){navegar(-1);});
  if(prox)prox.addEventListener('click',function(){navegar(1);});
  trilha.addEventListener('keydown',function(e){if(e.target!==trilha)return;if(e.key==='ArrowRight'){e.preventDefault();navegar(1);}else if(e.key==='ArrowLeft'){e.preventDefault();navegar(-1);}});
  window.addEventListener('resize',atualizarSetas);
  atualizarSetas(); agendar();
  return {ir:ir,navegar:navegar,travar:travar,agendar:agendar,atualizarSetas:atualizarSetas,trilha:trilha,slides:slides};
}


/* Carrossel de vídeos do Instagram (links em /assets/js/config.js)
   Os embeds carregam sozinhos quando a seção chega perto da tela. Além das paradas do carrossel
   genérico, a passagem para enquanto alguém assiste a um vídeo. Embeds do Instagram são iframes
   de outro domínio: o play e o pause deles não são visíveis daqui, então "assistindo" é deduzido
   pelo foco no iframe. Vídeos próprios (.mp4/.webm) usam os eventos reais de play e pause. */
(function(){
var sec=document.getElementById('instagram'); if(!sec)return;
var cfg=window.GESCOMP_CONFIG||{};
var regiao=sec.querySelector('[data-carrossel]')||sec;
var trilha=sec.querySelector('[data-carrossel-trilha]'); if(!trilha)return;
var ATRASO_RETOMAR=3000, LIMITE_CARGA=20000;
var EMBED_JS='https://www.instagram.com/embed.js';
var temIO='IntersectionObserver' in window;
function limpar(u){var m=String(u||'').match(/instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(reels?|p|tv)\/([A-Za-z0-9_-]+)/i);if(!m)return null;var t=m[1].toLowerCase();if(t==='reels')t='reel';return 'https://www.instagram.com/'+t+'/'+m[2]+'/';}
function item(u){
  var t=String(u||'').trim();
  if(/\.(mp4|webm)(?:[?#].*)?$/i.test(t)){if(/^[a-z][a-z0-9+.-]*:/i.test(t)&&!/^https?:/i.test(t))return null;return {tipo:'video',url:t};}
  var l=limpar(t); return l?{tipo:'embed',url:l}:null;
}
var itens=(cfg.instagramReels||[]).map(item).filter(Boolean);
if(!itens.length){sec.hidden=true;return;}
var modelo=trilha.querySelector('[data-slide]'); if(!modelo)return;
var base=modelo.cloneNode(true); trilha.innerHTML='';
itens.forEach(function(it,i){
  var s=base.cloneNode(true); s.setAttribute('aria-label','Vídeo '+(i+1)+' de '+itens.length);
  var a=s.querySelector('[data-reel]'); if(a){a.setAttribute('href',it.url);a.setAttribute('aria-label','Assistir ao vídeo '+(i+1)+' da GESCOMP');}
  var n=s.querySelector('[data-numero]'); if(n)n.textContent='Vídeo '+(i+1);
  trilha.appendChild(s);
});
var lista=trilha.querySelectorAll('[data-slide]'), total=lista.length;

/* Assistindo: trava a passagem e a libera cerca de 3 s depois que a pessoa sai do vídeo */
var assistindo=null, tRetomar=null, vigia=null;
var car=criarCarrossel(regiao,{
  rotulo:'Vídeo',
  aoNavegar:function(){if(assistindo&&assistindo.tipo!=='video')retomar();},
  aoSairMouse:function(){if(assistindo&&assistindo.tipo!=='video')retomar();}
});
if(!car)return;
var ioSlide=temIO?new IntersectionObserver(function(es){for(var k=0;k<es.length;k++){if(assistindo&&es[k].target===assistindo.slide&&es[k].intersectionRatio<0.25)retomar();}},{threshold:[0,0.25]}):null;
function assistir(slide,tipo){
  clearTimeout(tRetomar);tRetomar=null;clearInterval(vigia);vigia=null;
  assistindo={slide:slide,tipo:tipo};
  if(ioSlide){ioSlide.disconnect();if(tipo!=='video')ioSlide.observe(slide);}
  if(tipo==='iframe')vigia=setInterval(conferirFoco,1000);
  car.travar('assistindo',true);
}
function retomar(){
  if(!assistindo||tRetomar)return;
  clearInterval(vigia);vigia=null;
  tRetomar=setTimeout(function(){tRetomar=null;assistindo=null;if(ioSlide)ioSlide.disconnect();car.travar('assistindo',false);},ATRASO_RETOMAR);
}
function iframeAtivo(){var a=document.activeElement;return a&&a.tagName==='IFRAME'&&regiao.contains(a)?a:null;}
function conferirFoco(){
  if(!assistindo||assistindo.tipo!=='iframe')return;
  var f=iframeAtivo();
  if(!f)retomar();
  else if(!assistindo.slide.contains(f)){var s=f.closest('[data-slide]');if(s)assistir(s,'iframe');}
}
// Clique dentro de um iframe do Instagram: a janela perde o foco para ele.
window.addEventListener('blur',function(){setTimeout(function(){var f=iframeAtivo();if(f){var s=f.closest('[data-slide]');if(s)assistir(s,'iframe');}},0);});
window.addEventListener('focus',function(){if(assistindo&&assistindo.tipo==='iframe')retomar();});
trilha.addEventListener('pointerdown',function(e){var s=e.target.closest?e.target.closest('[data-slide]'):null;if(s&&!s.querySelector('video'))assistir(s,'toque');});
document.addEventListener('pointerdown',function(e){if(assistindo&&assistindo.tipo!=='video'&&!regiao.contains(e.target))retomar();},true);

/* Embeds e vídeos próprios: montados quando a seção chega perto da tela */
var ioVideo=temIO?new IntersectionObserver(function(es){for(var k=0;k<es.length;k++){if(es[k].intersectionRatio<0.25){var v=es[k].target.querySelector('video');if(v&&!v.paused)v.pause();}}},{root:trilha,threshold:[0,0.25]}):null;
function tirarCapa(capa){if(capa&&capa.parentNode)capa.parentNode.removeChild(capa);}
function falhar(s,tipo){
  var capa=s.querySelector('[data-reel]'); if(!capa)return;
  var c=s.querySelector('.ig-midia'); if(c)c.parentNode.removeChild(c);
  capa.classList.remove('ig-capa');capa.removeAttribute('aria-hidden');capa.removeAttribute('tabindex');
  var tx=capa.querySelector('[data-capa-texto]'); if(tx)tx.textContent=tipo==='embed'?'Toque para assistir no Instagram':'Toque para assistir';
}
// Se o Instagram demorar (rede lenta, aba em segundo plano), a capa vira um link provisório
// para o Reel; o iframe continua sendo observado e substitui a capa assim que fica pronto.
function liberarCapa(capa){
  if(!capa||!capa.parentNode)return;
  capa.classList.add('livre');capa.removeAttribute('aria-hidden');capa.removeAttribute('tabindex');
  var tx=capa.querySelector('[data-capa-texto]'); if(tx)tx.textContent='Toque para assistir no Instagram';
}
function vigiarIframe(s,caixa,capa,n){
  var pararAltura=null, pronto=false;
  var limite=setTimeout(function(){if(!pronto)liberarCapa(capa);},LIMITE_CARGA);
  var mo=new MutationObserver(function(){
    var f=caixa.querySelector('iframe'); if(!f)return; mo.disconnect();
    if(!f.getAttribute('title'))f.setAttribute('title','Vídeo '+n+' da GESCOMP no Instagram');
    f.addEventListener('load',function(){
      if(pronto)return;
      if(pararAltura)pararAltura();
      pararAltura=esperarAltura(f,function(){
        if(pronto)return;
        pronto=true;clearTimeout(limite);caixa.classList.add('pronto');tirarCapa(capa);
      });
    });
  });
  mo.observe(caixa,{childList:true,subtree:true});
}
// O Instagram ajusta a altura do iframe depois do "load"; a capa só sai quando ele já tem tamanho de vídeo.
function esperarAltura(f,feito){
  if(f.offsetHeight>=200){feito();return function(){};}
  if(!window.ResizeObserver){var timer=setInterval(function(){if(f.offsetHeight>=200){clearInterval(timer);feito();}},500);return function(){clearInterval(timer);};}
  var ro=new ResizeObserver(function(){if(f.offsetHeight>=200){ro.disconnect();feito();}});
  ro.observe(f);
  return function(){ro.disconnect();};
}
function montarVideo(s,caixa,capa,it,n){
  var v=document.createElement('video');
  v.controls=true;v.setAttribute('playsinline','');v.preload='metadata';v.src=it.url;v.setAttribute('aria-label','Vídeo '+n+' da GESCOMP');
  caixa.classList.add('video');caixa.appendChild(v);
  v.addEventListener('loadedmetadata',function(){tirarCapa(capa);});
  v.addEventListener('error',function(){falhar(s,'video');});
  v.addEventListener('play',function(){assistir(s,'video');});
  function parou(){if(assistindo&&assistindo.slide===s)retomar();}
  v.addEventListener('pause',parou);v.addEventListener('ended',parou);
  if(ioVideo)ioVideo.observe(s);
}
function montarEmbed(s,caixa,capa,it,n){
  var b=document.createElement('blockquote');
  b.className='instagram-media';
  b.setAttribute('data-instgrm-permalink',it.url+'?utm_source=ig_embed&utm_campaign=loading');
  b.setAttribute('data-instgrm-version','14');
  b.style.cssText='background:#FFF;border:0;margin:0;padding:0;width:100%;';
  var l=document.createElement('a'); l.href=it.url; l.target='_blank'; l.rel='noopener'; l.textContent='Ver o vídeo '+n+' no Instagram';
  b.appendChild(l); caixa.appendChild(b);
  vigiarIframe(s,caixa,capa,n);
}
function processar(){if(window.instgrm&&window.instgrm.Embeds)window.instgrm.Embeds.process();}
function carregarEmbedJs(){
  if(window.instgrm&&window.instgrm.Embeds){processar();return;}
  var ja=document.querySelector('script[src="'+EMBED_JS+'"]'); if(ja){ja.addEventListener('load',processar);return;}
  var sc=document.createElement('script'); sc.async=true; sc.src=EMBED_JS;
  sc.onload=processar;
  sc.onerror=function(){for(var i=0;i<total;i++)if(itens[i]&&itens[i].tipo==='embed')falhar(lista[i],'embed');};
  document.body.appendChild(sc);
}
var montado=false;
function montar(){
  if(montado)return; montado=true;
  var precisaEmbed=false;
  for(var i=0;i<total;i++){
    var s=lista[i], it=itens[i], capa=s.querySelector('[data-reel]'); if(!it)continue;
    var caixa=document.createElement('div'); caixa.className='ig-midia';
    if(capa){
      capa.classList.add('ig-capa');capa.setAttribute('aria-hidden','true');capa.setAttribute('tabindex','-1');
      var tx=capa.querySelector('[data-capa-texto]'); if(tx)tx.textContent='Carregando o vídeo…';
    }
    s.insertBefore(caixa,capa||s.firstChild);
    if(it.tipo==='video')montarVideo(s,caixa,capa,it,i+1);
    else{montarEmbed(s,caixa,capa,it,i+1);precisaEmbed=true;}
  }
  if(precisaEmbed)carregarEmbedJs();
}
if(temIO){var ioSec=new IntersectionObserver(function(es){for(var k=0;k<es.length;k++)if(es[k].isIntersecting){ioSec.disconnect();montar();return;}},{rootMargin:'400px 0px'});ioSec.observe(sec);}
else montar();
})();


/* Avaliações de clientes (dados em /assets/js/config.js, objeto "avaliacoes")
   A seção só aparece quando a lista "itens" tem pelo menos uma avaliação com texto. */
(function(){
var sec=document.getElementById('avaliacoes'); if(!sec)return;
var cfg=(window.GESCOMP_CONFIG||{}).avaliacoes||{};
var itens=(cfg.itens||[]).filter(function(a){return a&&String(a.texto||'').trim();});
if(!itens.length)return;
var regiao=sec.querySelector('[data-carrossel]'), trilha=sec.querySelector('[data-carrossel-trilha]'); if(!regiao||!trilha)return;
function linkValido(u){u=String(u||'').trim();return /^https:\/\//i.test(u)?u:'';}
// Primeiro nome e inicial do último sobrenome: "Maria da Silva" vira "Maria S.".
function nomeCurto(n){var p=String(n||'').trim().split(/\s+/).filter(Boolean);if(!p.length)return 'Cliente';if(p.length===1)return p[0];return p[0]+' '+p[p.length-1].charAt(0).toUpperCase()+'.';}
function el(tag,classe,texto){var e=document.createElement(tag);if(classe)e.className=classe;if(texto!=null)e.textContent=texto;return e;}
itens.forEach(function(a,i){
  var n=Math.round(Number(a.estrelas)); if(!(n>=1&&n<=5))n=5;
  var card=el('div','avaliacao-card');
  card.setAttribute('data-slide','');card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');
  card.setAttribute('aria-label','Avaliação '+(i+1)+' de '+itens.length);
  var est=el('p','avaliacao-estrelas'), vis=el('span');vis.setAttribute('aria-hidden','true');
  for(var k=1;k<=5;k++){var s=el('span',k>n?'apagada':'','★');vis.appendChild(s);}
  est.appendChild(vis);est.appendChild(el('span','so-leitor',n+' de 5 estrelas'));
  var bq=el('blockquote');bq.style.margin='0';bq.appendChild(el('p','avaliacao-texto',String(a.texto).trim()));
  card.appendChild(est);card.appendChild(bq);card.appendChild(el('p','avaliacao-autor',nomeCurto(a.nome)));
  trilha.appendChild(card);
});
// Resumo "Nota 4,9 no Google, 37 avaliações": só com nota e total preenchidos.
var nota=parseFloat(String(cfg.nota==null?'':cfg.nota).replace(',','.')), qtd=parseInt(cfg.total,10);
var resumo=sec.querySelector('[data-avaliacoes-resumo]');
if(resumo&&nota>0&&nota<=5&&qtd>0){resumo.textContent='Nota '+nota.toFixed(1).replace('.',',')+' no Google, '+qtd+(qtd===1?' avaliação':' avaliações');resumo.hidden=false;}
var avaliar=sec.querySelector('[data-avaliacoes-avaliar]'), ver=sec.querySelector('[data-avaliacoes-ver]');
if(avaliar&&linkValido(cfg.linkAvaliar)){avaliar.href=linkValido(cfg.linkAvaliar);avaliar.hidden=false;}
if(ver&&linkValido(cfg.linkVerTodas)){ver.href=linkValido(cfg.linkVerTodas);ver.hidden=false;}
sec.hidden=false;
criarCarrossel(regiao,{rotulo:'Avaliação'});
})();
