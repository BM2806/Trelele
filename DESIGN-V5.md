# Design System: Trelelê V5

Fonte de verdade visual da reconstrução mobile. Complemento de `docs/DIRECAO-V5.md`; não herdar estilos V4. Skill aplicada: Stitch Design Taste. As diretrizes genéricas de website são explicitamente adaptadas ao pedido do usuário: este é APP MOBILE, duas colunas no quadro, sem hero nem menu de site. A regra genérica de colapsar colunas abaixo de768px não se aplica ao quadro de pessoas.

## 1. Atmosfera

Encontro adulto, direto e curioso. Densidade6/10, variação5/10, movimento3/10. Contrastes francos entre faixa carvão e conteúdo branco; voz tipográfica singular, capas verdadeiras como imagem. Limpo sem parecer painel administrativo. A assimetria ocorre dentro do deck entre capa e texto, nunca à custa de navegar com o polegar. Sem ruído, grão, confete, emojis ou falsa sofisticação de livraria vintage.

## 2. Paleta e papéis

- **Carvão** `#202322`: cabeçalho, quote principal, navegação, texto principal e saída da conversa.
- **Mineral** `#F4F4F5`: fundo de tela.
- **Superfície** `#FFFFFF`: cartões, linhas e entradas.
- **Stage** `#EBEBED`: fundo uniforme atrás de capa; não muda por livro.
- **Texto secundário** `#65676A`: autor, cidade e metadados legíveis.
- **Divisória** `#DEDFE1`: separação discreta; nunca texto.
- **Terracota** `#BB4D3B`: ÚNICO acento; botão Curtir, seleção, aspas pequenas e foco. Saturação HSL ~52%, abaixo80%. Texto branco em botão; não usar tons extras de azul/verde/roxo por status.

Superfície clara com texto carvão; superfícies carvão com branco. Estados não dependem apenas de cor: ícone/texto e aria-* correspondentes. Não usar preto puro, gradientes, glows ou cor por gênero.

## 3. Tipografia

Bricolage Grotesque600/700 para marca28/30, títulos28/32, opinião principal18/23 e nome de pessoa26/30. Tracking de marca/títulos −0.6px; corpo sem tracking artificial. DM Sans400/500/600 para UI: texto16/23, snippet15/21, tile14/18, autor14/19, metadados12/16, nav11/14. Corpo máximo60caracteres por linha; mensagens máximo30. Não usar Inter, Jakarta herdada, serifas genéricas ou falsa fonte externa obtida só renomeando fallback. Carregar arquivos locais woff2/ttf com font-display:swap e licença registrada. Fallback temporário Arial, sans-serif; não alegar fonte final se não carregou.

## 4. Componentes

Cartão de descoberta: raio16, sem pilha decorativa atrás, sem sombra de elevação exagerada. Três zonas distintas nesta ordem: pessoa, mídia do livro, voz. A identidade fica acima da mídia; a opinião não vira manchete de landing page. Tile de quadro: raio12, sem sombra, duas colunas; identidade branca no topo carvão40px, imagem contida no stage mineral140/152px e opinião branca em rodapé carvão62/66px. Cidade só no cabeçalho global. Não usar ficha branca com nome escondido no final. Capa sempre preserve a edição e não cortar texto. Perfil usa linhas de estante, sem réplica do deck. Inbox usa divisórias e miniaturas retangulares, não pessoas como círculos de livro.

Botões com alvos>=44×44; primário48 de altura ou coração60; pressionado escala0.97 por100ms. Foco3px terracota com offset3. Botões secundários brancos com borda ou neutros sobre carvão. No máximo uma intenção primária por região. Navegação tem4itens com ícones22 e nomes11/14: Descobrir, Curtidas, Conversas, Perfil. Estado ativo tem indicador e texto, não só nova cor.

Inputs DM Sans16px para evitar zoom móvel; label acessível; erro inline abaixo. Composer tem área64 e botão48. Loaders reservam exatamente áreas de capas e texto, sem spinner genérico. Vazio explica situação e uma ação útil em linguagem comum. Falha de capa preserva geometria e mostra título+autor, sem pseudo-capa imitando edição.

## 5. Layout

Aplicativo ocupa100dvh, max-width430. Sem margens de website ou área de marketing. Topbar56, segmentos44, nav72+safearea. Quadro: padding16, gap12, grid-template-columns:repeat(2,minmax(0,1fr)), inclusive360px. Duas fileiras cabem sem miniaturizar textos. Tabela de alturas em `docs/DIRECAO-V5.md`. Altura insuficiente extrema permite scroll de conteúdo e mantém navegação/ações fixas; nunca esconde ação principal. Nenhum elemento flutua sobre texto ou capa; tags de lock repetidas não são necessárias.

## 6. Movimento e interação

Só transform e opacity; transições140–220ms, cubic-bezier(.2,.8,.2,1). Swipe acompanha dedo e decide sobre a pessoa; toque lateral muda livro. A decisão tem equivalente por botão. Não usar animação infinita em controles estáveis: no contexto namoro mobile isso distrai leitura e reduz autonomia. Skeleton pode ter shimmer discreto enquanto carrega; reduced-motion o remove. Não atrasar lista com cascata. Continuidade e previsibilidade vencem coreografia.

## 7. Proibições

Sem hero, slogan, screenshots dentro da tela, moldura de telefone ou barra de status falsa. Sem substituir quadro de duas colunas por uma. Sem fonte de8–10px para acomodar conteúdo. Sem foto borrada sugerindo desbloqueio comercial. Sem gênero pintando fundo. Sem cobalto, papel amarelado, capas conceituais declaradas autênticas, retrato antes de consentimento, métricas fictícias, contadores de compatibilidade inventados ou mensagens enviadas só por abrir perfil. Sem layout dependente de contagem de testes para ser declarado aprovado.
