import { readConfig } from './config.mjs';
import { createRuntime } from './runtime.mjs';
import { createApp } from './app.mjs';

const event = code => console.error(JSON.stringify({ event: code }));
const config = readConfig();
const runtime = await createRuntime(config, event);
const server = createApp({ config, runtime, event }).listen(config.port, '0.0.0.0', () => event(runtime ? 'AUTH_SERVICE_STARTED' : 'AUTH_SERVICE_INACTIVE'));
server.requestTimeout = 30000;
server.headersTimeout = 15000;
async function shutdown() {
  server.close(async () => { await runtime?.close(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
