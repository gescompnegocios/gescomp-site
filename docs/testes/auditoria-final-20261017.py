"""Auditoria estática atual: reutiliza as verificações anteriores sem alterar seu histórico."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import subprocess,re,json,sys
sys.stdout.reconfigure(encoding='utf-8')
repo=Path(__file__).resolve().parents[2]
base='d6d19f78abc77bf3207fdaf6f74872bd6287c329'
source=(repo/'docs/testes/validar-finais-20261016.py').read_text(encoding='utf-8')
source=source.replace("base='116546769d54b99791b9202d01d07d7653002589'","base='"+base+"'")
source='from functools import cache\n'+source.replace('def git(path):','@cache\ndef git(path):')
source=source.replace("repo/'docs/evidencias/2026-10-16'","repo/'docs/evidencias/2026-10-17/auditoria'")
source=source.replace("if name not in ['receita-sintonia-terceiro-ciclo-2026.html','simples-nacional-balanco-outubro-2026.html','cbs-documentos-fiscais-outubro-2026.html']:","if name in docs:")
source=source.replace("check('16/10/2026' in s,name+': revisão visível em 16/10')", "expected='2026-10-17' if name in ['fim-escala-6x1.html','novo-limite-mei.html','departamento-pessoal.html'] else '2026-10-16'\n    check('/'.join(reversed(expected.split('-'))) in s,name+': revisão visível')")
source=source.replace("n['dateModified']=='2026-10-16'","n['dateModified']==expected")
source=source[:source.index("result={'base':")]
scope={'__file__':str(Path(__file__).resolve())}
exec(compile(source,str(Path(__file__)), 'exec'),scope)
errors=scope['errors'];check=scope['check'];pub=repo/'publicar'
def old(path):return subprocess.check_output(['git','show',base+':'+path],cwd=repo).decode('utf-8').replace('\r\n','\n')
assets=subprocess.check_output(['git','diff','--name-only',base,'--','publicar/assets'],cwd=repo).decode().splitlines()
check(not assets,'Assets modificados: '+str(assets))
count=0
for p in pub.glob('*.html'):
 s=p.read_text(encoding='utf-8'); prev=old('publicar/'+p.name)
 for pattern,label in [(r'\bstyle="[^"]*"','estilos inline'),(r'<header\b.*?</header>','cabeçalho'),(r'<footer\b.*?</footer>','rodapé'),(r'<(?:img|source)\b[^>]*>','imagens'),(r'<h1\b.*?</h1>','H1')]:
  check(re.findall(pattern,s,re.S)==re.findall(pattern,prev,re.S),p.name+': preservação de '+label)
 # Nenhum componente visual acrescentado: somente links de fonte e rótulos acessíveis.
 before=Counter(re.findall(r'\bclass="([^"]*)"',prev));after=Counter(re.findall(r'\bclass="([^"]*)"',s))
 for c in set(before)|set(after):
  check(before[c]==after[c] or c=='so-leitor' and after[c]>=before[c],p.name+': classe visual alterada '+c)
 for raw,oldraw in zip(re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S),re.findall(r'<script type="application/ld\+json">(.*?)</script>',prev,re.S)):
  current=json.loads(raw);previous=json.loads(oldraw)
  for a,b in zip(current['@graph'],previous['@graph']):
   if a['@type']=='Article':
    count+=1
    check(a['datePublished']==b['datePublished'],p.name+': publicação original alterada')
    a=dict(a);b=dict(b)
    for key in ['dateModified','citation']:a.pop(key,None);b.pop(key,None)
   check(a==b,p.name+': metadados sem relação com correção')
scale=(pub/'fim-escala-6x1.html').read_text(encoding='utf-8')
check('após 60 dias' not in scale and 'dois meses após a publicação' in scale,'Prazo EC 141 em meses')
check('emendas/emc/emc141.htm' in scale and 'art. 9º' in scale,'Norma e exceções EC 141')
mei=(pub/'novo-limite-mei.html').read_text(encoding='utf-8')
check(mei.count('âmbito rural')==2 and 'aguarda sanção' in mei,'Projeto MEI: condição e estágio')
check('veja o que ainda está em discussão' not in (pub/'departamento-pessoal.html').read_text(encoding='utf-8'),'Chamada da jornada desatualizada')
check('Atendimento personalizado, seja presencial ou on-line,' in (pub/'index.html').read_text(encoding='utf-8'),'Atendimento oficial')
check(count==13,'Quantidade de artigos')
out=repo/'docs/evidencias/2026-10-17/auditoria';out.mkdir(parents=True,exist_ok=True)
result={'base':base,'html':len(scope['docs']),'artigos':count,'paginasSitemap':len(scope['pages']),'assetsAlterados':assets,'erros':errors}
(out/'estatica.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
raise SystemExit(bool(errors))
