"""Acesso sequencial às citações; HTTP não substitui leitura e confronto editorial."""
from pathlib import Path
from datetime import date
import urllib.request,json,re,sys
repo=Path(__file__).resolve().parents[2];out=repo/'docs/evidencias/2026-10-17/auditoria'
out.mkdir(parents=True,exist_ok=True)
cache={}
if '--completar' in sys.argv:
 p=repo/'.playwright-mcp/auditoria-20261017/acesso-fontes.json'
 cache={r['url']:r for r in json.loads(p.read_text(encoding='utf-8'))}
mapping={}
for f in (repo/'publicar').glob('*.html'):
 for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',f.read_text(encoding='utf-8'),re.S):
  for n in json.loads(raw).get('@graph',[]):
   if n.get('@type')=='Article':mapping[f.stem]={'titulo':n['headline'],'publicacao':n['datePublished'],'revisaoEditorial':n['dateModified'],'fontes':n.get('citation',[])}
rows=[]
for u in dict.fromkeys(u for a in mapping.values() for u in a['fontes']):
 if u in cache:r=dict(cache[u])
 else:
  r={'url':u,'consulta':date.today().isoformat()}
  try:
   with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=18) as response:
    r.update(status=response.status,urlFinal=response.url,tipo=response.headers.get('Content-Type',''))
  except Exception as e:r['erro']=str(e)
 r.pop('id',None);rows.append(r)
result={'consulta':date.today().isoformat(),'artigos':mapping,'acesso':rows,'nota':'Respostas HTTP são checagem de acesso; conteúdo e ressalvas no relatório editorial.'}
(out/'fontes.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'fontes':len(rows),'http200':sum(r.get('status')==200 for r in rows),'falhas':[r for r in rows if r.get('erro')]},ensure_ascii=False))
