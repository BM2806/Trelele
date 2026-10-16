# Refino do híbrido aprovado — Trelelê

Revisão em 16/10/2026 com Designly Typography Director e Visual QA. Fonte examinada: `generated_images/exec-b68f3595-4b80-4af9-a8e7-452856ef1f92.png` (853 × 1844). É um mock estático, não uma captura do aplicativo. A preferência mais recente do usuário — aparência da proposta 3, função da 1 e ondulado — prevalece sobre a direção carvão/terracota V5 anterior.

## O que foi observado

O mock contém uma faixa amarela com marca, segmentos e nome; fotografia inclinada atravessando a divisão ondulada; título e autor; seletor Capa/Exemplar; opinião; duas decisões; navegação inferior. Há uma boa separação conceitual entre identidade, livro e voz. A escala e as sobreposições ainda disputam atenção: o nome e o título se comportam como manchetes, a foto invade a área do texto e os botões consomem muita altura.

As medidas abaixo são estimativas visuais da imagem, normalizadas para largura de 390 px. Não são medições de CSS ou DOM. A normalização corresponde a uma imagem de aproximadamente 390 × 843 px.

| Elemento | Observado no mock, aproximado | Proposta para implementação |
|---|---|---|
| Nome da pessoa | Tipografia aparente de cerca de 48–52 px | 30/33 px; 28/31 px em largura de 360 px |
| Foto do exemplar | Cerca de 360 px de altura, inclinada, cortada lateralmente | Região de mídia com 184–200 px de altura; foto contida em área definida |
| Opinião | Cerca de 32 px, três linhas com grande peso visual | 22/27 px; permitir até 4 linhas antes de “Ler mais” |
| Botões de decisão | Círculos de cerca de 74 px mais rótulos | Círculos de 52–56 px em faixa de 76–80 px, com rótulos de 13/17 px |
| Ondulado | Amplitude aproximada de 60 px, atrás da fotografia | Amplitude de 14–20 px; transição entre duas zonas, sem cruzar texto |

## Cinco ajustes, por prioridade

1. **Reduzir o cabeçalho e colocar a pessoa no início da leitura.** Marca com 26–28 px em uma barra de 52 px; filtros em alvo de 44 × 44 px. Segmentos em faixa de 40–44 px. Nome com 30 px e metadados com 14 px. Uma única indicação discreta de foto protegida; não repetir o cadeado em todas as regiões. O nome deve ganhar da marca; a opinião deve ganhar do título do livro.
2. **Confinar a mídia e preservar o ondulado.** Usar uma região de 184–200 px de altura para a capa ou a foto do exemplar. A capa real conserva proporção e texto integral, normalmente com largura de 104–120 px e altura de 156–180 px. A foto do exemplar tem janela aproximada de 168 × 184 px, sem rotação decorativa ou sombra larga. O usuário controla o enquadramento; não cortar automaticamente título ou mãos. O ondulado é uma passagem de cor de 14–20 px, nunca máscara sobre letras ou controle.
3. **Dar à opinião espaço próprio e escala de conversa.** “Por que escolhi esse” em 13/18 px, opinião em 22/27 px e complemento em 15/21 px. Título do livro em 22–24/27 px; autor em 14/19 px. Isso mantém a voz pessoal como foco, sem aparência de cartaz. Preservar as frases do estudo; as quebras de linha são naturais, sem palavras isoladas. Acima de quatro linhas, “Ler mais” expande dentro do conteúdo com rolagem e sem deslocar a navegação.
4. **Fazer o app ocupar a tela; usar no máximo uma moldura interna.** Em celular, o aplicativo ocupa a largura útil, sem telefone desenhado, borda externa de dispositivo ou margens de website. Conteúdo com 16 px de margem lateral. O cartão interno é opcional: se necessário para o gesto de swipe, usar uma única superfície com raio de 16–20 px e sem cartão aninhado. Em desktop, um contêiner de no máximo 430 px serve apenas à demonstração. Área central rola; decisões e navegação ficam em regiões estáveis sem cobrir conteúdo. Considerar teclado e safe-area reais.
5. **Diminuir o ruído dos microcontroles.** “Capa” e “Meu exemplar” usam 13/17 px, com alvos de no mínimo 44 px e estado selecionado legível por forma/texto. A área compacta visual pode ter 32–36 px, mas a área interativa continua 44 px. Passar e curtir usam desenho do mesmo conjunto de ícones, traço e escala coerentes. Ícones de navegação com 22–24 px e rótulos com 11/14 px. Não usar ícone grande, sublinhado grosso e texto escuro ao mesmo tempo para marcar uma seleção.

## Tokens propostos

Valores de projeto, ainda sujeitos à verificação no front-end real:

```json
{
  "viewportReference": {"width": 390, "height": 844},
  "layout": {"gutter": 16, "gap": 12, "topbar": 52, "segments": 44, "actions": 80, "bottomNav": 72, "cardRadius": 18, "waveAmplitude": 16},
  "type": {
    "brand": {"size": 28, "lineHeight": 30},
    "person": {"size": 30, "lineHeight": 33},
    "bookTitle": {"size": 24, "lineHeight": 27},
    "opinion": {"size": 22, "lineHeight": 27},
    "body": {"size": 15, "lineHeight": 22},
    "secondary": {"size": 14, "lineHeight": 19},
    "micro": {"size": 13, "lineHeight": 17},
    "nav": {"size": 11, "lineHeight": 14}
  },
  "media": {"regionHeight": 192, "coverMaxWidth": 120, "coverMaxHeight": 180, "exemplarWidth": 168, "exemplarHeight": 184},
  "controls": {"minimumTarget": 44, "decisionDiameter": 56, "navIcon": 24}
}
```

