"""Compara conteúdo público com o checkout atual; uma requisição por vez."""
from pathlib import Path
from datetime import datetime,timezone
import urllib.request,urllib.error,json,re,subprocess
repo=Path(__file__).resolve().parents[2];pub=repo/'publicar'
commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo).decode().strip()
paths=[p.name for p in pub.glob('*.html')]+['assets/css/site.css','assets/css/estrutura.css','assets/js/site.js','assets/js/config.js','assets/js/libras.js','sitemap.xml','robots.txt','llms.txt']
rows=[]
for path in paths:
 route='' if path=='index.html' else 'auditoria-rota-inexistente-20261017' if path=='404.html' else path.removesuffix('.html')
 url='https://gescompnegocios.com.br/'+route+'?auditoria='+commit[:12]
 row={'path':path,'url':url}
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
  try:r=urllib.request.urlopen(req,timeout=20)
  except urllib.error.HTTPError as e:
   if e.code==404 and path=='404.html':r=e
   else:raise
  with r:
   text=r.read().decode('utf-8').replace('\r\n','\n');row.update(status=r.code,urlFinal=r.url)
   row['nosniff']=r.headers.get('X-Content-Type-Options')=='nosniff'
  text=re.sub(r'<script\b[^>]*src="https://static\.cloudflareinsights\.com/beacon\.min\.js/[^\"]+"[^>]*></script>\n','',text)
  row['conteudoIgual']=text==(pub/path).read_text(encoding='utf-8')
  row['statusEsperado']=row['status']==(404 if path=='404.html' else 200)
 except Exception as e:row['erro']=str(e)
 rows.append(row)
result={'commit':commit,'consultaUTC':datetime.now(timezone.utc).isoformat(),'resultados':rows,'publicado':all(r.get('conteudoIgual') and r.get('statusEsperado') for r in rows)}
out=repo/'.playwright-mcp/auditoria-20261017';out.mkdir(parents=True,exist_ok=True)
(out/'publicacao.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
raise SystemExit(not result['publicado'])
