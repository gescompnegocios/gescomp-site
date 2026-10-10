// Dá cara de artigo às 10 páginas de Informações (Claude, 10/10/2026):
// - corpo numa cor só, em coluna de leitura (.artigo-corpo > .artigo-texto) com sumário lateral (.artigo-sumario);
// - perguntas frequentes viram subtítulos (h3.artigo-pergunta) dentro da seção a que se referem;
// - "Veja também" e a lista de assuntos de /informacoes viram a lista editorial da inicial (.mudancas-*), sem foto e sem número.
// Não muda nenhuma palavra do conteúdo. Uso: node docs/testes/padronizar-paginas-artigo.js [--seco]
const fs = require('fs'), path = require('path');
const PASTA = path.join(__dirname, '..', '..', 'publicar');
const seco = process.argv.includes('--seco');

// Pergunta (início do texto) → seção (início do h2) onde ela entra
const MAPA = {
  informacoes: { 'Vou pagar mais': 'Reforma tributária', 'O que são a CBS': 'Reforma tributária', 'O que é o Imposto Seletivo': 'E para a minha empresa', 'Preciso mudar de sistema': 'O que fazer agora' },
  'imposto-de-renda': { 'A nova regra já vale': 'O que mudou', 'Vou receber uma restituição': 'O que mudou', 'Dividendos pagam': 'Para sócios', 'Preciso fazer algo agora': 'O que separar', 'A GESCOMP faz a minha declaração': 'O que separar' },
  mei: { 'Posso ter mais de um MEI': 'Quem pode ser MEI', 'Posso pagar o DAS atrasado': 'Quanto o MEI paga', 'Perdi o prazo da DASN': 'Obrigações do MEI', 'O MEI precisa de contador': 'Obrigações do MEI' },
  'calendario-fiscal': { 'Como não esquecer': 'Todo mês', 'E se eu perder': 'Todo mês', 'O dia 20 cai': 'Todo mês' },
  'abrir-empresa': { 'Quanto custa': 'Passo a passo', 'Preciso de contador': 'Passo a passo', 'Quanto tempo': 'Passo a passo', 'Posso abrir a empresa no endereço': 'Documentos' },
  'departamento-pessoal': { 'O MEI pode ter funcionário': 'Como contratar', 'O que é o FGTS Digital': 'Obrigações de todo mês', 'A isenção de R$ 5 mil': 'Desconto do INSS', 'A GESCOMP faz cálculos': 'Férias e desligamento' },
  'pro-labore-e-lucros': { 'MEI tem pró-labore': 'Como funciona o pró-labore', 'Posso retirar dinheiro': 'O que paga cada tipo', 'Preciso pagar INSS sobre o lucro': 'O que paga cada tipo', 'Preciso declarar os lucros': 'A nova regra dos lucros' },
  'simples-nacional': { 'Já sou do Simples': 'Prazos de 2026', 'Perdi o prazo de 15': 'Prazos de 2026', 'O ano-teste de 2026': 'O que muda em 2027', 'Quando entrego a declaração': 'Prazos de 2026' },
  'fim-escala-6x1': { 'A aprovação na Câmara': 'Em que etapa está a PEC', 'Toda empresa deve mudar': 'O que a empresa pode organizar' },
  'novo-limite-mei': { 'Já posso faturar': 'O que propõe o PLP 108', 'Os valores de 2027 e 2028': 'Há outra proposta' },
};
// Páginas de proposta não tinham "Veja também": usam itens da lista de /informacoes (mesmos títulos e textos)
const LEIA_PROPOSTA = { 'fim-escala-6x1': ['/novo-limite-mei', '/departamento-pessoal', '/calendario-fiscal'], 'novo-limite-mei': ['/fim-escala-6x1', '/mei', '/simples-nacional'] };
const SETA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14 M13 6l6 6-6 6"></path></svg>';

// ---------- árvore HTML mínima (preserva o texto original de cada tag) ----------
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
const semAttr = (open, a) => open.replace(new RegExp(`\\s${a}="[^"]*"`), '');
const texto = n => n.t === 'txt' ? (n.s.startsWith('<!--') ? '' : n.s) : (n.tag === 'svg' ? '' : n.kids.map(texto).join(''));
const limpo = s => s.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const achar = (ns, f, todos = []) => { for (const n of ns) if (n.t === 'el') { if (f(n)) todos.push(n); achar(n.kids, f, todos); } return todos; };
const el = (tag, atributos, kids) => ({ t: 'el', tag, open: `<${tag}${atributos ? ' ' + atributos : ''}>`, kids, close: `</${tag}>` });
const bruto = s => ({ t: 'txt', s });
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48).replace(/-$/, '');

