# V12 — contrato de fidelidade visual

**Preflight aprovado para implementação, sujeito à inspeção do resultado.** Não é auditoria formal, teste de runtime ou aprovação de release. Foram inspecionadas as quatro folhas `tinder-reference-intake/contact-01..04.jpg`, com referência aos originais já vistos; 1530, 1531, 1540 e 1545 foram também examinados individualmente. Sem browser por este crítico: somente o auditor designado opera UI.

Decisão atual do usuário: composição próxima dos 31 prints em todas as telas; adaptar marca original, fontes e verde/laranja, mantendo encontros por livros. Esta instrução substitui a preservação do layout V10. Não propor novos estilos. O novo logo livro-coração preparado separadamente não entra no app.

## Escala de implementação

Valores abaixo são **alvos propostos em CSS para largura 360**, aproximados da anatomia observada; não são medições do DOM do Tinder. Em 390 preservar proporções e ampliar área útil, sem escalar texto/toque. Não copiar status bar, relógio, teclado ou moldura dos screenshots para a versão standalone.

| Elemento | Contrato proposto |
|---|---|
| Cadastro | Margens 20; título DM 30–32/1,1; texto 14–16; uma pergunta por estado |
| Header cadastro | Altura 56–64; voltar visual 24/target 48; progresso 96–132 × 3–4; Pular 48 |
| Inputs | Fonte 16; altura mínima 52; linha inferior simples nas etapas nome/data |
| Seleções | Pílula outlined + check; alvo 48; estado marcado além da cor |
| Intenção | Grade 3 × 2, gap 8, texto mínimo 14, tiles 112–128 de altura |
| Footer cadastro | CTA pill 50–54; margens 20; área de conteúdo reservada + safe area |
| Deck | Mídia ocupa quase todo o cartão; nome/metadados/opinião sobre gradiente inferior; zero painel laranja opaco separado |
| Deck chrome | Faixa superior compacta, tabs relacionadas à mídia; evitar empilhar marca alta + tabs + ficha |
| Nome e opinião | Nome ~30–32 sans; opinião ~19–22/1,2, curta e legível sobre a mídia; aprofundamento no perfil |
| Decisão | X/coração dentro do campo visual do cartão, alvos 48–56; sem toolbar de formulário ou bolas gigantes externas |
| Navegação raiz | Cinco destinos, altura 56–64 + safe area, ícones 22–25, nomes 10–12; seleção espacial inequívoca |
| Perfil | Cabeçalho compacto com configuração, faixa de mídia, preenchimento e tiles de perguntas; não página com h1 + lista genérica |
| Configurações | Superfície arredondada sobre perfil; inset 14–16; header 20 + check visual 44/target 48; grupos com inset 16 e raio ~20–25; linhas 52–56; intervalos 28–32 |

Todas as medidas continuam subordinadas a legibilidade, fluxo e conteúdo inteiro em 360 × 640 e 390 × 760. Em teclado aberto, composer/CTA acompanham viewport útil sem descontar teclado duas vezes.

## Cobertura dos 31 prints

Os IDs abaixo são contratos de destino para a galeria, não alegação de rotas já implementadas. O root deve associar cada ID ao componente/estado real; nenhum item recebe status “inspecionado em runtime” antes da captura correspondente. Variantes do mesmo formulário são estados distintos, não telas inventadas.

