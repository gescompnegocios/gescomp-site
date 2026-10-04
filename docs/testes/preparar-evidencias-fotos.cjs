// Executar dentro de 02-site. Reconstrói somente fixtures, sem modificar publicar/.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const base='5d4dc81',dir='.playwright-mcp';fs.mkdirSync(dir,{recursive:true});
for(const [source,name] of [['publicar/index.html','rio-antes-fotos.html'],['publicar/assets/css/site.css','site-antes-fotos.css'],['publicar/assets/js/site.js','site-antes-fotos.js'],['publicar/assets/js/config.js','config-antes-fotos.js']])fs.writeFileSync(path.join(dir,name),cp.execFileSync('git',['show',base+':'+source]));
const assets=['fotos/card-abrir-empresa.webp','fotos/card-contabilidade.webp','fotos/card-imposto-de-renda.webp','capas/capa-informacoes.webp','capas/capa-abrir-empresa.webp','capas/capa-mei.webp','capas/capa-imposto-de-renda.webp','capas/capa-simples-nacional.webp','capas/capa-pro-labore-e-lucros.webp','capas/capa-departamento-pessoal.webp','capas/capa-calendario-fiscal.webp','rio-404.webp','og-composicao-20261004.webp'];
for(const asset of assets){const target=path.join(dir,'antes-fotos',asset);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,cp.execFileSync('git',['show',base+':publicar/assets/img/'+asset]));}
console.log('Fixtures do commit '+base+' prontas em '+dir+'.');
