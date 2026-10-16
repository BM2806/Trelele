# Dinâmica mobile — referências Tinder e adaptação Margem

Pesquisa e inspeção visual: 16/10/2026. Escopo: dinâmica de namoro mobile. Apenas este documento foi alterado nesta tarefa; nenhum código ou perfil real foi manipulado.

## Decisão

O aplicativo deve parecer e funcionar como um app de namoro: um perfil por vez, imagem dominante, gesto de passar/curtir, botões acessíveis, match, conversas e edição pessoal. A capa do livro ocupa o lugar visual inicial da foto; a entidade curtida é sempre a pessoa. Foto pessoal só aparece depois da regra de conversa e consentimento mútuo. Não transformar descoberta em catálogo, revista, landing page ou painel de estatísticas.

## O que as cinco imagens mostram

As referências fornecidas são recortes de resultados/imagens com versões distintas do Tinder, algumas claramente antigas. Elas são evidência visual dos padrões desejados pelo usuário, não prova de que toda instalação atual tem a mesma interface. Não identifiquei nem investiguei as pessoas retratadas.

| Arquivo fornecido | Observação direta | Dinâmica a preservar no Margem |
| --- | --- | --- |
| IMG_1490.jpeg | Card quase inteiro ocupado por foto; nome/idade na parte inferior; ações circulares abaixo. Diagrama à direita marca toque nas laterais para foto anterior/próxima e área inferior para abrir perfil. | Card grande com capa/identidade literária; toque lateral troca livro sem votar; área de informações abre perfil. Passar e curtir ficam separados dessas regiões. |
| IMG_1491.jpeg | Descoberta com card grande, tela de picks em grade e perfil expandido com imagem acima e informações abaixo. | Priorizar card individual como início. Abrir detalhes em camada/tela com retorno ao mesmo card. A grade de picks não é requisito de MVP e não substitui descoberta. |
| IMG_1492.jpeg | Mensagens têm faixa horizontal “New Matches” acima de lista vertical; cada conversa mostra avatar, nome e trecho. Ao lado há perfil expandido. | Faixa “Novos matches”, rolável, com capa/iniciais enquanto foto protegida. Lista de conversas com última mensagem, horário e não lidas. Tocar em qualquer item abre a mesma conversa, não uma página de livro. |
| IMG_1493.jpeg | Overlay de match com duas imagens e escolhas de enviar mensagem ou continuar deslizando. | Overlay breve celebrando reciprocidade, duas capas, nome da pessoa e CTA “Mandar mensagem”; alternativa “Continuar descobrindo”. Foto permanece protegida. |
| IMG_1494.jpeg | Descoberta com card, ações e navegação inferior. Edição distingue intenção e tipo de relacionamento; painel inferior apresenta opções em chips, fechar e concluir. | Navegação inferior persistente fora do chat. Editar intenção e tipo de relacionamento em painéis curtos; seleção explícita e botão “Concluir”. Não esconder intenção atrás do perfil completo. |

## Confirmação por fontes oficiais externas

| Mecanismo | O que foi confirmado oficialmente | Limite da evidência |
| --- | --- | --- |
| Toque em imagens e abertura de perfil | Release de 18/07/2017 explica bordas para foto seguinte/anterior e parte inferior do card para perfil completo [F1]. | É documentação histórica, alinhada à IMG_1490. Não afirmar que toda versão de 2026 mantém exatamente as mesmas zonas. |
| Curtir e match bilateral | Ajuda atualizada em 01/09/2026 explica deslizar à direita para curtir e reciprocidade para match [F2]. | Não revela limiar de gesto, duração da animação ou ranking. Deslizar à esquerda/botão X como passar é evidenciado visualmente; parâmetros de gesto serão decisão nossa. |
| Conversa depois do match | Ajuda oficial diz que o match precede o chat [F3]. | Não descreve a faixa exata de novos matches nem o overlay. Esses layouts vêm das imagens; implementá-los é decisão de design. |
| Editar informações pessoais | Ajuda explica perfil → lápis/editar informações, incluindo fotos, bio, interesses, intenção, idiomas e outros campos [F4]. | Campos variam por região. A fonte não determina o formato bottom sheet; esse formato vem da IMG_1494. |
| Intenção e tipo de relacionamento | Release de março de 2023 distingue Relationship Goals de Relationship Types e descreve selecionar uma opção e concluir [F5]. | As opções e disponibilidade do lançamento não garantem o estado de todos os mercados hoje. Não usar pesquisas promocionais do release como validação da demanda do Margem. |
| Encerrar conexão | Ajuda descreve abrir chat → menu → desfazer match, remoção recíproca da lista e irreversibilidade; bloqueio pode variar por região [F6]. | Não inferir exclusão física imediata de mensagens ou evidências. Margem precisa manter denúncia disponível conforme sua política. |

As páginas consultadas não confirmam a geometria atual do overlay, da faixa de matches ou dos painéis. Não apresentar decisões próprias como engenharia reversa do código do Tinder.

## Especificação de interação para o app literário

### Descoberta: pessoa primeiro, capa em destaque

