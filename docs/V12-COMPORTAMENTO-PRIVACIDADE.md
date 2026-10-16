# V12 — comportamento e privacidade

final result: passed

**Escopo aprovado:** comportamento e apresentação dos percursos de prévia e do núcleo demonstrativo executados abaixo. Não é aprovação de cadastro real, autenticação ou E2E completo.

Revisão independente da fonte e de uma parte do showroom `review=1`, em cloud browser, com viewports efetivos de **390×844 e 360×640**. A interface foi renderizada sem moldura em dois iframes. Não foi usado aparelho físico. O mapa mostrou 43 destinos; isso não significa que todos foram abertos ou validados. Não houve modificação de UI por este revisor.

## Resultado por área

| Área | Evidência obtida | Limite |
| --- | --- | --- |
| Isolamento de storage | Fonte: efeitos de hidratação/autosave/boot e carregamento de fotos do Prototype retornam antes de IO em review; pause/delete/recomeçar histórico/enterDemo também têm guards | Não foi feita instrumentação de storage/network no browser |
| Cadastro de prévia | Percurso 390: etapas 1–11 com fixture, modal do nome, gênero expandido, duas perguntas opcionais puladas, três livros e três posições abstratas | Conclusão e descarte retornaram à entrada após recuperação; não é cadastro real com upload |
| Fotos no preview | Fonte: Onboarding desativa init/save/upload/remove/finish/cancel de storage em review; não monta file input nem PhotoPreview nesse modo. Prototype não carrega fotos do dono | Nenhum arquivo ou foto pessoal foi selecionado; não foi contado todo recurso de rede |
| Entrada | Apple abriu indisponibilidade explícita; e-mail abriu formulário de prévia com aviso de ausência de envio/sessão. EntryFlow só mantém estado React | Código/complete e fluxo real de autenticação não foram executados; provedores não estão ligados |
| Configurações | Lista inicial capturada nas duas larguras; clique alcançou exclusão, dois passos, volta da confirmação para introdução e introdução para settings; concluir settings voltou ao perfil | Cauda rolada e capturada em 390; saída e exclusão final não foram clicadas nesta revisão |
| Pausa | 360: confirmar pausa levou a Descoberta pausada; retomar levou ao deck | Somente estado em memória do showroom; persistência real/reload não exercitados |
| Descobrir e liga | Curtir Ana por botão gerou Deu liga nas duas larguras; decisões e navegação cabem nas duas | Arrasto real em 360: curto 20 px mantém Ana; direita 185 px gera liga; esquerda 190 px passa Davi e revela Bia. Cancelamento/duplo gesto não executados; Bia revelou overflow, corrigido e recapturado antes do fechamento |
| Conversa e retorno | 360: abriu Lia da lista, enviou texto sintético em memória, abriu perfil pelo cabeçalho, voltou à mesma conversa e depois à lista com a última mensagem atualizada | Não executado fluxo de primeira mensagem de conexão nova nem bloqueio/denúncia |
| Foto bloqueada | 360: posição protegida abstrata e sheet com 24 horas, cinco trocas alternadas e dois aceites | Liberação/revogação não exercitadas no browser V12; contrato coberto por testes de domínio anteriores |
| Rolagem compacta | 360: intenção rolou nativamente, exibiu as seis opções e permitiu selecionar a última, acima do footer fixo | Não certifica todos os tamanhos, safe areas de hardware ou teclado físico |

## Achados e correções

**P1 de legibilidade encontrado e fechado por screenshot:** opinião do livro renderizava escura sobre o fundo escuro em ambas as larguras. A captura inicial `trelele-v12-discover.jpg` documenta a falha. O autor declarou `#FFF8ED`; a captura posterior `trelele-v12-discover-final.jpg` confirma leitura clara, com navegação e decisões visíveis.

**P2 de coerência fechado na fonte:** quando já pausado, o CTA “Manter a pausa” na introdução da exclusão levava ao destino de retomar. O autor alterou o destino para configurações, sem callback nem inversão do estado. A combinação já pausada não foi reproduzida no navegador nesta rodada.

`onReviewEdit` e `onReviewAction` são exceções explícitas aos callbacks bloqueados: a implementação integrada leva somente a `showReview`/setState, sem cair nos callbacks reais. AccountFlow não possui storage próprio; pause/delete/exit ignoram callbacks reais em review. Onboarding fecha a revisão por callback seguro; não chama commit. EntryFlow não faz fetch, cria sessão, pede GPS ou muda notificações. Não foi encontrado bloqueador de privacidade nessas rotas pela leitura da fonte. Isso não equivale a garantia de ausência de falhas.

## Capturas do navegador

Todos os arquivos abaixo foram capturados e sincronizados em `/workspace/scratch/`, contendo o par 390/360:

