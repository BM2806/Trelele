# Marca V9 — revisão estática independente

**BLOCKED — inspeção visual renderizada indisponível. Não é aprovação de release.** Revisão de fontes, CSS, três referências originais e PNG da onda; nenhum browser foi iniciado nesta revisão. O responsável relata timeout do transporte de UI, inclusive em tentativa com prazo curto. Não confundir análise de CSS com captura real em 380/360.

## Marca e abertura

Logo original preservado como JPEG; crop CSS não redesenha os pixels. Na abertura, crop de 290 px (270 em altura até 700), proporção 920/940 e imagem 173,913% são matematicamente compatíveis com o conteúdo original: margem aproximada de 15–20 px dentro do crop, sem corte evidente previsto de símbolo ou wordmark. Header usa somente o wordmark original em janela 120 × 40, com imagem 238 × 238 e offset -60/-145; o encaixe é apertado na direita e requer conferir o último ê e antialias em render real.

Abertura em 360 × 640: footer prevê aproximadamente 148–160 px mais safe area; logo reduzido, tagline e padding cabem nominalmente no restante. Em 380 × 760 o orçamento é maior. Não identifiquei corte obrigatório de logo/CTA pela aritmética do CSS. Scroll interno continua disponível; isso não comprova alinhamento visual final.

## Onda do footer

PNG inspecionado: 2172 × 724, proporção 3:1 e transparência real acima da onda. CSS força largura total e altura 82 px, ou 62 px em viewport curto, com object-fit:fill. Em 360–380 a altura proporcional original seria 120–127 px: há achatamento deliberado da curva, não crop da marca. Condiz com uma faixa compacta, mas a fidelidade à referência precisa ser julgada em tela.

Continuidade verde não é exata: pixels inferiores do PNG têm verde variável e alpha aproximado 229–234/255, sobre footer #14A859. Pode aparecer emenda/variação discreta. Classificação P2 de acabamento, sem corrigir fonte automaticamente. O PNG não tem fundo preto opaco; preto da visualização corresponde à transparência.

## Contraste

Tokens e papéis corrigem o problema do mock original: laranja #FE8A38 com texto #303640; verde vivo #14A859 com texto #062F23 na abertura; verde escuro/deep para creme no chat e navegação. As combinações principais têm contraste nominal adequado; não afirmar contraste de toda a interface sem verificar estados e superfícies compostas. CTA 54 e secundário 48 atendem o orçamento de toque previsto.

## Risco P1 a verificar no primeiro render curto

Prompt de foto bloqueada pode exceder a mídia em 360 × 640: a mídia admite mínimo 130, mas o prompt reserva 45 no topo e 24 no fundo, contendo ícone, título, explicação, link mínimo 48 e gaps 12. Esse conjunto exige mais altura que o espaço disponível nos casos mais curtos; o pai tem overflow:hidden. É risco deduzido da fonte, não corte confirmado em captura. Verificar especialmente se “Como liberar estas fotos” fica inteiro; compactar o prompt ou permitir altura suficiente se o corte ocorrer. Não alterar o restante do card para esconder o problema.

## Pendências e escopo

Sem evidência renderizada V9, onboarding completo, upload de três fotos, persistência/reload/revisão e teclado físico continuam sem aprovação. Revisões visuais V7/V8 anteriores não se transferem automaticamente à nova paleta/marca. Salvar como checkpoint é adequado; liberação visual exige capturas reais quando o browser voltar. Nenhuma fonte de implementação foi editada por este crítico.
