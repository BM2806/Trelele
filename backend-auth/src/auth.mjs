import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { importPKCS8, SignJWT } from 'jose';

export function buildAuthOptions(config, pool, mailer) {
  const socialProviders = {};
  if (config.providers.google) socialProviders.google = { ...config.google, mapProfileToUser: () => ({ image: null }) };
  if (config.providers.apple) socialProviders.apple = async () => {
    const key = await importPKCS8(config.apple.privateKey.replace(/\\n/g, '\n'), 'ES256');
    const now = Math.floor(Date.now() / 1000);
    const clientSecret = await new SignJWT({})
      .setProtectedHeader({ alg: 'ES256', kid: config.apple.keyId })
      .setIssuer(config.apple.teamId).setSubject(config.apple.clientId)
      .setAudience('https://appleid.apple.com').setIssuedAt(now)
      .setExpirationTime(now + 60 * 60).sign(key);
    return { clientId: config.apple.clientId, clientSecret, mapProfileToUser: () => ({ image: null }) };
  };
  return {
    appName: 'Trelelê', baseURL: config.origin, basePath: '/api/auth',
    secret: config.secret, database: pool,
    trustedOrigins: [config.origin, ...(config.providers.apple ? ['https://appleid.apple.com'] : [])],
    socialProviders,
    emailAndPassword: { enabled: false },
    account: { accountLinking: { enabled: false }, encryptOAuthTokens: true, storeStateStrategy: 'database', skipStateCookieCheck: false },
    session: { freshAge: 300, cookieCache: { enabled: false } },
    user: { deleteUser: { enabled: true } },
    // No raw provider/session errors are logged: callers emit only fixed event codes.
    logger: { disabled: true },
    advanced: {
      useSecureCookies: true,
      disableCSRFCheck: false, disableOriginCheck: false,
      defaultCookieAttributes: { secure: true, httpOnly: true, sameSite: 'lax' },
      // Express overwrites this header with the actual TCP peer on every request.
      // Behind an unconfigured proxy the bucket is shared (conservative), not spoofable.
      ipAddress: { ipAddressHeaders: ['x-trelele-peer-ip'] },
    },
    rateLimit: {
      enabled: true, storage: 'database', window: 60, max: 60,
      customRules: {
        '/email-otp/send-verification-otp': { window: 60, max: 3 },
        '/sign-in/email-otp': { window: 60, max: 5 },
        '/delete-user': { window: 60, max: 3 },
      },
    },
    plugins: config.providers.emailOtp ? [emailOTP({
      otpLength: 6, expiresIn: 300, allowedAttempts: 3,
      storeOTP: 'hashed', resendStrategy: 'rotate',
      rateLimit: { window: 60, max: 3 },
      sendVerificationOTP: data => mailer.send(data),
    })] : [],
  };
}

export function createAuth(options) { return betterAuth(options); }
