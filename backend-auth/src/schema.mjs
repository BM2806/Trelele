import { getMigrations } from 'better-auth/db/migration';

export const profileDDL = `CREATE TABLE IF NOT EXISTS trelele_profile (
  user_id text PRIMARY KEY REFERENCES "user" (id) ON DELETE CASCADE,
  metadata jsonb NOT NULL CHECK (jsonb_typeof(metadata) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
)`;

export async function authSchemaPlan(options) {
  return getMigrations(options, { throwOnUnsafe: false });
}
export function hasPendingAuthSchema(plan) {
  return Boolean(plan.toBeCreated.length || plan.toBeAdded.length || plan.toBeAddedIndexes.length || plan.unsafeChanges.length || plan.schemaProblems.length);
}
export async function assertSchema(options, pool) {
  const plan = await authSchemaPlan(options);
  if (hasPendingAuthSchema(plan)) throw new Error('AUTH_SCHEMA_NOT_READY');
  await pool.query('SELECT user_id, metadata, updated_at FROM trelele_profile LIMIT 0');
  const { rows } = await pool.query(`SELECT 1 FROM pg_constraint
    WHERE conrelid = 'trelele_profile'::regclass AND confrelid = '"user"'::regclass
      AND contype = 'f' AND confdeltype = 'c'`);
  if (!rows.length) throw new Error('PROFILE_DELETE_CASCADE_REQUIRED');
}
