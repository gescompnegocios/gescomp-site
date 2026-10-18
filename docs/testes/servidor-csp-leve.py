"""Servidor de teste de navegador. Emula cabeçalhos/rotas, não substitui teste workerd."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
from urllib.parse import urlsplit
repo=Path(__file__).resolve().parents[2];pub=repo/'publicar'
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def end_headers(self):
  for line in (pub/'_headers').read_text(encoding='utf-8').splitlines()[1:]:
   if not line.strip():break
   k,v=line.strip().split(':',1);self.send_header(k,v.strip())
  super().end_headers()
 def translate_path(self,path):
  resolved=Path(super().translate_path(path))
  if not resolved.is_file() and resolved.with_suffix('.html').is_file():return str(resolved.with_suffix('.html'))
  return str(resolved)
 def send_error(self,code,message=None,explain=None):
  if code!=404:return super().send_error(code,message,explain)
  data=(pub/'404.html').read_bytes();self.send_response(404);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers()
  if self.command!='HEAD':self.wfile.write(data)
ThreadingHTTPServer(('127.0.0.1',8091),partial(Handler,directory=str(pub))).serve_forever()
