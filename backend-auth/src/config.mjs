// Configuration only. No credentials are returned by public endpoints or logs.
const present = value => typeof value === 'string' && value.trim().length > 0;
const group = (env, keys) => keys.every(key => present(env[key]));
const googleKeys = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const appleKeys = ['APPLE_CLIENT_ID', 'APPLE_TEAM_ID', 'APPLE_KEY_ID', 'APPLE_PRIVATE_KEY'];
const emailKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'AUTH_EMAIL_FROM'];

export function readConfig(env = process.env) {
  const problems = [];
  const enabled = env.AUTH_ENABLED === 'true';
  let origin = null;
  try {
    const url = new URL(env.BETTER_AUTH_URL);
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error();
    origin = url.origin;
  } catch { problems.push('INVALID_AUTH_ORIGIN'); }
  if (!present(env.DATABASE_URL)) problems.push('MISSING_DATABASE');
  if (!present(env.BETTER_AUTH_SECRET) || env.BETTER_AUTH_SECRET.length < 32) problems.push('INVALID_AUTH_SECRET');
  const providers = {
    google: group(env, googleKeys),
    apple: group(env, appleKeys),
    emailOtp: group(env, emailKeys),
  };
  const smtpPort = Number(env.SMTP_PORT);
  if (providers.emailOtp && (![465, 587].includes(smtpPort) || /[\r\n]/.test(env.AUTH_EMAIL_FROM) || !/^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/.test(env.AUTH_EMAIL_FROM))) {
    providers.emailOtp = false;
    problems.push('INVALID_SMTP_CONFIG');
  }
  for (const [name, keys] of [['GOOGLE', googleKeys], ['APPLE', appleKeys], ['EMAIL', emailKeys]]) {
    if (keys.some(key => present(env[key])) && !group(env, keys)) problems.push(`INCOMPLETE_${name}_CONFIG`);
  }
  if (!Object.values(providers).some(Boolean)) problems.push('NO_AUTH_PROVIDER');
  return {
    enabled,
    configured: enabled && problems.length === 0,
    problems,
    origin,
    providers,
    secret: env.BETTER_AUTH_SECRET,
    databaseURL: env.DATABASE_URL,
    google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    apple: { clientId: env.APPLE_CLIENT_ID, teamId: env.APPLE_TEAM_ID, keyId: env.APPLE_KEY_ID, privateKey: env.APPLE_PRIVATE_KEY },
    smtp: { host: env.SMTP_HOST, port: smtpPort, user: env.SMTP_USER, pass: env.SMTP_PASS, from: env.AUTH_EMAIL_FROM },
    port: Number(env.PORT) || 8080,
  };
}

export function publicCapabilities(config, ready) {
  return {
    ready: Boolean(ready),
    providers: Object.fromEntries(Object.entries(config.providers).map(([key, value]) => [key, Boolean(ready && value)])),
    profilePersistence: Boolean(ready),
    privatePhotoStorage: false,
    socialNetwork: false,
  };
}