- Uma única pessoa domina a tela. A capa é parte do perfil dela; título/autor são legíveis, mas nome e idade identificam a pessoa que será curtida.
- Faixa segmentada no topo indica os livros do perfil. Tocar no lado direito avança livro; lado esquerdo volta. Esse toque não curte nem passa.
- Toque na área de nome/resumo ou botão “Ver perfil” abre detalhes. Evitar que um toque acidental na capa inteira esconda navegação de livros.
- Arrastar horizontalmente o card fornece feedback de “CURTIR” ou “PASSAR”; abaixo do limiar, o card volta. O limiar exato é parâmetro de implementação e precisa de teste mobile.
- Botões X e coração executam a mesma ação dos gestos e têm rótulos acessíveis “Passar perfil” e “Curtir [nome]”. Não depender de cor ou gesto como único controle.
- Distinguir arrasto horizontal de rolagem vertical; a área de detalhes permite ler sem votar por acidente. Não trocar perfil ao tocar na barra inferior.
- Depois de curtir, mostrar match apenas se existir curtida recíproca. Na demonstração, dados e reciprocidade simulados precisam ser identificados; no produto real, não fabricar matches.
- Estado vazio mostra que acabaram as opções, com acesso a filtros. Não criar repetição infinita de pessoas passadas para parecer ter mais usuários.

### Perfil expandido

Imagem/livro grande, nome/idade, intenção, tipo de relacionamento e distância aproximada; bio, livros e respostas na sequência. “Curtir” e “Passar” continuam disponíveis. Fechar devolve ao mesmo perfil e índice de livro, sem registrar voto. Menu contém bloquear/denunciar. Foto protegida não é baixada e borrada localmente.

### Match

Overlay dedicado e inequívoco: “Deu match com [nome]”, duas capas e uma frase de afinidade baseada em dado real do perfil. CTA principal abre a conversa existente; secundário fecha e segue descoberta. Não abrir conversa duplicada se usuário tocar duas vezes. Não mostrar a foto na celebração nem sugerir que já houve aceite de revelação.

### Conversas

Topo com faixa horizontal de matches ainda sem conversa; abaixo, lista de conversas. Iniciou conversa, o par sai da faixa de novos e aparece na lista. Não duplicar o mesmo par nos dois lugares sem motivo explícito.

Avatares usam capa/iniciais enquanto foto está protegida. Após revelação autorizada, podem usar a foto. Nome e mensagem, não livro e autor, são a hierarquia da lista. Conversa abre com cabeçalho da pessoa, acesso ao perfil, mensagens e campo de texto ancorado. Não substituir chat por cards editoriais. Voltar restaura posição da lista.

Revelação é um recurso contextual dentro do chat: hipótese central de **cinco turnos alternados de cada pessoa e 24 horas desde a primeira resposta bilateral**, seguida de aceite privado de ambos. Turno é uma participação do lado corrente; mensagens consecutivas do mesmo lado não viram múltiplos turnos. Os valores são experimentais e não comprovam intimidade ou qualidade. O relógio começa quando os dois já participaram, não no match isolado.

Na demonstração, um controle explicitamente rotulado simula as trocas e a passagem de 24h. Não apresentar esse botão como comportamento de produção nem fazer o avaliador aguardar 24h reais. R$29,90, se exibido, deve aparecer como hipótese de assinatura, sem checkout real.

### Edição em painel inferior

Intenção (“o que procura”) e tipo de relacionamento (“como deseja se relacionar”) são campos separados. Tocar na linha abre painel com título, ajuda curta e chips. Seleção temporária não altera o perfil até “Concluir”; fechar/X/clicar fora descarta a alteração ou pede confirmação se necessário. Após salvar, linha e prévia refletem o valor. Campo pode ter opção de não informar conforme política de produto, sem inferência a partir dos livros.

### Navegação

Barra inferior curta: Descobrir, Curtidas, Conversas, Perfil. Uma aba selecionada por vez, estado preservado ao retornar. Perfil e edição são lugares distintos: tocar em “Perfil” não começa automaticamente a edição. Chat ocupa a tela com retorno claro; a barra inferior pode sair de cena para priorizar teclado e mensagens. Isso é uma decisão para o Margem, não uma afirmação de reprodução exata do Tinder.

## Verificação antes de entregar

1. Toque lateral muda livro sem curtir; botão de detalhes abre pessoa, e fechar mantém posição.
2. Gesto e botão produzem o mesmo voto, uma única vez. Perfil recíproco mostra overlay; perfil não recíproco não mostra.
3. “Mandar mensagem” abre o par correto; “Continuar” retoma descoberta.
4. Faixa e lista são roláveis e clicáveis; conversa enviada atualiza trecho e posição da lista.
5. Campo de intenção abre painel; fechar descarta, concluir salva.
6. Nenhuma foto pessoal aparece em card, perfil, match ou avatar antes dos requisitos e consentimentos.
7. Layout de 390 px tem card dominante e ações alcançáveis; não exige rolagem de landing page para começar a descobrir.

## Fontes verificadas — consulta em 16/10/2026

- **F1 — Tinder Newsroom, Tap Into a New Look on Tinder (18/07/2017, histórico):** https://www.tinderpressroom.com/tap-into-a-new-look-on-tinder/
- **F2 — Tinder Help, Tinder Overview (atualização indicada: 01/09/2026):** https://www.help.tinder.com/hc/en-us/articles/115004647686-Tinder-Overview
- **F3 — Tinder Help, Messaging a Match (atualização indicada: 28/10/2019):** https://www.help.tinder.com/hc/en-us/articles/115003341583-Messaging-a-Match
- **F4 — Tinder Help, Editing your profile (atualização indicada: 02/10/2023):** https://www.help.tinder.com/hc/en-us/articles/115003339043-Editing-your-profile
- **F5 — Tinder Newsroom Australia, Relationship Types (março/2023, lançamento histórico):** https://au.tinderpressroom.com/relationshiptypes
- **F6 — Tinder Help, Unmatching someone (atualização indicada: 02/10/2024):** https://www.help.tinder.com/hc/en-us/articles/115003360106-Unmatching-someone
