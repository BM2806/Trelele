# Margem V2 — interação centrada no card

Direção revista após inspeção visual de IMG_1490.jpeg a IMG_1494.jpeg. Esta versão substitui a proposta editorial anterior como direção da descoberta. As imagens são referências históricas fornecidas pelo usuário, não evidência do Tinder atual nem especificação de seu código.

## Tradução da referência

| Evidência observada | Aplicação V2 |
|---|---|
| Card quase ocupa a tela; conteúdo sequencial com marcas no topo | Uma pessoa por vez. Livro/opinião é o conteúdo principal; fotos ficam privadas. Indicador textual “Livro 1 de 3” além de segmentos visuais. |
| Tap lateral anterior/próximo | Tap nas regiões laterais e botões acessíveis alternam livros da mesma pessoa; não alteram interesse. Não sobrepor zonas transparentes sobre texto ou outros controles. |
| Ações distintas de rejeitar/curtir | Botões “Passar” e “Curtir” equivalentes a swipe horizontal. Texto pode ser visualmente compacto, mas nome acessível permanece inequívoco. |
| Ícone info e detalhes sob foto | Info abre detalhes da pessoa, com bio, intenção e contexto literário. Fechar retorna ao mesmo livro e pessoa. |
| Tela de match com duas escolhas | Confirmar reciprocidade simulada, escolher “Conversar” ou “Continuar”. Nada de abrir conversa ou enviar mensagem sem escolha. |
| Inbox com faixa de matches e lista de mensagens | Matches novos em faixa; conversas em lista com nome e prévia fictícia. Sem rosto real antes da revelação; usar iniciais/elemento de livro. |
| Editar perfil com seleção em bottomsheet | Painel de edição com campos e escolhas claras, botões “Cancelar” e “Salvar”. Arrastar para fechar não é requisito. |

## Contrato de gestos

1. Capturar origem do ponteiro; começar em estado indeciso. Após movimento suficiente, classificar eixo apenas quando horizontal domina claramente. Distância inicial sugerida de 10–12 CSS px e razão horizontal/vertical ≥ 1,3 são heurísticas, ajustáveis por teste; não são padrões normativos.
2. Gesto predominantemente vertical mantém rolagem nativa e nunca dispara passar/curtir. `pointercancel` cancela decisão; multitouch/zoom não vira swipe.
3. Decidir só no fim de arrasto horizontal que ultrapasse limiar deliberado. Sugestão inicial: 72 CSS px ou ~20% da largura do card, com retorno ao centro abaixo do limiar. Não julgar intenção só pela velocidade.
4. Após gesto com movimento, suprimir o click correspondente: swipe não pode também avançar livro ou abrir info. Mudança de pointer target no fim não pode decidir duas vezes.
5. Inputs, textarea, botões, links, área de seleção de texto e regiões de rolagem não iniciam swipe de pessoa. Tap de livro não afeta estado de match.
6. Botões são a alternativa principal para teclado, switch e movimento reduzido. Não capturar setas globais enquanto foco está em campo/chat. Uma ação gera no máximo uma transição e um anúncio.
7. Durante transição, impedir repetição indevida de ação por debounce/estado de transição e conservar a intenção. Cancelar timeout ao desmontar; não deixar callback agir sobre outro perfil.

## Critérios de aceite mobile

- A 360×780 e 390×844 CSS px, header, card, ações e nav são legíveis; bottom nav usa safe area. Em telas menores/zoom, permitir rolagem sem cortar ações.
- Evitar altura fixa dependente de `100vh`; testar `100dvh`/fallback e mudança de barra do navegador. Composer aparece acima do teclado móvel e mantém botão enviar alcançável.
- Alvos de interação de pelo menos 44×44 CSS px como padrão interno, inclusive fechar e info. Não usar segmentos finos como único alvo.
- Card identifica nome, idade e região e diferencia livro de pessoa. “Curtir” indica pessoa; livro clicável não deve parecer botão de compra.
- Progressão entre livros anuncia mudança resumida em região live; imagens decorativas não repetem título já presente. Elementos fora do livro ativo não entram na ordem de foco.
- Transição de pessoa preserva foco num local útil e anuncia novo nome/conteúdo, sem reler página inteira. Curtida simula match somente quando estado fictício definido; não toda curtida por padrão sem explicação.
- Navegação com 3–5 destinos, rótulos visíveis e estado atual. Abrir conversa por deep UI não deve destruir a descoberta.
- Não mostrar álbum de fotos carregado e escondido visualmente: na demo não haverá foto pessoal; produção exige autorização de servidor.

## Sheets, chat e foco

