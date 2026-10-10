# Google Search e Cloudflare — conferência de 06/10/2026

## Resultado na conta Google

Propriedade de Domínio: `sc-domain:gescompnegocios.com.br`, na conta `gescompnegocios@gmail.com`. O painel confirmou **“Você é um proprietário verificado”**. O TXT de verificação já existia e foi preservado; não foi criada outra propriedade.

| Conferência real | Resultado observado |
|---|---|
| Sitemap | **Processado**, 11 páginas encontradas, 0 vídeos; enviado e lido em 06/10/2026 |
| Inicial, Inspeção de URL | **“O URL está no Google” / “A página está indexada”**, HTTPS |
| Testes das URLs publicadas | Inicial, /informacoes, /fim-escala-6x1 e /novo-limite-mei disponíveis e indexáveis |
| Teste publicado do XML | Rastreamento permitido e busca da página bem-sucedida pelo Google |
| Ações manuais | Nenhum problema detectado |
| Problemas de segurança | Nenhum problema detectado no relatório do Google; isso não equivale a uma auditoria de segurança completa |
| IA generativa na Pesquisa | Controle da propriedade já em **Incluir**, preservado |
| Relatório agregado de páginas | Dados em processamento; o painel pede voltar em aproximadamente um dia |
| Core Web Vitals | Ainda sem dados suficientes de usuários reais em celular e computador |

**Endereço cadastrado e aceito pelo Google:**

```text
https://gescompnegocios.com.br/sitemap.xml?v=20261006
```

O endereço sem parâmetro permanecia com “Não foi possível buscar o sitemap”, mesmo após reenvio. Ambos retornam o mesmo XML válido, HTTP 200 e application/xml. O teste publicado do próprio Google também conseguiu buscar o XML. Ao enviar o endereço com versão, o Google processou as 11 URLs imediatamente. Isso é compatível com um estado de busca/processamento anterior, mas não comprova a causa interna do erro.

O cadastro antigo com erro foi removido **somente da lista de Sitemaps do Search Console**, após conferir o novo cadastro processado. Nenhuma página ou arquivo foi excluído. robots.txt passa a indicar exatamente o endereço aceito; o conteúdo do XML e as URLs canônicas continuam iguais.

v=20261006 identifica este endereço de submissão. Não é necessário trocá-lo a cada edição: o Google relê o sitemap. Não use parâmetros nas URLs das páginas dentro do XML. A 404 permanece fora das 11 URLs e com noindex.

As primeiras solicitações manuais de indexação das quatro páginas retornaram um erro genérico do Google, sem confirmação de aceite. Não foram registradas como solicitações aprovadas. A conferência posterior confirmou a inicial indexada; os testes publicados das demais demonstram elegibilidade, não comprovam que todas já foram incluídas no índice. O sitemap processado permite a descoberta sem depender dessas solicitações manuais.

## Cloudflare: configurações realizadas e verificadas

- Conta correta da GESCOMP acessada após autenticação manual do usuário. A sessão Wrangler preexistente é de outra conta e não foi substituída.
- Certificados HTTPS para domínio e wildcard conferidos como ativos.
- **Always Use HTTPS** ativado: HTTP do domínio oficial responde **301** para HTTPS.
- CNAME **www → gescompnegocios.com.br**, com proxy ativo e TTL automático.
- Single Redirect **301**, nome “GESCOMP: www para dominio oficial”: origem `http*://www.gescompnegocios.com.br/*`, destino `https://gescompnegocios.com.br/${2}`, com preservação da query string.
- Conferência pública confirmou que HTTP e HTTPS de www preservam caminho e parâmetros ao redirecionar para o domínio oficial. Sitemap e robots acessíveis sem desafio; o acesso real do Google foi confirmado no Search Console.
- Após o commit/push `5e7d850`, a nova versão do robots já estava publicada, mas sua URL normal ainda entregava a cópia anterior pelo cache. Executado Custom Purge **somente de https://gescompnegocios.com.br/robots.txt**. Conferência posterior da URL normal: HTTP 200 e ponteiro para o sitemap processado, sem mudar políticas de cache. Esse episódio posterior não comprova a causa do erro inicial do sitemap.
- Registros de e-mail/verificação existentes preservados. Nenhuma nova regra WAF, limitação de taxa, assinatura paga ou alteração de segurança alheia ao roteiro.

