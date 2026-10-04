// Leitura da rodada visual em andamento. Fixtures só no navegador; não altera arquivos publicados.
async (shared) => {
  const c = await shared.context().browser().newContext(), p = await c.newPage();
  const resultados = { tipo: 'monitoramento durante entrega visual', telas: [], fotoSobre: null };
  const axePath = 'C:/Users/fabri/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js';
  try {
    await p.route('https://www.instagram.com/**', r => r.fulfill({ contentType: 'application/javascript', body: '' }));
    await p.route('https://vlibras.gov.br/**', r => r.fulfill({ contentType: 'application/javascript', body: '' }));
    await p.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [1366, 1920, 1024, 900, 390, 360]) {
      await p.setViewportSize({ width, height: width < 500 ? 844 : 900 });
      await p.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      await p.addScriptTag({ path: axePath });
      for (const theme of ['light', 'dark']) {
        await p.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
        await p.waitForTimeout(1600);
        resultados.telas.push({ width, theme, ...await p.evaluate(async () => {
          const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
          const h1 = document.querySelector('#inicio h1'), estilo = getComputedStyle(h1);
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            linhasH1: h1.getBoundingClientRect().height / parseFloat(estilo.lineHeight),
            imagemAberturaOculta: getComputedStyle(document.querySelector('.abertura-imagem')).display === 'none',
            avaliacaoNaAbertura: !!document.querySelector('.abertura-prova'),
            passos: document.querySelectorAll('#como-funciona .passo').length,
            linkTrocarContador: document.querySelector('.troca-contador a').href,
            axe: r.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, resumo: n.failureSummary })) }))
          };
        }) });
      }
    }
    const cfg = await (await p.request.get('http://127.0.0.1:8080/assets/js/config.js')).text();
    await p.route('**/assets/js/config.js*', r => r.fulfill({ contentType: 'application/javascript', body: cfg + "\nwindow.GESCOMP_CONFIG.fotos.push('/assets/img/fotos/gabriela-sobre.webp');" }));
    let pedidos = 0;
    await p.route('**/assets/img/fotos/gabriela-sobre.webp', r => { pedidos++; return r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500"><rect width="1200" height="1500" fill="#003f4a"/></svg>' }); });
    await p.setViewportSize({ width: 1366, height: 768 });
    await p.goto('http://127.0.0.1:8080/');
    await p.locator('#sobre').scrollIntoViewIfNeeded();
    await p.waitForTimeout(2500);
    const estado = () => p.locator('.gabriela-foto').evaluate(e => ({ display: getComputedStyle(e).display, pronta: e.classList.contains('tem-foto'), naturalWidth: e.querySelector('img').naturalWidth, loading: e.querySelector('img').loading }));
    const antes = { ...await estado(), pedidos };
    // Prova da causa: carregamento imediato somente na fixture, sem alterar o código do site.
    await p.locator('.gabriela-foto img').evaluate(e => e.loading = 'eager');
    await p.waitForTimeout(1200);
    resultados.fotoSobre = { antes, depoisDeCarregarImediatamenteNaFixture: { ...await estado(), pedidos } };
    return resultados;
  } finally { await c.close(); }
}
