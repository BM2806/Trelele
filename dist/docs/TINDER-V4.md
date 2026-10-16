# Tinder V4 — investigação de navegação, telas e transições

Consulta e inspeção: 16/10/2026. Escopo: engenharia reversa funcional pública, sem login, swipe real, mensagem ou acesso a conta de namoro. Não revela código, arquitetura interna nem ranking proprietário. Nenhuma foto concorrente foi aplicada aos perfis do Trelelê.

## Resultado e cobertura real

**28 imagens baixadas e visualmente inspecionadas**, acompanhadas de manifesto. Há 16 capturas funcionais públicas do Revyl Atlas, seis peças oficiais da App Store brasileira, um diagrama oficial de 2017, duas capturas públicas da Uiland e três referências enviadas pelo usuário. A investigação separa esses tipos: peça promocional não é uma sessão navegada; captura independente sem versão identificada não é “o Tinder atual em todos os celulares”.

Arquivos: `docs/research/tinder/manifest.json`, com `id`, `file`, `sourceUrl`, `caption`, `observed`, `limits`, tipo e data de inspeção. Caminhos de imagens são relativos à pasta do manifesto. Todas existem localmente. Os arquivos intermediários de download não são o catálogo final e podem listar tentativas de403 anteriores ao download concluído.

Não acessei todas as telas do Tinder. Vi estados de descoberta, perfil completo/fundo, overflow, Explore, Likes vazio, caixa vazia, perfil próprio, filtros, Gold, edição/prévia, prompts e segurança. Não consegui uma captura recente de conversa pessoal aberta ou match recente; para layout de lista e overlay, a evidência visual é histórica e fornecida pelo usuário. Não há evidência aqui de “o fluxo inteiro testado no Tinder”.

## Hierarquia das evidências

- **O — observado:** elemento visível numa imagem baixada e inspecionada. Não prova sozinho o resultado de clicar.
- **D — documentado:** ação/resultado descritos na ajuda ou release oficial; data indicada individualmente.
- **I — inferido/proposto:** comportamento necessário/útil para o Trelelê, não afirmado como implementação do Tinder.
- Capturas Revyl/Uiland não têm data/versão do aplicativo verificadas nesta investigação. Data de rastreamento e rodapé2026 do site não servem como versão do app.
- O release de18/07/2017 é histórico. A listagem App Store consultada expunha versão17.39.1, mas não se pode atribuir essa versão a cada captura externa.

## Anatomia e workflow, por área

