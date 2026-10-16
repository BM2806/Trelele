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
