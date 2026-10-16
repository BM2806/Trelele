# Trelelê V7 — conversas, conexões e perfil

Verificação independente da fonte em 16/10/2026. Escopo autorizado: telas do produto em `mobile-beta/src/Prototype.tsx` e `src/prototype.css`. Descobrir e o runtime standalone/simulador permanecem na base aprovada. Checklist ECC `agents/code-reviewer.md` aplicado à revisão: falhas concretas e evidência de código, sem tratar preferências visuais como defeitos de segurança.

## Verificações executadas

| Comando | Resultado | Alcance |
| --- | --- | --- |
| `mobile-beta: npm run build` | Passou | TypeScript, Vite e empacotamento Worker |
| `mobile-beta: npm run check:runtime` | Passou, 28 arquivos | Runtime protegido preservado |
| `mobile-beta: npm run test:sites` | 4/4 | Arquivos estáticos, fallback e empacotamento |
| Raiz: `node --test tests/domain.test.mjs tests/interaction.test.mjs` | 24/24 | Consentimento, bloqueio, idempotência e classificador de gesto |
| Hash do domínio móvel e raiz | Idêntico | `6dafab697f70503e3eecef2401a13db236fd2e16154c47e2d7f518d4ed698be2` |
| Hash do classificador móvel e raiz | Idêntico | `314048ff016261d04be1dbb19abc6154892fdae7e75733be93010925537c7ed9` |

Não foram criados testes que duplicam a implementação do JSX. Os 24 testes de regras não validam aparência ou navegação no navegador.

## Revisão funcional da fonte

| Contrato | Evidência revisada | Resultado da revisão |
| --- | --- | --- |
| Sem lista de curtidas enviadas | Aba “Deu liga” renderiza somente conexões ACTIVE | Implementado |
| Rail de novas conexões | Predicado `messages.length === 0` | Disjunto da lista de conversas |
| Lista de mensagens | Predicado `messages.length > 0`, ordenada pela última mensagem | Conexão não aparece nos dois grupos simultaneamente |
| Primeiro envio | Sucesso em `sendMessage` atualiza domínio; grupos são derivados novamente | Move para lista uma vez, sem segunda coleção a sincronizar |
| Retorno de perfil aberto pelo chat | `openPerson` preserva chatId; `back` limpa personId antes de encerrar chat | Conversa e rascunho mantidos em estado |
| Retorno da conversa | `chatOrigin` guardado por `openChat` | Volta a Deu liga ou Conversas conforme origem |
| Conexão encerrada | `unmatch` limpa chat, perfil e sheet e retorna à origem | Corrigido nesta revisão |
| Privacidade | `getRevealView` continua controlando ilustração; regras de consentimento inalteradas | Sem foto pessoal antecipada |
| Envio com erro | Draft só é limpo se a mutação confirmar sucesso | Preservado |
| Identidade no chat | Avatar usa capa de livro, com abertura do perfil e opções | Sem retrato apresentado como foto protegida |
| Horário e avisos | Datas derivam dos registros do domínio; não há badge de unread artificial | Sem timestamp fixo ou recebimento fictício acrescentado |
| Texto do usuário | Interpolação React, sem inserção de HTML bruto | Mensagens/bio/opiniões tratadas como texto |

**P2 identificado e corrigido:** chat → perfil → opções → desfazer conexão encerrava o domínio, mas deixava personId ativo e o perfil oferecia uma curtida que seria recusada como MATCH_INACTIVE. O autor passou a limpar personId e retornar a chatOrigin. Nenhum P1 aberto foi identificado na revisão estática final.

## Evidência de navegador

O responsável principal executou os seguintes fluxos em navegador com viewports efetivos de 390 e 360 px, e informou os resultados à auditoria:

- Curtida recíproca de Ana → continuar → inbox: rail com uma conexão nova e lista somente com Lia.
- Primeiro envio para Ana → voltar à inbox: rail com zero, exatamente uma linha de Ana e uma de Lia, sem duplicata.
- Em 390 px, envio para Lia atualizou a última mensagem da lista; abrir perfil e voltar preservou a conversa.
- Em 360 px, abrir conversa a partir de Deu liga e voltar retornou a Deu liga.
- Ausência do título/lista de histórico de curtidas enviadas na UI.

Capturas fornecidas: `trelele-v7-inbox.jpg` e `trelele-v7-conversa.jpg`. O crítico independente aprovou visualmente inbox e conversa nas configurações de 390 e 360 px. O responsável também verificou o chip de foto de Ana em 360 px: abre as regras, o botão “Quero mostrar minha foto” permanece desabilitado no estado bloqueado e nenhuma imagem de rosto é carregada.

Esta auditoria não operou o navegador; registrou as evidências do responsável e o parecer do crítico. Bloqueio e desfazer conexão foram revisados em código/domínio; não constam como executados no navegador V7. O coração da aba Deu liga foi mantido como ícone reconhecível de conexão, pequeno ajuste de plano aceito pelo responsável e sem consequência funcional.

**Fonte V7 verificada, sem P1 conhecido aberto. Publicação e verificação da URL final ficam com o responsável principal.**

Os testes de navegador não equivalem a hardware físico ou IME/Safari real. O envio de mensagem exercitou o campo e a mutação local, sem prova de abertura de teclado físico.

O modo publicado continua sendo um protótipo React em navegador, sem backend, conta, GPS, catálogo ao vivo, upload ou mensagens reais. Estado e relógio são locais e se perdem ao recarregar. Hardware físico/Safari/IME nativo não foi testado pela auditoria. As cinco falhas conhecidas da suíte histórica V5 não foram mascaradas e não exercitam esta interface React.
