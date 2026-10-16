# Trelelê V3 — verificação da experiência mobile

Estado: verificação técnica concluída; resultado final vigente 57/57 no fechamento ao fim deste documento.

## Escopo e método

A V3 prioriza interface de aplicativo mobile, navegação compacta e textos naturais. Testes são adaptados aos contratos e seletores finais; não se preserva texto antigo apenas para evitar ajuste de teste. ECC `tdd-guide` e `pr-test-analyzer` orientam regressões comportamentais e relato da evidência.

A revisão executa o código real no happy-dom, usa os módulos reais de domínio, gestos e copy quando houver. Sem servidor, navegador, screenshot ou QA visual nesta etapa. Layout real, sensação dos gestos, leitor de tela e responsividade dependem de verificação posterior em dispositivo.

## Aceites

- Descoberta abre diretamente o aplicativo: sem hero promocional, CTA de aquisição, painel comercial ou console técnico no fluxo principal.
- Cartão destaca a pessoa e o repertório literário; toque troca livro, swipe decide interesse. Um gesto resulta em uma decisão; cancelamento, perda de captura, scroll e controles internos não viram curtida.
- Botões correspondem a suas ações, possuem nomes acessíveis e são alternativas aos gestos.
- Match exige reciprocidade. Voltar não desfaz match ou conversa silenciosamente.
- Caixa distingue novas conexões e conversas; escolher uma pessoa abre a conversa correta e preserva rascunhos.
- Chat tem frases naturais e variadas: resposta de outro personagem não deve ser a mesma frase em todas as solicitações. Registro local da demo não é apresentado como mensagem entregue a pessoa real.
- Consentimento e versões de foto mantêm as garantias demonstráveis de domínio. Nenhum retrato aparece antes dos dois aceites e elegibilidade.
- Edição salva e prévia reflete valores atuais. Opções em painel inferior só persistem após concluir; fechar preserva a seleção salva.
- Arquivos citados em imports, CSS e imagens locais existem; fontes e ícones têm origem/licença identificadas quando anunciados como oficiais. Inspeção de arquivos não comprova titularidade ou autorização por si só.
- Avisos de demo permanecem disponíveis sem ocupar a conversa repetitivamente ou transformar cada frase em orientação técnica.

## Regressões preservadas

Fila e desfazer, match único, inbox, escape de texto, rascunho, filtro inválido, seleção staged, fotos e revogação, troca de versão, bloqueio/denúncia após encerramento, tap versus swipe, scroll/cancelamento/perda de captura, ponteiro secundário e commit único.

## Resultado

Pendente do aviso de conclusão da implementação V3. O total 43 da V2 não deve ser apresentado como evidência da V3 sem nova execução.

### Execução e achados intermediários V3

Após o primeiro aviso de frontend estável, `npm test` passou 50 casos (17 domínio, 7 gestos, 22 DOM, 2 copy e 2 integridade). `npm run check` passou quatro módulos. O harness foi adaptado para o módulo real `copy.mjs` e fornece a API padrão `structuredClone` do Node, ausente no happy-dom. Seletores foram ajustados para overview→edição e sheet contextual de simulação. O contador passou intencionalmente de “2 / 3” para “2 de 3”.

Três achados adicionais foram então reproduzidos com testes novos e falharam antes da correção:

1. Aceite unilateral não oferecia botão de revogação antes do aceite do outro lado.
2. Perfil de Ana → abrir um livro → fechar o livro encerrava o painel em vez de voltar ao mesmo perfil.
3. Na conversa, registrar `scrollTop=80` → voltar à inbox → reabrir Lia perdia a posição, retornando a zero.

Os três casos estão no final de `tests/ui.test.mjs`. Resultado intermediário DOM: 22 passaram e 3 falharam. Encaminhados ao autor do frontend; aguardando revisão e reexecução. Esses testes exercitam ações e estado observável, sem renderização real.

### Parecer final — Trelelê V3

Após o aviso de correções concluídas pela arquitetura, executei novamente os comandos completos:

| Verificação | Resultado real |
|---|---|
| `npm test` | **54/54 passaram**, zero falhas, ignorados, cancelados ou pendentes |
| Domínio puro | 17 casos |
| Classificador de gestos | 7 casos |
| Aplicação real em DOM emulado | 26 casos |
| Copy real | 2 casos |
| Integridade de dependências e proveniência | 2 casos |
| `npm run check` | `app.mjs`, `domain.mjs`, `interaction.mjs` e `copy.mjs` válidos; saída 0 |

