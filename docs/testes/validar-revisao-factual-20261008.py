"""Verificações de consistência, escopo e evidências, sem rede."""
from pathlib import Path
import hashlib, json, re, runpy, subprocess, sys
from html import unescape
from PIL import Image, ImageChops

ROOT=Path(__file__).resolve().parents[2]
PUB=ROOT/'publicar'
OUT=ROOT/'docs/evidencias/2026-10-08/revisao-factual'
sys.stdout.reconfigure(encoding='utf-8')
helper=runpy.run_path(str(Path(__file__).with_name('aplicar-revisao-factual-20261008.py')))
text=helper['texto']
sources=json.loads((OUT/'fontes.json').read_text(encoding='utf-8'))['paginas']
errors=[];pages={};preserved={};captures=[]
def git(rel,base='9b67307'):
 return subprocess.check_output(['git','show',base+':'+rel],cwd=ROOT).decode('utf-8').replace('\r\n','\n')
def norm(s): return ' '.join(unescape(s).split())
for p in PUB.glob('*.html'):
 raw=p.read_text(encoding='utf-8');slug=p.stem
 faqs={}
 for d in re.findall(r'<details\b[\s\S]*?</details>',raw):
  s=re.search(r'<summary\b[^>]*>([\s\S]*?)</summary>',d)
  if s:faqs[text(s[1])]=text(d[s.end():].removesuffix('</details>'))
 graph=[]
 for ld in re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>',raw):graph.extend(json.loads(ld).get('@graph',[]))
 oldgraph=[]
 for ld in re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>',git('publicar/'+p.name)):oldgraph.extend(json.loads(ld).get('@graph',[]))
 for item in graph:
  if item.get('@type')=='FAQPage':
   for q in item['mainEntity']:
    if norm(q['acceptedAnswer']['text'])!=norm(faqs.get(q['name'],'')):errors.append([slug,'FAQ divergente',q['name']])
  if item.get('@type') in ('Person','AccountingService','Organization'):
   previous=next((o for o in oldgraph if o.get('@id')==item.get('@id') and o.get('@type')==item.get('@type')),None)
   if previous!=item:errors.append([slug,'dados pessoais/comerciais alterados',item.get('@id')])
 if slug in sources:
  if 'Atualizado em 08/10/2026' not in raw:errors.append([slug,'data visível incorreta'])
  for title,url in sources[slug]:
   if escape_url:=url.replace('&','&amp;'):
    if 'href="'+escape_url+'"' not in raw:errors.append([slug,'fonte ausente',url])
  articles=[x for x in graph if x.get('@type')=='Article']
  for a in articles:
   if a.get('dateModified')!='2026-10-08':errors.append([slug,'dateModified incorreto'])
  pages[slug]={'fontes':len(sources[slug]),'perguntas':len(faqs),'data':'2026-10-08'}

# Componentes pessoais/comerciais preservados literalmente, inclusive animações do rio.
home=(PUB/'index.html').read_text(encoding='utf-8');before=git('publicar/index.html')
for id_ in ('inicio','servicos','sobre','avaliacoes','instagram','rio','contato'):
 pattern=r'<section\b[^>]*\bid="'+id_+r'"[\s\S]*?</section>'
 a=re.search(pattern,before);b=re.search(pattern,home)
 if not a or not b:errors.append(['index','seção de preservação não encontrada',id_]);continue
 equal=a[0]==b[0];preserved[id_]=equal
 if not equal:errors.append(['index','seção protegida alterada',id_])
for p in (PUB/'assets').rglob('*'):
 if not p.is_file():continue
 rel='publicar/'+p.relative_to(PUB).as_posix()
 base='cd11fb2' if rel=='publicar/assets/js/site.js' else '9b67307'
 old=subprocess.check_output(['git','show',base+':'+rel],cwd=ROOT)
 if old.replace(b'\r\n',b'\n')!=p.read_bytes().replace(b'\r\n',b'\n'):errors.append([rel,'asset alterado pelo Codex'])
for width in (1366,360):
 for theme in ('light','dark'):
  a=Image.open(OUT/f'rio-antes-{width}-{theme}.png').convert('RGB')
  b=Image.open(OUT/f'rio-depois-{width}-{theme}.png').convert('RGB')
  equal=a.size==b.size and ImageChops.difference(a,b).getbbox() is None
  captures.append({'largura':width,'tema':theme,'identico':equal})
  if not equal:errors.append(['rio','captura divergente',width,theme])

# Erros antigos devem desaparecer das páginas e das cópias de revisão.
bad=['a saída é imediata','de 3 a 10 dias úteis','No Simples, vai dentro do DAS (exceto Anexo IV)','O MEI não tem pró-labore','Seguem isentos se a distribuição foi aprovada até 31 de dezembro de 2025.']
for folder in (PUB,ROOT/'conteudo'):
 for p in folder.glob('*'):
  if p.suffix not in ('.html','.md'):continue
  raw=p.read_text(encoding='utf-8')
  for term in bad:
   if term in raw:errors.append([str(p.relative_to(ROOT)),'afirmação antiga',term])
for p in (ROOT/'conteudo').glob('*.md'):
 if re.search(r'(?:Até|até) 08/10/2026',p.read_text(encoding='utf-8')):errors.append([p.name,'vencimento confundido com atualização'])
report={'baseConteudo':'9b67307','baseIntegrada':'cd11fb2','paginas':pages,'fontesUnicas':len({u for v in sources.values() for _,u in v}),'secoesPreservadas':preserved,'rioCapturas':captures,'falhas':errors}
(OUT/'consistencia-preservacao.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
if errors:sys.exit(1)
