# SEO — colaboração Codex (executor) e Claude Code (auditor)

Escopo: só arquivos e testes locais deste repositório. Nada de Google, Search Console, Business Profile, Cloudflare, DNS, deploy, push ou pedido de indexação.

Como usar este arquivo:
- **Codex:** registra o que mudou e por quê.
- **Claude:** revisa e marca cada ponto como APROVADO, CORRIGIR, REMOVER, MELHORAR, RISCO ou OPORTUNIDADE, sempre com arquivo, trecho, motivo e correção.
- **Divergências:** ficam escritas aqui. Ninguém apaga o histórico do outro.

## Linha de base (Claude Code, 07/10/2026)

Estado antes da rodada de SEO: commit **`f970f3f`**, árvore limpa. A auditoria completa está em `seo-base-f970f3f.json`, na pasta temporária do Claude. O resumo vai abaixo.

### Páginas e papéis atuais

| URL | Papel / intenção | Title (car.) | Palavras |
|---|---|---|---|
| `/` | Institucional + conversão (WhatsApp), local | Contabilidade online e em Barra dos Coqueiros (55) | 1.268 |
| `/informacoes` | Hub de guias + artigo de reforma tributária | Informações contábeis, MEI e escala 6x1 (49) | 993 |
| `/abrir-empresa` | Guia: como abrir empresa | Como abrir uma empresa: passo a passo (47) | 1.036 |
| `/mei` | Guia: regras do MEI 2026 | MEI 2026: valor do DAS, limite… (62) | 999 |
| `/simples-nacional` | Guia: Simples, limites e prazos | Simples Nacional: limites e prazos… (63) | 1.202 |
| `/imposto-de-renda` | Guia: IR 2026 | Imposto de Renda 2026: isenção… (53) | 1.145 |
| `/pro-labore-e-lucros` | Guia: retiradas dos sócios | Pró-labore e distribuição de lucros… (53) | 961 |
| `/departamento-pessoal` | Guia: folha, INSS, FGTS | Folha de pagamento 2026… (59) | 997 |
| `/calendario-fiscal` | Guia: prazos | Calendário fiscal: prazos até maio de 2027 (52) | 700 |
| `/fim-escala-6x1` | Notícia/projeto: PEC 6x1 | Fim da escala 6x1… (54) | 516 |
| `/novo-limite-mei` | Notícia/projeto: teto do MEI | Novo limite do MEI… (53) | 528 |

Pontos verificados:
- **Estrutura:** todas as páginas têm um único H1, canonical correto, `index, follow` (a 404 tem `noindex`) e nenhuma imagem sem `alt`.
- **Sitemap:** lista as 11 páginas indexáveis.
- **Barra dos Coqueiros:** aparece 5 vezes na inicial e 1 vez em cada artigo (rodapé). Não há excesso.

### JSON-LD da linha de base

- **Inicial:** `AccountingService #empresa`, `WebSite`, `WebPage`, `FAQPage` e `Person #gabriela` (CRC em `hasCredential`).
  - `priceRange` com R$ 150 e R$ 100 confere com os preços visíveis nos cards. **Aprovado.**
  - Não há `AggregateRating` nem `Review`. **Aprovado**, e deve continuar assim.
- **Artigos:** `Article` (autora `#gabriela`), `FAQPage`, `BreadcrumbList` e `Organization #empresa`.

### Problemas que já existiam antes da rodada

1. **CORRIGIR (entidades):** o mesmo `@id` `https://gescompnegocios.com.br/#empresa` é `AccountingService` na inicial e `Organization` nas 10 páginas internas. São dois tipos para a mesma entidade.
   - **Correção:** usar `AccountingService` em todas, ou só referenciar `{"@id": ".../#empresa"}` sem redeclarar o tipo.
   - Como o Codex deve mexer no JSON-LD nesta rodada, deixo para ele. Se não for tratado, corrijo na segunda passagem.
2. **CORRIGIR (teste):** `docs/testes/validacao-estatica.cjs` **já falha** no `f970f3f`, porque espera `og-foto-real-20261004.webp`, e as páginas usam imagens OG por assunto desde 06/10. Também compara com a base fixa `e3c3bb5`.
   - Hoje esse teste não protege nada: qualquer resultado dele precisa ser lido com isso em mente.
   - **Correção:** atualizar as expectativas de OG e trocar a base pelo commit vigente.
3. **OPORTUNIDADE (links internos):** a inicial só tem link no corpo para `/informacoes`, `/mei`, `/simples-nacional`, `/fim-escala-6x1` e `/novo-limite-mei`.
   - `/abrir-empresa`, `/imposto-de-renda`, `/departamento-pessoal`, `/pro-labore-e-lucros` e `/calendario-fiscal` só são alcançáveis a partir de `/informacoes`.
   - Os cards de serviço levam direto ao WhatsApp. Isso é bom para conversão e **não deve virar página intermediária obrigatória**.
   - Um link secundário "Entenda como funciona", no card, pode ligar o serviço ao guia certo.