As três regressões adicionais foram corrigidas e os testes antes falhos passaram. Outro caso protege o retorno do livro ao perfil seguido de curtida: fechar o overlay de match não ressuscita o perfil pai. O teste de scroll exercita leitura no elemento real `.messages`, navegação à inbox e reabertura da conversa, preservando o valor observado. Não depende de nomes de funções internas.

Também verificados: interface abre diretamente nos cards; header e navegação global são ocultados na conversa; controles de simulação ficam em painel separado; rota `#chat/lia` não reabre conexão encerrada; resposta simulada seguinte é diferente; frases do catálogo esgotam sem repetir fallback; nenhum placeholder `${...}` permanece no texto observado do chat; seleção de relacionamento só persiste ao concluir; arquivos de fonte, ícones e licenças coincidem com os hashes registrados no manifesto de proveniência. A marca visível nesta revisão final é Trelelê, ainda tratada como provisória.

Adaptações do harness: imports reais de `copy.mjs`, inclusive alias; clone dos dados do perfil por Window; API nativa `structuredClone` fornecida pelo Node porque happy-dom não a implementa; carregamento automático externo de CSS/scripts/iframes desativado. O código do aplicativo e os módulos de domínio/copy não foram substituídos por mocks.

**Conclusão:** demonstração aprovada no escopo técnico executado. Não foram iniciados servidor ou navegador, não houve screenshots, nem inspeção do layout renderizado ou gestos em dispositivo. Os 54 casos são 26 DOM, 26 unidades de lógica/copy e 2 integridades; não representam 54 testes E2E. Verificação visual, acessibilidade com tecnologia assistiva e testes nativos de scroll/captura/toque permanecem pendentes. Não há conta, chat real, cobrança ou proteção real de fotos nesta demonstração.

### Revisão adicional: histórico real das camadas

Após os 54 casos, a coordenação identificou um problema no histórico dos painéis: fechar por um `popstate` disparado manualmente não comprova que a abertura adicionou uma entrada que o botão Voltar possa percorrer.

Foram acrescentados três testes que usam `window.history.back()` no histórico emulado e aguardam o evento real produzido pela travessia, sem disparar `popstate` manualmente:

- Abrir o primeiro perfil deve acrescentar uma entrada; Voltar fecha o perfil antes de deixar a descoberta.
- Abrir livro dentro do perfil acrescenta outra entrada; dois comandos Voltar retornam ao perfil e depois à descoberta, sem novos pushes durante a travessia.
- Três ciclos abrir/fechar pelo X devem manter uma única entrada ativa de camada e não deixar entradas fantasmas entre rotas.

Baseline reproduzido: os três casos falharam por ausência de novas entradas de histórico na abertura. Correção encaminhada à arquitetura. O resultado 54/54 acima é anterior a esses três casos; o parecer final de histórico aguarda correção e nova execução. Mesmo aprovando o histórico no happy-dom, comportamento nativo do navegador e saída real do documento ainda precisam de teste em dispositivo.

### Fechamento após correção do histórico

Recebido o aviso de implementação estabilizada, executei independentemente `npm test` e `npm run check` completos. **Resultado final vigente: 57/57 testes passaram, zero falhas, cancelados, ignorados ou pendentes; sintaxe dos quatro módulos aprovada.** A composição final é 17 testes de domínio, 7 de gestos, 29 de DOM emulado, 2 de copy e 2 de integridade.

Os três testes de histórico que falharam no baseline agora passam. A abertura efetivamente acrescenta entradas ao histórico emulado; `history.back()` percorre livro → perfil → descoberta; fechar por X e reabrir não acrescenta entradas fantasmas. A implementação usa estado de camada e snapshots em memória; a revisão constatou a remoção do push artificial dentro da navegação de retorno.

Não iniciei servidor ou navegador. A conclusão comprova o comportamento testado no happy-dom, sem afirmar renderização, qualidade visual ou comportamento nativo de Voltar no navegador/dispositivo. A demonstração está aprovada no escopo técnico descrito; as limitações de produção e de validação visual permanecem.
