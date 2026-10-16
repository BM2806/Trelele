# Trelelê — arquitetura proposta

Nome escolhido para o protótipo; disponibilidade de marca não certificada. Documento de decisão técnica preparado com o roteiro ECC Architect. Não descreve um sistema de produção implementado. Não é engenharia reversa do Tinder: modelos, contratos e regras abaixo são propostas próprias.

## 1. Fronteira da demonstração

O protótipo é estático, usa pessoas, livros e conversas fictícios e demonstra navegação e regras de experiência. Não possui autenticação, backend, proteção de mídia ou segurança real. Estados mantidos no navegador podem ser alterados por qualquer visitante. Não inserir dados pessoais, fotografias privadas, credenciais, documentos ou conversas reais. O aviso de demonstração deve permanecer visível e a interface não deve afirmar que uma identidade foi verificada.

A demonstração pode simular espera e consentimento; em produção apenas o servidor concede acesso. Uma foto oculta na interface, desfocada ou incluída no JavaScript continua acessível no protótipo. Isso não pode ser reutilizado como controle de acesso de produção.

## 2. Decisão de arquitetura

Aplicativo para celular Android/iOS como produto principal, backend modular único, PostgreSQL gerenciado e armazenamento de objetos privado. O frontend HTML desta entrega é exclusivamente um protótipo da navegação mobile; não constitui implementação nativa ou decisão de lançar uma PWA. A implementação instalável deve usar navegação, gestos, armazenamento seguro de sessão e ciclo de vida próprios de aplicativo, com validação em aparelhos. O framework e o empacotamento ainda não foram selecionados. Preferir serviço consolidado de identidade compatível com OIDC e bibliotecas oficiais. Não desenvolver armazenamento de senhas, emissão própria de tokens nem mecanismos próprios de recuperação de conta. Selecionar fornecedores após verificar condições, região, acordo de tratamento de dados e custos atuais; este documento não fixa um fornecedor.

| Componente | Responsabilidade |
| --- | --- |
| Aplicativo Android/iOS | Cadastro, perfil, descoberta, conversa e consentimento; nunca decide autorização |
| Aplicação/API | Autorização por recurso, elegibilidade, matching, mensagens, consentimentos e proxy de mídia |
| Identidade gerenciada | Login, recuperação, sessões e mecanismos contra abuso de autenticação |
| PostgreSQL | Estado autoritativo, unicidade, transações, bloqueios e auditoria restrita |
| Objetos privados | Fotografias e derivados, sem ACL pública e sem URLs permanentes no cliente |
| Trabalho assíncrono | Processamento de imagem, notificações, exclusão e retenção, inicialmente com outbox no PostgreSQL |
| Painel administrativo | Triagem de denúncias com acesso mínimo, MFA e trilha de auditoria |

HTTP para comandos e consultas. SSE ou recurso equivalente consolidado para avisar sobre novas mensagens; o histórico continua no banco. Começar com paginação por cursor. Não introduzir microserviços, Redis, fila externa ou banco vetorial sem medição que justifique. Um serviço de chat gerenciado pode substituir o módulo se atender às mesmas regras de bloqueio, autorização, exportação e exclusão.

## 3. Elegibilidade e descoberta

Namoro exclusivamente entre adultos. Checkbox de maioridade não comprova idade: antes de abrir o serviço é necessário selecionar e testar uma estratégia proporcional de verificação e tratamento de suspeita de menoridade. Guardar somente o resultado e dados estritamente necessários; documentos e biometria não entram automaticamente no banco da aplicação.

Aplicar filtros bilaterais de faixa etária, interesses declarados, região aproximada, conta disponível e ausência de bloqueio. Preferências sensíveis exigem tratamento específico de privacidade e base legal avaliada; não inferi-las a partir de livros. Não expor coordenadas nem distância precisa que permita rastreamento.

Ordenar candidatos elegíveis por afinidades literárias explícitas: obras em comum, autores, gêneros e respostas voluntárias. Pesos são hipótese de produto, versionados e ajustados por experimento; não são uma medida científica de compatibilidade amorosa. Explicar sinais reais, por exemplo, “duas obras em comum”, em vez de percentual inventado de compatibilidade. Reservar exploração para afinidades diferentes e evitar privilegiar apenas livros populares.

