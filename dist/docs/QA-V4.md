# Trelelê V4 — revisão de jornadas e retorno

Estado: mapa criticado antes da implementação e três jornadas executadas após conclusão. Resultado e limites ao fim do documento. O resultado anterior de testes não aprova a clareza das novas jornadas.

## Como esta revisão avalia o produto

A pessoa deve saber onde está, por que abriu aquela tela, o que a ação fez e para onde volta. Cada passagem precisa funcionar com toque nos controles, alternativa de teclado e Voltar do histórico. Os testes serão derivados dessas tarefas e dos erros concretos encontrados, sem conservar a interface anterior para satisfazer seletores.

Método técnico: revisão dos mapas, código real e testes de eventos no DOM emulado após implementação. Sem servidor, navegador, renderização visual ou teste em dispositivo nesta revisão. Não é possível afirmar conforto de toque, legibilidade renderizada, sensação de swipe ou qualidade de mapa com base em happy-dom.

## Jornada 1 — encontrar alguém no quadro Por Perto

Pessoa: quer olhar os leitores disponíveis na região e iniciar uma conversa com quem despertou interesse.

| Origem | Ação da pessoa | Resultado necessário | Ao voltar | Estado que precisa sobreviver |
|---|---|---|---|---|
| Por Perto | Abrir uma pessoa | Perfil completo da pessoa tocada, sem mudar sua região ou filtros | Fecha o perfil e retorna ao mesmo quadro | Scroll, filtros e pessoa de origem |
| Perfil aberto do quadro | Abrir um livro | Livro e opinião da pessoa sobre aquela obra | Retorna ao mesmo perfil | Pessoa e posição de leitura |
| Livro → perfil | Voltar novamente ao quadro | A pessoa reencontra o item no mesmo contexto | Voltar do sistema não deve sair do app antes de fechar a camada aberta | Sem mudanças de curtida, match ou foto |
| Quadro ou perfil, conforme CTA definido no mapa | Curtir | Mostra interesse enviado; se já houver reciprocidade, mostra match | Fechar o match retorna ao contexto de origem sem reabrir camadas antigas | Exatamente uma curtida e um match |
| Match | Abrir conversa | Thread da pessoa que acabou de dar match | Retorna à caixa de conversas; nunca ao perfil de outra pessoa | Mensagens, rascunho e consentimentos |

Crítica a resolver com UX: o caminho livro → quadro deve indicar se exige dois retornos ou um botão explícito para fechar tudo. Um X sem semântica clara não pode alternar entre voltar um nível e encerrar todos. O quadro não deve afirmar cruzamento físico real ou distância verdadeira sem fonte. Listagem regional fictícia não equivale ao rastreamento do Happn.

Regra de foto: capas ou avatar literário permanecem em quadro, perfil e match. O match abre a conversa, sem autorizar rosto. A revelação continua condicionada ao tempo/turnos experimentais e aos dois consentimentos atuais.

## Jornada 2 — explorar por cards e passar alguém pelo perfil completo

Pessoa: quer usar swipe, mas conferir detalhes antes de decidir.

| Origem | Ação da pessoa | Resultado necessário | Ao voltar | Estado que precisa sobreviver |
|---|---|---|---|---|
| Descobrir por cards | Trocar livro por toque | Muda apenas livro/opinião da pessoa atual | Ainda a mesma pessoa | Índice do livro atual |
| Card | Abrir perfil completo | Mesma pessoa, com CTA de decisão coerente | Retorna ao mesmo card e livro, sem decidir interesse | Pessoa, livro, filtros |
| Perfil aberto do card | Passar | Perfil fecha e próximo candidato elegível aparece uma vez | Voltar do histórico não ressuscita perfil descartado; desfazer tem ação própria | Decisão de passar e fila sem saltos |
| Próximo card | Arrastar verticalmente ou cancelar gesto | Não curte, passa nem troca pessoa | Estado neutro | Identidade do card |
| Próximo card | Swipe horizontal válido | Uma única decisão e avanço coerente | Desfazer não encerra match já criado silenciosamente | Histórico de decisão separado do histórico de navegação |

Crítica a resolver com UX: o perfil completo precisa oferecer passar e curtir se a pessoa pode chegar para decidir. Esconder passar apenas no card força caminho desnecessário. O botão Voltar e o botão Desfazer cumprem intenções diferentes; não podem desfazer curtida ou recusa como efeito de fechar uma tela.

Regra de foto: abrir detalhes não deve contornar ocultação. Mesmo uma pessoa anteriormente revelada precisa revalidar autorização vigente antes de mostrar retrato em qualquer nova superfície.

