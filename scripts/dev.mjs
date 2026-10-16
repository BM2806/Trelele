import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => args[args.indexOf(name) + 1] || fallback;
const host = args.includes('--host') ? option('--host', '0.0.0.0') : '0.0.0.0';
const port = Number(args.includes('--port') ? option('--port', '4173') : 4173);
const root = resolve('dist');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.mjs':'text/javascript', '.js':'text/javascript', '.json':'application/json', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.png':'image/png', '.ttf':'font/ttf', '.woff2':'font/woff2' };
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://preview.local').pathname);
    const file = resolve(root, '.' + (path.endsWith('/') ? path + 'index.html' : path));
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' }).end(content);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, host, () => console.log(`Preview ready on port ${port}`));
