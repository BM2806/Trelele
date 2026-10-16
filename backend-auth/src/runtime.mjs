import pg from 'pg';
import { buildAuthOptions, createAuth } from './auth.mjs';
import { createOtpMailer } from './mailer.mjs';
import { createProfileRepository } from './profile.mjs';
import { assertSchema } from './schema.mjs';

export async function createRuntime(config, event = () => {}) {
  if (!config.configured) return null;
  const pool = new pg.Pool({ connectionString: config.databaseURL, max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000, statement_timeout: 10000 });
  pool.on('error', () => event('DATABASE_POOL_ERROR'));
  const mailer = config.providers.emailOtp ? createOtpMailer(config.smtp) : null;
  try {
    const options = buildAuthOptions(config, pool, mailer);
    await assertSchema(options, pool);
    const auth = createAuth(options);
    await auth.$context;
    return {
      auth,
      profiles: createProfileRepository(pool),
      async isReady() { await pool.query('SELECT 1'); return true; },
      async close() { mailer?.close(); await pool.end(); },
    };
  } catch {
    mailer?.close(); await pool.end(); event('AUTH_STARTUP_UNAVAILABLE'); return null;
  }
}
