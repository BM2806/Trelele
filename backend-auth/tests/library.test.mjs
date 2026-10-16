// Real Better Auth handler + in-memory SQLite test adapter; NOT a PostgreSQL,
// SMTP, OAuth-provider or deployed-cookie end-to-end test. No runtime fallback.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { getMigrations } from 'better-auth/db/migration';
import { buildAuthOptions, createAuth } from '../src/auth.mjs';
import { readConfig } from '../src/config.mjs';

async function fixture(t) {
  const database = new DatabaseSync(':memory:');
  database.exec('PRAGMA foreign_keys = ON');
  t.after(() => database.close());
  const config = readConfig({ AUTH_ENABLED: 'true', BETTER_AUTH_URL: 'https://app.example.test', BETTER_AUTH_SECRET: 'test-only-never-deploy-secret-123456789012345', DATABASE_URL: 'postgresql://unused.invalid/test', SMTP_HOST: 'smtp.example.test', SMTP_PORT: '587', SMTP_USER: 'test', SMTP_PASS: 'test', AUTH_EMAIL_FROM: 'no-reply@example.test' });
  const mailbox = [];
  const options = buildAuthOptions(config, database, { send: async message => mailbox.push(message) });
  await (await getMigrations(options)).runMigrations();
  const auth = createAuth(options);
  await auth.$context;
  const request = (path, body, cookie = '', origin = config.origin) => auth.handler(new Request(`${config.origin}/api/auth${path}`, { method: body ? 'POST' : 'GET', headers: { Origin: origin, 'Content-Type': 'application/json', 'x-trelele-peer-ip': '127.0.0.1', ...(cookie ? { Cookie: cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) }));
  const send = () => request('/email-otp/send-verification-otp', { email: 'reader@example.test', type: 'sign-in' });
  const signIn = otp => request('/sign-in/email-otp', { email: 'reader@example.test', otp });
  return { database, mailbox, request, send, signIn };
}
function cookies(response) { return response.headers.getSetCookie().map(value => value.split(';')[0]).join('; '); }

test('real library: OTP is hashed, resend rotates and successful code cannot be reused', async t => {
  const { database, mailbox, send, signIn } = await fixture(t);
  assert.equal((await send()).status, 200);
  const first = mailbox[0].otp;
  const storedFirst = database.prepare('SELECT value FROM verification').get().value;
  assert.ok(!storedFirst.includes(first));
  assert.equal((await send()).status, 200);
  const second = mailbox[1].otp;
  const storedSecond = database.prepare('SELECT value FROM verification ORDER BY createdAt DESC').get().value;
  assert.notEqual(storedFirst, storedSecond);
  assert.ok(!storedSecond.includes(second));
  // Numeric collisions are possible with six digits; hashed storage still rotates.
  if (first !== second) assert.equal((await signIn(first)).status, 400);
  assert.equal((await signIn(second)).status, 200);
  assert.equal((await signIn(second)).status, 400);
});

test('real library: expired OTP cannot create a session', async t => {
  const { database, mailbox, send, signIn } = await fixture(t);
  await send();
  database.prepare('UPDATE verification SET expiresAt = ?').run(Date.now() - 1000);
  assert.equal((await signIn(mailbox[0].otp)).status, 400);
  assert.equal(database.prepare('SELECT count(*) AS total FROM session').get().total, 0);
});

test('real library: origin validation and durable request limit reject abuse without sending more mail', async t => {
  const { database, mailbox, send, request } = await fixture(t);
  assert.equal((await request('/email-otp/send-verification-otp', { email: 'reader@example.test', type: 'sign-in' }, '', 'https://evil.example.test')).status, 403);
  // Rejected origin attempts consume a rate-limit slot too.
  for (let index = 0; index < 2; index++) assert.equal((await send()).status, 200);
  const limited = await send();
  assert.equal(limited.status, 429);
  assert.equal(mailbox.length, 2);
  assert.ok(database.prepare('SELECT count(*) AS total FROM rateLimit').get().total > 0);
});

test('real library: session logout revokes access; fresh delete removes account and dependent profile', async t => {
  const { database, mailbox, send, signIn, request } = await fixture(t);
  await send();
  const login = await signIn(mailbox[0].otp);
  assert.equal(login.status, 200);
  const cookie = cookies(login);
  assert.match(login.headers.getSetCookie().join(';'), /HttpOnly/i);
  assert.match(login.headers.getSetCookie().join(';'), /Secure/i);
  const session = await (await request('/get-session', null, cookie)).json();
  assert.ok(session.user.id);
  assert.equal((await request('/sign-out', {}, cookie)).status, 200);
  assert.equal(await (await request('/get-session', null, cookie)).json(), null);
  await send();
  const freshLogin = await signIn(mailbox[1].otp);
  const freshCookie = cookies(freshLogin);
  database.exec('CREATE TABLE trelele_profile (user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE, metadata TEXT)');
  database.prepare('INSERT INTO trelele_profile VALUES (?, ?)').run(session.user.id, '{}');
  assert.equal((await request('/delete-user', {}, freshCookie)).status, 200);
  assert.equal(database.prepare('SELECT count(*) AS total FROM "user"').get().total, 0);
  assert.equal(database.prepare('SELECT count(*) AS total FROM trelele_profile').get().total, 0);
  assert.equal(await (await request('/get-session', null, freshCookie)).json(), null);
});