4. **OPORTUNIDADE (H1 da inicial):** "Contabilidade para entender, planejar e crescer." não tem sinal local nem de serviço. O title tem.
   - **Sugestão:** manter a frase da marca e levar o contexto local para uma linha curta acima ou abaixo, por exemplo "Escritório de contabilidade em Barra dos Coqueiros (SE) e atendimento online". Assim o H1 não vira uma lista de palavras-chave.
5. **RISCO leve:** `robots.txt` aponta para `sitemap.xml?v=20261006` (commit `5e7d850`, para contornar cache). Quando o cache estiver resolvido, voltar à URL limpa, que é a cadastrada nas ferramentas de busca.

### Critérios que vou aplicar à rodada do Codex

- **Páginas novas** só com intenção própria, serviço real, conteúdo próprio e CTA. Nada de páginas por cidade nem de texto que repete um guia existente.
- **Canibalização:**
  - cada consulta deve ter uma URL dona;
  - `/mei` (guia de regras) não pode disputar com uma eventual página de serviço "sair do MEI";
  - `/abrir-empresa` (guia) não pode disputar com uma página de serviço de abertura.
  - Se ambas existirem, os papéis precisam ser distintos: guia informa, serviço vende. Os títulos precisam deixar isso claro, e uma página deve linkar a outra.
- **Texto:**
  - a voz da GESCOMP: clara, humana, simples;
  - "Barra dos Coqueiros" só onde informa;
  - nada de promessas, números, clientes, prazos ou preços que não estejam no site ou na documentação aprovada.
- **JSON-LD:** só o que estiver visível na página; sem entidades duplicadas e sem `AggregateRating` ou `Review`.
- **Conversão:** nenhum CTA de WhatsApp pode virar clique extra.
- **Desempenho:** a inicial pesava cerca de 279 KB no celular (Lighthouse, após `d03b023`). Mudanças de SEO não devem acrescentar peso relevante.
  - HTML em gzip no `f970f3f`: inicial 17,9 KB; guias de 8,5 a 10,6 KB; 6x1 e novo limite do MEI 6,7 KB.
  - `site.css`: 34,0 KB brutos. `site.js`: 33,8 KB brutos.
- **Rio:** a seção `#rio` permanece intacta.

## Revisão Claude Code

### Passagem 0 — revisão do plano do Codex (07/10, antes de editar `publicar/`)

Fontes conferidas:
- `01-empresa/textos/servicos-e-precos.md`;
- as 5 linhas e os 3 cards de `#servicos` em `publicar/index.html`;
- `docs/perguntas-para-aprovar.md`;
- `docs/auditoria-seo-local.md` (do Codex).

**APROVADO**
- Nada de páginas por cidade nem de guias duplicados de abertura, IR ou MEI.
- `/trocar-de-contador` fora desta rodada, porque o serviço não foi confirmado.
- Manter o H1 da marca e levar o contexto local ao parágrafo da abertura.
- Unificar o tipo de `#empresa`, corrigir `meta author`, dar description à 404 e consertar o teste obsoleto.
- Não tocar em robots, headers, imagens nem animações.
- `/regularizacao-baixa-cnpj` e `/calculos-trabalhistas`: intenções próprias, serviços reais e preço publicado (cálculos a partir de R$ 100).
  - Os cálculos se distinguem de `/departamento-pessoal` (guia de folha) desde que não prometam folha mensal nem eSocial, como o Codex já previu.

**CORRIGIR antes de implementar**

1. **Conversão — as 5 linhas compactas.**
   - **Trecho:** `index.html`, `#servicos`, os 5 itens `a.ajuda-linha` com `data-whatsapp-msg`.
   - **Problema:** se o link passar a levar à página de serviço, quem já decidiu ("quero dar baixa no CNPJ") ganha um clique a mais antes do WhatsApp. É exatamente o risco nº 15 e nº 16 do pedido.
   - **Correção (preferida):** linha com dois alvos, padrão comum em listas de serviço.
     - O nome do serviço leva à página.
     - Um botão de WhatsApp à direita (alvo de 44 px, `aria-label="Falar no WhatsApp sobre …"`, mesmo `data-whatsapp-msg`) abre a conversa direto.
     - Precisa de um ajuste pequeno de CSS. Se o Codex preferir não mexer em CSS, eu faço essa parte depois do HTML dele.
   - **Mínimo aceitável:** manter as linhas como estão (WhatsApp direto) e dar caminho às páginas pelo rodapé (lista "Serviços", com as classes de link já existentes) e pelos guias relacionados.
2. **Escopo — `consultoria-financeira`: não criar nesta rodada.**
   - **Motivo:** a única fonte é "consultoria administrativa e financeira", com valor "a consultar". Não há escopo, entregáveis nem exemplos aprovados. A página sairia genérica ou inventada (riscos nº 5 e nº 11).
   - **Correção:** a linha continua abrindo o WhatsApp. Incluir em `perguntas-para-aprovar.md`: "O que a consultoria administrativa e financeira inclui? Para quem é? Como é cobrada?". A página só nasce com a resposta.
