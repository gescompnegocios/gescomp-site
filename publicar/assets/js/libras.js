/* Ajuste do botão oficial do VLibras: lado direito, logo acima do botão do WhatsApp
   (que tem 68 px a 18 px da borda), centralizado com ele. Fica sempre visível e longe
   do meio da tela, onde ficam as setas do carrossel. */
(function () {
  var observador;
  var limite;

  function posicionar() {
    var widget = window.VLibrasWidget;
    if (!widget || !widget.access || !widget.initBtn) return false;

    // A interface oficial fica em Shadow DOM. A API expõe o botão e seu contêiner.
    // Preservar o display controlado pelo widget quando ele abre e fecha.
    var estilo = widget.access.style;
    estilo.setProperty('position', 'fixed');
    estilo.setProperty('left', 'auto');
    estilo.setProperty('right', '32px');
    estilo.setProperty('top', 'auto');
    estilo.setProperty('bottom', 'calc(100px + env(safe-area-inset-bottom, 0px))');
    estilo.setProperty('transform', 'none');

    if (observador) observador.disconnect();
    clearTimeout(limite);
    return true;
  }

  if (posicionar() || !window.MutationObserver) return;
  observador = new MutationObserver(posicionar);
  observador.observe(document.body, { childList: true });
  // Uma falha do serviço externo não impede o uso do site nem deixa a observação ativa.
  limite = setTimeout(function () { observador.disconnect(); }, 15000);
})();