O endereço alternativo de hospedagem permanece acessível, com canonical para o domínio oficial. Seu eventual desligamento/redirecionamento é uma decisão separada de hospedagem; não foi removido nesta configuração. _redirects de assets Workers não suporta redirecionamento entre domínios.

## Acompanhamento

1. Em **Indexação → Sitemaps**, mantenha o endereço acima com status Processado. Em futuras falhas, use Inspeção de URL → Testar URL publicada → Disponibilidade da página; não crie regras de liberação de bots sem evidência de bloqueio.
2. Após o processamento inicial dos relatórios, confira **Páginas** e inspecione os dois artigos novos. Repita uma solicitação manual apenas se necessário e se o Google voltar a aceitá-la.
3. Acompanhe **Desempenho**, consultas relacionadas aos serviços e localização, e Core Web Vitals quando houver dados reais. Lighthouse é uma medição de laboratório e não substitui esses relatórios.
4. No Perfil da Empresa, mantenha nome, telefone, endereço real em Barra dos Coqueiros e domínio coerentes com o site. A revisão/edição do Perfil da Empresa não foi executada nesta rodada. Não invente filiais, horários ou endereços em outros estados.
5. Atualize artigos quando as regras ou a tramitação mudarem, conferindo fontes oficiais. Não altere datas de revisão apenas para aparentar novidade.

O Google usa os requisitos comuns de SEO para AI Overviews e AI Mode. A inclusão configurada permite elegibilidade; **não garante posição, indicação pela IA nem a indexação de todas as páginas**. Não é necessário schema especial de IA ou llms.txt para essa elegibilidade. O site não usa Review ou AggregateRating da própria empresa.

## Evidências e limites

Registros em [publicacao-search](evidencias/2026-10-06/publicacao-search/), [confirmação da publicação](evidencias/2026-10-06/publicacao-search/confirmacao-publicacao.json) e detalhes em [handoff.md](handoff.md). A matriz de 96 telas/fontes pertence à revisão local anterior à otimização posterior do Claude; não deve ser apresentada como teste da revisão visual mais recente.

## Fontes oficiais

