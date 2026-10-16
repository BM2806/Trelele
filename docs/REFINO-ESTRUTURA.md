# Trelelê — estrutura do refino 3 + 1

Pesquisa e proposta, 16/10/2026. Não é uma medição do beta em execução. Não houve acesso autenticado ao código ou ao runtime privado do Tinder ou Happn.

## Decisão

O aplicativo ocupa a tela do celular. Dentro dele há **uma superfície de pessoa com margem lateral de 12–16 px**, sem uma segunda moldura de telefone, sem painel de desktop e sem vários cartões aninhados. O fundo brasileiro e a onda aprovados continuam; a onda passa a ser uma transição interna baixa, de 12–18 px, entre livro e opinião.

A proposta 3 e a híbrida foram vistas diretamente nos PNGs gerados. O problema principal é a escala: nome, capa inclinada, título literário e botões disputam o protagonismo. Acrescentar borda e sombra ao conjunto não resolve isso. O livro pode ser suficientemente legível com 120–132 px de largura e proporção da edição preservada; não precisa ocupar meia tela nem atravessar a margem direita. O nome deve continuar antes do livro e a opinião precisa estar visível antes de decidir.

Preservar verde profundo, amarelo e creme do estudo escolhido; não substituir a direção por preto/terracota. Não alterar família tipográfica nesta rodada. Reduzir escala, peso e espaçamento conforme os papéis. Não substituir o ondulado por decoração geométrica aleatória.

## Evidência observada e limite

| Evidência vista | Observação | O que podemos transferir |
| --- | --- | --- |
| `docs/research/tinder/swipe-deck-home.png`, 1290 × 2796 | Superfície visual da pessoa quase até as bordas; navegação inferior separada; duas decisões evidentes. Os números do levantamento V5 estimam 90,2% da altura para a superfície e 6,65% para a navegação flutuante. | Hierarquia pessoa → decisão; ações permanecem fora da disputa entre texto e imagem. Não copiar o preenchimento fotográfico para uma capa estreita. |
| `docs/research/happn/help-map-overview.png`, 786 × 1704 | Mapa chega às bordas; barra inferior ocupa aproximadamente 9,8% da imagem, incluindo região inferior do sistema. | O conteúdo muda conforme o destino; não encaixar mapa, perfil e descoberta no mesmo cartão gigante. |
| `docs/research/happn/historical-main-screens.png` | Composição histórica: grid em sheet sobre mapa, perfil individual e confirmação de Crush são estruturas diferentes. | Separar descoberta, perfil e evento de match. Não afirmar que essa composição histórica é a versão atual de 2026. |
| Proposta 3, `exec-a14c69f7-d7d8-4cda-8b09-1cf85b90a6ae.png` | Nome, livro, título e opinião grandes; onda cruza o meio; navegação e decisões ao final. | Manter identidade e onda; compactar a escala para uso real. |
| Híbrida, `exec-b68f3595-4b80-4af9-a8e7-452856ef1f92.png` | Foto de exemplar e alternância Capa/Exemplar da Ana; imagem ultrapassa o espaço do livro. | Uma área de mídia estável, sem mudar a altura ao alternar capa/foto. |

Os percentuais de telas externas acima são estimativas manuais de bitmap registradas em `assets/reference-metrics-v5.json`, não dimensões de implementação do produto. Documentação oficial do Tinder confirma reciprocidade para o match; a ajuda do Happn distingue perfis da página principal e cruzamentos reais. Nenhuma fonte pública justifica tratar cada superfície desses apps como idêntica.

## Orçamento vertical proposto

Unidades lógicas de projeto: CSS px no protótipo; pt/dp exigem revisão no aplicativo nativo. São **propostas**, não medições do runtime. A soma inclui as áreas do sistema e pressupõe execução ocupando a tela inteira. As safe areas variam por aparelho/orientação; os valores abaixo são cenários de projeto, não propriedades universais dessas resoluções.

| Faixa, de cima para baixo | 390 × 844 | 360 × 740 | Tratamento |
| --- | ---: | ---: | --- |
| Área segura superior | 47 | 24 | Valor do sistema; fundo pode continuar sob ela, controles não. |
| Cabeçalho da marca e filtro | 48 | 48 | Logo menor; filtro com alvo de 48. |
| Para você / Por perto | 44 | 44 | Uma navegação secundária; não repetir o título Descobrir. |
| Respiro | 8 | 8 | Sem faixa hero adicional. |
| Nome, idade e contexto | 64 | 56 | Nome 26–28; contexto 13–14. Sem repetir trava de foto em duas linhas. |
| Livro e mídia | 220 | 176 | Capa em contain; foto do exemplar em cover com recorte controlável. Título 20–22 e autor 14–15 ao lado, sem repetir na opinião. |
| Onda | 16 | 12 | Sem interação e sem sobrepor texto. |
| Por que escolhi esse + opinião | 135 | 128 | Rótulo 13; texto 16/22, até 3 linhas iniciais; “Ler mais” abre perfil. |
| Decisões | 72 | 64 | Duas ações; visual 56 ou 48 e rótulo 16; sem cinco botões concorrentes. |
| Navegação principal | 56 | 56 | 4 destinos; ícone 22–24 e rótulo 11–12, alvo individual ≥48. |
| Área segura inferior | 34 | 24 | Não incluir outro home indicator desenhado no produto. |
| **Total** | **844** | **740** | **Sem cortar o texto, a ação ou a navegação no padrão.** |

