# Trelelê V8 — auditoria de arquitetura e jornada completa

Revisão estática de 16/10/2026, com ECC Architect e Planner. Escopo: `mobile-beta/AGENTS.md`, aplicação React, domínio, teclado/viewport, configuração de build e publicação, testes existentes, README e contexto do projeto. Não implementei alterações de produto nem executei teste em aparelho nesta revisão. Prioridades abaixo distinguem comportamento observado em código, requisito ausente e hipótese que exige reprodução visual.

## Parecer principal

O código canônico atual é `mobile-beta/`. Ele oferece uma demonstração local de descoberta, conexão e conversa, mas começa diretamente com um perfil fictício pronto. Não existe a jornada de criação de perfil pedida agora, nem conta real, nem galeria de três fotos privadas. A próxima entrega deve completar essa jornada de ponta a ponta e corrigir o enquadramento do teclado; acrescentar telas decorativas sem invariantes manteria as lacunas.

`dist/` e os testes DOM da raiz representam uma implementação anterior. Seus resultados não certificam o React atual. A documentação já reconhece essa diferença, mas ainda usa “V6” e afirma ausência de upload/conta/estado persistente: deve ser reconciliada com a entrega V8 efetivamente implementada, sem anunciar uma conta que não existe.

## Achados priorizados e verificáveis

