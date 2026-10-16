> VIGENTE: Trelelê V4. Consultar FLUXOS-V4.md e QA-V4.md; versões anteriores abaixo são histórico.

> VERSÃO ATUAL: Trelelê V3. Ver QA-V3.md (57 testes), NAVEGACAO-V3.md e REVISAO-V3.md. O conteúdo abaixo registra entregas anteriores e não valida visualmente a V3.

# Margem — validação técnica executada

> Registro histórico da V1. Para a implementação atual V2 e os resultados executados mais recentes, consultar `QA-V2.md`: 43 testes (17 domínio, 7 classificador e 19 DOM emulado). Nenhum desses resultados constitui QA visual ou teste em navegador.

Data: 16/10/2026. Revisão independente de QA com referências ECC `tdd-guide` e `pr-test-analyzer`. Escopo: código de `dist/index.html`, `dist/style.css`, `dist/app.mjs`, `dist/domain.mjs`, testes e manifesto de ativos. Nenhum servidor, preview ou navegador foi iniciado nesta revisão. Não houve QA visual, teste com leitor de tela, E2E, backend ou auditoria de produção.

## Evidência inicial

| Verificação | Resultado real |
|---|---|
| `npm test` | 15 testes passaram; zero falhas, cancelados ou ignorados |
| `npm run check` | Sintaxe de `app.mjs` e `domain.mjs` válida; saída 0 |
| Fluxos do domínio | Cobrem reciprocidade, unicidade sequencial, idempotência de mensagem, relógio de mensagem, turnos, consentimento unilateral, versões de fotos, revogação, bloqueio, unmatch e acesso de terceiros |
| Revisão de entrada exibida | Mensagens e campos editáveis são escapados antes de inserir HTML; não identifiquei interpolação direta de campo editável sem escape nos caminhos revisados |
| Transparência da demo | Ausência de conta, envio real, pagamento e proteção de fotos indicada na interface e no código |
| Ativos | Manifesto e arquivos locais presentes; esta revisão não revalidou licença ou download externo |

O npm emitiu aviso de configuração de ambiente `http-proxy`; não impediu a execução. Testes sequenciais locais não demonstram segurança de banco ou concorrência real.

## Achados enviados à coordenação para correção

### QA-01 — navegação pula a pessoa seguinte

Prioridade: corrigir antes da entrega da demo. Em `case 'pass'`, o perfil sai de `filtered()` por inclusão em `passed`, mas `currentIndex` também avança. Reproduzido por execução Node da mesma transformação: lista Ana/Davi/Bia → passar Ana → resultado Bia, embora Davi seja o próximo. Preferir fila de candidatos com primeiro item ou remover incremento ao retirar item.

### QA-02 — afinidade literária não acompanha edição

Prioridade: corrigir antes da entrega da demo. `p.affinity` contém frases estáticas usadas em descoberta, conexões e modal de match. Remover A hora da estrela/Torto arado do perfil não altera a alegação de que ambos escolheram essas obras. Derivar interseção atual de `me.books` e `p.books`; usar fallback que não deduza características pessoais sem evidência.

### QA-03 — link de pular para conteúdo interceptado como rota

Prioridade: corrigir antes da entrega da demo. `href="#main"` encontra listener de `hashchange` que chama `go('main')`, normaliza para descoberta e renderiza outra vez o destino. A ação pode tirar o usuário da tela em vez de só mover o foco. Ignorar âncoras não pertencentes ao conjunto de rotas, mantendo o comportamento nativo da âncora.

### QA-04 — relógio pode consultar estado anterior ao consentimento como revelado

Prioridade: contrato de domínio antes da promoção a serviço real. Reprodução Node: política sem espera/um turno; mensagens em t=1 e t=2; os dois aceites em t=100; leitura em t=2 retorna `REVEALED`. `active()` só valida `createdAt`; `consentPhoto()` não garante relógio posterior à última mutação. Definir estado como somente atual e recusar relógio regressivo, ou filtrar registros pela hora consultada. A demo usa relógio interno crescente, portanto o fluxo UI usual não produz a regressão.

### QA-05 — turnos alternados repetidos satisfazem elegibilidade

