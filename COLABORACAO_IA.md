# Colaboração entre IAs (Codex e Claude Code)

Registro resumido. O detalhamento de cada etapa, os pedidos e as pendências ficam em `docs/handoff.md`.

| Data | Agente | Etapa | Situação |
|---|---|---|---|
| 04/10/2026 | Codex | 1 (A, F, G, H): domínio, SEO, JS, config, docs | concluída |
| 04/10/2026 | Claude Code | 2 (B, C, D, E): body dos `.html` e `site.css`, mais avaliações do Google a pedido do usuário | **concluída**, sem commit; detalhes, testes e pedidos em `docs/handoff.md` |
| 04/10/2026 | Codex | 3 (I): revisão, testes e fechamento local | concluída no commit local `c390783`, incluindo ajuste acessível autorizado; sem push/deploy |
| 04/10/2026 | Codex | Revisão adicional: imagens, gráfico anterior, WhatsApp, avaliações e hover | concluída e validada; entrega versionada localmente na main, sem push/deploy |

Revisão: 72 casos de páginas/telas/temas, 23 testes funcionais e 20 testes de interação aprovados. Lighthouse: 100/100 de acessibilidade no celular e computador. Instagram real com cinco embeds prontos; VLibras real carregado, sem erros nos cenários verificados. O usuário confirmou as duas áreas de ajuste no rio: placa e onda lisa; o restante é idêntico ao HTML base, com regras da cena e animações preservadas.

Atualização posterior do usuário: autorizou imagens geradas sem pessoas, textos ou logos falsos e a seleção de avaliações reais do Google. Codex integrou 13 imagens (3 cards, 8 capas, 404 e compartilhamento), recuperou o gráfico largo anterior, restaurou o WhatsApp flutuante desde a abertura e corrigiu contraste no hover. Três avaliações reais renderizadas com primeiro nome e inicial. Fontes e prompts em `docs/evidencias/2026-10-04/`.

Revisão adicional: 80 cenários em dez páginas, quatro telas e dois temas; 47 testes de imagens/hover/avaliações/retrato, 23 funcionais e 20 de interação aprovados. Instagram real com cinco embeds prontos; VLibras real carregado e sem sobrepor controles no celular. Lighthouse acessibilidade 100/100 no celular e computador. Rio com HTML e CSS da cena idênticos a `c390783`; oito pares de capturas controladas sem nenhum pixel diferente. Evidências e limites em `docs/handoff.md`.

Pendências atuais: retratos reais da Gabriela, foto real do escritório, aprovação das respostas de contratação e publicação externa autorizada da nova versão. Avaliações e imagens ilustrativas dos serviços já entregues. Sem push/deploy nesta rodada.
