# V10 — revisão ECC de código e privacidade

## Veredito

**QA BLOQUEADO PARA RELEASE. Fonte V10 congelada e verificada por testes e revisão estática; validação visual, fluidez e ponta a ponta não foram comprovadas.** Nenhum P1 estático conhecido permanece aberto após as correções abaixo. Isso não aprova lançamento.

O responsável executou o build final e confirmou 45 testes móveis/Worker, 24 de domínio/classificador, integridade dos 28 arquivos e audit zero. Na tentativa de testes de runtime, o ambiente padrão falhou em `Vite uv_interface`; configuração temporária de loopback permitiu iniciar, mas faltava o executável Chromium Headless Shell. A configuração temporária foi removida. Nenhuma nova tentativa de CUA foi feita, pois a ferramenta já havia falhado por timeouts de 300 segundos.

Esses são bloqueios de ambiente, não prova de que a interface funciona. Não declarar navegação fluida, gestos físicos, Safari ou cadastro com fotos validados. O checkpoint pode ser armazenado como fonte revisável, sem confundir isso com autorização técnica de release.

Aplicados os recursos ECC `agents/code-reviewer.md`, `agents/security-reviewer.md` e `agents/tdd-guide.md`. São checklists aplicados por agentes Codex. A revisão usa falhas concretas e testes proporcionais; não há alegação de “brecha zero”, cobertura universal ou execução de agentes Claude.

## Evidências executadas

| Verificação | Resultado | Alcance |
| --- | --- | --- |
| Build TypeScript/Vite/Worker | Passou | Fonte compilável e distribuição preparada |
| `check:runtime` | Passou: 28 arquivos protegidos | Nenhum runtime alterado por esta auditoria |
| Testes Worker | 4/4 | Empacotamento, ativos e fallback |
| Cadastro/entrada de arquivos | 11/11 | Idade, calendário, campos, 3+3, limites, migração de metadados e whitelist |
| Transações IndexedDB | 12/12 | APIs reais com fake-indexeddb e blobs sintéticos |
| Sessão local | 11/11 | Schema, histórico, rascunhos, consentimentos, erro e escopo do dono |
| SwipeDeck puro | 7/7 | Distância/fling/cancelamento e commit único |
| Domínio/classificador histórico | 24/24 | Regras de privacidade e gesto anteriores preservadas |
| `npm audit --json` | Zero alertas conhecidos na execução | Inclui desenvolvimento e a nova dependência de teste |

As quatro suítes móveis somam **41/41**. Com domínio/classificador (24) e Worker (4), foram executados **69 testes**. As contagens não incluem uma execução de interface React ou de navegador. O Vite emitiu aviso de chunk superior a 500 kB; a compilação passou, sem esconder o aviso ou alterar seu limite.

## Achados acompanhados e correções

| Achado | Falha concreta | Correção revisada |
| --- | --- | --- |
| P1: interrupção de animação pendente | Novo gesto bloqueado durante saída parava a animação aguardada e podia manter busy pendente | Regrab para animações somente quando o gesto não está bloqueado |
| P2: clique após arrasto de controle | Gesto iniciado em botão retornava antes de marcar supressão | Tracking de distância e supressão ocorrem antes do retorno; controles não viram preferência |
| P2: contexto errado de consentimento | Galeria de Ana podia deixar o par anterior ativo ao entrar no chat de Lia | Contexto limpo ao entrar no chat e no atalho; sheet identifica nominalmente a pessoa |
| P2: troca da foto não invalida aceite | Foto local mudava sem atualizar a versão no domínio da demonstração | IDs das fotos comparados antes do commit; callback só invalida aceites quando o conjunto muda, sem reset por edição apenas de bio |
| P2: sessão aceita conexão alheia | Match Ana↔Davi, válido no domínio genérico, podia entrar na lista do dono | Persistência exige `you` em matches e pares; duas regressões específicas passaram |
| P2: cancelamento edita perfil confirmado | Edição e fotos de rascunho antes compartilhavam os dados confirmados | Metadata e fotos de rascunho separadas; cancelar descarta estágio e preserva confirmados |
| P2: pausa não sobrevive a reload | Estado era somente React | Booleano persistido em chave local própria; UI anuncia o escopo neste aparelho |