3. **Escopo e canibalização — `planejamento-tributario`.**
   - **Problema de escopo:** o serviço publicado é "Escolher o melhor regime de impostos". "Planejamento tributário" sugere um serviço mais amplo, com promessa implícita de economia (inflação de escopo).
   - **Problema de canibalização:** a página disputaria "Simples, Presumido ou Real" com a seção de mesmo nome em `/simples-nacional` e "virar microempresa" com `/mei`.
   - **Correção:**
     - URL e H1 fiéis ao serviço, por exemplo `/escolha-de-regime-tributario` e "Escolha do regime de impostos da sua empresa".
     - Conteúdo de serviço, não de guia: o que a Gabriela analisa (faturamento, atividade, folha), o que o cliente envia, o que recebe e quando revisar. Sem explicar os regimes de novo; para isso, link para `/simples-nacional`.
     - A linha "Deixar de ser MEI" aponta para esta página, numa seção curta sobre a saída do MEI. Não criar página separada de MEI.
     - `/mei` e `/simples-nacional` ganham um link contextual para ela.
4. **Escopo — `contabilidade-empresarial`.**
   - **Problema:** é a página comercial mais importante, mas o que está incluso no plano de R$ 150 **não está aprovado** (`perguntas-para-aprovar.md`).
   - **Correção:**
     - Usar só o que já é público: texto do card, "a partir de R$ 150/mês", os 3 passos de `#como-funciona`, atendimento direto com a Gabriela (CRC), escritório e online, e links para `/calendario-fiscal`, `/pro-labore-e-lucros` e `/simples-nacional`.
     - Nada de lista de inclusões, nem "cuidamos de tudo".
     - Diferenciar da inicial: a inicial é marca e local; esta página é o serviço mensal. Title sem repetir o da inicial, por exemplo "Contabilidade para empresas: como funciona | GESCOMP".

**MELHORAR — dados estruturados das páginas de serviço**
- **`Service` por página:**
  - `@id` igual à URL mais `#servico`;
  - `provider: {"@id": ".../#empresa"}`;
  - `areaServed` igual ao da inicial;
  - `offers` só onde houver preço visível na página (cálculos: R$ 100; contabilidade: R$ 150; demais sem `offers`);
  - mais `BreadcrumbList`.
- Não redeclarar o `AccountingService` completo em cada página: basta a referência por `@id`, ou o nó mínimo com o **mesmo** tipo.
- No `hasOfferCatalog` da inicial, apontar `itemOffered` para os `@id` dos novos `Service`, em vez de duplicar descrições.

**RISCO — texto**
- **Tamanho:** páginas de serviço curtas e concretas (400 a 700 palavras bastam).
- **Perguntas frequentes:** só com respostas já publicadas no site ou fatos verificáveis.
- **Barra dos Coqueiros:** no máximo uma menção natural no corpo de cada página (atendimento presencial e online), além do rodapé.
- **Títulos:** sem "contador em Aracaju", porque a localização é Barra dos Coqueiros e "Grande Aracaju" só aparece como referência geográfica.

**OPORTUNIDADE**
- **Links dos guias para os serviços:** cada guia pode ganhar um único link para o serviço relacionado, dentro do `.cta-contexto` já existente, sem mais links soltos no texto:
  - `/departamento-pessoal` e `/fim-escala-6x1` → cálculos;
  - `/simples-nacional`, `/mei` e `/novo-limite-mei` → regime;
  - `/calendario-fiscal` e `/pro-labore-e-lucros` → contabilidade.
- **`sitemap.xml` e `llms.txt`:** incluir as páginas novas (4 com as correções acima).

Na passagem 1, reviso o diff completo das páginas.

## Codex — plano após auditoria, antes de editar o publicado (07/10)

Li a linha de base e os pontos do Claude. Inventário próprio em `docs/evidencias/2026-10-07/seo-local/auditoria-antes.json`; diagnóstico em `docs/auditoria-seo-local.md`. Capturas antes da abertura/rio em 1366, 1920, 390 e 360px, nos dois temas, com toda rede externa bloqueada: sem overflow.

- Criar cinco serviços confirmados: contabilidade empresarial, regularização/baixa, cálculos trabalhistas, consultoria financeira e orientação de regime (`planejamento-tributario`). Troca de contador fica pendente: o usuário pediu explicação, não confirmou o serviço.
- Concordo com preservar H1 e inserir localidade no parágrafo. Concordo em preservar contato imediato: manter os três botões WhatsApp e adicionar links secundários descritivos para guias/serviço. As cinco linhas compactas passarão a apontar para seus serviços, com WhatsApp específico na página de destino. Assim a arquitetura home → serviço → contato existe sem impor um passo extra a quem já quer conversar.
- Corrigir o tipo consistente de `#empresa`, meta author dos artigos, description da 404 e o teste estático obsoleto. Preservar datas de consulta e conteúdo legal; não copiar respostas não aprovadas nem vender folha mensal sem confirmação.
- Não tocar CSS, JS, imagens, robots ou headers. Nenhuma operação externa, deploy ou push. Solicito depois crítica do Claude sobre distinção de intenções, veracidade de escopo, conversão e schemas.

## Codex — primeira implementação e leitura da passagem 0

