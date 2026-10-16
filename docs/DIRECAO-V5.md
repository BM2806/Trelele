# Trelelê V5 — direção de produto mobile

Direção nova de 16/10/2026. Este documento especifica projeto; não certifica a implementação. Referência de leitura: `CONTEXTO-DO-PROJETO.md`. A regra central permanece: adultos, livros e opiniões antes de rosto, conversa e duplo aceite antes de revelar foto.

## Decisão

Um aplicativo de encontros com voz própria, construído em contrastes: cabeçalhos carvão, superfícies brancas, cinza mineral e terracota. A personalidade vem da opinião legível e das capas autênticas, não de ilustrações genéricas nem de cartões coloridos por gênero. A página inicial é uma tela operacional; não há hero, manifesto, vitrine comercial nem chamada publicitária. A tela deve funcionar com o polegar.

Bricolage Grotesque dá voz à marca e às opiniões; DM Sans organiza a interface. A pessoa é identificada antes da mídia. O livro é a imagem reconhecível, com opinião em voz própria na mesma unidade de descoberta. Nome e idade deixam claro que se conhece uma pessoa, não se compra um livro.

## Evidências efetivamente vistas

Inspeção visual de `research/happn/historical-main-screens.png`, `play-3.png`, `play-4.png`, `play-5.png`; e `research/tinder/swipe-deck-home.png`, `uiland-inbox.png`, `chat-tab.png`, `match-profile-detail.png`. Não são acesso ao código de concorrentes. As imagens promocionais do Happn orientam composição, não provam fluxo operacional atual. A imagem histórica mostra um quadro de duas colunas com identidade vinculada à imagem e navegação inferior. A captura de deck do Tinder mostra o peso do cartão, decisões separadas e navegação fixa. A tela de perfil preserva decisão fora da rolagem. A tela de chat mantém o destino identificável. Não copiar rosto como elemento principal do Trelelê.

## Mudanças estruturais obrigatórias

| Antes V4, diagnosticado na fonte | Depois V5 | Evidência visual exigida |
|---|---|---|
| Capa gigante ocupa quase todo o deck; opinião de 13px é apêndice | Pessoa abre o cartão; capa autêntica domina a zona de mídia com metadados laterais; opinião tem faixa carvão própria | Em 360px, a opinião é legível sem rolar e a capa não consome o cartão todo |
| Stage colorido por livro e SVG conceitual como capa | Stage mineral uniforme e capa autêntica com origem registrada | Todas as capas têm título reconhecível e proporção preservada |
| Quadro tem stage de 215px, cadeado em cada item, intenção em chip e texto pequeno | Duas colunas de tiles carvão com pessoa no topo, stage de140/152px e opinião de duas linhas; nota de privacidade única | Quatro pessoas ficam úteis na primeira janela de 360×740 |
| Perfil começa com capa de 300px | Perfil começa com identidade e intenção em texto; livro e opinião têm ritmo próprio; estante com opinião ao lado | Nome e o que a pessoa pensa aparecem antes da segunda dobra |
| Inbox orientada por círculos de capas e status | Novos encontros são pequenas capas retangulares; conversas são linhas de 84px com pessoa e última mensagem | O olhar identifica conversa e pessoa sem depender de ícone de cadeado |
| Banner de demonstração permanente de 44px consome altura | Identificação compacta no contexto, detalhes de teste no estúdio | Área operacional ganha altura real; nenhuma faixa técnica de 44px |
| Fonte única Jakarta e azul cobalto | Bricolage + DM Sans, carvão e um acento terracota | Comparação V4/V5 sem textos mostra diferença de distribuição, escala e contraste |
| Chips e avisos competem com conteúdo em todo lugar | Regras na hora relevante; uma linha compacta em descoberta, estado da foto na thread | Opinião, pessoa e mensagem têm mais peso que instrução |

## Geometria vinculante

Medidas em CSS px; viewport inclui o aplicativo, sem moldura de telefone ilustrada. Ajustar safe areas reais com env(); não acrescentar uma barra de status falsa. Largura máxima de demonstração 430px. Nenhum scroll horizontal da página.

| Peça | 390×844 | 360×740 |
|---|---:|---:|
| Cabeçalho | 56 | 56 |
| Segmentos Descobrir | 44 | 44 |
| Linha cidade + nota no quadro | 58 | 58 |
| Navegação inferior | 72 | 72 |
| Margem lateral | 16 | 16 |
| Gap do quadro | 12 | 12 |
| Coluna do quadro | 173 | 158 |
| Tile do quadro | 258 | 242 |
| Stage do tile | 152 | 140 |
| Área útil do quadro | 614 | 510 |
| Duas fileiras + gap | 528 | 496 |

