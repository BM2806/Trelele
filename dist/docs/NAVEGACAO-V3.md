# Navegação V3 — revisão independente

Data: 16/10/2026. Escopo: melhorar estrutura, acesso e retorno sobre as funcionalidades existentes. Fonte revisada: `dist/app.mjs`, `dist/index.html` e estilos V2. Sem alteração dos três arquivos por este revisor. Não houve navegador ou teste visual nesta revisão.

## Diagnóstico concreto da fonte

- O header global com marca e filtro permanece em toda a aplicação; dentro de uma conversa soma-se ao header da thread. Filtro de descoberta não é ação pertinente ao chat.
- `go('chat')` redefine `activePerson=null`; alternar abas e voltar perde contexto de navegação da conversa, embora o rascunho já seja preservado.
- `history.replaceState` usa só `#chat`, sem distinguir inbox de thread. O navegador não dispõe de uma pilha interna coerente para voltar thread→inbox.
- Perfil entra em edição longa, com configurações, estante e preferências na mesma tela; a ação “Estúdio, referências e arquivos” ocupa o fluxo de produto.
- Debug aparece dentro do histórico como `.demo-controls`. Isso mistura mensagens, consentimento e comandos de teste, alonga a conversa e concorre com o composer.
- `render()` reconstrói a tela e leva o histórico ao fim em qualquer render do chat. Preservação de scroll e leitura ainda é lacuna.
- Botão do nome da pessoa já abre detalhes diretamente; a base deve ser mantida. Inbox já separa novos matches de conversas e chat-row abre thread sem intermediário: conservar.

## Referências externas oficiais: observação e decisão

| Fonte | O que a fonte sustenta | Aplicação proposta, que é decisão nossa |
|---|---|---|
| Apple HIG, Tab bars | Tab bar navega entre seções; não é barra de ações. | Quatro destinos estáveis: Descobrir, Curtidas, Conversas, Perfil. Nenhum CTA de revelar, debug ou pagar na navegação principal. |
| Material 3, Navigation bar e Top app bar | Navegação compacta com 3–5 destinos de igual importância; app bar contém título e ações da tela atual. | Header contextual e remoção de filtro global do chat/perfil. Não redesenhar os ícones em cada tela. |
| Hinge, Discover Feed/Matching | Descoberta admite interesse numa parte do perfil; reciprocidade leva a Matches, de onde a conversa começa. | Manter livro/opinião como contexto; match dá acesso direto a chat e continua disponível na inbox. Não adicionar tela promocional entre match e conversa. |
| Lex, What is Lex?/site | Rede centrada em linguagem e conexões que excedem selfies; site atual inclui grupos e eventos. | Tornar uma opinião da pessoa legível e específica. Não importar feed/grupos/eventos nesta revisão de navegação. |
| Breeze, FAQ/site | Proposta principal pula chat para chegar a encontro. | Aprender foco numa ação central e simplicidade. Não copiar ausência de chat, porque conversa antes da foto é premissa do Margem. |

Essas páginas não comprovam que o público preferirá nosso design nem substituem teste em dispositivo. Não inferir código, algoritmo ou sucesso comercial a partir delas.

## Cinco regras para implementação

1. **Contexto na barra superior.** `.topbar` exibe marca/filtros na descoberta, título da seção nas outras raízes. Em `.in-thread`, usar apenas `.thread-header` com voltar, nome da pessoa e opções; remover o header global e a bottom nav dessa tela de detalhe para abrir espaço à leitura e ao teclado. Voltar restaura inbox e sua navegação principal. A remoção em detalhe é decisão nossa, não requisito universal da Apple.
2. **Rotas e memória de contexto.** `go()`, `open-chat`, `hashchange` devem distinguir `#chat` da rota de pessoa (`#chat/lia`, por exemplo). Navegação interna cria histórico quando muda nível; voltar do navegador e botão voltar chegam à mesma tela. Alternar abas preserva último contexto, pessoa, livro, rascunho e scroll; voltar à aba Conversas pode restaurar a última thread, e retocar a aba ativa pode levar à raiz — escolher uma regra e aplicá-la consistentemente. Não empilhar entrada a cada render ou alteração de livro.
3. **Perfil primeiro se apresenta.** `profile()` abre overview/preview com nome, livros, apresentação e CTA “Editar perfil”. `.profile-tabs` pode preservar Editar/Visualizar dentro da edição se isso ajudar, mas não abrir longa configuração como primeira experiência. Preferências continuam alcançáveis pelo próprio perfil. Sem funcionalidades novas, sem cadastro ou upload real.
4. **Ferramentas fora do caminho principal.** Aviso `.demo-bar` permanece visível e legível, com acesso “Sobre a demo”. Esse acesso abre um menu/sheet com simulação, reinício e estúdio. `.demo-controls` sai do histórico; `[data-view=studio]` sai da lista normal do perfil. Comandos de simulação mantêm nomes explícitos e escopo da conversa selecionada. Não ocultar o caráter fictício para parecer produto operacional.
5. **Um toque, retorno seguro.** `.chat-row` abre chat diretamente; `.thread-person` abre perfil do interlocutor; fechar detalhes retorna à mesma thread, posição e rascunho. Match tem CTA “Abrir conversa” e alternativa continuar. Diálogos não são substitutos de rotas principais; cada X/cancelar/voltar fecha só a camada ativa e não encerra conexão.