Primeira implementação disponível para revisão: cinco páginas, blocos de atendimento pontuais nos dez guias/hub, links secundários nos três cards principais, parágrafo local na abertura, meta author, tipo consistente de empresa e sitemap/llms. Description da 404 incluída. Checagem inicial: 17 HTML, 16 indexáveis, nenhum erro estático; axe no serviço empresarial em 1366px não encontrou violações A/AA. A bateria completa ainda está em andamento.

Li a passagem 0 completa. Vou ajustar antes da revisão final:
- Concordo sobre preservar acesso imediato nas cinco linhas: restaurar WhatsApp e colocar link secundário fora do alvo original, sem mudar CSS nem aninhar links.
- Concordo com o nome mais fiel: renomear a URL não publicada de `planejamento-tributario` para `escolha-de-regime-tributario`; não oferecer um serviço tributário amplo. Texto não reproduz tabelas/regras dos guias.
- Concordo em manter escopo de R$ 150 a confirmar, sem lista de inclusões; title empresarial pode distinguir melhor da home.
- Não concordo em excluir automaticamente consultoria: o serviço é confirmado em `01-empresa/textos/servicos-e-precos.md`, no texto Sobre aprovado pelo usuário e nas FAQs públicas sobre separar contas e acompanhar custos. A página usa essas questões, não promete entregáveis, recorrência, resultados ou preço fixo. Vou acrescentar a pergunta de aprovação sobre escopo e retirar qualquer afirmação não sustentada se a revisão apontar um trecho concreto. A existência do serviço e o desconhecimento dos detalhes de contratação são questões diferentes.
- Offers só nos dois serviços com preço publicado. Provider/IDs estáveis; manter AccountingService mínimo nos artigos.

Claude: favor revisar o diff após esses ajustes, principalmente o texto de consultoria (apontar frase e fonte), conversão, identidade das entidades e as novas seções nos guias. Não editar os trechos enquanto concluo essas correções; registrar observações aqui.

## Codex — resultado da primeira bateria e correção

Executei 136 cenários (17 páginas × 4 larguras × 2 temas), todos locais e sem conexões externas: nenhum overflow, H1 duplicado, imagem quebrada ou exceção JavaScript; mensagens WhatsApp corretas. O axe detectou contraste insuficiente **nos links que acrescentei aos dez guias, somente no tema escuro**. Corrigi esses links para herdar o token já aplicado ao parágrafo; não alterei CSS. A primeira execução fica registrada em `matriz-primeira-execucao.json` e vou repetir os 40 cenários afetados, guardando o resultado final separado.

Os cinco serviços passam A/AA nos oito cenários cada. Também retirei do texto público de cálculos a observação sobre o que a página não anuncia: basta apresentar as verbas atendidas e combinar o escopo. Essa restrição continua apenas na documentação interna.

A implementação está pronta para a passagem 1 do Claude. Artefatos: `docs/auditoria-seo-local.md`, `docs/testes/auditoria-seo-local.py` e evidências em `docs/evidencias/2026-10-07/seo-local/`. O teste antigo agora executa a auditoria atual e node --check, sem expectativas obsoletas. Aguardo a crítica do diff enquanto termino preservação visual e interações locais.

## Codex — leitura da passagem 1 e ordem de edição

Li a passagem 1 completa. Concordo com a consolidação dos CTAs, links compactos e texto mais direto. Vou esperar "passagem 1 aplicada" antes de escrever os heads dos mesmos arquivos, evitando sobrescrita concorrente.

- **Grafia:** manter `on-line` nos dois parágrafos da abertura, exigência explícita do usuário em 07/10. É aceitável padronizar como online nos serviços novos; não substituir a grafia aprovada da abertura.
- **Datas:** removerei `WebPage.dateModified` dos guias para evitar ambiguidade com revisão técnica. **Manterei lastmod em 07/10 nos documentos efetivamente alterados**, pois receberam conteúdo comercial visível e links novos. Isso não simula revisão legal: Article/date visível mantêm a data de consulta. Voltar o lastmod do documento modificado à data antiga ocultaria uma edição real, contrariando a fase 12 do pedido. Se algum guia ficar sem mudança de conteúdo/navegação após a consolidação, revisarei seu lastmod individualmente.
- **Description:** aceito a versão mais curta sugerida.
- **Provider:** acrescentarei AccountingService mínimo com o ID existente, dados idênticos à home/endereço visível. Retirarei a lista redundante de areaServed dos serviços; a cobertura continua no provider principal.

Reteste dos 44 cenários afetados: todos passaram. Matriz consolidada de 136 cenários sem falhas em `matriz-navegador.json`; 25 verificações de interações passaram em `interacoes.json`. Após suas edições no body, repetirei as verificações pertinentes.

As primeiras capturas do rio tinham diferenças de elementos fixos e de transição ainda em curso (não do código). HTML/CSS/JS estão idênticos à base. Estou estabilizando a comparação com a transição concluída e sem as seções externas ao rio no enquadramento; os registros iniciais continuam como evidência histórica.

## Revisão Claude Code — passagem 1 (diff completo, 07/10)

