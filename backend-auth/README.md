# Trelelê — base independente de autenticação

Backend executável e **desativado por padrão**, separado de `mobile-beta`. Não foi publicado, não recebe o frontend e não altera o Nginx atual. Não houve provisionamento de banco, envio de email real ou configuração de credenciais. A interface pública permanece um beta local com pessoas fictícias.

## O que está implementado

Node ESM, Express 5, Better Auth 1.7.10, PostgreSQL via `pg.Pool` e SMTP Nodemailer. Dependências diretas e transitivas estão travadas em `package-lock.json`. Não há JWT próprio, senha própria, login de desenvolvimento ou fallback autenticado em memória.

- Better Auth oficial em `/api/auth/*`, com Google e Apple condicionais e plugin email OTP.
- OTP de seis dígitos, cinco minutos, três tentativas, armazenamento **hashed**, reenvio **rotate**. Limites habilitados e persistidos no banco, inclusive em desenvolvimento.
- Cookies Secure/HttpOnly, SameSite Lax, sessão consultada no banco, estado OAuth no banco e conferência de cookie de estado ativa. Origins exatas, sem wildcard; sem CORS entre domínios.
- Nenhum avatar OAuth é importado: `mapProfileToUser` define `image: null`. Vinculação automática de provedores desativada.
- Logout e exclusão remota são endpoints **oficiais** Better Auth; exclusão exige sessão recente (cinco minutos). O perfil próprio possui FK `ON DELETE CASCADE` para o usuário.
- Metadados do perfil pertencem à identidade da sessão. Não existem endpoint de busca pública, chat real, matches remotos, upload de mídia ou transmissão de originais privados.

## Executar sem ativar autenticação

Requer Node 22.13+ (os testes usam `node:sqlite`, somente como adapter temporário de teste).

```sh
npm ci --ignore-scripts
npm test
npm start
```

Sem configuração, `/health` responde 200; `/api/auth-status`, `/api/profile` e `/api/auth/*` respondem 503. SQLite **não** é fallback do servidor. O servidor só usa PostgreSQL. O processo não carrega `.env` implicitamente; no ambiente de desenvolvimento, use o mecanismo seguro de variáveis disponível, ou `node --env-file=.env src/server.mjs`. Nunca versionar `.env` ou arquivos `.p8`.

## Contrato HTTP

| Rota | Comportamento |
|---|---|
| `GET /health` | Liveness `{ok:true}`; não comprova banco, email ou OAuth |
| `GET /api/auth-status` | 200 quando configuração, schema e consulta de banco estão prontos; senão 503. Corpo somente `{ready,providers:{google,apple,emailOtp},profilePersistence,privatePhotoStorage:false,socialNetwork:false}` |
| `/api/auth/*` | Handler oficial Better Auth; não criar rotas paralelas de login |
| `GET /api/profile` | 401 sem sessão; `{profile:null,metadataOnly:true,photosSupported:false}` se ainda não existe, ou `profile:{metadata,updatedAt}` |
| `PUT /api/profile` | Sessão obrigatória; Origin exatamente igual a `BETTER_AUTH_URL`, JSON até 16 KiB; 400 para metadados inválidos; retorna envelope igual ao GET |

`PUT` recebe exatamente: `name`, `birthDate` (ISO), `city`, `identity`, `interestedIn`, `intention`, `genres`, `books`, `bio`, `readingHabits`, `literaryDates`, `bookRecommendation`. Rejeita campos extras, `userId`, `completed`, fotos, URLs de mídia e tokens. Exige maioridade **autodeclarada**, três IDs distintos do catálogo curado (`estrela`, `avesso`, `torto`, `rio`, `vegetariana`, `cegueira`) e as opções atuais do beta. A data de nascimento retorna somente ao próprio dono. Texto livre é dado, nunca HTML confiável.

O endpoint salva somente metadados. Não significa perfil de encontros concluído: as três fotos privadas ainda não têm armazenamento remoto. Atualizações concorrentes de metadados usam última gravação; nenhuma autorização de foto ou decisão de match é persistida aqui.

Métodos do SDK oficial para integração futura:

