# Margem V2 — segurança das interações e consentimento

Data: 16/10/2026. Complemento de `SEGURANCA.md`, usando o roteiro ECC `security-reviewer` já lido. Escopo: nova interface de descoberta inspirada em comportamentos observáveis do Tinder. As referências visuais não alteram as regras de privacidade da Margem.

## Estado da revisão

Revisão concreta feita após aviso de conclusão do frontend, por leitura e execução em DOM emulado. Arquivos lidos: `dist/app.mjs`, `dist/domain.mjs`, `dist/interaction.mjs`, `dist/index.html`, `dist/_headers`, o harness e testes correspondentes. Não foi realizada auditoria de backend, pentest ou validação de gestos em navegador/dispositivo nativo. A existência de testes anteriores do domínio não comprova, sozinha, que o gesto esteja correto.

## Critérios críticos

| ID | Risco | Aceite verificável |
|---|---|---|
| V2-SEC-01 | Like por toque ou movimento incidental | Toque no cartão, pequena oscilação e scroll vertical não registram decisão. Arrasto precisa ultrapassar limiar intencional com direção horizontal predominante. |
| V2-SEC-02 | Arrasto cancelado provocar ação | Soltar antes do limiar, `pointercancel`, perda de captura e abandono do gesto restauram o cartão sem curtida. Uma decisão é emitida no máximo uma vez por gesto. |
| V2-SEC-03 | Clique sintético depois do swipe | O clique posterior do mesmo gesto não abre detalhes nem aciona outro botão; transição/animação não permite decisão duplicada no perfil anterior ou seguinte. |
| V2-SEC-04 | Controles internos herdarem swipe | Clicar em detalhes, menu, favoritar, denunciar ou segurança não dispara curtida/passe por propagação. Controles funcionam também sem arrastar. |
| V2-SEC-05 | Rewind restaurar pessoa bloqueada | Voltar atua somente em decisão elegível de descoberta. Nunca desfaz bloqueio, suspensão, restrição etária, unmatch ou revogação de consentimento. Elegibilidade é revalidada ao exibir e ao agir. |
| V2-SEC-06 | Bookmark equivaler a match | Favoritar salva interesse pessoal, não envia mensagem nem cria conexão. Superlike, se existir, também não substitui interesse recíproco. |
| V2-SEC-07 | Like ou favorito revelar rosto | Antes da condição de conversa e dos dois aceites para a versão atual, nenhuma interação de descoberta, detalhe, modal, rewind, conexão ou plano pago revela foto privada. |
| V2-SEC-08 | Controle de demo parecer identidade real | Rótulo “Demonstração — pessoas e conversas fictícias” permanece perceptível. Painel de simulação pode ser recolhido, mas seus eventos são identificados como simulados. |
| V2-SEC-09 | Simulação produzir falsa expectativa operacional | Botão de denúncia/bloqueio/consentimento deixa claro o efeito local fictício; não promete envio a moderador, contato humano, cadastro ou verificação real. |
| V2-SEC-10 | Cartão antigo continuar operável | Depois de bloquear, encerrar match ou mudar elegibilidade, detalhes abertos e botões antigos não permitem chat/revelação. Ações consultam o estado atual. |

## Sequências para revisão

1. Tocar no cartão; arrastar poucos pixels; fazer scroll vertical; cancelar arrasto. Verificar ausência de like, passe e criação de match.
2. Arrastar intencionalmente para cada lado; repetir rápido; tocar durante animação. Verificar uma decisão por cartão e ausência de ações no próximo cartão por evento anterior.
3. Usar botões de favorito, detalhes e menu no cartão. Confirmar que só executam a ação nomeada, sem alterar interesse recíproco.
4. Curtir, voltar e repetir; bloquear e tentar voltar; desfazer match e tentar voltar. Confirmar que rewind não remove barreiras nem restaura permissões.
5. Abrir detalhes antes do aceite, favoritar, curtir e avançar até match. Confirmar que foto continua protegida no fluxo. Testar um aceite, dois aceites, revogação e troca de versão quando o domínio oferecer esses estados.
6. Recolher controles de simulação e navegar por descoberta, conversa e perfil. Confirmar rótulo de demo, pessoas fictícias e ausência de efeito externo real.
7. Verificar que há alternativas a swipe e nomes acessíveis dos controles. Semântica correta reduz ações acidentais; auditoria de acessibilidade completa pertence à revisão de UX.

## Fronteira do protótipo