| Área / evidência | Entrada e ação | Resultado verificável | Retorno e implicação para Trelelê |
| --- | --- | --- | --- |
| **Discovery: mídia e voto** O: swipe-deck-home; D: App Store e overview [S1,S2] | Abrir aba Swipe/Descoberta; deslizar direita/esquerda ou tocar ações. Setas de mídia e abertura são ações distintas do voto. | Card é de uma pessoa, com foto dominante, distância e X/coração; documentação confirma curtir/passar e match recíproco. A captura tem toast cobrindo topo: não inferir área encoberta. | **I:** consumir exatamente uma pessoa por voto; toque leve muda livro, gesto intencional vota. Não votar em capa como entidade separada. |
| **Discovery: fotos e perfil** O:2017-tappy e match-profile-detail; D:release2017 [S3] | Histórico: bordas avançam/voltam foto, rodapé abre perfil. Captura independente recente mostra seta↑ para detalhe. | Perfil completo separado, cabeçalho/idade, mídia segmentada, intenção e bio. **O:** seta↓ oferece recolhimento; não é botão de curtir. | **I:** perfil em rota/tela própria preservando card, livro e scroll da origem. Fechar não registra voto. Não copiar coordenação de toque de2017 como geometria obrigatória2026. |
| **Prompts / respostas pessoais** O:onboarding-share-more, onboarding-prompt-answer/v-filled, edit-info-preview | Blocos separados para bio e pergunta; responder abre editor com seletor, contador e Done. | **O:** Done desabilitado no vazio e ativo no preenchido; resposta aparece na prévia do perfil. Não foi testado persistir alteração no app real. | **I:** opinião sobre livro é conteúdo da pessoa; edição/preview precisam mostrar quem escreveu. Fechar editor sem salvar deve ter regra explícita. Não obrigar voz publicitária nem resposta de IA. |
| **Explore** O:explore-tab; D:help2025 [S4] | Aba inferior Explore → escolher experiência/tile. | Tela tem destaque grande e grade de modos, não grade genérica de pessoas. Ajuda diz que o mesmo swipe/match opera com pool contextual. Tiles podem variar por região/tempo. | **I:** não criar Explore no MVP só para preencher uma quinta aba. Se usar modos dentro Descobrir, manter mesmo sistema de perfis/votos e indicar filtro/contexto ativo. |
| **Likes** O:likes-tab; D:help2025 [S5] | Coração inferior; quem tem acesso vê recebidas → toca perfil → esquerda dispensa/direita retribui. | Captura observada é0Likes com tabs Likes/Top Picks e CTA Gold. Ajuda confirma fila e ação de retribuir, com teste avulso iOS em mercados. Não vimos fila real preenchida nesta captura. | **I:** fila Trelelê abre o mesmo perfilpessoa. Retribuir gera par único e tira item pendente. Mostrar números reais da demo, nunca blur/contagem que simula demanda inexistente. |
| **Match** O:user-match; D:overview [S2] | Segunda curtida recíproca. | Imagem histórica mostra overlay com dois retratos e enviar mensagem/continuar; regra bilateral documentada. Não vi uma transição recente executada entre votar e overlay. | **I:** overlay único sobre origem; “Mandar mensagem” vai ao thread do par, “Continuar vendo perfis” retorna ao deck/fila já atualizado. Nenhuma foto aparece antes da regra Trelelê. |
| **Inbox / lista** O:chat-tab, user-inbox, chat-safety-center | Aba Chat; num estado preenchido, tocar item de match/conversa. | Estado vazio tem título, ações superiores e explicação. Histórico do usuário tem faixa horizontal New Matches e lista vertical com nome/trecho. Toolkit observado mostra uma mensagem TeamTinder ao fundo. Não é evidência de chatpessoal completo. | **I:** separar caixa de conversa. Preservar posição ao voltar. Novo match ainda sem mensagem na faixa; conversas com mensagem na lista. Não duplicar status ou inventar não lidas. |
| **Conversa aberta** D:help Messaging [S6]; lacuna visual atual | Match selecionado → chat; digitar/enviar. | Documentação básica estabelece conversa após match, com GIF/Bitmoji. Capturas Uiland abertas são modais de orientação, apesar do nome de arquivo, e **não** thread. Exceções de mensagens pré-match existem em recursos pagos: não afirmar que qualquer texto do produto inteiro exige match. | **I:** thread em tela própria, sem navegação de descoberta competindo com composer; cabeçalho da pessoa abre perfil com retorno à conversa. Teclado não esconde composer. Foto é estado contextual, não gate para enviar mais mensagens. |
| **Meu perfil / editar** O:profile-tab, edit-info, edit-info-preview; D:help2023 [S7] | Aba Profile → Edit profile; engrenagem separada abre Settings; editor tem Edit/Preview. | Perfil próprio reúne completude/atalhos/premium; editor tem grade de mídia e prévia de card. Ajuda lista bio, interesses, intenção e campos, com variações regionais. | **I:** “Perfil” não deve cair diretamente no formulário. Uma visão própria com botão Editar, editor com salvar e prévia, retorno claro. Nove fotos vistas não é requisito para Trelelê. |
| **Discovery preferences** O:swipe-filter-sheet; D:help2024 [S8] | Painel alto de filtro, modo, localização, distância, interesse e idade; concluir no topo. Documentação também oferece caminho Perfil→Settings→Discovery. | Sliders e toggles fazem diferença entre preferência e limite rígido. Seção Premium Discovery aparece abaixo. Só screenshot não prova quando salva. | **I:** filtros básicos disponíveis, preferência literária distinta de limite essencial; aplicar retorna à origem e recalcula pool sem fabricar opções. Por Perto usa fixtures declaradas, sem insinuar GPS real. |
| **Premium / conversão** O:swipe-gold-paywall e profile-tab; D:help2026 [S9] | Perfil/settings ou CTA contextual → oferta; selecionar plano; continuar ou fechar. | Paywall tem X, períodos em cards, benefícios, aviso de renovação, total e compra Apple. Moeda/preço da captura são estrangeiros e não cotaçãoBR. Tabela oficial registra variação de testes. | **I:** manter preçoR$29,90 como hipótese sem checkout real. Fechar devolve à mesma tarefa. Não cobrar para consentir, denunciar ou contornar foto protegida. Não importar alegação de3xmatches do concorrente. |
| **Safety** O:overflow, profile-bottom, chat-safety-center, Uiland2overlays; D:help2024 [S10,S11] | Perfil→overflow ou rodapé→Report/Block; caixa→escudo→toolkit; chat→menu→denunciar/desfazer. | Ações são separadas. Ajuda descreve denúncia confidencial e encerramento permanente; captura mostra Cancel e escudo. Uiland orienta respeito/fraude com Next/paginação, não conversa livre. | **I:** ações precisam continuar acessíveis após desfazer; cancelamento retorna sem mutação. Bloquear interrompe contato e retira descoberta. Não confundir “remover da UI” com apagar evidências no servidor. |

