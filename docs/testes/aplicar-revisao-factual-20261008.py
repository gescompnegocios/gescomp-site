"""Aplicação pontual e auditável da revisão de 08/10/2026; não acessa a rede.

Exige textos antigos presentes e Git base conhecido. Sem --aplicar, só confere.
Não toca em CSS/JS, contatos, dados pessoais, imagens ou seção #rio.
"""
from pathlib import Path
import json
import re
import sys
import subprocess
from html import escape, unescape
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / 'publicar'
OUT = ROOT / 'docs/evidencias/2026-10-08/revisao-factual'
DATA = '2026-10-08'
BASE = '9b67307'
sys.stdout.reconfigure(encoding='utf-8')

def texto(s):
    s = re.sub(r'<svg\b[\s\S]*?</svg>', '', s)
    return ' '.join(unescape(re.sub(r'<[^>]+>', ' ', s)).split())

def link(title, url):
    return '<a href="' + escape(url, quote=True) + '" target="_blank" rel="noopener" style="color: var(--titulo); text-decoration: underline; text-underline-offset: 3px">' + escape(title) + '<span class="so-leitor"> (abre em nova aba)</span></a>'

def sync_ld(raw, article):
    faqs = {}
    for d in re.findall(r'<details\b[\s\S]*?</details>', raw):
        summary = re.search(r'<summary\b[^>]*>([\s\S]*?)</summary>', d)
        if summary:
            faqs[texto(summary[1])] = texto(d[summary.end():].removesuffix('</details>'))
    def patch(m):
        graph = json.loads(m[1])
        def walk(o):
            if isinstance(o, dict):
                if o.get('@type') == 'Question' and 'acceptedAnswer' in o:
                    assert o['name'] in faqs, ('FAQ sem texto visível', o['name'])
                    o['acceptedAnswer']['text'] = faqs[o['name']]
                if o.get('@type') == 'Article' or (o.get('@type') in ('WebPage','CollectionPage') and 'dateModified' in o):
                    o['dateModified'] = DATA
                for v in o.values(): walk(v)
            elif isinstance(o, list):
                for v in o: walk(v)
        walk(graph)
        return '<script type="application/ld+json">\n' + json.dumps(graph, ensure_ascii=False, indent=1) + '\n</script>'
    return re.sub(r'<script type="application/ld\+json">\s*([\s\S]*?)\s*</script>', patch, raw)