Separar obra de edição, ISBN e tradução. Uma mesma obra com edições diferentes deve produzir a mesma afinidade. Cadastro manual entra em normalização, sem inventar metadados. Consulta ao catálogo externo não deve transmitir o perfil de namoro do usuário.

## 4. Estados e invariantes

### Match e conversa

Um like é privado. Dois likes válidos geram um match único para o par normalizado. O chat existe somente com match ativo. Estados do match: `ACTIVE`, `UNMATCHED`, `BLOCKED`; suspensão da conta também impede acesso. Reativação não é implícita, e um match encerrado não volta a funcionar por repetição de uma requisição antiga.

Toda operação verifica o usuário autenticado e a participação no recurso. IDs opacos não substituem autorização. Bloqueio deve valer nas duas direções para descoberta, novas mensagens, notificações e novas leituras de foto. Mensagens já enviadas podem precisar de retenção limitada para denúncia; política e acessos devem ser definidos antes do lançamento.

### Revelação de fotografia

Estados derivados: `LOCKED`, `ELIGIBLE`, `REVEALED`. Consentimentos são privados; a interface não informa que o outro já aceitou ou recusou. A revelação bilateral libera simultaneamente a versão autorizada da fotografia de cada pessoa. Permitir continuar conversando sem revelar. Nunca vender bypass da espera ou do consentimento.

Hipótese inicial para testar: elegível após 24 horas desde a primeira resposta bilateral e cinco turnos alternados de cada participante. Horários e contagem vêm do servidor; uma sequência de mensagens do mesmo remetente conta como um turno. Texto repetido, rate limits e sinais de automação ajudam a mitigar abuso, sem provar qualidade ou intenção. Não usar IA para atribuir pontuação de intimidade. Os números são parâmetros experimentais, não resultados validados.

Cada consentimento registra `match_id`, `user_id`, `photo_a_version`, `photo_b_version`, `policy_version` e horário. Para revelar, ambos devem consentir ao mesmo par de versões e à mesma política, com fotos aprovadas e match ativo. Trocar qualquer foto invalida ambos os aceites e exige novo acordo. Cancelar consentimento bloqueia novas leituras, inclusive após revelação; isso não apaga cópias que já foram baixadas ou capturadas.

### Simultaneidade

Normalizar `(user_a, user_b)` e aplicar unicidade no banco. Likes, geração do match, mensagens e consentimentos precisam de chaves de idempotência. Transações curtas bloqueiam a mesma linha do match antes de consentir, trocar foto, encerrar ou bloquear; usar ordem de aquisição consistente para evitar deadlocks. Bloqueio/encerramento incrementa `authorization_version` e invalida consentimentos. Nenhum aceite anterior pode reativar o match.

No proxy, verificar o estado autoritativo em cada pedido e novamente antes de começar a transmissão; não reutilizar uma autorização em memória após bloqueio. Uma transferência autorizada já iniciada pode entregar bytes quando o bloqueio ocorre; bloquear não desfaz entrega nem captura. Testar essa fronteira e descrevê-la honestamente. Notificações usam outbox transacional e rechecagem de elegibilidade antes de envio para evitar avisos atrasados de um match bloqueado.

## 5. Modelo mínimo de dados

| Entidade | Campos e restrições centrais |
| --- | --- |
| `accounts` | ID interno, ID do provedor único, estado, resultado mínimo de elegibilidade etária, timestamps |
| `profiles` | Nome de exibição, respostas, região aproximada, preferências; nunca devolver campos privados na descoberta |
| `works`, `editions` | Obra canônica, autor, edição, ISBN opcional; relação edição–obra |
| `user_books` | Usuário, obra, relação declarada; unicidade usuário–obra–relação |
| `likes` | Remetente, alvo, estado; unicidade de par dirigido |
| `matches` | Par ordenado único, estado, versão de autorização, política, começo bilateral e timestamps |
| `messages` | Match, remetente, sequência, texto, `client_message_id`; unicidade remetente–chave e match–sequência |
| `media` | Dono, chave privada, versão, estado de moderação, tamanho e tipo efetivamente decodificado |
| `photo_consents` | Match, participante, versões das duas fotos e da política; consentimento ativo e revogação |
| `blocks` | Bloqueador, bloqueado; unicidade de par dirigido |
| `reports` | Autor, alvo/recurso, categoria, estado, evidência mínima restrita, prazo de retenção |
| `outbox` | Evento, destinatário, chave idempotente, status e próxima tentativa |
| `audit_events` | Ação administrativa, ator, recurso opaco, resultado, horário; sem texto de chat |
| `deletion_requests` | Conta, escopo, prazo, estado e confirmação por subsistema |

