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
var displayFab=fab?fab.style.display:'';
function sobrepoe(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
function atualizarFab(){var rolou=(window.scrollY||0)>640;var noContato=false;
if(contato){var r=contato.getBoundingClientRect();noContato=r.top<window.innerHeight*0.7&&r.bottom>0;}
var areas=document.querySelectorAll('#inicio .abertura-imagem,#inicio .selo,#instagram [data-carrossel],#avaliacoes [data-carrossel],#form-contato');
function cobre(el){if(!el||!mq.matches)return false;var b=el.getBoundingClientRect();for(var n=0;n<areas.length;n++){var a=areas[n];if(a.getClientRects().length&&sobrepoe(b,a.getBoundingClientRect()))return true;}return false;}
if(fab){fab.classList.remove('oculto');fab.style.display=displayFab;var ocultar=!rolou||noContato||cobre(fab);if(document.activeElement!==fab){fab.classList.toggle('oculto',ocultar);fab.style.display=ocultar?'none':displayFab;}}
// Oculta apenas o lançador fechado do VLibras se ele cobrir controles; o painel aberto permanece utilizável.
var widget=window.VLibrasWidget,acesso=widget&&widget.access;
if(acesso){var raizWidget=acesso.getRootNode();var focado=acesso.contains(document.activeElement)||acesso.contains(raizWidget.activeElement);var ocultarLibras=cobre(acesso)&&!focado;var visibilidade=ocultarLibras?'hidden':'',ponteiro=ocultarLibras?'none':'';if(acesso.style.visibility!==visibilidade)acesso.style.visibility=visibilidade;if(acesso.style.pointerEvents!==ponteiro)acesso.style.pointerEvents=ponteiro;}
}
var quadroFab=null;
function agendarFab(){if(quadroFab!==null)return;quadroFab=requestAnimationFrame(function(){quadroFab=null;atualizarFab();});}
window.addEventListener('scroll',agendarFab,{passive:true});
window.addEventListener('resize',function(){agendarFab();if(!mq.matches)menu(false);});
// O serviço monta e posiciona o lançador em etapas; recalcular também quando seu estilo ou tamanho chegar.
function observarAcessoLibras(){var w=window.VLibrasWidget,a=w&&w.access;if(!a)return false;if(window.ResizeObserver)new ResizeObserver(agendarFab).observe(a);if(window.MutationObserver)new MutationObserver(agendarFab).observe(a,{attributes:true,attributeFilter:['style','class']});agendarFab();return true;}
if(!observarAcessoLibras()&&window.MutationObserver){var ioLibras=new MutationObserver(function(){if(observarAcessoLibras())ioLibras.disconnect();});ioLibras.observe(document.body,{childList:true});setTimeout(function(){ioLibras.disconnect();},15000);}
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
function abrirEmNovaAba(el,texto){el.setAttribute('href',wa(texto));el.setAttribute('target','_blank');el.setAttribute('rel','noopener');if(el.hasAttribute('data-whatsapp-msg'))el.removeAttribute('aria-label');
// O aviso acompanha o destino real: sem WhatsApp configurado, o link continua sendo âncora de contato.
var aviso=el.querySelector('[data-whatsapp-aviso]');if(aviso)aviso.hidden=false;
}
if(num){
  var padrao=cfg.mensagemPadrao||'Olá! Vim pelo site da GESCOMP.';
  var ls=document.querySelectorAll('[data-whatsapp],.gc-cabecalho-contato,a.btn[href="#contato"]');for(var i=0;i<ls.length;i++)abrirEmNovaAba(ls[i],padrao);
  // Cada card de serviço aponta para a sua mensagem em mensagensWhatsApp (data-whatsapp-msg).
  var msgs=cfg.mensagensWhatsApp||{}, cards=document.querySelectorAll('[data-whatsapp-msg]');
  for(var j=0;j<cards.length;j++){var k=cards[j].getAttribute('data-whatsapp-msg');abrirEmNovaAba(cards[j],(msgs[k]&&String(msgs[k]).trim())||padrao);}
}
var f=document.getElementById('form-contato');
if(!f)return;
var telefone=f.querySelector('#tel');if(telefone)telefone.required=false;
f.addEventListener('submit',function(ev){
ev.preventDefault();
if(f.reportValidity&&!f.reportValidity())return;
function v(id){var e=document.getElementById(id);return e?e.value.trim():'';}
var texto=(cfg.mensagemPadrao||'Olá! Vim pelo site da GESCOMP.')+'\nNome: '+v('nome')+'\nAssunto: '+v('assunto')+(v('tel')?'\nTelefone: '+v('tel'):'')+(v('msg')?'\nMensagem: '+v('msg'):'');
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
  var mouse=false, foco=false, toque=false, visivel=!('IntersectionObserver' in window), travas={}, timer=null, tRolagem=null, tToque=null;
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
    if(reduzir()||!visivel||slides().length<2||trilha.scrollWidth-trilha.clientWidth<=4||mouse||foco||toque||document.hidden)return true;
    for(var k in travas)if(travas[k])return true;
    return false;
  }
  function agendar(){clearTimeout(timer);timer=null;if(parado())return;timer=setTimeout(function(){timer=null;if(!parado())ir(1,false);agendar();},intervalo);}
  function travar(motivo,sim){if(sim)travas[motivo]=true;else delete travas[motivo];agendar();}
  // Setas só aparecem com mais de um item e quando nem todos cabem na tela.
  function atualizarSetas(){var ver=slides().length>1&&trilha.scrollWidth-trilha.clientWidth>4;if(ant)ant.hidden=!ver;if(prox)prox.hidden=!ver;agendar();}
  function navegar(d){if(op.aoNavegar)op.aoNavegar(d);ir(d,true);agendar();}
  raiz.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){mouse=true;agendar();}});
  raiz.addEventListener('pointerleave',function(e){if(e.pointerType!=='mouse')return;mouse=false;if(op.aoSairMouse)op.aoSairMouse();agendar();});
  raiz.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'){foco=false;agendar();return;}toque=true;clearTimeout(tToque);agendar();});
  function soltarToque(e){if(e.pointerType==='mouse')return;clearTimeout(tToque);tToque=setTimeout(function(){toque=false;agendar();},6000);}
  window.addEventListener('pointerup',function(e){if(toque)soltarToque(e);});window.addEventListener('pointercancel',function(e){if(toque)soltarToque(e);});
  raiz.addEventListener('focusin',function(e){foco=e.target.tagName==='IFRAME'||e.target.matches(':focus-visible');agendar();});
  raiz.addEventListener('keydown',function(){foco=true;agendar();});
  raiz.addEventListener('focusout',function(e){if(!e.relatedTarget||!raiz.contains(e.relatedTarget)){foco=false;agendar();}});
  document.addEventListener('visibilitychange',agendar);
  if(mq&&mq.addEventListener)mq.addEventListener('change',agendar);
  trilha.addEventListener('scroll',function(){clearTimeout(tRolagem);tRolagem=setTimeout(agendar,150);},{passive:true});
  if(ant)ant.addEventListener('click',function(){navegar(-1);});
  if(prox)prox.addEventListener('click',function(){navegar(1);});
  trilha.addEventListener('keydown',function(e){if(e.target!==trilha)return;if(e.key==='ArrowRight'){e.preventDefault();navegar(1);}else if(e.key==='ArrowLeft'){e.preventDefault();navegar(-1);}});
  window.addEventListener('resize',atualizarSetas);
  if(window.ResizeObserver)new ResizeObserver(atualizarSetas).observe(trilha);
  if(window.IntersectionObserver){var ioCarrossel=new IntersectionObserver(function(es){visivel=es.some(function(e){return e.isIntersecting;});agendar();});ioCarrossel.observe(raiz);}
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
function limpar(u){try{var url=new URL(String(u||'').trim());if(!/^https?:$/.test(url.protocol)||!/^(www\.)?instagram\.com$/i.test(url.hostname))return null;var m=url.pathname.match(/^\/(?:[A-Za-z0-9_.]+\/)?(reels?|p|tv)\/([A-Za-z0-9_-]+)\/?$/i);if(!m)return null;var t=m[1].toLowerCase();if(t==='reels')t='reel';return 'https://www.instagram.com/'+t+'/'+m[2]+'/';}catch(e){return null;}}
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
  var a=s.querySelector('[data-reel]'); if(a){a.setAttribute('href',it.url);a.removeAttribute('aria-label');}
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
trilha.addEventListener('focusin',function(e){if(e.target.tagName==='IFRAME'){var s=e.target.closest('[data-slide]');if(s)assistir(s,'iframe');}});
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
sec.hidden=true;
var itens=(Array.isArray(cfg.itens)?cfg.itens:[]).filter(function(a){var n=a&&Number(a.estrelas);return a&&String(a.nome||'').trim()&&String(a.texto||'').trim()&&n>=1&&n<=5&&Math.floor(n)===n;});
if(!itens.length)return;
var regiao=sec.querySelector('[data-carrossel]'), trilha=sec.querySelector('[data-carrossel-trilha]'); if(!regiao||!trilha)return;
function linkValido(u){try{var url=new URL(String(u||'').trim());return url.protocol==='https:'&&!url.username&&!url.password&&(/(^|\.)google\.com(?:\.br)?$/i.test(url.hostname)||/^(g\.page|maps\.app\.goo\.gl|goo\.gl)$/i.test(url.hostname))?url.href:'';}catch(e){return '';}}
// Primeiro nome e inicial do último sobrenome: "Maria da Silva" vira "Maria S.".
function nomeCurto(n){var p=String(n||'').trim().split(/\s+/).filter(Boolean);if(!p.length)return 'Cliente';if(p.length===1)return p[0];return p[0]+' '+p[p.length-1].charAt(0).toUpperCase()+'.';}
function el(tag,classe,texto){var e=document.createElement(tag);if(classe)e.className=classe;if(texto!=null)e.textContent=texto;return e;}
itens.forEach(function(a,i){
  var n=Number(a.estrelas);
  var card=el('div','avaliacao-card');
  card.setAttribute('data-slide','');card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');
  card.setAttribute('aria-label','Avaliação '+(i+1)+' de '+itens.length);
  var est=el('p','avaliacao-estrelas'), vis=el('span');vis.setAttribute('aria-hidden','true');
  for(var k=1;k<=5;k++){var s=el('span',k>n?'apagada':'','★');vis.appendChild(s);}
  est.appendChild(vis);est.appendChild(el('span','so-leitor',n+' de 5 estrelas'));
  var bq=el('blockquote');bq.style.margin='0';bq.appendChild(el('p','avaliacao-texto',String(a.texto).trim()));
  card.appendChild(est);card.appendChild(bq);card.appendChild(el('p','avaliacao-autor',nomeCurto(a.nome)));
  if(linkValido(a.link)){var link=el('a','avaliacao-link','Ver avaliação no Google');link.href=linkValido(a.link);link.target='_blank';link.rel='noopener';link.appendChild(el('span','so-leitor',' (abre em nova aba)'));card.appendChild(link);}
  trilha.appendChild(card);
});
// Resumo "Nota 4,9 no Google, 37 avaliações": só com nota e total preenchidos.
var nota=Number(String(cfg.nota==null?'':cfg.nota).replace(',','.')), qtd=Number(cfg.total);
var resumo=sec.querySelector('[data-avaliacoes-resumo]');
if(resumo&&nota>0&&nota<=5&&qtd>0&&Math.floor(qtd)===qtd){resumo.textContent='Nota '+nota.toFixed(1).replace('.',',')+' no Google, '+qtd+(qtd===1?' avaliação':' avaliações');resumo.hidden=false;}
var avaliar=sec.querySelector('[data-avaliacoes-avaliar]'), ver=sec.querySelector('[data-avaliacoes-ver]');
if(avaliar&&linkValido(cfg.linkAvaliar)){avaliar.href=linkValido(cfg.linkAvaliar);avaliar.hidden=false;}
if(ver&&linkValido(cfg.linkVerTodas)){ver.href=linkValido(cfg.linkVerTodas);ver.hidden=false;}
sec.hidden=false;
criarCarrossel(regiao,{rotulo:'Avaliação'});
})();

