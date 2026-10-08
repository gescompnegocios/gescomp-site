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
// Links internos param abaixo do cabeçalho fixo: --cabecalho (CSS) acompanha a altura real. Com o menu aberto o cabeçalho cresce, então não mede.
var cabecalho=document.querySelector('.gc-cabecalho');
function medirCabecalho(){if(cabecalho&&(!mm||mm.hidden)){var a=Math.round(cabecalho.getBoundingClientRect().height);if(a>0)raiz.style.setProperty('--cabecalho',a+'px');}}
requestAnimationFrame(medirCabecalho);
var mq=window.matchMedia('(max-width: 779px)');
var fab=document.getElementById('fab');
var displayFab=fab?fab.style.display:'';
function sobrepoe(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
function atualizarFab(){
var areas=document.querySelectorAll('#inicio .abertura-imagem,#inicio .selo,#instagram [data-carrossel],#avaliacoes [data-carrossel],#form-contato');
function cobre(el){if(!el||!mq.matches)return false;var b=el.getBoundingClientRect();for(var n=0;n<areas.length;n++){var a=areas[n];if(a.getClientRects().length&&sobrepoe(b,a.getBoundingClientRect()))return true;}return false;}
if(fab){fab.classList.remove('oculto');fab.style.display=displayFab;var ocultar=cobre(fab);if(document.activeElement!==fab){fab.classList.toggle('oculto',ocultar);fab.style.display=ocultar?'none':displayFab;}}
// Oculta apenas o lançador fechado do VLibras se ele cobrir controles; o painel aberto permanece utilizável.
var widget=window.VLibrasWidget,acesso=widget&&widget.access;
if(acesso){var raizWidget=acesso.getRootNode();var focado=acesso.contains(document.activeElement)||acesso.contains(raizWidget.activeElement);var ocultarLibras=cobre(acesso)&&!focado;var visibilidade=ocultarLibras?'hidden':'',ponteiro=ocultarLibras?'none':'';if(acesso.style.visibility!==visibilidade)acesso.style.visibility=visibilidade;if(acesso.style.pointerEvents!==ponteiro)acesso.style.pointerEvents=ponteiro;}
}
var quadroFab=null;
function agendarFab(){if(quadroFab!==null)return;quadroFab=requestAnimationFrame(function(){quadroFab=null;atualizarFab();});}
window.addEventListener('scroll',agendarFab,{passive:true});
window.addEventListener('resize',function(){agendarFab();if(!mq.matches)menu(false);requestAnimationFrame(medirCabecalho);});
// O serviço monta e posiciona o lançador em etapas; recalcular também quando seu estilo ou tamanho chegar.
function observarAcessoLibras(){var w=window.VLibrasWidget,a=w&&w.access;if(!a)return false;if(window.ResizeObserver)new ResizeObserver(agendarFab).observe(a);if(window.MutationObserver)new MutationObserver(agendarFab).observe(a,{attributes:true,attributeFilter:['style','class']});agendarFab();return true;}
if(!observarAcessoLibras()&&window.MutationObserver){var ioLibras=new MutationObserver(function(){if(observarAcessoLibras())ioLibras.disconnect();});ioLibras.observe(document.body,{childList:true});setTimeout(function(){ioLibras.disconnect();},30000);}
// A primeira medição espera o próximo quadro: lê o layout uma vez, depois de todas as montagens abaixo, em vez de forçá-lo aqui.
agendarFab();
if(reduzir){var svgs=document.querySelectorAll('svg:not(.rio-cena)');for(var k=0;k<svgs.length;k++){if(svgs[k].pauseAnimations)svgs[k].pauseAnimations();}return;}
var nums=document.querySelectorAll('[data-contador]'),pinceis=document.querySelectorAll('.pincel-numero'),secao=document.getElementById('numeros');
function fmt(n){return Math.round(n).toLocaleString('pt-BR');}
function desenhar(p){for(var a=0;a<nums.length;a++){var el=nums[a];el.textContent=el.getAttribute('data-prefixo')+fmt(parseFloat(el.getAttribute('data-contador'))*p);}
for(var b=0;b<pinceis.length;b++)pinceis[b].setAttribute('stroke-dashoffset',String(100-100*p));}
if(!secao||!('IntersectionObserver' in window))return;
desenhar(0);
var io=new IntersectionObserver(function(es){for(var c=0;c<es.length;c++){if(es[c].isIntersecting){io.disconnect();var t0=null;
function passo(t){if(t0===null)t0=t;var x=Math.min(1,(t-t0)/1600);desenhar(1-Math.pow(1-x,3));if(x<1)requestAnimationFrame(passo);}
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
   (por exemplo, alguém assistindo a um vídeo). Avaliações usam continuo/velocidade para um ciclo
   fluido com os mesmos cards, sem cópias. somenteAutomatico ignora navegação e interações
   do visitante. Opções: rotulo, intervalo, aoNavegar, aoSairMouse. */
function criarCarrossel(raiz,op){
  op=op||{};
  var trilha=raiz.querySelector('[data-carrossel-trilha]'); if(!trilha)return null;
  var ant=raiz.querySelector('[data-carrossel-anterior]'), prox=raiz.querySelector('[data-carrossel-proximo]'), aviso=raiz.querySelector('[data-carrossel-aviso]');
  var rotulo=op.rotulo||'Item', intervalo=op.intervalo||8000, somenteAutomatico=!!op.somenteAutomatico;
  raiz.classList.toggle('carrossel-somente-automatico',somenteAutomatico);
  var mq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  var mqSetas=op.ocultarSetasNoCelular&&window.matchMedia?window.matchMedia('(max-width:779px), (hover:none) and (pointer:coarse)'):null;
  var mouse=false, foco=false, toque=false, visivel=!('IntersectionObserver' in window), travas={}, timer=null, tRolagem=null, tToque=null;
  var quadro=null, instante=0, posicao=0, circular=false;
  function passo(){var s=slides();return s.length>1?s[1].offsetLeft-s[0].offsetLeft:0;}
  // Reutiliza os próprios cards: não duplica textos, links ou paradas de teclado.
  function moverInicio(){var p=passo();trilha.appendChild(trilha.firstElementChild);trilha.scrollLeft-=p;posicao-=p;}
  function reservarAnterior(){var p=passo();trilha.insertBefore(trilha.lastElementChild,trilha.firstElementChild);trilha.scrollLeft+=p;posicao=trilha.scrollLeft;}
  // A rolagem do navegador só anda em pixels inteiros (aos trancos em velocidade baixa);
  // a fração restante vai para --desliza (translate dos cards), para deslizar como um dedo.
  function deslizar(f){trilha.style.setProperty('--desliza',f?f.toFixed(3)+'px':'0px');}
  function animar(t){
    quadro=null;if(parado())return;
    if(instante)posicao+=(Math.min(t-instante,64)/1000)*(op.velocidade||24);
    instante=t;
    if(posicao>=passo()&&passo()>0)moverInicio();
    trilha.scrollLeft=Math.floor(posicao);deslizar(trilha.scrollLeft-posicao);
    quadro=requestAnimationFrame(animar);
  }
  function slides(){return trilha.querySelectorAll('[data-slide]');}
  function reduzir(){return !!(mq&&mq.matches);}
  function posicoes(s){var p=[],b=s[0].offsetLeft;for(var i=0;i<s.length;i++)p.push(s[i].offsetLeft-b);return p;}
  function maisPerto(p,x){var m=0;for(var i=1;i<p.length;i++)if(Math.abs(p[i]-x)<Math.abs(p[m]-x))m=i;return m;}
  function ir(d,manual){
    if(somenteAutomatico&&manual)return;
    var s=slides(), n=s.length; if(n<2)return;
    if(circular){
      if(d<0&&trilha.scrollLeft<passo()){reservarAnterior();s=slides();}
      if(d>0&&trilha.scrollLeft+passo()>trilha.scrollWidth-trilha.clientWidth){moverInicio();s=slides();}
    }
    var p=posicoes(s), max=trilha.scrollWidth-trilha.clientWidth, x=trilha.scrollLeft, i=maisPerto(p,x), alvo;
    if(d>0)alvo=x>=max-4?0:Math.min(p[Math.min(i+1,n-1)],max);
    else alvo=x<=4?max:Math.max(p[Math.max(i-1,0)],0);
    trilha.scrollTo({left:alvo,behavior:reduzir()?'auto':'smooth'});
    if(manual&&aviso)aviso.textContent=s[maisPerto(p,alvo)].getAttribute('aria-label')||rotulo+' '+(maisPerto(p,alvo)+1)+' de '+n;
  }
  function parado(){
    if(reduzir()||!visivel||slides().length<2||trilha.scrollWidth-trilha.clientWidth<=4||document.hidden)return true;
    if(!somenteAutomatico&&(mouse||foco||toque))return true;
    for(var k in travas)if(travas[k])return true;
    return false;
  }
  function agendar(){
    clearTimeout(timer);timer=null;cancelAnimationFrame(quadro);quadro=null;instante=0;
    // Mantém a fração ao retomar; se a pessoa rolou (dedo, setas), parte do ponto em que ela deixou.
    if(!somenteAutomatico&&Math.floor(posicao)!==trilha.scrollLeft)posicao=trilha.scrollLeft;deslizar(Math.floor(posicao)-posicao);
    if(parado())return;
    if(circular){quadro=requestAnimationFrame(animar);return;}
    timer=setTimeout(function(){timer=null;if(!parado())ir(1,false);agendar();},intervalo);
  }
  function travar(motivo,sim){if(sim)travas[motivo]=true;else delete travas[motivo];agendar();}
  // Setas só aparecem com mais de um item e quando nem todos cabem na tela.
  function atualizarSetas(){var excedente=trilha.scrollWidth-trilha.clientWidth;var celular=mqSetas&&mqSetas.matches;var ver=!somenteAutomatico&&!celular&&slides().length>1&&excedente>4;circular=!!op.continuo&&slides().length>2&&excedente>=passo();raiz.classList.toggle('carrossel-continuo',circular);if(ant)ant.hidden=!ver;if(prox)prox.hidden=!ver;agendar();}
  function navegar(d){if(somenteAutomatico)return;if(op.aoNavegar)op.aoNavegar(d);if(circular)travar('navegacao',true);ir(d,true);if(circular)setTimeout(function(){travar('navegacao',false);},1000);else agendar();}
  if(!somenteAutomatico){
  raiz.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){mouse=true;agendar();}});
  raiz.addEventListener('pointerleave',function(e){if(e.pointerType!=='mouse')return;mouse=false;if(op.aoSairMouse)op.aoSairMouse();agendar();});
  raiz.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'){foco=false;agendar();return;}toque=true;clearTimeout(tToque);agendar();if(circular&&trilha.contains(e.target)&&trilha.scrollLeft<passo())reservarAnterior();});
  trilha.addEventListener('wheel',function(e){if(circular&&e.deltaX<0&&trilha.scrollLeft<passo())reservarAnterior();},{passive:true});
  function soltarToque(e){if(e.pointerType==='mouse')return;clearTimeout(tToque);tToque=setTimeout(function(){toque=false;agendar();},6000);}
  window.addEventListener('pointerup',function(e){if(toque)soltarToque(e);});window.addEventListener('pointercancel',function(e){if(toque)soltarToque(e);});
  raiz.addEventListener('focusin',function(e){foco=e.target.tagName==='IFRAME'||e.target.matches(':focus-visible');agendar();});
  raiz.addEventListener('keydown',function(){foco=true;agendar();});
  raiz.addEventListener('focusout',function(e){if(!e.relatedTarget||!raiz.contains(e.relatedTarget)){foco=false;agendar();}});
  }
  document.addEventListener('visibilitychange',agendar);
  if(mq&&mq.addEventListener)mq.addEventListener('change',agendar);
  if(somenteAutomatico){
    // O navegador pode rolar ao focar um link fora da faixa. Repõe a posição
    // antes da pintura, sem pausar, reiniciar ou alterar a fase da animação.
    function manterPosicao(){if(circular&&trilha.scrollLeft!==Math.floor(posicao))trilha.scrollLeft=Math.floor(posicao);}
    trilha.addEventListener('scroll',manterPosicao,{passive:true});
    raiz.addEventListener('focusin',function(){Promise.resolve().then(manterPosicao);});
  }else trilha.addEventListener('scroll',function(){clearTimeout(tRolagem);tRolagem=setTimeout(agendar,150);},{passive:true});
  if(ant)ant.addEventListener('click',function(){navegar(-1);});
  if(prox)prox.addEventListener('click',function(){navegar(1);});
  if(!somenteAutomatico)trilha.addEventListener('keydown',function(e){if(e.target!==trilha)return;if(e.key==='ArrowRight'){e.preventDefault();navegar(1);}else if(e.key==='ArrowLeft'){e.preventDefault();navegar(-1);}});
  window.addEventListener('resize',atualizarSetas);
  if(mqSetas&&mqSetas.addEventListener)mqSetas.addEventListener('change',atualizarSetas);
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
  ocultarSetasNoCelular:true,
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
function vigiarIframe(s,caixa,capa,n,fim){
  var pararAltura=null, pronto=false, f=null, carregado=false, montado=false;
  var limite=setTimeout(function(){if(!pronto)liberarCapa(capa);},LIMITE_CARGA);
  function revelar(){
    if(pronto||!carregado||!montado||!f||f.offsetHeight<200)return;
    pronto=true;clearTimeout(limite);if(pararAltura)pararAltura();if(fim)fim(true);
    window.removeEventListener('message',mensagem);
    // MOUNTED confirma a montagem da Meta; duas pinturas mantêm a capa durante a troca.
    requestAnimationFrame(function(){requestAnimationFrame(function(){caixa.classList.add('pronto');tirarCapa(capa);});});
  }
  function mensagem(ev){
    if(ev.origin!=='https://www.instagram.com'||!f||ev.source!==f.contentWindow)return;
    var dado=ev.data;if(typeof dado==='string'){try{dado=JSON.parse(dado);}catch(e){return;}}
    if(dado&&dado.type==='MOUNTED'){montado=true;revelar();}
  }
  window.addEventListener('message',mensagem);
  var mo=new MutationObserver(function(){
    f=caixa.querySelector('iframe'); if(!f)return; mo.disconnect();
    // Compatibilidade com o SDK atual da Meta; permissão restrita ao próprio Instagram.
    f.setAttribute('allow','unload https://www.instagram.com');
    if(!f.getAttribute('title'))f.setAttribute('title','Vídeo '+n+' da GESCOMP no Instagram');
    f.addEventListener('load',function(){
      if(pronto)return;
      carregado=true;
      if(pararAltura)pararAltura();
      pararAltura=esperarAltura(f,revelar);
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
function montarVideo(s,caixa,capa,it,n,fim){
  var v=document.createElement('video');
  v.controls=true;v.setAttribute('playsinline','');v.preload='metadata';v.src=it.url;v.setAttribute('aria-label','Vídeo '+n+' da GESCOMP');
  caixa.classList.add('video');caixa.appendChild(v);
  v.addEventListener('loadedmetadata',function(){tirarCapa(capa);if(fim)fim(true);});
  v.addEventListener('error',function(){falhar(s,'video');if(fim)fim(false);});
  v.addEventListener('play',function(){assistir(s,'video');});
  function parou(){if(assistindo&&assistindo.slide===s)retomar();}
  v.addEventListener('pause',parou);v.addEventListener('ended',parou);
  if(ioVideo)ioVideo.observe(s);
}
function montarEmbed(s,caixa,capa,it,n,fim){
  var b=document.createElement('blockquote');
  b.className='instagram-media';
  b.setAttribute('data-instgrm-permalink',it.url+'?utm_source=ig_embed&utm_campaign=loading');
  b.setAttribute('data-instgrm-version','14');
  b.style.cssText='background:#FFF;border:0;margin:0;padding:0;width:100%;';
  var l=document.createElement('a'); l.href=it.url; l.target='_blank'; l.rel='noopener'; l.textContent='Ver o vídeo '+n+' no Instagram';
  b.appendChild(l); caixa.appendChild(b);
  vigiarIframe(s,caixa,capa,n,fim);
}
function processar(){if(window.instgrm&&window.instgrm.Embeds)window.instgrm.Embeds.process();}
function carregarEmbedJs(){
  if(window.instgrm&&window.instgrm.Embeds){processar();return;}
  var ja=document.querySelector('script[src="'+EMBED_JS+'"]'); if(ja){ja.addEventListener('load',processar);return;}
  var sc=document.createElement('script'); sc.async=true; sc.src=EMBED_JS;
  sc.onload=processar;
  sc.onerror=function(){for(var i=0;i<slides.length;i++){var x=slides[i];if(x.it.tipo==='embed'&&x.estado!=='pronto'){falhar(x.s,'embed');if(x.estado==='carregando')concluir(x,false);x.estado='falhou';}}};
  document.body.appendChild(sc);
}

/* Fila de carregamento, pensada para internet lenta:
   - a conexão com o Instagram e o embed.js começam antes de a seção aparecer;
   - os vídeos entram um a um, primeiro o que está na tela e depois os vizinhos do carrossel. Antes, os 5
     carregavam juntos e baixavam 5 vezes os mesmos scripts e estilos da Meta; em fila, os seguintes
     aproveitam o cache do primeiro;
   - com economia de dados ou rede 2G, nada carrega sozinho: tocar na capa carrega só aquele vídeo
     (Ctrl/clique do meio continuam abrindo o Instagram). */
var con=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
var modo=(function(){if(!con)return 'normal';var t=String(con.effectiveType||'');if(con.saveData||/2g$/.test(t))return 'economia';if(t==='3g'||(con.downlink&&con.downlink<1.5))return 'lenta';return 'normal';})();
var PARALELO=modo==='normal'?2:1, PASSO_FILA=8000, PASSO_PRIMEIRO=60000;
var slides=[], fila=[], emCurso=0, algumPronto=false;
for(var i=0;i<total;i++)if(itens[i])slides.push({s:lista[i],it:itens[i],n:i+1,capa:lista[i].querySelector('[data-reel]'),estado:'espera'});
function proximo(){
  while(emCurso<(algumPronto?PARALELO:1)&&fila.length){var x=fila.shift();if(x.estado==='fila')iniciar(x);}
}
function enfileirar(x,urgente){if(x.estado!=='espera')return;x.estado='fila';if(urgente)fila.unshift(x);else fila.push(x);proximo();}
function liberarVaga(x){if(x.liberou)return;x.liberou=true;emCurso--;proximo();}
function concluir(x,ok){if(ok){x.estado='pronto';algumPronto=true;car.travar('primeiro-video',false);}else if(x.estado!=='pronto')x.estado='falhou';clearTimeout(x.passo);liberarVaga(x);}
function iniciar(x){
  x.estado='carregando';emCurso++;
  var capa=x.capa, caixa=document.createElement('div'); caixa.className='ig-midia';
  if(capa){
    capa.classList.add('ig-capa');capa.setAttribute('aria-hidden','true');capa.setAttribute('tabindex','-1');
    var tx=capa.querySelector('[data-capa-texto]'); if(tx)tx.textContent='Carregando o vídeo…';
  }
  x.s.insertBefore(caixa,capa||x.s.firstChild);
  // O primeiro vídeo carrega sozinho (até ficar pronto ou 60 s): em rede lenta, um segundo roubaria a banda dele.
  // Aos 20 s (LIMITE_CARGA) a capa dele já vira link para o Instagram, então ninguém fica sem acesso.
  // Depois, um vídeo travado não segura a fila: após PASSO_FILA o próximo começa, e este continua tentando.
  x.passo=setTimeout(function(){liberarVaga(x);},algumPronto?PASSO_FILA:PASSO_PRIMEIRO);
  var fim=function(ok){concluir(x,ok);};
  if(x.it.tipo==='video')montarVideo(x.s,caixa,capa,x.it,x.n,fim);
  else{montarEmbed(x.s,caixa,capa,x.it,x.n,fim);carregarEmbedJs();}
}
function preconectar(){
  ['https://www.instagram.com','https://static.cdninstagram.com'].forEach(function(o){
    if(document.querySelector('link[rel="preconnect"][href="'+o+'"]'))return;
    var l=document.createElement('link');l.rel='preconnect';l.href=o;document.head.appendChild(l);
  });
}
var preparado=false;
function preparar(){
  if(preparado)return; preparado=true;
  if(modo==='economia'){
    slides.forEach(function(x){
      if(!x.capa)return;
      x.capa.setAttribute('aria-label','Carregar aqui o vídeo '+x.n+' da GESCOMP');
      var tx=x.capa.querySelector('[data-capa-texto]'); if(tx)tx.textContent='Toque para carregar o vídeo · economia de dados';
      x.capa.addEventListener('click',function(e){if(x.estado!=='espera'||e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;e.preventDefault();preconectar();enfileirar(x,true);});
    });
    return;
  }
  // A passagem automática espera o primeiro vídeo: a pessoa vê o vídeo chegar, não capas de espera passando.
  car.travar('primeiro-video',true);
  setTimeout(function(){car.travar('primeiro-video',false);},PASSO_PRIMEIRO);
  // Prioridade: o vídeo visível e os vizinhos de cada lado; os demais entram quando o carrossel chega neles.
  if(!temIO){slides.forEach(function(x){enfileirar(x);});return;}
  var ioVez=new IntersectionObserver(function(es){for(var k=0;k<es.length;k++)if(es[k].isIntersecting){for(var j=0;j<slides.length;j++)if(slides[j].s===es[k].target){enfileirar(slides[j]);ioVez.unobserve(es[k].target);}}},{root:trilha,rootMargin:'0px 60% 0px 60%',threshold:0});
  slides.forEach(function(x){ioVez.observe(x.s);});
}
var temEmbed=slides.some(function(x){return x.it.tipo==='embed';});
if(temIO){
  // Bem antes de a seção aparecer: abre a conexão e baixa o embed.js (sem vídeos ainda, ele não processa nada).
  var ioPerto=new IntersectionObserver(function(es){for(var k=0;k<es.length;k++)if(es[k].isIntersecting){ioPerto.disconnect();if(modo!=='economia'&&temEmbed){preconectar();carregarEmbedJs();}return;}},{rootMargin:'1500px 0px'});
  ioPerto.observe(sec);
  var ioSec=new IntersectionObserver(function(es){for(var k=0;k<es.length;k++)if(es[k].isIntersecting){ioSec.disconnect();preparar();return;}},{rootMargin:'400px 0px'});
  ioSec.observe(sec);
}
else preparar();
})();


/* Avaliações de clientes (dados em /assets/js/config.js, objeto "avaliacoes")
   A seção só aparece quando a lista "itens" tem pelo menos uma avaliação com texto. */
(function(){
var sec=document.getElementById('avaliacoes'); if(!sec)return;
var cfg=(window.GESCOMP_CONFIG||{}).avaliacoes||{};
sec.hidden=true;
var prova=document.querySelector('.abertura-prova');if(prova)prova.hidden=true;
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
// Exibe somente a nota; a quantidade de avaliações não aparece na página.
var nota=Number(String(cfg.nota==null?'':cfg.nota).replace(',','.'));
var resumo=sec.querySelector('[data-avaliacoes-resumo]');
if(resumo&&nota>0&&nota<=5){resumo.textContent=String(nota).replace('.',',')+' estrelas no Google';resumo.hidden=false;}
var avaliar=sec.querySelector('[data-avaliacoes-avaliar]'), ver=sec.querySelector('[data-avaliacoes-ver]');
if(avaliar&&linkValido(cfg.linkAvaliar)){avaliar.href=linkValido(cfg.linkAvaliar);avaliar.hidden=false;}
if(ver&&linkValido(cfg.linkVerTodas)){ver.href=linkValido(cfg.linkVerTodas);ver.hidden=false;}
// O destaque da abertura usa os mesmos dados conferidos do carrossel, sem cópia independente.
if(prova){
  var destaque=itens.filter(function(a){return a.nome===cfg.destaque;})[0]||itens[0];
  var texto=prova.querySelector('.prova-citacao p'),autor=prova.querySelector('.prova-autor'),fonte=prova.querySelector('.prova-link'),notaProva=prova.querySelector('.prova-nota');
  if(texto)texto.textContent='“'+String(destaque.texto).trim()+'”';
  if(autor)autor.textContent=nomeCurto(destaque.nome)+', avaliação no Google';
  if(notaProva){
    notaProva.hidden=!(nota>0&&nota<=5);
    if(!notaProva.hidden){
      var rotulo=nota.toFixed(1).replace('.',','),numero=notaProva.querySelector('.prova-numero'),estrelas=notaProva.querySelector('.prova-estrelas'),acessivel=notaProva.querySelector('.so-leitor');
      if(numero){numero.textContent=rotulo;numero.setAttribute('aria-hidden','true');}
      if(estrelas)estrelas.textContent='★'.repeat(Math.round(nota))+'☆'.repeat(5-Math.round(nota));
      if(acessivel)acessivel.textContent='Nota '+rotulo+' de 5';
    }
  }
  if(fonte){var destino=linkValido(cfg.linkVerTodas)||linkValido(destaque.link);fonte.hidden=!destino;if(destino)fonte.href=destino;}
  prova.hidden=false;
}
sec.hidden=false;
criarCarrossel(regiao,{rotulo:'Avaliação',continuo:true,velocidade:36,somenteAutomatico:true});
})();

/* Fotos liberadas pela configuração; imagens ausentes mantêm a arte de espera sem pedido HTTP. */
(function(){
var cfg=window.GESCOMP_CONFIG||{},fotos=Array.isArray(cfg.fotos)?cfg.fotos:[];
var molduras=document.querySelectorAll('[data-foto]');
for(var i=0;i<molduras.length;i++)(function(moldura){
var caminho=moldura.getAttribute('data-foto');
if(moldura.closest('#rio')||fotos.indexOf(caminho)<0||!/^\/assets\/img\/fotos\/[A-Za-z0-9._-]+\.webp$/.test(caminho))return;
// A moldura de Sobre fica escondida até o load; lazy nesse caso impediria a própria carga.
var img=document.createElement('img');img.alt=moldura.getAttribute('data-foto-alt')||'';img.decoding='async';img.loading=moldura.closest('#inicio')||moldura.classList.contains('gabriela-foto')?'eager':'lazy';img.style.visibility='hidden';
img.width=1200;img.height=moldura.closest('.ajuda-card')?900:1500;
img.addEventListener('load',function(){img.style.visibility='';moldura.classList.add('tem-foto');var abertura=moldura.closest('.abertura-imagem');if(abertura)abertura.classList.add('tem-retrato');});
img.addEventListener('error',function(){if(img.hasAttribute('srcset')){img.removeAttribute('srcset');img.removeAttribute('sizes');img.src=caminho;return;}img.remove();moldura.classList.remove('tem-foto');var abertura=moldura.closest('.abertura-imagem');if(abertura)abertura.classList.remove('tem-retrato');});
// Cards de serviço têm versões de 480 e 720 px (docs/testes/gerar-variantes-imagens.py); o original de 1200 px fica para telas grandes e densas.
if(moldura.closest('.ajuda-card')){var base=caminho.replace(/\.webp$/,'');img.srcset=base+'-480.webp 480w, '+base+'-720.webp 720w, '+caminho+' 1200w';img.sizes='(min-width:1024px) 360px, (min-width:640px) 560px, calc(100vw - 50px)';}
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