def main():
    assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT).decode().strip().startswith(BASE), 'Reavaliar a base Git antes de aplicar.'
    corr = json.loads((OUT/'correcoes.json').read_text(encoding='utf-8'))
    fontes = json.loads((OUT/'fontes.json').read_text(encoding='utf-8'))['paginas']
    edits = {}; errors = []; changes = []; md_misses = []
    for slug, pairs in corr.items():
        path = PUB/(slug+'.html'); raw = path.read_text(encoding='utf-8')
        before = raw
        head, sep, body = raw.partition('<body>')
        assert sep
        for old, new in pairs:
            count = body.count(old)
            if not count:
                errors.append([slug, old]); continue
            body = body.replace(old, escape(new, quote=False))
            changes.append({'pagina':slug,'antes':old,'depois':new,'ocorrencias':count})
        if slug != 'index':
            body = re.sub(r'(?i)(atualizado em |consulta de |consultadas em )\d{2}/10/2026', lambda m: m[1]+'08/10/2026', body)
            body = body.replace('<time datetime="2026-10-06">06/10/2026</time>', '<time datetime="2026-10-08">08/10/2026</time>')
            links = [link(t,u) for t,u in fontes[slug]]
            if slug in ('fim-escala-6x1','novo-limite-mei'):
                mark = '<h2 class="titulo-secao">Fontes oficiais e acompanhamento</h2>'
                pos = body.index(mark)
                rest = body[pos:]
                ul = re.search(r'<ul>[\s\S]*?</ul>', rest)
                assert ul
                body = body[:pos] + rest[:ul.start()] + '<ul>' + ''.join('<li>'+a+'</li>' for a in links) + '</ul>' + rest[ul.end():]
            else:
                base = re.search(r'<p\b[^>]*>(?:Base:|Conteúdo informativo, atualizado em)[\s\S]*?</p>', body)
                assert base, ('Fontes não localizadas',slug)
                content = '<strong>Fontes oficiais e base legal:</strong><br>' + '<br>'.join(links) + '<br>Conteúdo conferido em <time datetime="2026-10-08">08/10/2026</time>. Os prazos gerais podem ter exceções e prorrogações; consulte a norma aplicável antes de decidir.'
                tag = base[0][:base[0].index('>')+1]
                body = body[:base.start()] + tag + content + '</p>' + body[base.end():]
        raw = sync_ld(head+sep+body, slug)
        if raw != before: edits[path] = raw

    # Mesmos resumos de cards nas referências cruzadas e no arquivo llms.
    summaries = [
        ('Quem fica isento até R$ 5 mil, o que muda para sócios de empresas e como se preparar para a declaração de 2027.', 'Redução do IR mensal até R$ 5 mil de rendimentos tributáveis, regras para sócios e declaração de 2027.'),
        ('Como funciona, os limites e o que decidir até 30 de outubro de 2026 por causa da reforma.', 'Limites, cálculo e prazos diferentes de 15 e 30 de outubro de 2026 para as opções de 2027.')
    ]
    for path in PUB.glob('*.html'):
        raw = edits.get(path, path.read_text(encoding='utf-8')); before = raw
        for old,new in summaries: raw = raw.replace(old,new)
        if before != raw: edits[path] = raw
    path = PUB/'llms.txt'; raw = path.read_text(encoding='utf-8')
    raw = raw.replace('Quem fica isento até R$ 5 mil, o que muda para sócios de empresas e como se preparar para a declaração de 2027.', summaries[0][1])
    raw = raw.replace('Como funciona, os limites e o que decidir até 30 de outubro de 2026 por causa da reforma.', summaries[1][1])
    edits[path] = raw

    # Mantém as fontes de revisão com os mesmos textos; sem reformatar todo o documento.
    for path in (ROOT/'conteudo').glob('*.md'):
        if path.name == 'LEIA-ME.md': continue
        slug = path.stem.split('-',1)[1]
        if slug not in corr: continue
        raw = path.read_text(encoding='utf-8')
        for old,new in corr[slug]+summaries:
            if old in raw: raw = raw.replace(old,new)
            elif old in texto(subprocess.check_output(['git','show',BASE+':publicar/'+slug+'.html'],cwd=ROOT).decode('utf-8')):
                md_misses.append([path.name, old])
        if slug != 'index':
            raw = re.sub(r'(?i)(atualizado em |consulta de |consultadas em )\d{2}/10/2026', lambda m: m[1]+'08/10/2026', raw)
            # Troca a referência genérica pela lista oficial desta revisão.
            raw = re.sub(r'^(?:Base:|Conteúdo informativo, atualizado em).*$', '', raw, flags=re.M)
            raw += '\n\n## Fontes oficiais — consulta em 08/10/2026\n\n' + '\n'.join('- ['+t+']('+u+')' for t,u in fontes[slug]) + '\n'
        edits[path] = raw

    # Apenas URLs cujo conteúdo foi corrigido recebem lastmod novo.
    path = PUB/'sitemap.xml'; raw = path.read_text(encoding='utf-8')
    slugs = {p.stem for p in edits if p.suffix=='.html'}
    def sitemap(m):
        slug = m[1].rstrip('/').rsplit('/',1)[-1]
        if slug == 'gescompnegocios.com.br': slug = 'index'
        return m[0].replace(m[2],DATA) if slug in slugs else m[0]
    edits[path] = re.sub(r'<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>', sitemap, raw)

    report = {'base':BASE,'data':DATA,'aplicar':'--aplicar' in sys.argv,'erros':errors,'arquivos':[str(p.relative_to(ROOT)) for p in edits],'mudancas':changes,'pendenciasMarkdown':md_misses}
    (OUT/'aplicacao.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'erros':errors,'arquivos':len(edits),'substituicoes':len(changes),'pendenciasMarkdown':md_misses},ensure_ascii=False))
    if errors: sys.exit(1)
    if '--aplicar' in sys.argv:
        for path, raw in edits.items(): path.write_text(raw,encoding='utf-8',newline='\n')

if __name__=='__main__': main()
