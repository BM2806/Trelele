# Trelelê V4 — qual tela leva a qual tela

Especificação inicial da arquitetura de informação, 16/10/2026. Substitui a proposta de perfil de pessoa em sheet das versões anteriores. Não é descrição de funcionalidades já implementadas. Responsável: revisão independente UX/ECC; frontend pertence à arquitetura.

## 1. Evidências antes da proposta

**Screenshots fornecidas pelo usuário e observadas diretamente (IMG_1490–1494):** card de uma pessoa por vez; segmentos e tap lateral alternam imagens da mesma pessoa; zona inferior/info abre detalhes; botões de decisão ficam separados; match oferece conversar ou continuar; inbox distingue matches recentes de mensagens; edição usa seleção em bottomsheet. Imagens históricas não comprovam interface atual, mapa do Happn ou algoritmo.

**Fonte atual V3 inspecionada:** quatro raízes, `#chat/id`, rascunhos e scroll por pessoa; `showPerson()` ainda cria diálogo longo, e livro aberto dele empilha snapshot; `currentView/activePerson` não modelam origem de perfil como destino independente. O usuário rejeitou esse arranjo. V4 muda hierarquia, não só cores ou fonte.

**Screenshot de referência Happn examinada após a primeira versão do mapa:** `dist/research/happn/historical-main-screens.png`, imagem atribuída a HappnDesign no Dribbble. À esquerda há mapa de um local, painel com contagem, grade de duas colunas, nome/idade, X e coração por pessoa; ao centro perfil dedicado; à direita Crush com iniciar chat/ver perfil. É referência histórica/promocional sem confirmação da data exata ou disponibilidade atual. A observação sustenta grade e perfil dedicado como referências visuais; em Trelelê optamos por tile abrir pessoa e decisão explícita no perfil, para evitar toque ambíguo livro/curtida. Não estamos copiando todos os CTAs da imagem.

**Documentação oficial consultada:** Tinder confirma interesse mútuo→match→mensagem, filtros de descoberta e mesmo ciclo de swipe em Explore contextual; Happn define mapa como visão espacial de cruzamentos agrupados e perfis naquela área. O quadro “Por perto” abaixo é adaptação de descoberta local para Trelelê, não cópia exata nem alegação de que conhecemos a localização de pessoas. Não usar texto “vocês se cruzaram” sem evidência real; na demo toda região é cenário fictício.

## 2. Quatro raízes permanentes

| Raiz | Finalidade | Destinos internos |
|---|---|---|
| Descobrir | Encontrar pessoas | Para você (card), Por perto (quadro), pessoa |
| Curtidas | Rever interesse recebido/enviado | Pessoa; match quando recíproco |
| Conversas | Retomar ou iniciar papo com match | Thread; pessoa a partir do header |
| Perfil | Ver e editar a própria apresentação | Edição; preferências |

Nav inferior leva sempre à raiz nomeada, não à última thread escondida. Dentro de cada raiz preservar seleção/scroll/rascunho sem transformar aba em atalho ambíguo. Descobrir lembra segmento e livro. Thread e perfil de outra pessoa são **telas de detalhe**, com header próprio e retorno de um toque; não exibem a nav raiz para evitar confundir tarefa atual.

## 3. Inventário numerado de telas e camadas

