# Margem — referências de interação e reconstrução funcional

Data: 16/10/2026. Esta direção substitui a recomendação editorial anterior, rejeitada pelo usuário. Nome Margem permanece provisório.

## O que foi realmente visto

As cinco imagens fornecidas pelo usuário (`upload/IMG_1490.jpeg` a `IMG_1494.jpeg`) foram abertas e examinadas. Elas mostram diferentes épocas e superfícies do Tinder, inclusive aparelhos antigos e recortes de resultados de busca. Não comprovam o layout atual nem autoria original de cada montagem.

As páginas oficiais brasileiras da App Store e do Google Play foram recuperadas. A galeria Google Play e dois links de screenshot oficiais foram localizados; não baixamos esses ativos nem os incorporamos ao produto. A descrição oficial da App Store documenta deslizar à direita/esquerda e interesse recíproco. Não houve inspeção de código interno, API privada ou algoritmo do Tinder.

## Padrões observáveis nas cinco imagens do usuário

| Imagem | Padrão visto | Aplicação ao Margem |
|---|---|---|
| IMG_1490 | Card vertical dominante; segmentos superiores; nome/idade na parte inferior; ações circulares; instrução separa toque para foto anterior/seguinte e abrir perfil. | Card ocupa a área útil. Toques navegam entre livros; arrasto decide sobre a pessoa. Um botão explícito abre o perfil. |
| IMG_1491 | Descoberta em card; grade de escolhas; detalhe de perfil com descrição e ações. | Separar deck, perfil completo e curtidas. Não colocar tudo simultaneamente na descoberta. |
| IMG_1492 | Matches novos em linha horizontal; conversas em lista vertical; perfil separado. | Manter hierarquia familiar: novas conexões em cima e conversas abaixo. |
| IMG_1493 | Confirmação de match com duas pessoas e escolha entre conversar ou continuar. | Modal recíproco usando identificadores sem rosto antes de revelação. Dar duas saídas claras. |
| IMG_1494 | Card com segmentos superiores; nome/idade e informações compactas; aba inferior persistente; edição via painel com opções. | Navegação persistente, filtros simples e folhas de edição com confirmação explícita. |

O valor dessas imagens está na distribuição da atenção e na dinâmica. Não reproduzir a chama, o nome Tinder, seus ícones proprietários, fotografias ou telas literais.

## Adaptação funcional concreta

Uma pessoa continua sendo a unidade do deck. Antes da revelação, o visual principal é um livro escolhido pela pessoa ou uma composição própria de sua estante. Nome, idade, região aproximada e uma frase curta ficam visíveis. Alternar livros dentro do mesmo perfil NÃO passa à próxima pessoa.

- Toque curto na esquerda/direita do card: livro anterior/seguinte, com segmentos de progresso no topo.
- Arrasto horizontal intencional: passar ou demonstrar interesse na pessoa.
- Soltar antes do limiar: retorno à posição inicial sem decisão persistida.
- Botões equivalentes: mesmas decisões do gesto, com nomes acessíveis e funcionamento por teclado.
- Botão de informação: abre perfil detalhado sem acionar o swipe.
- Interesse recíproco: abre confirmação de conexão; foto continua protegida.
- Chat: livro que motivou o interesse aparece como contexto opcional.
- Revelação: ação privada dos dois; jamais consequência automática de swipe ou assinatura.

O card pode usar sombra e uma faixa escura atrás de texto sobre imagem para legibilidade, tratamento utilitário observado nas referências. Acentos, nomes e ícones devem ser próprios. Não transformar a tela em catálogo editorial ou mural de frases.

## Código open source realmente inspecionado

