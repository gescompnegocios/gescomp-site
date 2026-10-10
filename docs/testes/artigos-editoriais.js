// Tira as caixas de dentro dos 10 artigos e completa a lista final (Claude, 10/10/2026).
// Trabalha sobre o HTML atual (com os textos do Codex) e não muda nenhuma palavra do conteúdo:
// - card com ícone (.artigo-cards)   → .artigo-itens > .artigo-item (subtítulo + texto, sem ícone nem caixa)
// - aviso com ícone                  → .artigo-nota (fio à esquerda)
// - "Em resumo"                      → .artigo-resumo (entre fios, lista ✓)
// - números em destaque              → .artigo-numeros > .artigo-numero
// - passos com quadrado numerado     → ol.artigo-passos (número em texto)
// - linha do tempo                   → ol.artigo-linha-tempo (fio e ponto pelo CSS)
// - .proposta-aviso                  → .artigo-nota
// - lista final                      → todos os artigos, menos o atual (sai "Ver todos os assuntos")
// Uso: node docs/testes/artigos-editoriais.js [--seco]
const fs = require('fs'), path = require('path');
const PASTA = path.join(__dirname, '..', '..', 'publicar');
const seco = process.argv.includes('--seco');
const PAGINAS = ['informacoes', 'imposto-de-renda', 'mei', 'simples-nacional', 'abrir-empresa', 'pro-labore-e-lucros', 'departamento-pessoal', 'calendario-fiscal', 'fim-escala-6x1', 'novo-limite-mei'];
const HREF = p => p === 'informacoes' ? '/informacoes#reforma-tributaria' : '/' + p;
const SETA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6"></path></svg>';