Como revisei:
- auditoria automática das 17 páginas (title, description, headings, links, JSON-LD, menções locais), comparada à linha de base;
- leitura do texto visível das 5 páginas novas e dos blocos acrescentados aos guias;
- capturas em 1366 e 390 px;
- diff de `index.html`, `sitemap.xml`, `llms.txt` e `perguntas-para-aprovar.md`.

### APROVADO
- **Arquitetura enxuta:**
  - nenhuma página por cidade e nenhum guia duplicado;
  - `/trocar-de-contador` fora;
  - `/escolha-de-regime-tributario` com nome fiel ao serviço e sem repetir as regras do Simples.
- **Conversão preservada:** os 3 cards e as 5 linhas da inicial continuam abrindo o WhatsApp direto, com mensagem por assunto.
- **JSON-LD:**
  - `#empresa` agora é `AccountingService` em todas as páginas;
  - `Service` por página, com `provider` por `@id`;
  - `offers` só em cálculos (R$ 100) e contabilidade (R$ 150), que aparecem na página;
  - nenhum `Review` ou `AggregateRating`;
  - `itemOffered` do catálogo da inicial aponta para os `@id` novos.
- **Detalhes:** `meta author` nos artigos, description da 404, pergunta da consultoria em `perguntas-para-aprovar.md`, sitemap e `llms.txt` com as páginas novas.
- **Consultoria financeira:** aceito o argumento do Codex. O serviço é confirmado e a página não inventa entregáveis nem preço. **Fica**, com o texto enxugado (ver CORRIGIR 4).

### CORRIGIR

1. **Chamadas duplicadas no fim dos 10 guias.**
   - **Arquivos:** `abrir-empresa`, `calendario-fiscal`, `departamento-pessoal`, `fim-escala-6x1`, `imposto-de-renda`, `informacoes`, `mei`, `novo-limite-mei`, `pro-labore-e-lucros`, `simples-nacional`.
   - **Trecho:** a seção nova (`#atendimento-abertura`, `#declarar-ir`, `#atendimento-mei`, `#solicitar-calculo`, `#orientacao-regime` etc.) vem **logo depois** de "Ficou com alguma dúvida?", que já tem botão de WhatsApp. A página termina com dois blocos de contato seguidos, cada um com o seu botão. Somando o `.cta-contexto`, são 3 chamadas de WhatsApp no fim de cada guia.
   - **Motivo:** redundância visual e de conteúdo, e cara de página "otimizada".
   - **Correção:**
     - fundir os dois blocos em um só: manter a seção escura "Ficou com alguma dúvida?" (identidade visual atual);
     - trocar o subtítulo por uma frase do serviço daquele guia e incluir **um** link para o serviço relacionado;
     - mover o `id` da seção nova (`#declarar-ir`, `#atendimento-abertura`, `#atendimento-mei`) para a seção fundida, porque os cards da inicial apontam para essas âncoras;
     - remover a seção branca nova.
   - **Quem faz:** Claude.
2. **As 5 frases-link embaixo das "Outros serviços" (inicial).**
   - **Trecho:** `<p class="texto" style="margin:8px 16px 0…"><a href="/regularizacao-baixa-cnpj">Entenda a regularização…</a></p>` e os outros 4.
   - **Motivo:** dobram a altura da lista (no celular, 5 linhas viram 10 blocos). "Entenda…/Conheça…/Veja…" repetem o nome que está logo acima, o mesmo padrão de excesso que o usuário já reprovou (`design-sem-cara-de-ia`).
   - **Correção:** uma única linha discreta abaixo da lista, "Saiba como funciona: Regularização e baixa · Cálculos trabalhistas · Regime de impostos · Saída do MEI · Consultoria". Cada link com nome curto, sem `style` inline. As linhas continuam abrindo o WhatsApp.
   - **Quem faz:** Claude.
3. **Abertura da inicial.**
   - **Trecho:** "Em Barra dos Coqueiros, na Grande Aracaju, e on-line, tiramos suas dúvidas…".
   - **Motivo:** alterou a frase aprovada (perdeu o "todas") e empilhou três locativos no começo, o que soa forçado.
   - **Correção:**
     - restaurar "Tiramos todas as suas dúvidas de forma clara, transparente e acessível.";
     - pôr o sinal local onde ele informa: um item na lista `.confianca` ("Escritório em Barra dos Coqueiros (SE)", com o ícone de alfinete) ao lado de "Atendimento online".
   - **Quem faz:** Claude.
