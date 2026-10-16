# V10 — fluxo e encontros literários

final result: blocked

Implementação revisada por três agentes independentes: preflight visual, cobertura de fluxos e código/privacidade. Foram inspecionados 31 prints originais; observações e adaptações estão distinguidas nos documentos V10.

Implementado: abertura da marca preservada; regras breves; 11 etapas com perguntas literárias opcionais; rascunho de metadados e fotos separado do perfil confirmado; swipe com movimento, cancelamento e decisão única; configurações, pausa/retomada e exclusão local; conversas e rascunhos persistidos com esquema validado. A troca de fotos invalida aceites; editar apenas texto não.

Verificação: build, TypeScript e check:runtime (28 arquivos protegidos) passaram. 41 testes de perfil/transações/sessão/swipe, quatro testes de empacotamento e 24 testes de domínio/gesto passaram: 69 no total. IndexedDB foi exercitado com fake-indexeddb de desenvolvimento; isso não é prova de upload ou interação no Safari físico.

QA visual e percurso completo no navegador continuam pendentes. O navegador cloud falhou por timeout de transporte. A suíte Playwright padrão não iniciou devido a uv_interface_addresses no servidor Vite; uma configuração temporária com host loopback avançou até o launcher e constatou que chromium_headless_shell não está instalado. Nenhuma dessas falhas foi tratada como teste aprovado. Configuração temporária removida; nenhum runtime alterado para contornar checks.

Limitações materiais: conta real/autenticação, catálogo remoto de livros, usuários reais, localização, backup de fotos e pagamentos não foram implementados. Opiniões de demonstração e seleção visual atual de mídia não têm restauração prometida após reload. Nenhuma imagem privada foi copiada para o repositório público.

A V10 não recebeu aprovação de inspeção visual, não tem screenshot de aceitação e não deve ser anunciada como versão publicada.

---

# Revisão da marca Trelelê — referência do usuário

final result: blocked

Implementação: logo original fornecido, abertura clara com ondas verdes/laranja e frase “O seu app de encontros literários.”, CTA Começar; paleta propagada ao cadastro, descoberta, conexões, perfil, chat e sheets. Preflight independente aprovado com restrições de contraste.

Build e check:runtime passaram após integração. A captura e comparação visual da implementação não foram possíveis: o navegador cloud expirou após 300 segundos em 16/10/2026. Não há screenshot novo de aprovação. Cadastro com upload/retomada/exclusão e teclado físico continuam pendentes. Nenhum teste estático substitui esse fluxo.

A onda foi gerada como asset decorativo transparente com ferramenta integrada; não é screenshot. Os JPG de marca são cópias exatas dos originais do usuário, exibidos por enquadramento CSS.

---

# Trelelê V8 — BLOQUEADO PARA PUBLICAÇÃO

V8 segue somente como checkpoint na branch `v8-cadastro-em-revisao`. **Main e versão pública permanecem inalterados.** O crítico aprovou a fonte parcial para armazenamento e os hashes de runtime, não o lançamento do cadastro.

## Evidências atuais

- Responsável verificou galeria de seis posições, cadeados e navegação em viewport efetivo 390; foco de chat em 360 foi verificado parcialmente. Captura: `trelele-v8-galeria-chat.jpg`.
- Abertura inicial teve contraste ruim. CSS foi corrigido, sem captura posterior de confirmação.
- Etapa 1 do cadastro foi observada pela árvore de acessibilidade. Não houve percurso completo do cadastro, upload real de três imagens, retomada e exclusão.
- Três timeouts de 300 segundos da ferramenta de navegador, inclusive após reset, impediram continuar. Nenhuma aprovação é inferida dessa indisponibilidade.

## Verificação de código

A auditoria executou 33 testes de domínio/gestos/cadastro, todos passaram, e confirmou audit completo com zero vulnerabilidades após atualização compatível de transitivos. O autor informou build final, integridade dos 28 arquivos protegidos e quatro testes Worker aprovados após autorização dos dois hashes de viewport. Fotos originais permanecem no IndexedDB do dono; a galeria pública usa placeholders abstratos e não carrega originais atrás de blur.

## Pendências obrigatórias

Revalidar abertura corrigida e cadastro completo; testar seleção de três livros e três fotos, erros, recarga/retomada, edição e exclusão; conferir fotos do dono versus perfis fictícios, teclado, rolagem e retorno em 390/360. Viewports de navegador não são hardware físico nem prova de IME/Safari real. O beta não possui autenticação ou backend de compartilhamento e não anuncia criptografia ou verificação de identidade.

