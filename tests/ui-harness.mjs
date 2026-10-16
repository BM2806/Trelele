// Runs reviewed local distribution modules in an emulated DOM. No server/network/layout.
import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SourceTextModule } from 'node:vm';
import { Window } from 'happy-dom';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
export async function bootUI({ hash = '', beforeBoot } = {}) {
  const window = new Window({ url: `https://margem.test/${hash}`, settings: {
    disableCSSFileLoading: true, disableJavaScriptFileLoading: true, disableIframePageLoading: true,
  } });
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  window.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
  window.structuredClone = structuredClone;
  const modules = new Map();
  async function localFile(url) {
    if (url.protocol !== 'file:') throw Error(`Nonlocal module refused: ${url}`);
    const file = await realpath(fileURLToPath(url));
    if (!file.startsWith(root + sep) && !file.startsWith(root)) throw Error(`Outside distribution: ${file}`);
    return file;
  }
  async function load(url) {
    const file = await localFile(url);
    if (modules.has(file)) return modules.get(file);
    if (!file.endsWith('.mjs')) throw Error(`Unexpected executable type: ${file}`);
    const module = new SourceTextModule(await readFile(file, 'utf8'), {
      context: window, identifier: pathToFileURL(file).href,
      initializeImportMeta: meta => { meta.url = pathToFileURL(file).href; },
    });
    modules.set(file, module);
    await module.link((specifier, referencing) => {
      if (!specifier.startsWith('./') && !specifier.startsWith('../')) throw Error(`Nonlocal import refused: ${specifier}`);
      return load(new URL(specifier, referencing.identifier));
    });
    return module;
  }
  window.fetch = async input => {
    const url = new URL(String(input), window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.startsWith('/assets/')) throw Error(`Unexpected request: ${url}`);
    const file = await localFile(pathToFileURL(resolve(root, '.' + url.pathname)));
    const body = await readFile(file, 'utf8');
    return { ok: true, text: async () => body, json: async () => JSON.parse(body) };
  };
  const state = await load(pathToFileURL(resolve(root, 'ui/state.mjs')));
  await state.evaluate();
  if (beforeBoot) await beforeBoot(state.namespace);
  const script = [...html.matchAll(/<script\b[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*>/gi)][0]?.[1];
  if (!script) throw Error('Missing module entry in actual index.html');
  const entry = await load(new URL(script, pathToFileURL(resolve(root, 'index.html'))));
  await entry.evaluate();
  const query = selector => window.document.querySelector(selector);
  const settle = () => new Promise(resolve => setTimeout(resolve, 25));
  await settle();
  return {
    window, document: window.document, query, state: state.namespace, settle,
    click(selector) {
      const element = typeof selector === 'string' ? query(selector) : selector;
      if (!element) throw Error(`Missing control: ${selector}`);
      element.click(); return element;
    },
    submit(selector) {
      const form = query(selector);
      if (!form) throw Error(`Missing form: ${selector}`);
      form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    },
    pointer(element, type, properties = {}) {
      element.dispatchEvent(new window.PointerEvent(type, {
        bubbles: true, cancelable: true, isPrimary: true, pointerId: 1,
        pointerType: 'touch', button: 0, clientX: 100, clientY: 100, ...properties,
      }));
    },
    async back() {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(Error('Real history.back() did not emit popstate')), 500);
        window.addEventListener('popstate', () => { clearTimeout(timeout); resolve(); }, { once: true });
        window.history.back();
      });
      await settle();
    },
    async route(hash) {
      window.location.hash = hash;
      await settle();
    },
    close: () => window.happyDOM.close(),
  };
}
