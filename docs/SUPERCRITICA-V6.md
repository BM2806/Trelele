# Supercrítica V6 — preflight independente

**APROVADO PARA GERAR, com as condições abaixo.** Aprovação do plano; a imagem resultante ainda exige revisão independente.

Inspecionei o híbrido rejeitado e a referência 3. O híbrido deixa três sistemas sem relação suficiente: cartão de apresentação, seletor de mídia e decisão em bolas. O problema é de agrupamento e hierarquia, não de coordenadas. Apenas subir ou diminuir as bolas continua rejeitado.

## Condições obrigatórias

- Uma única superfície representa Ana e contém sua decisão. O rodapé é a última faixa do próprio cartão: mesma base, limites laterais e continuidade de fundo. Não acrescentar painel, subcartões ou botões circulares. Separação por uma linha discreta é suficiente.
- O olhar deve seguir **Ana → opinião pessoal sobre o livro → decisão**. A capa apoia a apresentação; não pode ser a única protagonista. A opinião, em serif expressiva, é a principal âncora narrativa. Nome e imagem não disputam simultaneamente a maior massa visual.
- Rodapé com duas áreas de toque equivalentes, 48–56 px de altura: X de 18–20 px + “Passar”, neutro; coração de 18–20 px + “Curtir”, verde, com leve tom verde apenas nessa metade. Ícone e texto em linha. Não usar vermelho chamativo, enormes massas verdes ou subcartões. O contexto deve tornar inequívoco que se curte Ana, e não o livro.
- “Capa / Exemplar” é um controle textual compacto imediatamente associado à imagem. Não ocupar uma faixa independente entre cartão e decisão. Indicar o estado selecionado por texto, traço ou peso, sem grande cápsula.
- Preservar verde-mata, amarelo, marfim, serif expressiva e onda **dentro do cartão**. Onda não corta texto nem se transforma em segundo painel. Foto de pessoa permanece ausente.
- Trocar “Foto só depois da conversa” por **“Foto após conversa e consentimento dos dois”**. Sem sugerir que conversar desbloqueia automaticamente a foto.
- Composição pensada para 390 × 844, sem indicadores do sistema no frame. Marca ~28; nome 28–30; opinião 20–22/27; mídia 180–200 de altura. O conjunto completo e a decisão devem caber acima da navegação fixa com quatro destinos, sem sobreposição nem corte. Não reduzir textos auxiliares a tamanhos ilegíveis para forçar o encaixe.

## Prompt recomendado

Crie uma tela mobile adulta de encontros por livros, Trelelê, em proporção 390 × 844. Preserve a personalidade da referência 3: serif expressiva, verde-mata, amarelo quente, marfim e onda orgânica. Reconstrua a hierarquia e o agrupamento do híbrido: um único cartão de pessoa com margem lateral de 12–16 px; amarelo e onda internos. Ana, 29; São Paulo; quer um namoro. A opinião “Li na escola e odiei. Reli aos 28 e levei um susto.” é a âncora narrativa; imagem do exemplar de A hora da estrela, de Clarice Lispector, contida e secundária. Controle textual compacto Capa / Exemplar junto à mídia. Inclua “Foto após conversa e consentimento dos dois”. A decisão encerra o próprio cartão: duas metades contíguas na mesma superfície, ícones pequenos com texto em linha, Passar neutro e Curtir verde com fundo muito suave. Nada de bolas, painel flutuante ou subcartões. A navegação inferior separada tem Descobrir, Curtidas, Conversas, Perfil. Todo o conteúdo da primeira pessoa e suas ações cabe acima da navegação. Renderize uma interface plausível, sem foto de pessoa, sem objetos invadindo texto e sem espaço morto entre conteúdo e decisão.

## Gate do resultado

Rejeitar se: (1) coração/X ainda parecem objetos independentes; (2) seletor vira terceira camada solta; (3) decisão parece curtir livro em vez da pessoa; (4) identidade editorial some em um catálogo genérico; (5) rodapé ou navegação encobre conteúdo; (6) consentimento mútuo fica ausente. Inspecionar a imagem antes de aprovar implementação.

