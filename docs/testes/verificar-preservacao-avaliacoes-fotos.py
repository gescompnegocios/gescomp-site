"""Conferência desta entrega contra o commit anterior, sem alterar o site."""
from pathlib import Path
import subprocess,re,json,hashlib
from PIL import Image,ImageChops
root=Path(__file__).resolve().parents[2]
out=root/'docs/evidencias/2026-10-06/avaliacoes-fotos'
def anterior(nome):
 return subprocess.check_output(['git','show','531dc6c:publicar/'+nome],cwd=root).decode('utf-8').replace('\r\n','\n')
def atual(nome):
 return (root/'publicar'/nome).read_text(encoding='utf-8')
def rio(t):return re.search(r'<section\b[^>]*\bid="rio"[^>]*>.*?</section>',t,re.S)[0]
before=rio(anterior('index.html'));after=rio(atual('index.html'))
assert before==after
cssbefore=anterior('assets/css/site.css');cssafter=atual('assets/css/site.css')
cssafter=cssafter.replace('#avaliacoes .carrossel-trilha{align-items:stretch;gap:24px;padding:10px 4px 18px;overflow-x:hidden;touch-action:pan-y;scroll-snap-type:none}', '#avaliacoes .carrossel-trilha{align-items:stretch;gap:24px;padding:10px 4px 18px;touch-action:pan-x pan-y}').replace('#avaliacoes .avaliacao-card:hover,#avaliacoes .avaliacao-card:focus-within{transform:none}\n','')
assert cssbefore==cssafter
jsbefore=anterior('assets/js/site.js');jsafter=atual('assets/js/site.js')
assert jsbefore.split('/* Carrossel genérico')[0]==jsafter.split('/* Carrossel genérico')[0]
igInicio='/* Instagram: vídeos próprios';igFim='/* Avaliações'
# O corpo do módulo Instagram não muda: toda diferença ocorre na função compartilhada.
ig1=jsbefore[jsbefore.index('var sec=document.getElementById(\'instagram\')'):jsbefore.index('var sec=document.getElementById(\'avaliacoes\')')]
ig2=jsafter[jsafter.index('var sec=document.getElementById(\'instagram\')'):jsafter.index('var sec=document.getElementById(\'avaliacoes\')')]
assert ig1==ig2
for nome in ['assets/css/estrutura.css','assets/js/libras.js']:
 assert anterior(nome)==atual(nome)
imagens=[]
for width in [1366,360]:
 for theme in ['light','dark']:
  b=Image.open(out/f'rio-antes-{theme}-{width}.png').convert('RGB')
  a=Image.open(out/f'rio-depois-{theme}-{width}.png').convert('RGB')
  assert a.size==b.size
  diff=ImageChops.difference(a,b)
  maximum=max(v[1] for v in diff.getextrema())
  distintos=sum(any(p) for p in diff.get_flattened_data())
  assert maximum<=1,(width,theme,maximum)
  imagens.append({'width':width,'theme':theme,'pixelsDiferentes':distintos,'maiorDiferencaPorCanal':maximum})
fontes=json.loads((out/'fontes-fotos-cc0.json').read_text(encoding='utf-8'))
usadas=[]
for pagina in (root/'publicar').glob('*.html'):
 texto=pagina.read_text(encoding='utf-8')
 usadas+=re.findall(r'(?:src|data-foto)="(/assets/img/fotos/[^\"]+cc0-20261006.webp)"',texto)
assert len(usadas)==19 and len(set(usadas))==19
visiveis=[f for f in fontes if '/fotos/' in f['arquivo']]
assert len({f['sha256Fonte'] for f in visiveis})==19
assert all(f['bytes']<300*1024 for f in fontes)
assert not re.search(r'/assets/img/fotos/[^"\s]*20261004.webp','\n'.join(atual(p.name) for p in (root/'publicar').glob('*.html')))
report={'baseline':'531dc6c','rioHTMLIdentico':True,'rioSHA256':hashlib.sha256(after.encode()).hexdigest(),'cssForaDasAvaliacoesIdentico':True,'moduloInicialTemaRioIdentico':True,'moduloInstagramIdentico':True,'estruturaELibrasIdenticos':True,'capturasRio':imagens,'fotosVisiveis':len(usadas),'originaisVisiveisDistintos':len({f['sha256Fonte'] for f in visiveis}),'webpNovos':len(fontes),'maxBytes':max(f['bytes'] for f in fontes)}
(out/'preservacao-e-fotos.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
