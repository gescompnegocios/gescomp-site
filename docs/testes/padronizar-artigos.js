// Padroniza os componentes das páginas de artigo (Informações e guias): troca estilos inline repetidos por classes
// definidas em site.css ("Artigos — padrão") e move as fontes oficiais para o fim da seção de perguntas.
// O texto visível, os links, os ids e o JSON-LD de cada página precisam continuar idênticos, ou nada é gravado.
// Uso, a partir de 02-site:  node docs/testes/padronizar-artigos.js [--seco]
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', '..', 'publicar');
const seco = process.argv.includes('--seco');
const PAGINAS = ['informacoes', 'abrir-empresa', 'calendario-fiscal', 'departamento-pessoal', 'imposto-de-renda', 'mei', 'pro-labore-e-lucros', 'simples-nacional'];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const interno = '<span style="position: relative">([^<]*)</span>';

// [nome, procura (string exata ou RegExp), substituição]
const TROCAS = [
  ['lista de linhas', '<div style="display: flex; flex-direction: column; border-bottom: 1.5px solid var(--linha)">', '<div class="artigo-linhas">'],
  ['linha de tabela', '<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 14px 24px; padding: 20px 0; border-top: 1.5px solid var(--linha)">', '<div class="artigo-tabela-linha">'],
  ['célula principal', '<div style="flex: 2 1 250px">', '<div>'],
  ['célula do meio', '<div style="flex: 1 1 170px">', '<div>'],
  ['célula de observação', '<div style="flex: 2 1 230px">', '<div>'],
  ['rótulo da tabela', '<span style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--texto2)">', '<span class="artigo-tabela-rotulo">'],
  ['valor da tabela', /<span style="font-size: 1[78]px; font-weight: 700; line-height: 1\.4; color: var\(--titulo\)">/g, '<span class="artigo-tabela-valor">'],
  ['observação da tabela', '<span style="font-size: 16.5px; line-height: 1.5; color: var(--texto2)">', '<span class="artigo-tabela-obs">'],
  ['destaque da tabela (era pílula)', new RegExp(esc('<span class="etiqueta" style="position: relative; display: inline-flex; padding: 8px 18px; font-weight: 800; font-size: 16px; line-height: 1.3; color: #FFFFFF; background: #0B5963">') + interno + '</span>', 'g'), '<span class="artigo-tabela-destaque">$1</span>'],
  ['linha de agenda', /<div style="display: flex; flex-wrap: wrap; gap: (?:12px 22px; align-items: center; padding: 18px 0|10px 20px; align-items: flex-start; padding: 14px 0)(?:; border-top: 1\.5px solid var\(--linha\))?">/g, '<div class="artigo-agenda-linha">'],
  ['data da agenda (era pílula)', new RegExp(esc('<span class="etiqueta" style="position: relative; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; min-width: 104px; padding: 8px 14px; font-family: \'Bricolage Grotesque\', Georgia, serif; font-size: 18px; font-weight: 800; color: ') + '(#FFFFFF|#003F4A)' + esc('; box-sizing: border-box; text-align: center; background: ') + '(#0B5963|#E8952F|#1E727D)">' + interno + '</span>', 'g'),
    (m, cor, fundo, txt) => `<span class="artigo-agenda-data${fundo === '#E8952F' ? ' destaque' : fundo === '#1E727D' ? ' periodo' : ''}">${txt}</span>`],
  ['texto da agenda', '<p class="texto" style="margin: 0; flex: 1 1 280px; color: var(--texto)">', '<p class="artigo-agenda-texto">'],
  ['marcador (contorno)', new RegExp(esc('<span class="etiqueta etiqueta-contorno" style="position: relative; display: inline-flex; padding: 8px 16px; font-weight: 700; font-size: 15px; color: var(--titulo); background: var(--superficie)">') + interno + '</span>', 'g'), '<span class="marcador marcador-contorno">$1</span>'],
  ['marcador CBS/IBS', new RegExp(esc('<span class="etiqueta" style="position: relative; display: inline-flex; padding: 10px 20px; font-weight: 800; font-size: 17px; color: #FFFFFF; background: ') + '(#0B5963|#B65A0C)">' + interno + '</span>', 'g'),
    (m, fundo, txt) => `<span class="marcador ${fundo === '#0B5963' ? 'marcador-cbs' : 'marcador-ibs'}">${txt}</span>`],
  ['grade de cards', /<div style="display: grid; grid-template-columns: repeat\(auto-fit, minmax\(260px, 1fr\)\); gap: (?:var\(--gap-cards\)|26px)">/g, '<div class="artigo-cards">'],
  ['item de lista fora do padrão', 'font-size: 17.5px; line-height: 1.6;', 'font-size: var(--fs-destaque); line-height: 1.6;'],
];

