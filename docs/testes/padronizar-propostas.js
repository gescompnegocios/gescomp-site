// Leva as páginas de proposta (fim-escala-6x1, novo-limite-mei) aos componentes dos outros guias:
// FAQ com fios e "+", lista com ✓, bloco de fontes e linha "Outros assuntos". Não muda nenhuma palavra.
// Uso: node docs/testes/padronizar-propostas.js [--seco]
const fs = require('fs'), path = require('path');
const PASTA = path.join(__dirname, '..', '..', 'publicar');
const PAGINAS = ['fim-escala-6x1', 'novo-limite-mei'];
const seco = process.argv.includes('--seco');

const ICONE = '<svg class="faq-icone" width="34" height="34" viewBox="0 0 60 60" aria-hidden="true" style="flex-shrink: 0; overflow: visible"><circle cx="30" cy="30" r="27" fill="#E8952F"></circle><path d="M30 19 V41 M19 30 H41" stroke="#003F4A" stroke-width="5" stroke-linecap="round"></path></svg>';

const texto = h => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const lista = (h, re) => [...h.matchAll(re)].map(m => m[1]).sort().join('\n');
const jsonld = h => lista(h, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);

let falhou = false;
for (const pg of PAGINAS) {
  const arq = path.join(PASTA, pg + '.html');
  const antes = fs.readFileSync(arq, 'utf8');
  let h = antes; const n = {};
  const trocar = (nome, re, fn) => { let c = 0; h = h.replace(re, (...a) => { c++; return fn(...a); }); n[nome] = c; };

  // FAQ: lista com fios, pergunta em <span> e o mesmo "+" laranja dos outros guias
  trocar('faq', /<section><h2 class="titulo-secao">Perguntas frequentes<\/h2>([\s\S]*?)<\/section>/, (_, corpo) =>
    '<section class="artigo-faq"><h2 class="titulo-secao">Perguntas frequentes</h2><div class="artigo-faq-lista">' +
    corpo.replace(/<summary>([\s\S]*?)<\/summary>/g, (_, q) => `<summary><span>${q}</span>${ICONE}</summary>`) +
    '</div></section>');
  // Lista de ações: o ✓ dos outros guias
  trocar('lista', /(<section><h2 class="titulo-secao">(?:O que a empresa pode organizar agora|Como se preparar enquanto os projetos tramitam)<\/h2>)<ul>/, (_, ab) => ab + '<ul class="artigo-lista-check">');
  // Fontes: mesmo bloco das outras páginas (título pequeno, lista em 2 colunas, nota)
  trocar('fontes', /<section><h2 class="titulo-secao">(Fontes oficiais e acompanhamento)<\/h2><p>([\s\S]*?)<\/p><ul>([\s\S]*?)<\/ul><\/section>/, (_, t, nota, itens) =>
    `<section class="artigo-fontes" aria-labelledby="fontes-titulo"><h2 class="artigo-fontes-titulo" id="fontes-titulo">${t}</h2><p class="artigo-fontes-nota">${nota}</p><ul class="artigo-fontes-lista">` +
    itens.replace(/ style="color: var\(--titulo\); text-decoration: underline; text-underline-offset: 3px"/g, '') + '</ul></section>');
  trocar('outros', /<nav aria-label="Outros assuntos">/, () => '<nav class="artigo-outros" aria-label="Outros assuntos">');

  const erros = [];
  if (Object.values(n).some(c => c !== 1)) erros.push('ocorrências ' + JSON.stringify(n));
  if (texto(antes) !== texto(h)) erros.push('texto visível mudou');
  if (lista(antes, /href="([^"]*)"/g) !== lista(h, /href="([^"]*)"/g)) erros.push('links mudaram');
  const ids = x => lista(x, /\sid="([^"]*)"/g).split('\n').filter(i => i !== 'fontes-titulo').join('\n');
  if (ids(antes) !== ids(h) || /\sid="fontes-titulo"/.test(antes)) erros.push('ids mudaram');
  if (jsonld(antes) !== jsonld(h)) erros.push('JSON-LD mudou');
  if (erros.length) { falhou = true; console.log(pg, 'PARADO:', erros.join('; ')); continue; }
  if (!seco) fs.writeFileSync(arq, h);
  console.log(pg, seco ? 'seco' : 'GRAVADO', JSON.stringify(n));
}
process.exit(falhou ? 1 : 0);