Skills aplicadas: Designly visual-qa e composition-director.

---

## Resultado V6 — inspeção independente

Imagem: `exec-162d3d89-28cf-4500-b390-73ca0a60b3c2.png`.

**ACEITE PARCIAL: agrupamento da decisão aprovado. Tela completa ainda não aprovada para implementação fiel à imagem.** O preflight aprovou uma direção; não equivale a aprovação automática do resultado.

### Resolvido

- X/coração agora pertencem ao cartão: continuidade da superfície, divisória fina, texto em linha e ausência de bolas. Há mudança estrutural, não apenas deslocamento vertical.
- “Curtir a Ana” remove a ambiguidade entre pessoa e livro. Passar tem menor intensidade visual, sem vermelho estridente.
- Capa/Exemplar fica junto à imagem, com estado reconhecível e sem terceira cápsula flutuante.
- Onda, paleta e serif mantêm a identidade. Consentimento mútuo está explícito e não há fotografia da pessoa.

### Pendências para o próximo desenho/DOM

**P1 — “Ver perfil” ausente.** O modelo omitiu o acesso solicitado. Repor um link textual discreto e explícito no cartão, associado à identidade ou à faixa de privacidade; não criar novo painel nem substituir a ação de curtir. Nenhuma seta sem rótulo como único acesso.

**P1 — hierarquia ainda não cumpre o preflight.** Nome, capa e título do livro disputam a âncora principal. A opinião está legível, porém abaixo de um longo bloco dedicado ao objeto. Reduzir nome para 28–30 e mídia para 180–200 de altura na UI real; reduzir o título do livro para que não seja maior que a opinião. Manter a frase pessoal em 20–22/27, com prioridade narrativa e espaço útil. Isso exige redistribuir proporções internas; não basta diminuir tudo uniformemente ou mover o rodapé.

**P2 — massa e espaço vertical.** O cartão termina com um vazio perceptível antes da navegação. A decisão já está integrada, mas ainda é alta para o tamanho final pretendido. No DOM, manter áreas de toque 48–56 e usar o espaço recuperado para leitura e acesso ao perfil, sem inflar containers.

O arquivo é um mock raster, não prova medidas CSS, alvos de toque ou comportamento. Reduzido proporcionalmente a 390 px, sugere nome e mídia maiores que o budget proposto. Validar screenshot real em 390 × 844 antes da aprovação final; não transferir coordenadas do raster literalmente.

### Plano de correção autorizado por esta revisão

Preservar exatamente o princípio já aprovado de rodapé contíguo e seletor ancorado à mídia. Reequilibrar as escalas internas nos limites acima e incluir “Ver perfil” textual. Não adicionar novas superfícies, círculos, fotos de pessoas ou decoração. Este plano corretivo está aprovado para preparação do desenho/DOM; o resultado continua sujeito a inspeção antes de aceite final. Se a etapa seguinte depender de implementar a imagem como referência integral, **parar e corrigir estas pendências primeiro**.

---

## Novo briefing após rejeição do usuário — plano imersivo

**PLANO APROVADO PARA UMA PRANCHA TARGET.** O aceite parcial anterior é insuficiente para a direção atual. O usuário rejeitou o resultado inteiro por falta de energia, predominância branca e ausência perceptível de experiência de encontros. Não prosseguir com microcorreções daquele mock.

Referências inspecionadas: `docs/research/tinder/swipe-deck-home.png` e `user-relationship.jpg`. Elas mostram cartão de descoberta dominante, identidade vinculada à mídia, informação secundária sobre o próprio contexto e destino ativo reconhecível. A segunda referência mostra também resumo de intenção no cartão e aprofundamento em uma superfície própria. Não transportar fotos de pessoas, notificações, excesso de ações ou botões circulares.

### Contrato composicional aprovado

