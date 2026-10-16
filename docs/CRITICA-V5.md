# Crítica independente V5

## Escopo e evidências

Crítica realizada antes das mudanças V5, pela leitura de `dist/app.mjs` e `dist/style.css` V4 e inspeção visual de seis arquivos reais: `docs/research/tinder/swipe-deck-home.png`, `match-profile-detail.png`, `user-inbox.jpg`, `uiland-inbox.png`; `docs/research/happn/historical-main-screens.png` e `play-4.png`. A captura `uiland-inbox.png` está coberta por onboarding de segurança; não fundamenta organização completa da caixa de entrada. O tríptico Happn é publicação histórica e `play-4.png` é publicidade; nenhum deles prova comportamento atual universal. Não tratei esses materiais como screenshots do Trelelê.

## Cinco problemas concretos da composição V4

1. **Capa como substituição literal de retrato.** `.card-media` ocupa o `flex:1`, com mínimo175px, e `.main-book` usa 100% de ambas as dimensões com `contain`. A escala do livro depende da altura restante da tela, enquanto a ficha da pessoa fica na base. O Tinder observado entrega domínio ao retrato; transferir a mesma composição para uma capa transforma a pessoa em legenda de um catálogo. A capa deve ser um objeto de proporção2:3, não uma fotografia de fundo.
2. **Quadro muito comprido e repetitivo.** `.nearby-art` tem215px fixos; ficha inferior adiciona nome, cidade, intenção e padding12px. Em360px de largura cada coluna recebe aproximadamente155px: a arte já excede a largura, antes de acrescentar a ficha. Quatro pessoas completas dificilmente cabem entre cabeçalho e navegação. O tríptico Happn usa recortes visuais fortes e rótulos curtos; V4 repete caixinhas de catálogo com muitas linhas administrativas.
3. **Cabeçalho sem identidade editorial.** Marca27px, títulos25px e Jakarta em todas as escalas somam-se a superfícies branco/cinza, chips e controles cobalto. A aparência é de painel utilitário. O Happn histórico oferece contraste real de tipos e grandes massas de cor. Apenas mudar o acento preservaria a mesma cara.
4. **Três intenções disputam a mídia.** Topo de progresso troca livro; toque nos lados também troca; arraste decide sobre a pessoa. Abrir a pessoa acontece no bloco de texto abaixo da capa. Os sinais de navegação são discretos e a ação central não descobre a pessoa. O Tinder observado coloca uma seta dedicada para detalhes junto da identidade; o Trelelê precisa tornar a separação entre conhecer alguém e folhear livros visível.
5. **Perfil e match não mudam o ritmo.** `people()` começa com capa300px e repete nome, cidade, intenção e bio. `showMatch()` usa o mesmo dialog de opções com miniaturas e dois botões. Na evidência Happn, o match interrompe o ritmo com uma composição própria; no V4 é apenas outro painel. A história visual precisa distinguir descoberta, opinião, decisão e reciprocidade.

Estas são conclusões da composição expressa pelo fonte, comparada às imagens efetivamente vistas. Não alegam observação do render V4.

## Direção proposta antes de código

Pessoa primeiro: nome e idade acima da composição; opinião literária como grande gesto tipográfico; capa física2:3 menor, deslocada, com área de respiro. Usar serif expressiva apenas onde há voz e sans legível nos controles. Escolher uma massa cromática dominante e acento inesperado. Fundo tinta com papel claro e ácido/coral é uma alternativa de ruptura; papel editorial com tinta e coral só rompe se geometria e tipografia também mudarem.

Quadro deve parecer pessoas com livros: identidade antes da estante, menor área de capa, quatro identidades visíveis. Não aceitar como nova direção o mesmo cartão de borda arredondada com cor diferente. Tela da pessoa deve abrir com uma apresentação distinta e seleção explícita dos livros; match deve ter enquadramento celebratório próprio e CTA claro de conversa.

## Gate visual observável

