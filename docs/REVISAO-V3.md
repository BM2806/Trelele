# Trelelê V3 — revisão de código ECC

Data: 16/10/2026. Roteiro aplicado: ECC `agents/code-reviewer.md`, lido com o helper oficial do pacote ECC. Escopo: mudanças V3 de interface, copy, rotas e integração com domínio. Sem implementação de backend, pentest, teste de navegador ou avaliação visual nesta revisão.

## Material inspecionado

Lidos `git diff` de `dist/app.mjs` e `dist/index.html`, contexto completo das funções alteradas, `dist/copy.mjs`, chamadas do domínio, classificador de gesto, harness e testes DOM. Confirmado que `dist/domain.mjs` e `dist/interaction.mjs` não têm diff em relação ao estado versionado anterior. Lidos também os caminhos locais de ícones e fontes e a estrutura do sprite SVG; não há dependência de CDN executada pela interface revisada.

## Achado concreto

**MEDIUM — aceite unilateral não podia ser retirado pela interface.**

Arquivo: `dist/app.mjs`, função `chat()` (linha 46 na versão examinada inicialmente), em conjunto com `strings.revealAcceptedBody` de `dist/copy.mjs`.

Reprodução em DOM emulado: abrir Lia → informações da demonstração → simular prazo/conversa → dar somente o próprio aceite. O botão de consentimento fica desabilitado e a interface não apresenta `[data-action="revoke"]`. A copy informa “Até lá, você pode mudar de ideia”, mas só a revelação bilateral disponibilizava revogação. Resultado reproduzido: `disabled: true`, `withdraw: false`, `portraits: 0`.

Não houve revelação antecipada; o domínio permite revogar. A falha é ausência do controle de retirada no estado pendente. Correção solicitada ao arquiteto: oferecer a ação existente `revoke` também após o aceite unilateral. QA informado para testar retirada antes do segundo aceite e ausência de retratos após a simulação do aceite do outro perfil.

**Status final: corrigido e revalidado.** `chat()` agora apresenta “Mudei de ideia” com `data-action="revoke"` quando `rv.ownConsent` está verdadeiro, antes do segundo aceite. A suíte contém teste específico de retirada unilateral aprovado. Também repeti avulsamente a sequência: aceite próprio → retirar → simular aceite do outro; nenhum retrato apareceu. Não há achado MEDIUM aberto desta revisão.

## Verificações positivas e limites

- Mensagens, rascunhos em atributo e campos editáveis de nome/bio usam `esc` nos pontos de renderização examinados. Dados de outras pessoas vêm de fixture local `copy.mjs`, sem cadastro remoto. Nenhuma injeção nova foi identificada nas entradas alcançáveis; não representa certificação para aceitar conteúdo externo sem revisar esses pontos.
- `route()` só admite pessoa existente na fixture; `render()` normaliza conversa sem match ativo antes de renderizar cabeçalho e conteúdo. `like()` continua rejeitando match encerrado/bloqueado; navegar para uma hash antiga não muda o estado do domínio.
- Retratos continuam sendo SVG fictício construído somente sob resultado positivo de `canViewPhoto()`; fotos reais não foram adicionadas. Tempo, reciprocidade, versões, bloqueio e unmatch continuam no domínio de demonstração.
- Diálogos de segurança e denúncia continuam descrevendo efeitos de teste. Navegação fecha o diálogo aberto; rotas e botão voltar não concedem consentimento nem criam conexão.
- A versão final acrescentou retorno do detalhe do livro ao perfil pai: `closeDialog()` limpa a referência de retorno em comandos de navegação/decisão; `closeLayer()` só restaura o pai quando o fechamento é da camada. Testes de retorno à mesma pessoa e de não restaurar o pai após curtir foram aprovados.
- O handler de gesto conserva cancelamento por perda de captura, dominância horizontal, supressão de click e guarda contra cartão desconectado/trocado. Não houve mudança do classificador de gesto nesta revisão.
- O novo módulo de copy é local; dados editáveis de `me` são clonados. O sprite de ícones inspecionado contém símbolos e paths, sem scripts/eventos/objetos externos identificados.
- A demonstração permanece sem endpoint de chat, conta ou mídia privada. O rótulo fictício consta no HTML; conferir legibilidade e gestos nativos pertence à QA visual/dispositivo.

## Execução e resultado

Primeira execução local: 49/50 testes aprovados; única falha era expectativa antiga de contador `2 / 3` diante da nova copy `2 de 3`. QA corrigiu a expectativa. Após as correções finais, executei novamente `npm test`: **54/54 aprovados, nenhuma falha**, incluindo retirada de consentimento unilateral, hash antiga após unmatch, retorno de diálogos e posição de leitura. Contagem final: 17 domínio, 7 classificador de gesto, 2 copy, 2 integridade e 26 DOM emulado. Verificação avulsa adicional de retirada antes do segundo aceite também passou.

Os testes DOM usam happy-dom, sem navegador, layout, rede ou gesto nativo. Não validam distribuição real dos cabeçalhos HTTP, autenticação, armazenamento privado ou operação de moderação. Essas capacidades não foram implementadas nesta demonstração.

## Review Summary

| Severity | Count | Status |
|---|---|---|
| CRITICAL | 0 | pass |
| HIGH | 0 | pass |
| MEDIUM | 0 abertos; 1 resolvido | corrigido e revalidado |
| LOW | 0 | pass |

Verdict: **APPROVE** — nenhum achado aberto identificado no escopo revisado da demonstração. A aprovação não se aplica a produção com dados reais; os bloqueadores de `SEGURANCA.md` permanecem.