Índices devem acompanhar filtros e paginação, especialmente participantes/estado, match/seq, bloqueios nos dois sentidos e contas elegíveis por região. Não guardar toda atividade de leitura ou perfil em eventos de analytics.

## 6. Contratos propostos

Todas as rotas são do projeto Trelelê, não endpoints observados de outro serviço. Usar validação de esquema no servidor, proteção CSRF quando houver cookies, limites por usuário e resposta sem dados além do necessário.

| Operação | Contrato | Garantia |
| --- | --- | --- |
| Descobrir | `GET /v1/discovery?cursor=…` | Apenas candidatos elegíveis; sem foto privada nem localização exata |
| Like | `PUT /v1/likes/{targetId}` | Idempotente; elegibilidade revalidada; match único transacional |
| Histórico | `GET /v1/matches/{id}/messages?cursor=…` | Participante autorizado e estado permitido |
| Enviar mensagem | `POST /v1/matches/{id}/messages` com texto e `clientMessageId` | Sem duplicação; sequência/horário do servidor; somente match ativo |
| Estado de revelação | `GET /v1/matches/{id}/reveal` | Apenas seu consentimento e estado derivado; sem sinalizar aceite unilateral do outro |
| Consentir | `PUT /v1/matches/{id}/photo-consent` com versões e chave idempotente | Ambos precisam aceitar o mesmo conjunto vigente |
| Revogar | `DELETE /v1/matches/{id}/photo-consent` | Nega novos acessos; não promete apagar cópias |
| Ver foto | `GET /v1/matches/{id}/photos/{ownerId}` | Proxy autenticado; autorização atual a cada requisição |
| Bloquear | `PUT /v1/blocks/{targetId}` | Invalidação imediata do estado de autorização para novos pedidos |
| Denunciar | `POST /v1/reports` | Recebimento rastreável; acesso restrito e antiabuso |
| Excluir conta | `POST /v1/account/deletion` | Desativa visibilidade/sessões e agenda eliminação verificável |

Erros de negócio previsíveis devem ter códigos estáveis, por exemplo `MATCH_INACTIVE`, `REVEAL_LOCKED`, `CONSENT_VERSION_STALE` e `RATE_LIMITED`. Evitar distinguir “ID de outra pessoa existe” de “não existe” em recursos privados. O cliente pode atualizar estado otimisticamente, mas sempre reconcilia com o servidor.

## 7. Mídia privada e moderação

Upload passa por limites de bytes/pixels, decodificação, reencodificação, remoção de EXIF/GPS e moderação antes de ativar. Rejeitar SVG e formatos não previstos; verificar conteúdo real, não apenas extensão ou MIME declarado. Chaves de objetos são aleatórias; bucket privado, criptografia e contas de serviço com menor privilégio. Imagens de verificação, caso existam, ficam separadas das fotos de perfil e têm retenção própria.

Download pelo proxy usa sessão autenticada e `Cache-Control: private, no-store`, sem CDN pública, service worker ou cache compartilhado. Não incluir fotos em payloads de descoberta, push, logs, relatórios de erro ou HTML de preview. URLs assinadas de armazenamento não devem ser entregues como solução de revogação imediata: uma URL já emitida pode permanecer válida até expirar. Políticas do armazenamento complementam a autorização da aplicação.

Denúncia e bloqueio são acessíveis dentro da conversa e do perfil. Painel administrativo exige MFA, perfis de acesso e justificativa auditável para acessar evidências. Mensagens não são enviadas indiscriminadamente a provedores de IA. Se moderação externa for escolhida, documentar dados enviados, base legal, retenção e contrato antes da integração. Não alegar criptografia ponta a ponta sem implementação e verificação próprias dessa propriedade.

