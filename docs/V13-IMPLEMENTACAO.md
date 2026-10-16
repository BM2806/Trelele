# V13 — última marca e livros com capas

Escopo solicitado: preservar a V12 aprovada, atualizar marca/abertura pela referência IMG_1523 e consultar livros por título/autor com capa.

A entrada, abertura do cadastro e Sobre usam o artwork livro-coração aprovado. A marca raster é enquadrada proporcionalmente por CSS; o fundo decorativo é separado dos controles e tem cantos orgânicos verdes/laranja. Apple, Google e e-mail continuam visíveis, sem alegar autenticação configurada.

O catálogo tenta Google Books e, em indisponibilidade, consulta Open Library com identificação explícita da fonte. Consultas públicas não levam perfil, fotos, cookies ou credenciais. Na sondagem HTTP do ambiente, Google retornou 429 e Open Library retornou 200 com CORS permitindo a origem. A experiência real no navegador é registrada separadamente pela auditoria.

Até três obras distintas podem ser selecionadas. IDs e metadados normalizados são salvos no perfil local, inclusive a URL validada da capa. Seleção tem loading, vazio, erro/retry, remoção, proteção contra resposta antiga e capa ausente. Perfis legados continuam aceitos. Não existe busca automática durante render do perfil. Capas externas aparecem no perfil e nas superfícies que já exibiam seus livros; posições privadas permanecem sem originais pessoais.

Validação automatizada: build TypeScript/Vite, integridade dos 28 arquivos protegidos e 62 testes de catálogo, storage/transações, sessão demo, gesto e empacotamento passaram. As consultas dos testes são simuladas; a inspeção de API real e UI tem registro próprio. Cadastro com upload de três fotos e teclado físico Safari/Android não foram certificados nesta revisão.

Não contém mudanças na base de autenticação separada, infraestrutura de banco ou privacidade do repositório.