Comparar V4 e V5 em390×844 e360×740, no mesmo estado, mesmo personagem e mesmo livro. Imagens de prancha são evidência de intenção de design; não validam render, overflow, gesto ou ordem de foco.

| Tela | Critério verificável no render |
|---|---|
| Descoberta | Pessoa reconhecível antes da capa; nome, trecho da opinião e ações inteiras visíveis sem scroll em ambos tamanhos; capa preserva2:3 e não está esmagada; nova composição distinguível da V4 mesmo em escala de cinza. |
| Quadro | Pelo menos quatro identidades legíveis acima da navegação em390×844; em360×740 segunda linha começa visível sem truncar controles; cidade não compete com identidade; alvo abre perfil de pessoa. |
| Pessoa | Primeira dobra não reproduz o deck; apresentação e início dos livros identificáveis; CTA não cobre conteúdo; voltar restaura origem. |
| Match | Reciprocidade tem composição própria, identidade das duas pessoas e CTA para conversa; não parece sheet de filtros. |
| Conversa | Cabeçalho, primeira mensagem e composer têm prioridade; cartão de foto não domina a tela vazia; abrir perfil e voltar mantém contexto. |
| Navegação | Aba ativa identificável por mais que cor; labels legíveis; símbolos de livro, perfil e curtir têm significados consistentes; toques com pelo menos44px onde necessários. |

Nenhuma quantidade de testes automatizados libera este gate. Aprovação de experiência depende de render real observado e, depois, uso com pessoas. Mudanças vistas apenas no fonte devem ser reportadas explicitamente como implementação ainda sem validação visual.

## Segunda leitura — prancha e direção propostas

Inspecionei `docs/design-v5/prancha-projeto-v5.svg` rasterizada por Inkscape, apenas como desenho de projeto. Não é render da aplicação. A primeira prancha observada mostra pessoa no topo do deck, capa lateral e faixa escura de opinião, além de quatro tiles completos no quadro390×844. São mudanças de composição reais no desenho, melhores que a substituição de cor.

Ainda contesto a força da direção: quadro continua catálogo de caixinhas brancas com capa centralizada, opinião e identidade na base; a nova tipografia não é examinável porque o SVG usa Arial; coluna título/autor do deck tem grande intervalo vazio até o pager; barras escuras são quase os únicos gestos de marca. A versão inicial de `DIRECAO-V5.md` ainda descrevia opinião primeiro/pessoa no fim, contrariando o desenho revisado. Pedi reconciliação documental e composição de quadro com identidade no topo e vínculo mais forte entre pessoa e opinião. Não aprovo experiência nem estética implementada a partir desta prancha.

A geometria390 da prancha não deve ser simplesmente reutilizada em360×740: deck558+header56+segmentos44+decisões72+nav72 já soma802 antes de respiros. A direção precisa especificar versão compacta efetiva e observar o render nos dois tamanhos. A existência de arquivo CSS de compactação, por si só, não comprova que cabe.

## Terceira leitura — revisão material da direção

Vi `/tmp/prancha-v5.png` atualizada, derivada do SVG de projeto: quadro agora identifica a pessoa ANTES da capa em faixa carvão; capas reais substituem placeholders; opinião aparece no rodapé carvão e cidade deixa de se repetir. Reconheço diferença material de desenho e contraste perante o primeiro projeto de caixinhas brancas. `DIRECAO-V5.md` reconciliou a ordem do deck e especificou448px de cartão em360, com soma operacional716px. Isso resolve a contradição aritmética inicial na especificação, sem provar a implementação.

Ainda faltam comprovações: tipografia Bricolage/DM Sans não é avaliável pelo raster com fallbackArial; navegação ativa não aparece distinguível nesse desenho; coluna título/autor tem intervalo excessivo até o pager. A sobra24px em360×740 exige atenção a safe areas que podem acrescentar34px ao rodapé. A prancha está mais distinta, porém permanece evidência de intenção. O gate visual da aplicação está aberto.

## Quarta leitura — implementação V5 pelo fonte