## 8. Observabilidade, exclusão e recuperação

Medir latência, taxa de erro, mensagens entregues, falhas de autorização, filas de processamento/exclusão, denúncias pendentes e conversão agregada entre match, resposta e revelação. Não logar texto, fotografias, tokens, cookies, consentimentos individuais de interesse, data de nascimento nem preferências sensíveis. Usar identificadores opacos e pseudonimização; isso não equivale a anonimização. Logs restritos, retenção explícita e scrub de ferramentas de erro.

Exclusão começa por desativar descoberta, revogar sessões e impedir novos acessos. Processo rastreável elimina perfil, mídia, índices derivados e dados nos fornecedores; retenções estritamente necessárias para fraude/denúncia dependem de política e avaliação jurídica, sem prazo legal inventado. Informar ao usuário o que será retido e por quê.

Backups criptografados têm janela de retenção definida e acesso restrito. Um registro mínimo de exclusões, separado dos backups de dados e limitado à finalidade, deve ser reaplicado antes de liberar qualquer restauração para tráfego. Expirar backups conforme política; não prometer remoção granular instantânea de uma cópia imutável. Testar restauração, reaplicação de bloqueios/exclusões e comprovação de tarefas pendentes.

## 9. Capacidade e limites iniciais

Metas propostas para validar em piloto: p95 inferior a 500 ms para API de texto sob a carga de referência, entrega de evento de mensagem em até 2 s em condições normais, paginação de 20 perfis e 50 mensagens por requisição. Limites iniciais propostos: texto de 2.000 caracteres, upload de 8 MB e 20 megapixels, derivados com dimensão máxima de 1.600 px. São decisões experimentais, não capacidade comprovada nem promessa comercial.

Rate limits por conta, recurso e risco devem ser calibrados com teste de carga e abuso; não depender apenas de IP. Aplicar limites de conexões, requisições, tamanho de corpo e orçamento de processamento. Backpressure e retentativas com jitter evitam fila infinita. Índices, pool de banco e capacidade de proxy dependem de usuários simultâneos e volume de mensagens/fotos, não só de cadastros.

Custos devem ser estimados depois de medir usuários ativos, simultaneidade, tráfego de foto, verificação, mensagens/notificações e atendimento humano. Não há preço ou prazo de entrega validado neste documento. Operação de segurança e moderação é parte do orçamento, mesmo sem IA por match.

## 10. Portões antes de receber usuários reais

1. Validar proposta e regra de revelação com adultos em teste consentido; fixar política de privacidade, idade, moderação e retenção.
2. Selecionar identidade, banco, mídia, notificações e eventuais verificações gerenciadas; avaliar contratos e fluxos de dados.
3. Implementar autorização em servidor e testes de isolamento entre usuários e matches; nenhuma decisão sensível no cliente.
4. Verificar concorrência: likes simultâneos, mensagens repetidas, segundo aceite concorrente com bloqueio, revogação e troca de foto.
5. Auditar mídia e caches: ID alterado, link antigo, metadados, service worker, compartilhamento de sessão e resposta após bloqueio.
6. Implementar bloqueio, denúncia, triagem humana, resposta a incidentes e suspensão por suspeita de menoridade/abuso.
7. Demonstrar exclusão e restauração sem reativar contas, fotos ou consentimentos revogados; testar fornecedores e backups.
8. Executar teste de carga, acessibilidade mobile, recuperação de falhas e revisão independente de segurança; corrigir achados críticos antes do piloto público.

Sem esses portões o artefato continua sendo demonstração com dados fictícios. A presença de telas de cadastro ou cadeados não muda esse status.

## Fontes técnicas e alcance

- ECC Architect: referência de método carregada pelo agente; não equivale a auditoria de um sistema implementado.
- AWS, comportamento de URLs pré-assinadas: https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html — acesso temporário não é autorização revogável por match.
- PostgreSQL, isolamento de transações: https://www.postgresql.org/docs/current/transaction-iso.html — a estratégia concreta de locks, restrições e retentativas precisa ser testada na implementação.

Este documento é uma proposta independente. Não pressupõe acesso a contas, APIs privadas, banco de dados ou código de servidor de aplicativos concorrentes.