4. **Texto das 5 páginas de serviço: defensivo, metalinguístico e com o mesmo esqueleto.**
   - **Arquivos:** `contabilidade-empresarial`, `regularizacao-baixa-cnpj`, `calculos-trabalhistas`, `escolha-de-regime-tributario`, `consultoria-financeira`.
   - **Exemplos de trechos a cortar ou reescrever:**
     - "Esta página não substitui a avaliação da empresa nem transforma uma proposta de lei em regra vigente." (regime)
     - "Essa é uma orientação para começar a conversa, não uma lista definitiva de documentos." (regularização)
     - "sem prometer uma solução igual para todas as empresas" e "sem garantia de conclusão imediata" (regularização)
     - "Esse é o preço de entrada divulgado para cálculos trabalhistas." e "Não use um resultado como referência universal." (cálculos)
     - "O preço de entrada já é apresentado nos serviços da GESCOMP." e a ressalva da mensalidade dita duas vezes ("não considere que todo serviço avulso…" e "Não presuma essa inclusão.") (contabilidade)
     - "O faturamento sozinho não conta toda a história" e "O atendimento não promete lucro, retorno financeiro ou resultado garantido." (consultoria)
   - **Motivo:** as ressalvas jurídicas e as frases sobre a própria página não ajudam o cliente e soam escritas para robô. A mesma ressalva aparece em todas as páginas, e o parágrafo "em Barra dos Coqueiros, na Grande Aracaju, Sergipe, e on-line" se repete idêntico nas 5. O conteúdo verdadeiro continua; só sai o excesso.
   - **Correção:**
     - dizer o limite **uma vez**, de forma positiva ("O que entra no atendimento é combinado na proposta, conforme a sua empresa.");
     - tirar as frases sobre a página;
     - uma menção local natural por página;
     - "on-line" → "online", como no resto do site;
     - trocar a linha "Por Gabriela… (CRC)", que é assinatura de artigo, por "Atendimento com Gabriela do Nascimento Vieira, contadora (CRC 009186/SE)".
   - **Quem faz:** Claude, sem mudar fatos, preços, links nem JSON-LD.
5. **Datas que inflam atualização.**
   - **Trechos:** o `WebPage.dateModified: 2026-10-07` acrescentado aos 10 guias e o `<lastmod>` 2026-10-07 de todos os guias no `sitemap.xml`.
   - **Motivo:** o conteúdo técnico não foi revisado hoje (o "Atualizado em" visível segue 01/10, 03/10 e 06/10). Isso contraria a regra do handoff "não atualizar datas só para parecer conteúdo novo" e diverge do `Article.dateModified` da mesma página.
   - **Correção:** tirar `dateModified` do `WebPage` dos guias (ou igualar ao `Article`) e voltar o `lastmod` dos guias às datas anteriores. As páginas novas e a inicial ficam com 07/10.
   - **Quem faz:** Codex (JSON-LD e sitemap são dele).
6. **Description da inicial com 167 caracteres.**
   - **Trecho:** `index.html` description, og e twitter.
   - **Correção:** até cerca de 155 caracteres, por exemplo "Contabilidade em Barra dos Coqueiros (SE) e online. Fale direto com Gabriela: abertura de CNPJ, impostos, cálculos trabalhistas e Imposto de Renda." (148).
   - **Quem faz:** Codex.

### MELHORAR
- **`Service.areaServed`** nas páginas novas lista só Barra dos Coqueiros e Brasil, enquanto o `AccountingService` lista os estados. Não é erro: basta remover `areaServed` do `Service` (herda do provider) ou usar a mesma lista. (Codex)
- **Nó `AccountingService` nas páginas de serviço:** declarar o mínimo, como nos guias, para o `provider` resolver dentro da própria página. (Codex)

### RISCO
- **Páginas de serviço com 480 a 520 palavras e pouca informação específica.** São honestas, mas finas. Ficam publicadas; quando a Gabriela responder o escopo, devem ganhar exemplos reais.
- **`robots.txt` com `sitemap.xml?v=…`:** segue o risco leve da linha de base, não tratado nesta rodada (decisão consciente).

### OPORTUNIDADE
- **Folha mensal:** depois de confirmar se a GESCOMP faz folha mensal, decidir se `/departamento-pessoal` ganha uma página de serviço própria. Hoje, corretamente, não ganha.

**Divisão para não conflitar:**
- **Claude:** edita a partir de agora os itens 1 a 4, ou seja, os blocos finais dos 10 guias, `#servicos` e `#inicio` da inicial e o texto visível das 5 páginas de serviço.
- **Codex:** por favor não edite esses trechos até eu registrar "passagem 1 aplicada". Os itens 5, 6 e MELHORAR ficam com você (`<head>`, JSON-LD e sitemap).

## Codex — conferência da passagem 1 e próximos ajustes de head

Li a passagem 1. Vou editar somente head/JSON-LD e versões de assets, conforme a divisão registrada pelo Claude; não vou alterar seus trechos de body antes do registro de conclusão.

- Concordo com consolidação de CTAs, links compactos e texto mais direto. Consultoria fica conforme as fontes aprovadas, sem inventar entregáveis.
- Manter `on-line` nos parágrafos aprovados da abertura: exigência explícita do usuário. Nos serviços novos, online é aceitável.
- Retirarei WebPage.dateModified dos guias para evitar ambiguidade. Manterei lastmod 07/10 nos documentos que receberam atendimento/links novos: houve alteração real de conteúdo/navegação. Article e datas visíveis continuam com a revisão técnica anterior; sitemap não significa nova consulta à legislação. Se algum documento terminar sem alteração real, revisarei a data individualmente.
- Aceito description mais curta da home e AccountingService mínimo nos serviços. Provider/identidade/endereço iguais à home; remover areaServed redundante dos Service.
- CSS ganhou apenas 5 regras específicas de links acrescentadas pelo Claude. A base inteira do CSS continua preservada; o teste protege essa condição, o HTML do rio e todo JS. Atualizarei a data de cache dos assets para 20261007, rev 9, sem mudar JS/fontes/imagens.

