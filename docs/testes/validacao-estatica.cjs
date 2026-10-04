// Executar a partir de 02-site: node docs/testes/validacao-estatica.cjs
// Sem dependências. Verifica metadados e a preservação do rio fora dos dois ajustes autorizados.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const origem = 'https://gescompnegocios.com.br';
const base = 'e3c3bb5';
const normalizar = texto => texto.replace(/\r\n/g, '\n');
const sha = texto => crypto.createHash('sha256').update(texto).digest('hex');
const arquivos = fs.readdirSync('publicar').filter(nome => nome.endsWith('.html'));
const resultado = { base, paginas: [], corposAlterados: [], cssAlterado: [] };
for (const nome of arquivos) {
  const arquivo = 'publicar/' + nome;
  const html = normalizar(fs.readFileSync(arquivo, 'utf8'));
  const anterior = normalizar(cp.execFileSync('git', ['show', base + ':' + arquivo], { encoding: 'utf8' }));
  if(html.slice(html.indexOf('<body'))!==anterior.slice(anterior.indexOf('<body')))resultado.corposAlterados.push(nome);
  assert.ok(!/\?\?|\uFFFD/.test(html), nome + ': caracteres corrompidos');
  const blocos = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  for (const bloco of blocos) {
    const dados = JSON.stringify(bloco);
    assert.ok(!/"@type":"(?:AggregateRating|Review)"/.test(dados), nome + ': avaliação em JSON-LD');
  }
  if (nome === '404.html') {
    assert.match(html, /name="robots" content="noindex, follow"/);
  } else {
    const rota = nome === 'index.html' ? '/' : '/' + nome.replace(/\.html$/, '');
    assert.ok(html.includes('rel="canonical" href="' + origem + rota + '"'), nome + ': canonical');
    assert.ok(html.includes('property="og:url" content="' + origem + rota + '"'), nome + ': Open Graph URL');
    for (const atributo of ['og:image', 'twitter:image']) assert.ok(html.includes('"' + atributo + '" content="' + origem + '/assets/img/og-composicao-20261004.webp"'));
    assert.ok(html.includes('/assets/css/site.css?v=20261004'));
    assert.ok(blocos.length > 0);
  }
  resultado.paginas.push({ nome, jsonLd: blocos.length });
}
for (const nome of ['site.css', 'estrutura.css']) {
  const arquivo = 'publicar/assets/css/' + nome;
  const atual=normalizar(fs.readFileSync(arquivo,'utf8'));
  const anterior=normalizar(cp.execFileSync('git',['show',base+':'+arquivo],{encoding:'utf8'}));
  if(atual!==anterior)resultado.cssAlterado.push(nome);
  if(nome==='site.css')for(const regra of anterior.split('\n').filter(l=>/\.rio-|\.janela-/.test(l)))assert.ok(atual.includes(regra),'Regra protegida do rio alterada: '+regra);
}
const index = normalizar(fs.readFileSync('publicar/index.html', 'utf8'));
const antigo = normalizar(cp.execFileSync('git', ['show', base + ':publicar/index.html'], { encoding: 'utf8' }));
const rio = texto => texto.match(/<section id="rio"[\s\S]*?<\/section>/)[0];
const ajustesAutorizados = [
  '<rect data-borda="1" x="0" y="82" width="1440" height="10" style="fill: var(--chao)"></rect>\n',
  '<g aria-hidden="true">\n<rect x="808" y="380" width="80" height="18" rx="3" fill="#FFFFFF" stroke="#003F4A" stroke-width="2" filter="url(#pincelSuave)"></rect>\n<text x="848" y="393.6" text-anchor="middle" font-family="\'Bricolage Grotesque\', Georgia, serif" font-size="12" font-weight="800" letter-spacing=".6" fill="#003F4A">GESCOMP</text>\n</g>\n'
];
let rioSemAjustes = rio(index);
for (const ajuste of ajustesAutorizados) {
  assert.equal(rioSemAjustes.split(ajuste).length, 2, 'Ajuste autorizado ausente ou duplicado');
  rioSemAjustes = rioSemAjustes.replace(ajuste, '');
}
const ondaLisa = '<path style="fill: var(--chao)" d="M0 40 C 280 90, 600 10, 920 52 S 1300 80, 1440 46 L1440 90 L0 90 Z"></path>';
const ondaBase = ondaLisa.replace('></path>', ' filter="url(#pincel)"></path>');
assert.ok(rioSemAjustes.includes(ondaLisa), 'A onda lisa autorizada não corresponde à curva original');
rioSemAjustes = rioSemAjustes.replace(ondaLisa, ondaBase);
assert.equal(rioSemAjustes, rio(antigo));
resultado.rioPreservadoForaDosDoisAjustes = true;
resultado.rioHtmlSha256 = sha(rio(index));
const catalogo = JSON.parse(index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'].find(item => item['@type'] === 'AccountingService').hasOfferCatalog.itemListElement;
assert.equal(catalogo.length, 8);
assert.deepEqual(catalogo.filter(item => item.priceSpecification).map(item => item.priceSpecification.minPrice), [150, 100, 100]);
assert.ok(fs.readFileSync('publicar/robots.txt', 'utf8').includes('Sitemap: ' + origem + '/sitemap.xml'));
const sitemap = fs.readFileSync('publicar/sitemap.xml', 'utf8');
assert.equal([...sitemap.matchAll(/<loc>/g)].length, 9);
assert.equal([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].filter(m => m[1].startsWith(origem)).length, 9);
const manifest = JSON.parse(fs.readFileSync('publicar/site.webmanifest', 'utf8'));
assert.equal(manifest.id, '/');
assert.equal(manifest.scope, '/');
resultado.manifestValido = true;
const dir = path.join('docs', 'evidencias', '2026-10-04');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'validacao-estatica-imagens.json'), JSON.stringify(resultado, null, 2) + '\n');
console.log(JSON.stringify(resultado));