- `trelele-v12-discover-final.jpg`: estado final do cartão após correção de contraste.
- `trelele-v12-liga.jpg`: curtida recíproca por botão e celebração.
- `trelele-v12-intencao.jpg`: intenção no estado inicial.
- `trelele-v12-entry.jpg`: entrada Apple/Google/e-mail.
- `trelele-v12-settings.jpg`: topo de configurações.
- `trelele-v12-delete-pause.jpg`: confirmação final de exclusão e destino da pausa.
- `trelele-v12-name-locked.jpg`: nome e explicação da foto protegida.
- `trelele-v12-identity-chat.jpg`: identidade expandida e conversa em 360.
- `trelele-v12-private-preview-scroll.jpg`: placeholders privados sem upload e intenção após scroll.
- `trelele-v12-final-step-recovered.jpg`: etapa 11 da prévia e seleção da última opção em 360, exportadas após recuperação. A primeira tentativa `final-step.jpg` não sincronizou e não está disponível.
- `trelele-v12-settings-tail-heart.jpg`: cauda das configurações com Sair e Apagar e coração preenchido no deck compacto.
- `trelele-v12-real-swipe-liga.jpg` e `trelele-v12-real-swipe-result.jpg`: cartão em movimento por arrasto real e liga após soltá-lo.
- `trelele-v12-real-swipe-pass.jpg` e `trelele-v12-bia-settled.jpg`: falha de Bia antes da correção.
- `trelele-v12-bia-regression-final.jpg`: Bia corrigida, com decisões antes do nav.
- `trelele-v12-ana-regression-final.jpg`: regressão de Ana nas duas larguras após o fix. A exportação inicial `bia-fixed.jpg` não sincronizou; usar o arquivo final confirmado no host.

A captura inicial de liga pode conter fases diferentes da animação entre os dois iframes, pois os cliques foram sequenciais. Não a usar como prova de simultaneidade ou duração da transição. Comparação de fidelidade com os prints originais é responsabilidade do crítico visual, separada deste parecer de comportamento.

## Verificação automatizada e interrupção

Root informou build/TypeScript/Vite e integridade de 28 arquivos do runtime aprovados, 45 testes mobile/worker e 24 testes de domínio/gesto aprovados. Não foram tratados como testes de browser. Este revisor atualizou os oito specs locais para entrada via aviso do provedor, modal do nome, títulos novos e exclusão de dois passos. TypeScript isolado passou e Playwright descobriu oito cenários; **não foram executados**, pois o Chromium local continua ausente. Nenhuma nova instalação foi tentada.

A sessão CUA respondeu normalmente e gerou as capturas acima. A última chamada, que tentava “Finalizar revisão” e “Descartar alterações e voltar”, falhou em 0,95 s com `exec-server transport disconnected`. Não foi possível saber se essas ações ocorreram. Após autorização explícita do root, uma única observação `getState` recuperou o transporte em 0,63 s. O estado ainda estava no passo 11; então conclusão e descarte foram executados e o DOM confirmou entrada nos dois iframes. A cauda de settings foi rolada e capturada. Logs warning/error filtrados para `terminal.local:4173` retornaram lista vazia; a lista sem filtro continha erros históricos da extensão Chrome, sem origem no app. Isso não prova ausência universal de erros. Nenhum storage anterior do navegador foi apagado.

Ficam fora do escopo aprovado: fluxo normal de cadastro/edição/upload/persistência/exclusão com dados sintéticos, cancelamento e disputa de gestos, estados restantes do mapa e teclado/Safari/aparelhos físicos. Não declarar todos os 31 prints/todas as telas inspecionados: essa evidência não foi produzida por esta rodada.


## P1 encontrado e fechado — decisões fora da tela no cartão de Bia

Depois do swipe direito em Ana, continuidade e swipe esquerdo em Davi, o estado estável de Bia em 360×640 deixou opinião e controles inferiores atrás/abaixo do nav. `busy=false`; leitura de geometria DOM confirmou cartão em `y=32`, altura `671,39`, base `703,39`, e barra de decisões em `y=628,39..690,39`, fora da altura 640. Screenshot estável `trelele-v12-bia-settled.jpg` confirma. A falha não foi inferida só de um frame animado. Autor e root avisados; nenhuma edição de UI feita pelo QA. A inspeção de Ana cabendo na tela não se estende a todos os cartões. O autor corrigiu somente CSS app-owned após aprovação: linha de grid `minmax(0,1fr)`, wrappers com mínimo zero e hero absoluto. Na mesma rota, Bia permaneceu ativa e `busy=false`; cartão passou a 535 px e barra a `y=492..554`, antes do nav em `574..633`, dentro do viewport de 640. A recaptura disponível `trelele-v12-bia-regression-final.jpg` (127942 bytes no host) mostra as duas ações. A regressão de Ana em ambas as larguras está em `trelele-v12-ana-regression-final.jpg` (147455 bytes): ações390 `680..750`, nav a partir de773; ações360 `492..554`, nav a partir de574. P1 encerrado por fonte, geometria e screenshot; não apenas por declaração do autor.