| Prioridade | Local e evidência | Consequência | Correção mínima proposta |
| --- | --- | --- | --- |
| P0 antes de usuários reais | `Prototype.tsx`: `init()`, `useState`, `update()`, `D.like()` e aceites são locais; nenhum serviço de identidade, API ou banco foi encontrado nesse fluxo. | O navegador controla identidade, relógio, reciprocidade e revelação. “Perfil criado” não pode significar conta criada. | No beta, declarar perfil de teste no aparelho e não coletar credenciais/documentos. Para operação real, identidade consolidada e autorização autoritativa no servidor. |
| P0 preventivo para a galeria nova | A galeria pessoal privada ainda não existe. Um novo `<img src=original>` com `filter: blur()` entregaria a foto antes da autorização. | A imagem pode ser recuperada pela rede, DOM ou cache apesar do desfoque. | Slots bloqueados devem usar ilustração/placeholder público independente. Não incluir URL, bytes, `srcset`, preload, CSS background ou thumbnail identificável do original no cliente do pretendente antes da autorização. |
| P1 | `Prototype.tsx` inicia em `tab='discover'`, com `me` importado; não há onboarding de idade, interesse ou gêneros. Filtro existente só escolhe cidade. | Usuário entra na descoberta sem configurar elegibilidade ou preferências; as informações da pessoa editada não governam o fluxo inteiro. | Introduzir estado de onboarding e conclusão validada. Idade adulta, interesses declarados e gêneros têm campos e etapas distintos. Não apresentar autodeclaração como verificação de idade. |
| P1 | `myBooks` começa com três, mas o sheet `catalog` remove livremente e adiciona até esgotar seis itens. Não existe regra de quantidade na conclusão. | O perfil pode ficar com zero, dois, quatro ou seis livros; `myBooks[0] || 'estrela'` mascara a ausência com um livro que a pessoa não escolheu. | Exatamente três obras únicas ao concluir e publicar o perfil. Edição pode ter rascunho incompleto; salvar exige três e não deve substituir silenciosamente escolhas ausentes. |
| P1 | Não existe modelo de três fotos, aquisição de arquivos, validação, reordenação, substituição nem exclusão. `reveal` hoje mostra um ícone/ilustração. | A experiência prometida de galeria não está implementada. | Definir três slots pessoais e seus estados antes de desenhar upload. No beta, usar fotografias fictícias/ilustrações declaradas; aquisição real exige fluxo de privacidade separado. |
| P1, hipótese forte a reproduzir | `Device.tsx` usa `visualViewport.height`, mas ignora `visualViewport.offsetTop`; `PhoneFrame.tsx` fixa superfície em `inset:0`, alterando apenas altura. | Quando o navegador desloca o viewport visual ao focar o compositor, a superfície pode ficar ancorada ao lugar errado e deixar faixa/fundo exposto. O código prova a omissão, não a causa única de toda faixa branca. | Um único dono da geometria: medir altura e origem visual, aplicar ambas à superfície standalone; não empilhar outra compensação de teclado. Ver protocolo abaixo. |
| P1 | `Prototype.tsx` força rolagem ao fim em `useLayoutEffect` ao mudar `chatId`, quantidade de mensagens, visibilidade do teclado e `availableHeight`. | Abrir teclado ou variar a barra do navegador pode tirar a pessoa do trecho que estava lendo. | Só seguir o fim em novo envio próprio ou quando a pessoa já estiver perto do fim. Ao retornar de perfil, preservar âncora/posição por conversa. Recalcular viewport não é comando de rolagem. |
| P1 | Estado de navegação atual é o conjunto `tab`, `near`, `personId`, `chatId`, `chatOrigin` e `sheet`; `back()` é interno. Não há histórico browser/app no `Prototype.tsx`. | Botão interno pode voltar corretamente, mas isso não garante comportamento equivalente no botão Voltar do navegador ou no Android. | Formalizar precedência: sheet → detalhe → aba de origem. Adotar a navegação suportada pelo runtime para telas convencionais ou um estado explícito mínimo para o shell composto; evitar dois roteadores concorrentes. Testar Back real. |
| P1 | `edit`, `opinion` e `filters` alteram estado assim que o campo/opção muda; “Salvar” principalmente fecha o sheet. | Fechar, Escape ou cancelar pode conservar alterações que pareciam rascunho. | Separar rascunho do perfil confirmado e aplicar uma vez em Salvar/Concluir; cancelar descarta. Mesma regra no onboarding ao retroceder. |
| P2 | Própria apresentação exibe `me.name`, `me.age`, `me.city` e `me.intent` fixos, enquanto `bio`, `myBooks` e opiniões são estados independentes. | Onboarding novo pode aparecer correto numa tela e antigo em outra se for mais um estado paralelo. | Um único objeto de perfil confirmado, usado pelo resumo, edição, descoberta demonstrativa e galeria própria. Preferências de descoberta podem ficar em objeto separado. |
| P2 | Por perto imprime “São Paulo · localização ilustrativa” mesmo que o filtro selecione Rio. | Contexto geográfico contraditório. | Usar a cidade do cenário selecionado, sem coordenadas, presença ou cruzamento inventado. |
| P2 | Navbar é opaca no CSS atual; não existe contrato de glass nav. | Acrescentar apenas `backdrop-filter` pode reduzir legibilidade e cobrir conteúdo. | Transparência com superfície de fallback opaca, contraste medido, área de toque e reserva real de espaço. Dentro do chat, navbar permanece ausente. |

P0 é condição para operação com pessoas reais, não uma alegação de que o beta atual já vazou fotos privadas. Não encontrei nesse fluxo uma galeria de originais pessoais: hoje há capas, imagem ilustrativa de exemplar e um ícone na revelação.

## Jornada V8 proposta

