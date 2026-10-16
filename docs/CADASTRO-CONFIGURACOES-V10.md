# Cadastro e configurações — análise de referências V10

Inspeção visual direta em 16/10/2026. Referências privadas permanecem fora do repositório: este documento não incorpora os prints nem dados de pessoas neles retratadas.

## Inventário observado

| Arquivo fornecido | Dimensões bitmap | Estrutura observada |
| --- | --- | --- |
| IMG_1522.png | 1179 × 2556 | Intenção: título/pergunta, explicação curta, seis opções em três colunas e duas linhas; continuar inativo no rodapé. |
| IMG_1524.png | 1179 × 2556 | Hábitos: grupos de chips, separadores, conteúdo rolável; pular no topo; continuar com contador no rodapé. |
| IMG_1525.png | 1179 × 2556 | Comunicação e afeto: escolhas agrupadas por pergunta com chips em linhas quebradas. |
| IMG_1526.png | 1179 × 2556 | Interesses: categorias, chips e mostrar mais; indicação textual de mínimo; rodapé com contador. |
| IMG_1527.png | 1179 × 2556 | Fotos: seis posições em grade de três colunas, controle adicionar sobreposto e contador; regra da referência difere da regra de três fotos do Trelelê. |
| IMG_1528.png | 1179 × 2556 | Apresentação: dois cartões, um para bio e outro para pergunta; pular no topo. |
| IMG_1529.png | 1179 × 2556 | Permissão de notificações do sistema sobre uma introdução de localização. A imagem não comprova o resultado de permitir ou negar. |
| IMG_1530.jpeg | 709 × 1536 | Tutorial sobre a descoberta; CTA principal e pular. |
| IMG_1531.jpeg | 709 × 1536 | Pessoa em mídia imersiva, paginação da galeria, informações e ações inferiores; navegação raiz separada. |
| IMG_1532.jpeg | 709 × 1536 | Explorar: título e descrição acima de grade de duas colunas. |

Os sete PNGs têm mesma proporção e resolução. As medidas de desenho abaixo normalizam sua largura para 393 unidades (bitmap dividido por três), sem afirmar que o DPR foi observado ou que a fonte é conhecida. Os três JPEGs foram redimensionados por um fator diferente; não inferimos medidas de runtime a partir deles.

Estimativas manuais: margens laterais próximas de 20 unidades, títulos perto de 32 em sans de peso alto, corpo 15–16, CTA inferior de aproximadamente 50, raios grandes próximos de 24. Chips visíveis têm cerca de 28–32 de altura, mas o bitmap **não revela a área real de toque**; o Trelelê mantém alvos de pelo menos 48. Gaps entre opções ficam aproximadamente em 8–12. A separação entre cabeçalho e título é maior que entre título e explicação. Não copiar espaços mortos do bitmap sem testar a altura disponível.

Nenhuma dessas dez imagens mostra configurações. A organização de configurações abaixo é adaptação de produto, não transcrição visual de uma tela inexistente nesse lote.

## Decisão implementada após preflight independente

A abertura com marca original fica preservada. Começar leva a regras breves sobre idade, respeito, foto e demonstração; não há aceite de termos inexistentes. Depois, onze perguntas/superfícies: nome e cidade opcional, nascimento 18+, identificação, quem quer conhecer, intenção, gêneros, rotina de leitura opcional, programa literário opcional, três livros, três fotos e bio com revisão. A bio inclui uma recomendação de livro opcional de até 200 caracteres. As duas etapas opcionais têm Pular e multisseleção sem mínimo. A separação reduz a carga da antiga tela que reunia identificação, interesse e intenção.

Cabeçalho contém voltar, progresso e número da etapa. Rodapé contém a ação principal em pill, contando livros e fotos nas respectivas etapas. Conteúdo usa `MobileScroll` em região própria entre os dois; não se adiciona uma segunda altura de teclado ao scroll. As escolhas usam cor e estado acessível, não só texto. A grade de fotos tem três posições, com trocar/remover de 48 unidades; não copiar os pequenos botões sobrepostos da referência. Hábitos, astrologia, notificações e localização não foram acrescentados sem implementação e contrato correspondentes.

## Contrato dos módulos

`Onboarding` conserva `onComplete(profile)`, `onDemo()`, `initialProfile`/`initial` e `onCancel()`. Ele usa as APIs de rascunho do armazenamento: metadados em chave distinta e fotos em estágio separado. Ao editar um perfil confirmado, começa a partir do confirmado e descarta estágio abandonado. Cadastro inicial pode retomar um rascunho. Cancelar descarta apenas o rascunho; concluir aguarda `commitProfileDraft` antes do callback. Metadados e IndexedDB são armazenamentos diferentes: não anunciar transação resistente a queda do processo entre ambos.

`AccountFlow` recebe `paused`, `ownerProfile`, `onClose`, `onEditProfile`, `onPause`, `onResume`, `onDelete` assíncrono e `onShowOpening`. Compatibilidade com os nomes anteriores do integrador fica restrita aos aliases equivalentes. O módulo apresenta configurações, confirmação de pausa/retomada, exclusão local e informações do beta. O pai conserva a propriedade da persistência e da navegação principal.

Pausa é explicitamente local. Exclusão aguarda o callback e mostra erro recuperável; o pai apaga apenas dados do Trelelê, incluindo fotos, rascunhos e histórico local prometido, e retorna à abertura após sucesso. Não há telefone, senha, conta online, presença falsa, solicitação de permissões simulada ou alegação de backend.

## Verificação necessária

TypeScript compilou após a implementação. Isso não valida aparência nem execução no navegador. Antes de publicar: percorrer as onze etapas em 390 e 360, testar teclado e conteúdo acima do CTA, adicionar/trocar/remover imagens válidas e inválidas, cancelar edição mantendo perfil e fotos confirmados, confirmar edição e reiniciar consentimentos somente quando as fotos mudarem, persistir pausa, apagar os dados e conferir o retorno à abertura. Não copiar os prints privados para o bundle ou para o GitHub.

Revisão de foco literário: gostos e perguntas tratam de livros, rotina de leitura e programas literários. Não foram acrescentados campos de aparência, signos, consumo de bebida ou hábitos genéricos de estilo de vida. As respostas são exibidas como a pessoa as forneceu, sem alegar cálculo de afinidade.