Em uma viewport de 844 px, barra superior, segmentos, decisões e navegação consomem aproximadamente 248 px, antes de safe-areas. Restam aproximadamente 596 px para conteúdo. A composição sugerida reserva cerca de 76 px à identidade, 192 px à mídia, 62 px ao livro, 130 px à opinião e 32 px a espaçamentos. Isso é um orçamento inicial, não garantia de encaixe. Em 360 × 740 px, textos longos e tamanho de fonte aumentado devem gerar rolagem, não fontes menores ou controles ocultos.

## Inegociável

- Manter o ondulado, a voz pessoal, a identidade brasileira e o contraste entre as duas zonas do estudo. A revisão não autoriza uma nova direção visual completa.
- A capa do catálogo é suficiente: fotografia produzida não é requisito para ter um perfil interessante.
- Foto com rosto, inclusive segurando o livro, pertence à galeria protegida. Capa e exemplar sem identificação podem aparecer na descoberta. Selecionar “Exemplar” não revela a pessoa.
- Curtir decide sobre a pessoa. Alternar capa/exemplar apenas muda a mídia; abrir livro não aciona preferência.
- Navegação com quatro destinos e retorno previsível; nenhuma moldura decorativa, controle sobreposto ao texto ou conteúdo escondido atrás do rodapé.

## Parecer de Visual QA

**Direção conceitual preservável; mock ainda precisa de revisão antes de ser referência fiel de implementação.** Dois achados maiores: escala de cartaz aplicada a uma tela de uso frequente; fotografia atravessando zonas e competindo com a identidade. Um achado menor: peso excessivo nos indicadores e botões. A maior parte da altura pode ser recuperada pela mídia e pela hierarquia, sem remover o texto da pessoa.

Próxima verificação: front-end carregado em 390 × 844 e 360 × 740, com capa e exemplar reais, nomes longos, opinião extensa, texto ampliado, safe-area, teclado e estados selecionados. Verificar contraste das cores finais com cálculo e alvos reais no DOM. Esta análise visual não valida acessibilidade completa, fidelidade das fontes carregadas, conteúdo editorial da capa gerada nem funcionamento de navegação.

RevisionRequest: encaminhar à composição e à tipografia somente as cinco alterações acima. Bloquear redesenho colateral da direção escolhida, troca de paleta sem pedido e retorno ao visual V4/V5 rejeitado.

Convergência com a direção: cartão nominal de aproximadamente 515 px, com margem de 12–16 px e ondulado interno de 12–18 px. É uma meta de composição, não altura rígida: safe-areas reais, texto ampliado e conteúdo longo têm prioridade. A referência de 47/34 px de safe-area serve apenas ao aparelho simulado; implementação usa os valores do sistema. Controles de troca de mídia ficam fora da região que captura swipe.

## Segunda revisão visual — composição refinada

Fonte examinada: `generated_images/exec-e49158b1-da4e-4278-9381-7539cfe03e51.png`, também um mock estático. A composição melhorou de maneira observável: a fotografia está reta e tem limites claros; nome, título e opinião pertencem a um cartão único; o ondulado foi preservado dentro dessa superfície; Capa/Exemplar saiu do cartão e está separado das decisões. O fundo do aplicativo deixou de ser uma grande faixa amarela. Esses ajustes reduzem a disputa entre fotografia e navegação sem remover a identidade escolhida.

Restam duas limitações:

1. **O desenho ainda exagera a escala em relação aos tokens desejados.** Na normalização visual para 390 px de largura, nome e título parecem próximos de 40 e 32 px, respectivamente, e a região fotográfica tem aproximadamente 255 px de altura. São estimativas da imagem. Na implementação, manter nome 30–32 px, título 22–24 px e mídia dentro da altura disponível; não copiar literalmente os tamanhos do mock. A marca também deve ceder espaço à pessoa.
2. **Abrir perfil aparece duas vezes no mesmo cartão.** Há seta circular no canto superior e “Ver perfil” no rodapé. A versão funcional deve manter uma única ação explícita de abrir perfil; se o cartão todo for clicável, o gesto não pode conflitar com passar/curtir ou com a troca de mídia. O rodapé “Foto só depois da conversa” também não deve sugerir revelação automática: o fluxo precisa explicar o aceite dos dois no momento pertinente.

O orçamento consolidado abaixo substitui a primeira estimativa de alturas deste documento. O título e o autor pertencem à região de mídia; **não acrescentar uma faixa extra de 62 px fora dela**.

| Região | Referência 390 × 844 | Referência 360 × 740 |
|---|---:|---:|
| Safe-area superior | 47 | 24 |
| Cabeçalho | 48 | 48 |
| Segmentos | 40 | 40 |
| Intervalos somados | 24 | 24 |
| Cartão | 475 | 412 |
| Troca de mídia, fora do swipe | 48 | 48 |
| Decisões | 72 | 64 |
| Navegação | 56 | 56 |
| Safe-area inferior | 34 | 24 |
| Total | 844 | 740 |

As safe-areas da tabela são parâmetros do aparelho de referência, não valores fixos para todos os dispositivos. Conteúdo longo ou fonte ampliada pode ultrapassar o cartão nominal e exigir rolagem. Esta revisão reconhece melhoria na composição da imagem; não aprova runtime, encaixe real de CSS, comportamento de gestos ou acessibilidade completa.