| Etapa | Entrada e decisão | Condição para avançar | Voltar e falha |
| --- | --- | --- | --- |
| 1. Boas-vindas | Explicar encontros por livros e foto posterior; distinguir teste de conta real. | Aceitar iniciar perfil de teste. | Sair não cria conta nem assinatura. |
| 2. Idade e apresentação | Nome de exibição, idade/data conforme desenho aprovado e apresentação curta. | Adulto segundo regra explícita; datas futuras/inválidas não passam. | Menor de 18 não acessa descoberta; mensagem neutra e sem reaproveitar dados. |
| 3. Quem quero conhecer | Interesses declarados e intenção de relacionamento. | Escolha explícita; identidade própria e interesse em pessoas são campos diferentes. | Voltar conserva o rascunho, sem redefinir preferência silenciosamente. |
| 4. Gosto de ler | Selecionar gêneros literários, com vocabulário conhecido. | Quantidade mínima/máxima precisa ser definida pelo produto, sem inventar limite técnico. | Pode ajustar sem alterar os livros escolhidos. |
| 5. Meus três livros | Catálogo demonstrativo, três obras e opinião de cada uma. | Três IDs de obra diferentes, disponíveis e válidos. | Quarta seleção pede substituir uma; desmarcar deixa rascunho incompleto, sem publicar. |
| 6. Minhas três fotos | Três slots pessoais, ordem, substituir/remover e explicação de privacidade. | Três itens válidos no modelo escolhido; sem misturar fotos pessoais e imagens de exemplares. | Erro de arquivo mostra recuperação por slot; não perde o restante do rascunho. |
| 7. Rever meu perfil | Ver informações, três livros e três posições pessoais protegidas. | Validação conjunta; confirmar cria perfil beta, não conta autenticada. | Editar retorna à seção com dados preservados. |
| 8. Descobrir | Começar pelos livros/opiniões. Galeria tem livros primeiro e três slots pessoais bloqueados depois. | Passar/curtir é decisão sobre a pessoa; trocar mídia não vota. | Gesto vertical não decide; voltar de perfil preserva pessoa/livro/segmento. |
| 9. Deu liga | Apenas reciprocidade abre conexão. | Um match por par. | Continuar mantém decisão; conversar abre a pessoa correta. |
| 10. Conversa | Composer, histórico, perfil do outro e regra da foto. | Janela experimental + turnos de ambos permitem consentir; não revelam automaticamente. | Draft, posição de leitura e origem sobrevivem a teclado/perfil/aba. |
| 11. Revelação | Aceites privados vinculados às versões do conjunto de fotos dos dois. | Consentimento bilateral válido, match ativo e mídia aprovada. | Revogar, bloquear ou trocar qualquer foto invalida novos acessos. Não apaga cópias já vistas. |

Uma galeria com seis posições significa **três livros + três fotos pessoais**. Foto de exemplar sem pessoa pode ser uma apresentação alternativa de um livro; não deve contar simultaneamente como foto pessoal, nem adicionar slots infinitos sem definição de produto. O estado de bloqueio pertence à conexão entre duas pessoas, não a uma classe CSS global.

## Invariantes mínimos

- `profile.books`: exatamente três obras únicas ao confirmar. `profile.photos`: exatamente três slots válidos ao confirmar. As regras também são verificadas na edição e na recuperação de estado.
- Rascunho pode ser incompleto. Perfil confirmado permanece consistente até a substituição completa ser salva.
- Idade, preferências e gêneros não são inferidos dos livros. Mesmas leituras não provam compatibilidade amorosa.
- Pré-revelação: cliente de outra pessoa só recebe metadados públicos e placeholders dos slots pessoais; nenhuma URL de foto privada.
- Após revelação: servir somente as versões autorizadas. Uma alteração incrementa `photoSetVersion` e exige novos aceites de ambos.
- Substituir fotos não altera posição de livro ou chat. Trocar viewport não reinicia perfil nem onboarding.
- Persistência local, se adicionada, tem versão de esquema, validação na leitura e botão de limpar. Não guardar senha, documento ou original pessoal em `localStorage`.

## Teclado: correção mínima confiável

**Contrato já correto:** no modo publicado, `useKeyboardInsets()` retorna altura de teclado zero porque o browser já encolheu o viewport visual. `availableHeight` já deriva dessa altura. Não subtrair uma altura estimada de teclado novamente, não somar `offsetTop` como padding de conteúdo, nem introduzir `window.innerHeight - visualViewport.height` como mais um bottom inset do composer.

