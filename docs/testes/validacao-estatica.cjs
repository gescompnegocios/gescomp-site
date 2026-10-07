// Local checks, no network. Optional argv[2]: Python executable.
const cp = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '../..');
const installedPython = path.join(process.env.LOCALAPPDATA || '', 'Programs/Python/Python314/python.exe');
const python = process.argv[2] || process.env.GESCOMP_PYTHON ||
  (process.platform === 'win32' ? (fs.existsSync(installedPython) ? installedPython : 'py') : 'python3');
for (const name of ['site.js', 'config.js']) {
  cp.execFileSync(process.execPath, ['--check', path.join(root, 'publicar/assets/js', name)], {stdio:'inherit'});
}
const result = cp.spawnSync(python, [path.join(__dirname, 'auditoria-seo-local.py')], {cwd:root,stdio:'inherit'});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
