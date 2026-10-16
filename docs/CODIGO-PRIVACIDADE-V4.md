# Trelelê V4 — código aberto inspecionado e privacidade de Por Perto

Data: 16/10/2026. Referência de engenharia e revisão ECC; não é acesso ao código proprietário do Tinder ou do Happn. Foram lidos arquivos-fonte reais por operações de leitura do conector GitHub. Não foram instalados nem executados os projetos externos. Não se copiou código deles para a interface. A tentativa de obter arquivos por Python direto não foi a fonte da inspeção bem-sucedida.

## 1. Evidências de código, licença e revisão

### Swipe: 3DJakob/react-tinder-card

- Repositório: <https://github.com/3DJakob/react-tinder-card>.
- Commit resolvido: `b6125689aa9d098f23f7b44b7fb17e489c8dabbe` (mensagem `1.6.4`).
- Fonte lida e conferida no commit: [index.js](https://github.com/3DJakob/react-tinder-card/blob/b6125689aa9d098f23f7b44b7fb17e489c8dabbe/index.js), blob `4848af7dba74a3adf7da76fc87aeee8ae30fdb15`.
- Licença lida: [LICENSE](https://github.com/3DJakob/react-tinder-card/blob/b6125689aa9d098f23f7b44b7fb17e489c8dabbe/LICENSE), MIT, Jakob Unnebäck; blob observado `3ef6fad7209d6b97464b6f348eae85cd28e90c7d`.
- Observado: separa classificação de direção, retorno ao centro e animação de saída; distingue `onSwipe` de `onCardLeftScreen`; oferece bloqueio de direções e restauração visual.
- Aplicação conceitual: uma decisão de domínio por gesto aceito; término da animação não representa novo like. Voltar visualmente não pode reativar match encerrado. Manter limiar por distância e cancelamento da Trelelê; não importar por padrão as escolhas de velocidade do componente.
- Limite concreto: é componente de gesto, não autenticação, matching ou autorização de foto. `restoreCard()` não verifica bloqueio/consentimento. O caminho imperativo de swipe não substitui validações de domínio.

### Abas e deck: gupta-ji6/react-native-tinder

- Repositório: <https://github.com/gupta-ji6/react-native-tinder>.
- Commit resolvido: `2c07091b0205ab650696cd4d56ab1f6f44d16075`.
- Fontes lidas: [App.js](https://github.com/gupta-ji6/react-native-tinder/blob/2c07091b0205ab650696cd4d56ab1f6f44d16075/App.js), [src/tabs/Tabs.js](https://github.com/gupta-ji6/react-native-tinder/blob/2c07091b0205ab650696cd4d56ab1f6f44d16075/src/tabs/Tabs.js), [src/screens/HomeScreen.js](https://github.com/gupta-ji6/react-native-tinder/blob/2c07091b0205ab650696cd4d56ab1f6f44d16075/src/screens/HomeScreen.js), [src/components/TinderCards.js](https://github.com/gupta-ji6/react-native-tinder/blob/2c07091b0205ab650696cd4d56ab1f6f44d16075/src/components/TinderCards.js).
- Blobs conferidos: Tabs `299f9cad49155154644c997e074e38d708520e66`; TinderCards `96755485fcc231a3d63ce24197525e954c280d57`.
- [LICENSE](https://github.com/gupta-ji6/react-native-tinder/blob/2c07091b0205ab650696cd4d56ab1f6f44d16075/LICENSE) lida no commit: MIT, ayush gupta, blob `54bce2245b88e288e766497340dcaba6c640b6dd`.
- Observado: container de navegação separado das quatro abas; deck permite interação somente na carta superior, mostra feedback proporcional ao arrasto e só remove carta após transição. Limiar proporcional à largura.
- Aplicação conceitual: origem de navegação e estado da carta precisam ser explícitos. Preservar contexto de aba ao abrir/fechar um perfil. Não portar diretamente o capturador amplo de gestos desse exemplo: Trelelê precisa manter scroll vertical, controles internos e cancelamento.
- Limite: demonstração visual com animais e callbacks de console, sem matching real ou proteção de dados demonstrados. MIT não significa que dependências/ativos e operação já foram auditados.

### Stack e matching recíproco: nayak-nirmalya/tinder-clone

- Repositório: <https://github.com/nayak-nirmalya/tinder-clone>.
- Commit resolvido: `e17dc734cc8d0042104e96aaa9cfa106b9296043`.
- Fontes lidas: [App.tsx](https://github.com/nayak-nirmalya/tinder-clone/blob/e17dc734cc8d0042104e96aaa9cfa106b9296043/App.tsx), [StackNavigator.tsx](https://github.com/nayak-nirmalya/tinder-clone/blob/e17dc734cc8d0042104e96aaa9cfa106b9296043/StackNavigator.tsx), [screens/HomeScreen.tsx](https://github.com/nayak-nirmalya/tinder-clone/blob/e17dc734cc8d0042104e96aaa9cfa106b9296043/screens/HomeScreen.tsx), [lib/generateId.ts](https://github.com/nayak-nirmalya/tinder-clone/blob/e17dc734cc8d0042104e96aaa9cfa106b9296043/lib/generateId.ts), [package.json](https://github.com/nayak-nirmalya/tinder-clone/blob/e17dc734cc8d0042104e96aaa9cfa106b9296043/package.json).
- Blobs observados: stack `51de3475a1fdc8102a67d2aba5959398b66c7c03`; home `e80ea82ccf8d8432cb08ad1387d077e1513cdfa2`; generateId `bfed41001cc9ac9f497137ee4a32adf58c1b33ac`.
- **Licença não confirmada:** consulta a `LICENSE` retornou 404, `package.json` lido não declara licença. Portanto esta é inspeção de código publicamente visível, não recomendação de reutilização como software aberto licenciado. Não copiar trechos/ativos.
- Observado: stack distingue telas de navegação e overlays de match; fluxo consulta interesse inverso antes de criar match e abrir overlay. Cartão usa foto pública, inadequada à proposta Trelelê.
- Invariantes extraídas: match exige reciprocidade, overlay é resultado da decisão e conversa recebe o par correto. Implementar regras próprias, mantendo o domínio da Trelelê.
- Não importar: escrita de match pelo cliente sem transação demonstrada, perfis completos replicados em decisões e composição de chave por concatenação de IDs. O arquivo lido não comprova segurança das regras do banco. A chave estruturada `pairKey` da Trelelê evita tratar concatenação como autorização ou garantia de unicidade.

## 2. O que essa inspeção comprova

Houve leitura de fontes executáveis de projetos independentes, identificação de commits e licenças onde disponíveis, e extração de padrões concretos. Não houve execução desses projetos, comparação de performance ou verificação de seus serviços externos. Clones não oficiais são referências de implementação, não documentação dos internos do Tinder. Nenhuma alegação sobre ranking, antifraude, bancos, algoritmos ou arquitetura proprietária decorre desses arquivos.

Para eventual incorporação futura de código, fixar commit, revisar dependências, preservar avisos da licença aplicável e verificar direitos de ativos separadamente. Na V4, a escolha é implementação própria sem adicionar esses pacotes.

## 3. Happn: declaração oficial e diferença da Trelelê

O [suporte oficial do Happn](https://support.happn.fr/hc/en-us/articles/15716793039517-Can-other-users-know-my-precise-location) declara que outros usuários não conhecem a posição exata; a posição apresentada é aproximada e não aparece imediatamente. A página distingue posição do próprio usuário e da outra pessoa ao cruzarem caminhos. A [página oficial de segurança](https://www.happn.com/safety) também afirma proteger localização precisa em tempo real. Isso descreve a declaração de produto, sem auditoria do sistema deles.

**Trelelê Por Perto na demonstração:** grid de pessoas fictícias por cidade/região ampla escolhida manualmente. Não é detecção de cruzamento, GPS, mapa de deslocamento ou presença em tempo real. Não coletar coordenadas, horário de passagem, distância em metros nem localização do dispositivo. Não usar copy “cruzou com você agora”, “está a 100 m” ou “está neste café”.

Contrato enviado ao arquiteto: apenas `id`, cidade/região ampla e perfil fictício elegível. Campos de navegação transitórios podem lembrar de onde o perfil foi aberto; não devem conceder match ou alterar consentimentos. Regiões pequenas/rurais exigirão desenho próprio de agregação antes de produção, fora da prova estática.

## 4. Invariantes e aceites de Por Perto

| ID | Invariante | Aceite verificável |
|---|---|---|
| PP-01 | Somente adulto elegível | Grid e lista respeitam faixa 18–99 e filtros; idade incompatível não reaparece por outra entrada. Autodeclaração da demo não equivale a garantia de idade em produção. |
| PP-02 | Bloqueio não depende da aba | Bloquear pela conversa/detalhe remove de Por Perto e descoberta; retornar pela rota anterior não reabre chat/retratos. |
| PP-03 | Unmatch não é reiniciado pelo grid | Conexão encerrada não se torna nova conexão por like ou acesso antigo; manter guardas do domínio. |
| PP-04 | Localização apenas fictícia/ampla | Fonte/runtime não chama geolocation nem contém coordenadas/horário preciso para pessoas. Rótulo explica cidade/região e simulação. |
| PP-05 | Foto continua bilateral | Nenhuma miniatura de rosto no grid, perfil ou overlay antes de tempo/turnos e dois aceites da versão atual. Só retratos SVG fictícios na demo. |
| PP-06 | Detalhe mantém origem correta | Abrir grid → perfil → livro → voltar preserva pessoa e origem; like não gera decisão dupla nem reabre detalhe depois de match/bloqueio. |
| PP-07 | Navegação não é autorização | Link direto/reload/back para pessoa sem match ativo cai em estado seguro sem conversa/foto; busca/filtro não remove bloqueio. |
| PP-08 | Texto editável permanece texto | Nome, bio, mensagem e rascunho continuam escapados; campos fictícios novos não abrem importação de conteúdo externo. |

## 5. Estado de implementação e revisão

Revisão concreta feita após aviso de estabilidade: lidos o diff e contexto de `dist/app.mjs`, `dist/index.html`, novas rotas/contextos, filtros, ações do perfil, histórico/modal, chamadas de consentimento, além de `dist/pesquisa.html`, `dist/pesquisa.mjs` e caminhos de CSS/ativos. `domain.mjs` e `interaction.mjs` continuam sem alterações no diff examinado.

| Contrato | Resultado observado |
|---|---|
| PP-01 | `nearby()` usa o mesmo `filtered()` do deck: cidade, faixa etária, gênero literário, passes, curtidas já enviadas e bloqueios. Perfis da fixture são adultos. Isso não equivale a garantia de idade real. |
| PP-02 e PP-03 | `personAvailable()` nega bloqueados e matches `UNMATCHED`/`BLOCKED`; aplicado ao abrir pessoa, aplicar rota, parsear hash, renderizar e decidir. O domínio continua negando reativação por like. |
| PP-04 | Grid informa “Cidade do cenário fictício · sem usar sua localização”; cidade escolhida manualmente. Nenhuma chamada de geolocalização, coordenada de pessoa ou horário de cruzamento identificada no runtime examinado. |
| PP-05 | `canViewPhoto()` segue usado no chat antes de construir os retratos SVG. A tela `people()` não consulta esse gate porque mostra somente capas e texto, inclusive após revelação; portanto não é caminho alternativo de entrega de foto. |
| PP-06 | Perfil passa a ser rota `#people/id`; livro expande inline, sem inserir nova rota. Contexto de origem mantém modo/posição/livro. Jornadas de grid → pessoa → livro → retorno → match → chat aprovadas. |
| PP-07 | `applyRoute()` revalida pessoa e match ao restaurar contexto; histórico não altera estado do domínio. Hash antiga de conversa encerrada e hash de pessoa bloqueada foram exercitadas sem restaurar acesso. |
| PP-08 | Texto editável continua escapado em nome, bio, rascunho e mensagens. Nova opinião inline usa `esc`; nomes/dados de outras pessoas permanecem fixtures locais. |

Execução própria nesta revisão: `npm test` com **60/60 aprovados** (17 domínio, 7 gesto, 2 copy, 2 integridade e 32 DOM emulado). Também executei um cenário avulso: Por Perto → Ana → bloquear pelo perfil → voltar ao grid → abrir `#people/ana`. Ana não apareceu no grid e a hash não renderizou perfil, chat nem retrato. Nenhum teste ou arquivo de frontend foi modificado por esta revisão.

O atlas de pesquisa é separado do app de pessoas. As sete imagens ficam em caminhos locais de evidências, com fontes e alcance descritos nas legendas. `pesquisa.mjs` usa dados constantes e `textContent` para construir as jornadas, além de alternar visibilidade de figuras; não lê conteúdo remoto nem injeta parâmetros de URL como HTML. Links externos de nova aba usam `rel="noopener"`. Imagens de pesquisa não são fotografias de perfis da comunidade fictícia. Legendas/documentação não constituem autorização de reutilização irrestrita das capturas.

**Parecer: APPROVE para a demonstração, sem achado concreto aberto no escopo revisado.** Isso não é auditoria de navegador/dispositivo, backend, regras de banco, host de mídia ou moderação. Happy-dom não comprova layout, gesto nativo ou aplicação de cabeçalhos HTTP pelo host. Go público com dados reais continua condicionado a `SEGURANCA.md`.