Reteste de 44 cenários passou; 25 interações passaram. Comparação controlada do rio, após 2100 ms de transição: todos os 8 pares ficaram idênticos pixel a pixel. As capturas iniciais com diferenças de transição/elementos fixos são históricas, não regressões.

### Passagem 1 aplicada (Claude, 07/10)

Itens 1 a 4 feitos. Codex: os trechos estão liberados, e os itens 5, 6 e MELHORAR continuam com você.

1. **Guias, uma chamada final só.**
   - As 10 seções brancas novas foram removidas. Nos 8 guias com a seção escura "Ficou com alguma dúvida?", ela recebeu:
     - o `id` da seção removida (`#atendimento-abertura`, `#declarar-ir`, `#atendimento-mei` etc.);
     - um subtítulo do serviço com **um** link `.link-claro`;
     - `data-whatsapp-msg` específico no lugar do `data-whatsapp` genérico.
   - Em `/fim-escala-6x1` e `/novo-limite-mei`, o `id` foi para o `.cta-contexto`, que ganhou uma frase com link.
   - Todas as âncoras usadas pela inicial e pelo JSON-LD continuam válidas (8 verificadas no navegador).
2. **Inicial, `#servicos`.** As 5 frases-link saíram. Entrou uma linha `.ajuda-saiba` abaixo da lista: "Saiba como funciona: Regularização e baixa · Cálculos trabalhistas · Regime de impostos · Saída do MEI · Consultoria". As linhas seguem abrindo o WhatsApp.
3. **Inicial, `#inicio`.**
   - Frase aprovada restaurada: "Tiramos todas as suas dúvidas…".
   - Novo item em `.confianca`, "Escritório em Barra dos Coqueiros (SE)", com ícone de alfinete.
4. **Páginas de serviço.**
   - Cortei as ressalvas e as frases sobre a própria página citadas na passagem 1, e cada limite agora aparece uma vez, de forma positiva.
   - A linha de assinatura agora diz "Atendimento com Gabriela…"; os H2 com local viraram "Atendimento com a Gabriela", e "on-line" virou "online".
   - Novas afirmações factuais:
     - tipos de desligamento geram verbas diferentes;
     - outro regime pode sair mais barato em algumas atividades e faixas de faturamento;
     - quem continua após o MEI costuma passar a microempresa, sem encerrar o CNPJ;
     - disputa trabalhista pede advogado.
     São regras gerais conhecidas. Codex, revise se quiser.
   - Contagem de palavras: 405→393, 399→356, 376→344, 417→363 e 418→349.
   - Fatos, preços, links e JSON-LD não foram alterados.
- **CSS:** bloco "Passagem 1 de SEO" no fim do `site.css`, com `.ajuda-saiba` e `.link-claro` (+163 bytes). `rev=8` → `rev=9` nas 12 páginas antigas e nas 5 novas.

**Verificação (Claude, local, rede externa bloqueada)**
- 17 páginas × (1366 e 390 px) × (claro e escuro) = 68 cenários: **0 violações axe A/AA**, nenhuma rolagem lateral, nenhum erro, um H1 por página e todos os botões com `wa.me/5579988771430?text=…`.
- Uma falha real foi encontrada e corrigida: `.conteudo-artigo a:not(.btn-acao)` sobrescrevia a cor do `.link-claro` no `.cta-contexto` (contraste baixo).
- **Peso em gzip:** páginas existentes de +59 a +349 bytes (soma de 112.355 para 113.875). As 5 páginas novas têm de 6,4 a 6,6 KB. `site.js` inalterado.
- **Rio:** `#rio` idêntico ao `f970f3f`, com fim de linha normalizado.

**Testes do Codex: falsos negativos e positivos encontrados**
- **`docs/testes/validacao-estatica.cjs`:** usa `python` por padrão. Nesta máquina, `python` e `python3` são o atalho da Microsoft Store e o teste falha antes de checar qualquer coisa. Rodar com `node docs/testes/validacao-estatica.cjs py`, ou mudar o padrão no Windows para `py`.
- **`docs/testes/auditoria-seo-local.py`:** marca `site.css` como "arquivo protegido alterado". Agora é uma alteração intencional e registrada. A regra precisa aceitar uma lista de mudanças aprovadas, por exemplo comparando o CSS da base mais o bloco anexado, para não virar alarme permanente.
- **Matriz de contraste:** trocar o tema e medir em menos de cerca de 1 s gera dezenas de falsos "color-contrast" no tema escuro, porque mede durante a transição de cor. Na minha primeira rodada, com 200 ms, foram 37 páginas e cenários "falhando". Esperar o fim da transição, ou desligá-la no teste, antes do axe.

### Claude — resposta às duas notas do Codex (07/10)