- Sheets/modais possuem título e descrição associados. Ao abrir, mover foco para título/campo conforme tarefa; conter Tab no diálogo; fundo inerte; botão fechar acessível e Escape como cancelamento quando seguro; ao fechar, devolver foco ao disparador existente.
- Toque no backdrop cancela ou fecha visualização, nunca confirma consentimento/salvamento, bloqueia pessoa ou apaga conteúdo.
- “Cancelar” em edição descarta só rascunho daquela edição; “Salvar” aplica só campos válidos. Se houver texto não salvo, política é explícita. O “X” não pode salvar implicitamente.
- Fechar chat conserva conversa, mensagens e rascunho enquanto sessão da demo existe. Navegar inbox→chat→detalhes→voltar mantém o mesmo par. Não reutilizar modal genérico cujo fechamento faça reset de domínio.
- “Encerrar conversa” é ação distinta de fechar janela e de bloquear/denunciar. Moderação real não existe na demo: mensagem precisa dizer “Simulação; nenhuma denúncia foi enviada”.
- Ao receber nova mensagem, não retirar foco do composer nem rolar usuário que consulta histórico. Em demo, qualquer resposta automática está explicitamente marcada como simulada.
- Revelação: duas escolhas privadas autorizam liberação bilateral; UI de demo permite “Simular autorização da outra pessoa”. Cancelar antes da liberação retira apenas a escolha local. Fechar modal não apaga conversa nem implica consentir.

## Verificação final obrigatória

| Caso | Resultado esperado |
|---|---|
| Tap direita/esquerda no card | Muda só livro da mesma pessoa, limitado ao intervalo disponível; informa posição. |
| Swipe horizontal curto | Volta ao centro; nenhuma curtida/passagem e nenhum tap posterior. |
| Swipe horizontal deliberado | Uma decisão sobre uma pessoa; nenhuma abertura info/troca de livro adicional. |
| Arrasto vertical/diagonal vertical | Rolagem/nenhuma decisão. |
| Arrasto começando em botão/info | Não inicia swipe. |
| Tab/Enter/Espaço em ações | Fluxo completo sem gesto; foco visível e ordem lógica. |
| Abrir/fechar detalhes e edição | Escape/cancelar/foco corretos; mantém pessoa/livro/conversa anterior. |
| Conversar, escrever, fechar e reabrir | Mensagens/rascunho preservados segundo política; nada enviado implicitamente. |
| Match→continuar | Descoberta continua, match permanece no inbox. |
| Movimento reduzido/zoom 200%/320 px | Conteúdo compreensível, transições dispensáveis, sem controles inacessíveis. |

Especificação não significa testes executados. Revisão do código e validação em navegador serão registradas separadamente.

## Revisão independente da implementação V2

Inspeção estática de `dist/app.mjs`, `dist/style.css` e `dist/index.html`, em 16/10/2026. Arquivos estavam em edição pela arquitetura. Nenhum desses três arquivos foi alterado por esta revisão. Não houve inspeção visual nem execução em navegador nesta etapa.

### Evidência positiva no código revisado

- Card único, troca de livros por tap/segmentos, ação info e detalhes em diálogo; decisões com botões equivalentes ao gesto.
- Reconhecimento de eixo: movimento vertical marca gesto como vertical; `pointercancel` cancela; movimento superior ao limiar suprime click posterior por 400 ms. Controles no início do gesto são excluídos.
- Match oferece abrir chat ou continuar; inbox, curtidas, perfil e edição existem. `dialog` nativo oferece comportamento modal de base e associação ao título; handler de fechamento tenta retornar foco.
- Bottom nav tem rótulos e `aria-current`; viewport permite zoom; safe area é considerada nas extremidades; `prefers-reduced-motion` remove animações/transições.
- Chat e retratos explicitam caráter fictício; simulação da contraparte é separada da escolha local.

### Achados enviados à arquitetura

