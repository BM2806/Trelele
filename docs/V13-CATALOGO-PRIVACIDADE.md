# V13 — busca de livros, marca e privacidade

final result: passed

**Escopo:** nova marca/fundo nas entradas e busca/seleção de livros no cadastro de prévia em cloud browser, 390×844 e 360×640. Sem aprovação de autenticação real, upload normal de fotos, E2E completo ou hardware físico. Comparação visual final fica com o crítico independente.

## Evidência executada

- Busca real em `review=1`, etapa9: “Memórias Póstumas de Brás Cubas” em390 e “1984” em360, ambas fora dos seis livros locais.
- Resultado exibiu Open Library e aviso explícito de indisponibilidade do Google Books. Não houve resultado remoto inventado ou curado apresentado como remoto.
- Selecionados Memórias póstumas de Brás Cubas, Machado de Assis,1881; Nineteen Eighty-Four, George Orwell,1949. Cada um ficou junto de dois curados nos três slots, com título e capa.
- As imagens selecionadas tinham `complete=true` e `naturalWidth>0`: `https://covers.openlibrary.org/b/id/123152-M.jpg?default=false` e `https://covers.openlibrary.org/b/id/9267242-M.jpg?default=false`. Isso confirma resposta de catálogo/CORS e capas reais carregadas no browser desta sessão. Não confirma disponibilidade universal dos serviços.
- Continuar3/3 levou ao passo10 sem seletor de arquivos. Voltar9 preservou o livro externo e a seleção3/3 nas duas larguras; a busca textual foi limpa ao remontar, mantendo metadados selecionados. Tudo em memória da prévia.
- Resultados reais sem imagem mostraram “Sem capa” e nome acessível; carregamento mostrou “Buscando livros…”. Falhas de rede/timeout/retry foram revisadas na fonte/testes de contrato, sem provocar indisponibilidade artificial no browser.
- Capturas finais de abertura e provedores confirmam marca, cantos decorados e três botões completos em360, sem sobreposição do texto pelo fundo. Nenhuma outra tela V12 foi redesenhada neste escopo.

## Fonte e privacidade

O catálogo envia somente a consulta de livro e parâmetros públicos para Google Books/Open Library. Requisições usam `credentials:omit`, `no-referrer`, cancelamento e timeout, com resposta limitada em tamanho; nenhuma chave de API no bundle. Nenhum nome, nascimento, mensagem ou foto do perfil é enviado pelo código de busca. Capas persistidas aceitam HTTPS e hosts/caminhos permitidos, sem credenciais, portas ou parâmetros arbitrários. Os registros têm IDs por provedor, título/autor/procedência e metadados limitados. Não há HTML interpretado a partir desses campos.

Metadata selecionada é validada no load/save/commit; exatamente três livros para concluir, com IDs distintos e comparação de obra/ISBN. Compatibilidade dos IDs curados preservada. P2 de coerência ISBN foi reportado e conferido corrigido no BookPicker: comparação por obra OU ISBN em seleção e botão disabled. A revisão não considera essa comparação um identificador universal de obra.

Guard `reviewMode` continua impedindo leituras/escritas do perfil, sessão, rascunho e fotos reais. BookPicker consulta somente o catálogo público autorizado; seleção navega por estado React. Os originais do dono continuam fora de perfis fictícios, capas e preview. Perfil real persiste metadata externa pelos contratos testados pelo autor; não foi criado perfil normal com fotos no browser desta rodada.

## Artefatos e limites

Capturas exportadas, verificadas como arquivos não vazios no host e copiadas para `docs/design-v13/`:

- `providers-final.jpg`: entrada com três provedores em ambas larguras.
- `welcome-final.jpg`: abertura final com a mesma marca/fundo.
- `livros-selecionados.jpg`: resultado externo selecionado com duas capas curadas.
- `livros-retorno.jpg`: três livros preservados depois de9→10→9.

Root informou build/runtime28 e62 testes aprovados; arquiteto informou40 testes de catálogo/storage, incluindo respostas simuladas e roundtrip externo. Estes são testes de contrato, distintos da busca real de browser descrita acima. O sucesso de Google Books não foi observado: o fallback real Open Library foi. Apple Books continua fora da integração.

Um overlay temporário de import BrandLogo ausente foi observado durante integração e desapareceu após sincronização/reload; não é falha da fonte final. Nenhum seletor de arquivos foi aberto, nenhum storage anterior foi apagado, nenhum login externo foi realizado. Sem bloqueador concreto encontrado no escopo executado.