| ID | Tipo | Nome/rota proposta | O que a pessoa vê e faz |
|---|---|---|---|
| T01 | Raiz/segmento | Descobrir / Para você — `#discover/for-you` | Um perfil por vez, livro/opinião atual, nome, idade, foto oculta; avançar livro, ver pessoa, passar/curtir. |
| T02 | Raiz/segmento | Descobrir / Por perto — `#discover/nearby` | Quadro rolável de pessoas na cidade fictícia; cada tile é pessoa, identificado por nome/idade e livro. Não há match por tocar tile. |
| T03 | Tela detalhe | Pessoa — `#people/{id}` | Perfil completo, estante e opinião, intenção e região ampla. Ação depende de contexto: curtir/passar, curtida enviada, ou abrir conversa se já houver match. Header “Voltar” retorna à origem. |
| T04 | Raiz | Curtidas — `#connections` | Recebidas e enviadas em seções; recebida abre pessoa, enviada abre pessoa sem reenviar interesse. |
| T05 | Raiz | Conversas — `#chat` | Novos matches sem mensagem e threads com mensagem; tocar pessoa abre thread. Sem foto de rosto antes da revelação. |
| T06 | Tela detalhe | Conversa — `#chat/{id}` | Nome/perfil, voltar, opções, histórico, composer, estado da foto. |
| T07 | Raiz | Meu perfil — `#profile` | Visão de como meu perfil aparece, editar, preferências, pausar. |
| T08 | Tela detalhe | Editar meu perfil — `#profile/edit` | Campos/estante existentes, escolhas e “Concluir”. Não cadastrar dados reais. Voltar mantém alterações já salvas; rascunho em sheet segue regra de cancelar. |
| C01 | Camada transitória | Match | Reciprocidade fictícia, “Conversar” e “Continuar”; fechar não desfaz match. |
| C02 | Expansão inline, não camada | Livro/opinião dentro T03 | Tocar livro expande opinião no próprio perfil; tocar novamente recolhe. Não abre sheet, não cria rota/histórico. Botão com aria-expanded e relação ao conteúdo. |
| C03 | Sheet curta | Preferências | Cidade e idade/gênero literário do cenário. Aplicar ou cancelar. |
| C04 | Sheet curta | Editar apresentação | Nome fictício, idade, bio. Salvar ou cancelar. |
| C05 | Sheet curta | Escolha de intenção/relacionamento/interesse | Seleção temporária, Concluir ou Cancelar. |
| C06 | Sheet curta | Opções da pessoa/conversa | Bloquear, denunciar, desfazer match quando aplicável. Uma ação substitui a camada em vez de empilhar indefinidamente. |
| C07 | Sheet curta | Confirmar bloqueio/desfazer match | Consequência explícita, confirmar ou cancelar; cancelar volta às opções. |
| C08 | Sheet curta | Denúncia de teste | Motivo e bloquear opcional; informa que não é atendimento real. |
| C09 | Sheet curta | Como a foto aparece | Regra experimental, bilateralidade e caráter fictício. |
| C10 | Sheet curta | Sobre o teste | Explicação demo; simulação só para thread atual; estúdio/reinício fora do produto normal. |
| T09 | Apoio, fora das raízes | Estúdio — `#studio` | Referências/arquivos. Acessível por C10, retorno à tela de origem. |
| C11 | Sheet curta | Reiniciar teste | Confirma reset apenas da sessão fictícia. |

Estados vazio/erro/pausado são variantes da tela de origem, não novas telas que perdem contexto. Não criar tela de foto independente: liberação atualiza T06 e perfil daquela conexão conforme autorização, sem expor foto na descoberta de terceiros.

## 4. Matriz de transições