| Prioridade | Achado concreto | Aceite de correção |
|---|---|---|
| Alta | Texto pequeno com contraste inferior a 4,5:1: nav neutra `#aaa5b4` sobre branco = 2,40:1; privacy `#938b9b` = 3,28:1; muted `#9a8da3` = 3,13:1; small `#7b7788` = 4,34:1; nav selecionada `#eb5c71` = 3,33:1. | Ajustar tokens de texto e reavaliar todos os seletores com tamanho normal, inclusive estados selecionados. Cálculos pela fórmula de luminância relativa WCAG, com cores declaradas; não é medição de pixels renderizados. |
| Alta | Botão principal tem texto branco sobre gradiente `#ef577e` a `#f27869`: extremos de 3,32:1 e 2,74:1. | Texto normal atingir 4,5:1 em toda a área do gradiente; escurecer fundo ou trocar texto/fundo com contraste comprovado. |
| Alta | `render()` substitui `main.innerHTML`; ações `book-index`, `toggle-book`, `preview-mode`, `edit-mode`, `pause` não repõem foco num equivalente. O elemento focado é removido. | Conservar/restaurar foco por chave de ação/ID, ou atualizar DOM localmente. Testar sequência com Tab e Enter sem saltar para início. |
| Média | Pausar descoberta usa estado visual em span; botão não tem `aria-pressed` nem estado de switch. | Expor estado no controle interativo, com nome inequívoco e atualização ao pausar/retomar. |
| Média | Alvos de segmentos 27 px, fechar diálogo 40 px, “Como funciona” 26–32 px. | Cumprir padrão interno 44 px sem sobrepor controles. Não confundir divergência do padrão interno com violação automática do mínimo AA de 24 px. |
| Risco a verificar | Shell fixo em `100dvh`, descoberta sem scroll e media com altura mínima de 130 px podem transbordar/cortar em landscape, teclado e zoom. Não há fallback `vh`. | Teste em alturas pequenas e zoom; oferecer rolagem da descoberta e mínimo do deck coerente em viewport curta. Adicionar fallback compatível quando necessário. Não declarar falha visual comprovada sem executar. |

Root/QA também encaminharam quatro ajustes em paralelo: separar novos matches sem mensagem das conversas, fazer settings temporários com “Concluir”, cancelar em `lostpointercapture` e preservar rascunhos ao renderizar/navegar. Nesta revisão inicial, esses ajustes ainda estavam pendentes no código lido; confirmação final depende de nova leitura ou testes após o merge.

### Limites da revisão

### Rechecagem após correções da arquitetura

Nova leitura confirmou: inbox separa matches sem mensagem das threads; rascunho por pessoa é guardado em memória ao digitar e restaurado; settings só persistem em “Concluir”; `lostpointercapture` cancela drag; `render()` tenta restaurar botão equivalente por dataset; pausa expõe `role=switch` e `aria-checked`. CSS agora tem fallback `100vh` antes de `100dvh`; em alturas ≤620 px a descoberta permite scroll e o deck tem mínimo de 360 px. Segmentos e botão fechar foram ampliados a 44 px; “Como funciona” possui override de 44 px.

Cores principais corrigidas: CTA branco sobre novos extremos resulta em 5,62:1 e 4,78:1; nav neutra/muted/privacy `#75677c` sobre branco = 5,27:1; nav selecionada `#bd365b` = 5,47:1. Isso resolve os exemplos iniciais desses seletores, sem equivaler a aprovação integral da paleta.

Rechecagem encontrou e encaminhou cores restantes: `.person-row small` 3,48:1, `.chat-row strong small` 2,49:1, `.profile-tabs button.active` 3,47:1, `.outline` 3,48:1, `.plain` 3,97:1 e `.section-copy` 4,23:1, quando comparadas ao branco. Fundos claros de starter/pill/seleções também foram incluídos na correção; ícones essenciais rewind (2,32:1) e curtir (2,48:1) precisavam de 3:1. Todos os valores são calculados das cores declaradas.

Snapshot final confirmado por nova leitura: override de texto secundário aplica `#75677c` aos seletores listados e a starter/pill/detalhes; aba ativa/opção selecionada usam `#bd365b`; ícone rewind usa `#946522` (5,07:1 contra branco), curtir usa `#13846e` (4,61:1). Esses achados pontuais estão resolvidos na fonte. Não resta bloqueador identificado por esta leitura para publicar uma **demonstração fictícia**, com limites abaixo; não é liberação para operação real ou certificação integral AA.

O código usa log com live region e reconstrução de histórico; é necessário testar leitor de tela para não reler toda a conversa. `render()` sempre leva mensagens ao fim; ações de simulação/consentimento podem interromper consulta ao histórico. Composição do teclado móvel, retenção de foco ao substituir um modal por outro e orientação horizontal continuam sem validação em dispositivo. Não emitir selo de acessibilidade ou afirmar “mobile validado” com base apenas nesta leitura.

## Base normativa previamente consultada

WCAG 2.2, W3C: https://www.w3.org/TR/WCAG22/ — teclado (2.1.1), gestos de ponteiro (2.5.1), cancelamento (2.5.2), arrastar (2.5.7), alvo mínimo AA (2.5.8: 24 CSS px com exceções), foco não obscurecido (2.4.11), nome/função/valor (4.1.2) e status (4.1.3). Regra interna 44 px é mais exigente que mínimo AA. A revisão V2 não altera a meta WCAG 2.2 AA, ainda não certificada.