Detalhes: `../docs/ECC-V8-REVISAO.md`. **Não publicar V8 enquanto esse gate permanecer aberto.**

---

# Histórico — V7 e anteriores

As aprovações abaixo pertencem às versões anteriores. Não aprovam o cadastro nem as alterações V8.

# Trelelê V7 — fonte e revisão visual concluídas

## Resultado atual

V7 modifica Deu liga, Conversas, conversa individual e apresentação do perfil. Descobrir conserva a direção aprovada: verde-mata, mídia de livro/exemplar, onda amarela e decisão integrada. Nenhuma alteração de runtime protegido foi necessária nesta rodada.

O responsável principal executou os fluxos no navegador em viewports efetivos de 390 e 360 px. O crítico independente aprovou visualmente inbox e conversa. Referências atuais do aplicativo executado: `../docs/design-v7/inbox.jpg` e `../docs/design-v7/conversa.jpg`. São capturas de execução; os targets gerados de etapas anteriores não substituem essas evidências.

| Verificação | Resultado atual |
| --- | --- |
| Build TypeScript/Vite/Worker | Passou |
| Integridade do runtime | Passou: 28 arquivos |
| Testes Worker | 4/4 passaram |
| Domínio e classificador compartilhados | 24/24 passaram; hashes iguais à raiz |
| Revisão estática independente | Nenhum P1 conhecido aberto |
| Revisão visual do crítico | Aprovada: inbox e conversa em 390/360 |

## Fluxos efetivamente verificados pelo responsável

- Curtida recíproca de Ana → continuar → rail com uma conexão nova; lista com Lia.
- Primeiro envio para Ana → voltar à inbox → rail vazio e exatamente uma linha de Ana, junto de Lia; sem duplicação.
- Envio a Lia atualiza a última mensagem. Abrir perfil e voltar preserva a conversa.
- Conversa aberta em Deu liga retorna a Deu liga.
- Não há histórico de curtidas enviadas na UI.
- Chip de foto de Ana em 360 px abre as regras, mantém o aceite desabilitado enquanto bloqueado e não carrega rosto.

A revisão encontrou e o autor corrigiu um P2: desfazer conexão no perfil aberto pelo chat deixava o perfil residual. Agora limpa perfil, conversa e sheet e retorna à origem. O coração da aba Deu liga foi mantido como ícone de conexão, ajuste de plano aceito pelo responsável.

## Alcance e limites

Esta auditoria executou testes de código, mas não operou o navegador: os resultados renderizados acima foram fornecidos pelo responsável e aprovados pelo crítico. Viewports de navegador não equivalem a hardware físico, Safari/iOS real ou IME nativo. Bloqueio e desfazer conexão foram revisados no código e no domínio; não foram registrados como execução de navegador nesta V7. O runtime standalone segue a base anterior: produção sem query, simulador por `?preview=1` ou desenvolvimento.

O protótipo não possui backend, conta, GPS, upload, catálogo ao vivo, cobrança ou mensagens reais. Estado e relógio são locais e reiniciam ao recarregar. As cinco falhas conhecidas da suíte histórica V5 não foram mascaradas e não exercitam esta interface React. Detalhes: `../docs/QA-V7.md`. Publicação e verificação da URL final são responsabilidade do agente principal.

---

# Histórico de QA — etapas V6 e correção standalone

O conteúdo abaixo é histórico. Seus itens pendentes e aprovações descrevem apenas as versões e configurações citadas; não substituem o resultado V7 acima.

# Produção standalone — validação da fonte

O usuário relatou que moldura e seletor de aparelhos impediam o uso no próprio telefone. A adaptação de runtime foi explicitamente autorizada pelo usuário e aprovada pelo crítico. Produção sem query usa o viewport real; simulador permanece em desenvolvimento ou `?preview=1`.

## Resultado após a correção

O responsável principal verificou a aplicação no navegador, em **iframes com viewport efetivo de 390 × 760 e 360 × 640**, sem escala artificial. Testou curtir, “Deu liga!”, abertura de conversa, envio de mensagem, retorno de perfil, “Continuar olhando” avançando uma vez e sheet da foto bloqueada. O supercrítico aprovou visualmente a captura `trelele-standalone-390-360.jpg`.

Após essa verificação, o responsável autorizou a atualização do lock de runtime. A auditoria independente executou novamente:

| Verificação | Resultado |
| --- | --- |
| `npm run build` | Passou: TypeScript, Vite e Worker |
| `npm run check:runtime` | Passou: 28 arquivos protegidos |
| `npm run test:sites` | 4/4 passaram |
| Domínio e classificador compartilhados | 24/24 passaram; hashes idênticos à raiz |

A revisão de código confirmou: produção não monta moldura, seletor, status bar, indicador, teclado fictício ou cursor; viewport e safe areas derivam do navegador; MobileScroll e Carousel deixam captura/gestos customizados restritos ao simulador; o índice inclui `viewport-fit=cover`. A decisão durável está em `AGENTS.md`.

## Alcance e pendências

Essa validação usa navegador e iframes, **não hardware físico nem Safari/iOS real**. IME/teclado nativo, barras dinâmicas de Safari, rotação física e safe areas de aparelho com recorte ainda exigem teste no telefone. A auditoria independente não operou o navegador; registrou a evidência fornecida pelo responsável e pelo crítico. O responsável ainda fará deploy e verificação da URL publicada sem query. O caminho `?preview=1` foi preservado por código e não deve ser apresentado como reteste físico.

O check inicialmente acusou sete mudanças no runtime. Os hashes só foram atualizados após validação e autorização; nenhum check foi removido ou ignorado.

---


# Trelelê — QA de design V6

## Estado da validação

Implementação baseada no alvo aprovado pelo supercrítico, com onda, decisão integrada e celebração “Deu liga!” no cartão. Build e integridade do runtime passaram após os ajustes finais. A auditoria independente não operou navegador. Os resultados renderizados abaixo são relatados pelo responsável principal e inspecionados pelo supercrítico em `../docs/SUPERCRITICA-V6.md`.

## Limites dos testes

- A configuração `qa=360` é um **container de 360 × 740**, não um dispositivo real de 360 px nem substituto do iPhone/Pixel calibrados do runtime.
- Os 17 testes de domínio e sete do classificador não validam tamanho de fonte, legibilidade ou percepção do gesto.
- Os quatro testes Worker validam empacotamento e rotas, sem aprovação visual.
- A suíte histórica V5 tem cinco falhas conhecidas e não exercita o React V6.

## Correções verificadas em código

- Tabs ficam inertes durante a celebração, evitando desmontagem da camada sem saída.
- Header, navegação, controles de livro e painel ficam inertes durante a celebração.
- Foco inicial ocorre uma vez por conexão; Tab circula pelos dois CTAs; Escape encerra.
- Teclado é ocultado ao celebrar; posicionamento do compositor usa o hook do runtime.
- Movimento reduzido desativa animações e confetes.
- Capa autêntica e exemplar ilustrativo têm estados separados.
- Aceite, revogação, troca de imagem e bloqueio continuam no domínio compartilhado.

## Evidência renderizada

| Evidência | Resultado registrado pelo supercrítico | Alcance |
| --- | --- | --- |
| Captura principal em 393 | Aprovada visualmente | Proporções e chrome da configuração inspecionada |
| `trelele-v6-container-360.jpg` | Layout aprovado | Container 360 × 740, não aparelho real; responsável mediu scrollWidth = clientWidth = 360 |
| `trelele-v6-deu-liga.jpg` | Rejeitada | Estado deslocado/cortado e subtítulo com contraste baixo; não usar como captura final |
| `trelele-v6-liga-final.jpg` | Overlay 393 aprovado | Mensagem, capas e dois CTAs inteiros; sem teclado visível |

O responsável relatou gestos reais: curto e vertical preservam Ana; direita intencional gera curtida recíproca; esquerda avança Davi para Bia sem dupla decisão. Também relatou overlay descendente do article e URL inalterada. Não foi executado cancelamento real de ponteiro em integração; o classificador puro tem testes unitários, mas isso não testa eventos de navegador.

A captura rejeitada foi afetada por `locator.click`/`scrollIntoView`, que rolou `.device-screen` até 288. Após recarga e toque nativo, scrollTop foi 0, `keyboard.visible` era falso e não havia inputs montados. A primeira imagem mostra evidência inválida para handoff, sem comprovar um defeito do teclado do runtime.

O responsável confirmou no navegador que “Puxar assunto” abre a conversa de Ana.

**Ainda pendentes neste registro:** overlay em container 360; CTA “Continuar olhando”, Escape e movimento reduzido. Não fechar esses itens apenas pela existência de CSS/handlers.
