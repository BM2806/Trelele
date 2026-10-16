# V13 — revisão de catálogo, capas e perfil local

**Fonte revisada, nenhum P1 novo demonstrado nesta auditoria.** Escopo: book-catalog.ts, profile-storage.ts, BookPicker.tsx e integração Prototype/Onboarding. Revisão ECC security-reviewer; nenhum aplicativo ou backend foi modificado por este auditor.

## Limites de dados e rede

- Busca pública construída exclusivamente para Google Books volumes ou Open Library search. URLSearchParams, termo de 2–120 caracteres, até 20 resultados. Sem endpoint proxy, chave de API ou URL de destino fornecida pelo usuário.
- Fetch usa credentials omit, referrerPolicy no-referrer, redirect error e AbortController. Resposta máxima de 512 KiB conferida tanto no header quanto durante streaming. Timeout e cancelamento não fabricam resultado local. Fallback para Open Library é explícito.
- BookPicker inicia consulta após digitação pública e debounce de 400 ms. Não envia nome, identidade, bio, perfil ou fotos. Dados do serviço externo são texto React, nunca HTML inserido ou script.
- Capa persistida exige HTTPS, sem credenciais, porta ou fragmento. Google permite hosts exatos books.google.com/books.googleusercontent.com e caminhos /books ou /books/content com img=1, parâmetros permitidos e id igual ao volume. Open Library aceita apenas covers.openlibrary.org/b com id/isbn/olid e formato JPG S/M/L; não endpoint de fotografia de autor.
- Imagem falha vira placeholder local. Nenhuma URL SVG arbitrária, host externo arbitrário ou foto OAuth é introduzida.

## Persistência e identidade do livro

IDs externos são namespaced e correspondem ao sourceId. Registros têm whitelist de campos, limites de título/autoria, ISBN validado e ano limitado. Máximo de três IDs/records selecionados; rejeição de metadata de obra não selecionada. Deduplicação por ID, ISBN e título+autor normalizados é explícita, sem promessa de identidade universal entre edições.

Os seis IDs curados antigos continuam resolvidos sem bookDetails. IDs externos exigem metadata válida; entradas desconhecidas ou inseguras falham visivelmente. Perfil local tem teto de 64 KiB. Metadados não incluem original, blob URL, credencial ou dados de autenticação.

Commit de livros continua associado à transação das três fotos: rejeição/limite/quota/abort não deve substituir o confirmado anterior. IndexedDB e localStorage continuam sem atomicidade universal contra crash; a limitação anterior permanece. Prototype resolve o catálogo próprio a partir do perfil validado; capas não se transformam em índice global mutável de proprietários.

## Revisão e fronteira de autenticação

review=1 continua bloqueando leitura/gravação de perfil, sessão, preferências e fotos privadas. A nova busca é uma exceção pública intencional: termo digitado pode consultar os catálogos e carregar suas capas. Portanto, não descrever review como sem qualquer rede; dizer sem dados pessoais salvos ou lidos. Login real não foi ativado e backend-auth V11 não integra esta entrega.

## Testes executados por este auditor

Comando em mobile-beta: `node --experimental-strip-types --test tests/book-catalog.test.mjs tests/profile-storage.test.mjs tests/profile-transactions.test.mjs`. Resultado: **40/40 passaram**, catálogo 12 e armazenamento 28. Inclui abort/timeout, fallback 429, payload malformado/grande, URL hostil, deduplicação entre provedores, persistência externa, legado, falha de quota e transação abortada.

Os provedores de rede nos testes são respostas sintéticas; as fotos são fixtures sintéticas. Esta execução não comprova Google/Open Library disponíveis por CORS no navegador nem seleção, reload e revisão do perfil de ponta a ponta. Esses resultados pertencem à QA separada. Nenhuma imagem privada de referência ou original pessoal deve entrar no checkpoint V13; os ativos de marca derivados expressamente autorizados são arquivos separados do frame enviado pelo usuário.