/* Fotos liberadas pela configuração; imagens ausentes mantêm a arte de espera sem pedido HTTP. */
(function(){
var cfg=window.GESCOMP_CONFIG||{},fotos=Array.isArray(cfg.fotos)?cfg.fotos:[];
var molduras=document.querySelectorAll('[data-foto]');
for(var i=0;i<molduras.length;i++)(function(moldura){
var caminho=moldura.getAttribute('data-foto');
if(moldura.closest('#rio')||fotos.indexOf(caminho)<0||!/^\/assets\/img\/fotos\/[A-Za-z0-9._-]+\.webp$/.test(caminho))return;
var img=document.createElement('img');img.alt=moldura.getAttribute('data-foto-alt')||'';img.decoding='async';img.loading=moldura.closest('#inicio')?'eager':'lazy';img.style.visibility='hidden';
img.addEventListener('load',function(){img.style.visibility='';moldura.classList.add('tem-foto');});
img.addEventListener('error',function(){img.remove();moldura.classList.remove('tem-foto');});
img.src=caminho;moldura.appendChild(img);
})(molduras[i]);
})();

/* Revelação opcional, uma vez só. Claude aplica data-revelar e o CSS de até 400 ms.
   A seção do rio é excluída mesmo se o atributo for aplicado por engano. */
(function(){
var elementos=document.querySelectorAll('[data-revelar]');
var mq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
var io;
function mostrarTodos(){if(io)io.disconnect();for(var i=0;i<elementos.length;i++)elementos[i].classList.add('revelado');}
if(!window.IntersectionObserver||(mq&&mq.matches)){mostrarTodos();return;}
io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++)if(es[i].isIntersecting){es[i].target.classList.add('revelado');io.unobserve(es[i].target);}},{threshold:0.1});
for(var i=0;i<elementos.length;i++){var el=elementos[i];if(el.closest('#rio')||el.querySelector('#rio'))el.classList.add('revelado');else{el.classList.add('revelar-pronto');io.observe(el);}}
if(elementos.length)document.documentElement.classList.add('js-revelar');
if(mq&&mq.addEventListener)mq.addEventListener('change',function(){if(mq.matches)mostrarTodos();});
})();
