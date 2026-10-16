# Mobile Prototype Agent Guide

## Prototype Instructions

In ChatGPT Work Mode, run `sites-preview start "$PWD"`, open `http://terminal.local:4173/` in the cloud browser, and verify the rendered app and its primary interactions. Keep that preview open and tell the user to inspect it in the cloud browser; do not present the local URL as a user-facing chat link. In Codex Desktop, run the local server yourself, open the preview in the in-app browser, and provide the clickable local URL. Do not deploy to Sites unless the user explicitly asks to share, publish, or deploy. Do not give the user server-start instructions when you can run it.

Before planning or implementing any mobile-app change, read this `AGENTS.md` in full. It is the source of truth for the template's runtime and component guidance.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Editing Boundary

- Build app-specific UI in `src/Prototype.tsx` and `src/prototype.css`.
- Treat `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/mobile/`, `public/assets/iphone/`, `public/assets/android/`, `public/assets/status/`, `vite.config.ts`, `worker/index.js`, and `scripts/prepare-sites-build.mjs` as protected runtime files. Do not edit, replace, remove, or recreate them unless the user explicitly asks to change the mobile runtime itself. For an explicit runtime change, update the affected lock hashes only after verifying the new runtime behavior.
- Run `npm run check:runtime` before preview or handoff. If it fails, restore the protected runtime instead of weakening or bypassing the check.
- `npm run build` preserves the mobile runtime and prepares the static Cloudflare Worker output required by Sites. Before a Sites handoff, confirm `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`, and source `.openai/hosting.json` exist, then run `npm run test:sites`. Do not replace this project with a Vinext starter.

## Runtime Contract

- Preserve the mobile device runtime unless the user's task explicitly asks otherwise. Do not replace it with a standalone page. Visual fidelity applies to app-owned content inside the device screen, not to template-owned device chrome.
- Keep `App` composed around `PhoneFrame` -> `KeyboardProvider`, with `StatusBar`, app content, `HomeIndicator`, and `KeyboardDock` mounted inside the phone frame. `StatusBar` and the iOS home indicator are overlaid device chrome. When the Android keyboard is closed, the app viewport reserves the protected navigation-bar region instead of painting behind it. When the Android keyboard is open, preserve the current full-screen keyboard layout: its asset includes the IME navigation strip and the separate black navigation bar is hidden. iOS screens continue to paint behind the home-indicator area and own their safe-area content padding.
- Preserve the `iPhone` / `Pixel 10` device picker and both calibrated device presets. The Pixel screen is `427 x 952`; its `32 x 32` camera circle and `public/assets/android/navigation-bar.svg` bottom navigation bar are protected device chrome, not app content.
- Preserve the device picker's intentionally lightweight Codex styling in the top-right corner: its trigger wrapper is borderless and transparent, its trigger sizes to content, and its right-aligned menu uses the compact 3px inset plus the specified hairline and elevation shadow layers. Keep the prototype root and default app screen white.
- Preserve `StatusBar` as live device chrome, including its platform-specific typography, source status-icon assets, and spacing. Pixel 10 uses Roboto, Android indicators, and 32px top, left, and right padding. iPhone uses its iOS indicators, system typography, and calibrated spacing. Do not hardcode screenshot times like `9:41` into the status bar, replace its real-time clock, or move status bar content into app markup unless the user explicitly asks for a fixed/mock device time.
- `PhoneFrame` owns the calibrated device frame, screen portal, device picker, camera cutout, and custom cursor. Keep device assets in `public/assets/iphone/` and `public/assets/android/`; if an asset fails to load, repair the asset path or restore the asset instead of removing the frame, keyboard, or image render.
- Use `MobileScroll` directly for simple single-screen prototypes. Use `FlowStack` for conventional multi-screen flows whose routes can own their fixed header and footer; when using it, define each route as a `FlowScreen`: `{ id, header?, headerHeight?, footer?, footerHeight?, render }`, and use `flow.push(screen)`, `flow.pop()`, and `flow.replace(screen)` from `FlowStack` render callbacks or `useFlow()` instead of introducing another router.
- Use `Carousel` for a carousel, horizontal rail, swipeable cards, image or media strip, horizontally scrollable cards, chip rail, or other horizontal collection.
- For a layered app shell—such as a persistent composer, independently presented sheet, pushed/peek sidebar, or app-wide transition—compose directly in `Prototype.tsx` rather than forcing it through `FlowStack`. Keep app-owned fixed chrome as sibling layers outside `MobileScroll`.
- When using `FlowScreen`, put route-owned fixed headers or footers in `FlowScreen.header` or `FlowScreen.footer`. Set `headerHeight` to the visible app-toolbar height; `FlowStack` adds the device's top safe-area/status-bar inset automatically. Do not include `StatusBar` or its height in the header. Set `footerHeight` to the full app-footer height. `FlowScreen.footer` is an overlay, not reserved layout space; screens using it must add their own bottom content padding such as `padding-bottom: calc(var(--flow-footer-height) + var(--mobile-safe-area-height) + 24px)` so final content can scroll above the footer while still painting behind it.
- Render only scrollable content inside `MobileScroll`; it is for content that should move with scroll and rubber-band overscroll. Keep app-owned headers, nav bars, tabs, composers, and overlays outside it. This keeps scroll physics, safe areas, keyboard insets, scrollbars, and drag click suppression active without letting content paint under fixed chrome.
- Buttons, links, cards, and images inside `MobileScroll` should still allow drag scrolling when the pointer moves beyond tap slop. Use `data-scroll-drag="ignore"` only for rare controls that must own the drag gesture themselves.
- Do not add `var(--keyboard-height)` to ordinary screen/content padding inside `MobileScroll`; the scroll viewport already shrinks above the simulated keyboard. For custom fixed composers, search bars, or toast chrome, use `useKeyboardInsets().bottomInset`. It is relative to the app viewport: Android returns `0` while the closed-keyboard viewport already reserves navigation, then returns the keyboard height while open; iOS continues to clear the home indicator while closed and ride directly above the keyboard while open. Do not pin custom bottom chrome to `bottom: 0` or only `keyboardHeight`.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for every text-entry control. A raw `input` or `textarea` disconnects focus, keyboard animation, safe-area insets, and attached surfaces.
- Use `BottomSheet` for phone-scoped sheets. Its props are `open`, `onOpenChange`, `title`, optional `description`, optional `snap`, and `children`; it renders through the phone screen portal and dismisses the keyboard before opening.