| Print | Anatomia/estado observado | Medida/estrutura a preservar | Destino de revisão contratado |
|---|---|---|---|
| 1510 | Entrada, marca dominante, provedores empilhados e links inferiores | Marca no campo central; ações no terço inferior, pills 48–52, gap 8–10 | `entry` |
| 1511 | Regras, lista vertical, CTA inferior | Margem 20; títulos de regras 16–17; footer reservado | `rules` |
| 1512 | Nome vazio, input underline, progresso e back | Título 32; input 52; estado vazio/CTA | `name-empty` |
| 1513 | Nome preenchido e confirmação central | Veil sobre a etapa; diálogo com duas ações verticais 48 | `name-confirm` |
| 1514 | Nascimento, explicação de idade | Input nativo/data; título 32; CTA sem teclado mock no app | `birthdate` |
| 1515 | Identidade sem seleção | Opções outline, uma coluna; estado vazio identificável | `identity-empty` |
| 1516 | Identidade principal selecionada | Contorno + check à direita; CTA habilitada | `identity-selected` |
| 1517 | Detalhes opcionais de identidade expandidos | Accordion sob a opção; cards explicativos; scroll real | `identity-details-open` |
| 1518 | Parte inferior dos detalhes | Continuação da mesma lista; footer não encobre último item | `identity-details-bottom` |
| 1519 | Detalhe opcional selecionado | Check/contorno tanto no principal quanto no detalhe | `identity-detail-selected` |
| 1522 | Intenção em seis tiles | Grade 3 × 2, gaps regulares e CTA inferior | `intention` |
| 1524 | Grupos de hábitos opcionais | Pergunta de grupo + chips + Pular | `reading-routine` — adaptação literária |
| 1525 | Grupos de comunicação e preferências | Densidade de grupos, chips e Pular | `literary-dates` — adaptação literária |
| 1526 | Interesses categorizados, Mostrar mais | Seções compactas e expansão explícita, não mural de chips | `literary-genres` |
| 1527 | Seis posições de fotos em grid | Três colunas e contagem/CTA; editor com toque 48 | `owner-photos` — somente 3 fotos privadas no Trelelê |
| 1528 | Bio e pergunta em dois cards | Dois módulos compactos, ícone/adicionar e explicação breve | `bio-recommendation` |
| 1529 | Solicitações de localização/notificação | Explicação + escolhas; não copiar diálogo do sistema como UI real | `permissions-beta` — adaptação honesta |
| 1530 | Convite ao tutorial sobre o deck | Mídia preservada sob veil, mensagem central, CTA e Pular | `deck-tutorial` |
| 1531 | Deck em uso | Mídia dominante; informação e decisão sobre contexto inferior | `discover` |
| 1532 | Explorar inicial | Título/subtítulo e grade 2 colunas, tiles com rótulo inferior | `explore-top` |
| 1533 | Explorar com outro enquadramento | Mesma grade, continuidade/scroll e nav ativa | `explore-scroll` |
| 1534 | Curtidas com tabs, vazio e CTA | Preservar header/tabs/vazio; substituir oferta por ação real | `connections-empty` — somente reciprocidades |
| 1535 | Hub de perfil, faixa de fotos, preenchimento | Cabeçalho avatar/nome/config; mídia horizontal e módulos | `profile-top` |
| 1536 | Perfil rolado, perguntas/interesses | Tiles em pares e ações de editar; continuação do hub | `profile-details` |
| 1537 | Settings no topo, sobre perfil | Superfície arredondada, check à direita, grupos | `settings-top` — sem premium fictício |
| 1538 | Settings conta/descoberta | Linhas com valor à direita, explicação e hairlines | `settings-data` — dados locais reais |
| 1539 | Settings interesses/informação | Lista compacta agrupada, editar por linha | `settings-preferences` — conteúdo literário |
| 1540 | Settings preferências/visibilidade | Sliders/toggles somente se funcionais; agrupamento observado | `settings-discovery` — pausa local real |
| 1541 | Settings privacidade, sair, versão, excluir | Sair separado; identidade/versão e exclusão ao final | `settings-exit` |
| 1542 | Introdução à exclusão com alternativas | Duas opções no corpo; continuar e alternativa inferiores | `delete-intro` |
| 1545(1) | Confirmação final de exclusão | Texto de consequências, voltar e duas ações inferiores | `delete-confirm` — sem prazos de servidor/facial |

## Adaptações autorizadas e limites