## Orçamento de passos

| Intenção | Caminho esperado | Máximo proposto |
|---|---|---|
| Abrir próprio perfil de uma tela raiz | Perfil na nav | 1 toque |
| Conversar após match | Abrir conversa | 1 toque |
| Retomar conversa da inbox | Linha da pessoa | 1 toque |
| Ver perfil de interlocutor | Nome no header do chat | 1 toque |
| Voltar de perfil interlocutor | Fechar/voltar | 1 toque, sem perder chat |
| Voltar do chat à inbox | Voltar no header ou navegador | 1 ação |
| Editar apresentação do overview | Editar perfil → apresentação | 1–2 toques conforme arranjo |
| Acessar debug | Sobre a demo → Simulação | 2 toques; fora do fluxo comum |
| Estúdio/arquivos | Sobre a demo → Estúdio | 2 toques; fora do fluxo comum |

## Aceites de regressão

- Nenhum filtro de descoberta dentro do header do chat; opções da pessoa permanecem acessíveis.
- Teclado móvel não encobre composer; a tela não tem duas barras superiores com a mesma função. Safe areas permanecem.
- Perfil sempre é destino nomeado; nenhum ícone abstrato como única pista.
- Navegar chat→perfil do outro→fechar preserva thread, rascunho e estado de revelação.
- Alternar Descobrir→Perfil→Descobrir conserva pessoa e livro, sem curtir/passar.
- Botão voltar do navegador não sai da aplicação quando existe nível interno anterior, e não fica preso por histórico artificial.
- Quando houver sheet aberto, primeiro voltar fecha só sheet; o próximo volta na hierarquia. Conservar foco seguro e restaurar disparador válido.
- Não transformar simular aceite em consentimento do usuário nem em resposta humana. Menu de demo informa a conversa afetada.
- Filtros e edição cancelados mantêm dados anteriores. Scroll e rascunho são preservados em navegação não destrutiva.
- Retirar chrome do chat não retira segurança/denúncia, nome e voltar. Encerrar conexão continua ação separada de fechar.

## Referências consultadas

- Apple, Tab bars: https://developer.apple.com/design/human-interface-guidelines/tab-bars
- Apple, Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- Material 3, Navigation bar: https://m3.material.io/components/navigation-bar/overview
- Material 3, Top app bar: https://m3.material.io/components/app-bars/overview
- Hinge, Discover Feed: https://help.hinge.co/hc/en-us/articles/36311592824595-Discover-Feed
- Hinge, Matching: https://help.hinge.co/hc/en-us/articles/360011090134-How-Do-I-Match-with-Someone-and-Start-Chatting
- Lex, What is Lex?: https://help.lex.lgbt/article/13-what-is-lex
- Lex, site atual: https://www.lex.lgbt/
- Breeze, FAQ: https://www.breeze.social/faq

## Estado da validação

### Delta V3 implementado e inspecionado

Nova leitura de `app.mjs`, `style.css` e `index.html` confirmou: header contextual; thread dedicada oculta header/nav globais com regra `[hidden]{display:none!important}`; `#chat/id` com navegação por histórico; perfil começa em overview e tem CTA Editar; ferramentas da simulação aparecem no sheet Demo, não no histórico; estúdio sai do fluxo comum. Botão de nome continua abrindo perfil do interlocutor em um toque; inbox abre chat diretamente. Rascunhos por pessoa e restauração de foco por dataset permanecem. Fonte passa a Plus Jakarta Sans e ícones Phosphor são usados por sprite SVG, com rótulos acessíveis nos botões.