1. Canvas verde-mata escuro une cabeçalho, deck e navegação. O verde sozinho não constitui redesign. Marca discreta, Para você / Por perto compactos, quatro destinos com estado ativo materialmente evidente e área de toque real.
2. Um cartão de descoberta domina aproximadamente 80% da região entre cabeçalho e navegação. Margens estreitas, composição imersiva e um indício discreto de próxima pessoa tornam o deck espacialmente perceptível. Sem pilha de vários subcartões.
3. A mídia editorial é o ambiente do cartão, com exemplar real ou capa reconhecível, enquadramento deliberado e materialidade. Não uma miniatura de produto flutuando numa ficha. Não distorcer, inventar lombadas ou escrever texto sobre a capa para fabricar energia.
4. Uma área amarela orgânica, incorporada ao próprio cartão, sustenta identidade e opinião. Nome em grotesk ~32, frase pessoal serif 20–22, curta e expressiva. A onda organiza as massas de cor e leitura; não é enfeite entre duas fichas. A capa não pode recuperar o domínio semântico sobre a pessoa.
5. Local e intenção ficam compactos junto à identidade. O acesso ao perfil é único: ícone de informação com área 44–48 ou nome com affordance inequívoca e rótulo acessível. Não repetir dois acessos concorrentes nem esconder a informação em gesto secreto.
6. Decisão encerra o cartão numa faixa contínua, com ícones ~20, texto ~14 e áreas 48–56. “Passar” e “Curtir a Ana” permanecem integrados. Não ressuscitar bolas por parecerem mais jovens.
7. Três miniindicadores representam os livros **da mesma pessoa**, não progresso entre pessoas. Toque nas zonas laterais ou nos indicadores muda o livro; arrasto horizontal decide a pessoa. Evitar dois carrosséis horizontais concorrentes. Capa/Exemplar permanece próximo à mídia e abre apenas um controle curto, sem nova faixa permanente.
8. Foto de pessoa continua bloqueada até conversa e consentimento dos dois. Mostrar essa regra no acesso ao perfil/chat sem transformá-la em um bloco dominante da descoberta.

### Experiência que o protótipo precisa provar

Deck com arrasto visível e feedback durante o gesto; passar/curtir também por botão; perfil → voltar preservando pessoa e livro; curtida recíproca → match → conversa; quatro destinos realmente navegáveis. A prancha pode aprovar direção visual, mas não prova nenhum desses comportamentos. Validar o protótipo em 390 e 360 de largura antes de publicar, incluindo textos, rodapé, navegação e ausência de corte.

### Recusas automáticas da próxima proposta

- Antigo cartão branco apenas recolorido de verde.
- Imagem num retângulo superior e ficha textual empilhada abaixo, preservando leitura de catálogo.
- Nome, título, capa e frase com ênfase equivalente.
- Fundo escuro usado como enorme borda vazia, enquanto a experiência continua pequena no centro.
- Juventude expressa por stickers, brilhos, chips decorativos ou bagunça tipográfica.
- Aparência Tinder restrita a X/coração: deck, estado ativo e fluxo precisam ser perceptíveis.

O próximo gate avalia a prancha inteira. O aceite desta direção não aprova automaticamente o raster nem a implementação.

---

## Prancha imersiva — gate para implementação

Imagem inspecionada: `exec-684aaeda-d6b2-4631-9a15-e88feeb45967.png`.

**TARGET APROVADO PARA IMPLEMENTAR.** Não constitui aprovação de runtime nem de publicação. Não é necessária nova geração para iniciar a implementação.

A mudança é composicional: mídia passou a ser ambiente do cartão, a área amarela ondulada reúne pessoa e decisão, o deck ocupa a tela e a navegação ativa é evidente. O visual já não depende de uma ficha branca, nem de bolas soltas. “Ver perfil” está visível. A imagem tem mais energia pela relação entre fotografia, grandes massas cromáticas e contraste tipográfico, sem stickers decorativos.

### Condições antes e durante a implementação