- **Abertura (on-line):** de acordo. O pedido do usuário de 06/10 (handoff, commit `531dc6c`) foi manter os **dois parágrafos exatamente como pedidos**.
  - O "on-line" está só no 2º parágrafo ("Atendimento on-line e personalizado…"), que **não foi tocado**.
  - O 1º parágrafo aprovado é "Tiramos todas as suas dúvidas de forma clara, transparente e acessível." A versão desta rodada o tinha alterado, e eu só **restaurei o texto exato do usuário**.
  - O sinal local foi para a lista `.confianca`, fora dos parágrafos aprovados.
  - "online" foi padronizado apenas nas 5 páginas novas.
- **`lastmod`:** **APROVADO** o critério do Codex: 07/10 só para documentos com alteração real de conteúdo ou navegação, mantendo `Article` e a data visível na revisão técnica. Retiro a recomendação de voltar as datas. O ponto essencial, tirar `WebPage.dateModified`, está aceito.
- **Teste do CSS protegido:** de acordo com a regra "base inteira preservada + bloco anexado registrado". O bloco "Passagem 1 de SEO" tem 5 regras.

Aguardo o registro de conclusão dos ajustes de head para a passagem 2 (diff completo).
## Codex — heads concluídos, bateria final e passagem 2

A passagem 1 aplicada foi lida. Os heads estão concluídos: description curta, WebPage sem dataModified nos guias, provider AccountingService resolvido nas cinco páginas, imagem social colorida existente e cache 20261007 rev 9. Sitemap mantém 16 URLs e lastmod de alteração real, conforme critério aprovado pelo Claude.

Vou executar a matriz final 136 cenários, interações e comparação controlada do rio. A matriz aguardará 2100 ms após trocar tema e registrará também console.error. O teste de CSS já aceita exclusivamente o bloco de links anexado, preservando integralmente as regras originais. Ajustarei o launcher Windows para py, mantendo opção de caminho explícito.

Para evitar acrescentar uma consulta legal nesta rodada sem acesso externo, vou limitar duas respostas novas a orientação individual: cálculo depende da situação do vínculo e saída do MEI precisa de análise de enquadramento. As regras existentes nos guias e respectivas datas permanecem. Claude: pode fazer a passagem 2 do diff completo; não pretendo outras mudanças de body/CSS além dessas duas frases.

## Revisão Claude Code — passagem 2 (diff completo após os ajustes do Codex, 07/10)

**APROVADO**
- **Heads:**
  - description da inicial com 147 caracteres;
  - `WebPage.dateModified` fora dos guias;
  - `AccountingService` mínimo nas 5 páginas de serviço, com o mesmo `@id`, endereço e telefone da inicial;
  - `areaServed` redundante removido dos `Service`;
  - cache `20261007`/rev 9 (`fontes.css` segue `20261006`, porque não mudou);
  - sitemap com 16 URLs.
- **Respostas suavizadas pelo Codex** (rescisão e saída do MEI): corretas e humanas, sem regra legal nova.
- **Teste de mutação da auditoria do Codex** (cópia isolada do site):
  - o controle sem defeito passa;
  - **8 de 8 defeitos detectados**, cada um com a mensagem certa: AggregateRating, H1 duplicado, link interno quebrado, canonical removido, JSON-LD inválido, página fora do sitemap, imagem sem alt e rio alterado.
  - Nesses casos não há falso positivo nem falso negativo.

**CORRIGIDO pelo Claude nesta passagem (simples e inequívoco)**
- **Imagem de compartilhamento das 5 páginas de serviço.**
  - **Antes:** `logo/logo-gescomp-cor.png`, com 1225×300, fundo transparente e 204 KB. Na proporção 4:1 e com transparência, aparece cortada ou com fundo preto no WhatsApp e nas redes.
  - **Agora:** a foto 1200×630 já usada na inicial (`compartilhamento-inicio-cc0-20261006.webp`), com `og:image` (type, width, height e alt) e `twitter:image` coerentes.

**RECOMENDAÇÕES que ficam (não bloqueiam)**
- **Páginas de serviço com 450 a 500 palavras:** quando a Gabriela responder o escopo da contabilidade (R$ 150) e da consultoria, acrescentar exemplos reais de quem atendem e do que entregam.
- **`robots.txt` com `?v=`:** voltar à URL limpa do sitemap quando o cache estiver resolvido.
- **Grafia:** "online" (title, serviços, item de confiança) convive com o "on-line" aprovado no 2º parágrafo da abertura. Unificar só se o usuário decidir.

**Verificação final (Claude):**
- 68 cenários no navegador (17 páginas × 1366/390 px × claro/escuro): 0 falhas axe A/AA, sem rolagem lateral, sem erro, um H1 por página, WhatsApp com número e mensagem corretos e 8 âncoras válidas.
- `node docs/testes/validacao-estatica.cjs py`: 17 páginas, 0 falhas.
- Peso em gzip das páginas que já existiam: +1,5 KB no total; 5 páginas novas de cerca de 6,5 KB.
- `#rio` idêntico ao `f970f3f`.
- Nenhum acesso externo, deploy, push ou commit.