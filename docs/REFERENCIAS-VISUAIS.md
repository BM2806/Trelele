> HISTÓRICO V1: referências editoriais. A direção ativa foi corrigida para a dinâmica de app de encontros. Consulte REFERENCIAS-INTERACAO.md, DINAMICA-TINDER.md e UX-V2.md.

# Margem — referências externas e direção visual

Pesquisa realizada em 16/10/2026. “Margem” é nome de trabalho, sem pesquisa de disponibilidade marcária.

## Método e limite da evidência

O ECC e seu catálogo foram lidos. O recurso `brand-discovery` foi consultado como referência, mas sua entrevista não foi executada: o trabalho aqui é pesquisa visual delimitada, não um brandbook validado pelo fundador.

As oito páginas oficiais abaixo foram recuperadas pela pesquisa web. A leitura confirma sua organização de conteúdo e suas propostas públicas. Não houve captura visual de telas, inspeção pixel a pixel, teste de aplicativo autenticado nem medição de usabilidade. As decisões de cor, tipografia, espaçamento e composição deste documento são propostas próprias para o Margem; não são propriedades visuais alegadamente extraídas dos produtos pesquisados.

`assets/references.json` contém os mesmos links, aplicação proposta, limites de uso, data e identificadores de evidência. É um repositório de referências, não uma coleção de imagens licenciadas prontas para produção.

## Referências e tradução para o produto

