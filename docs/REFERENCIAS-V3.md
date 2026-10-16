# Margem V3 — pesquisa externa para um aplicativo móvel

Data da pesquisa: 16/10/2026. Direção editorial rejeitada; este documento trata de interface de aplicativo, ativos concretos e decisões implementáveis. Não propõe um novo moodboard de site.

## Evidência e sua extensão

Foram recuperadas páginas oficiais de Phosphor, Lucide, Google Fonts, Hinge, Breeze, Lex e Letterboxd. Um recorte de perfil disponibilizado no site oficial Breeze foi baixado temporariamente e aberto: imagem plana de uma pessoa ocupa quase toda a área; uma faixa branca inferior abriga nome e selos. Ele é uma referência pública de apresentação, não prova de todas as telas do aplicativo. Não reutilizar esse retrato no produto.

A captura oficial Letterboxd foi localizada, mas sua transferência foi bloqueada com HTTP 403. Não atribuímos detalhes visuais não observados a essa imagem. Hinge e Lex foram usados por seus padrões funcionais públicos e linguagem, não como suposta engenharia reversa de telas autenticadas. Google Fonts expõe páginas dinâmicas sem texto nesta consulta: a escolha final foi validada diretamente pelo arquivo da fonte e sua licença no repositório oficial.

## Referências de aplicativos, com aplicação concreta

