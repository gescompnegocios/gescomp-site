"""Verificação leve de cabeçalhos, hash do script e preservação do conteúdo."""
from pathlib import Path
from html.parser import HTMLParser
import base64,hashlib,json,re,subprocess
repo=Path(__file__).resolve().parents[2];pub=repo/'publicar';errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
headers=(pub/'_headers').read_text(encoding='utf-8')
policy=re.search(r'^  Content-Security-Policy: (.+)$',headers,re.M)[1]
directives={p.split()[0]:p.split()[1:] for p in policy.split(';') if p.strip()}
for line in headers.splitlines():check(len(line)<=2000,'Linha de _headers acima de 2000 caracteres')
check("'unsafe-inline'" not in directives['script-src'],'Scripts inline sem hash liberados')
check("'unsafe-eval'" not in directives['script-src'],'eval irrestrito liberado')
for d in ['default-src','base-uri','object-src','frame-ancestors','form-action','script-src-attr']:
 check(d in directives,'Diretiva ausente: '+d)
check("object-src 'none'" in policy and "script-src-attr 'none'" in policy,'Objetos ou handlers liberados')
check('Strict-Transport-Security: max-age=31536000' in headers,'HSTS ausente')
check('includeSubDomains' not in headers and 'preload' not in headers,'Escopo HSTS ampliado')
inline=0
for p in pub.glob('*.html'):
 s=p.read_text(encoding='utf-8')
 for attrs,body in re.findall(r'<script\b([^>]*)>(.*?)</script>',s,re.S):
  if 'src=' in attrs or 'application/ld+json' in attrs:continue
  digest="'sha256-"+base64.b64encode(hashlib.sha256(body.encode()).digest()).decode()+"'"
  check(digest in directives['script-src'],p.name+': script inline sem hash autorizado');inline+=1
 check(not re.search(r'\son\w+\s*=',s),p.name+': handler inline incompatível')
 # Nenhuma mudança de texto, estrutura, CSS, JS, imagens ou datas nesta tarefa.
 expected=subprocess.check_output(['git','show','7048936:publicar/'+p.name],cwd=repo).decode('utf-8').replace('\r\n','\n')
 check(s==expected,p.name+': conteúdo alterado')
config=json.loads((repo/'wrangler.jsonc').read_text(encoding='utf-8'))
check(config['name']=='gescomp-site','Nome incorreto do Worker')
check(config['assets']=={'directory':'./publicar','html_handling':'auto-trailing-slash','not_found_handling':'404-page'},'Configuração de arquivos/404 incorreta')
check('noindex, follow' in (pub/'404.html').read_text(encoding='utf-8'),'404 sem noindex')
changed=subprocess.check_output(['git','diff','7048936','--name-only','--','publicar'],cwd=repo).decode().splitlines()
check(changed==['publicar/_headers'],'Alteração pública fora dos cabeçalhos: '+str(changed))
result={'base':'7048936','html':len(list(pub.glob('*.html'))),'scriptsInlineAutorizados':inline,'policyBytes':len(policy),'erros':errors}
out=repo/'docs/evidencias/2026-10-17/seguranca-tecnica';out.mkdir(parents=True,exist_ok=True)
(out/'estatica.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False));raise SystemExit(bool(errors))
