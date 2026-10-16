# Navegação V10 — referências fornecidas e decisões de implementação

Foram inspecionados diretamente IMG_1533, 1534, 1535, 1536, 1537–1542 e IMG_1545(1), no diretório de uploads. São imagens estáticas; não demonstram código, duração de animações, curvas de mola ou comportamento real de toque.

| Referência | Observado na imagem | Aplicação no Trelelê |
|---|---|---|
| 1533 | Explorar em cartões por intenção, duas colunas; navegação inferior translúcida sobre o conteúdo. | Manter destinos reconhecíveis e navegação em vidro. Não copiar contagens de pessoas nem criar ações sem função. |
| 1534 | Curtidas tem seções distintas e acesso pago anunciado; estado central vazio. | Deu liga continua exibindo apenas reciprocidade ativa. Não importar paywall ou curtidas enviadas sem pedido específico. |
| 1535–1536 | Perfil é um hub: identidade, acesso de visualizar, configurações, fotos editáveis e grupos de perguntas/interesses. | Meu perfil separa visualizar, editar livros/fotos e configurações. Galeria pessoal continua com exatamente três livros e três fotos privadas. |
| 1537–1539 | Configurações aparecem sobre o perfil, com título e controle de concluir persistentes; opções agrupadas em linhas. | AccountFlow mantém retorno ao perfil, grupos de preferências e estado de pausa. Não fingir telefone/e-mail autenticados nem assinatura real. |
| 1540 | Preferências de descoberta, idade/distância, visibilidade e pausa aparecem em grupos distintos. | Separar intenção, preferências e pausa. Recursos dependentes de GPS/servidor devem declarar seu limite no beta. |
| 1541 | Rodapé das configurações contém segurança, privacidade, informações, sair e excluir. | Ações locais claras, exclusão separada de pausa e de recomeçar demonstração. |
| 1542 | A tentativa de excluir oferece redefinir histórico ou continuar exclusão, com fechar. | Trelelê distingue recomeçar sugestões, pausar e apagar dados deste aparelho; não mudar a ação pedida silenciosamente. |
| 1545(1) | Confirmação de exclusão contém voltar, texto explicativo e alternativa de congelar. | Confirmar alcance exato da remoção local; só mostrar sucesso após storage resolver. Não copiar prazos de retenção, recuperação ou verificação facial do serviço de referência. |

## Inferências, ainda sem execução do produto de referência

A sobreposição do perfil atrás de Configurações sugere uma pilha de apresentação com retorno preservado. Os controles de fechar/concluir sugerem encerramento desta superfície. As imagens não permitem provar se uma edição é salva por campo, ao concluir ou após pedido de rede; o beta deve definir seu próprio contrato explícito.

## Gesto de decisão proposto e aprovado antes de implementar

No Descobrir, uma pessoa ocupa o cartão ativo. Arrastar horizontalmente acompanha o dedo com translação e rotação leves. Soltar decide somente após distância `max(72px, 24% da largura)` ou um lançamento intencional com pelo menos 48px e velocidade horizontal de 0,65px/ms. É necessário predomínio horizontal de 1,35. Esses valores são escolhas iniciais de implementação, não medidas do Tinder.

Arrasto curto ou vertical, cancelamento, Escape e perda de sessão retornam ao centro sem preferência. O scroll vertical nativo permanece disponível. Botões e gesto usam a mesma trava por ID da pessoa, de modo que uma saída não decida duas vezes. O callback ocorre depois da saída animada. Uma curtida recíproca recentra e mantém o cartão para a celebração Deu liga inline. Reduced motion remove as transições.

Os seis itens de mídia não disputam o gesto horizontal: navegam por toque nas laterais, botões anterior/próximo e indicadores. Perfil completo e conversa não usam arrasto para decidir. Imagens privadas originais continuam restritas ao proprietário, sem entrar em cartões de demonstração.

## Retornos exigidos

- Descobrir → perfil da pessoa → voltar: preservar pessoa e item de mídia.
- Deu liga → conversa → perfil da pessoa → voltar: conversa; voltar novamente: Deu liga.
- Conversas → conversa → voltar: Conversas; primeira mensagem move conexão nova para histórico uma única vez.
- Meu perfil → configurações → editar → voltar: retorno explícito sem apagar dados.
- Configurações → apagar → cancelar: manter os dados. Confirmar: apagar somente após storage concluir; erros permanecem visíveis.

A avaliação final de suavidade requer navegador funcional e, para toque/teclado nativo, aparelho físico. Testes de classificação e integridade não substituem essa inspeção.