- Apple, Google e e-mail na entrada são exigência expressa do usuário, mesmo que 1510 mostre Apple/telefone. Três pills superpostas; não omitir essa exigência por apego ao screenshot. Clique normal informa configuração pendente; e-mail/código demonstrativos ficam rotulados em review, sem envio ou sessão fictícios.
- Marca original e abertura fornecida continuam; 1510 orienta posicionamento/anatomia das ações, não permite redesenhar o logo. CTA de demonstração deve ser funcional e distinta de autenticação.
- Cinco raízes: Descobrir, Explorar, Deu liga, Conversas, Perfil. Deu liga mostra só reciprocidades ativas; nunca recuperar lista de curtidas enviadas ou paywall falso para imitar 1534.
- Livros ocupam a mídia pública. Três fotos continuam bloqueadas até conversa/tempo e aceite bilateral. Nada de original privado atrás de blur. O desenho de seis posições do deck não muda o requisito de três livros + três fotos.
- Reproduzir agrupamento dos hábitos/interesses com conteúdo literário, não introduzir aparência, bebida ou astrologia. Não inventar contagens, online, distância/GPS, planos pagos ou contas conectadas.
- Privacy, notifications e help sem equivalente individual nos 31 prints são extensões autorizadas do fluxo de settings; rotulá-las como adaptação no índice, não “cópia do print”.
- Deu liga continua animado sobre o mesmo cartão, congelado, sem rota intermediária, com Puxar assunto/Continuar e sem foto revelada.

## Gate das propostas dos agentes

**Refino — cadastro/entrada:** aprovado antes da edição. Underline, título sans 32, seleção outline/check, intenção 3 × 2, footer pill e review sem storage real. Exigida cobertura dos estados 1513 e 1515–1519, não apenas um formulário de identidade. Entrada com três provedores aprovada após esclarecimento do requisito explícito pelo root.

**Arquitetura — AccountFlow:** aprovado antes da edição. A proposta precisa manter superfície arredondada sobre perfil e anatomia dos grupos; não se limitar a recolorir a página fullscreen V10. Check finaliza/volta sem perda. Pausa/saída locais, exclusão em dois passos com await/erro e alternativas. Review não executa writes destrutivos.

**Mobile — app/deck:** proposta individual aprovada antes da conclusão do novo CSS, com preflight do markup já transferido pelo root. Mídia 100% do cartão, scrim nos últimos ~230, nome 32/idade 28/opinião 18–20, ações circulares de 68 contidas no cartão e navegação com cinco células/seleção em cápsula. Sem painel laranja. Explorar em grade, perfil em hub 1535–1536 e reciprocidades com anatomia 1534 adaptada. Correção de orçamento exigida: em 393 × 852, header 52 + tabs 34 + nav 58 já consomem 144; não somar cartão de 760 a esse chrome. O cartão usa o restante menos safe areas/gaps, ou header explicitamente sobreposto à mídia. Ações grandes externas continuam vetadas.

## Verificação independente do resultado

Rejeitar: painel antigo só recolorido; screenshots clicáveis; apenas três telas de showcase enquanto cadastro/settings faltam; estado de galeria sem destino funcional; modais sem foco/back; nav escondendo conteúdo; ações inertes sem explicação; review lendo fotos/sessões reais.

Auditor deve capturar 360 e 390, relacionando cada estado ao ID/print, e relatar geometria e cortes. Showroom usa componentes reais com fixture em memória, sem armazenamento/autenticação real e com saída clara. Mostrar o índice não comprova 31 estados renderizados. Prints estáticos não comprovam thresholds, física, fluidez ou teclado físico.

Checklist aplicado: Designly visual-qa/composition-director; ECC frontend-a11y e frontend-patterns. Conferir labels associados, erros anunciados, botões semânticos, foco/retorno/trap em diálogos, estado ativo além da cor, imagens decorativas sem anúncio e reduced motion. A compilação não substitui esses gates.

## Primeiro resultado real V12 — Descobrir

Inspecionados `trelele-v12-discover.jpg` (390 × 844 e 360 × 640) e original IMG_1531.jpeg lado a lado, por view_image. Esta revisão não operou browser; o auditor produziu a captura.