## Jornada 3 — alternar conversa, perfil e livro sem perder contexto

Pessoa: está lendo uma conversa, escreve um rascunho e abre o perfil para lembrar os livros.

| Origem | Ação da pessoa | Resultado necessário | Ao voltar | Estado que precisa sobreviver |
|---|---|---|---|---|
| Caixa de conversas | Abrir uma thread | Pessoa correta, conversa dedicada com volta explícita | Caixa, sem escolher outra thread automaticamente | Posição da lista |
| Thread | Ler mensagens acima e escrever sem enviar | Rascunho fica associado à pessoa; leitura permanece onde foi deixada | Não envia nem apaga texto | Scroll de mensagens e rascunho |
| Thread | Abrir perfil da pessoa | Perfil da mesma conexão, com ações coerentes de conversa/segurança | Thread original no mesmo ponto | Scroll, rascunho, fotos autorizadas |
| Perfil dentro da thread | Abrir livro e voltar | Retorna ao perfil; outro retorno leva à thread | Um nível por retorno | Sem recriar match nem consentimento |
| Thread | Voltar à inbox e reabrir | Retoma leitura e rascunho | Inbox preserva lista | Não rola ao fim só por reabrir |
| Thread | Enviar ou simular nova mensagem | Adiciona uma mensagem; envio bem-sucedido limpa rascunho | Pode rolar ao fim conforme política explícita | Não duplica mensagem |
| Perfil/thread | Bloquear ou encerrar | Interrompe acesso e vai para destino seguro | Histórico antigo não reabre conexão; denúncia continua acessível | Bloqueio/unmatch prevalecem |

Crítica a resolver com UX: o perfil aberto da conversa deve oferecer “Voltar à conversa”, evitando aparentar que abre uma nova conexão. A mesma pessoa não deve surgir em novos matches e mensagens ao mesmo tempo. Ocultar a navegação global no thread é aceitável somente com retorno visível à inbox.

Regra de foto: retirar o aceite antes do outro aceitar deve continuar disponível. Voltar não renova consentimento; bloqueio, encerramento ou troca de versão precisam invalidar exibição futura.

## Contratos mínimos de aceitação

- Origem de perfil explícita: quadro, card ou thread. Voltar usa a origem real e preserva contexto; não depende de um destino global único.
- Histórico de camadas efetivo: abrir adiciona entrada; `history.back()` fecha a camada antes de sair da rota. Nenhum push artificial dentro do retorno.
- Ações de decisão encerram camadas de forma definitiva. Voltar posterior não ressuscita o perfil pai ou match encerrado.
- Descobrir e Por Perto têm propósitos e entradas claras; não são duas telas idênticas com nomes diferentes.
- Escolher livro não curte pessoa, passar não pula candidato seguinte, swipe não confunde scroll, um gesto não decide duas pessoas.
- Textos explicam consequência concreta, sem metáforas que substituam nomes de ações.
- Novas superfícies seguem as mesmas autorizações de foto, bloqueio e conexão.

## Resultado da crítica do mapa

Pendente do mapa final de UX e das referências pesquisadas pelo time. Nenhuma implementação V4 foi aprovada até aqui.

### Crítica do mapa antes da implementação

Lido `FLUXOS-V4.md`, incluindo fontes oficiais pesquisadas pelo time. Parecer: a mudança para pessoa em rota própria `#people/{id}` e livro como expansão inline reduz camadas e torna o destino de Voltar mais previsível. Quatro raízes estáveis e origem explícita são apropriadas para as tarefas descritas. A pesquisa externa sustenta padrões de navegação; não valida clareza do Trelelê com usuários.

Ajustes enviados a UX/arquitetura antes de escrever frontend:

1. O inventário C02 e algumas linhas ainda descreviam livro como sheet. Alinhar com a decisão final: expansão/recolhimento inline, sem terceiro nível de histórico.
2. Se o tile do quadro só abre pessoa, explicitar a sequência de reabrir Ana antes de curtir após voltar ao quadro. Não acrescentar CTA concorrente no tile apenas para abreviar o roteiro.
3. `originContext` deve representar rota/segmento, pessoa de origem da thread, índice de livro e scroll do elemento correto. `activePerson` global não serve como origem implícita.
4. Perfil aberto do card precisa oferecer Passar/Curtir; do chat precisa voltar ao mesmo chat. Navegação inferior leva à raiz, sem abrir thread antiga automaticamente.

