# Pendências no site

Atualizado em 03/10/2026. Domínio final confirmado: **gescompnegocios.com.br**, comprado no Registro.br. Nome confirmado e aplicado: **Gabriela do Nascimento Vieira**. Falta conectar o domínio à hospedagem e selecionar/aplicar as imagens que já estão com o usuário.

Textos entre colchetes que ainda precisam ser trocados por informações reais (busque o texto exato nos arquivos).

| Marcador | Arquivo(s) em `publicar/` |
|---|---|
| `[Foto da Gabriela]` | index.html |
| `[Foto de atendimento a cliente]` | index.html |
| `[Foto real da equipe ou do escritório]` | index.html |
| `[LINK-DA-PLATAFORMA]` | index.html |

## Outras pendências
- **Fotos:** disponíveis com o usuário. Selecionar as imagens para os três espaços de `index.html` (abertura, Sobre e Serviços), otimizar e aplicar. Confirmar as autorizações de uso das pessoas retratadas.
- **Domínio:** **gescompnegocios.com.br**, comprado no Registro.br. Na consulta de 03/10/2026, ainda usa `a.auto.dns.br` e `b.auto.dns.br` e não tem endereço IPv4 publicado. Enquanto a conexão ao Worker não estiver concluída, canonical, compartilhamento, dados estruturados, `sitemap.xml`, `robots.txt` e `llms.txt` usam `https://gescomp-site.gescompnegocios.workers.dev`, seguindo a correção do Claude. Veja o passo 1 de `roteiro-de-atualizacao.md`. Depois de confirmar o domínio funcionando com HTTPS, atualizar esses endereços para `https://gescompnegocios.com.br` e publicar. Comando para a troca, dentro de `publicar/`: `grep -rl "gescomp-site.gescompnegocios.workers.dev" . | xargs sed -i "s#gescomp-site.gescompnegocios.workers.dev#gescompnegocios.com.br#g"`.
- **CEP** do endereço de Barra dos Coqueiros: adicionar no Contato, no rodapé e em `postalCode` nos dados do Google.
- **Nome da contadora:** **Gabriela do Nascimento Vieira**, confirmado e aplicado na legenda, texto Sobre, dados estruturados, `llms.txt` e cópia de revisão. Grafia correta: Gabriela, com um `l`.
- **Folha de pagamento:** confirmar se ela faz folha completa; hoje o site fala só em cálculos trabalhistas.
- **Perguntas frequentes da página inicial:** as respostas foram escritas para o site; pedir a revisão dela.
- **Avaliações de clientes:** a seção está pronta e escondida. Falta receber da Gabriela: o link de avaliação do Google (`g.page/r/CODIGO/review`), o link para ver todas as avaliações, as avaliações escolhidas (com autorização), a nota e o total. Tudo vai em `publicar/assets/js/config.js`, objeto `avaliacoes` (veja `LEIA-ME.md`).
- **Cursos e comunidade:** seção pronta e escondida; ativar quando houver a plataforma (`[LINK-DA-PLATAFORMA]`).

## Revisão de 03/10/2026
- Corrigida a FAQ sobre CBS/IBS no Simples em 2026, inclusive nos dados estruturados.
- Esclarecida a retenção de 10% sobre o total dos dividendos quando ultrapassado o limite mensal; atualizada a orientação sobre empresas do Simples.
- Sincronizadas as três páginas corrigidas com suas cópias de revisão e as datas de atualização do sitemap.
- Extraídos os estilos comuns do cabeçalho e rodapé para `assets/css/estrutura.css`. O HTML da estrutura continua estático em cada página; estilos específicos e ilustrações ainda podem estar inline.
- Atualizada a mensagem para a Gabriela com as confirmações restantes.

Fontes e escopo: `revisao-03-10-2026.md`.
