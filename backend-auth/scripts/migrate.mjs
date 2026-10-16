// Explicit operator action only. Never run automatically on server startup.
import pg from 'pg';
import { readConfig } from '../src/config.mjs';
import { buildAuthOptions } from '../src/auth.mjs';
import { authSchemaPlan, profileDDL, assertSchema } from '../src/schema.mjs';

const config = readConfig();
if (!config.configured) {
  console.error('AUTH_CONFIG_INCOMPLETE');
  process.exitCode = 1;
} else {
  const pool = new pg.Pool({ connectionString: config.databaseURL, max: 1, connectionTimeoutMillis: 5000 });
  try {
    const options = buildAuthOptions(config, pool, { send() { throw new Error('MIGRATION_CANNOT_SEND_MAIL'); } });
    const plan = await authSchemaPlan(options);
    if (plan.unsafeChanges.length || plan.schemaProblems.length) throw new Error('UNSAFE_MIGRATION');
    if (process.argv.includes('--apply')) {
      await plan.runMigrations();
      await pool.query(profileDDL);
      await assertSchema(options, pool);
      console.log('MIGRATIONS_APPLIED');
    } else {
      console.log(await plan.compileMigrations());
      console.log(`${profileDDL};`);
    }
  } catch { console.error('MIGRATION_FAILED'); process.exitCode = 1; }
  finally { await pool.end(); }
}