Contratos V4 aceitos para a revisão posterior: livro não abre diálogo; recolher mantém a pessoa; Voltar da pessoa usa origem; decisão encerra perfil sem ressuscitá-lo via histórico; thread mantém rascunho e leitura. As tabelas iniciais deste documento descrevem intenções humanas; o destino “livro” passa a ser estado inline da pessoa, e não outra tela/camada.

## Resultado executado após a implementação V4

O autor do frontend avisou a conclusão antes da execução. A revisão percorreu as três tarefas completas no DOM emulado, usando o aplicativo e seus módulos reais. Não foi uma revisão limitada a contar testes.

| Jornada executada | Evidência observada | Resultado |
|---|---|---|
| Olhar Por perto, conhecer Ana e conversar | Abri quadro, marquei scroll 125, entrei na rota de Ana, expandi e recolhi opinião inline, voltei pelo controle de retorno e reencontrei quadro no scroll 125 com Ana ainda disponível. Reabri Ana, curti, abri o match e conversei com Ana. Envio levou sua thread à lista de mensagens. Nenhum retrato apareceu. | Caminho completo funcionou no DOM emulado |
| Ler antes de passar | Escolhi o terceiro livro do card de Ana, abri a pessoa e voltei: ainda Ana e livro 3. Abri novamente, passei e vi Davi com livro 1. Executei `history.back()` real do histórico emulado; Ana não ressuscitou como tela de detalhe. | Caminho completo funcionou no DOM emulado |
| Consultar pessoa durante uma resposta | Abri Lia pela inbox, marquei leitura em scroll 90 e escrevi rascunho. Abri pessoa e opinião inline, recolhi e voltei à conversa. A rota voltou a Lia, scroll 90 e texto estavam preservados. Inbox e reabertura mantiveram os mesmos valores. | Caminho completo funcionou no DOM emulado |

### Navegação, estado e autorização

Pessoa é uma rota `#people/{id}`, sem diálogo de perfil. Expandir livro não cria camada de histórico. O retorno usa contexto de origem, preservando segmento de descoberta, pessoa, livro e posição. O teste de `history.back()` verifica travessia produzida pelo histórico emulado, sem fabricar `popstate` nesses casos. Sheets curtos de apoio continuam com entrada real, e três ciclos de abrir/fechar não produziram entradas fantasmas no teste.

O caso anterior que usava “Como funciona” na descoberta foi adaptado para abrir a sheet “Modo demonstração”, pois a descoberta V4 não tem mais aquele controle. O comportamento preservado é a abertura/fechamento com histórico; não se exigiu manter uma ação removida da interface. Testes de perfil em diálogo foram substituídos pelas rotas/expansões inline deliberadamente definidas no mapa antes da implementação.

Regressões preservadas e aprovadas: gesto único, tap versus swipe, cancelamento/scroll/perda de captura, desfazer sem apagar match, edição e escolhas temporárias, rascunhos, escape de texto, foto somente após elegibilidade e dois aceites, retirada unilateral antes da revelação, nova versão invalidando aceites, bloqueio e denúncia depois de encerrar. Rotas de conexão encerrada continuam sem reabrir thread.

### Registro técnico

`npm test`: 60 casos passaram, zero falhas, ignorados, cancelados ou pendentes. Composição: 17 domínio, 7 classificador, 32 DOM (incluindo as três jornadas), 2 copy e 2 integridade. `npm run check`: sintaxe válida dos cinco módulos (incluindo pesquisa.mjs). Houve somente aviso npm de configuração de ambiente `http-proxy`, sem falha de execução.

Esses resultados confirmam transições e estado no escopo testado. Não confirmam que uma pessoa sem orientação entende o app, nem que o tamanho, disposição ou gesto estão confortáveis no telefone. Não houve servidor, navegador, screenshot, renderização visual, leitor de tela ou dispositivo real nesta revisão.

**Parecer:** as três jornadas especificadas ficaram coerentes e executáveis no DOM emulado; não há bloqueador técnico aberto identificado nesses roteiros. A clareza e a sensação de uso ainda precisam ser observadas com pessoas em aparelho real, especialmente distinção pessoa/livro, quadro/card e retorno do perfil. Não usar a contagem de testes como prova de aprovação de UX ou de produto pronto para usuários reais.

### Fechamento de acessibilidade por código

O autor do frontend corrigiu os dois pontos encaminhados pela revisão UX: os painéis de opinião mantêm IDs estáveis quando recolhidos e o retorno procura o disparador válido da origem. Verificações auxiliares em DOM emulado confirmaram associação fechada, foco no tile de Ana e manutenção de foco/seleção de texto no input de chat. Sem certificação visual ou de leitor de tela.
