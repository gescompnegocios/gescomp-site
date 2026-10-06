"""Consulta somente a zona e o Worker deste projeto. Não altera Cloudflare.
Usa a sessão OAuth do Wrangler sem imprimir ou copiar credenciais.
"""
from pathlib import Path
import json
import os
import tomllib
import urllib.request
import urllib.error

root = Path(__file__).resolve().parents[2]
auth = Path(os.environ['APPDATA']) / 'xdg.config/.wrangler/config/default.toml'
token = tomllib.loads(auth.read_text(encoding='utf-8'))['oauth_token']
def get(path):
    req = urllib.request.Request('https://api.cloudflare.com/client/v4/' + path,
                                headers={'Authorization': 'Bearer ' + token})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.load(r)
    except urllib.error.HTTPError as error:
        return {'success': False, 'status': error.code}

zones = get('zones?name=gescompnegocios.com.br')
result = {'readOnly': True, 'zoneQuerySucceeded': zones.get('success', False),
          'domainAccessible': False, 'matchedZones': []}
for zone in zones.get('result', []) or []:
    if zone.get('name') == 'gescompnegocios.com.br':
        account_id = zone['account']['id']
        scripts = get('accounts/' + account_id + '/workers/scripts')
        result['domainAccessible'] = True
        result['matchedZones'].append({'domain': zone['name'], 'status': zone['status'],
            'workerListSucceeded': scripts.get('success', False),
            'workerAccessible': any(s.get('id') == 'gescomp-site' for s in scripts.get('result', []) or []),
            'oauthScopes': tomllib.loads(auth.read_text(encoding='utf-8')).get('scopes', [])})
(root / 'docs/evidencias/2026-10-06/publicacao-search/cloudflare-acesso.json').write_text(
    json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result))