No protótipo estático qualquer imagem incluída no pacote pode ser inspecionada. O fluxo de ocultação demonstra a experiência, sem comprovar privacidade técnica de produção. Não incluir fotos privadas reais, credenciais, documentos, biometria ou uploads. A nova interface não transforma as regras simuladas em autorização no servidor.

## Go / No-Go da interface V2

**Go visual:** critérios críticos da interface inspecionados; demo claramente fictícia; nenhum dado real ou efeito externo; regressões encontradas corrigidas e novamente verificadas. Registrar separadamente o que só passou por inspeção de código e o que foi exercitado no navegador.

**No-Go da interface:** swipe acidental em clique/scroll/cancelamento; decisão duplicada; favorito criando conexão; rewind restaurando bloqueio/unmatch; foto revelada por interação sem consentimento; demo que aparenta comunidade real.

**Produção:** permanece No-Go até os requisitos e testes de `SEGURANCA.md` serem implementados e comprovados no backend e na operação. Nenhuma aprovação visual significa ausência de brechas.

## Resultados após implementação

Executado `npm test`: **38 testes aprovados, nenhuma falha** (17 de domínio, 7 de classificação de gesto e 14 de DOM emulado). Acrescentadas duas verificações avulsas, sem criar ou alterar testes: dar match com Ana, bloquear ou encerrar a conexão, voltar à descoberta e acionar rewind; em ambos os casos a pessoa não reapareceu e a conversa não foi restaurada.

| Critério | Evidência obtida | Resultado e limite |
|---|---|---|
| V2-SEC-01 a 04 | Limiar por distância/dominância horizontal, rejeição de botão no início, supressão de click; testes de tap, repetição de pointerup/click, scroll, cancelamento e controle interno | Passou no DOM emulado. Gestos reais com layout, captura e multitouch continuam para QA de navegador/dispositivo. |
| V2-SEC-02, perda de captura | Handler `lostpointercapture` confirmado na versão final; teste específico aprovado | Ausência inicial corrigida pelo arquiteto e verificada nesta revisão. |
| V2-SEC-05 | `rewind()` recusa qualquer match existente, inclusive encerrado/bloqueado; filtro mantém bloqueados fora da descoberta; duas sequências avulsas aprovadas | Não restaurou as conexões testadas. Texto do toast pode sugerir procurar conversa mesmo para match encerrado: melhoria de precisão, sem reativação observada. |
| V2-SEC-06 | Não há bookmark/favorito ou superlike acionável na V2; variável sem uso não representa recurso | Não aplicável nesta interface; manter aceite caso o recurso seja adicionado. |
| V2-SEC-07 | `portrait()` produz SVG fictício somente no ramo positivo de `canViewPhoto()` no chat. Domínio exige tempo/turnos/dois aceites e versões. Testes de revogação, troca de versão, unmatch e block aprovados | Fluxo de simulação passou. Não existe endpoint de foto privada; não há proteção de mídia real para certificar. |
| V2-SEC-08 e 09 | Barra “Demo · perfis fictícios”, informações do projeto, disclosure recolhido “Controles da simulação”, denúncias descritas como não enviadas | Rótulos confirmados no HTML/JS; percepção e visibilidade em cada viewport dependem da revisão visual. |
| V2-SEC-10 | Domínio rejeita novo like em match encerrado e após bloqueio, impede chat/revelação; rewind não altera esses estados | Guardas lidas e testes de domínio aprovados; comportamento distribuído/concorrente de servidor não existe nesta demo. |

Não foi encontrado bloqueador P0 novo no escopo lido. Existe recomendação adicional de robustez enviada ao arquiteto: em `endDrag`, conferir se o cartão ainda está conectado e corresponde à pessoa atual antes de decidir, evitando ação de gesto antigo após eventual troca de tela/render. Sem evidência de exploração pelo fluxo normal e sem efeito externo, não foi classificada como P0 desta demonstração. Deve ser resolvida antes de reutilizar o handler em uma implementação assíncrona real.

Leitura confirmou ausência de chamada de rede para conversa, foto ou verificação no `app.mjs` revisado; dados e rascunhos ficam em memória. `_headers` declara restrições a câmera, microfone e geolocalização, além de CSP; não foi comprovado que o host aplique esse arquivo como cabeçalhos HTTP.

**Conclusão limitada:** apto do ponto de vista dos fluxos simulados revisados, condicionado à QA visual e de gesto nativo. Produção com pessoas/dados reais permanece No-Go conforme `SEGURANCA.md`. Resultado não é promessa de ausência de brechas.
