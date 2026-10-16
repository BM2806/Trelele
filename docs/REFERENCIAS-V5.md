# Trelelê V5 — referências medidas, decisões de escala

Pesquisa em 16/10/2026. As versões anteriores continuam rejeitadas; este documento não as declara aprovadas. Nenhum frontend foi alterado nesta frente. A conclusão é mudar a ocupação da tela, a hierarquia e o ritmo da descoberta, preservando o contrato de navegação em `FLUXOS-V4.md`.

## Conclusão aplicável

O card precisa parecer a apresentação de **uma pessoa**. No Tinder observado, a mídia e as decisões ocupam praticamente toda a tela; no Happn oficial, nome grande, mídia larga e ações no terço inferior têm hierarquia inequívoca. A interface não é uma coleção de caixas pequenas com explicações. Para Trelelê, a capa é a mídia da pessoa: grande, com uma frase pessoal legível e nome/idade inequívocos. Trocar livro não troca pessoa. O perfil completo continua em tela própria.

O grid do Tinder Explore é uma coleção de experiências, não prova de grid de pessoas. O mapa Happn atual também não é grid: tem agrupamentos e lugares. A referência para duas colunas de pessoas vem da composição histórica Happn e do exemplo Expo, com limites registrados abaixo. Trelelê pode adotar esse padrão como adaptação explícita.

## Método e limites da medição

Li `FLUXOS-V4.md`, manifests Tinder/Happn e fonte de dois repositórios MIT. Abri as imagens com `view_image`, inclusive três capturas do exemplo Expo. PIL leu os tamanhos reais dos arquivos; nenhum arquivo de imagem foi editado. As coordenadas de elementos são **estimativas visuais anotadas**, com tolerância aproximada de ±0,005 da largura/altura para bordas claras. Não são medição DOM, CSS do aplicativo proprietário, teste de toque ou operação autenticada. Fontes de título em capturas não foram deduzidas a partir de altura de pixels.

`assets/reference-metrics-v5.json` guarda tamanho original, SHA256, bounding boxes em pixels, coordenadas normalizadas e propostas em CSS px. Isso torna reproduzível a conta; não converte estimativa visual em medição automática. As capturas independentes não informam versão/data do aplicativo. O toast do Tinder cobre o topo: não inferir appbar por trás dele.

## Seis referências selecionadas

| Ref | Evidência e URL exata | O que foi realmente inspecionado | Limite e decisão |
|---|---|---|---|
| R1 | Tinder, oficial histórico, 18/07/2017: https://www.tinderpressroom.com/tap-into-a-new-look-on-tinder/ | `docs/research/tinder/2017-tappy.png`, 600×259. Quatro telas com toque lateral, zona inferior de abrir perfil e ações separadas. O texto oficial descreve precisamente essas zonas. | Não representa universalmente2026. Usar a separação de gestos; não copiar decoração2017. |
| R2 | Tinder, capturas independentes: https://revyl.com/atlas/tinder/ ; arquivos https://pub-b85a7585b1c04c99aa7d0eca27c0d3dd.r2.dev/tinder/swipe-deck-home.png e https://pub-b85a7585b1c04c99aa7d0eca27c0d3dd.r2.dev/tinder/explore-tab.png | `swipe-deck-home.png` e `explore-tab.png`, ambas1290×2796. Card quase integral, X/coração grandes, nav inferior com labels. Explore tem destaque horizontal e duas colunas. | Capturas já disponíveis no workspace; tentativas anteriores403 estão em `flows-downloads.json`. Não afirmar novo download ou data da versão. Imagens apenas evidência, não assets do produto. |
| R3 | Happn oficial: https://support.happn.fr/hc/en-us/articles/15706830983581-What-s-a-SuperCrush ; https://support.happn.fr/hc/en-us/articles/15703631805853-What-is-the-happn-Map | `help-supercrush.png`1125×2436 e `help-map-overview.png`786×1704. Nome acima da mídia; ações sobre conteúdo abaixo; nav escura. Mapa tem clusters32/1 e lugares. | Artigos/labels de épocas distintas: perfil usa Explore/Browse, mapa Home/Vibes. Não fundir em uma versão inventada. Localização/movimentos exatos não são exibidos segundo documentação. |
| R4 | HappnDesign, composição histórica: https://dribbble.com/shots/21734525-New-Happn-App-Main-screens ; imagem https://cdn.dribbble.com/userupload/7795512/file/original-49fdbfeabdeac02778f01fde9bd49717.png | `historical-main-screens.png`,2048×1536. Tela esquerda: lugar e grade2colunas; centro: perfil; direita: Crush com conversar e ver perfil. | É composição promocional com molduras; não medir a imagem inteira como viewport. Não comprova grid atual. Aceitar sequência lugar→pessoa→conversa como referência, não GPS real na demo. |
| R5 | Steven Persia, app demonstrativo Expo/RN: https://github.com/stevenpersia/tinder-expo/tree/c777c0900ff8e3ff39ca1c0ff37f62daa6250e59 | Código de layout e capturas1/2/3 abertas. Quatro tabs; card, grid e lista de mensagens. MIT2021 Steven Persia, licença preservada na evidência. | Não é fonte interna do Tinder. README diz inspiração Dribbble. Botões do card são `TouchableOpacity` sem `onPress`: aparência não demonstra fluxo funcionando. |
| R6 | Componente RN de Joehoel, fork de Skipperlla: https://github.com/Joehoel/rn-tinder-card/tree/5a26191931210b47bc88db213efd28291a73d261 | `src/CardItem.tsx`, `src/utils/index.ts`, `example/src/App.tsx`, LICENSE. MIT2023 Skipperlla. Há springback, rotação e callbacks separados. | É componente de gesto, não app completo. Exemplo380×730 não cabe em360; defaultvertical habilitado não serve ao contrato Trelelê. Usar lógica como referência, sem instalar dependências. |