Contrastes calculados das novas cores declaradas: secundário `#647079` sobre branco 5,08:1 e sobre `#f7f8fa` 4,78:1; branco sobre cobalto `#3454d1` 6,30:1; metadados claros da mensagem sobre cobalto 5,12:1; perigo `#b43851` sobre branco 5,79:1; ícone rewind `#6c7b8c` sobre branco 4,33:1 (supera 3:1 para ícone essencial). Essa amostragem não certifica toda a interface.

### Achados encaminhados na revisão final

| Achado | Evidência da fonte | Correção solicitada |
|---|---|---|
| Retorno da thread cria nova entrada | `case inbox` chama `navigate('chat',null)` com push padrão; voltar UI e depois navegador pode reabrir thread. | Retorno deve consumir nível interno ou substituir destino de retorno de forma consistente. Evitar pingue-pongue. |
| Voltar com sheet aberto pode fechar e navegar | Diálogos não criam nível no histórico; `popstate→route→navigate` fecha diálogo e muda rota. | Primeiro retorno fecha só camada ativa; gerenciar modal no histórico ou registrar explicitamente limitação. |
| Scroll do histórico não preservado | `scrollPositions` salva `main`, enquanto mensagens têm scroll próprio; `render` sempre leva `.messages` ao fim. | Preservar offset por thread quando releitura/retorno; rolar ao fim somente por entrada pertinente ou mensagem enviada. |
| Acesso à demo menor que padrão interno | `.demo-bar button` ainda 27×36 px; símbolo Unicode no index em vez do sistema de ícones. | Ícone Phosphor info; alvo 44×44 px e barra que acrescente safe area à altura útil. |

Os achados foram enviados ao arquiteto antes da publicação. Nova leitura do snapshot final confirmou as correções abaixo; o nome exibido na aplicação passou a **Trelelê**, escolhido pelo usuário.

- Retorno para inbox chama `navigate('chat',null,false)` e substitui hash por `#chat`, evitando nova entrada de retorno que reabriria a thread imediatamente.
- Revisão posterior corrigiu o fallback inicial de `popstate`: cada camada usa marcador próprio no histórico e snapshots em memória; X/Escape consomem a entrada real com `history.go`, enquanto `popstate` apenas restaura snapshot/rota sem empilhar novamente. Livro aberto nos detalhes mantém retorno ao perfil pai; curtir/navegar consome as camadas sem ressuscitar o perfil anterior. Esse é o comportamento final V3; V4 substituirá perfil em diálogo por tela própria e livro inline.
- `threadScroll` salva offset por pessoa antes de reconstruir a tela; `scrollBottomPerson` restringe rolagem ao fim às ações pertinentes de mensagem/simulação. Esse estado é separado de scroll das telas raiz.
- Override final define `.demo-bar` com altura `44px + safe-area-inset-top`, botão de 44×44 px e ícone Phosphor info no index. O caráter fictício continua visível.

Resultado da revisão de fonte: achados acima resolvidos para a demonstração. Arquitetura reportou 52 testes aprovados; essa contagem não foi executada por este revisor e deve ser conferida no relatório de QA. Rotas combinadas com voltar físico, teclado virtual, leitores de tela e dispositivos com notch ainda exigem verificação prática. Não afirmar aprovação visual ou conformidade AA integral.

Documento é recomendação e inspeção estática, não validação visual ou teste de usuários. Composição com teclado iOS/Android, notch/safe area, anúncio do log e foco entre diálogos continuam sem verificação em dispositivo. Acessibilidade e segurança de produção não são aprovadas por uma demo estática.

## Complemento final — histórico de camadas

A coordenação identificou que interceptar popstate sem criar entrada na abertura não bastava. O frontend foi corrigido com marcadores de histórico por camada e snapshots locais; X e Escape consomem a camada, e popstate restaura o estado sem criar pushes de compensação. Os três casos que falhavam passaram em testes com history.back() no emulador. O resultado completo foi 57/57. Isso não substitui teste do navegador no aparelho.