// Lista de assuntos de /informacoes (título e texto por destino), para as páginas de proposta
const assuntos = (() => {
  const h = fs.readFileSync(path.join(PASTA, 'informacoes.html'), 'utf8'), r = {};
  for (const m of h.matchAll(/<a href="(\/[a-z0-9-]+)" style="display: block[\s\S]*?<h3 class="titulo-card"[^>]*>([\s\S]*?)<\/h3><p class="texto"[^>]*>([\s\S]*?)<\/p>/g)) r[m[1]] = { t: m[2], d: m[3] };
  return r;
})();
const itemLeia = (href, titulo, desc) => `<li><a class="mudancas-item" href="${href}"><span class="mudancas-titulo">${titulo}</span><span class="mudancas-texto">${desc}</span><span class="mudancas-ler">Ler artigo${SETA}</span></a></li>`;

function converter(pg, html) {
  const ini = html.indexOf('<main id="conteudo">') + '<main id="conteudo">'.length, fim = html.indexOf('</main>');
  const nos = analisar(html.slice(ini, fim)), topo = els(nos);
  const abertura = topo.find(n => attr(n, 'id') === 'inicio');
  const faixa = topo.filter(n => n.tag === 'section' && attr(n, 'id') && /background: #0B5963/.test(n.open)).pop();
  const iA = topo.indexOf(abertura), iF = faixa ? topo.indexOf(faixa) : topo.length;
  let corpo = topo.slice(iA + 1, iF);
  // Páginas de proposta: o conteúdo vem dentro de <article class="conteudo-artigo">
  if (corpo.length === 1 && /conteudo-artigo/.test(corpo[0].open)) corpo = els(corpo[0].kids);
  const idsUsados = new Set([...html.matchAll(/\sid="([^"]*)"/g)].map(m => m[1]));

  const secoes = [], perguntas = [], extras = []; let fontes = null, leia = null;
  for (const bloco of corpo) {
    // tira o contêiner de largura total (section/article > div max-width container)
    const filhos = els(bloco.kids);
    const interno = filhos.length === 1 && filhos[0].tag === 'div' && /max-width: var\(--container\)/.test(filhos[0].open) ? filhos[0].kids : bloco.kids;
    const h2 = achar(interno, n => n.tag === 'h2')[0], tit = h2 ? limpo(texto(h2)) : '';
    if (tit === 'Perguntas frequentes') {
      for (const d of achar(interno, n => n.tag === 'details')) {
        const sum = els(d.kids).find(n => n.tag === 'summary'), span = els(sum.kids).find(n => n.tag === 'span') || sum;
        const resp = els(d.kids).filter(n => n !== sum).map(p => ({ ...p, open: semAttr(p.open, 'style') }));
        perguntas.push({ q: limpo(texto(span)), qh: span.kids.map(ser).join(''), resp });
      }
      const f = achar(interno, n => /artigo-fontes"/.test(n.open) && /class="artigo-fontes"/.test(n.open))[0]; if (f) fontes = f;
      continue;
    }
    if (/class="artigo-fontes"/.test(bloco.open)) { fontes = bloco; continue; }
    if (/class="cta-contexto"/.test(bloco.open)) { extras.push(bloco); continue; }
    if (tit === 'Veja também' || attr(bloco, 'id') === 'outros-assuntos' || /artigo-outros/.test(bloco.open)) { leia = { bloco, interno, tit }; continue; }
    // seção comum do artigo; um h2 aninhado numa grade lado a lado (ex.: "O que fazer agora") vira seção própria, empilhada
    const partes = [[]];
    for (const n of interno) {
      const aninhado = n.t === 'el' && n.tag !== 'h2' && achar(n.kids, x => x.tag === 'h2').length;
      if (aninhado) partes.push(els(n.kids).flatMap(c => achar(c.kids, x => x.tag === 'h2').length && c.tag === 'div' ? c.kids : [c]));
      else partes[partes.length - 1].push(n);
    }
    partes.forEach((kids, i) => {
      const h = achar(kids, n => n.tag === 'h2')[0], t = h ? limpo(texto(h)) : '';
      let id = i === 0 ? attr(bloco, 'id') : null;
      if (!id && h) { id = slug(t); let k = 2; while (idsUsados.has(id)) id = slug(t) + '-' + k++; idsUsados.add(id); }
      const classe = ['artigo-secao', i === 0 ? attr(bloco, 'class') : null].filter(Boolean).join(' ');
      secoes.push({ tit: t, id, no: el('section', `${id ? `id="${id}" ` : ''}class="${classe}"`, kids) });
    });
  }

  // perguntas → subtítulos dentro da seção mapeada (antes de uma chamada de contato que feche a seção)
  const mapa = MAPA[pg], usadas = new Set();
  for (const p of perguntas) {
    const chave = Object.keys(mapa).find(k => p.q.startsWith(k)); if (!chave) throw new Error('pergunta sem destino: ' + p.q);
    usadas.add(chave);
    const alvo = secoes.find(s => s.tit.startsWith(mapa[chave])); if (!alvo) throw new Error('seção não encontrada: ' + mapa[chave]);
    const novo = [bruto(`<h3 class="artigo-pergunta">${p.qh}</h3>`), ...p.resp];
    const k = alvo.no.kids, ult = els(k).pop();
    if (ult && /class="cta-contexto"/.test(ult.open)) k.splice(k.indexOf(ult), 0, ...novo); else k.push(...novo);
  }
  if (usadas.size !== Object.keys(mapa).length) throw new Error('perguntas do mapa não encontradas: ' + Object.keys(mapa).filter(k => !usadas.has(k)));

  // sumário
  const itens = secoes.filter(s => s.tit && s.id).map(s => `<li><a href="#${s.id}">${s.tit}</a></li>`).join('');
  const sumario = `<nav class="artigo-sumario" aria-labelledby="sumario-titulo"><p class="artigo-sumario-titulo" id="sumario-titulo">Neste artigo</p><ol>${itens}</ol></nav>`;

  // lista de outros artigos (mesma aparência do bloco "O que está mudando" da inicial)
  let leiaHtml = '';
  if (leia) {
    const lis = [], cab = [], fim2 = [];
    if (/artigo-outros/.test(leia.bloco.open)) {
      for (const href of LEIA_PROPOSTA[pg]) { const a = assuntos[href]; if (!a) throw new Error('assunto sem card: ' + href); lis.push(itemLeia(href, a.t, a.d)); }
      const todos = achar(leia.interno, n => n.tag === 'a').find(a => /informacoes/.test(attr(a, 'href')));
      fim2.push(`<a class="leia-mais-todos" href="${attr(todos, 'href')}">${todos.kids.map(ser).join('')}${SETA}</a>`);
      cab.push('<h2 class="titulo-secao">Veja também</h2>');
    } else {
      for (const n of els(leia.interno)) {
        if (n.tag === 'h2') cab.push(`<h2 class="titulo-secao">${n.kids.map(ser).join('')}</h2>`);
        else if (n.tag === 'p') cab.push(ser(n));
        else if (achar([n], x => x.tag === 'h3').length) {
          for (const a of achar([n], x => x.tag === 'a' && achar(x.kids, y => y.tag === 'h3').length)) {
            const h3 = achar(a.kids, y => y.tag === 'h3')[0], p = achar(a.kids, y => y.tag === 'p')[0];
            lis.push(itemLeia(attr(a, 'href'), h3.kids.map(ser).join(''), p.kids.map(ser).join('')));
          }
        } else for (const a of achar([n], x => x.tag === 'a')) fim2.push(`<a class="leia-mais-todos" href="${attr(a, 'href')}">${limpo(texto(a))}${SETA}</a>`);
      }
    }
    const id = attr(leia.bloco, 'id');
    leiaHtml = `<section${id ? ` id="${id}"` : ''} class="leia-mais"><div class="leia-mais-interno">${cab.join('')}<ul class="mudancas-lista">${lis.join('')}</ul>${fim2.join('')}</div></section>`;
  }

  const textoArtigo = [...secoes.map(s => ser(s.no)), ...extras.map(ser), fontes ? ser(fontes) : ''].join('\n');
  const novoMain = [
    ...nos.slice(0, nos.indexOf(abertura) + 1).map(ser),
    `\n<div class="artigo-corpo">${sumario}<div class="artigo-texto">\n${textoArtigo}\n</div></div>\n`,
    leiaHtml + '\n',
    ...(faixa ? nos.slice(nos.indexOf(faixa)).map(ser) : ['\n']),
  ].join('');
  return { html: html.slice(0, ini) + novoMain + html.slice(fim), n: { secoes: secoes.length, perguntas: perguntas.length, leia: (leiaHtml.match(/<li>/g) || []).length, fontes: !!fontes, extras: extras.length }, titulos: secoes.filter(s => s.tit).map(s => s.tit) };
}

// ---------- travas ----------
const textosMain = h => { const i = h.indexOf('<main'), f = h.indexOf('</main>'); const r = []; (function v(ns) { for (const n of ns) { if (n.t === 'txt') { const s = limpo(n.s.startsWith('<!--') ? '' : n.s); if (s) r.push(s); } else if (n.tag !== 'svg') v(n.kids); } })(analisar(h.slice(h.indexOf('>', i) + 1, f))); return r; };
const contar = a => a.reduce((m, x) => (m[x] = (m[x] || 0) + 1, m), {});
const diferenca = (a, b) => { const ca = contar(a), cb = contar(b), r = []; for (const k in ca) for (let i = 0; i < ca[k] - (cb[k] || 0); i++) r.push(k); return r; };

let falhou = false;
for (const pg of Object.keys(MAPA)) {
  const arq = path.join(PASTA, pg + '.html'), antes = fs.readFileSync(arq, 'utf8');
  let r; try { r = converter(pg, antes); } catch (e) { falhou = true; console.log(pg, 'PARADO:', e.message); continue; }
  const h = r.html, erros = [];
  const tA = textosMain(antes), tD = textosMain(h);
  const extrasOk = new Set(['Neste artigo', 'Ler artigo', ...r.titulos, ...Object.values(assuntos).flatMap(a => [limpo(a.t), limpo(a.d)])]);
  // nas páginas de proposta, a linha "A · B" vira a lista "Veja também"
  const proposta = !!LEIA_PROPOSTA[pg];
  const saiu = diferenca(tA, tD).filter(s => !['Perguntas frequentes', 'Ler agora', ...(proposta ? ['·'] : [])].includes(s));
  const entrou = diferenca(tD, tA).filter(s => !extrasOk.has(s) && !(proposta && s === 'Veja também'));
  if (saiu.length) erros.push('texto que saiu: ' + JSON.stringify(saiu.slice(0, 4)));
  if (entrou.length) erros.push('texto que entrou: ' + JSON.stringify(entrou.slice(0, 4)));
  const hrefs = x => new Set([...x.matchAll(/href="([^"]*)"/g)].map(m => m[1]));
  const hA = hrefs(antes), hD = hrefs(h);
  const faltam = [...hA].filter(x => !hD.has(x)), novos = [...hD].filter(x => !hA.has(x) && !x.startsWith('#') && !(LEIA_PROPOSTA[pg] || []).includes(x));
  if (faltam.length || novos.length) erros.push('links: faltam ' + faltam + ' | novos ' + novos);
  const ids = x => [...x.matchAll(/\sid="([^"]*)"/g)].map(m => m[1]);
  const idsD = new Set(ids(h)), semId = ids(antes).filter(i => !idsD.has(i)); if (semId.length) erros.push('ids sumiram: ' + semId);
  if (ids(h).length !== idsD.size) erros.push('id repetido');
  if (antes.slice(0, antes.indexOf('<main')) !== h.slice(0, h.indexOf('<main')) || antes.slice(antes.indexOf('</main>')) !== h.slice(h.indexOf('</main>'))) erros.push('fora do <main> mudou (JSON-LD, cabeçalho ou rodapé)');
  if (/<details/.test(h.slice(h.indexOf('<main'), h.indexOf('</main>')))) erros.push('sobrou <details>');
  for (const a of [...h.matchAll(/href="#([^"]+)"/g)].map(m => m[1])) if (!idsD.has(a)) erros.push('âncora sem destino: #' + a);
  analisar(h.slice(h.indexOf('<main'), h.indexOf('</main>') + 7));
  if (erros.length) { falhou = true; console.log(pg, 'PARADO:', erros.join('; ')); continue; }
  if (!seco) fs.writeFileSync(arq, h);
  console.log(pg.padEnd(22), seco ? 'seco' : 'GRAVADO', JSON.stringify(r.n));
}
process.exit(falhou ? 1 : 0);