## Telas que mudam a implementação — observações específicas

### 1. Descoberta não é uma capa com botões em volta

A foto domina o card, mas a leitura visual é nome, idade, distância, intenção e resposta da pessoa. Na captura expandida, o conteúdo pessoal ganha seções e continua permitindo X/coração. Na prévia própria, uma resposta pessoal é sobreposta à imagem. Para o Trelelê: a capa pode ocupar a área visual sem ocultar a identidade de quem está sendo curtido; livro, pessoa e comentário precisam permanecer associados ao trocar mídia.

### 2. Perfil, ajustes e edição são destinos diferentes

Na captura profile-tab, “Edit profile” está junto à identidade; a engrenagem leva a outro conjunto. A prévia aparece dentro do editor. Uma arquitetura que transforma Perfil num formulário permanente perde uma etapa real de navegação e mistura ver com alterar. O Trelelê pode simplificar as opções, mas precisa preservar essas intenções.

### 3. O filtro é mais que uma lista de categorias literárias

swipe-filter-sheet inclui modos, localização, distância, interesse, idade e exceções de faixa. A ajuda confirma toggles de limites. Para o Trelelê, uma lista “Romance/Suspense/Ficção brasileira” sozinha não dá controle suficiente sobre quem aparece. Separar pessoa elegível de preferência de leitura. Não importar a exceção do concorrente silenciosamente: no protótipo, filtros explícitos e resultados coerentes.

### 4. Segurança tem múltiplas entradas

A captura independente tem denúncia no fim do perfil e menu; toolkit fica na caixa. Não obrigar usuário a procurar um “estúdio” para denunciar. No Trelelê, a mesma pessoa deve ser reconhecida em card, perfil, match e conversa; bloqueio altera todos esses lugares de modo consistente. Denúncia no protótipo precisa dizer que não chega a equipe real.

### 5. Não há uma única navegação Tinder verificável universal

As capturas independentes mostram5raízes. A ajuda Explore2025 explica essa aba, mas Events2026 informa substituição temporária da Explore em mercados com Events. Modos e disponibilidade variam. Não justificar Trelelê com “Tinder tem5abas então precisamos5”. Quatro raízes com modos internos em Descobrir é decisão própria aceitável se as transições forem completas.

## Contrato de retorno proposto ao Trelelê — explicitamente não observado no Tinder

