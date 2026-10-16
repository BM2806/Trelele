import express from 'express';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { publicCapabilities } from './config.mjs';
import { validateProfile } from './profile.mjs';

export function createApp({ config, runtime, event = () => {} }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', false);
  app.use((req, res, next) => {
    req.headers['x-trelele-peer-ip'] = req.socket.remoteAddress;
    if (config.origin) {
      req.headers.host = new URL(config.origin).host;
      req.headers['x-forwarded-proto'] = 'https';
      delete req.headers[':authority'];
    }
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
    next();
  });
  app.get('/health', (_req, res) => res.json({ ok: true }));
  async function ready() {
    if (!config.configured || !runtime) return false;
    try { return Boolean(await runtime.isReady()); } catch { return false; }
  }
  app.get('/api/auth-status', async (_req, res) => {
    const active = await ready();
    res.status(active ? 200 : 503).json(publicCapabilities(config, active));
  });
  const requireReady = async (_req, res, next) => {
    if (!await ready()) return res.status(503).json({ error: 'AUTH_UNAVAILABLE' });
    next();
  };
  // Bound bytes before the official adapter, including chunked bodies. Its supported
  // pre-parsed string path preserves JSON and Apple's form POST verbatim (no JSON parser).
  app.use('/api/auth', requireReady);
  app.use('/api/auth', express.raw({ type: () => true, limit: '16kb', inflate: false }), (req, _res, next) => {
    if (Buffer.isBuffer(req.body)) req.body = req.body.toString('utf8');
    next();
  });
  app.all('/api/auth/*splat', (req, res, next) => {
    Promise.resolve(toNodeHandler(runtime.auth)(req, res)).catch(next);
  });
  app.use('/api/profile', requireReady);
  app.use('/api/profile', async (req, res, next) => {
    try {
      const session = await runtime.auth.api.getSession({ headers: fromNodeHeaders(req.headers), query: { disableCookieCache: true } });
      if (!session?.user?.id) return res.status(401).json({ error: 'UNAUTHENTICATED' });
      req.ownerId = session.user.id;
      next();
    } catch { res.status(503).json({ error: 'SESSION_UNAVAILABLE' }); }
  });
  app.get('/api/profile', async (req, res, next) => {
    try { res.json({ profile: await runtime.profiles.get(req.ownerId), metadataOnly: true, photosSupported: false }); } catch (error) { next(error); }
  });
  app.put('/api/profile', (req, res, next) => {
    // Custom API has the same strict-origin requirement; cookies alone never authorize writes.
    if (req.headers.origin !== config.origin) return res.status(403).json({ error: 'ORIGIN_NOT_ALLOWED' });
    if (!req.is('application/json')) return res.status(415).json({ error: 'JSON_REQUIRED' });
    next();
  }, express.json({ limit: '16kb', strict: true }), async (req, res, next) => {
    let metadata;
    try { metadata = validateProfile(req.body); } catch { return res.status(400).json({ error: 'INVALID_PROFILE' }); }
    try { res.json({ profile: await runtime.profiles.put(req.ownerId, metadata), metadataOnly: true, photosSupported: false }); } catch (error) { next(error); }
  });
  app.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND' }));
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'PAYLOAD_TOO_LARGE' });
    if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'INVALID_JSON' });
    if (error.type === 'encoding.unsupported') return res.status(415).json({ error: 'CONTENT_ENCODING_NOT_SUPPORTED' });
    event('REQUEST_FAILED');
    res.status(500).json({ error: 'REQUEST_FAILED' });
  });
  return app;
}