- [Google: Sitemaps e diagnóstico de erros](https://support.google.com/webmasters/answer/7451001).
- [Google: criação e envio de sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [Google: requisitos para funcionalidades de IA](https://developers.google.com/search/docs/appearance/ai-features).
- [Google: dados estruturados de empresas locais](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- [Cloudflare: Single Redirects e preservação de parâmetros](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/).
- [Cloudflare: limites de redirecionamentos de assets Workers](https://developers.cloudflare.com/workers/static-assets/redirects/).

## Atualização de 08/10/2026 — marca e descoberta dos serviços

Conferência pública atual: o mesmo sitemap aceito `sitemap.xml?v=20261006` retorna HTTP 200/application/xml e **16 URLs**, com as cinco páginas comerciais adicionadas depois da coleta de 06/10. Todas respondem normalmente, têm canonical oficial e não apresentam noindex. robots.txt continua indicando o endereço aceito. HTTP, www e /index.html chegam ao destino canônico. Isso não altera a evidência histórica de 11 URLs no painel nem comprova que as cinco novas já estejam indexadas.

Implementadas localmente melhorias de título/descrição da inicial, identidade WebSite, contexto do escritório e contabilidade empresarial, com datas reais das cinco páginas comerciais sincronizadas. Detalhes, consultas a acompanhar e testes em [seo-marca-2026-10-08.md](seo-marca-2026-10-08.md).

Nesta rodada, o navegador das ferramentas não possui sessão Google autenticada. Nenhum relatório, status de indexação atual, solicitação manual ou alteração de configuração da conta foi confirmado. Depois da publicação, inspecionar a inicial e /contabilidade-empresarial, conferir as cinco comerciais e acompanhar consultas com a marca e com os serviços. Manter o sitemap no endereço já processado; não criar uma submissão com data nova a cada alteração.

Primeiro lugar, correspondência de “GEESCOMP” com a marca GESCOMP e menções por IA são decisões automáticas do Google. Não incluir o erro de digitação como nome oficial nem inferir melhoria de posição apenas de testes locais. As alterações desta rodada ainda não foram publicadas.

## Atualização de 10/10/2026 — conteúdo e estado público

A observação “ainda não foram publicadas” acima descreve o encerramento da etapa de 08/10. As melhorias de marca e serviços daquela etapa foram posteriormente commitadas e enviadas. A conferência pública de 10/10 confirmou HTTP 200, os novos títulos de marca/localidade na inicial e em `/contabilidade-empresarial`, canonical correto e robots permitindo Googlebot. O sitemap aceito continua respondendo em XML com 16 URLs. Evidência em [acesso-publico.json](evidencias/2026-10-10/conteudo-seo/acesso-publico.json). Isso não comprova indexação das 16 páginas ou ganho de posição.

A nova ampliação dos dez guias, fontes e exemplos verificados até 10/10 está **local**, sem publicação nesta rodada. `lastmod` foi atualizado somente nos guias ampliados; não se alterou a submissão `sitemap.xml?v=20261006`. Detalhes em [conteudo-seo-2026-10-10.md](conteudo-seo-2026-10-10.md).

Após publicar:

1. Inspecione uma amostra dos guias alterados e confirme que o Google consegue ler o conteúdo atualizado. Confira o resultado do sitemap já cadastrado, sem criar uma submissão nova por data.
2. Em Desempenho, compare períodos com dados suficientes e filtre grupos de consultas: marca GESCOMP; contabilidade/escritório contábil; Barra dos Coqueiros/Grande Aracaju; serviços; temas dos guias. Observe impressões, cliques e páginas que aparecem, sem atribuir uma oscilação a uma alteração isolada.
3. Se disponível na propriedade, confira o relatório de desempenho de IA generativa mencionado no [guia atual do Google](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide). Não houve acesso a esse relatório nesta rodada.
4. Mantenha o Perfil da Empresa coerente com marca, endereço verdadeiro, telefone e domínio. Não registre grafias erradas como nome comercial nem crie filiais fictícias para pesquisas por cidade.

O guia de IA do Google informa que não há comprimento ideal de artigo nem arquivo/markup exclusivo que garanta visibilidade. `llms.txt` não funciona como mecanismo de classificação no Google. A nova redação acrescenta explicações úteis, fontes e exemplos; não simula marca “GECOMP” e não promete primeiro lugar. Nenhuma alteração foi feita nas contas Google ou Cloudflare nesta rodada.

## Atualização de 10/10/2026 — nome completo e Instagram

Rafael confirmou **Gestão Empresarial e Planejamento Contábil** e **@gescomp_**. A identificação da inicial e dos 16 nós AccountingService associa a marca GESCOMP ao nome e ao perfil oficial; detalhes em [seo-identidade-2026-10-10.md](seo-identidade-2026-10-10.md). Após o push, inspecionar a inicial e, se o painel permitir, pedir nova indexação. Manter a submissão `sitemap.xml?v=20261006`.

Acompanhar consultas `GESCOMP`, `gescomp_`, `@gescomp_`, `GESCOMP negócios`, o nome completo e sua escrita sem acentos, além das combinações com serviços e localização. Esses filtros medem resultados; não são nomes alternativos inventados nem garantias de posicionamento. Nenhuma conta ou rede social foi editada nesta etapa.