Comportamento primário adicional verificado: https://tinder.com/ confirma reciprocidade→match→mensagem; https://www.help.tinder.com/hc/en-us/articles/38094560737677-Explore descreve experiências com swipe/match. O artigo oficial Happn Map consultado exibe atualização15/10/2026 e explica grupos de cruzamentos e Spots. Isso não demonstra uma sessão real operada por nós.

## Geometria observada

W/H abaixo significam largura/altura total do arquivo de captura, incluindo status/safe area representados. As conversões para390/360 são **projeções proporcionais para comparação**, não CSS real desses aplicativos.

| Elemento observado | Fração W/H aproximada | Projeção390×844 | Projeção360×740 | Implicação |
|---|---:|---:|---:|---|
| Tinder Swipe: card até a base | y0–0,902H | base762 | base668 | A pessoa domina a tela; evitar card pequeno dentro de dashboard. Topo encoberto. |
| Tinder Swipe: nav flutuante | x0,050W; y0,911H; h0,067H | x19;y769;h56 | x18;y674;h49 | Faixa inferior estável, labels visíveis. Somar proteção inferior no produto. |
| Tinder Swipe: botões X/coração | diâmetro0,154W; centro y0,851H |60; centro718 |55; centro630 | Ações frequentes ao alcance inferior; não viram links pequenos. |
| Tinder Explore: destaque | w0,961W; h0,296H |375×250 |346×219 | Uma imagem forte antes do grid; evitar inventar cinco opções equivalentes. |
| Tinder Explore: tile de grid | w0,471W; h0,326H; gap0,019W |184×275;gap7 |170×241;gap7 | Ratio da mídia~2:3; duas colunas de modos, não pessoas. |
| Happn perfil: mídia | x0,064W;y0,208H;w0,873W;h0,503H | x25;y176;340×425 |x23;y154;314×372 | Nome fora da mídia, sem texto longo sobre foto. |
| Happn perfil: ações | centro y0,828H; botões~0,171W | centro699;67 |centro613;62 | Área de decisão pode sobrepor conteúdo mas deve preservar leitura e scroll. |
| Happn perfil: nav com inset inferior | y0,897H; h0,103H | base87 |base76 | Não confundir ícone com altura total da barra. |
| Happn mapa: nav com inset inferior | y0,902H; h0,098H |base83 |base73 | Relação semelhante em imagem de outro tamanho. |

Na composição histórica Happn, a tela esquerda foi examinada como subimagem visual: área interior aproximada434×940 nas dimensões exibidas; tiles de mídia168×211 com gap24. Isso dá mídia~0,39W, gap~0,055W e razão~0,80. Não atribuir a essa composição um viewport de aparelho conhecido; não há DOM/escala CSS recuperados.

## O código aberto mostra também o que rejeitar

R5, arquivos em URLs permanentes:

- https://github.com/stevenpersia/tinder-expo/blob/c777c0900ff8e3ff39ca1c0ff37f62daa6250e59/components/CardItem.tsx : mídia principal`W−80 ×350`; variante`W/2−30 ×170`; nome30/15. Em390/360, principal310×350/280×350, grid165×170/150×170. Dimensões efetivamente declaradas no código, sem medir runtime.
- https://github.com/stevenpersia/tinder-expo/blob/c777c0900ff8e3ff39ca1c0ff37f62daa6250e59/assets/styles/index.ts : botões60e40, marginHorizontal7, paddingVertical30 no grupo; headerpaddingTop50, título22; avatar60 e marginVertical15. A captura inspecionada mostra a consequência: card branco, bordas largas e espaço decorativo. É um exemplo de escala de controles, não direção estética para V5.
- https://github.com/stevenpersia/tinder-expo/blob/c777c0900ff8e3ff39ca1c0ff37f62daa6250e59/screens/Matches.tsx : `FlatList numColumns={2}`. `screens/Messages.tsx` usa lista de pessoas. `screens/Home.tsx` desabilita swipevertical. `App.tsx` define quatro roots e oculta header do stack. Não inventar altura exata da tabbar: o código a delega ao navegador.

R6, arquivos permanentes:

- https://github.com/Joehoel/rn-tinder-card/blob/5a26191931210b47bc88db213efd28291a73d261/src/CardItem.tsx : distingue eixo dominante no fim do gesto; retorno à origem quando não há destino; callbacks de direção separados; rotação default−10°a10°. Vertical defaultfalse no sentido de `disableTopSwipe/disableBottomSwipe=false`, portanto está **habilitado**.
- https://github.com/Joehoel/rn-tinder-card/blob/5a26191931210b47bc88db213efd28291a73d261/src/utils/index.ts : projeta`deslocamento +0,2×velocidade` e escolhe snap mais próximo. Com pontos−W/2,0,+W/2, o limiar sem velocidade éW/4; não afirmar que a decisão só ocorre emW/2. Spring de retorno damping15/stiffness120/mass0,5.
- https://github.com/Joehoel/rn-tinder-card/blob/5a26191931210b47bc88db213efd28291a73d261/example/src/App.tsx :380×730, radius48 e botões próximos à base. Esses valores fixos devem ser rejeitados em360; usar tamanho do espaço disponível e um único comando de decisão compartilhado entre gesto/botão.

As cópias locais ficam em `docs/research/v5/expo/` e `docs/research/v5/rn-tinder-card/`, com licenças. Não copiamos fotos desses exemplos para perfis Trelelê.

## Contrato proposto para direção_v5 e frente_v5

Usar viewport CSS visual, não pixels físicos do screenshot. A tabela assume safe-area zero; no dispositivo subtrair insets reais antes de resolver a área do card. Não somar uma statusbar falsa de aparelho à aplicação web.

| Região proposta |390×844 |360×740 |
|---|---:|---:|
| Appbar discreta |h56 |h56 |
| Seletor Para você/Por perto |y56;h44 |y56;h44 |
| Card da pessoa |x12;y110;366×568 |x12;y110;336×464 |
| Faixa de ações |y678;h72 |y574;h72 |
| Botões de decisão |60×60 |60×60 |
| Navegação inferior |y760;h84 |y656;h84 |
| Grid local |margem16;gap12;tile173 |margem16;gap12;tile158 |
| Mídia do tile3:4 |173×231 |158×211 |
| Identidade / corpo / metadados / nav |28/32;16/22;13/18;12/16 |mesmos tamanhos; reduzir espaço, não fonte |

A fórmula do card é`W−24 × H−276`. É proposta de composição, não reprodução de dimensões Tinder. A faixa de ações termina10px antes da nav, por construção. Em altura curta, cortar texto secundário ou permitir scroll no detalhe; não empurrar ações para fora. Validar fonte ampliada separadamente.

**Para direção_v5:** eleger uma mídia dominante, nome/idade forte, frase pessoal curta e marca pequena. Evitar cabeçalho editorial alto, ilustrações repetidas, chips em excesso e texto de instrução permanente. O livro diferencia a proposta; a apresentação e decisão continuam sendo sobre pessoa. Grade local mostra duas colunas com imagem grande e identidade clara. Decisão no perfil, sem corações escondidos no tile.

**Para frente_v5:** reservar regiões antes de pintar; eliminar alturas fixas herdadas que competem entre si; fazer card responder à altura real; conservar navegação e zonas de toque; compartilhar callback idempotente de decisão. Swipevertical/cancelado volta ao repouso; tap após drag não troca livro; tap de mídia não curte; nome/info abre detalhe. Conteúdo em pessoa rola, nav raiz não reaparece no detalhe. Validar os oito percursos de `FLUXOS-V4.md` sem usar quantidade de testes como prova de aprovação visual.

## Estado da entrega

Evidência local inspecionada, duas fontes MIT fixadas por commit e métricas registradas. Sem navegador/servidor instalado, sem sessão autenticada, sem alegação de teste em aparelho. O próximo aceite precisa ser visual no tamanho real e depois comportamental; esta pesquisa resolve os critérios objetivos de escala e não substitui o julgamento do usuário.