- Reconstruir como componentes responsivos, nunca como imagem clicável. Não copiar literalmente as escalas do raster: nome 32, opinião 22, rodapé 56, ícones ~20, texto das ações ~14, toque mínimo 48. A imagem ainda é dominante; no 360 deve ceder altura antes que a pessoa, o acesso ao perfil ou a decisão sejam cortados. Não reduzir a frase para um corpo ilegível.
- Usar capa autêntica e asset de exemplar separado. A capa desenhada pela IA nesta prancha não comprova uma edição real; não a reutilizar como foto documental de exemplar nem extrair a fotografia junto de textos e controles da interface. A opção de exemplar da Ana só entra com imagem identificável e sem UI incorporada. Demais perfis podem começar em capa.
- Tornar Capa/Exemplar inequívoco: o raster “Capa · Exemplar” não indica estado atual com clareza. Controle curto mostra modo selecionado e oferece mudança. Os três indicadores representam livros da mesma pessoa; toque muda livro, arrasto passa/curte a pessoa.
- “Ver perfil” tem área de toque de 44–48 sem precisar de uma caixa extra. Voltar preserva pessoa, livro e modo de mídia. As quatro raízes permanecem operáveis, com destino ativo reconhecível.
- Reutilizar domínio puro é adequado para preservar consentimento e estados existentes. Foto de pessoa continua condicionada à conversa e aceite dos dois; nenhum caminho alternativo de perfil, match ou chat pode ignorar esse estado.

### Gate obrigatório do produto implementado

Revisar capturas reais em 390 e 360 px e executar deck → perfil → voltar, gesto e botões, troca livro/modo, match → chat, navegação das quatro raízes e estados de consentimento. Verificar que texto enviado é renderizado como texto, sem execução de HTML. Testar legibilidade e toque, não apenas aparência do screenshot. A aprovação de publicação depende desse resultado; este parecer autoriza a implementação do target com as condições acima.

## Primeiro render real — correção de chrome

Inspecionado `trelele-v6-app-primeira.jpg`, screenshot do aplicativo em viewport CSS 393 × 852 dentro de moldura.

**FIXES DE CHROME APROVADOS. Primeiro render não aprovado para publicação.** Há três P1 visíveis: Para você / Por perto ausentes visualmente, rótulos da navegação encobertos pelo indicador inferior, e grande intervalo sem função entre cartão e navegação.

Autorizado fixar a hierarquia header → tabs → deck flexível → nav com safe area reservada. O cartão deve ocupar a área disponível sem lacuna artificial; ajustar altura/crop da mídia, sem esticar imagem, tipografia ou espaçamentos aleatoriamente. Preservar wordmark Fraunces, nome DMSans, superfície amarela contínua e ações integradas. Repor a opinião aprovada na fonte dos dados.

Gate seguinte: capturas diretas em 393/390 e 360, incluindo tabs e navegação inteira. Nenhuma nova geração necessária para estes ajustes de layout. Aprovação de chrome não valida a procedência do asset nem os fluxos funcionais pendentes.

### Autorização do teste 360 sem alterar presets

**APROVADO** adicionar opção de desenvolvimento `?qa=360` no código pertencente ao app, impondo container CSS efetivo 360 × 740 dentro do preset existente. Preservar arquivos protegidos, providers, hooks e status bar. Não usar transform, zoom, escala ou clipping para simular responsividade. Verificar dimensões e overflow reais.

O resultado deve ser descrito como teste de **container 360 × 740**, não device físico nem preset/viewport 360. Se o app depende de media queries do viewport, o container interno não valida os breakpoints 360: o viewport do preset continua 393. Registrar essa limitação ou usar iframe com viewport efetivo 360. Modo de QA não deve alterar a URL padrão nem a apresentação publicada.

## Comparação target × implementação real 393

Inspecionada `trelele-v6-comparacao-real.jpg`, target à esquerda e aplicação real CSS 393 × 852 à direita.

**COMPOSIÇÃO EM 393 APROVADA PARA PROSSEGUIR AO QA FUNCIONAL.** Tabs e navegação agora estão inteiras; a lacuna sem função desapareceu. Deck, mídia, onda e rodapé continuam uma composição, com decisão integrada à pessoa. Nome/opinião/ações menores que no poster são adaptação deliberada ao produto e ao espaço ocupado por status bar e safe area, não regressão estrutural.