**P2 corrigido na fonte final:** o handler de `lostpointercapture` agora exige `dragging && !blocked && !pending.current` antes de cancelar. A exceção limitada foi autorizada pelo root após o primeiro congelamento. Fonte conferida; efeito nos eventos de navegador ainda não executado. Não foi usado teste que apenas procura strings no JSX como prova de comportamento.

## Contrato de perfil local versus conta real

O produto continua sendo um **beta local sem autenticação**. Perfil personalizado, fotos no IndexedDB e histórico salvo no navegador não são conta online, identidade verificada, criptografia, backup ou mensagens recebidas de pessoas reais. Settings e onboarding anunciam esses limites.

A revisão de coerência encontrou ainda um P2 não bloqueante: conversas fixas da demonstração podem usar o personagem Bruno mesmo quando Meu Perfil tem outro nome. O rótulo de demonstração evita uma alegação de mensagem real, mas a separação entre personagem e perfil local merece refinamento. Não apresentar esse conteúdo como uma conversa autêntica com o proprietário.

O cadastro exige 18 anos completos com data de calendário válida, três livros distintos do catálogo e três fotos distintas antes de concluir. Cidade é opcional por decisão explícita anterior. Data de nascimento é usada no editor e para calcular idade; não vai para o perfil mostrado. Os extras literários são opcionais. Metadados antigos recebem defaults sem perder o perfil; recomendação é limitada a 200 caracteres. Os testes verificaram esses contratos.

## Fotos e rascunhos

Originais são aceitos somente como JPEG, PNG ou WebP, até 5 MB. MIME, assinatura e decodificação são verificados; SHA-256 identifica conteúdo duplicado. Isso não é reconhecimento de rosto nem prova de autoria.

IndexedDB v2 mantém `photos`, `draft-photos` e `draft-meta`. Fotos do dono só ganham URLs temporárias no editor ou em Meu Perfil visível; URLs são revogadas no cleanup. Perfis fictícios, conexões e conversa usam capas ou placeholders abstratos, sem originais e sem miniaturas privadas atrás de blur CSS. A revelação da demonstração continua uma ilustração condicionada ao domínio.

Os testes transacionais exercitaram cancelamento, seed idempotente, retomada sem restaurar foto removida, commit de três blobs, quota de metadata, abort de IDB após metadata, rascunho incompleto, clear com erro, exclusão, migração v1→v2 e inicialização concorrente. **fake-indexeddb foi autorizado como dependência somente de desenvolvimento**; fixtures usam blobs sintéticos. Esses testes não certificam o armazenamento do Safari nem decodificação de fotos em um navegador real.

Fotos/estágio/marker são trocados na mesma transação IndexedDB. Metadata permanece em localStorage por compatibilidade: falha de write aborta fotos; abort posterior tenta restaurar metadata anterior. Os dois mecanismos não são uma transação atômica contra crash ou mudança de permissões durante rollback. Não anunciar atomicidade universal.

## Exclusão, pausa e histórico

A exclusão confirma o clear de fotos confirmadas e de rascunho antes de remover metadata. Se a remoção de metadata falhar, as fotos já podem ter sido apagadas: a API rejeita e a UI informa erro, sem prometer sucesso completo. O cenário foi testado.

A integração limpa chaves próprias de perfil, rascunho, preferências, sessão demo e entrada; não usa `localStorage.clear`. Também limpa caches, URLs, rascunhos de mensagem, preferências em memória e estado de navegação, retornando à abertura. Reentrar na demonstração cria novamente os personagens e mensagens predefinidos; isso não restaura mensagens escritas pelo dono.