`dist/index.html` passou a carregar `ui/app.mjs` e `ui/style.css`; li esses arquivos e `ui/components.mjs`. Confirmo mudanças efetivas de markup e CSS: identidade precede mídia nos tiles e deck; capas reais são mapeadas por componentes; Bricolage e DM Sans locais substituem Jakarta; faixa carvão dá área própria à opinião; o perfil começa com identidade e opinião, abandonando a capa300px inicial. Estas constatações são de implementação, sem screenshot do aplicativo.

Pendências concretas encaminhadas ao frontend nesta leitura:

- Pager tem alvos25×44px e enviar39×39px; contrato pede44px.
- `.book-stage` é rolebutton e contém botões; alternar livro na mídia continua composto com alvos internos.
- `.deck-identity p` usa nowrap e pode disputar largura com Perfil em360px; falta contenção explícita.
- Thread ainda coloca `reveal-card` grande no log, contrariando o estado compacto44px projetado.
- `.deck-note` acrescenta24px à soma operacional; o orçamento360 deixa de absorver safe area.
- Compactação é aplicada por largura374px; uma viewport390×740 continua com cartão558px.

Registrar resolução no fonte não deve ser confundido com gate visual liberado. O comparativo390×844 e360×740 permanece exigido.

## Quinta leitura — primeiro render real observado

Apliquei a skill `designly:visual-qa`4.4 ao arquivo `/workspace/scratch/trelele-v5-quadro.jpg`, captura de navegador1363×936 com aplicativo central480×888. Agora há evidência visual da aplicação, distinta das pranchas. Não é aparelho físico nem viewport390/360.

O render confirma quatro pessoas completas, nomes antes das capas, preservação das artes, opinião com contraste e navegação ativa indicada por cor e sublinhado. Não identifiquei quebra crítica de composição ou corte de controles nessa imagem. A hierarquia de um segundo é pessoa→capa→opinião, e a distribuição em escala de cinza mantém as unidades reconhecíveis. O painel inferior é consistente e a tela é operacional. A revisão não exige novo conceito.

Até três ajustes objetivos:

1. As quatro opiniões truncam antes da ideia completa. Selecionar resumos curtos escritos por pessoa, com conclusão legível em duas linhas; manter a opinião integral no perfil. Não diminuir fonte para encaixar.
2. Em480px, a capa pequena centralizada deixa muito espaço lateral no stage. Ajuste menor e não bloqueante: calibrar largura visual da capa à coluna, preservando proporção e altura. Conferir390 antes de mudar.
3. Incorporar o steering atual: verde-mata#123D32, goiaba#B83B4B e amarelo#F2C94C apenas em detalhe, preservando contraste e hierarquia. O render observado ainda usa carvão/terracota.

Veredito parcial: composição e legibilidade do quadro480×888 passam nesta captura. Gate390×844/360×740 e demais telas continua pendente. Nenhuma nota ponderada foi fabricada: não há pesos/limiar configurados para este projeto; julgamento baseado nos hard gates aplicáveis e problemas observáveis.

## Decisão final do usuário — direção rejeitada

O usuário viu o comparativo real390/360 e rejeitou explicitamente a direção V5 como péssima e com aparência de IA. A direção foi arquivada sem deploy. Meu parecer parcial anterior sobre legibilidade do quadro480×888 não constitui aprovação da direção e não prevalece sobre essa rejeição. Não observei pessoalmente o comparativo390/360; a rejeição é evidência comunicada pelo responsável pela sessão.

Diagnóstico: V5 resolveu organização, mas continuou sem uma ideia visual própria. A repetição de módulos arredondados, capa pequena centralizada em campo cinza, duas faixas escuras por pessoa, frases cortadas e navegação previsível produz uma ficha bibliográfica automatizada. Mudar a ordem do nome, trocar a fonte e pintar barras não alterou suficientemente essa gramática. A aplicação ficou mais legível, porém o encontro entre pessoas continuou reduzido a catálogo de capas com opiniões. O próximo passo é explorar três composições independentes em imagem, com referências reais e escolha do usuário antes de escrever código; não continuar corrigindo CSS da direção rejeitada.