| Origem | Ação humana | Destino/resultado | Voltar/fechar | Estado preservado ou alterado |
|---|---|---|---|---|
| Qualquer raiz | Tocar Descobrir | T01 ou T02, último segmento escolhido | Histórico anterior quando pertinente | Livro, pessoa corrente e scroll do segmento |
| T01 | Selecionar Por perto | T02 | Selecionar Para você volta T01 | Nenhuma curtida; mantém card/livro T01 |
| T02 | Selecionar Para você | T01 | Segmento Por perto volta T02 | Quadro/scroll mantidos |
| T01 | Tap esquerda/direita ou segmento de livro | T01, outro livro da MESMA pessoa | Não cria nível no histórico | Só `bookIndex`; zero curtida/match |
| T01 | Tap nome/info/área identificada Perfil | T03 | Volta T01, mesmo perfil/livro | Origem `for-you`, ID, índice, scroll |
| T01 | Swipe direita OU Curtir | Próximo card; C01 se recíproco | Match fechar mantém decisão | Curtida da pessoa, não do livro |
| T01 | Swipe esquerda OU Passar | T01, próxima pessoa | Rewind existente pode desfazer último elegível | Pessoa passada, livro da próxima inicia em 1 |
| T01 | Swipe vertical ou drag cancelado | T01 | Não se aplica | Zero decisão e zero tap posterior |
| T01 | Rewind | T01, último perfil elegível | Não desfaz match existente | Restaura pessoa; feedback se impossível |
| T02 | Tocar tile de Ana | T03 Ana | Volta T02 no mesmo scroll | Nenhum interesse automático |
| T02 | Rolar quadro | T02 | Não se aplica | Zero decisão sobre pessoa |
| T03 de T02 | Tocar livro | C02 expandida dentro T03 | Recolher mantém T03; Voltar retorna T02 | Quadro T02 permanece guardado; nenhuma camada nova |
| T03 de T01 | Passar pessoa | T01, próxima pessoa | Histórico não reabre a pessoa passada por acidente | Pass só nesta pessoa |
| T03 de T02 | Passar pessoa | T02 com tile retirado no cenário | Volta não ressuscita tile | Quadro mantém scroll/posição aproximada |
| T03 de T04 | Curtir de volta | C01 | Continuar volta T04 | Match sai de recebidas e entra novos matches |
| T03 sem reciprocidade | Curtir | Fica T03 com “Curtida enviada” | Volta origem; não envia de novo | Botão desabilitado/estado idempotente |
| T03 com match | Abrir conversa | T06 mesma pessoa | Retorno da conversa é sempre T05; voltar do navegador conforme stack | Rascunho e histórico daquele par |
| T03 | Voltar header/navegador | Origem registrada T01/T02/T04/T06 | Um nível por ação | Sem excluir/curtir/revelar |
| T04 | Tocar curtida recebida ou enviada | T03 pessoa | Volta T04 mesma seção/scroll | Estado de interesse mantido |
| C01 | Conversar | T06 pessoa do match | T05 Conversas | Match mantido; origem anterior não some |
| C01 | Continuar ou fechar | Origem após decisão | Retorno natural da origem | Match em T05 sem mensagem |
| T05 | Tocar novo match/linha de conversa | T06 | Header volta T05 | Draft/scroll por pessoa |
| T06 | Tocar nome da pessoa | T03 | Volta T06, mesmo histórico/draft | Não reabrir T05 antes do chat |
| T06 | Enviar mensagem | T06 | Não cria histórico de navegação | Acrescenta uma mensagem, limpa draft, rola fim |
| T06 | Digitar e voltar T05 | T05 | Reabrir pessoa volta T06 | Draft e scroll guardados |
| T06 | Quero mostrar minha foto | T06, escolha privada registrada | Fechar/navegar não é consentir | Sem revelar até aceite válido dos dois |
| T06 | Mudei de ideia antes da revelação | T06, aceite local retirado | Sem navegação | Sem informar decisão ao parceiro |
| T06 | Dois aceites válidos | T06 atualiza retratos simulados | Não abre outro destino | Liberação bilateral; rede não promete mesmo milissegundo |
| T06/T03 | Segurança/opções | C06 | Volta à tela que abriu | Sem modificar conversa ao abrir |
| C06 | Bloquear/desfazer match | C07 | Cancelar volta C06 | Confirmar interrompe acesso e retorna origem segura T05 ou descoberta |
| C06 | Denunciar | C08 | Cancelar volta C06 | Salvar registra apenas teste; bloquear se escolhido |
| Qualquer raiz | Perfil na nav | T07 | Próxima raiz por nav | Não entra em edição automaticamente |
| T07 | Editar perfil | T08 | Concluir/voltar T07 | Dados salvos seguem política explícita |
| T08 | Nome/apresentação ou intenção | C04/C05 | Cancelar volta T08 sem aplicar rascunho | Salvar/Concluir aplica uma vez |
| T08 | Selecionar livro | T08 | Concluir T07 | Mesmas regras de 1–5 livros existentes |
| T01/T02/T07 | Preferências | C03 | Cancelar origem sem mudança | Aplicar atualiza cenário; filtros nunca ampliam silenciosamente |
| T07 | Pausar descoberta | T07, switch atualizado | Ir Descobrir mostra pausado | Conversas existentes continuam |
| Aviso de teste | Info | C10 | Fecha na mesma tela | Não apaga/navega conversa |
| C10 dentro T06 | Simular resposta/tempo/aceite | T06 | Não cria pessoa real | Escopo pessoa atual e texto explícito simulação |
| C10 | Referências e arquivos | T09 | Volta origem que abriu C10 | Não forçar Perfil como destino arbitrário |
| C10 | Reiniciar | C11 | Cancelar volta C10 | Confirmar reinicia só demo |

