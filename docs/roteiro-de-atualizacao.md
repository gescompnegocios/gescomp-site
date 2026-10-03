# O que fazer quando cada material chegar

**Já aplicado em 01/10/2026:** WhatsApp e e-mail (em `assets/js/config.js`), endereço físico, horário, Instagram e TikTok, CNPJ, CRC, nome oficial, logo nova, slogan, texto Sobre, números, serviços com preços e perguntas frequentes.
**Materiais já disponíveis com o usuário (03/10/2026):** domínio **gescompnegocios.com.br**, comprado no Registro.br, imagens e nome completo. O nome **Gabriela do Nascimento Vieira** já foi aplicado. Conectar o domínio à hospedagem e selecionar/aplicar as imagens no site.
**Ainda falta confirmar/receber:** avaliações do Google (link, avaliações escolhidas, nota e total), CEP, autorizações das fotos, alcance do serviço de folha, aprovação dos textos, logo vetorial (se houver) e referências visuais.

Ordem recomendada: domínio → logo e cores → contatos e dados → fotos → textos e seções novas → publicação final.

1. **Conectar gescompnegocios.com.br ao Worker gescomp-site**
   - O endereço ativo é `https://gescomp-site.gescompnegocios.workers.dev`. O domínio final já foi comprado. Na consulta de 03/10/2026, a delegação DNS ainda está em `a.auto.dns.br` e `b.auto.dns.br` (Registro.br).
   - Adicione `gescompnegocios.com.br` à mesma conta Cloudflare que contém o Worker `gescomp-site`. Confira os registros DNS importados. Anote os dois servidores DNS atribuídos pela Cloudflare.
   - No Registro.br, edite os servidores DNS do domínio e informe exatamente os dois servidores atribuídos pela Cloudflare. Aguarde a zona aparecer como ativa; não use servidores de outro domínio ou de outra conta.
   - No Worker: Workers & Pages → gescomp-site → Settings → Domains & Routes → Add → Custom Domain. Adicione `gescompnegocios.com.br` quando a zona estiver ativa. A Cloudflare cria o registro DNS e o certificado HTTPS. [Documentação oficial](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
   - Para `www`, configure um registro DNS com proxy e uma regra de redirecionamento permanente para `https://gescompnegocios.com.br`, preservando caminho e parâmetros. Veja a seção sobre redirecionamento entre `www` e domínio raiz na documentação oficial acima.
   - Confirme a página inicial, `/informacoes`, `/assets/css/site.css` e `/sitemap.xml` com HTTPS no domínio final. Só depois troque `https://gescomp-site.gescompnegocios.workers.dev` por `https://gescompnegocios.com.br` nos HTMLs de `publicar/`, nos dados estruturados, em `sitemap.xml`, `robots.txt` e `llms.txt`, e publique. Comando, dentro de `publicar/`: `grep -rl "gescomp-site.gescompnegocios.workers.dev" . | xargs sed -i "s#gescomp-site.gescompnegocios.workers.dev#gescompnegocios.com.br#g"`.
   - Cadastre o domínio no Google Search Console e envie `https://gescompnegocios.com.br/sitemap.xml`.
2. **Logo em alta qualidade**
   - Gere de novo: `assets/img/logo-gescomp.webp` e `.png`, `assets/img/selo-gescomp.webp`, `assets/img/og-image.jpg`, `favicon.ico`, `apple-touch-icon.png` e os ícones de `assets/icones/`.
   - Use nomes novos (ex.: `logo-gescomp-v2.webp`) e atualize as referências: assim ninguém vê a logo antiga guardada no navegador.
   - Se vier com fundo transparente, tire o `mix-blend-mode: multiply` da logo no cabeçalho e no rodapé.
3. **Cores oficiais:** só se forem diferentes. Troque os 8 códigos de `01-empresa/identidade-visual/cores.md` em todos os arquivos (busca e substituição) e confira o contraste dos botões.
4. **WhatsApp:** preencha `whatsapp` em `assets/js/config.js` (ex.: `5579999999999`). Todos os botões de WhatsApp e o formulário passam a usar o número. Escreva o número também no Contato, no rodapé e nos dados do Google.
5. **E-mail:** preencha `email` em `assets/js/config.js`, troque `[E-MAIL]` no Contato e no rodapé. Para ter um e-mail com o domínio (ex.: contato@gescompnegocios.com.br), o Cloudflare Email Routing encaminha as mensagens para um Gmail, sem custo (só recebe; para enviar com o domínio, é preciso um serviço como Google Workspace ou Zoho).
6. **Endereço com número:** Contato, rodapé, link "Como chegar" (inclua o número na busca do Maps), dados do Google e `llms.txt`. Se ela não quiser divulgar, deixe só bairro e cidade.
7. **Horário:** Contato, rodapé e dados do Google.
8. **Instagram e redes:** troque `@[USUARIO]` e o link `instagram.com/[USUARIO]` no Contato, no rodapé e no `llms.txt`; adicione `sameAs` nos dados do Google.
9. **CNPJ e CRC:** rodapé, linha de confiança da abertura e legenda da foto da Gabriela.
10. **Nome completo e ano de fundação:** legenda da foto ("Gabriela do Nascimento Vieira") e "Desde [ANO]".
11. **Texto sobre a GESCOMP:** substitua os dois parágrafos entre colchetes da seção Sobre. Reescreva em frases curtas e peça aprovação.
12. **Números reais:** troque o texto e o `data-contador` de cada número. Publique só números verdadeiros.
13. **Slogan:** mantenha o título atual (bom para o Google) e use o slogan como frase menor, se ela tiver.
14. **Preços:** se ela divulgar, coloque "A partir de R$" nos cartões de serviço, com aviso de que o valor final depende da análise.
15. **Avaliações:** a seção "O que dizem nossos clientes" já existe e fica escondida. Preencha o objeto `avaliacoes` em `assets/js/config.js` (links, nota, total e itens); ela aparece sozinha. Só publique avaliações reais, com autorização, e não marque como avaliação nos dados do Google.
16. **Perguntas frequentes:** crie a seção na página inicial, no formato das páginas de Informações, e adicione os dados de FAQ do Google.
17. **Fotos:** corte na proporção do espaço, reduza para até 1600 px, salve em WebP (de preferência abaixo de 300 KB) em `assets/img/` e escreva o texto alternativo. Guarde os originais em `01-empresa/fotos/`.
18. **Sites de referência:** só no fim, para pequenos ajustes.

## Depois de publicar
- Teste no celular e no computador: WhatsApp, formulário, menu, modo escuro.
- Peça à Gabriela para criar ou atualizar o Perfil da Empresa no Google, com o mesmo nome, endereço e telefone do site.
- Opcional: ative o Cloudflare Web Analytics no projeto (estatísticas de visitas, sem cookies).

## Manutenção
- **Todo janeiro:** revise as páginas de Informações (salário mínimo, INSS, DAS do MEI, Imposto de Renda, limites) e atualize a data "Atualizado em", o `dateModified` dos dados do Google e o `lastmod` do `sitemap.xml`.
- **Depois de 30/10/2026:** atualize ou remova os avisos de prazo de 15/10 e 30/10 (Simples Nacional, CBS e IBS) em `simples-nacional.html`, `informacoes.html` e `calendario-fiscal.html`.

## Como trocar os vídeos do Instagram
Edite `publicar/assets/js/config.js` (lista `instagramReels`), salve e publique de novo.