Fonte: [3DJakob/react-tinder-card — index.js](https://github.com/3DJakob/react-tinder-card/blob/master/index.js), ramo `master`, e [LICENSE](https://github.com/3DJakob/react-tinder-card/blob/master/LICENSE). SHA imutável não recuperado; não fixar dependência por esta referência.

O código usa React Spring, eventos mouse/touch separados, deslocamento e velocidade para escolher direção, animação de retorno ou saída e callbacks. A API permite decisões por botão e deixa remoção do card ao chamador. A licença é MIT, com aviso de copyright de Jakob Unnebäck; preservar aviso e licença se houver reaproveitamento relevante.

Há um cuidado concreto: `settings.swipeThreshold` é mutado durante a renderização, em escopo compartilhado entre instâncias. O README também recomenda tratar controles internos com classe específica. Compatibilidade, cancelamento de gesto e versões de dependências precisam de revisão. Não instalamos a biblioteca nem copiamos seu código. É uma referência técnica independente; não é código do Tinder.

## Implementação recomendada agora: Pointer Events nativos

[MDN Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) documenta um modelo unificado para mouse, toque e caneta, captura do ponteiro e eventos de cancelamento. A base nativa evita adicionar biblioteca somente para deslocar um card.

O controlador próprio deve distinguir clique, intenção horizontal e gesto vertical; capturar o ponteiro; ignorar ponteiros secundários; finalizar em `pointerup`; restaurar em `pointercancel` ou perda de captura. O detalhe do perfil permanece rolável, sem `touch-action: none` global. Usar `touch-action: pan-y` apenas na área arrastável quando compatível com o comportamento desejado, testando cancelamento por rolagem vertical. Não usar listeners globais sem limpeza.

### Parâmetros propostos, não números do Tinder

Hipótese inicial: reconhecer arrasto após 8 px; exigir predominância horizontal; confirmar swipe após cerca de 25% da largura do card, limitado a faixa confortável de 72–120 px; rotação discreta de até 10 graus. Esses valores são nossos e precisam ser testados em aparelho real. Um movimento rápido curto pode continuar voltando no protótipo para evitar rejeição acidental. Não alegar fidelidade física ao Tinder.

Um estado explícito deve impedir decisões duplicadas: parado → arrastando → retornando ou saindo → pronto. Bloquear a segunda ação durante a saída. Botão e gesto chamam uma função comum. A animação não confirma que o servidor aceitou a decisão: a integração deve lidar com falha e idempotência.

## Riscos de adotar um clone pronto

Um repositório com palavra “Tinder” no nome não demonstra equivalência com o produto real nem segurança de produção. Conferir licença do código e dos ativos separadamente, versão suportada de React, dependências, testes mobile, status de manutenção, operações de rede, chaves incluídas e políticas de banco. Exemplos de tutorial frequentemente cobrem só o deck e um chat demonstrativo. Não pressupor idade, moderação, mídia privada, LGPD ou consentimento resolvidos.

Não baixamos APKs/IPAs de terceiros nem utilizamos endpoints privados. Nenhuma evidência permite reconstruir o algoritmo interno de ranqueamento do Tinder.

## Critérios para a próxima validação

1. Deslizar, clicar e usar teclado produzem uma única decisão por perfil.
2. Tocar para trocar livro não causa curtida, rejeição ou troca de pessoa.
3. Arrasto insuficiente e cancelamento devolvem o mesmo perfil, sem efeitos de negócio.
4. Abrir perfil, rolar descrição, fechar e voltar ao deck mantém o contexto.
5. Animação respeita preferência de movimento reduzido.
6. Navegação inferior e botões ficam acessíveis com teclado e zonas seguras do celular.
7. Match recíproco aparece uma vez; antes dele não surge conversa real autorizada.
8. Foto original não é enviada ao navegador antes da autorização bilateral.

## Fontes primárias verificadas

- [React Tinder Card](https://github.com/3DJakob/react-tinder-card) — API e README: `turn36view0`.
- [Código index.js](https://github.com/3DJakob/react-tinder-card/blob/master/index.js) — `turn39view0`.
- [Licença MIT](https://github.com/3DJakob/react-tinder-card/blob/master/LICENSE) — `turn41view1`.
- [MDN Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) — `turn36view1`.
- [App Store Brasil](https://apps.apple.com/br/app/tinder-app-de-relacionamento/id547702041) — `turn37view3`.
- [Google Play Brasil](https://play.google.com/store/apps/details?id=com.tinder&hl=pt_BR) — `turn41view0`.

O manifest `assets/interaction-references.json` separa código inspecionado, documentação, galerias oficiais e evidência fornecida pelo usuário.
