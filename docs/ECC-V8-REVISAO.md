# ECC V8 — revisão de código, dados locais e configuração

## Estado final: BLOQUEADO PARA PUBLICAÇÃO

V8 é um checkpoint parcial de desenvolvimento, **não uma versão aprovada para lançamento**. A fonte seguirá para a branch de rascunho `v8-cadastro-em-revisao`; main e a versão pública permanecem inalterados. O crítico aprovou somente o checkpoint parcial e a atualização dos dois hashes de runtime para essa fonte revisável.

O responsável inspecionou galeria de seis posições/cadeados e navegação em viewport efetivo 390, além de foco de chat em 360 parcialmente. Evidência: `trelele-v8-galeria-chat.jpg`. A abertura teve contraste ruim; houve correção de CSS, mas nenhuma captura posterior comprovou o resultado. A etapa 1 do cadastro foi observada por árvore de acessibilidade; o cadastro não foi percorrido de ponta a ponta.

A ferramenta de navegador teve três timeouts de 300 segundos, incluindo tentativa após reset. O responsável interrompeu novas tentativas por indisponibilidade da ferramenta. Não tratar essa interrupção como aprovação visual ou funcional dos passos não executados.

Aplicados os recursos ECC `agents/code-reviewer.md` e `agents/security-reviewer.md`, lidos pelo helper do catálogo instalado. São checklists aplicados por agentes Codex; não uma instalação dos hooks ou runtimes originais do ECC. A revisão prioriza fluxo concreto, dados expostos e limites do beta. Sem alegação de “brecha zero”.

A abertura visual é provisória: o parecer de design V8 aguarda a referência de abertura prometida pelo usuário. Este relatório de código não aprova uma nova direção visual.

## Escopo V8 e limites de confiança

- Cadastro de perfil de demonstração local, sem autenticação, backend ou verificação de identidade.
- Conclusão exige três livros distintos e três fotos locais, com data válida de nascimento e pessoa com 18 anos completos.
- Data de nascimento não deve aparecer no perfil público. Preferências e campos pessoais devem ter rótulos semânticos.
- Fotos originais ficam somente em IndexedDB do navegador do dono; não usar localStorage para grandes imagens nem incorporar originais em placeholders de perfis, listas ou conversas.
- Dados locais não são criptografia, autenticação ou autorização em servidor. O beta não pode anunciar conta verificada ou proteção inexistente.
- Excluir o cadastro local deve apagar metadados e fotos; falhas de armazenamento e quota não podem ser apresentadas como salvamento bem-sucedido.

## Dependências — evidência inicial

`npm audit --omit=dev --json` retornou **zero vulnerabilidades** nas dependências de produção. O audit completo retornou **três pacotes transitivos de desenvolvimento com alertas high** e correção compatível disponível:

| Pacote | Faixa apontada pelo audit | Natureza |
| --- | --- | --- |
| nanoid | até 3.3.17 | Laços em geradores com tamanhos inválidos |
| postcss | até 8.5.22 | Carregamento de source maps/caminhos de mapas externos |
| source-map-js | abaixo de 1.2.2 | DoS em mapas com offsets de seção inválidos |

A imagem final Nginx serve somente o build estático e não inclui node_modules. Os alertas atingem a cadeia de build, sem caminho demonstrado a partir de inputs do usuário no beta atual. O responsável assumiu a correção compatível do lockfile sem `--force`, seguida de instalação e nova verificação. Após correção compatível do lockfile pelo responsável e `npm ci --ignore-scripts`, a auditoria executou novamente `npm audit --json`: **zero vulnerabilidades**, incluindo desenvolvimento. Versões efetivamente instaladas: nanoid 3.3.20, postcss 8.5.30 e source-map-js 1.2.2. Nenhuma dependência direta foi adicionada pela auditoria.

## Configuração inspecionada

- Dockerfile usa build em múltiplos estágios, `npm ci`, verificação do runtime, TypeScript e Vite; a imagem final copia somente `dist/client`.
- `.dockerignore` exclui node_modules, dist, Git, `.env*`, resultados de teste e relatórios Playwright.
- Nginx escuta em 8080, serve conteúdo estático, tem healthcheck simples e fallback para o aplicativo. Não expõe endpoint de envio de fotos ou API de autenticação.
- Há `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin` na rota principal.
- Não há CSP nesta configuração. Isso é uma limitação de defesa em profundidade; não constitui prova de XSS nem de exploração. Qualquer política futura deve permitir os estilos dinâmicos do React e blob URLs locais sem bloquear o preview de desenvolvimento.
- Busca inicial em src, Worker e configuração não encontrou credenciais ou uso de `dangerouslySetInnerHTML`. Conteúdo do usuário no React deve continuar sendo interpolado como texto.

