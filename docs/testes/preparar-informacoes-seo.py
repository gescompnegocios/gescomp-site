"""Preparação pontual de HTML estático e imagens CC0; não é etapa de build."""
from pathlib import Path
import copy
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / 'publicar'
EVID = ROOT / 'docs/evidencias/2026-10-06/seo-informacoes'
ORIGIN = 'https://gescompnegocios.com.br'
DATE = '2026-10-06'
if (PUB / 'fim-escala-6x1.html').exists() or (PUB / 'novo-limite-mei.html').exists():
    raise SystemExit('Preparação já executada. Não repetir sobre a entrega: este script documenta a preparação pontual na base da4904d.')
Q = '"'
LD = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)

def read(path):
    return path.read_text(encoding='utf-8')

def write(path, value):
    path.write_text(value, encoding='utf-8', newline='\n')

def meta(s, name, value):
    pattern = r'(<meta (?:name|property)="' + re.escape(name) + r'" content=")[^"]*(")'
    result, count = re.subn(pattern, lambda m: m[1] + html.escape(value, quote=True) + m[2], s)
    assert count == 1, (name, count)
    return result

def structured(s, graph):
    return LD.sub(lambda _: '<script type="application/ld+json">\n' + json.dumps(
        {'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, indent=1
    ) + '\n</script>', s, count=1)

def esc(s):
    return html.escape(s, quote=True)

photos = [
    ('1546015', 'assunto-escala-6x1', 'https://c.pxhere.com/photos/7a/09/alarm_alarm_clock_analog_ballpens_blur_clock_computer_curtain-1546015.jpg!d'),
    ('998183', 'capa-escala-6x1', 'https://c.pxhere.com/photos/ed/00/alarm_clock_chair_clock_table_time-998183.jpg!d'),
    ('699196', 'assunto-novo-limite-mei', 'https://c.pxhere.com/photos/58/26/desk_organize_office_space_organization_desk_top_notebook_pen_office-699196.jpg!d'),
    ('970472', 'capa-novo-limite-mei', 'https://c.pxhere.com/photos/a2/db/keyboard_apple_input_keys_hardware_pc_calculator_tap-970472.jpg!d'),
]
manifest = []
for ident, name, url in photos:
    src = EVID / ('foto-original-' + ident + '.jpg')
    image = Image.open(src).convert('RGB')
    outputs = []
    sizes = [(name, (1200, 900))]
    if name.startswith('capa-'):
        sizes.append(('og-' + name.removeprefix('capa-'), (1200, 630)))
    for output_name, size in sizes:
        directory = PUB / ('assets/img' if output_name.startswith('og-') else 'assets/img/fotos')
        path = directory / (output_name + '-cc0-20261006.webp')
        ImageOps.fit(image, size, method=Image.Resampling.LANCZOS).save(path, 'WEBP', quality=84, method=6)
        assert path.stat().st_size < 300000, path
        outputs.append({'path': path.relative_to(ROOT).as_posix(), 'size': size, 'bytes': path.stat().st_size})
    manifest.append({'id': ident, 'source': 'https://pxhere.com/en/photo/' + ident,
                     'download': url, 'license': 'CC0', 'nativeSize': image.size,
                     'originalSha256': hashlib.sha256(src.read_bytes()).hexdigest(), 'outputs': outputs})
write(EVID / 'fontes-fotos.json', json.dumps(manifest, ensure_ascii=False, indent=2))

home = read(PUB / 'index.html')
home_graph = json.loads(LD.search(home)[1])['@graph']
business = next(g for g in home_graph if g['@type'] == 'AccountingService')
person = copy.deepcopy(business['employee'])
person.update({'@id': ORIGIN + '/#gabriela', 'url': ORIGIN + '/#sobre',
               'worksFor': {'@id': ORIGIN + '/#empresa'}})

topics = [
    {'slug': 'fim-escala-6x1', 'label': 'Fim da escala 6x1',
     'headline': 'Fim da escala 6x1: entenda a proposta',
     'title': 'Fim da escala 6x1: situação da PEC e jornada | GESCOMP',
     'description': 'Entenda a proposta de fim da escala 6x1, a situação da PEC 221/2019 e o que empresas precisam acompanhar. Fontes oficiais e orientação da GESCOMP.',
     'intro': 'A proposta prevê dois dias de descanso e redução da jornada semanal. Veja o que já avançou no Congresso e o que ainda depende de aprovação.',
     'card': 'O que propõe a PEC, como está a tramitação e o que acompanhar antes de mudar a jornada da equipe.',
     'image': 'escala-6x1', 'alt': 'Relógio sobre uma mesa de madeira, fotografia ilustrativa',
     'message': 'trabalhista',
     'sections': [
        ('A proposta já está valendo?', '<p><strong>A proposta ainda não é uma regra em vigor.</strong> Na consulta de 06/10/2026, a PEC 221/2019 estava em discussão no Senado. A aprovação na Câmara e na comissão do Senado não encerra o processo de mudança da Constituição.</p>'),
        ('O que está sendo discutido', '<p>O texto enviado pela Câmara prevê jornada máxima de 40 horas por semana, distribuídas em cinco dias, com dois dias de repouso e sem redução salarial. Há previsão de transição; prazos e exceções devem ser lidos no texto que vier a ser promulgado.</p>'),
        ('Em que etapa está a PEC?', '<p>A Câmara aprovou a proposta em dois turnos em maio de 2026. O Senado informou que os debates em Plenário começariam em 6 de outubro, após a análise da Comissão de Constituição e Justiça. A tramitação pode mudar: confira os links oficiais abaixo antes de tomar uma decisão.</p>'),
        ('O que a empresa pode organizar agora', '<ul><li>Mapear os horários, as folgas e as necessidades de atendimento.</li><li>Conferir contratos, registros de ponto e convenções coletivas.</li><li>Simular cenários de organização da equipe e de custos.</li><li>Separar as regras atuais das mudanças que ainda são propostas.</li></ul><p>A GESCOMP ajuda a organizar informações de folha e cálculos trabalhistas. Mudanças de jornada também devem considerar as regras da categoria e a orientação jurídica aplicável. Veja o guia de <a href="/departamento-pessoal">funcionários e folha de pagamento</a>.</p>'),
     ],
     'faq': [('A aprovação na Câmara já muda a escala?', 'Não. A proposta precisa concluir a tramitação constitucional antes de produzir efeitos. A situação consultada em 06/10/2026 ainda era de discussão no Senado.'),
             ('Toda empresa deve mudar seus horários agora?', 'A proposta, por si só, não autoriza antecipar obrigações como se já estivessem vigentes. Confira a legislação atual, as regras da categoria e o eventual texto promulgado.')],
     'sources': [('Câmara: aprovação em dois turnos, em 27/05/2026', 'https://www.camara.leg.br/noticias/1277141-camara-aprova-em-dois-turnos-fim-da-escala-6x1-com-jornada-maxima-de-40-horas-semanais'),
                 ('Senado: debates em Plenário e tramitação, em 02/10/2026', 'https://www12.senado.leg.br/noticias/materias/2026/10/02/plenario-analisa-fim-da-escala-6x1-na-terca-feira')],
    },
    {'slug': 'novo-limite-mei', 'label': 'Projeto de novo limite para MEI',
     'headline': 'Projeto de novo limite para o MEI',
     'title': 'Novo limite do MEI: projetos e teto vigente | GESCOMP',
     'description': 'O limite geral do MEI segue em R$ 81 mil. Entenda o PLP 108/2021 e a proposta de aumento gradual do teto, sem confundir projetos com regras em vigor.',
     'intro': 'Há propostas diferentes para aumentar o faturamento permitido. Entenda o limite atual e os valores em discussão, sem antecipar uma mudança que ainda não virou lei.',
     'card': 'Qual teto continua valendo e o que propõem os projetos de aumento do faturamento permitido para o MEI.',
     'image': 'novo-limite-mei', 'alt': 'Computador, caderno e calculadora sobre uma mesa, fotografia ilustrativa',
     'message': 'mei',
     'sections': [
        ('Qual limite continua valendo?', '<p><strong>O limite geral do MEI permanece em R$ 81 mil por ano.</strong> Para quem inicia a atividade durante o ano, o teto é proporcional aos meses de atividade. Existem regras próprias para o MEI Caminhoneiro; esta página trata do limite geral.</p>'),
        ('O que propõe o PLP 108/2021?', '<p>O projeto propõe elevar o teto para R$ 130 mil anuais e permitir até dois empregados. Na ficha consultada em 06/10/2026, ele ainda estava em tramitação na Câmara. Esses valores não devem ser tratados como limite autorizado para o faturamento atual.</p>'),
        ('Há outra proposta de aumento gradual?', '<p>Sim. O Ministério do Empreendedorismo informa que o PLP 186/2026 propõe R$ 110 mil para 2027 e R$ 140 mil para 2028. A própria fonte esclarece que os valores dependem da conclusão do processo legislativo e de eventual aprovação e sanção, podendo mudar durante a tramitação.</p><p>São propostas diferentes. Não some os valores nem considere qualquer um deles automaticamente aprovado.</p>'),
        ('Como se preparar enquanto os projetos tramitam', '<ul><li>Acompanhe a receita acumulada do seu CNPJ.</li><li>Planeje o crescimento usando o limite vigente.</li><li>Guarde notas e comprovantes e mantenha suas obrigações em dia.</li><li>Converse com a contadora antes de ultrapassar o teto ou contratar mais pessoas.</li></ul><p>Se o negócio está crescendo, vale planejar a transição de MEI para microempresa. Consulte também o <a href="/mei">guia do MEI</a> e as informações sobre <a href="/simples-nacional">Simples Nacional</a>.</p>'),
     ],
     'faq': [('Já posso faturar R$ 130 mil como MEI?', 'O projeto que prevê R$ 130 mil não é autorização para usar esse valor hoje. Na consulta de 06/10/2026, o limite geral vigente continuava sendo R$ 81 mil anuais.'),
             ('Os valores de 2027 e 2028 estão garantidos?', 'Não. R$ 110 mil e R$ 140 mil são valores propostos pelo PLP 186/2026 e dependem da conclusão do processo legislativo. Use os links oficiais para acompanhar a situação.')],
     'sources': [('Ministério do Empreendedorismo: teto vigente e PLP 186/2026', 'https://www.gov.br/memp/pt-br/teto-do-mei'),
                 ('Câmara: ficha de tramitação do PLP 108/2021', 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao/?idProposicao=2295251')],
    },
]

template = read(PUB / 'mei.html')
main_start = template.index('<main id="conteudo">')
hero_end = template.index('</section>', main_start) + len('</section>')
hero_template = template[main_start:hero_end]
prefix, suffix = template[:main_start], template[template.index('</main>'):]
for t in topics:
    slug = t['slug']
    start = re.sub(r'<title>.*?</title>', '<title>' + esc(t['title']) + '</title>', prefix)
    for name in ['description', 'og:description', 'twitter:description']:
        start = meta(start, name, t['description'])
    for name in ['og:title', 'twitter:title']:
        start = meta(start, name, t['title'])
    start = re.sub(r'(<link rel="canonical" href=")[^"]+', r'\g<1>' + ORIGIN + '/' + slug, start)
    start = meta(start, 'og:url', ORIGIN + '/' + slug)
    og = ORIGIN + '/assets/img/og-' + t['image'] + '-cc0-20261006.webp'
    for name in ['og:image', 'twitter:image']:
        start = meta(start, name, og)
    start = meta(start, 'og:image:alt', t['alt'])
    graph = [copy.deepcopy(next(g for g in home_graph if g['@type'] == 'AccountingService'))]
    graph[0] = {k: graph[0][k] for k in ['@type', '@id', 'name', 'url', 'logo']}
    graph[0]['@type'] = 'Organization'
    graph += [copy.deepcopy(person),
              {'@type': 'Article', '@id': ORIGIN + '/' + slug + '#artigo',
               'headline': t['headline'], 'description': t['description'], 'inLanguage': 'pt-BR',
               'datePublished': DATE, 'dateModified': DATE, 'image': og,
               'author': {'@id': person['@id']}, 'publisher': {'@id': ORIGIN + '/#empresa'},
               'mainEntityOfPage': ORIGIN + '/' + slug, 'citation': [u for _, u in t['sources']]},
              {'@type': 'BreadcrumbList', 'itemListElement': [
                  {'@type': 'ListItem', 'position': i + 1, 'name': name, 'item': ORIGIN + path}
                  for i, (name, path) in enumerate([('Início', '/'), ('Informações', '/informacoes'), (t['label'], '/' + slug)])]}]
    start = structured(start, graph)
    hero = hero_template.replace('MEI: guia completo para 2026', esc(t['headline']))
    hero = hero.replace('O microempreendedor individual paga pouco, mas tem regras e prazos. Veja quanto custa, quanto pode faturar e como se manter em dia.', esc(t['intro']))
    hero = hero.replace('01/10/2026', '06/10/2026').replace('</span> MEI</nav>', '</span> ' + esc(t['label']) + '</nav>')
    hero = hero.replace('/assets/img/fotos/capa-mei-cc0-20261006.webp', '/assets/img/fotos/capa-' + t['image'] + '-cc0-20261006.webp')
    hero = hero.replace('alt="" decoding="async" fetchpriority="high"', 'alt="' + esc(t['alt']) + '" decoding="async" fetchpriority="high"')
    content = '<article class="conteudo-artigo" aria-label="' + esc(t['label']) + '">\n'
    for i, (heading, body) in enumerate(t['sections']):
        content += '<section' + (' class="proposta-aviso"' if i == 0 else '') + '><h2 class="titulo-secao">' + esc(heading) + '</h2>' + body + '</section>\n'
    content += '<section><h2 class="titulo-secao">Perguntas frequentes</h2>'
    for question, answer in t['faq']:
        content += '<details><summary>' + esc(question) + '</summary><p>' + esc(answer) + '</p></details>'
    content += '</section>\n<section><h2 class="titulo-secao">Fontes oficiais e acompanhamento</h2><p>Fontes consultadas em <time datetime="2026-10-06">06/10/2026</time>. A tramitação pode mudar depois desta consulta.</p><ul>'
    for label, url in t['sources']:
        content += '<li><a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + '<span class="so-leitor"> (abre em nova aba)</span></a></li>'
    content += '</ul></section>\n'
    content += '<aside class="cta-contexto" aria-label="Fale com a contadora"><div class="cta-contexto-texto"><p class="cta-contexto-titulo">Quer entender o seu caso?</p><p class="texto">Fale diretamente com Gabriela, contadora responsável pela GESCOMP.</p></div><a class="btn-acao btn-acao-laranja" href="/#contato" data-whatsapp-msg="' + t['message'] + '">Falar com a contadora<span class="so-leitor"> (abre o WhatsApp)</span></a></aside>\n'
    other = next(x for x in topics if x['slug'] != slug)
    content += '<nav aria-label="Outros assuntos"><a href="/' + other['slug'] + '">' + esc(other['label']) + '</a> · <a href="/informacoes#outros-assuntos">Ver todos os assuntos</a></nav>\n</article>\n'
    write(PUB / (slug + '.html'), start + hero + '\n' + content + suffix)

# O catálogo mantém os sete cards e acrescenta dois com a mesma estrutura.
hub = read(PUB / 'informacoes.html')
card_template = re.search(r'<div><a href="/imposto-de-renda".*?</a></div>', hub, re.S)[0]
new_cards = []
for t in topics:
    card = card_template.replace('/imposto-de-renda', '/' + t['slug'])
    card = card.replace('assunto-imposto-renda-cc0-20261006.webp', 'assunto-' + t['image'] + '-cc0-20261006.webp')
    card = card.replace('>Imposto de Renda</h3>', '>' + esc(t['label']) + '</h3>')
    card = card.replace('Quem fica isento até R$ 5 mil, o que muda para sócios de empresas e como se preparar para a declaração de 2027.', esc(t['card']))
    new_cards.append(card)
marker = '</div></div><p style="max-width: var(--container);'
assert hub.count(marker) == 1
hub = hub.replace(marker, '\n' + '\n'.join(new_cards) + marker)
hub = hub.replace('Escolha um assunto. Cada página explica tudo em palavras simples, com valores e prazos atualizados em 01/10/2026.', 'Escolha um assunto. Veja regras vigentes, prazos e propostas em discussão, com a data de atualização indicada em cada página.')
hub = hub.replace('Atualizado em 01/10/2026', 'Atualizado em 06/10/2026')
hub = hub.replace('Conteúdo informativo, atualizado em 01/10/2026', 'Conteúdo informativo, atualizado em 06/10/2026')
write(PUB / 'informacoes.html', hub)

# Links contextuais nos guias relacionados, sem mudar as regras vigentes.
for filename, title, slug in [('mei.html', 'Projeto de novo limite para MEI', 'novo-limite-mei'),
                              ('departamento-pessoal.html', 'Fim da escala 6x1', 'fim-escala-6x1')]:
    s = read(PUB / filename)
    link = '<p class="texto"><a href="/' + slug + '" style="color:var(--fotoTexto);text-decoration:underline">' + esc(title) + '</a>: veja o que ainda está em discussão e acompanhe as fontes oficiais.</p>\n'
    assert '<aside class="cta-contexto"' in s
    s = s.replace('<aside class="cta-contexto"', link + '<aside class="cta-contexto"', 1)
    write(PUB / filename, s)

# Autoria identificável e metadados coerentes com o conteúdo que o visitante vê.
for path in PUB.glob('*.html'):
    s = read(path)
    if path.name != '404.html':
        graph = json.loads(LD.search(s)[1])['@graph']
        if path.name == 'index.html':
            title = 'Contabilidade online e em Barra dos Coqueiros | GESCOMP'
            description = 'Contabilidade em Barra dos Coqueiros, na Grande Aracaju (SE), e online. Fale direto com Gabriela: abertura de CNPJ, impostos, folha e Imposto de Renda.'
            s = re.sub(r'<title>.*?</title>', '<title>' + title + '</title>', s)
            for name in ['og:title', 'twitter:title']:
                s = meta(s, name, title)
            for name in ['description', 'og:description', 'twitter:description']:
                s = meta(s, name, description)
            for node in graph:
                if node['@type'] == 'AccountingService':
                    node['employee'] = {'@id': person['@id']}
                    maps = 'https://www.google.com/maps/search/?api=1&query=GESCOMP&query_place_id=ChIJqQk9uSS1GgcRaEAeH0T-vUU'
                    node['hasMap'] = maps
                    if maps not in node['sameAs']:
                        node['sameAs'].append(maps)
                elif node['@type'] == 'WebPage':
                    node.update({'name': title, 'description': description, 'dateModified': DATE})
        for node in graph:
            if node['@type'] == 'AccountingService' and 'address' not in node:
                node['@type'] = 'Organization'
            if node['@type'] == 'Article':
                node['author'] = {'@id': person['@id']}
                if path.name in ['informacoes.html', 'mei.html', 'departamento-pessoal.html']:
                    node['dateModified'] = DATE
        if not any(g.get('@id') == person['@id'] for g in graph):
            graph.append(copy.deepcopy(person))
        if path.name == 'informacoes.html':
            hub_title = 'Informações contábeis, MEI e escala 6x1 | GESCOMP'
            hub_desc = 'Guias da GESCOMP sobre reforma tributária, MEI, Imposto de Renda, folha, fim da escala 6x1 e projetos de novo limite do MEI. Fontes e regras em linguagem clara.'
            s = re.sub(r'<title>.*?</title>', '<title>' + hub_title + '</title>', s)
            for name in ['og:title', 'twitter:title']:
                s = meta(s, name, hub_title)
            for name in ['description', 'og:description', 'twitter:description']:
                s = meta(s, name, hub_desc)
            links = [('Imposto de Renda', 'imposto-de-renda'), ('MEI', 'mei'), ('Simples Nacional', 'simples-nacional'), ('Abrir empresa', 'abrir-empresa'), ('Pró-labore e lucros', 'pro-labore-e-lucros'), ('Funcionários e folha', 'departamento-pessoal'), ('Calendário de datas', 'calendario-fiscal')] + [(t['label'], t['slug']) for t in topics]
            graph += [{'@type': 'CollectionPage', '@id': ORIGIN + '/informacoes#pagina', 'url': ORIGIN + '/informacoes', 'name': 'Informações para a sua empresa', 'description': hub_desc, 'inLanguage': 'pt-BR', 'mainEntity': {'@id': ORIGIN + '/informacoes#assuntos'}},
                      {'@type': 'ItemList', '@id': ORIGIN + '/informacoes#assuntos', 'name': 'Mais informações para a sua empresa', 'numberOfItems': len(links), 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': name, 'url': ORIGIN + '/' + slug} for i, (name, slug) in enumerate(links)]}]
        s = structured(s, graph)
    s = re.sub(r'(/assets/(?:css/(?:site|estrutura)\.css|js/(?:site|config)\.js))\?v=\d{8}(?:&(?:amp;)?rev=\d+)?', r'\g<1>?v=20261006&amp;rev=3', s)
    write(path, s)

ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'i': 'http://www.google.com/schemas/sitemap-image/1.1'}
ET.register_namespace('', ns['s']); ET.register_namespace('image', ns['i'])
tree = ET.parse(PUB / 'sitemap.xml')
root = tree.getroot()
for url in root:
    loc = url.find('s:loc', ns)
    if loc.text in [ORIGIN + '/', ORIGIN + '/informacoes', ORIGIN + '/mei', ORIGIN + '/departamento-pessoal']:
        url.find('s:lastmod', ns).text = DATE
    if loc.text == ORIGIN + '/':
        url.find('i:image/i:loc', ns).text = ORIGIN + '/assets/img/compartilhamento-inicio-cc0-20261006.webp'
for t in topics:
    url = ET.SubElement(root, '{' + ns['s'] + '}url')
    ET.SubElement(url, '{' + ns['s'] + '}loc').text = ORIGIN + '/' + t['slug']
    ET.SubElement(url, '{' + ns['s'] + '}lastmod').text = DATE
ET.indent(tree, space='  ')
tree.write(PUB / 'sitemap.xml', encoding='UTF-8', xml_declaration=True)

llms = read(PUB / 'llms.txt').replace('## Informações (atualizadas em 01/10/2026)', '## Informações\n\nA data de atualização consta em cada página. Projetos em tramitação não são regras em vigor.')
llms = llms.replace('\n## Links', '\n- Fim da escala 6x1: situação da PEC, distinção entre proposta e regra vigente, fontes oficiais. ' + ORIGIN + '/fim-escala-6x1\n- Projeto de novo limite para MEI: teto geral vigente de R$ 81 mil e propostas em discussão. ' + ORIGIN + '/novo-limite-mei\n\n## Links')
write(PUB / 'llms.txt', llms)
print(json.dumps({'newPages': [t['slug'] for t in topics], 'photos': manifest, 'sitemapURLs': len(root)}))