**Omissão concreta:** o evento `visualViewport.scroll` já é escutado, mas seu deslocamento não entra no estado. Medir a origem visual é necessário quando o browser reposiciona o conteúdo para manter o campo focado.

Estratégia pequena recomendada para avaliar no runtime standalone:

1. Centralizar medição num único efeito: `visualViewport.height`, `width`, `offsetTop` e `offsetLeft`, com fallback para `innerHeight`, `innerWidth` e origem zero. Não confundir a safe area superior com `offsetTop`.
2. Agrupar `resize` e `scroll` em uma atualização por frame com `requestAnimationFrame`, removendo listeners e cancelando frame na desmontagem. Não remountar a aplicação durante medição.
3. Fazer a superfície standalone acompanhar **origem + dimensão do viewport visual** numa única estratégia de posicionamento. Se usar `top/left` em elemento fixo, remover `inset:0` conflitante e não aplicar também a mesma translação no filho. Validar o sistema de coordenadas no navegador alvo; não empilhar top, transform e scroll compensatório.
4. Manter composer como filho da superfície e usar o contrato atual de `bottomInset`. No teclado nativo aberto, esse inset não representa novamente a altura do teclado. Safe area fechada e espaço visual acima do teclado são responsabilidades distintas.
5. Pintar a superfície/background do app de forma contínua ajuda a evitar flashes, mas não é a correção geométrica. Não declarar resolvido só porque o branco foi recolorido de verde.
6. Não usar `interactive-widget=resizes-content` como solução universal. Seu comportamento e suporte não eliminam a necessidade de testar Safari, Chrome, barras do navegador e modo instalado. Preservar zoom e acessibilidade.

Aceite medido: registrar `{innerHeight, vv.height, vv.offsetTop, vv.scale, surfaceRect, composerRect}` sem conteúdo da mensagem. Com foco aberto, topo e fundo da superfície devem coincidir com o viewport visual e o composer permanecer visível, sem faixa vazia, sem duplo inset e sem salto do trecho lido. Repetir abrir/fechar cinco vezes, enviar, alternar campo e abrir sheet; testar orientação, browser bars, rotação e zoom. Emulação de teclado do preview não comprova o teclado nativo de iOS/Android. Um iframe também não reproduz integralmente o viewport visual da página superior.

Os arquivos de runtime são protegidos pelo AGENTS. A correção específica do bug de teclado deve respeitar a autorização para modo responsivo, ser verificada e só então atualizar os hashes necessários. Não reduzir a lista de arquivos protegidos para fazer o check passar.

## Backend mínimo para conta de verdade

Um backend modular único com PostgreSQL gerenciado, identidade consolidada e armazenamento privado basta para a primeira operação. Não criar senha/token caseiros, microserviços ou IA de compatibilidade.

| Camada | Primeiro recorte de produção |
| --- | --- |
| Identidade | Sessão real, recuperação e exclusão; resultado de elegibilidade etária com coleta mínima e avaliação de solução de verificação. |
| Perfil | Perfil confirmado, preferências e três relações com obras; transação para publicar/substituir conjunto, sem janela com quatro/zero itens públicos. |
| Mídia | Upload privado isolado, validação de conteúdo/bytes/pixels, remoção de EXIF, moderação, três referências versionadas e exclusão. Nenhuma cópia em assets públicos do frontend. |
| Matching/chat | Likes idempotentes, unicidade de par, mensagens ordenadas, relógio de servidor, bloqueio e autorização por recurso. |
| Revelação | Consentimentos por par, política e versões dos dois conjuntos de fotos; checagem atômica com bloqueio/troca/revogação. Proxy autenticado valida novos pedidos; URLs já entregues não prometem revogação imediata. |
| Operação | Denúncia com atendimento, acesso administrativo mínimo, auditoria sem mensagens/tokens em logs, retenção e exclusão, backups com reaplicação de exclusões antes de restaurar tráfego. |