| Fonte primária | Achado confirmado | O que aplicaremos | O que não copiar |
|---|---|---|---|
| [Hinge](https://hinge.co/) | A página oficial destaca respostas a prompts como forma de conhecer a pessoa e iniciar conversa. | Uma resposta pessoal curta vinculada ao livro; ação pode preservar esse contexto. | Marca, linguagem exclusiva, promessa de algoritmo ou suposta tipografia do Hinge. |
| [Breeze](https://www.breeze.social/) | O site mostra prévias de perfis, seleção limitada de pessoas e fluxo que leva ao encontro; recorte oficial de perfil foi visto. | Visual principal plano, informação direta e poucos controles. Dar um objetivo claro ao próximo toque. | Breeze elimina o chat; isso não serve ao nosso desbloqueio por conversa. Não copiar seus selos nem foto. |
| [Lex](https://www.lex.lgbt/) | Separação pública entre namoro, amigos, eventos e grupos; convites com linguagem conversacional curta. | Explicar a intenção de relacionamento e usar fala natural em microcopy. | Misturar quatro produtos na primeira navegação ou apropriar sua identidade queer. |
| [Letterboxd Apps](https://letterboxd.com/apps/) | Página oficial descreve explorar obras, diário e interações sociais. | Capas como contexto visível para identidade e descoberta de pessoas. | UI de diário/catálogo no centro do namoro; densidade de avaliações; paleta literal. |

## Ícones: comparação real

[Phosphor](https://phosphoricons.com/) é a escolha V3. Seu [repositório oficial](https://github.com/phosphor-icons/core) disponibiliza arquivos SVG e [licença MIT](https://github.com/phosphor-icons/core/blob/main/LICENSE). Foram efetivamente baixados ícones oficiais do diretório `assets/regular`; usar uma única família evita o ruído dos ícones desenhados ad hoc.

[Lucide](https://lucide.dev/license) é alternativa real, com licença ISC e avisos MIT para os desenhos herdados de Feather. É apropriado para interfaces de controles, mas nossa escolha por Phosphor é um julgamento de direção: seus símbolos livros, coração e conversa oferecem uma linguagem social consistente. Não afirmamos que uma família é objetivamente superior.

Arquivos locais ficam em `dist/assets/v3/`. Usar o sprite `icons.svg` via `<svg><use href="./assets/v3/icons.svg#heart"></use></svg>` ou os arquivos individuais. O sprite preserva os paths oficiais e altera somente o empacotamento em symbols. Conferir `PROVENANCE.json` e `PHOSPHOR-LICENSE.txt` no mesmo diretório. Nunca usar emoji como ícone estrutural.

Mapa: books → descoberta; heart → interesse/curtidas; chat-circle-dots → conversas; user-circle → perfil; sliders-horizontal → filtros; x → passar/fechar; lock-key → foto protegida; arrow-counter-clockwise → voltar; arrow-left/arrow-right/caret-right → navegação; info → detalhes; paper-plane-tilt → enviar; dots-three → mais; check → confirmação.

## Tipografia: três candidatas, uma decisão

| Família oficial | Papel considerado | Decisão |
|---|---|---|
| [Manrope](https://fonts.google.com/specimen/Manrope) | Controles e corpo com estrutura compacta. | Alternativa; não combinar com outra sans semelhante sem necessidade. |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Identidade, nomes, números e interface numa única família. | **Selecionada:** variável oficial local, pesos 200–800; usar 500, 650 e 750. |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | Corpo e texto utilitário neutro. | Alternativa legível; menos útil para estabelecer a distinção que buscamos nesta rodada. |

Essas avaliações são decisões próprias de direção, não alegações sobre qual fonte cada aplicativo pesquisado utiliza. O arquivo Plus Jakarta Sans foi obtido do repositório Google Fonts; a licença SIL OFL 1.1 foi salva ao lado. A cobertura dos caracteres em “ação conexão Você São coração gênero à ê ç ã õ Á É Í Ó Ú” foi conferida com fontTools: nenhum caractere faltou. Não foram produzidas fontes derivadas.

## Duas direções concretas

### A — Cobalto/papel, recomendada

Um app social claro, com marca cobalto escura e livros apresentados como objetos planos no card. Sem serifas, vinheta cenográfica, páginas envelhecidas, blur de livro ao fundo ou rodapé de site.

- Fundo `#F5F6FA`; superfície `#FFFFFF`; texto `#19202E`; secundário `#667085`; acento `#2449D8`; contornos `#E1E5EF`.
- Cabeçalho compacto com nome do produto e filtro. Card grande de pessoa ocupa o miolo e contém o livro em sua proporção real; não expande uma capa vertical até cortar o título.
- Nome e idade em 28–32 px, frase de contexto em 16 px; rótulos de interface 12–14 px com contraste e peso suficientes. Controles de toque de 44–48 px, ícones de 22–26 px.
- Faixa inferior dentro do card informa “Lido por …” ou motivo pessoal, seguida de ações acessíveis. O visual principal continua um livro antes da revelação; não enviar foto original e escondê-la por CSS.
- Navegação inferior com quatro destinos, Phosphor regular e rótulos; ativo sinalizado por cor mais forma/fundo discreto.
- Interesse em botão cheio cobalto; passar em controle neutro. Estados perigosos mantêm texto/ícone claros sem depender apenas de cor.
- O card se move com o dedo; avanço de livros e decisões da pessoa são gestos distintos. Detalhes em painel próprio com rolagem.

O cobalto é uma decisão de marca própria. Não deriva de atribuir essa paleta a Hinge/Breeze/Lex. Sua função é distinguir de coral Tinder e dos tons creme/terracota do Livrado, mantendo contexto social contemporâneo.

### B — Petróleo/noite

Fundo `#101A22`, superfícies `#1D2A34`, texto `#F7FAFC`, acento água `#72DCC9`, mesma fonte e mesma família de ícones. Capas têm presença e contraste; chat usa bolhas contidas. Mais próximo de experiência cultural noturna.

É a segunda opção. Ela aumenta o risco de parecer uma coleção de filmes ou de esconder detalhes em celulares sob muita luz. Exige revisão própria de contraste e, se adotada, não deve copiar o sistema visual do Letterboxd.

## O que torna V3 uma mudança real

A mudança não é pintar os mesmos blocos: substitui fonte de sistema por família oficial local, ícones inventados por um conjunto consistente e licenciado, imagem cenográfica por capa plana proporcional e múltiplos cards por uma hierarquia de aplicativo. O sucesso deve ser demonstrado no frontend e em tarefas: descobrir, trocar livro, curtir, voltar, abrir perfil e conversar.

## Arquivos e licenças

- `dist/assets/v3/PlusJakartaSans.ttf`: fonte variável oficial; SIL OFL 1.1.
- `dist/assets/v3/FONT-OFL.txt`: aviso completo da fonte.
- `dist/assets/v3/*.svg`: ícones Phosphor oficiais; MIT.
- `dist/assets/v3/icons.svg`: sprite de empacotamento próprio com os paths oficiais.
- `dist/assets/v3/PHOSPHOR-LICENSE.txt`: aviso completo dos ícones.
- `dist/assets/v3/PROVENANCE.json`: URL de origem, data, tamanho e SHA-256 de cada download.

Não houve instalação de bibliotecas, reutilização das imagens dos aplicativos nem edição de frontend nesta pesquisa. A direção selecionada requer validação visual no aparelho, contraste, foco, zoom e qualidade dos gestos.