Limitação de produto, sem alegação de segurança resolvida. Reprodução Node: dez mensagens alternadas com texto idêntico `Oi` → `ELIGIBLE` para cinco turnos de cada lado. O teste atual só impede spam consecutivo e reenvio pelo mesmo ID. Não alegar detecção de conversa significativa. Decidir política simples para repetição normalizada e preservar a possibilidade de diálogo curto legítimo; IA de leitura de conversa não é necessária para a demo.

## Pontos favoráveis observados

- Estado explicitamente marcado como demonstração mutável e não seguro no navegador.
- `pairKey` normaliza ordem e evita colisão por delimitadores.
- IDs de reenvio conflitando com outro texto são rejeitados; mensagens vazias e acima de 2.000 caracteres são rejeitadas no domínio.
- Um consentimento não é exibido ao outro participante; alteração de retrato invalida ambos os aceites.
- Bloqueio impede novas curtidas e mensagens; revogação impede leitura futura sem encerrar o chat.
- Unmatch não reativa por curtida repetida; denúncia simulada continua acessível pelo histórico de conexões encerradas.
- CSS inclui foco visível, regras responsivas, preferência por movimento reduzido e dimensões mínimas em vários controles. Isto é inspeção estática, não comprovação de acessibilidade.

## Lacunas que permanecem

1. Não há testes de interação DOM. Sintaxe válida não comprova foco de modal, teclado, envio de formulário, navegação por histórico ou ausência de overflow.
2. `history.replaceState` substitui rotas em vez de criar histórico de navegação. Definir o comportamento desejado do botão voltar.
3. Formulário de perfil pode perder edições ainda não salvas quando outro controle chama `render()`. Confirmar escolha de UX e testar com pessoas.
4. Denúncia é array em memória, sem protocolo real, deduplicação, entrega ou SLA. Isso está informado na interface.
5. Não há proteção de fotos reais, autenticação, idade, pagamentos, transação de match, moderação, backup ou testes concorrentes.
6. Nenhum teste manual de navegador, screenshot ou avaliação por usuários foi realizado nesta revisão. Nenhuma alegação de layout aprovado visualmente é autorizada por este documento.

## Parecer

A base tem cobertura comportamental útil para demonstração. A aprovação técnica da versão inicial fica condicionada à correção QA-01 a QA-03 e à repetição dos testes após a alteração. QA-04 requer correção/contrato explícito no domínio; QA-05 é uma limitação que precisa permanecer declarada. O produto não está pronto para operação com usuários reais. Consultar `PLANO-QA.md` para os gates de beta e lançamento público.

## Revalidação

Após a primeira revisão, a coordenação alterou a descoberta para `list[0]` e substituiu a afinidade exibida por `affinityFor(p)`, calculada pela seleção atual. Essas duas correções foram confirmadas por leitura do código. `npm test` foi repetido: 15/15 passaram; `npm run check` passou novamente. QA-01 e QA-02 estão resolvidos na inspeção estática, sem teste DOM. QA-03 e QA-04 permaneciam pendentes nesta última leitura. QA-05 permanece como limite técnico de contagem de turnos, sem promessa de avaliação semântica ou IA.


## Revalidação final da integração

Após o parecer inicial, a coordenação corrigiu o listener de hash para preservar #main, substituiu toda afinidade exibida por interseção calculada e passou a usar a primeira pessoa da fila filtrada. A arquitetura corrigiu relógios regressivos contra a última mensagem e aceites atuais, e adicionou dois testes. Resultado final: 17/17 testes de domínio passaram e npm run check passou. Os achados anteriores permanecem como histórico; esses quatro foram resolvidos no código entregue.

Verificações adicionais de arquivos: seis SVGs de capas, duas fotografias e fonte local presentes, com origem/licença e SHA-256; referências locais copiadas para o site; estudos incluídos no pacote. Sem navegação de browser ou inspeção visual renderizada do HTML neste ambiente; CSS responsivo e semântica revisados por código, não alegação de WCAG AA auditada. Headers de segurança foram declarados em _headers; a aplicação desses headers pelo hosting ainda requer validação HTTP em ambiente acessível.