**ANATOMIA DE DESCOBRIR APROVADA CONDICIONALMENTE À RECAPTURA DAS CORREÇÕES. Não é PASS do app inteiro.** Mídia agora ocupa o cartão inteiro, informações e ações compartilham o campo inferior, navegação tem cinco posições e seleção em cápsula. A ficha laranja V10 foi removida de fato. Livro/exemplar continuam sendo a imagem pública: não substituir por rostos para copiar o conteúdo literal da referência. A barra “REVISÃO” pertence ao showroom, não ao app normal.

**P1 confirmado:** opinião com texto escuro sobre scrim escuro perde leitura em ambas as larguras. Fix pontual #FFF8ED aprovado pelo root e por este crítico; aprovação depende de recaptura, não basta encontrar cor na fonte.

**P2 de escala confirmado por CSS:** navegação estava em 10 px, reduzida a 9 no viewport curto; cidade em 12/11 e privacidade em 11/10. Menores que a anatomia normalizada da referência. Ajuste bounded aprovado: nav 12 normal/11 curto, cidade 13/12, ícones 26/25; privacidade 12/11 recomendada. Preservar grid, alvos e safe areas. Não requer redesenho ou outro conceito.

Enquadramento do exemplar é mais fechado que a fotografia de pessoa da referência, mas mantém identificação do livro. Não foi solicitada troca de asset. Aguardam-se as demais capturas de entrada/cadastro/perfil/settings/saída antes de qualquer aceite global. Prints estáticos continuam sem provar física do gesto, teclado físico ou animação.

## Segunda amostra real V12 — quatro estados

Inspecionadas `trelele-v12-liga.jpg`, `trelele-v12-intencao.jpg`, `trelele-v12-entry.jpg` e `trelele-v12-settings.jpg`, todas em 390/360. Comparados diretamente IMG_1510, IMG_1522 e IMG_1537. Não houve browser por este crítico.

- **Entrada aprovada visualmente:** marca original inteira, três provedores legíveis em pills e ação de demonstração separada. A mudança de dois provedores da referência para três é adaptação exigida pelo usuário; não é falha de fidelidade. Não comprova autenticação.
- **Configurações aprovadas na anatomia visível:** sheet arredondada sobre contexto, título/check circular, grupos claros, linhas com valores/chevrons. O trecho inferior não está nesta captura; acesso a sair/excluir depende da conferência de scroll do auditor.
- **Deu liga aprovado visualmente em ambas as larguras:** capas, título, mensagem e dois CTAs inteiros; permanece sobre o cartão. A imagem estática não certifica animação ou foco.
- **Intenção aprovada condicionalmente ao scroll em 360:** título, grade 3 × 2, seleção e footer correspondem à estrutura observada. A segunda linha tem o fundo cortado pelo footer na posição capturada; não é automaticamente P1 se o conteúdo rolar e as seis escolhas forem alcançáveis. Auditor deve confirmar acesso à última opção e retorno, sem CTA ocluída. Duas barras de review ocupam 56 px e não pertencem ao app normal.

Nenhum P1 novo nessas quatro capturas. Continua pendente a recaptura da opinião clara em Descobrir. Bounded de fidelidade aprovado: X bold branco e coração preenchido laranja somente nas ações do cartão, preservando os círculos e navegação outline; aproxima 1531 sem novo conceito.

O aceite cobre a amostra de cinco estados, não 31 estados vistos em runtime. A existência de índice/links no showroom não amplia essa cobertura. Para compartilhar a galeria, descrever o escopo observado e manter explícita a distinção entre prévias, beta local e autenticação real.

## Gate final — correções recapturadas e gestos demonstrados

**Aceite histórico da amostra Ana/estados abaixo. A suspensão posterior por Bia foi encerrada pela recaptura final, documentada ao final.** As capturas abaixo permanecem válidas somente para seus estados; não representam todas as variantes de capa/pessoa.

Inspecionadas por view_image:

- `trelele-v12-discover-final.jpg`: opinião clara e legível em 390/360, P1 resolvido; nomes de navegação recuperados.
- `trelele-v12-settings-tail-heart.jpg`: Sair e Apagar dados alcançáveis no fim das configurações; coração preenchido e X bold preservam integração no cartão.
- `trelele-v12-final-step-recovered.jpg`: etapa 11 com bio/recomendação e CTA inteira; em 360 a sexta opção de intenção aparece inteira e selecionada após scroll. O corte inicial era de conteúdo rolável, não opção inacessível.
- `trelele-v12-real-swipe-liga.jpg`: cartão deslocado/inclinado durante gesto real, feedback CURTIR e navegação fora da transformação.
- `trelele-v12-real-swipe-result.jpg`: resultado do gesto com Deu liga sobre o mesmo cartão, mensagem e dois CTAs legíveis em 360.

Auditor relata testes de 20 px preservando Ana, 185 px à direita produzindo a reciprocidade e gesto posterior à esquerda avançando para Davi. Esses resultados complementam as capturas; este crítico não operou o browser. Auditor também relata console filtrado de warning/error do app vazio, distinguindo mensagens históricas de extensões.

### Limites finais do aceite

43 IDs únicos de prévia disponíveis, conforme contagem corrigida pelo root, não equivalem a 43 ou 31 telas inspecionadas individualmente. O aceite cobre as capturas listadas e os fluxos do beta relatados pelo auditor. Não certifica cadastro real com upload de três fotos/persistência de ponta a ponta, autenticação de produção, Safari/IME físico nem todas as variantes de acessibilidade. Preparação de autenticação e validação de uploads são gates separados, sem impedir compartilhar esta revisão visual claramente identificada como beta/prévia. Compilação sozinha não foi usada como evidência de fidelidade.

## Novo achado bloqueante — Bia em 360

Inspecionada `trelele-v12-real-swipe-pass.jpg` após o responsável comunicar novo resultado do gesto. **P1 histórico confirmado nessa captura, encerrado no gate final abaixo.** O card de Bia/capa em 360 ultrapassava o orçamento vertical: opinião e decisões ficavam cortadas/atrás da navegação. Ana funcional não validava essa variante.

Autorizada correção bounded de altura, contenção da imagem e ancoragem da informação inferior. A imagem não pode impor altura intrínseca maior que o card; a nav mantém espaço reservado e as decisões permanecem inteiras. Não resolver escondendo texto/ações nem reduzindo fontes a tamanhos ilegíveis. Nenhum novo conceito ou asset é necessário.

Foi exigida recaptura de Bia em 360 após fix e Ana em 390/360 para verificar regressão. O bloqueio vigorou até a evidência final abaixo.

## Gate bounded final — P1 Bia encerrado

**APROVADO o escopo visual da amostra e UI core do beta/prévias testadas. Sem P1 visual pendente nessa amostra.** O root pode concluir checks, commit e publicação desse escopo, sem nova exploração de estilo. Este é o veredito vigente; as suspensões acima são histórico do achado e correção.

Inspecionados diretamente `trelele-v12-bia-regression-final.jpg` e `trelele-v12-ana-regression-final.jpg`. Em Bia/360, opinião, indicação de foto protegida e ambos os controles de decisão estão inteiros e acima da navegação. Em Ana/390 e Ana/360, opinião clara, ações com X bold/coração preenchido e navegação permanecem legíveis, sem regressão visível. P1 encerrado por recaptura real, não apenas por medição de DOM ou compilação.

Auditor relata estado assentado sem busy: deck Bia com 535 px, decisão em y492–554 e navegação em y574–633. Relata também conclusão do preview, scroll de configurações, acesso às onze etapas em review, gestos reais para direita/esquerda e console do app sem warning/error. Este crítico inspecionou as imagens e não repetiu a operação do browser.

Galeria contém **43 IDs únicos**, conforme contagem do root. Não afirmar que este crítico viu 31 ou 43 telas renderizadas individualmente. O aceite não abrange autenticação de produção, upload real de três fotos/persistência de ponta a ponta, Safari/IME físico ou toda a matriz de acessibilidade. Os estados de review são prévias identificadas, não sessões reais de autenticação. Esses gates separados não impedem compartilhar o beta e a galeria no escopo aprovado.