## 5. Contrato do retorno e do estado

O perfil de pessoa tem rota própria e um contexto de retorno explícito `{originRoute, discoverSegment, originPersonId, originThreadId, bookIndex, rootScroll, messagesScroll, focusKey}`. `discoverSegment` distingue Para você/Por perto; `originThreadId` identifica exatamente o par do chat de origem; `messagesScroll` mede o histórico `.messages`, não só o container raiz. Não extrair origem implicitamente da variável global `activePerson`. Deep link sem origem válida volta a Descobrir/Para você; chat sem match válido volta à inbox com aviso. Validar ID antes de renderizar. Nunca aceitar URL externa como returnTo.

Voltar tem precedência: camada curta→tela subjacente; tela pessoa→origem registrada; thread→inbox; editar→meu perfil; raiz→histórico do navegador sem aprisionar o usuário. X, Escape e back do navegador precisam consumir a mesma camada; nenhuma ação de retorno pode criar loop/empilhar nova entrada que reabra a tela recém-fechada. Snapshots de diálogo não substituem rota de pessoa. Não preservar rascunho como HTML inseguro; guardar texto.

Por perto e Para você usam as mesmas pessoas e decisões no domínio. Curtir no quadro/detalhe impede duplicar a curtida no card. Bloquear elimina pessoa dos dois segmentos, de curtidas e conversas permitidas. Passar aplica a regra existente global de descoberta no cenário; não ressuscitar no outro segmento. Retomar filtragem não desfaz bloqueio ou match.

## 6. O que significa Por perto nesta versão

Quadro de pessoas na cidade selecionada do **cenário fictício**, com capas em vez de rostos. Indicar “São Paulo · cenário de teste”, sem pedir GPS. Não mostrar coordenadas, pin da residência, distância inventada, estado online, trajetória ou cruzamento real. Se houver composição semelhante a mapa, chamá-la de ilustração do cenário e oferecer lista equivalente; preferir quadro para não sugerir rastreamento.

Happn fornece a referência de descoberta contextual/local e agrupamento; a documentação oficial não prova que seu mapa seja uma simples grade de pessoas. Nesta V4, nenhuma permissão de localização, matching por distância, feed social ou catálogo de locais será acrescentado.

## 7. Jornadas humanas de aceite

1. **“Quero olhar quem tem na região sem decidir ainda.”** Descobrir→Por perto→Ana→expandir livro→recolher→voltar quadro. Mesmo scroll; nenhuma curtida; foto oculta.
2. **“Gostei dela e quero conversar.”** Depois da jornada 1, reabrir Ana tocando seu tile no quadro→Curtir no perfil→match→Conversar→mensagem. Não existe botão adicional escondido de curtir no tile. Match refere-se à pessoa; uma decisão, uma thread, nenhum sheet de perfil reaparece.
3. **“Só quero conhecer os livros antes.”** Para você→tap lateral duas vezes→perfil→voltar. Mesma pessoa/livro; zero match disparado por tap.
4. **“Não me interessei.”** Card→perfil→Passar. Próximo card; vertical scroll no perfil não passa nem curte.
5. **“Quero lembrar quem é enquanto respondo.”** Inbox→thread→digitar→perfil do outro→voltar. Mesmo texto no composer e ponto do histórico; nenhum reset.
6. **“Não quero revelar agora.”** Thread elegível→aceitar→mudar de ideia. Sem liberação unilateral; conversar continua possível.
7. **“Quero encerrar contato.”** Perfil/thread→opções→bloquear→confirmar. Pessoa desaparece dos dois modos; retorno seguro, sem erro de rota; denúncia continua disponível segundo política.
8. **“Quero mudar minha apresentação.”** Perfil→Editar→bio→cancelar→Concluir. Bio anterior mantida; próprio perfil alcançável em um toque de qualquer raiz.

