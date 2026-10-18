"""Baixa scripts públicos para o teste CSP sem carregar vídeos/avatares."""
from pathlib import Path
import hashlib,json,urllib.request
repo=Path(__file__).resolve().parents[2];out=repo/'.playwright-mcp';out.mkdir(exist_ok=True);rows=[]
for name,url in [('instagram-embed-atual.js','https://www.instagram.com/embed.js'),('vlibras-plugin-atual.js','https://vlibras.gov.br/app/vlibras-plugin.js')]:
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25) as r:
  data=r.read();(out/name).write_bytes(data);rows.append({'file':name,'url':url,'urlFinal':r.url,'status':r.status,'sha256':hashlib.sha256(data).hexdigest()})
(out/'fontes-fixtures-seguranca.json').write_text(json.dumps(rows,indent=2),encoding='utf-8');print(json.dumps(rows))