**P2 de affordance:** “Exemplar” ainda parece um rótulo mais que um controle de troca; indicadores de outros livros são discretos demais nesta captura. Confirmar mudança de mídia acessível, estado selecionado inequívoco e indicadores perceptíveis no teste. Conferir área 44–48 do link Ver perfil apesar de seu texto pequeno.

Esta captura não demonstra fluidez, gestos ou funcionamento dos links. A aprovação não abrange ainda 360, perfil/retorno, match/chat, consentimento ou procedência do exemplar de demonstração. Pode-se executar esses testes sem nova geração e sem redesenho amplo.

## Preflight do gesto de decisão e limpeza do chat

**APROVADO** implementar gesto de decisão no single card pertencente ao app, usando a dependência existente `@use-gesture/react`, sem alterar runtime protegido. Trata-se de ação sobre a pessoa, não de uma coleção horizontal.

Condição eliminatória: um Carousel horizontal não pode receber o mesmo arrasto na mesma área de mídia. No deck, troca de livro ocorre por toque nos indicadores/zonas; Carousel pode permanecer em superfície própria, como perfil. Se dois handlers horizontais concorrem no mesmo local, o plano fica rejeitado até a separação.

Bind somente na área não interativa da mídia, preservando `pan-y`; excluir botões, link e controle de modo. Confirmar decisão apenas na soltura horizontal intencional. Gesto curto, vertical ou cancelado não decide. Dar feedback visual Passar/Curtir durante o movimento; retorno limpo no cancel. Vincular callback ao ID da pessoa, guardar idempotência e bloquear nova decisão durante saída. Não permitir que callback atrasado decida a pessoa seguinte. Os botões continuam alternativa acessível.

QA obrigatório: ambos os sentidos, gesto curto, vertical, cancel, toque de indicadores/modo, retorno do perfil e ausência de dupla decisão. Os testes unitários do classificador não substituem o gesto real no navegador.

**APROVADO** mover “Controles da demonstração” do corpo do chat para menu de três pontos acessível, mantendo aviso fictício discreto. Chat claro e legível é compatível com a direção; não precisa reproduzir a fotografia do deck.

Fluxo perfil → voltar → curtir Ana → match → mandar oi → chat → enviar texto foi relatado como executado pelo responsável; esta revisão não o repetiu de forma independente.

## Preflight — celebração brasileira dentro do cartão

**PLANO APROVADO.** “Deu liga!” deve surgir animado sobre o próprio cartão de Ana, mantendo a pessoa congelada até escolha explícita. Sem nova rota, tela ou BottomSheet. Não é necessário gerar outra imagem antes do código.

Contrato: overlay absoluto dentro do article, veil verde escuro aproximadamente 0,78 e pequena onda amarela integrada; título serif 32–36, “Você e Ana se curtiram.”, CTA “Puxar assunto” e secundário “Continuar olhando”. Verificar contraste real sobre a mídia; o alpha isolado não garante legibilidade. Não criar caixa branca flutuante.

Duas capas autênticas, uma associada a cada pessoa, convergem de lados opostos com fade/translate em 500–700 ms. Não insinuar que ambos escolheram o mesmo livro se os dados não dizem isso. Oito pequenos recortes goiaba/amarelo podem celebrar uma única vez, subordinados à mensagem, sem loop nem clichês nacionais. Nenhuma foto ou desbloqueio de identidade.

CTAs funcionam desde o início, sem espera obrigatória e sem navegação automática. Reduced motion apresenta estado final instantâneo, sem deslocamentos ou partículas. Foco vai ao CTA acessível; controles e gestos atrás do overlay ficam inertes. “Continuar olhando” e Escape avançam uma única vez; “Puxar assunto” abre o chat correspondente. Idempotência deve valer também durante a animação e nos eventos de teclado.

Remover “match” de toda UI: texto visível, toasts, estados vazios, títulos e nomes acessíveis. Usar liga/conexão conforme contexto. Nomes internos do domínio podem permanecer. Foto segue protegida por tempo/conversa e consentimento mútuo.