Critério de sucesso inicial: adulto entende diferença entre livro/pessoa e toque/curtida sem explicação do moderador; completa as jornadas sem perda de rascunho, consentimento involuntário ou retorno errado. Não atribuir porcentagem de aprovação antes de testar com pessoas. Botões equivalem a gestos; alvos internos44px; foco/ordem/labels/contraste WCAG continuam obrigatórios. Sem navegador/dispositivo, este documento é contrato, não teste executado.

## 8. Fontes primárias consultadas

- Tinder, site: https://tinder.com/
- Tinder, FAQ: https://tinder.com/faq/
- Tinder, Explore: https://www.help.tinder.com/hc/en-us/articles/38094560737677-Explore
- Tinder, Discovery Settings: https://www.help.tinder.com/hc/en-us/articles/115003340963-Discovery-Settings
- Happn, What is the happn Map? (página consultada exibiu atualização 15/10/2026): https://support.happn.fr/hc/en-us/articles/15703631805853-What-is-the-happn-Map
- Happn, Privacy Policy: https://support.happn.fr/hc/en-us/p/privacy
- Happn, Trust charter: https://www.happn.com/legal/trust-charter
- HappnDesign, referência visual histórica Main screens (data/produção atual não confirmadas): https://dribbble.com/shots/21734525-New-Happn-App-Main-screens

## 9. Estado da revisão

Mapa inicial concluído antes de orientar arquitetura. Agente de referências confirmou inspeção de screenshots oficiais Happn: abas Home/Vibes/Map/Likes/Chat, mapa com clusters e pílulas de lugares; a grade de pessoas em Por perto continua explicitamente adaptação nossa. Arquitetura consultou detalhe do livro e a decisão foi expansão inline no perfil, eliminando terceira camada. QA revisou o contrato antes da implementação e aprovou com três ajustes incorporados: C02 inteiramente inline, reabrir Ana no quadro antes de curtir e contexto de retorno com segmento/thread/scroll explícitos. Aguarda evidência complementar de produto/Tinder. Nenhum arquivo de frontend alterado por este revisor. Implementação e validação real serão registradas em adendo, sem confundir este plano com produto pronto.

## 10. Revisão da implementação V4 — caminhos confirmados na fonte

Releitura independente de `dist/app.mjs`, `dist/style.css` e `dist/index.html` após implementação. Nenhum frontend foi alterado pelo revisor. **Não houve inspeção visual ou teste em dispositivo nesta etapa.** O layout foi rejeitado anteriormente pelo usuário: contagem de testes não demonstra que a nova proposta agrada, orienta bem ou atende à expectativa visual.