## Horizontal Carousels

- Use `Carousel` for horizontally draggable cards, images, media, chips, or other horizontal collections. Do not recreate these with `overflow-x`, custom pointer handlers, or a generic div.
- `Carousel` can be nested directly inside `MobileScroll`. It owns horizontal gestures and automatically yields vertical gestures to the parent.
- Never put `data-scroll-drag="ignore"` on or around a `Carousel`; doing so prevents vertical parent scrolling when a gesture begins inside it.
- Do not add CSS scroll snapping to `Carousel`; its runtime owns momentum and release motion.
- Use `data-scroll-drag="ignore"` only when a control must prevent parent scrolling in every drag direction.

See `src/mobile/COMPONENTS.md` for the full component and gesture contract.

## Keyboard Rule

The simulated keyboard is a separate top-layer component. Before presenting anything that behaves like iOS navigation or modal UI, dismiss it first.

Call `keyboard.hide()` before:

- pushing, popping, or replacing FlowStack routes
- opening bottom sheets, action sheets, dialogs, menus, or navigation sheets
- starting transitions where the destination should not inherit text-input focus

`FlowStack` already hides the keyboard for `push`, `pop`, and `replace`. `BottomSheet` already hides it before opening. If you add new modal/sheet/navigation primitives, follow the same rule.

When a composer, search surface, or other keyboard-attached component closes, call `keyboard.hide()` in the same event before changing that component's open state. Position attached surfaces from `useKeyboardInsets()` rather than a separate timer or visibility flag so both dismiss together.

When any text-entry control loses focus, dismiss the simulated keyboard. If the control is custom or does not use the runtime's keyboard-aware fields, handle its blur event and call `keyboard.hide()` explicitly. Keep the keyboard open only when focus is moving directly to another text-entry control that should share the same keyboard session.

## Interaction Rules

- Do not trigger buttons or inputs after a pointer has become a drag. Preserve the drag suppression behavior in `MobileScroll`.
- Do not allow native browser image/file dragging inside the phone frame. Preserve the phone-level `dragstart` suppression and non-draggable image styles so scroll drags that begin on images still scroll the prototype.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for text entry so the simulated keyboard and safe-area insets stay connected.
- Fixed phone chrome should not animate with pushed screens. Screen content can animate; the status bar, camera cutout, and preview chrome should stay put.
- Keep the keyboard below the home indicator/safe area layer in z-index, and above ordinary app UI while visible.
- Keep the home indicator as the topmost safe-area layer in the z-index above everything else in the prototype.

## Preferências do Trelelê definidas pelo usuário

