# Atualização, domínio e publicação

O código usa **https://gescompnegocios.com.br/** em todos os endereços oficiais. A hospedagem existente é o Cloudflare Worker `gescomp-site`, conectado ao GitHub, com assets em `publicar/`. Não há framework nem build.

**Nesta rodada não executar DNS, deploy, push nem alterações em produção.** Os passos externos abaixo são um roteiro para uma execução futura autorizada, não um registro de ações realizadas.

**Verificado em 04/10/2026:** domínio já ativo com NS `alec.ns.cloudflare.com` e `dora.ns.cloudflare.com`; raiz, sitemap, robots, llms e imagem Open Graph respondem HTTPS 200. No ar permanece a versão de assets `20261003`. Codex fez somente consultas de leitura; nenhum DNS/deploy/push. Não repetir os passos de conexão abaixo em uma zona já ativa sem necessidade. Evidência em `evidencias/2026-10-04/dominio-https.json`.

## Conexão externa do domínio

1. Entrar na conta Cloudflare que contém o Worker `gescomp-site`. Não criar uma cópia do Worker na conta curtiZ por engano.
2. Adicionar `gescompnegocios.com.br` nessa conta. Conferir os registros DNS importados, incluindo os de e-mail, e anotar os dois servidores DNS atribuídos pela Cloudflare.
3. No Registro.br, informar exatamente os servidores atribuídos a essa zona e aguardar seu estado ativo. Não reutilizar servidores de outro domínio.
4. No Worker, abrir Settings → Domains & Routes → Add → Custom Domain e adicionar `gescompnegocios.com.br`. A Cloudflare configura o DNS e o certificado do domínio personalizado. [Documentação oficial](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
5. Se houver `www`, configurar DNS com proxy e redirecionamento permanente para a raiz, preservando caminho e parâmetros. Usar as orientações da documentação acima.
6. Conferir HTTPS, página inicial, todas as oito páginas de Informações, imagem Open Graph, sitemap, robots e assets. Após autorização, configurar o redirecionamento do endereço de hospedagem anterior para o domínio oficial.
7. Após a publicação autorizada, cadastrar o domínio no Search Console e enviar `https://gescompnegocios.com.br/sitemap.xml`.

A consulta de DNS de 04/10/2026 e a resposta HTTPS confirmaram a ativação. A publicação das mudanças locais é uma etapa separada, ainda proibida pelo protocolo desta rodada.

## Alterar conteúdo e configuração

- WhatsApp, mensagem padrão, mensagens específicas, e-mail, vídeos e avaliações: `publicar/assets/js/config.js`.
- Conteúdo visível e preços: HTML. Manter ofertas do JSON-LD sincronizadas, sem criar preços ou condições.
- Fotos: seguir `imagens.md`; usar arquivos reais aprovados em `assets/img/fotos/` e manter arte de espera até a entrega.
- Avaliações: só preencher dados reais; seção vazia fica escondida. Cada item contém `nome`, `texto`, `estrelas` e `link` opcional. Não adicionar avaliações ao JSON-LD.
- Respostas de contratação: revisar `perguntas-para-aprovar.md` com a Gabriela antes de publicar. Sincronizar HTML e FAQ estruturada somente após aprovação.
- A estrutura visual e os tokens já foram implementados por Claude e estão descritos no LEIA-ME. Rio protegido, com somente duas exceções confirmadas: placa da casa e cobertura da borda pontilhada da onda. Não alterar outros pontos.
- Atualizar a versão de CSS/JS em todas as páginas: nesta rodada `?v=20261004`. Se houver mais de uma publicação no mesmo dia, usar um sufixo novo.

## Conferência local e fechamento

Usar `py -3 -m http.server 8080 --bind 127.0.0.1` no Windows, dentro de `publicar/`. Abrir páginas internas com `.html` nesse servidor. Para testar URLs sem extensão e `_headers`, usar o Wrangler local existente.

Na etapa 3, verificar as quatro telas, ambos os temas, contraste, teclado, erros, textos de espaço reservado, formulário sem telefone, mensagens dos oito serviços, avaliações vazias e três avaliações de teste, carrosséis com/sem movimento reduzido e prints do rio. Dados de teste não podem ficar em `config.js`.

Executar `node --check` nos dois scripts. A busca pelos dois endereços antigos deve retornar zero em `02-site/`. Registrar resultados efetivos e limitações no `handoff.md` e no arquivo de colaboração.

O commit final pertence ao Codex, após a revisão. O push fica condicionado à resolução da proibição explícita de produção; não há publicação nesta rodada.

## Manutenção

- Revisar artigos tributários todo janeiro e sempre que houver alteração legal. Só mudar `dateModified`, data visível e `lastmod` do artigo quando o conteúdo for efetivamente revisado.
- Depois dos prazos de outubro de 2026, conferir os avisos em Simples Nacional, Informações e Calendário Fiscal.
- Quando imagens já publicadas forem substituídas, mudar seu nome ou versionar a URL; os assets de imagem têm cache de sete dias.
