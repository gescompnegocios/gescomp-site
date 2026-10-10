from pathlib import Path
import subprocess, re, json
from html.parser import HTMLParser
repo=Path(__file__).resolve().parents[2]
original=repo/'docs/testes/validar-conteudo-20261010.py'
code=original.read_text(encoding='utf-8')
start=code.index('# Preservação do Codex')
end=code.index('rio=lambda h:',start)
code=code[:start]+"unchanged=[]\nreviewed_claude=[]\n"+code[end:]
code=code.replace("out = repo / 'docs/evidencias/2026-10-10/conteudo-seo'", "out = repo / 'docs/evidencias/2026-10-10/revisao-editorial'")
scope={'__file__':str(original),'__name__':'__main__'}
try: exec(compile(code,str(original),'exec'),scope)
except SystemExit as ex:
    if ex.code: raise
errors=[]
class Text(HTMLParser):
    def __init__(self,h):
        super().__init__();self.skip=0;self.parts=[];self.feed(h)
    def handle_starttag(self,t,a):
        if t in ('svg','script','style'):self.skip+=1
    def handle_endtag(self,t):
        if t in ('svg','script','style'):self.skip-=1
    def handle_data(self,d):
        if not self.skip:self.parts.append(d)
def text(h):return re.sub(r'\s+',' ',' '.join(Text(h).parts)).strip()
def head(p):return subprocess.run(['git','show','3554c0f:publicar/'+p],cwd=repo,check=True,capture_output=True).stdout.decode('utf-8')
for slug in scope['slugs']:
    old=head(slug+'.html');new=(repo/'publicar'/ (slug+'.html')).read_text(encoding='utf-8')
    oldbody=old.split('<div class="artigo-texto">')[1].split('class="leia-mais"')[0]
    newbody=new.split('<div class="artigo-texto">')[1].split('class="leia-mais"')[0]
    paragraphs=re.findall(r'<(?:p|h2|h3)\b[^>]*>(.*?)</(?:p|h2|h3)>',oldbody,re.S)
    combined=text(newbody)
    for para in paragraphs:
        if text(para) and text(para) not in combined:errors.append(slug+': conteúdo ausente '+text(para)[:90])
    oldids=set(re.findall(r'\bid="([^"]+)"',old));newids=set(re.findall(r'\bid="([^"]+)"',new))
    if oldids-newids:errors.append(slug+': IDs ausentes '+str(oldids-newids))
    if re.findall(r'<script type="application/ld\+json">.*?</script>',old,re.S)!=re.findall(r'<script type="application/ld\+json">.*?</script>',new,re.S):errors.append(slug+': JSON-LD alterado')
    if len(re.findall(r'class="mudancas-item"',new.split('class="leia-mais"')[1]))!=9:errors.append(slug+': quantidade de relacionados')
for name in ['index','contabilidade-empresarial','calculos-trabalhistas','consultoria-financeira','escolha-de-regime-tributario','regularizacao-baixa-cnpj']:
    old=head(name+'.html');new=(repo/'publicar'/(name+'.html')).read_text(encoding='utf-8')
    if old.replace('site.css?v=20261008&amp;rev=16','site.css?v=20261008&amp;rev=17')!=new:errors.append(name+': alteração além do cache')
out=repo/'docs/evidencias/2026-10-10/revisao-editorial'
(out/'preservacao-conteudo.json').write_text(json.dumps({'base':'3554c0f','guias':10,'erros':errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'preservacaoContra':'3554c0f','erros':errors},ensure_ascii=False))
raise SystemExit(bool(errors))
