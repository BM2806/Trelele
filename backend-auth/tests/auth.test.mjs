import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readConfig, publicCapabilities } from '../src/config.mjs';
import { buildAuthOptions } from '../src/auth.mjs';
import { createApp } from '../src/app.mjs';
import { createOtpMailer } from '../src/mailer.mjs';
import { createProfileRepository, validateProfile } from '../src/profile.mjs';
import { createRuntime } from '../src/runtime.mjs';
import { hasPendingAuthSchema } from '../src/schema.mjs';

const environment = () => ({ AUTH_ENABLED: 'true', BETTER_AUTH_URL: 'https://app.example.test', BETTER_AUTH_SECRET: 'test-only-never-deploy-secret-123456789012345', DATABASE_URL: 'postgresql://test.invalid/auth', GOOGLE_CLIENT_ID: 'test-only-client', GOOGLE_CLIENT_SECRET: 'test-only-secret' });
const profile = () => ({ name: 'Pessoa de teste', birthDate: '1996-10-17', city: '', identity: 'Prefiro não dizer', interestedIn: ['Todos'], intention: 'Conhecer pessoas', genres: ['Romance'], books: ['estrela', 'avesso', 'rio'], bio: '', readingHabits: [], literaryDates: [], bookRecommendation: '' });
async function serve(t, config, runtime) {
  const server = createApp({ config, runtime }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  return `http://127.0.0.1:${server.address().port}`;
}
const fakeRuntime = (userId = null) => ({
  isReady: async () => true,
  auth: { handler: async () => Response.json({ officialAdapter: true }), api: { getSession: async () => userId ? { user: { id: userId } } : null } },
  profiles: { get: async id => ({ metadata: { owner: id } }), put: async (id, metadata) => ({ metadata, owner: id }) },
});

test('default inactive: no DB, provider, mail or session fallback; public status contains no configuration', async t => {
  const config = readConfig({});
  assert.equal(await createRuntime(config), null);
  const base = await serve(t, config, null);
  assert.equal((await fetch(`${base}/health`)).status, 200);
  const response = await fetch(`${base}/api/auth-status`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ready: false, providers: { google: false, apple: false, emailOtp: false }, profilePersistence: false, privatePhotoStorage: false, socialNetwork: false });
  for (const path of ['/api/auth/get-session', '/api/profile']) assert.equal((await fetch(base + path)).status, 503);
});

test('HTTPS exact origin, complete provider groups and explicit enable are required', () => {
  const env = environment();
  assert.equal(readConfig(env).configured, true);
  for (const url of ['http://app.example.test', 'https://app.example.test/path', 'https://user:pass@app.example.test', 'https://app.example.test?x=1']) assert.equal(readConfig({ ...env, BETTER_AUTH_URL: url }).configured, false);
  assert.equal(readConfig({ ...env, AUTH_ENABLED: 'false' }).configured, false);
  assert.equal(readConfig({ ...env, APPLE_CLIENT_ID: 'incomplete' }).configured, false);
  assert.equal(readConfig({ ...env, GOOGLE_CLIENT_SECRET: '' }).providers.google, false);
  assert.equal(readConfig({ ...env, BETTER_AUTH_SECRET: 'short' }).configured, false);
});

test('capabilities fail closed when readiness DB probe fails', async t => {
  const config = readConfig(environment());
  const base = await serve(t, config, { ...fakeRuntime(), isReady: async () => { throw new Error('private DB details'); } });
  const result = await fetch(`${base}/api/auth-status`);
  assert.equal(result.status, 503);
  assert.equal((await result.json()).providers.google, false);
  assert.ok(!JSON.stringify(publicCapabilities(config, true)).includes('test-only-secret'));
});

test('unauthenticated owner endpoint returns 401 without querying profile storage', async t => {
  const runtime = fakeRuntime();
  runtime.profiles.get = () => assert.fail('must not read any owner profile');
  const base = await serve(t, readConfig(environment()), runtime);
  assert.equal((await fetch(`${base}/api/profile`)).status, 401);
});