```js
// createAuthClient + emailOTPClient, importados da mesma versão Better Auth.
authClient.signIn.social({ provider: 'google', callbackURL: '/', errorCallbackURL: '/' });
authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' });
authClient.signIn.emailOtp({ email, otp });
authClient.getSession();
authClient.signOut();
authClient.deleteUser(); // sessão recente; exigir confirmação explícita na futura UI
```

Caminhos correspondentes: `/api/auth/sign-in/social`, `/api/auth/email-otp/send-verification-otp`, `/api/auth/sign-in/email-otp`, `/api/auth/get-session`, `/api/auth/sign-out`, `/api/auth/delete-user`. Sessão só existe após confirmação do servidor. Receber um callback/código de navegação não prova login. Reenvio: “Vale o código que você acabou de pedir”; respeitar o `X-Retry-After` retornado em 429, sem fingir que um timer local aplica limite.

## Configuração externa necessária, sem enviar segredos por chat

Usar variáveis privadas do futuro serviço, conforme `.env.example`. Nenhuma credencial entra em `VITE_*`.

1. **Base:** `AUTH_ENABLED=true`, `DATABASE_URL` para PostgreSQL, `BETTER_AUTH_SECRET` aleatório com pelo menos 32 caracteres e `BETTER_AUTH_URL=https://HOST-ESTAVEL` sem path/query. A origem HTTPS é obrigatória, inclusive para preparar Apple. Configuração parcial de qualquer grupo informado impede readiness; grupos não usados devem ficar inteiramente vazios.
2. **Google:** criar OAuth client do tipo Web application no Google Cloud, configurar tela de consentimento e `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`. Registrar exatamente `https://HOST-ESTAVEL/api/auth/callback/google`. Não pedir escopos Google Books, Drive ou outros para autenticar.
3. **Apple:** Apple Developer ativo, App ID com Sign in with Apple, Service ID web associado, domínio e Return URL `https://HOST-ESTAVEL/api/auth/callback/apple`. Configurar `APPLE_CLIENT_ID` (Service ID), `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` (.p8). O segredo JWT é gerado no servidor com `jose`, expiração de uma hora. Apple não aceita localhost/HTTP. O email pode vir somente na primeira autorização; uma conta Apple não deve ser fundida com outra por suposição.
4. **Email:** conta em provedor SMTP, remetente simples `no-reply@DOMINIO` verificado e DNS exigido pelo provedor (SPF/DKIM/DMARC conforme serviço). `SMTP_HOST`, `SMTP_PORT` 465 ou 587, `SMTP_USER`, `SMTP_PASS`, `AUTH_EMAIL_FROM`. TLS obrigatório, certificados validados, sem fallback inseguro. Testes usam mock; configurar as variáveis não comprova entrega.

Nenhuma mensagem é enviada ao iniciar, consultar health/status ou migrar. A mensagem é enviada somente quando o usuário solicita o endpoint apropriado. A indisponibilidade SMTP produz erro genérico, nunca código de teste ou sucesso falso. Status indica capacidade **configurada**, não credencial externa aprovada nem entrega comprovada. A verificação SMTP de conexão existe como ação explícita, não é executada automaticamente.

## Schema: planejar e aplicar explicitamente

Com configuração completa no ambiente seguro:

```sh
npm run db:plan
# Revisar SQL gerado antes de aplicar; conferir destino e backup.
npm run db:migrate
```

Usa `getMigrations` exportado pela versão travada do Better Auth; não baixa CLI `latest` durante produção. `db:plan` imprime SQL de schema, não credenciais. `db:migrate` aplica esquema Better Auth (inclui `rateLimit`) e tabela `trelele_profile`. Migrações não são executadas pelo servidor. Schema pendente/unsafe impede readiness. Falha inicial mantém serviço inativo; corrigir configuração/schema e reiniciar. Falha posterior do banco resulta em 503 nas rotas protegidas; nunca muda para memória.

Esta base usa os nomes padrão Better Auth em schema PostgreSQL padrão. Revisar conflito de tabelas antes de usar banco existente; não apontar para banco de outro projeto. Planejamento/aplicação PostgreSQL e cascata efetiva precisam de ensaio em banco isolado real antes de integrar UI.

## Fronteira com frontend e publicação futura