| Origem | Ação | Estado seguinte | Voltar/fechar |
| --- | --- | --- | --- |
| Descobrir/deck | Abrir pessoa | Perfil completo com pessoa+livro correntes | Mesmo card/livro; nenhum voto |
| Descobrir/Por Perto | Tocar tile de pessoa | Mesmo perfil completo, origem salva | Mesmo quadro e scroll; sem ativar GPS |
| Curtidas | Abrir recebida | Perfil com opção retribuir/passar | Mesma lista e scroll |
| Perfil de descoberta | Curtir sem reciprocidade | Origem com pessoa consumida | Não reabrir perfil já consumido por historyback sem revalidar |
| Qualquer origem | Curtir com reciprocidade | Match overlay do par | Continuar retorna origem atualizada; mensagem abre thread único |
| Caixa | Abrir conversa | Thread em tela própria | Retorna caixa no mesmo ponto |
| Thread | Abrir pessoa | Perfil com origemthread | Retorna ao mesmo thread/rascunho |
| Perfil | Abrir nota de livro | Detalhe leve vinculado à pessoa | Mesmo perfil/scroll; curtir livro não existe como substituto de curtir pessoa |
| Perfil meu | Editar→prévia | Editor/preview com dados consistentes | Salvar ou cancelar claros; retorna Meu perfil |
| Qualquer origem | Abrir filtro | Painel temporário | Cancelar descarta; Aplicar atualiza preferências e origem |
| Perfil/thread | Bloquear/desfazer | Confirmação→estado inacessível/retirada | Rotas antigas revalidam e não ressuscitam par |

A revelação Trelelê é um fluxo novo: hipótese24h após primeira resposta bilateral +5turnos alternados por lado, com consentimento privado de ambos e sem obrigação. Nenhuma fonte Tinder aqui comprova essa política ou sua eficácia. A pesquisa serve para navegação, não para atribuir nosso diferencial ao concorrente.

## Amostra visual e leitura

Os nomes abaixo constam do manifesto; cada imagem tem limites próprios.

| Evidência | Arquivo | Uso recomendado no atlas |
| --- | --- | --- |
| Diagrama oficial histórico | 2017-tappy.png | Mostrar divisão de gesto/toque/abrir perfil, com data2017 visível |
| Descoberta independente | swipe-deck-home.png | Mostrar identidade e ações, anotando toast que cobre topo |
| Perfil início/fim | match-profile-detail.png / match-profile-detail-bottom.png | Comparar superfície compacta com informação completa e continuidade das ações |
| Menu perfil | match-profile-overflow-sheet.png | Mostrar ações destrutivas separadas e cancelamento |
| Explore | explore-tab.png | Diferenciar coleção de experiências de grid de pessoas |
| Curtidas vazias | likes-tab.png | Mostrar estado vazio e conversão, sem chamar de fila preenchida |
| Caixa vazia | chat-tab.png | Mostrar destino raiz e tarefa de voltar a descobrir |
| Perfil próprio | profile-tab.png | Distinguir editar/ajustes/completude/premium |
| Filtros | swipe-filter-sheet.png | Mostrar painel e diferentes classes de preferência |
| Oferta | swipe-gold-paywall.png | Mostrar seleção/total/fechar, sem importar preço ou alegações |
| Editor/prévia | edit-info.png / edit-info-preview.png | Separar ver, editar e confirmar |
| Prompt vazio/preenchido | onboarding-share-more.png / onboarding-prompt-answer.png / onboarding-prompt-answer-filled.png | Mostrar validação e estado do botão, não copiar frase de exemplo |
| Segurança caixa | chat-safety-center.png | Mostrar acesso posterior a denúncia e recursos |
| Orientações Uiland | uiland-inbox.png / uiland-chat.png | **Rotular segurança/respeito e segurança/fraude; não conversas** |
| Caixa preenchida histórica | user-inbox.jpg | Mostrar faixa e lista, anotando fornecido pelo usuário/data indeterminada |
| Match histórico | user-match.jpg | Mostrar escolhas mensagem/continuar, anotando limite histórico |
| Intenção/tipo histórico | user-relationship.jpg | Mostrar bottomsheet e campos separados |
| Oficial App Store | appstore-br-01.jpg a06.jpg | Contexto visual atual de divulgação; não usar para provar workflow completo |

## Lacunas, bloqueios e decisões que não devem ser exageradas