A sessão é local, limitada e validada por schema: somente identidades fictícias conhecidas e relações com o dono, relógios/consentimentos consistentes, conteúdo textual e rascunhos de até 2.000 caracteres. Não aceita fotos, tokens ou campos adicionais. Erro de leitura não é silenciosamente convertido em perda de histórico; a interface oferece recomeçar explicitamente. Sem criptografia ou autenticação implícitas.

## Gesto e limites da revisão

SwipeDeck compartilha o controlador entre botões e gesto. Release exige intenção horizontal; fling aprovado requer pelo menos 48 px, velocidade de 0,65 px/ms e direção consistente. Cancelamento, geometria inválida, gesto curto/vertical e evento atrasado da pessoa anterior não decidem. Gate permite um commit por pessoa; token invalida animação cancelada, mudança da pessoa e desmontagem. Movimento reduzido evita deslocamento obrigatório.

Os sete testes foram escritos antes do módulo: a primeira execução falhou por módulo ausente (RED), e passaram quando o autor implementou o contrato (GREEN). Eles não comprovam captura de ponteiro, toque físico, animação ou rolagem. Essa lacuna permanece explícita.

Antes de publicar, validar no navegador disponível: cadastro completo com fotos reais de teste não pessoais, reabrir/editar/cancelar, exclusão e erros, pausa e reload, gesto rápido/curto/vertical/cancelamento/duplo acionamento, botões e mídia sem conflito, celebração, retorno de perfil/chat e ausência de originais nos perfis fictícios. Testar separadamente Safari/IME/aparelhos físicos. Compilação e leitura das 31 referências não equivalem a essas execuções.

### Fechamento do guard de captura

Após o parecer acima, o root autorizou uma correção limitada no `SwipeDeck`: `lostpointercapture` só reinicia o gesto quando `dragging && !blocked && !pending.current`. Uma perda de captura implícita após soltar o dedo não deve interromper a confirmação já iniciada. O autor executou TypeScript e os sete testes puros de swipe após essa alteração. A correção de fonte foi conferida pelo root; a verificação de toque real continua pendente. Portanto, o P2 citado anteriormente está corrigido no código, sem alegação de reprodução em aparelho.


### Infraestrutura de aceitação local — 16/10/2026

Resultado: **blocked** para execução de UI. A única chamada autorizada a `npx playwright install chromium` terminou com exit 1: o CDN retornou arquivo de 0 MiB e erro de ZIP truncado (`End of central directory record signature not found`). As tentativas internas pertenciam à mesma chamada do instalador; não houve nova chamada, escalonamento ou download alternativo. A inspeção limitada de executáveis Chromium/Chrome/Firefox e do cache de binários Playwright não encontrou navegador instalado. Nenhum perfil ou sessão de usuário foi consultado.

Foi criado `mobile-beta/tests/trelele-flow.spec.ts`, com oito testes de aceitação locais: cadastro de onze passos e persistência em 390×760 e 360×640, maioridade, três livros e três PNGs sintéticos em memória, ausência de fotos privadas no deck, cancelamento de edição preservando fotos confirmadas, pausa/reload, exclusão e erro de exclusão, intenção/cancelamento do swipe e regressão de gesto durante decisão pendente. Usam `setInputFiles` normal do Playwright; não usam imagens pessoais nem conta externa.

A compilação TypeScript isolada do spec passou; `playwright test tests/trelele-flow.spec.ts --list` descobriu os oito testes. **Nenhum deles foi executado no navegador.** Os testes de runtime existentes também não foram executados nesta continuação. Não há novas capturas nem comprovação de fluidez, interação de toque, Safari ou teclado físico. O arquivo temporário usado somente para a checagem TypeScript foi removido; runtime, dependências e deploy não foram alterados nesta etapa.

A aceitação local automatizada e a revisão visual final do Product Design são evidências separadas. A segunda continua exigindo inspeção do preview no cloud browser pelo responsável; os specs compilados não a substituem. O bloqueio de publicação por falta dessa verificação permanece.
