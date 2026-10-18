# Segurança técnica — 18/10/2026

Implementação iniciada em 17/10 e validação final do runtime concluída em 18/10. Base: `7048936`. O único arquivo alterado em `publicar/` é `_headers`; os 20 HTML, CSS, JavaScript, imagens, textos, datas e endereço foram preservados.

## Mudanças

- CSP global com recursos próprios como padrão, bloqueio de objetos e manipuladores inline, hash explícito para o script existente de tema e permissões para os provedores já utilizados. Scripts inline arbitrários e `eval` de JavaScript continuam bloqueados. Estilos inline existentes e WebAssembly do VLibras são permitidos. O redirecionamento do loader oficial para o caminho VLibras no jsDelivr está contemplado.
- HSTS por um ano somente para o domínio acessado, sem `includeSubDomains` ou `preload`.
- `wrangler.jsonc` versiona o Worker existente e sua pasta `publicar/`, mantendo a normalização de URLs e ativando `not_found_handling: 404-page`. Rotas inexistentes usam a página `404.html` existente com HTTP 404. A data de compatibilidade 08/10/2026 é suportada pelo runtime já instalado.

Publicação pelo fluxo GitHub existente, sem deploy manual, mudança de DNS ou acesso ao painel Cloudflare. Esta configuração não altera nem depende do cadastro no Google Maps.

## Validação

- Estática: 20 HTML preservados contra a base, 19 scripts inline autorizados pelo hash, política com 1.302 caracteres e nenhum erro.
- Runtime real local do Wrangler/workerd: 26 respostas aprovadas, incluindo as 20 páginas e seis rotas inexistentes. Conferidos corpo HTML, status, CSP, HSTS e `nosniff`. Tentativas de acessar `.env`, `.git/config` e `wrangler.jsonc` devolvem a página 404.
- Navegador: 36 verificações aprovadas, cobrindo temas, larguras 390/1366, menu, destino do WhatsApp, página 404 e bloqueio de script inline injetado. Zero violações CSP inesperadas e zero erros de página.
- Sintaxe dos três scripts publicados e do teste de navegador aprovada; `git diff --check` aprovado.

O teste de navegador utiliza servidor Python leve para emular os cabeçalhos. O teste HTTP separado usa o runtime real do Worker. A integração de navegador usa os loaders oficiais baixados e um redirecionamento simulado; confirma o carregamento do botão VLibras e a criação do iframe Instagram. Conteúdo interno dos frames, reprodução de vídeos, tradução/avatar completos e envio real de WhatsApp não foram exercitados. Não se trata de uma auditoria de penetração nem de garantia de ausência de vulnerabilidades.

As execuções foram sequenciais para poupar memória; navegador e servidores de teste foram encerrados. Nenhuma dependência foi instalada. Evidências locais: [estática](evidencias/2026-10-17/seguranca-tecnica/estatica.json), [runtime](evidencias/2026-10-17/seguranca-tecnica/runtime-local.json) e [navegador](evidencias/2026-10-17/seguranca-tecnica/navegador.json). A pasta mantém a data de início da rodada.

## Repetição e publicação

`docs/testes/seguranca-tecnica-20261017.py` verifica cabeçalhos e preservação; `docs/testes/verificar-seguranca-http.py` verifica o domínio por padrão e aceita `--origin` para o runtime local. O teste de navegador recebe o caminho de uma instalação existente de Playwright; `preparar-fixtures-seguranca.py` prepara os loaders públicos e `servidor-csp-leve.py` inicia o servidor leve.

Após o push, executar novamente o verificador HTTP no domínio e `docs/testes/publicacao-auditoria-20261017.py` para comparar as páginas e os recursos publicados com o checkout. Comparar também `git ls-remote origin refs/heads/main` com `git rev-parse HEAD`. Os resultados locais acima antecedem essa verificação de publicação; a confirmação ao usuário deve informar separadamente o resultado observado no domínio.

## Referências técnicas

- [Cloudflare: página 404 e rotas de arquivos estáticos](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/).
- [Cloudflare: cabeçalhos dos arquivos estáticos e limites](https://developers.cloudflare.com/workers/static-assets/headers/).
- [MDN: CSP script-src, hashes e WebAssembly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src).
- [MDN: HSTS e seu escopo](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security).
