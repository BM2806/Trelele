# V12 — segurança do modo de revisão e integridade da entrega

## Resultado desta revisão

**Fonte revisada; nenhum P1 de acesso a armazenamento ou login fictício foi demonstrado nesta leitura.** Isto não é prova dinâmica de zero IO, aprovação visual, aprovação de hardware ou liberação de produção. Nenhum app, runtime, credencial, banco ou serviço foi alterado por este auditor.

Checklist ECC aplicado: security-reviewer (segredos, autenticação, autorização, entradas e configuração). Escopo direto: Prototype.tsx, Onboarding.tsx, AccountFlow.tsx, EntryFlow.tsx, Showroom.tsx e módulos locais de perfil/sessão/preferências. Bibliotecas de armazenamento importadas têm abertura lazy; importar funções não abre IndexedDB.

## Contrato `review=1`

A constante é calculada no módulo antes dos hooks. O modo inicial é aplicativo em memória, sem hidratar o perfil do proprietário. Os mesmos componentes de interface são usados, com ações demonstrativas explicitamente marcadas. Não há exigência de duplicação do aplicativo nem reprovação por importação inerte.

| Caminho | Guard conferido na fonte | Efeito em revisão |
| --- | --- | --- |
| Boot de preferências e histórico | Retorna antes de loadAccountPreferences/loadDemoSession | Estado fictício em memória |
| Autosave histórico | reviewMode é primeira condição de retorno | Não grava sessão/drafts locais |
| Boot de perfil | Retorna antes de loadProfile/listOwnerPhotos | Não lê metadata ou fotos do dono |
| Prévias próprias | Condição exige !reviewMode antes de listOwnerPhotos | Sem objectURL de originais do dono |
| Pausar/retomar | persistPause retorna após setPaused local | Não grava preferências |
| Apagar | AccountFlow intercepta review antes de onDelete; deleteLocalData também tem guard | Retorno à entrada de revisão, sem limpar dados reais |
| Recomeçar histórico | startFreshDemoHistory retorna imediatamente | Não remove chave persistida |
| Sair do editor | leaveOwnerEditor retorna antes de leitura de perfil | Navega em memória |
| Entrar na demo | enterDemo retorna antes de flag em localStorage | Abre descoberta fictícia |
| Onboarding init/autosave | Guards anteriores a draft/init/fotos e saveProfileDraft | Fixture ou campos vazios em memória |
| Onboarding upload/remove/cancel/finish | Retorno anterior a put/remove/clear/commit | Nenhum seletor real de foto em revisão; três posições ilustrativas |
| AccountFlow editar/sair/pausar/apagar | Guard anterior aos callbacks operacionais | Callbacks de revisão; mensagens de prévia |
| EntryFlow email/código | Estados email/code liberados somente em review; sem fetch/SDK | Seis dígitos só avançam estudo visual; nenhum código validado, email ou sessão |
| Localização/notificações | Texto e navegação somente | Não solicita permissões do aparelho |

A interface de revisão avisa “sem salvar dados”, “sem envio de e-mail ou sessão” e “nenhum código é verificado”. Fora de revisão, Apple/Google/email levam ao estado indisponível; não criam sessão ou conta. A base real Better Auth permanece isolada na V11 e não está integrada aqui.

O link **Abrir beta** é uma saída explícita para `/?app=1`, com nova navegação. Depois dessa saída, o beta pode ler/gravar seus dados locais conforme seu contrato normal. Não afirmar que esse clique mantém isolamento de revisão. Requisições de arquivos estáticos (fontes, ícones, capas) são parte da renderização; “sem IO” aqui delimita ausência de leitura/mutação de dados pessoais, IndexedDB, localStorage e chamadas de autenticação/serviços externos.

## Fluxo operacional preservado fora da revisão

A exclusão real continua aguardando clearProfile antes de limpar cache, preferências e sessão, com erros propagados para AccountFlow. O botão Manter meus dados navega sem chamar exclusão. Pause persiste antes de alterar o estado. Cancelar editor limpa somente rascunho e relê confirmado. Foto original continua restrita ao editor/Meu perfil, com cleanup de objectURLs. Falha de exclusão pode ser parcial entre IndexedDB e localStorage: a UI informa erro e não promete transação universal ou exclusão remota.

## Mudança estrutural conferida contra V10

Comparação feita com os fontes remotos do commit `6e8ad2f70ab364ae9c474ad18043929ce5f632e0`, não apenas git status local.

| V10 da base | V12 da fonte inspecionada |
| --- | --- |
| Quatro abas, proximidade dentro de descobrir | Cinco abas, Explorar como destino próprio |
| Sem EntryFlow | Entrada/provedor indisponível, email/código de prévia, saída e permissões explicativas |
| Sem Showroom | Mapa clicável de estados de revisão, com seleção por tela |
| Perfil em composição anterior | Hub de identidade, livros, fotos e perguntas com novos blocos e hierarquia |
| AccountFlow inicial compacto | Configurações agrupadas, privacidade, notificações, ajuda, sobre, pausa, saída e exclusão em duas fases |
| Nome direto à etapa seguinte | Confirmação de nome, estados de identidade e detalhe opcional inline |

Isso demonstra alteração real de estrutura e componentes. Não comprova que todos os pixels ou percursos correspondem às 31 referências, nem que todas as telas foram inspecionadas em navegador. Esse gate pertence à revisão visual separada.

## Gate de armazenamento GitHub

- Aguardar sinal do responsável após QA visual; não publicar somente configuração.
- Nova branch V12 baseada em V10 `6e8ad2f…`; manter main e V11 de backend separados.
- Comparar SHA dos fontes reais e incluir telas, CSS, ativos licenciados e documentação pertinentes.
- Excluir backend-auth, node_modules, build, .openai, segredos, resultados de teste, public/review-v12.html, public/review-v10.html e outros harness temporários.
- Não copiar as 31 capturas privadas para assets, documentação ou fixtures. Inventário de nomes, medidas e SHA-256 permanece sem pixels privados.
- Qualquer captura nova deve ser evidência do próprio protótipo, sem originais pessoais do proprietário.

## Correção de layout posterior à revisão inicial

O autor e a QA relataram um **P1 visual reproduzido** ao avançar Davi → Bia em 360: o deck assumia altura intrínseca de aproximadamente 671 px para uma área de 535 px e escondia ações atrás da navegação. O autor registrou correção autorizada no CSS: linha `minmax(0,1fr)`, `min-height:0` nos wrappers e imagem hero absoluta. A QA relatou depois wrappers em 535 px e ações acessíveis. Esta ocorrência é de layout, não de autenticação/armazenamento, e não foi reproduzida por este auditor. A afirmação inicial de ausência de P1 limita-se ao review de IO/privacidade; não deve apagar esse achado visual posterior.