| Fonte oficial | Evidência recuperada | Aplicação original no Margem | Evitar |
|---|---|---|---|
| [Bookshop.org](https://bookshop.org/) | Listas de livros por curadores e temas. O domínio redirecionou para sua operação britânica nesta consulta. | Uma estante escolhida pela pessoa, com motivo para cada livro. | Fazer a descoberta parecer uma loja ou copiar listas/capas. |
| [MUBI Notebook](https://mubi.com/en/notebook) | Busca de artigos, exploração por temas e publicação cultural. | Pequenas aberturas editoriais para conversar. | Transformar o aplicativo em revista extensa ou importar suas imagens. |
| [Letterboxd](https://letterboxd.com/) | Opiniões, listas, diário e interação em torno de obras. | Livro mais resposta pessoal como unidade de interesse. | Pontuação pública de pessoas ou estética literal do Letterboxd. |
| [Apartamento](https://www.apartamentomagazine.com/) | Histórias, conversas, retratos e catálogo editorial. | Perfil como pequena entrevista com voz própria. | Fotografia de catálogo ou reprodução de seu masthead. |
| [The StoryGraph](https://www.thestorygraph.com/) | Descoberta por humor, ritmo e temas; leituras entre amigos. | Afinidades explicadas sem depender de livros idênticos. | Gráficos que prometem medir atração ou formulário de leitor acadêmico. |
| [Are.na](https://www.are.na/) | Coleções, organização e descoberta de pessoas através de conteúdo. | Seleção pessoal de poucas obras e opiniões. | Grade interminável ou uso da fonte proprietária Areal. |
| [London Review of Books](https://www.lrb.co.uk/) | Títulos, autores, resumos e arquivo por assuntos. | Uma opinião forte em destaque com metadados secundários. | Densidade de jornal na navegação de uma mão. |
| [Unsplash — licença](https://unsplash.com/license) | Página de licença para futuras imagens ambientais. | Pesquisa posterior de ambientes de leitura para divulgação. | Fingir que retratos de banco de imagens são usuários. |

## Direção vencedora: página de uma pessoa

A descoberta abre em uma pessoa por vez, com contexto suficiente antes de qualquer ação. O objeto central é uma opinião pessoal sobre um livro. A fotografia permanece ausente enquanto não autorizada; a composição não depende de um rosto borrado gigante.

Ordem sugerida: nome e idade; região aproximada; intenção de relacionamento; resposta pessoal em destaque; dois ou três livros associados; afinidade factual; ações “Passar” e “Tenho interesse”. A ação de interesse pode carregar o livro ou a opinião que a motivou. Perfil completo acessível com rótulo explícito.

O livro serve de entrada para conhecer alguém. Uma nota de rodapé editorial, como “Vocês escolheram dois livros em comum”, deve ser uma afirmação verificável. Não mostrar percentuais arbitrários de compatibilidade.

### Sistema visual proposto

- Superfície principal `#FAFAFA`, superfícies secundárias `#F4F4F5`, texto `#18181B`, texto secundário `#52525B` e divisórias `#D4D4D8`.
- Acento de marca único em terracota escura `#9A3E2B`. Verificar contraste no contexto real antes de fechar os tokens. Erros usam rótulo e ícone, não apenas cor.
- Tipografia editorial com serifada de personalidade para respostas e títulos; sans legível em controles. A fonte concreta exige licença documentada e teste de português. Preferência inicial: família de sistema até selecionar os arquivos definitivos.
- Títulos de 32–44 px nas telas de descoberta; texto de leitura de 17–18 px; controles legíveis de pelo menos 16 px. Respeitar escala de texto e zoom.
- Separações por espaço e linhas; cantos discretos. Reserva de grandes arredondamentos para botões, sem transformar todo conteúdo em cápsula.
- Microanimação curta para interesse e mudança de perfil; respeitar `prefers-reduced-motion`. Nenhuma animação contínua obrigatória.
- Capas mantêm proporção e não ocupam toda a tela. Para protótipos, usar capas gráficas fictícias explicitamente demonstrativas até validar as fontes reais.

### Aplicação por tela

| Tela | Hierarquia | Elemento próprio |
|---|---|---|
| Descobrir | Opinião → pessoa → livros → afinidade → ação | “O livro que eu defenderia numa discussão”. |
| Perfil | Identidade básica → três respostas → estante | Uma pessoa é mais que uma lista de títulos. |
| Conexões | Conversas ativas → novas conexões | Prévia da opinião que aproximou o par. |
| Conversa | Texto → resposta → contexto opcional | Livro compartilhado acessível sem interromper o chat. |
| Revelação | Explicação → escolha privada → resultado bilateral | “As fotos aparecem quando os dois escolherem revelar.” |
| Preferências | Filtros essenciais → privacidade | Linguagem direta e distância aproximada. |

## Duas direções rejeitadas

1. **Aplicativo de namoro com capas no lugar de rostos.** Preserva o hábito de julgar rapidamente e transforma identidade em catálogo. A pessoa perde voz; capas conhecidas dominam o interesse.
2. **Caderno vintage romântico.** Papel sépia, letras manuscritas, ornamentos e corações literários criam um clichê, prejudicam leitura e estreitam o público. O tom editorial deve vir da hierarquia e da escrita, não de envelhecer visualmente a interface.

## Política do repositório de imagens

Nenhuma imagem dos sete produtos de referência está autorizada para publicação por constar neste documento. Links são referência somente. Não fazer hotlink nem incorporar logos, avaliações ou fotos de seus usuários.

Novos ativos devem registrar: URL da obra específica, autor, licença, data de consulta, permissões aplicáveis, crédito exigido e arquivo local correspondente. A licença geral do Unsplash não dispensa conferir a origem de cada ativo e direitos relativos a pessoas ou marcas. Unsplash+ possui licença própria.

Fotos de perfis devem vir de seus próprios usuários, com regras de acesso do produto. Fotos ambientais de banco não são perfis. Capas de livros reais dependem de fonte e condições de uso verificadas. Ausência de capa usa título e autor em um tratamento tipográfico original.

## Validação antes de chamar o layout de aprovado

- Testar com adultos leitores de gêneros e níveis de leitura diferentes, incluindo romance popular, quadrinhos e audiolivros.
- Observar se alguém entende em poucos segundos que se trata de encontros românticos, quem está vendo e o que acontece ao tocar em interesse.
- Confirmar que a regra de revelação é entendida sem ajuda e sem sugerir obrigação de revelar.
- Verificar contraste, foco, leitor de tela, 200% de texto, 320 px de largura e alternativa aos gestos.
- Comparar duas composições reais da descoberta com conteúdo idêntico. Medir compreensão e conclusão das tarefas, sem afirmar superioridade apenas por preferência estética.

## Fontes e rastreabilidade

- Bookshop.org: `turn28view3` e `turn24search0`.
- MUBI Notebook: `turn28view0`.
- Letterboxd: `turn28view1`.
- Apartamento: `turn26view0`.
- The StoryGraph: `turn26view1`.
- Are.na: `turn26view2`.
- London Review of Books: `turn28view2`.
- Unsplash License: `turn30view0`.

Esses identificadores permitem rastrear a consulta desta sessão; os URLs oficiais acima permanecem a referência externa de consulta.
