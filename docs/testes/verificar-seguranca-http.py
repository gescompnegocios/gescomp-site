"""Verifica respostas reais do workerd local ou do domínio, sem navegador."""
from pathlib import Path
import argparse,json,re,subprocess,time,urllib.request,urllib.error
parser=argparse.ArgumentParser();parser.add_argument('--origin',default='https://gescompnegocios.com.br');parser.add_argument('--out',default='.playwright-mcp/seguranca-tecnica/http.json');args=parser.parse_args()
repo=Path(__file__).resolve().parents[2];pub=repo/'publicar';rows=[]
policy=re.search(r'^  Content-Security-Policy: (.+)$',(pub/'_headers').read_text(encoding='utf-8'),re.M)[1]
paths=[(p.name,'' if p.name=='index.html' else p.stem,False) for p in pub.glob('*.html')]
paths += [('404.html',p,True) for p in ['rota-inexistente-teste-seguranca','nivel/inexistente','assets/inexistente.js','.env','.git/config','wrangler.jsonc']]
stamp=str(time.time_ns())
for name,route,missing in paths:
 row={'path':'/'+route}
 try:
  req=urllib.request.Request(args.origin.rstrip('/')+'/'+route+'?seguranca='+stamp,headers={'User-Agent':'Mozilla/5.0'})
  try:r=urllib.request.urlopen(req,timeout=20)
  except urllib.error.HTTPError as e:r=e
  with r:
   text=r.read().decode('utf-8').replace('\r\n','\n')
   text=re.sub(r'<script\b[^>]*src="https://static\.cloudflareinsights\.com/beacon\.min\.js/[^\"]+"[^>]*></script>\n','',text)
   row.update(status=r.code,bodyEqual=text==(pub/name).read_text(encoding='utf-8'),csp=r.headers.get('Content-Security-Policy')==policy,hsts=r.headers.get('Strict-Transport-Security')=='max-age=31536000',nosniff=r.headers.get('X-Content-Type-Options')=='nosniff')
   row['ok']=row['status']==(404 if missing else 200) and all(row[k] for k in ['bodyEqual','csp','hsts','nosniff'])
 except Exception as e:row.update(error=str(e),ok=False)
 rows.append(row)
result={'origin':args.origin,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip(),'cases':len(rows),'success':all(r['ok'] for r in rows),'results':rows}
out=repo/args.out;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'origin':args.origin,'cases':len(rows),'success':result['success'],'failures':[r for r in rows if not r['ok']]},ensure_ascii=False))
raise SystemExit(not result['success'])
