# Preparação para o Google Search — 06/10/2026

O site usa HTML estático, URLs próprias, conteúdo acessível sem JavaScript, títulos e descrições individuais, canonical HTTPS, sitemap e dados estruturados coerentes com os textos. Essas condições ajudam a descoberta; não garantem indexação, posição, estrelas nos resultados ou recomendação por IA.

## Cadastro após publicar esta atualização

1. No [Search Console](https://search.google.com/search-console), adicione uma propriedade de **Domínio**: `gescompnegocios.com.br`.
2. Copie o TXT de verificação que o Google fornecer e adicione-o no DNS da Cloudflare. O valor é específico da conta; o projeto não contém um token inventado.
3. Confirme a propriedade e envie `https://gescompnegocios.com.br/sitemap.xml` na área Sitemaps. Esta versão contém 11 URLs indexáveis; a 404 fica excluída.
4. Use Inspeção de URL e o teste da URL publicada na inicial, no painel de Informações e nas duas novas páginas: `/fim-escala-6x1` e `/novo-limite-mei`. Confira renderização, canonical selecionada, acesso do Googlebot e solicite indexação.
5. Acompanhe Indexação de páginas, Experiência/Core Web Vitals, Melhorias quando disponíveis e Desempenho. Medições de usuários reais exigem dados após a publicação; testes locais não comprovam Core Web Vitals em produção.

## Pesquisa local e IA

- Confirme o Perfil da Empresa no Google e mantenha nome, endereço de Barra dos Coqueiros, telefone, horários e domínio iguais aos do site. Não cadastre endereço fictício em Aracaju ou em outros estados.
- Mantenha os artigos com fontes oficiais, autoria identificada e data de atualização real. Projetos de lei devem continuar separados das regras em vigor.
- O Google usa as mesmas bases de SEO para AI Overviews e AI Mode. A página precisa ser indexável e elegível para snippet. No Search Console, confira também a inclusão nas funcionalidades de IA quando esse controle estiver disponível na conta.
- `Google-Extended` não substitui o acesso do Googlebot à Busca. `llms.txt` foi sincronizado como resumo auxiliar: o Google não exige esse arquivo nem um schema especial para IA.
- Não foram adicionadas avaliações ou notas ao JSON-LD da própria empresa, nem palavras-chave ocultas ou instruções para uma IA recomendar a GESCOMP.

## Pendências de hospedagem identificadas na análise anterior

A auditoria pública de 06/10/2026 encontrou HTTP servindo páginas com 200 sem redirecionar para HTTPS, o endereço alternativo de hospedagem ainda acessível e falha de resolução de `www`. Canonical HTTPS ajuda a consolidação, mas não substitui o redirecionamento.

Para consolidar as versões do domínio, ainda é necessário revisar a Cloudflare: redirecionamento permanente de HTTP para HTTPS, destino de `www`, endereço alternativo e regras que possam bloquear o Googlebot. Nenhuma configuração de conta, DNS ou segurança foi alterada nesta entrega; a execução das melhorias de segurança continua dependendo da instrução do usuário após a auditoria.

O teste da URL publicada no Search Console é a conferência definitiva do acesso pelo Google. Não houve cadastro na conta Google, verificação de domínio, solicitação de indexação, deploy, commit ou push nesta rodada.

## Fontes

- [Google: requisitos e boas práticas para funcionalidades de IA](https://developers.google.com/search/docs/appearance/ai-features).
- [Google: otimização para funcionalidades generativas](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
- [Google: dados estruturados de empresas locais](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- [Google: criação e envio de sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Os testes e suas limitações estão registrados no handoff e nas evidências desta entrega.