// ---------- árvore HTML mínima (mesma de padronizar-paginas-artigo.js) ----------
const VAZIOS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
function analisar(h) {
  const raiz = { kids: [] }, pilha = [raiz]; let ult = 0, m;
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  const topo = () => pilha[pilha.length - 1];
  while ((m = re.exec(h))) {
    if (m.index > ult) topo().kids.push({ t: 'txt', s: h.slice(ult, m.index) });
    ult = re.lastIndex;
    if (!m[2]) { topo().kids.push({ t: 'txt', s: m[0] }); continue; }
    const tag = m[2].toLowerCase();
    if (m[1]) { const el = pilha.pop(); if (el.tag !== tag) throw new Error(`</${tag}> fecha <${el.tag}>`); el.close = m[0]; continue; }
    const el = { t: 'el', tag, open: m[0], kids: [], close: '' };
    topo().kids.push(el);
    if (tag === 'script' || tag === 'style') { const f = h.indexOf(`</${tag}>`, ult); el.kids.push({ t: 'txt', s: h.slice(ult, f) }); el.close = `</${tag}>`; ult = re.lastIndex = f + tag.length + 3; continue; }
    if (!VAZIOS.has(tag) && !/\/$/.test(m[3])) pilha.push(el);
  }
  if (ult < h.length) raiz.kids.push({ t: 'txt', s: h.slice(ult) });
  if (pilha.length !== 1) throw new Error('tags abertas: ' + pilha.slice(1).map(e => e.tag));
  return raiz.kids;
}
const ser = n => n.t === 'txt' ? n.s : n.open + n.kids.map(ser).join('') + n.close;
const els = ns => ns.filter(n => n.t === 'el');
const attr = (n, a) => { const m = n.open.match(new RegExp(`\\s${a}="([^"]*)"`)); return m ? m[1] : null; };
const texto = n => n.t === 'txt' ? (n.s.startsWith('<!--') ? '' : n.s) : (n.tag === 'svg' ? '' : n.kids.map(texto).join(''));
const limpo = s => s.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const achar = (ns, f, todos = []) => { for (const n of ns) if (n.t === 'el') { if (f(n)) todos.push(n); achar(n.kids, f, todos); } return todos; };
const dentro = n => n.kids.map(ser).join('');
// mesmo elemento com outra abertura (só a tag e, se houver, a classe); preserva atributos semânticos
const reabrir = (n, classe) => {
  const manter = (n.open.match(/\s(?:href|id|target|rel|datetime|aria-[\w-]+|data-[\w-]+|lang)="[^"]*"/g) || []).join('');
  return `<${n.tag}${classe ? ` class="${classe}"` : ''}${manter}>${dentro(n)}</${n.tag}>`;
};
const semEstilo = n => reabrir(n, attr(n, 'class') && !/^(texto|titulo-card)$/.test(attr(n, 'class')) ? attr(n, 'class') : null);
const ehIcone = n => n.t === 'el' && (/icone-solido/.test(n.open) || (n.tag === 'div' && els(n.kids).length === 1 && /icone-solido/.test(els(n.kids)[0].open)));
const corIcone = n => { const i = /icone-solido/.test(n.open) ? n : achar(n.kids, x => /icone-solido/.test(x.open))[0]; return (i && (attr(i, 'style') || '').match(/background: (#[0-9A-Fa-f]{6})/) || [])[1] || ''; };
const ehTituloP = n => n.tag === 'p' && /font-family: 'Bricolage/.test(attr(n, 'style') || '');

// ---------- conversões ----------
function cardItem(c) {
  const h3 = achar(c.kids, n => n.tag === 'h3')[0], pai = achar([c], n => els(n.kids).includes(h3))[0];
  const partes = els(pai.kids).filter(n => !ehIcone(n)).map(n => n === h3 ? `<h3 class="artigo-item-titulo">${dentro(n)}</h3>` : semEstilo(n));
  return `<div class="artigo-item">${partes.join('')}</div>`;
}
function aviso(c) {
  const cor = corIcone(c), alerta = /^#(D87319|E8952F)$/i.test(cor);
  const conteudo = achar(c.kids, n => n.tag === 'div' && !ehIcone(n) && els(n.kids).some(ehTituloP))[0];
  if (!conteudo) throw new Error('aviso sem título: ' + limpo(texto(c)).slice(0, 50));
  const partes = els(conteudo.kids).map(n => ehTituloP(n) ? `<p class="artigo-nota-titulo">${dentro(n)}</p>` : semEstilo(n));
  return `<div class="artigo-nota${alerta ? ' artigo-nota-alerta' : ''}">${partes.join('')}</div>`;
}
function resumo(c) {
  const corpo = els(c.kids).length === 1 && els(c.kids)[0].tag === 'div' ? els(c.kids)[0] : c;
  const partes = els(corpo.kids).map(n => {
    if (ehTituloP(n)) return `<p class="artigo-resumo-titulo">${dentro(n)}</p>`;
    if (n.tag === 'ul') return `<ul class="artigo-lista-check">${els(n.kids).map(li => { const sp = els(li.kids).filter(x => x.tag !== 'svg'); return `<li>${sp.length === 1 && sp[0].tag === 'span' ? dentro(sp[0]) : sp.map(ser).join('')}</li>`; }).join('')}</ul>`;
    return semEstilo(n);
  });
  return `<div class="artigo-resumo">${partes.join('')}</div>`;
}
function numeros(grade) {
  return `<div class="artigo-numeros">${els(grade.kids).map(c => {
    const ps = achar(c.kids, n => n.tag === 'p');
    return `<div class="artigo-numero"><p class="artigo-numero-valor">${dentro(ps[0])}</p>${ps.slice(1).map(p => `<p class="artigo-numero-legenda">${dentro(p)}</p>`).join('')}</div>`;
  }).join('')}</div>`;
}
function passosOuTempo(ol) {
  const passos = els(ol.kids).every(li => /^\d+$/.test(limpo(texto(achar(li.kids, n => /icone-solido/.test(n.open))[0] || { t: 'txt', s: '' }))));
  const itens = els(ol.kids).map(li => {
    const ic = achar(li.kids, n => /icone-solido/.test(n.open))[0], num = limpo(texto(ic));
    const corpo = els(li.kids).find(n => n.tag === 'div' && !/icone-solido/.test(n.open));
    const ps = els(corpo.kids).map(n => ehTituloP(n) ? `<p class="${passos ? 'artigo-passo-titulo' : 'artigo-marco-titulo'}">${n.kids.map(k => k.t === 'el' && k.tag === 'span' ? `<span>${dentro(k)}</span>` : ser(k)).join('')}</p>` : semEstilo(n)).join('');
    return passos ? `<li><span class="artigo-passo-num">${num}</span><div>${ps}</div></li>` : `<li>${ps}</li>`;
  });
  return `<ol class="${passos ? 'artigo-passos' : 'artigo-linha-tempo'}">${itens.join('')}</ol>`;
}

// substitui nós (por identidade) numa árvore
function trocarNos(ns, mapa) { return ns.map(n => mapa.has(n) ? { t: 'txt', s: mapa.get(n) } : (n.t === 'el' ? { ...n, kids: trocarNos(n.kids, mapa) } : n)); }

// ---------- lista final: todos os artigos ----------
const ITENS = (() => {
  const h = fs.readFileSync(path.join(PASTA, 'informacoes.html'), 'utf8'), r = {};
  const ini = fs.readFileSync(path.join(PASTA, 'index.html'), 'utf8');
  const ref = ini.match(/<a class="mudancas-item" href="\/informacoes#reforma-tributaria">[\s\S]*?<span class="mudancas-titulo">([\s\S]*?)<\/span><span class="mudancas-texto">([\s\S]*?)<\/span>/);
  r['/informacoes#reforma-tributaria'] = { t: ref[1], d: ref[2] };
  const lista = h.slice(h.indexOf('class="leia-mais"'));
  for (const m of lista.matchAll(/<a class="mudancas-item" href="([^"]+)"><span class="mudancas-titulo">([\s\S]*?)<\/span><span class="mudancas-texto">([\s\S]*?)<\/span>/g)) r[m[1]] = { t: m[2], d: m[3] };
  for (const p of PAGINAS) if (!r[HREF(p)]) throw new Error('sem título/texto para ' + HREF(p));
  return r;
})();
const itemLeia = href => `<li><a class="mudancas-item" href="${href}"><span class="mudancas-titulo">${ITENS[href].t}</span><span class="mudancas-texto">${ITENS[href].d}</span><span class="mudancas-ler">Ler artigo${SETA}</span></a></li>`;

function converter(pg, html) {
  const ini = html.indexOf('<main id="conteudo">') + '<main id="conteudo">'.length, fim = html.indexOf('</main>');
  let nos = analisar(html.slice(ini, fim));
  const n = { itens: 0, avisos: 0, resumos: 0, numeros: 0, passos: 0, tempo: 0, proposta: 0 };
  const tx = achar(nos, x => /class="artigo-texto"/.test(x.open))[0];
  const mapa = new Map();
  // grades de cards com ícone
  for (const g of achar(tx.kids, x => /class="artigo-cards"/.test(x.open))) { mapa.set(g, `<div class="artigo-itens">${els(g.kids).map(c => { n.itens++; return cardItem(/class="cartao/.test(c.open) ? c : achar([c], x => /class="cartao/.test(x.open))[0]); }).join('')}</div>`); }
  // grades de números (div cujos filhos são todos cartões sem ícone e sem lista)
  for (const g of achar(tx.kids, x => x.tag === 'div' && !/artigo-cards/.test(x.open) && els(x.kids).length > 1 && els(x.kids).every(c => /class="cartao/.test(c.open) && !achar(c.kids, y => /icone-solido/.test(y.open)).length && !achar(c.kids, y => y.tag === 'ul').length))) { n.numeros += els(g.kids).length; mapa.set(g, numeros(g)); }
  const jaTratado = x => [...mapa.keys()].some(k => k === x || achar([k], y => y === x).length);
  for (const c of achar(tx.kids, x => /class="cartao/.test(x.open))) {
    if (jaTratado(c)) continue;
    if (achar(c.kids, y => y.tag === 'ul').length && !achar(c.kids, y => /icone-solido/.test(y.open)).length) { n.resumos++; mapa.set(c, resumo(c)); }
    else if (achar(c.kids, y => /icone-solido/.test(y.open)).length) { n.avisos++; mapa.set(c, aviso(c)); }
    else throw new Error('cartão sem tipo: ' + limpo(texto(c)).slice(0, 60));
  }
  for (const ol of achar(tx.kids, x => x.tag === 'ol' && els(x.kids).length && els(x.kids).every(li => achar(li.kids, y => /icone-solido/.test(y.open)).length))) {
    if (jaTratado(ol)) continue;
    const h = passosOuTempo(ol); if (/artigo-passos/.test(h)) n.passos++; else n.tempo++; mapa.set(ol, h);
  }
  nos = trocarNos(nos, mapa);
  let corpo = nos.map(ser).join('');
  // aviso das páginas de proposta
  corpo = corpo.replace(/class="artigo-secao proposta-aviso"/g, () => { n.proposta++; return 'class="artigo-secao artigo-nota"'; });
  // lista final: todos os artigos, menos o atual
  const lis = PAGINAS.filter(p => p !== pg).map(p => itemLeia(HREF(p))).join('');
  corpo = corpo.replace(/(<section[^>]*class="leia-mais"[^>]*><div class="leia-mais-interno">[\s\S]*?)<ul class="mudancas-lista">[\s\S]*?<\/ul>(?:<a class="leia-mais-todos"[\s\S]*?<\/a>)?(<\/div><\/section>)/, (_, a, b) => a + `<ul class="mudancas-lista">${lis}</ul>` + b);
  return { html: html.slice(0, ini) + corpo + html.slice(fim), n };
}

// ---------- travas ----------
const textosMain = h => { const r = []; (function v(ns) { for (const n of ns) { if (n.t === 'txt') { const s = limpo(n.s.startsWith('<!--') ? '' : n.s); if (s) r.push(s); } else if (n.tag !== 'svg') v(n.kids); } })(analisar(h.slice(h.indexOf('<main id="conteudo">') + 20, h.indexOf('</main>')))); return r; };
const contar = a => a.reduce((m, x) => (m[x] = (m[x] || 0) + 1, m), {});
const diferenca = (a, b) => { const ca = contar(a), cb = contar(b), r = []; for (const k in ca) for (let i = 0; i < ca[k] - (cb[k] || 0); i++) r.push(k); return r; };
const extrasLista = new Set(['Ler artigo', ...Object.values(ITENS).flatMap(i => [limpo(i.t), limpo(i.d.replace(/<[^>]+>/g, ''))])]);

let falhou = false;
for (const pg of PAGINAS) {
  const arq = path.join(PASTA, pg + '.html'), antes = fs.readFileSync(arq, 'utf8');
  let r; try { r = converter(pg, antes); } catch (e) { falhou = true; console.log(pg, 'PARADO:', e.message); continue; }
  const h = r.html, erros = [];
  const saiu = diferenca(textosMain(antes), textosMain(h)).filter(s => !extrasLista.has(s) && s !== 'Ver todos os assuntos');
  const entrou = diferenca(textosMain(h), textosMain(antes)).filter(s => !extrasLista.has(s));
  if (saiu.length) erros.push('texto que saiu: ' + JSON.stringify(saiu.slice(0, 4)));
  if (entrou.length) erros.push('texto que entrou: ' + JSON.stringify(entrou.slice(0, 4)));
  const hrefs = x => new Set([...x.matchAll(/href="([^"]*)"/g)].map(m => m[1]));
  const hA = hrefs(antes), hD = hrefs(h), artigos = new Set(PAGINAS.map(HREF));
  const faltam = [...hA].filter(x => !hD.has(x) && x !== '/informacoes#outros-assuntos'), novos = [...hD].filter(x => !hA.has(x) && !artigos.has(x));
  if (faltam.length || novos.length) erros.push('links: faltam ' + faltam + ' | novos ' + novos);
  const ids = x => [...x.matchAll(/\sid="([^"]*)"/g)].map(m => m[1]), idsD = new Set(ids(h));
  const semId = ids(antes).filter(i => !idsD.has(i)); if (semId.length) erros.push('ids sumiram: ' + semId);
  if (antes.slice(0, antes.indexOf('<main')) !== h.slice(0, h.indexOf('<main')) || antes.slice(antes.indexOf('</main>')) !== h.slice(h.indexOf('</main>'))) erros.push('fora do <main> mudou');
  const tx = h.slice(h.indexOf('<div class="artigo-texto">'), h.indexOf('class="leia-mais"'));
  for (const [nome, re] of [['cartao', /class="cartao/], ['icone-solido', /icone-solido/], ['border-radius', /border-radius/], ['proposta-aviso', /proposta-aviso/]]) if (re.test(tx)) erros.push('sobrou ' + nome);
  const lista = h.slice(h.indexOf('class="leia-mais"')), hl = [...lista.matchAll(/class="mudancas-item" href="([^"]+)"/g)].map(m => m[1]);
  if (hl.length !== PAGINAS.length - 1 || hl.includes(HREF(pg))) erros.push('lista final com ' + hl.length + ' itens');
  analisar(h.slice(h.indexOf('<main'), h.indexOf('</main>') + 7));
  if (erros.length) { falhou = true; console.log(pg, 'PARADO:', erros.join('; ')); continue; }
  if (!seco) fs.writeFileSync(arq, h);
  console.log(pg.padEnd(22), seco ? 'seco' : 'GRAVADO', JSON.stringify(r.n));
}
process.exit(falhou ? 1 : 0);