No quadro, o item é um botão inteiro com nome acessível. IDENTIDADE PRIMEIRO: faixa carvão40px com nome e idade16/20 brancos. Stage mineral contém capa, sem crop,140/152px. Rodapé carvão62/66px contém opinião branca14/18 até duas linhas. Cidade não se repete em cada tile: fica no cabeçalho global. Se a opinião for abreviada visualmente, a tela de pessoa oferece o conteúdo completo. Não gerar scroll interno no tile. A intenção deixa o tile e reaparece no perfil.

Deck: margem16, raio16, uma pessoa por vez. IDENTIDADE PRIMEIRO, não um hero de opinião: nome26/30, cidade14/18, botão Perfil44; cabeçalho interno74px em390 e68px em360. Zona mídia dominante de320/248px: capa178×274 ou144×216 à esquerda, preservando proporção2:3; título18/23 e autor14/19 à direita, sem criar uma ficha bibliográfica cheia. Controles de livros com alvos44 e indicação textual1 de3. Opinião tem faixa carvão abaixo da imagem de114/96px, texto18/23 até3linhas e aspas integradas à fala. Faixa final de50/36px mostra afinidade sem chip. Altura total do cartão558/448px. Decisões em faixa84px: desfazer48, passar56 e curtir60. Cartão+topbar56+segmentos44+gap12+decisões84+nav72 totalizam826/716px e cabem nas duas viewports. A sobra absorve respiro/safe area. Sem pilha decorativa atrás, sem manchete editorial antes da pessoa, sem diminuir fonte para fazer caber. Essa é a revisão final; substitui qualquer contrato preliminar de quote primeiro.

Perfil de pessoa: cabeçalho56 com Voltar44 e opções44; topo identidade nome28/32, cidade14/20 e intenção14/20; opinião principal20/26 em bloco carvão. A estante começa abaixo com linhas de capa64×96, título16/20 e opinião16/24; expandir opinião é ação local, não abre modal. Rodapé de decisão80 com Passar e Curtir>=48. Não manter a navegação raiz nessa tela, e o botão Voltar restaura a origem.

Inbox: header56; título28/32; seção Novos encontros com capas48×72, nome14/18 e alvo integral; uma faixa, sem carrossel obrigatório para achar mensagens. Linhas de conversa84px com capa44×66, nome17/22, trecho15/21 e hora12/16. Separadores1px e espaço predominam; sem cartões elevados por mensagem. Navegação raiz72 fixa.

Thread: cabeçalho64 com voltar44, mini capa32×48, nome18/22 e Foto oculta14/18; menu44. Sem cabeçalho de marca adicional. Mensagens16/23, bolhas de saída carvão/branco e recebidas branco/carvão. Estado de foto em linha compacta de44px acionável; painel explicativo aparece ao toque. Quando elegível, mostrar ação explícita Quero mostrar minha foto e o estado do outro aceite. Composer mínimo64, input>=44 e botão enviar48. Com teclado aberto, composer continua visível e lista encolhe; navegação raiz ausente.

## Critérios de aceite visual e de interação

1. Inspecionar capturas reais do navegador em390×844 e360×740, sem usar esta especificação como prova de layout.
2. Quadro tem duas colunas nos dois tamanhos, nomes legíveis, quatro pessoas úteis na primeira janela e navegação sem recortes. Não existe regra de colapso para uma coluna nesses tamanhos.
3. Deck mostra uma opinião completa razoável, capa inteira, identidade e decisões sem rolagem inicial. Quote longa deve ir ao perfil, sem encolher tudo.
4. Perfil e inbox têm composições próprias; não são o mesmo cartão com conteúdo diferente.
5. Os quatro destinos raiz são consistentes; thread e perfil têm voltar que restaura contexto. Tap em livro altera livro; passar/curtir age na pessoa.
6. Nenhuma foto aparece por tempo, compra, toque na capa ou único aceite. Estado de consentimento explica a próxima ação com clareza.
7. Mostrar comparativos antes/depois com mesma viewport. Verificar contraste de texto, alvo mínimo44, foco e reduced motion. Quantidade de testes não é critério visual.
8. Capas sem fonte ou licença conhecida não podem ser chamadas de licenciadas. Se forem miniaturas referenciais, registrar esse estatuto honestamente. Fonte local inclui licença.

## Limites desta entrega

A prancha SVG é desenho de projeto vetorial e não screenshot do aplicativo. Fontes, dimensões reais de textos, safe areas e teclado precisam de inspeção na implementação. A demonstração não tem autenticação, mensagens reais nem proteção de mídia de produção.