- URLs públicas inicialmente retornaram403 ao download simples; com cabeçalhos normais de navegador e referer público as imagens indicadas foram baixadas. Não houve login nem acesso a telas bloqueadas.
- Uiland expõe alguns previews e bloqueia outras telas por login. Só as duas imagens públicas baixadas foram consideradas; são segurança sobre a caixa, não chat pessoal.
- Gummble foi consultado, mas a página extraída não expôs as telas e o download direto retornou403. Não afirmar458telas inspecionadas ou usar ano2026 do título como data de captura. Relato paralelo de captura2024 não foi tratado como certificação aqui.
- Revyl declara73telas/40caminhos. Inspecionei16capturas desse conjunto, não73nem todos os caminhos. O inventário do site por si só não substitui observar a imagem.
- Não vi tela pessoal recente de chat, grid preenchido de curtidas, erro de envio, teclado aberto, transição animada de match, tela real de cobrança confirmada, painel de assinaturaApple nem todas as confirmações de denúncia. Essas lacunas permanecem.
- Nomear uma imagem “chat” ou uma página “matchprofile” não prova seu conteúdo; a inspeção corrigiu rótulos do catálogo.
- Afirmar que mensagem é sempre impossível antes do match seria excessivo: há First Impressions na captura e recursos pré-match no material comercial; chat ordinário e mensagem pré-match são fluxos distintos.
- Não reusar fotos concorrentes como avatares Trelelê, mesmo as de marketing. O atlas de evidência deve atribuir fonte, data/limite e manter separado das pessoas fictícias do produto.

## Fontes primárias — abertas/consultadas em16/10/2026

- **S1 App Store Brasil**, listagem oficial Tinder LLC, capturas/promocionais baixadas: https://apps.apple.com/br/app/tinder-app-de-relacionamento/id547702041
- **S2 Tinder Overview**, atualização01/09/2026: https://www.help.tinder.com/hc/en-us/articles/115004647686-Tinder-Overview
- **S3 Tap Into a New Look**,18/07/2017: https://www.tinderpressroom.com/tap-into-a-new-look-on-tinder/
- **S4 Explore**,16/07/2025: https://www.help.tinder.com/hc/en-us/articles/38094560737677-Explore
- **S5 Likes**,28/10/2025: https://www.help.tinder.com/hc/en-us/articles/115005246123-Likes
- **S6 Messaging a Match**,28/10/2019: https://www.help.tinder.com/hc/en-us/articles/115003341583-Messaging-a-Match
- **S7 Editing your profile**,02/10/2023: https://www.help.tinder.com/hc/en-us/articles/115003339043-Editing-your-profile
- **S8 Discovery Settings**,09/12/2024: https://www.help.tinder.com/hc/en-us/articles/115003340963-Discovery-Settings
- **S9 Tinder subscriptions**,01/10/2026: https://www.help.tinder.com/hc/en-us/articles/115004487406-Tinder-subscriptions
- **S10 Reporting profiles and content**,27/12/2024: https://www.help.tinder.com/hc/en-us/articles/115003822043-Reporting-profiles-and-content
- **S11 Unmatching someone**,02/10/2024: https://www.help.tinder.com/hc/en-us/articles/115003360106-Unmatching-someone
- **S12 Rewind**,01/10/2026: https://www.help.tinder.com/hc/en-us/articles/115004493323-Rewind
- **S13 Events**,10/08/2026, mercados selecionados: https://www.help.tinder.com/hc/en-us/articles/43605586376461-Events

## Fontes visuais independentes

- Revyl Atlas, mapa público: https://revyl.com/atlas/tinder/ ; relatório: https://revyl.com/atlas/tinder/report/
- Uiland, previews públicos: https://uiland.design/screens/tinder/screens/9da5e5db-2ced-4fcd-a430-80087e6e5630/flows/all
- Gummble, consultado com cobertura visual insuficiente nesta tarefa: https://gummble.com/apps/tinder-android

As conclusões do contrato de retorno são decisões de design/produto para a implementação V4. Não são alegação de cópia exata, testeend-to-end do Tinder ou validação jurídica da replicação de marca e ativos.