- Aplicativo para celular; não tratar como página web ou cartaz de divulgação.
- Direção 3 escolhida: serif expressiva, paleta brasileira e ondulado. Após revisão, fundo verde-mata, mídia imersiva e área amarela contínua da pessoa.
- Não retornar ao catálogo de capas, campos cinza, página toda branca, títulos enormes ou botões X/coração soltos. Decisões pertencem ao cartão.
- Qualquer nova direção ou alteração visual deve passar por crítica independente ANTES de gerar/implementar, e por inspeção do resultado.
- Target revisado: generated_images/exec-684aaeda-d6b2-4631-9a15-e88feeb45967.png, fora desta pasta; a imagem é estudo, não screenshot.
- Foto da pessoa só após conversa e consentimento dos dois. Foto de exemplar sem pessoa e capa de catálogo têm tratamento distinto. Perfis e exemplar deste beta são fictícios/ilustrativos.

## Publicação como app responsivo — decisão explícita do usuário

O usuário solicitou retirar a moldura iPhone/Pixel e o seletor da versão publicada para usar o app diretamente no celular. Esta instrução específica autoriza a alteração do runtime para dois modos:

- Produção sem query: app responsivo ocupando o viewport real, com teclado e rolagem nativos e safe areas do navegador. Não renderizar moldura, seletor, câmera, status, cursor, home indicator ou teclado artificiais.
- `?preview=1`: manter o simulador calibrado com iPhone e Pixel. DEV também mantém o simulador por padrão; `?app=1` ou `?standalone=1` permite verificar o app responsivo em DEV.
- DeviceProvider mede o viewport visual real e as safe areas. A altura visual já considera o teclado nativo: não subtrair sua altura novamente. Redimensionamento não deve reinicializar perfil, conversa, livros ou rascunhos.
- PhoneFrame mantém o provider do portal nos dois modos; no app publicado, sua superfície acompanha o viewport real. Sheets permanecem dentro desta superfície.
- MobileScroll e Carousel usam scroll e toque nativos no app publicado. O gesto de decisão continua app-owned, horizontal intencional; o simulador mantém sua física original.

Validação desta alteração: inspeção real pelo root em iframe de 390 × 760 e 360 × 640, sem escala artificial, confirmou interface sem moldura, navegação, gesto/botões, Deu liga, abertura de conversa, envio de mensagem, retorno de perfil e sheet de foto bloqueada. Isso não equivale a teste em hardware físico Safari/iOS ou Android. A atualização dos hashes do runtime foi autorizada após esta verificação.

## Conexões e conversas — revisão aprovada pelo usuário

A antiga aba Curtidas passa a ser Deu liga e mostra somente conexões recíprocas ativas. Não exibir listas de curtidas enviadas ou recebidas sem reciprocidade. Conversas separa novas conexões sem mensagem, em uma faixa horizontal, do histórico com mensagens, em linhas com nome, capa, última mensagem e horário real do estado. Sem contagens de não lidas inventadas.

O chat usa cabeçalho compacto verde, acesso ao perfil por capa/nome, menu de segurança, chip discreto para foto, fundo verde imersivo, balões creme/amarelo e compositor integrado. Não mostrar navegação raiz dentro da conversa. Voltar deve restaurar a aba de origem; perfil aberto pelo cabeçalho retorna à conversa. Preservar rascunhos e regras de privacidade. Descobrir e a celebração inline permanecem visualmente iguais nesta revisão.

## V8 — galeria, navegação e perfil local

Por solicitação explícita do usuário, a galeria de cada pessoa possui seis posições: três livros públicos e três posições de fotos protegidas. Toque lateral e gesto horizontal navegam pela galeria; curtir e passar acontecem somente nos botões. A opinião mantém o último livro selecionado ao abrir uma posição de foto. Os espaços protegidos do beta são fundos abstratos; não carregar arquivos privados de usuários reais nesses espaços, perfis fictícios, conexões ou chat.

O perfil local exige três livros distintos e três fotos distintas. Metadados ficam no navegador; originais das fotos ficam somente no IndexedDB do proprietário. Prévias de arquivos originais devem existir apenas no editor e em Meu perfil visível, com URLs temporárias revogadas no cleanup. A entrada em perfil concluído e a saída do editor revalidam metadados, catálogo e presença das três fotos. Esta etapa não cria autenticação, conta online nem transmissão entre pessoas.

A navegação inferior e o compositor usam verde translúcido, blur de 16px e borda fina, mantendo espaço reservado e safe areas. No modo nativo, o viewport visual é o único proprietário da altura e do deslocamento superior; o inset inferior da superfície de rolagem é zero enquanto o teclado está focado. O fundo do documento acompanha o verde somente no modo nativo. Esta correção precisa de validação em aparelhos Safari/iOS e Android; inspeção em navegador e iframe não equivale a teste físico de teclado.

### Estado de validação do checkpoint V8