test('owner is server session, not query or body; foreign owner and photo fields are rejected', async t => {
  const runtime = fakeRuntime('owner-A');
  const base = await serve(t, readConfig(environment()), runtime);
  const get = await (await fetch(`${base}/api/profile?userId=owner-B`)).json();
  assert.equal(get.profile.metadata.owner, 'owner-A');
  const put = body => fetch(`${base}/api/profile`, { method: 'PUT', headers: { Origin: 'https://app.example.test', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  for (const extra of [{ userId: 'owner-B' }, { photos: ['private-original'] }, { image: 'https://photo.example.test/me' }, { completed: true }]) assert.equal((await put({ ...profile(), ...extra })).status, 400);
  const response = await put(profile());
  assert.equal(response.status, 200);
  const saved = await response.json();
  assert.equal(saved.profile.owner, 'owner-A');
  assert.equal(saved.photosSupported, false);
});

test('custom profile mutation requires exact Origin, JSON, valid adult and three known books', async t => {
  const base = await serve(t, readConfig(environment()), fakeRuntime('owner-A'));
  const put = (origin, body, type = 'application/json') => fetch(`${base}/api/profile`, { method: 'PUT', headers: { ...(origin ? { Origin: origin } : {}), 'Content-Type': type }, body: JSON.stringify(body) });
  for (const origin of [null, 'https://evil.example.test', 'https://app.example.test.evil.test']) assert.equal((await put(origin, profile())).status, 403);
  assert.equal((await put('https://app.example.test', profile(), 'text/plain')).status, 415);
  for (const delta of [{ birthDate: '2015-01-01' }, { birthDate: '2000-02-30' }, { books: ['rio', 'rio', 'avesso'] }, { books: ['rio', 'unknown', 'avesso'] }]) assert.throws(() => validateProfile({ ...profile(), ...delta }));
  assert.doesNotThrow(() => validateProfile({ ...profile(), birthDate: '2008-10-16' }, new Date('2026-10-16T12:00:00Z')));
  assert.throws(() => validateProfile({ ...profile(), birthDate: '2008-10-17' }, new Date('2026-10-16T12:00:00Z')));
});

test('SQL repository parameterizes owner and metadata; no body-supplied selector exists', async () => {
  const calls = [];
  const repo = createProfileRepository({ query: async (sql, values) => { calls.push([sql, values]); return { rows: [{ metadata: profile(), updated_at: 'now' }] }; } });
  const owner = "owner' OR 1=1--";
  await repo.get(owner); await repo.put(owner, profile());
  for (const [sql, values] of calls) { assert.ok(!sql.includes(owner)); assert.equal(values[0], owner); }
});

test('official handler receives preserved form and canonical origin with forged proxy headers removed', async t => {
  const runtime = fakeRuntime();
  runtime.auth.handler = async request => Response.json({ url: request.url, body: await request.text(), type: request.headers.get('content-type'), peer: request.headers.get('x-trelele-peer-ip') });
  const base = await serve(t, readConfig(environment()), runtime);
  const response = await fetch(`${base}/api/auth/callback/apple`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Forwarded-Proto': 'http', 'X-Trelele-Peer-IP': '8.8.8.8', Host: 'evil.example.test' }, body: 'state=abc&code=a%2Bb' });
  const result = await response.json();
  assert.equal(result.url, 'https://app.example.test/api/auth/callback/apple');
  assert.equal(result.body, 'state=abc&code=a%2Bb');
  assert.match(result.type, /x-www-form-urlencoded/);
  assert.notEqual(result.peer, '8.8.8.8');
});

test('oversized JSON and form bodies never reach auth handler', async t => {
  const runtime = fakeRuntime();
  runtime.auth.handler = () => assert.fail('oversized request reached auth');
  const base = await serve(t, readConfig(environment()), runtime);
  for (const type of ['application/json', 'application/x-www-form-urlencoded']) {
    const response = await fetch(`${base}/api/auth/sign-in/social`, { method: 'POST', headers: { 'Content-Type': type }, body: 'x'.repeat(17000) });
    assert.equal(response.status, 413);
  }
});

test('chunked body is byte-limited before auth handler', async t => {
  const runtime = fakeRuntime();
  runtime.auth.handler = () => assert.fail('chunked oversized request reached auth');
  const base = await serve(t, readConfig(environment()), runtime);
  const status = await new Promise((resolve, reject) => {
    const request = http.request(`${base}/api/auth/sign-in/social`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Transfer-Encoding': 'chunked' } }, response => { response.resume(); response.on('end', () => resolve(response.statusCode)); });
    request.on('error', reject); request.write('x'.repeat(10000)); request.end('y'.repeat(10000));
  });
  assert.equal(status, 413);
});

test('auth policies use durable limiter, fresh-session deletion and no OAuth avatar import', () => {
  const options = buildAuthOptions(readConfig(environment()), {}, null);
  assert.equal(options.rateLimit.storage, 'database');
  assert.equal(options.rateLimit.enabled, true);
  assert.equal(options.advanced.disableCSRFCheck, false);
  assert.equal(options.advanced.disableOriginCheck, false);
  assert.deepEqual(options.trustedOrigins, ['https://app.example.test']);
  assert.equal(options.account.skipStateCookieCheck, false);
  assert.equal(options.account.accountLinking.enabled, false);
  assert.equal(options.account.encryptOAuthTokens, true);
  assert.equal(options.advanced.defaultCookieAttributes.sameSite, 'lax');
  assert.equal(options.user.deleteUser.enabled, true);
  assert.equal(options.session.freshAge, 300);
  assert.deepEqual(options.socialProviders.google.mapProfileToUser({ picture: 'https://private.test/face' }), { image: null });
  assert.equal(options.logger.disabled, true);
});

test('SMTP mock: strict TLS, no startup send, bounded recipient and plain text OTP; delivery errors are generic', async () => {
  const sent = []; let transportConfig;
  const mailer = createOtpMailer({ host: 'smtp.example.test', port: 587, user: 'test', pass: 'test', from: 'no-reply@example.test' }, config => { transportConfig = config; return { sendMail: async message => { sent.push(message); }, close() {}, verify: async () => true }; });
  assert.equal(sent.length, 0);
  assert.equal(transportConfig.requireTLS, true);
  assert.equal(transportConfig.tls.rejectUnauthorized, true);
  await assert.rejects(() => mailer.send({ email: 'victim@example.test\r\nBcc: other@example.test', otp: '123456', type: 'sign-in' }));
  assert.equal(sent.length, 0);
  await mailer.send({ email: 'reader@example.test', otp: '123456', type: 'sign-in' });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].html, undefined);
  assert.equal(sent[0].disableFileAccess, true);
  assert.equal(sent[0].disableUrlAccess, true);
  const failing = createOtpMailer({}, () => ({ sendMail: async () => { throw new Error('SMTP password secret raw'); } }));
  await assert.rejects(() => failing.send({ email: 'reader@example.test', otp: '123456', type: 'sign-in' }), { message: 'EMAIL_DELIVERY_FAILED' });
});

test('schema drift and unsafe/index migrations prevent readiness', () => {
  const clean = { toBeCreated: [], toBeAdded: [], toBeAddedIndexes: [], unsafeChanges: [], schemaProblems: [] };
  assert.equal(hasPendingAuthSchema(clean), false);
  for (const key of Object.keys(clean)) assert.equal(hasPendingAuthSchema({ ...clean, [key]: [{}] }), true);
});