const textoVisivel = h => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const lista = (h, re) => [...h.matchAll(re)].map(m => m[1]).sort().join('\n');
const jsonld = h => [...h.matchAll(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g)].map(m => m[0]).join('');

// Fontes: <p ...><strong>Fontes oficiais e base legal:</strong><br><a>…</a><br>…<br>Nota</p>  ->  <aside class="artigo-fontes">
const P_FONTES = /<p style="(?:margin: 14px 0 0; max-width: 780px|max-width: var\(--container\); box-sizing: border-box; margin: 0 auto; padding: 0 var\(--margem\) 48px); font-size: 15px; line-height: 1\.6; color: var\(--texto2\)"><strong>Fontes oficiais e base legal:<\/strong><br>([\s\S]*?)<\/p>/;
function montarFontes(miolo) {
  const partes = miolo.split(/<br\s*\/?>/).map(s => s.trim()).filter(Boolean);
  const links = [], notas = [];
  for (const p of partes) {
    if (/^<a\b[\s\S]*<\/a>$/.test(p) && (p.match(/<a\b/g) || []).length === 1) links.push(p.replace(/ style="[^"]*"/, ''));
    else notas.push(p);
  }
  if (!links.length) throw new Error('fontes sem links');
  return `<aside class="artigo-fontes" aria-labelledby="fontes-titulo"><h2 class="artigo-fontes-titulo" id="fontes-titulo">Fontes oficiais e base legal</h2><ul class="artigo-fontes-lista">${links.map(a => `<li>${a}</li>`).join('')}</ul>${notas.map(n => `<p class="artigo-fontes-nota">${n}</p>`).join('')}</aside>`;
}

const relatorio = [];
for (const pag of PAGINAS) {
  const f = path.join(DIR, pag + '.html');
  const orig = fs.readFileSync(f, 'utf8');
  let h = orig; const conta = {};
  for (const [nome, de, para] of TROCAS) {
    const n = typeof de === 'string' ? h.split(de).length - 1 : (h.match(de) || []).length;
    if (!n) continue;
    h = typeof de === 'string' ? h.split(de).join(para) : h.replace(de, para);
    conta[nome] = n;
  }
  // Fontes: tira de onde estão e põe no fim do contêiner da seção de perguntas.
  const mf = h.match(P_FONTES);
  let fontesAntes = '', fontesDepois = '';
  if (mf) {
    const aside = montarFontes(mf[1]);
    fontesAntes = textoVisivel(mf[0]); fontesDepois = textoVisivel(aside);
    h = h.replace(mf[0], '');
    const iFaq = h.indexOf('>Perguntas frequentes</h2>');
    if (iFaq < 0) throw new Error(pag + ': sem seção de perguntas');
    const fimSec = h.indexOf('</section>', iFaq);
    const fimCont = h.lastIndexOf('</div>', fimSec);
    h = h.slice(0, fimCont) + aside + h.slice(fimCont);
    conta['fontes movidas'] = 1;
  }
  // Travas: texto visível (fontes comparadas à parte, sem o ":" do rótulo), links, ids e JSON-LD.
  const tirar = (txt, bloco) => bloco ? txt.replace(bloco, ' ').replace(/\s+/g, ' ') : txt;
  const tA = tirar(textoVisivel(orig), fontesAntes), tD = tirar(textoVisivel(h), fontesDepois);
  if (tA !== tD) { let i = 0; while (tA[i] === tD[i]) i++; throw new Error(`${pag}: texto mudou perto de «${tA.slice(i - 40, i + 40)}» × «${tD.slice(i - 40, i + 40)}»`); }
  if (fontesAntes.replace('base legal:', 'base legal') !== fontesDepois) throw new Error(pag + ': texto das fontes mudou');
  if (lista(orig, /href="([^"]*)"/g) !== lista(h, /href="([^"]*)"/g)) throw new Error(pag + ': links mudaram');
  const idsA = lista(orig, /\bid="([^"]*)"/g), idsD = lista(h, /\bid="([^"]*)"/g).split('\n').filter(x => x !== 'fontes-titulo').join('\n');
  if (idsA !== idsD) throw new Error(pag + ': ids mudaram');
  if (jsonld(orig) !== jsonld(h)) throw new Error(pag + ': JSON-LD mudou');
  if (!seco) fs.writeFileSync(f, h);
  relatorio.push(`${pag.padEnd(22)} ${Object.entries(conta).map(([k, v]) => `${k} ×${v}`).join(' · ')}`);
}
console.log(relatorio.join('\n'));
console.log(seco ? '\nSECO: nada gravado' : '\nGRAVADO');