O root autorizou atualizar os hashes de Device.tsx e PhoneFrame.tsx para este checkpoint após inspeção parcial real da galeria e do foco de campo em viewport de 360px. A fonte destes dois arquivos permaneceu igual após essa inspeção. O fluxo completo do cadastro com fotos ainda não foi validado no navegador: a ferramenta de navegador ficou indisponível, inclusive após reinicialização. Este checkpoint é rascunho e não constitui aprovação para substituir a versão pública V7. Não declarar teclado Safari/IME físico verificado. Antes de publicar V8, concluir cadastro, edição, remoção de dados e privacidade das três fotos no navegador e confirmar os estados de erro.

## Marca fornecida pelo usuário — 16/10/2026

A marca passa a usar o artwork ORIGINAL de IMG_1497.jpeg, preservado em public/assets/brand/trelele-original.jpg. O símbolo e as letras não devem ser redesenhados. IMG_1496 é referência da abertura: fundo claro, logo central, ondas verdes e laranja, CTA Começar; frase exata: “O seu app de encontros literários.” O logo é enquadrado por CSS, mantendo pixels e proporções do arquivo fornecido. Verde vivo e laranja são acentos; verde escuro garante contraste nas superfícies com texto claro. Aplicar identidade em todas as telas sem reiniciar perfil, conversas ou regras de privacidade. Esta referência autoriza abertura clara e substitui a preferência anterior de abertura verde.

Esta revisão não tem aprovação visual final: a ferramenta do navegador voltou a falhar por timeout de transporte de 300 segundos, inclusive com limite solicitado de 15 segundos. Compilação e integridade do runtime passaram. Não alegar screenshot novo, inspeção visual de todas as telas ou cadastro completo validado.

## V10 — gesto e navegação solicitados após as novas referências

Esta decisão explícita do usuário substitui a regra V8 de arrastar para navegar a mídia: no Descobrir, arrastar horizontalmente o cartão decide a pessoa. O cartão acompanha o dedo e só confirma a preferência depois de soltar e concluir a saída. Arrasto curto ou vertical, cancelamento e Escape não decidem. Botões e gesto compartilham uma única trava por pessoa. Curtida recíproca recentra o cartão para a celebração inline. Reduced motion elimina a transição.

Os três livros e as três posições protegidas agora navegam por toque lateral, indicadores e botões anterior/próximo, sem outro gesto horizontal concorrente. Arrastar a partir de um controle não deve acioná-lo como toque ao soltar. Perfil completo não participa do gesto de decisão.

Meu perfil possui acesso a Configurações. AccountFlow separa editar, pausar/retomar, informação e confirmação de apagar dados locais. Pausa persiste antes de alterar a interface. Exclusão só navega à abertura após os storages concluírem; erros continuam visíveis. O histórico de demonstração e os rascunhos são hidratados antes do autosave, com falha de leitura explícita e sem sobrescrever dados corrompidos silenciosamente.

Concluir uma edição de perfil invalida os consentimentos da imagem na demonstração somente quando os IDs das fotos mudaram. O editor compara as imagens publicadas localmente com o estágio antes do commit e entrega photosChanged ao aplicativo; editar apenas texto mantém os aceites. Fotos de rascunho só substituem as publicadas localmente após commit do editor; nenhuma imagem original do proprietário deve entrar em perfis de demonstração ou no chat.

## V10 — encontros literários como foco central (16/10/2026, 14:39)

Decisão expressa do usuário: toda mudança deve priorizar conhecer pessoas pelos livros e pela conversa, não pela aparência. Gostos e perguntas do cadastro devem tratar de gêneros literários, rotina de leitura, programas envolvendo livros e indicações pessoais. Linguagem curta e natural, sem promessas de compatibilidade calculada. Perguntas literárias extras são opcionais, com Pular, e as respostas aparecem como assuntos no perfil. Nome, nascimento adulto, identificação e interesse continuam necessários ao contexto de encontros. Não importar hábitos, signos, aparência ou seis fotos públicas só porque aparecem no Tinder.

A referência de fluxo é o conjunto de 31 prints fornecidos pelo usuário, inventariado em docs/V10-COBERTURA-FLUXOS.md. São evidência de composição e estados; não provam código, algoritmo, física de swipe nem destinos de todos os botões. Não colocar os prints privados no repositório público.

Esta V10 altera o contrato anterior do gesto: arrastar horizontalmente decide CURTIR/PASSAR a pessoa; botões de decisão são equivalentes; toque lateral e controles explícitos mudam entre três livros e três posições protegidas. Cancelamento, scroll vertical, alvos interativos e reduced motion precisam preservar comportamento. O protótipo continua local e demonstrativo. Pausa, rascunhos, fotos privadas e exclusão têm escopo deste aparelho; não fingir conta remota.

O commit público confirmado antes desta revisão foi 9ed8830 (marca nova). As anotações anteriores de QA descrevem checkpoints históricos, não prova de que a V10 está publicada ou visualmente aprovada.