Gate de runtime: comprovar overlay dentro do article e rota inalterada até ação explícita, os dois CTAs, Escape, redução de movimento, ausência de dupla decisão e ausência do termo “match” na UI. Esta aprovação é conceitual, não valida execução ainda não inspecionada.

## Gate visual do container 360 × 740

Inspecionada `trelele-v6-container-360.jpg`. **LAYOUT DO CONTAINER 360 × 740 APROVADO.** Tabs, pessoa, frase, privacidade, decisão e quatro destinos permanecem inteiros. A mídia cede altura e mantém o contexto editorial sem cortar conteúdo decisório. Não há overflow horizontal segundo a medição relatada: scrollWidth = clientWidth = 360. A região branca externa à raiz é artefato do teste dentro do preset 393, não pertence ao layout do app.

A aprovação visual em 393 permanece válida desde que o chrome não tenha mudado. Este teste 360 não prova viewport/media queries 360 nem aparelho físico.

Responsável relata gestos reais no navegador: curto/vertical preservam Ana; direita intencional gera curtida recíproca; esquerda avança Davi para Bia sem dupla decisão. Toques de indicadores e modo têm área 48. Cancelamento de ponteiro não foi executado em integração; apenas coberto pelo classificador unitário. Não converter essa cobertura parcial em alegação de teste completo.

O overlay implementado e seus CTAs/Escape/reduced motion ainda precisam de inspeção para encerrar o gate da experiência.

## Primeira execução da celebração — rejeição e correção autorizada

Inspecionada `trelele-v6-deu-liga.jpg`. **RESULTADO REJEITADO PARA PUBLICAÇÃO; FIXES APROVADOS.** Teclado aparece sem campo de texto necessário; cartão/conteúdo estão deslocados e cortados no alto; subtítulo tem contraste insuficiente. A direção de overlay dentro do card segue correta, mas não compensa essas falhas.

Autorizado esconder teclado enquanto liga estiver aberta, focar CTA com `preventScroll`, e resetar somente o scrollport pertencente ao app quando a celebração abrir. Sem scroll global nem alterações em runtime protegido. Foco uma vez por liga; reação à visibilidade do teclado não deve gerar loop de foco/reset. Cor explícita `#fff4d8` no subtítulo e layout compacto adaptável são correções adequadas.

Durante celebração, todos os controles externos ao overlay — card, tabs e navegação — ficam inertes. Tab circula nos dois CTAs; Escape equivale a continuar uma única vez. Reinspecionar em 393 e container 360 sem teclado, sem corte e com mensagem/ações inteiras antes de aceitar.

Provas relatadas já obtidas: overlay descendente do article, URL inalterada e foco no CTA. Isso prova parte do contrato estrutural, não legibilidade ou posicionamento corretos.

## Celebração final 393 — execução corrigida

Inspecionada `trelele-v6-liga-final.jpg`. **OVERLAY 393 APROVADO VISUALMENTE.** Capas, título, mensagem e os dois CTAs aparecem inteiros; contraste do subtítulo foi recuperado; não há teclado visível. A celebração permanece sobre o mesmo cartão, sem nova superfície branca ou tela separada. Não é necessário outro ajuste visual para esta dimensão.

Correção do diagnóstico anterior: segundo inspeção técnica do responsável, `locator.click`/`scrollIntoView` da automação rolou `.device-screen` até 288 e prejudicou a captura. Recarregar e acionar por toque nativo produziu scrollTop 0; keyboard.visible foi falso e não havia inputs montados. Portanto, a primeira imagem comprovava um estado visual inválido, mas não comprovava um bug real do teclado do runtime. Registrar como interferência da automação na evidência, não como bug funcional confirmado. Os ajustes aprovados de foco, contraste, inert e trap já foram aplicados.

A imagem estática não certifica animação, CTAs, Escape ou reduced motion. Gate final ainda requer overlay no container 360 e resultados desses comportamentos.
