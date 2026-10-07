# Verificações da versão atual

## Rodada exclusivamente local de SEO — 07/10/2026

Servidor dos testes desta rodada: `python -m http.server 8091 --bind 127.0.0.1 --directory publicar`, a partir de `02-site`. Na máquina atual, use `C:/Users/fabri/AppData/Local/Programs/Python/Python314/python.exe` no lugar de `python` se necessário.

Validação sem rede:

```powershell
node docs/testes/validacao-estatica.cjs "C:/Users/fabri/AppData/Local/Programs/Python/Python314/python.exe"
```

O argumento Python é opcional: no Windows, procura a instalação local de Python 3.14 e depois usa `py`; nos demais sistemas usa `python3`. Também aceita `GESCOMP_PYTHON`. Nesta máquina o launcher `py` não encontra a instalação, então o caminho explícito evita o atalho da Store. O comando executa `node --check` de site.js/config.js e `auditoria-seo-local.py`: metadados, duplicidades, JSON-LD, identidade/NAP, breadcrumbs, assets/alt/dimensões, links/âncoras, grafo de descoberta, sitemap e preservação da base. A auditoria inicial usa `--antes`; não sobrescrever sua evidência depois da implementação. A base desta rodada é `f970f3f`.

Funções para Playwright MCP:

- `revisao-seo-local.js`: 17 páginas × 4 larguras × 2 temas, axe A/AA, overflow, H1, imagens, exceções JS e mensagens WhatsApp. Permite `page.seoOnlyPages`/`page.seoOnlyThemes` para repetir cenários afetados. Toda conexão externa é interceptada em contexto novo, sem contas autenticadas.
- `interacoes-seo-local.js`: foco/teclado, oito contatos diretos, formulário com telefone opcional e window.open simulado, caminho home → serviço, conteúdo sem JS, animações/transição do rio e capturas. URLs limpas são emuladas somente no servidor local; não prova redirects ou publicação de produção.
- `rio-comparacao-seo-local.js`: comparar a base Git e a versão atual com transição concluída, SMIL em t=0 e elementos externos ao rio fora do enquadramento. Preparar apenas temporariamente `publicar/__seo_base_local.html` com o HTML do Git e remover imediatamente após o teste. Nunca publicar esse arquivo de teste.
- `comparar-rio-seo-local.py`: comparação de pixels das oito duplas estabilizadas, com Pillow já disponível. Não modifica imagens.

Resultados em `../evidencias/2026-10-07/seo-local/`. A execução inicial com defeitos e os retestes ficam separados: não confundir diagnóstico histórico com a matriz final. SDKs de Meta/VLibras são bloqueados; seus serviços externos e cabeçalhos de hospedagem não foram testados nesta rodada. Acessibilidade automatizada não substitui toda avaliação humana. Os scripts históricos abaixo não autorizam contato externo nesta tarefa.

## Histórico anterior à rodada de SEO

Executar o servidor dentro de publicar/: `python -m http.server 8080 --bind 127.0.0.1`. Na máquina atual o Python 3.14 é chamado pelo executável instalado; o launcher py não encontrou a instalação.

Sintaxe e SEO, a partir de 02-site:

```
node --check publicar/assets/js/site.js
node --check publicar/assets/js/config.js
node docs/testes/validacao-estatica.cjs
node docs/testes/preparar-evidencias-fotos.cjs
```

Os arquivos abaixo são funções para o Playwright MCP, executadas com browser_run_code_unsafe(filename). Cada uma cria e fecha seu próprio contexto; não interfere na página do outro agente. Não há dependências adicionadas ao site.

- matriz-final.js: 80 combinações de página, tela e tema, incluindo axe A/AA, overflow e erros locais. Instagram e VLibras simulados nessa matriz.
- funcional-etapa-1.js: 23 verificações de formulário, mensagens, lista vazia/fixtures de avaliações e pausas/retomadas da função compartilhada de carrossel. As avaliações de teste existem apenas em rotas do navegador.
- revisao-fotos-reais.js: 31 verificações de avaliações reais, altura comum, movimento circular, teclado, toque nativo, movimento reduzido, grade 3/2/1 e futuro retrato. Inclui 900 e 1024px além das telas pedidas. O retângulo de teste do retrato nunca vai para publicar/.
- rio-fotos-reais.js e comparar-rio-fotos-reais.py: capturas/HTML/CSS comparados ao commit 5d4dc81. O primeiro requer preparar-evidencias-fotos.cjs; o segundo usa Pillow já disponível na ferramenta local.
- capturas-fotos-reais.js: antes/depois da abertura e dos serviços, mais grade dos assuntos. Reconstrói o antes usando fixtures de HTML/CSS/JS/imagens do Git; arquivos antigos não precisam permanecer publicados.
- revisao-integracao-claude.js: 16 verificações dos novos pedidos: capa até MOUNTED, origem/janela da mensagem, números em 1600ms, carregamento da futura foto de Sobre, destaque configurável/lista vazia e oito links contextuais.
- monitoramento-plano-claude.js: registro anterior à correção da foto de Sobre; reproduz a falha com lazy na moldura oculta. Não confundir esse diagnóstico histórico com a validação final de revisao-integracao-claude.js.

As avaliações giram com os próprios cinco cards, sem cópias. A prova adicional de várias voltas e a inspeção real da Meta estão registradas em ciclos-fotos-reais.json e instagram-politicas-fotos-reais.json. O teste externo simulou apenas os cabeçalhos locais do arquivo _headers, porque o servidor Python não os aplica; os recursos da Meta/VLibras eram reais. Não representa publicação em produção.

Os scripts revisao-imagens.js, otimizar-imagens.py, rio-imagens.js e comparar-rio-imagens.py registram a versão anterior do commit 5d4dc81. Não são critérios da versão atual: ela não possui mais gráfico, selos nem imagens geradas. Os resultados antigos ficam como histórico.

Evidências atuais ficam em ../evidencias/2026-10-04/ com nomes fotos-reais. Lighthouse verifica a categoria acessibilidade; não foi medida pontuação de desempenho. Nenhum script de teste autoriza push/deploy ou alteração do domínio.
