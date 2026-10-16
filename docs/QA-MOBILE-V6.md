# Trelelê móvel V6 — verificação independente

Verificação em 16/10/2026. Escopo: `mobile-beta`, revisão estática, compilação, integridade do runtime e domínio compartilhado. Esta revisão não executou navegador e não substitui a aprovação visual das capturas do aplicativo.

## Evidências executadas

| Verificação | Resultado | Alcance |
| --- | --- | --- |
| `mobile-beta: npm run build` | Passou | TypeScript, Vite e preparação do Worker |
| `mobile-beta: npm run test:sites` | 4/4 | Ativos, fallback de navegação, requisições API/escrita e arquivos de empacotamento |
| `mobile-beta: npm run check:runtime` | Passou, 28 arquivos protegidos | Runtime móvel sem alteração |
| Raiz: `node --test tests/domain.test.mjs tests/interaction.test.mjs` | 24/24 | 17 regras de domínio e sete cenários do classificador de swipe |
| Raiz: `npm run check` | Passou | Sintaxe dos módulos históricos |
| Manifesto de ativos móvel | 36/36 SHA-256 conferem | Arquivos públicos, incluindo capas, foto ilustrativa, fontes e ícones |
| Ícones referenciados pelo aplicativo | Nenhum ausente | Verificação no sistema de arquivos |
| Arquivos para Sites | 4 presentes | `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`, `.openai/hosting.json` |

O domínio de `mobile-beta/src/domain.mjs` é byte a byte igual a `dist/domain.mjs`, exercitado pela suíte original: SHA-256 `6dafab697f70503e3eecef2401a13db236fd2e16154c47e2d7f518d4ed698be2`. O classificador de swipe também é idêntico a `dist/interaction.mjs`: SHA-256 `314048ff016261d04be1dbb19abc6154892fdae7e75733be93010925537c7ed9`. Não foi criada uma segunda cópia dos testes. O conteúdo fictício `copy.mjs` também é igual: SHA-256 `27d226dc6de8d6abdc39160e30aed82adfc708e8139456b6d9482431534e9474`.

A suíte histórica completa da raiz foi executada: **38/43 passaram, com cinco falhas da UI V5**. São: bookIndex indefinido no teste de gesto e quatro caminhos que procuram o controle `data-action="consent"` ausente. Essa suíte exercita `dist/ui`, não o React em `mobile-beta`. Não foi alterada para ocultar falhas e não constitui evidência de navegação da V6.

## Privacidade e estado no código móvel

- A interface consulta `getRevealView` do domínio compartilhado. A ilustração de revelação só é montada no estado `REVEALED`; consentimento unilateral não o produz.
- A elegibilidade exige 24 horas após a primeira troca bilateral e cinco turnos alternados por lado. A troca de imagem limpa os dois aceites; revogar mantém a conversa, mas remove acesso futuro. Bloquear e desfazer match encerram a conversa.
- Nenhuma fotografia de pessoa foi importada. Antes do aceite aparecem capas e uma imagem gerada de exemplar sem pessoas. A revelação desta demonstração é um ícone com rótulo de ilustração.
- Mensagens, bio, busca e opinião usam interpolação React, sem `dangerouslySetInnerHTML`, `innerHTML` ou HTML construído com conteúdo do usuário.
- Não há chamada de rede, autenticação ou armazenamento persistente no código do produto. A busca de livros é local e a interface informa que Google Books/Apple Books não estão conectados.
- Rascunhos são separados por pessoa em estado React. Voltar ou trocar de aba não limpa os rascunhos. O envio agora só limpa o texto quando a mutação do domínio confirma sucesso, corrigindo a perda de rascunho encontrada nesta revisão.
- As ações de navegação e abertura de sheet chamam `keyboard.hide()`. Textos usam os campos conectados ao teclado do runtime; carrosséis usam o componente protegido.
- O seletor pessoal agora abre um editor de opinião por livro, incluindo ao escolher novo livro. A opinião é mantida em memória e o botão de salvar encerra a edição.

## Revisão final de gesto e celebração

Após o aviso de estabilidade do autor, build, integridade dos 28 arquivos protegidos e testes Worker foram repetidos com sucesso; os 24 testes de domínio e classificador também passaram. A celebração “Deu liga!” agora é uma camada no cartão, com “Puxar assunto” e “Continuar olhando”, sem abrir uma segunda tela. A preferência fica congelada durante a celebração. Header, navegação, controles do livro, painel da pessoa e tabs são `inert`.

Foi encontrado e corrigido um P1: tocar “Por perto” durante a celebração desmontava a camada e deixava o aplicativo sem saída móvel. As tabs agora estão `inert` durante `newMatch`. O código oculta o teclado, posiciona foco uma vez por conexão sem scroll do documento, limita Tab aos dois CTAs e permite sair por Escape. Os ajustes de scroll, contraste e teclado continuam sujeitos à revisão renderizada do responsável; esta auditoria não operou o navegador.

## Limites a comunicar

Não há proteção de mídia ou identidade em servidor. Relógio, aceites e estado do protótipo são manipuláveis pelo navegador. As regras demonstram comportamento de produto, sem garantia de segurança de produção. Uma mídia já vista também não pode ser apagada da memória ou de capturas de outra pessoa ao revogar.

O fluxo atual decide por botões ou pelo gesto horizontal de `DecisionMedia`, usando `useDrag` e o classificador puro compartilhado. O classificador exige no mínimo 72 px ou 24% da largura, além de dominância horizontal de 1,35. O código cancela pointercancel/Escape, separa tap de livro de decisão e suprime cliques após arrasto; a interação real depende da verificação de navegador descrita abaixo. A navegação interna usa estado React, sem histórico de URLs. Recarregar a página reinicia os dados. GPS, upload, catálogo externo, mensagens reais e cobrança ainda não estão implementados. As capas possuem direitos reservados; o manifesto não concede licença comercial.

A aprovação de proporções, toque, retorno à posição de leitura, teclado, gestos de rolagem e navegação de ponta a ponta depende de inspeção renderizada separada. Testes de Worker e compilação não aprovam qualidade visual.

## Exportação de fonte

A enumeração inicial contém 85 arquivos (~4,38 MB), excluindo `node_modules`, `dist`, `.git`, `test-results`, `playwright-report`, `.openai` e `.env*`. Preservar `AGENTS.md`, scripts de integridade, lock do runtime, lockfile e ativos protegidos. `reading-ana.png` representa ~2,75 MB; não enviar dependências ou resultados de build como fonte. A configuração operacional `.openai` deve permanecer no ambiente, fora do espelho público ou de fonte do GitHub.

## Checkpoint renderizado final

O responsável confirmou no navegador que “Puxar assunto” abre Ana. O supercrítico aprovou a captura do overlay em 393, preservada em `docs/design-v6/liga-final-393.jpg`. Overlay em 360, CTA “Continuar olhando”, Escape e movimento reduzido continuam pendentes de validação renderizada; não são declarados concluídos neste checkpoint. Não houve publicação de nova versão no Site.
