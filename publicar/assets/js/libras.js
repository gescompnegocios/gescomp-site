/* Carrega o plugin oficial do VLibras (Governo Federal) só depois que a página terminou de carregar
   e o navegador está ocioso. Assim o plugin e os arquivos que ele busca em outros domínios não
   disputam banda e processador com o conteúdo que o visitante vê primeiro. */
(function () {
  function carregar() {
    if (window.VLibrasWidget || document.querySelector("script[data-vlibras]")) return;
    var s = document.createElement("script");
    s.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    s.async = true;
    s.setAttribute("data-vlibras", "");
    document.body.appendChild(s);
  }
  // O plugin ocupa o processador por vários segundos no celular. Ele carrega na primeira interação
  // (rolar, tocar, teclar) ou, sem interação, alguns segundos depois de a página ficar ociosa.
  var eventos = ["pointerdown", "keydown", "scroll", "touchstart"], feito = false;
  function uma() {
    if (feito) return; feito = true;
    for (var i = 0; i < eventos.length; i++) window.removeEventListener(eventos[i], uma, true);
    carregar();
  }
  function agendar() {
    for (var i = 0; i < eventos.length; i++) window.addEventListener(eventos[i], uma, { capture: true, passive: true, once: true });
    setTimeout(function () {
      if ("requestIdleCallback" in window) requestIdleCallback(uma, { timeout: 4000 });
      else uma();
    }, 6000);
  }
  if (document.readyState === "complete") agendar();
  else window.addEventListener("load", agendar);
})();

/* Ajuste do botão oficial do VLibras: lado direito, logo acima do botão do WhatsApp
   de 60 px, com os centros alinhados pelas mesmas variáveis CSS. */
(function () {
  var observador;
  var limite;

  function posicionar() {
    var widget = window.VLibrasWidget;
    if (!widget || !widget.access || !widget.initBtn) return false;

    // A interface oficial fica em Shadow DOM. A API expõe o botão e seu contêiner.
    // Preservar o display controlado pelo widget quando ele abre e fecha.
    var largura = widget.access.getBoundingClientRect().width ||
      (typeof widget.initBtn.getBoundingClientRect === 'function' ? widget.initBtn.getBoundingClientRect().width : 0) || 40;
    var estilo = widget.access.style;
    estilo.setProperty('position', 'fixed');
    estilo.setProperty('left', 'auto');
    estilo.setProperty('right', 'calc(var(--gc-flutuante-direita, 18px) + (var(--gc-whatsapp-tamanho, 60px) - ' + largura + 'px) / 2)');
    estilo.setProperty('top', 'auto');
    estilo.setProperty('bottom', 'calc(var(--gc-flutuante-base, 18px) + var(--gc-whatsapp-tamanho, 60px) + var(--gc-flutuante-gap, 16px))');
    estilo.setProperty('transform', 'none');

    if (observador) observador.disconnect();
    clearTimeout(limite);
    return true;
  }

  if (posicionar() || !window.MutationObserver) return;
  observador = new MutationObserver(posicionar);
  observador.observe(document.body, { childList: true });
  // Uma falha do serviço externo não impede o uso do site nem deixa a observação ativa.
  limite = setTimeout(function () { observador.disconnect(); }, 30000);
})();