| Caminho do mapa | Evidência real da implementação | Resultado da leitura |
|---|---|---|
| Descobrir → Para você/Por perto | `discover()` usa controles com `data-mode`, `aria-pressed`; `discovery-mode` chama `navigate` com modo; `hashFor` gera `#discover/for-you` e `#discover/nearby`. | Implementado na fonte. |
| Por perto → pessoa sem curtir | `nearby()` gera tile-button `data-action=person`; texto diz que não envia curtida; não há coração com ação escondida no tile. | Implementado na fonte. |
| Card → trocar livro ou abrir pessoa | `book-index`/tap de `.card-media` alteram índice; nome/info acionam `person`. Gestos mantêm discriminação de eixo. | Implementado; ergonomia real ainda não medida. |
| Pessoa em tela própria | `showPerson()` chama `navigate('people',id)`; `parseHash/hashFor` validam e geram `#people/id`; `header()` oferece voltar/opções e oculta nav raiz. | Perfil deixou de ser sheet longo. |
| Pessoa → livro inline | `people()` gera accordion com botão `aria-expanded`; ação `book` alterna `expandedBook` e preserva scroll do main. | Implementado sem rota/camada extra. |
| Pessoa → curtir/passar/chat | `peopleActions()` distingue match ativo, curtida já enviada e decisões; `decide` evita reenviar curtida; passar/match retorna origem; like não recíproco mantém perfil com confirmação. | Implementado na fonte. |
| Curtidas → pessoa | Recebidas e enviadas são botões com `data-action=person`. | Ambas abrem a mesma tela de pessoa. |
| Inbox → thread → pessoa → voltar | `open-chat` tem parent inbox explícito; nome no chat abre pessoa; `captureContext` inclui route/mode, índice, rootScroll, messagesScroll; `restoreOrigin` restaura esses estados; draft permanece por pessoa. | Caminho expresso no código; testes QA complementam comportamento, sem validação visual. |
| Quatro raízes | `go(view)` passa person=null; Conversas da nav chega a inbox, sem restaurar thread invisível. | Implementado; Descobrir guarda modo global. |
| Meu perfil → edição → meu perfil | `edit-mode` navega `#profile/edit`; `preview-mode` usa `restoreOrigin`. | Edição é nível próprio com header voltar/concluir. |
| Segurança sem destruir conversa ao abrir | Opções e confirmação são camadas curtas; bloquear/desfazer são ações explícitas; confirmar retorna inbox. | Implementado; há duas camadas curtas limitadas em confirmação, não perfil infinito. |
| Demo/estúdio fora do fluxo | Ferramentas da simulação ficam no menu de teste; atlas de pesquisa em `pesquisa.html` é material externo ao fluxo principal. | Não confundir atlas com tela funcional do aplicativo. |

### Pendências e diferenças do contrato

- Encaminhado à arquitetura: ao fechar accordion, `aria-controls` inicialmente apontava para painel ausente no DOM; manter painel estável com `hidden` resolve a associação. Confirmação final será registrada após releitura.
- Contexto captura `focusKey`, mas o retorno inicial usa `render(true)` e foca o main. Solicitei restaurar tile/info/controle de origem quando válido; é refinamento de navegação assistiva ainda pendente neste snapshot.
- A tela pessoa exibe “Foto oculta” sempre; retratos liberados só aparecem dentro da thread. Portanto o trecho do plano que permitia refletir foto autorizada no perfil não foi implementado. Nesta demo, considerar a revelação limitada ao chat; não prometer propagação para perfil/descoberta.
- O plano falava em substituir C06 por C07/C08; implementação mantém no máximo uma confirmação/formulário sobre opções, permitindo cancelar de volta às opções. É camada curta limitada, aceita nesta revisão; o perfil principal continua tela de rota própria.
- Leituras de DOM, navegação e testes automatizados não verificam alcance do polegar, compreensão de “Por perto”, teclado móvel, anúncios de leitor de tela, safe area e aparência do card. Esses itens exigem uso real. QA informou 60 testes aprovados e três jornadas; esta revisão não executou nem usa a contagem como indicador de qualidade da UX.

### Evidência complementar Tinder recebida

Agente de produto concluiu `TINDER-V4.md`, distinguindo screenshots históricos do usuário, capturas funcionais e áreas só documentadas. Perfil próprio difere do editor; perfil alheio pode expandir/recolher mantendo decisões; inbox vazia é raiz distinta de thread. Não houve observação confiável de thread pessoal recente. As quatro raízes e o comportamento Trelelê continuam decisões próprias apoiadas por referências, não alegação de equivalência ao Tinder atual.

## Fechamento dos dois ajustes assistivos

Na fonte final V4, painéis de opinião permanecem no DOM com ID e hidden quando recolhidos; a restauração de origem procura o disparador válido, sem agendamento que retire o foco do input de chat. O autor do frontend executou verificação auxiliar em DOM emulado para esses casos. Permanecem pendentes validação visual, uso com leitor de tela e testes em aparelhos.