Na imagem de geração, não pedir 3 telas comprimidas num único telefone. Entregar uma tela de descoberta isolada e, separadamente, seu estado de exemplar. Um painel comparativo pode mostrar dois aparelhos para discussão, mas a moldura de apresentação nunca vira componente do aplicativo.

Se houver barra de endereço do navegador, teclado, zoom de texto ou safe area maior, o orçamento é recalculado com a altura visual disponível. Não subtrair safe area duas vezes. Não forçar `overflow:hidden` para fazer caber. Texto ampliado e tradução longa permitem rolagem vertical do conteúdo; decisões e navegação não cobrem a última linha. A referência compacta não autoriza reduzir texto do corpo abaixo de 16.

## Microinterações e transições

| Origem/ação | Resultado | Regra para evitar conflito |
| --- | --- | --- |
| Descobrir → Capa / Exemplar da Ana | Troca somente a mídia daquele livro | Controle explícito por toque, alvo ≥48. Não criar carrossel horizontal dentro de um cartão que já pode ser arrastado para decidir. |
| Descobrir → arrastar horizontalmente | Passar ou curtir a pessoa | Só inicia na superfície inerte; exclui botões e controles. Movimento vertical, curto ou cancelado não decide. Borda do sistema preserva voltar. |
| Descobrir → nome, Ler mais ou botão Perfil | Perfil completo | Tela própria com voltar; preserva livro, mídia, posição e pessoa na origem. Texto longo não vira bottom sheet interminável. |
| Por perto → pessoa | Mesmo perfil, origem Por perto | Voltar retorna ao quadro e posição anteriores. Distância aproximada, sem rastrear endereço. |
| Curtir recíproco | Confirmação de match | Duas ações: conversar ou continuar. Sem revelar foto. |
| Conversas → conversa | Histórico e compositor | Navegação de raízes sai desta tela; voltar e nome da pessoa no cabeçalho. Teclado não desloca a conversa para baixo da barra inferior. |
| Perfil → buscar livro | Busca por título/autor e escolha da edição | Teclado e resultados pertencem à busca; cancelar preserva o perfil. Edição selecionada precede texto e mídia opcionais. |
| Foto da pessoa segurando o livro | Galeria protegida | Não vira imagem pública do exemplar. O mockup não comprova classificação automática de rostos nem proteção de arquivos. |

Ações têm equivalentes por botão; nenhum fluxo exige swipe. Animar a transição da mídia com fade curto, sem rotação permanente ou capa flutuando; respeitar redução de movimento. A onda não precisa se mover. Área clicável pode ser maior que o ícone: refinamento visual não significa alvo pequeno.

## Fontes primárias consultadas

- Apple, Layout: https://developer.apple.com/design/human-interface-guidelines/layout — safe areas, margens e adaptação. Não estabelece uma altura fixa de tela para todos os aparelhos.
- Android Accessibility, Touch target size: https://support.google.com/accessibility/android/answer/7101858?hl=en — alvos de pelo menos 48 × 48 dp e espaçamento recomendado. Ícone visual pode ser menor.
- Material 3, Navigation bar: https://m3.material.io/components/navigation-bar/overview — navegação entre destinos da interface em aparelhos pequenos. Não usar a altura de uma variante Material como obrigação para este app.
- Tinder Overview: https://www.help.tinder.com/hc/en-us/articles/115004647686-Tinder-Overview — reciprocidade e match; não disponibiliza seu código-fonte.
- Happn, perfis da página principal: https://support.happn.fr/hc/en-us/articles/15702776421405-Who-are-the-profiles-that-show-up-on-my-Main-Page — distingue cruzamentos e alcance de perfis.
- Happn, imagem de mapa de suporte: https://support.happn.fr/hc/en-us/articles/15703631805853-What-is-the-happn-Map — fonte do bitmap local visto.
- Happn Design, composição histórica: https://dribbble.com/shots/21734525-New-Happn-App-Main-screens — referência histórica de composição; não evidência de runtime atual.

## Critério de aceite visual

Comparar o novo desenho com a proposta 3 nos dois tamanhos. Nome, livro, opinião e duas decisões aparecem na primeira tela. Capa não encosta na borda direita, não corta texto e não fica maior ao trocar de mídia. A onda continua reconhecível com amplitude contida. Navegação não parece um rodapé de site. Só depois desse confronto a direção está pronta para implementação e validação no render real.
