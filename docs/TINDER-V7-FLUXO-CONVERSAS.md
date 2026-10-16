# Tinder → Trelelê: match, caixa e conversa

Pesquisa de fontes públicas realizada em 16/10/2026. Escopo desta revisão: estrutura do fluxo e hierarquia, preservando a paleta brasileira do Trelelê. Não houve acesso ao código privado, sessão autenticada ou medição do app Tinder instalado.

## Mapa de fontes e força da evidência

| Fonte / arquivo | O que foi efetivamente visto ou lido | Limite |
| --- | --- | --- |
| [Tinder Newsroom — App Images](https://www.tinderpressroom.com/app-images), item Chat, [download oficial](https://www.tinderpressroom.com/download/Chat.png); cópia `docs/research/tinder-v7/official-chat.png` | Chat individual escuro, voltar à esquerda, pessoa e nome no centro, menu de três pontos à direita; bolhas recebidas/enviadas, data de match, compositor e enviar no fundo; sem abas principais nessa tela. O bitmap foi visto nesta pesquisa. | Imagem oficial de divulgação disponível na data de consulta, não prova execução atual em todos os países/aparelhos. A data de match escrita na imagem não estabelece data de captura. Cabeçalho com foto não autoriza revelar fotos no Trelelê. |
| [Tinder Newsroom — App Images](https://www.tinderpressroom.com/app-images), item It's a Match Default, [download oficial](https://www.tinderpressroom.com/download/IAM-Default.png) | Há asset oficial dedicado ao evento de match. | Não deduzir funcionamento de cada botão de uma lista de assets. |
| [Messaging a Match](https://www.help.tinder.com/hc/en-us/articles/115003341583-Messaging-a-Match) | Ajuda consultada confirma que a conversa com uma pessoa começa depois do match. | Artigo informa atualização de 28/10/2019; é documentação disponível hoje, não levantamento de toda exceção comercial. Não especifica o layout da caixa. |
| [Unmatching someone](https://www.help.tinder.com/hc/en-us/articles/115003360106-Unmatching-someone) | Passos: abrir conversa, menu de três pontos superior direito, desfazer match. O artigo diz que a remoção é permanente e retira ambos das listas de match. | Regiões podem oferecer bloqueio junto do unmatch. Não prometer reversibilidade no Trelelê. |
| [Reporting profiles and content](https://www.help.tinder.com/hc/en-us/articles/115003822043-Reporting-profiles-and-content) | Instrução de denúncia também aponta para o menu de três pontos do chat. | Procedimento documentado; não é screenshot do menu em execução. |
| `docs/research/tinder/user-inbox.jpg`, referência enviada pelo usuário | Faixa “New matches” acima de lista vertical “Messages”; cada conversa tem imagem, nome e trecho. | Captura histórica de versão indeterminada. É evidência direta do padrão solicitado pelo usuário, não comprovação da versão 2026. |
| `docs/research/tinder/user-match.jpg`, referência enviada pelo usuário | Evento de match e escolhas de enviar mensagem ou continuar descobrindo. | Histórico/versão indeterminada. |
| `docs/research/tinder/uiland-inbox.png` e `uiland-chat.png`, [Uiland](https://uiland.design/screens/tinder/screens/9da5e5db-2ced-4fcd-a430-80087e6e5630/flows/all) | Duas telas com **overlays de orientações de segurança**, com “New matches” visível atrás. | Estes arquivos NÃO são screenshot de conversa aberta. Não usá-los como comprovação de compositor ou cabeçalho do chat. Outras capturas exigiam login e não foram acessadas. |
| `docs/research/tinder/chat-safety-center.png`, [Revyl Atlas](https://revyl.com/atlas/tinder/) | Sheet de segurança sobre caixa com mensagem Team Tinder; referência independente. | Atlas tem caixa vazia/de sistema, não thread interpessoal aberta. Data/versão não informadas; contagem global de telas do Atlas não equivale a nossa cobertura. |

A busca dirigida não encontrou um novo asset oficial da **caixa com faixa de novos matches e lista preenchida**. Para esse padrão, a evidência visual aqui permanece a referência histórica do usuário. O chat individual já dispõe de fonte visual oficial. Isso deve ficar explícito em qualquer apresentação.

## Fluxo compacto a implementar no Trelelê

1. **Descobrir → curtir:** registra uma intenção unilateral. Sem caixa nova, conversa ou celebração de match se a outra pessoa não curtiu.
2. **Reciprocidade → evento de match:** duas escolhas imediatas, “Conversar” e “Continuar”. Representações por livro/inicial protegida, jamais retrato revelado.
3. **Conversas, destino raiz:** título da caixa; faixa “Novos matches” apenas com matches sem mensagens; abaixo, lista “Mensagens” apenas com conversas iniciadas. Cada linha mostra nome, trecho, horário e indicador real de não lido. Sem fingir presença online.
4. **Toque num novo match ou linha → conversa individual:** ocupa a tela de conteúdo; voltar à esquerda, identidade tocável no centro, menu à direita. As abas globais desaparecem. Conteúdo e compositor se ajustam ao teclado. A identidade abre perfil e volta ao mesmo chat.
5. **Enviar primeira mensagem:** o match sai da faixa de novos e entra na lista, sem duplicação. Reabrir a tela não cria mensagens novas nem reenfileira notificações.
6. **Menu → segurança / encerrar:** ações reais e distintas; cancelar preserva o chat. Desfazer match ou bloquear impede reabrir o conteúdo pela rota antiga. Um protótipo local não deve dizer que uma denúncia foi enviada a moderadores.

São decisões de produto do Trelelê apoiadas pelos padrões vistos; não uma alegação de clonagem integral do Tinder.

## Correções de escopo e apresentação

- **Remover histórico de curtidas enviadas**, conforme orientação do usuário. Não reintroduzir com outro rótulo. Isso não implica alegar que o Tinder nunca tem esse recurso: níveis pagos e versões variam.
- “Curtidas” se permanecer no Trelelê significa **recebidas**, com descrição coerente; não misturar unilateralidade com match. A caixa Conversas organiza reciprocidade.
- Sem abas globais na conversa individual, no editor, na busca de livros ou na confirmação de match. Elas ficam nos destinos raiz. Voltar não pode parecer uma quinta aba.
- A onda brasileira pertence ao cartão de descoberta e à identidade da marca; não precisa ocupar o meio de todas as mensagens. A conversa exige espaço legível, não um hero repetido.
- No cabeçalho da conversa usar a mesma capa ou inicial reconhecível da caixa enquanto a foto está protegida. Uma foto borrada não deve ser um arquivo original entregue ao dispositivo antes do consentimento.
- A restrição de foto do Trelelê prevalece sobre a referência Tinder: passagem do tempo e conversa apenas tornam a revelação elegível; ambos consentem e podem revogar. Não misturar “deu match” com “liberou a foto”.

## Aceite funcional focado

Sem reciprocidade não há thread. Novo match sem mensagem aparece somente na faixa. Depois da primeira mensagem aparece somente na lista. Voltar conserva rascunho e posição. Abrir perfil e voltar conserva o chat. Menu cancela sem modificar estado. Bloqueio/unmatch fecha a rota e não pode ser contornado por histórico. Não existe lista de curtidas enviadas. Abas globais ficam ocultas durante o chat. A foto continua protegida em caixa, faixa, cabeçalho e perfil até a regra de consentimento autorizar.