## Achados e correções acompanhadas

- **Contexto de consentimento errado entre pessoas:** a galeria de Ana deixava photoContext persistente ao entrar na conversa de Lia; o atalho de demonstração podia apresentar o par anterior. Encaminhado ao autor, que passou a limpar o contexto ao entrar no chat e no atalho de revelação, além de mostrar nominalmente a outra pessoa na sheet. Não foi encontrado carregamento de fotos originais de terceiros.
- **Exclusão local e cache do pai:** o reset do onboarding passou a oferecer callback após exclusão bem-sucedida para invalidar o perfil/fotos em memória no aplicativo. O aplicativo integra o callback limpando ownerProfile, URLs, bio e livros em cache; o fechamento do editor também relê metadata/IndexedDB, valida 3+3 e o catálogo antes de aplicar um perfil completo.
- **Cidade opcional:** confirmada como decisão explícita do responsável, com rótulo opcional na interface; ausência de cidade não é tratada como falha.

## Testes próprios de cadastro

`node --test tests/profile-storage.test.mjs` executou **9/9** em Node 24, importando o módulo TypeScript real sem dependências novas. Abrange: aniversário de 18 anos; datas impossíveis, futuras e formato ambíguo; aniversário bissexto; cardinalidade exata 3+3 e livros duplicados; campos obrigatórios; whitelist de metadados que não persiste fotos/blob URLs/tokens; corrupção de JSON; falha de quota propagada; tipo/tamanho de arquivo e SVG disfarçado de PNG. Os testes não simulam IndexedDB ou decodificação de imagens como prova de navegador.

## Revisão final da integração

O boot não confia apenas no booleano `completed`: relê fotos do IndexedDB, valida campos/idade/cardinalidade e IDs do catálogo. O cancelamento do editor passa pela mesma verificação; a sheet antiga de seleção que permitia mais de três livros foi removida. O reset só invalida o cache do pai depois da exclusão bem-sucedida. URLs de objeto são revogadas ao sair da área do dono e o JSX das imagens originais exige Meu Perfil ativo, sem perfil de outra pessoa ou conversa aberta.

Os seis espaços dos perfis fictícios são três livros e três placeholders abstratos com cadeado. O arrasto muda a mídia e não registra preferência; preferência exige os botões explícitos. Os placeholders não recebem blob URL, miniatura derivada nem foto original do dono. A revelação de demonstração permanece uma ilustração condicionada ao domínio, não uma foto real do cadastro local.

Data de nascimento só é usada para cadastro e cálculo da idade; não é passada ao perfil mostrado. Nome, bio, preferência e opiniões usam JSX escapado. Não foram encontrados reconhecimento de rosto, criptografia ou conta verificada sendo anunciados como existentes. Cidade opcional permanece decisão autorizada.

Após estabilidade final, os nove testes de cadastro e os 24 testes de domínio/classificador passaram. O autor atualizou os dois hashes de Device e PhoneFrame somente após autorização do responsável para o checkpoint parcial. Segundo resultado final do autor, integridade dos 28 arquivos, build e quatro testes Worker passaram. A auditoria não contornou checks nem regravou hashes. A correção usa visualViewport.height e offsetTop; isso não foi validado em IME/Safari físico.

## Verificações finais e pendências de release

| Verificação | Resultado e origem |
| --- | --- |
| Cadastro e armazenamento puro | 9/9, executados pela auditoria |
| Domínio e classificador | 24/24, executados pela auditoria |
| Audit completo após correção | Zero vulnerabilidades, executado pela auditoria |
| Runtime protegido | 28 arquivos passaram, resultado final informado pelo autor |
| Build TypeScript/Vite/Worker | Passou, resultado final informado pelo autor |
| Testes Worker | 4/4 passaram, resultado final informado pelo autor |
| Galeria/cadeados/navegação 390 | Execução parcial pelo responsável, captura fornecida |
| Foco de chat 360 | Verificação parcial pelo responsável |
| Abertura após correção de contraste | Sem captura posterior; pendente |
| Cadastro completo e revisão | Não executado de ponta a ponta; pendente |
| Upload real de três imagens, retomada e exclusão | Não comprovados por execução de navegador; pendentes |
| Safari, teclado nativo e aparelho físico | Não testados |

**Veredito: manter em rascunho.** Reabrir o gate de publicação quando o navegador estiver disponível, validar o cadastro completo, persistência/exclusão de fotos e os estados visuais após correções. Os testes de código e o checkpoint aprovado não substituem essas evidências.
