"""Revisão da identificação GESCOMP/nome completo/Instagram, contra e035c83.
Uso: python -X utf8 docs/testes/validar-identidade-20261010.py [pasta_publicar]
O validador histórico de conteúdo é executado sem sua comparação visual antiga;
a preservação desta rodada é conferida abaixo, contra o commit anterior real.
"""
from pathlib import Path
import subprocess,re,json,sys
repo=Path(__file__).resolve().parents[2]
pub=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else repo/'publicar'
original=repo/'docs/testes/validar-conteudo-20261010.py'
code=original.read_text(encoding='utf-8')
start=code.index('# Preservação do Codex')
end=code.index('rio=lambda h:',start)
code=code[:start]+"unchanged=[]\nreviewed_claude=[]\n"+code[end:]
code=code.replace("out = repo / 'docs/evidencias/2026-10-10/conteudo-seo'", "out = repo / 'docs/evidencias/2026-10-10/identidade-marca'")
code=code.replace("pub = repo / 'publicar'",'pub = Path('+repr(str(pub))+')')
scope={'__file__':str(original),'__name__':'__main__'}
try:exec(compile(code,str(original),'exec'),scope)
except SystemExit as result:
    if result.code:raise
full='Gestão Empresarial e Planejamento Contábil'
brand='GESCOMP – '+full
profile='https://www.instagram.com/gescomp_/'
errors=[];rows=[]
def check(ok,why):
    if not ok:errors.append(why)
def oldfile(name):return subprocess.run(['git','show','e035c83:publicar/'+name],cwd=repo,check=True,capture_output=True).stdout.decode('utf-8')
def graphs(h):
    return [json.loads(m) for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>',h,re.S)]
for p in sorted(pub.glob('*.html')):
    old=oldfile(p.name);h=p.read_text(encoding='utf-8')
    check('<meta name="keywords"' not in h,p.name+': meta keywords indevida')
    if p.name=='404.html':
        check(old==h,'404 modificada');continue
    nodes=[n for g in graphs(h) for n in g.get('@graph',[g])]
    org=[n for n in nodes if n.get('@type')=='AccountingService']
    check(len(org)==1,p.name+': entidade repetida/ausente')
    node=org[0]
    check(node['name']=='GESCOMP' and node['alternateName']==[brand,full],p.name+': identidade inconsistente')
    check(profile in node.get('sameAs',[]),p.name+': Instagram ausente')
    check(node['@id']=='https://gescompnegocios.com.br/#empresa',p.name+': empresa ID')
    check('href="'+profile+'"' in h,p.name+': perfil não visível')
    before=old[old.index('<body>'):];after=h[h.index('<body>'):]
    before=before.replace('href="https://www.instagram.com/gescomp_"','href="'+profile+'"')
    if p.name=='index.html':
        before=before.replace('criou a GESCOMP com um propósito claro:', 'criou a GESCOMP – Gestão Empresarial e Planejamento Contábil com um propósito claro:',1)
        before=before.replace('Vídeos do nosso perfil. Toque em um deles para assistir aqui mesmo.', 'Conheça o Instagram oficial da GESCOMP, @gescomp_. Toque em um dos vídeos para assistir aqui mesmo.',1)
        website=[n for n in nodes if n.get('@type')=='WebSite']
        check(len(website)==1 and website[0]['name']=='GESCOMP' and full in website[0]['alternateName'],'WebSite identidade')
        page=next(n for n in nodes if n.get('@type')=='WebPage')
        check(page['dateModified']=='2026-10-10','inicial modificação')
        check(full in h.split('</title>')[0] and '@gescomp_' in scope['parsed'][p.name][1].meta['description'],'metadados inicial')
    check(before==after,p.name+': mudança inesperada no body')
    oldgraphs=graphs(old);newgraphs=graphs(h)
    for g in oldgraphs:
        for n in g.get('@graph',[g]):
            if n.get('@type')=='AccountingService':
                n['alternateName']=[brand,full]
                n['sameAs']=[profile if x.rstrip('/')=='https://www.instagram.com/gescomp_' else x for x in n.get('sameAs',[])]
                if profile not in n['sameAs']:n['sameAs'].insert(0,profile)
            if p.name=='index.html' and n.get('@type')=='WebSite':n['alternateName']=[brand,full,'gescompnegocios.com.br']
            if p.name=='index.html' and n.get('@type')=='WebPage':
                current=next(x for x in nodes if x.get('@type')=='WebPage')
                n.update({k:current[k] for k in ['name','description','dateModified']})
    check(oldgraphs==newgraphs,p.name+': mudança inesperada de schema')
    if p.name!='index.html':
        remove=lambda s:re.sub(r'<script type="application/ld\+json">.*?</script>','',s,flags=re.S)
        check(remove(old[:old.index('<body>')])==remove(h[:h.index('<body>')]),p.name+': metadados temáticos alterados')
    rows.append({'pagina':p.name,'identidade':'GESCOMP','instagram':profile})
check(len(rows)==16,'cobertura das páginas indexáveis')
if pub!=repo/'publicar':
    base=repo/'.playwright-mcp/identidade-base/publicar'
    assert base.exists(), 'Snapshot e035c83 necessário para revisar a pasta isolada'
    changed=['publicar/'+p.relative_to(pub).as_posix() for p in pub.rglob('*') if p.is_file() and ((not (base/p.relative_to(pub)).exists()) or p.read_bytes()!=(base/p.relative_to(pub)).read_bytes())]
else:
    changed=subprocess.run(['git','diff','e035c83','--name-only','--','publicar'],cwd=repo,check=True,capture_output=True,text=True).stdout.splitlines()
check(all(x.endswith('.html') or x in ['publicar/sitemap.xml','publicar/llms.txt'] for x in changed),'assets/CSS/JS/config/robots alterados')
check(oldfile('sitemap.xml').replace('<lastmod>2026-10-08</lastmod>','<lastmod>2026-10-10</lastmod>',1)==(pub/'sitemap.xml').read_text(encoding='utf-8'),'sitemap: alteração além da inicial')
out=repo/'docs/evidencias/2026-10-10/identidade-marca'
report={'base':'e035c83','pastaIsolada':pub!=repo/'publicar','entidades':rows,'bodyPreservadoExcetoTextosDaInicialEUrlDoPerfil':not errors,'assetsRioJsCssIntactos':all(x.endswith('.html') or x in ['publicar/sitemap.xml','publicar/llms.txt'] for x in changed),'erros':errors}
(out/'identidade-e-preservacao.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'paginasIndexaveis':len(rows),'erros':errors},ensure_ascii=False))
raise SystemExit(bool(errors))