Modelos adicionais: `onboarding_draft` ou equivalente; `profile_publication`; `user_books(position 1..3)`; `private_media(slot 1..3, moderation_state, version)`; `photo_set_version`; `reveal_consents(match, user, both_set_versions, policy_version)`. Não é um esquema implementado. Restrição de total de itens exige validação transacional do conjunto, além de limites individuais por linha.

## Entrega em fatias verificáveis

1. **Perfil beta coerente:** estado único, onboarding, rascunho/confirmado, exatamente três livros, três slots fictícios, revisão e retorno. Alterar somente UI app-owned; não anunciar conta.
2. **Galeria e privacidade demonstrativa:** livros + placeholders protegidos, affordance de bloqueio e fluxo bilateral existente. Nenhum original pessoal público. Testar troca de conjunto e aceites inválidos.
3. **Teclado e navegação:** corrigir geometria standalone com observação real, preservar âncora/draft e provar ausência de duplo inset. Manter preview separado do app publicado.
4. **Glass nav:** aplicar depois de ter telas/conteúdo reais, com contraste, fallback e área final rolável acima dela. Sem navbar na thread ou no onboarding se disputar a tarefa principal.
5. **Publicação reproduzível:** build, runtime check, Worker e caminho de container adequados ao alvo escolhido; vincular URL à versão/commit e registrar exatamente o que foi testado.
6. **Contas reais:** backend e operação antes de coletar fotografias privadas reais ou permitir conversa entre usuários. A passagem de beta para produção não acontece trocando o rótulo na interface.

## Configuração, implantação e testes

- `mobile-beta/package.json`: build é TypeScript → Vite → preparação de Worker. O Dockerfile tem outro recorte: runtime check → TypeScript/Vite e Nginx servindo `dist/client`; isso é adequado a um frontend estático, não provisiona backend.
- `.openai/hosting.json` declara `d1:null` e `r2:null`. O Worker encaminha arquivos estáticos e fallback HTML; não há API de cadastro ou mídia privada ali.
- `nginx.conf` expõe `/health` e fallback de SPA. Não há configuração de armazenamento privado no container. Servir arquivos públicos por HTTPS não torna uma galeria privada.
- `playwright.config.ts` aponta para testes de fixture do runtime, com viewport desktop. Eles não cobrem automaticamente o onboarding Trelelê, seus três livros/fotos, fluxo de conta ou teclado físico.
- Runtime hashes e Worker checks verificam integridade/empacotamento. Não provam autorização de mídia, privacidade ou qualidade de jornada.
- README e contexto devem declarar qual pasta/build/URL é atual. Não misturar sucesso da suíte DOM da raiz com validação da UI React. Captura estática ou estudo gerado não deve ser chamado de teste de hardware.

### Aceites funcionais indispensáveis para V8

Adulto completa onboarding e volta sem perder rascunho; menor/data inválida não acessa descoberta; salvar com 2/4 livros ou 2/4 fotos é rejeitado; catálogo não cria duplicatas; editar/cancelar mantém confirmado anterior; três slots bloqueados não carregam originais; trocar livro/foto não curte pessoa; like único → match recíproco → chat correto; perfil do chat preserva draft/posição; tecla abre/fecha sem faixa e sem reinitialização; revogar/bloquear/trocar conjunto nega nova revelação; publicação mostra a versão testada e continua identificada como beta sem conta quando aplicável.

## Fontes técnicas de referência

- MDN, VisualViewport: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport — distingue viewport visual e layout, inclusive com teclado.
- MDN, offsetTop: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport/offsetTop — origem em relação ao layout, em CSS pixels.
- W3C, CSS Viewport: https://www.w3.org/TR/css-viewport-1/ — modos de redimensionamento de widgets interativos.

Conclusões sobre o código foram tiradas dos arquivos locais indicados. A hipótese do teclado exige reprodução no ambiente afetado; esta revisão não certifica segurança integral nem prontidão de produção.