O Docker deste diretório roda **somente esta API** como usuário não root. Nenhum deploy foi feito. A integração futura recomendada é mesmo domínio via serviço Node servindo build Vite ou proxy `/api` explícito; a SPA nunca deve devolver `index.html` para uma falha de API. O Docker/Nginx de `mobile-beta` não foi modificado. Não habilitar CORS genérico para contornar esta etapa.

O adaptador oficial Node recebe payload limitado a 16 KiB por `express.raw`, preservado como string (JSON e form-urlencoded Apple), e rejeita conteúdo comprimido. Testes verificam também transferência chunked. Host e protocolo do adaptador são canonicalizados pela URL configurada. `trust proxy=false`; o header de IP interno é sobrescrito pelo TCP peer, nunca pelo cliente. Atrás de proxy, clientes podem compartilhar bucket: é deliberadamente conservador. Antes de escalar, configurar origem privada/proxy confiável e estratégia de IP verificada; não ativar `trust proxy=true` ou confiar em X-Forwarded-For arbitrário.

**Apple POST / cookies:** a fonte instalada Better Auth 1.7.10 (`dist/api/routes/callback.mjs`) transforma POST do callback em redirect GET no próprio callback, antes de consumir o estado. Mantivemos SameSite Lax e checks de estado; não usamos SameSite None global nem pulamos a validação. O fluxo precisa de teste HTTPS real no Safari/Apple antes de disponibilizar essa entrada.

Antes da UI real: testar entrega OTP, Google, Apple, cancelamento, logout e exclusão da própria conta no domínio final; confirmar isolamento de duas contas em navegadores diferentes e persistência após reinício. Explicitar erro/reautenticação quando deleteUser requer sessão recente. Separar “apagar dados deste aparelho”, logout e exclusão da conta. A autenticação não migra o IndexedDB, fotos ou conversas locais. Nenhum import automático ou envio de originais foi implementado. Ver também `../docs/AUTENTICACAO-UX-V11.md`.

## Evidências e limites

- 17 testes: HTTP de readiness/401/owner/origin/payload, SMTP mock/TLS, SQL parametrizado, whitelist e políticas; handler Better Auth real com adapter SQLite temporário verifica OTP hashed/rotate/expiração/uso único, 429 persistido, sessão/logout e exclusão com cascata no fixture.
- SQLite existe **somente nos testes**, não valida dialect/schema/transações reais PostgreSQL nem callbacks de provedores. Nenhum teste usa provedor externo ou SMTP real.
- `npm audit --omit=dev` consultado em 16/10/2026: zero vulnerabilidades reportadas nessa execução. Isso não garante ausência de falhas.
- Logs próprios contêm códigos fixos, sem email, OTP, senha, token, corpo, query OAuth ou URL de callback. Logger detalhado de Better Auth/SMTP desativado. Plataforma/proxy também precisa de política de logs que não registre query OAuth.
- Exclusão remove usuário/sessões/contas conforme Better Auth e perfil dependente. Registros temporários de verificação/rate limit e backups precisam de política operacional de retenção/limpeza antes de produção; não prometemos eliminação instantânea de todos os vestígios.
- Esta base não entrega moderação, proteção de mídias remotas, verificação etária documental, comunicação real entre pessoas ou garantias completas de segurança.

## Fontes oficiais consultadas em 16/10/2026

- https://better-auth.com/docs/integrations/express
- https://better-auth.com/docs/adapters/postgresql
- https://better-auth.com/docs/plugins/email-otp
- https://better-auth.com/docs/authentication/google
- https://better-auth.com/docs/authentication/apple
- https://better-auth.com/docs/concepts/oauth
- https://better-auth.com/docs/concepts/cookies
- https://better-auth.com/docs/concepts/session-management
- https://better-auth.com/docs/concepts/rate-limit
- https://developers.google.com/identity/protocols/oauth2/web-server
- https://developer.apple.com/help/account/capabilities/configure-sign-in-with-apple-for-the-web/

Versão npm Better Auth `latest=1.7.10` verificada via `npm view`; coincide com documentação oficial consultada. API e comportamento do adaptador também foram lidos diretamente no pacote travado instalado. Não copiar credenciais dos exemplos/documentos.
