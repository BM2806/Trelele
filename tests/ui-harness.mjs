// Executes the real application in an emulated DOM, without a browser, layout or network.
import { readFile } from 'node:fs/promises';
import { Window } from 'happy-dom';
import * as domain from '../dist/domain.mjs';
import * as interaction from '../dist/interaction.mjs';
import * as copy from '../dist/copy.mjs';

export async function bootUI() {
  const window = new Window({ url: 'https://margem.test/', settings: {
    disableCSSFileLoading: true, disableJavaScriptFileLoading: true, disableIframePageLoading: true,
  } });
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  // Script loading is disabled by supplying the document without script tags.
  window.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
  window.structuredClone = structuredClone; // Native browser API absent in happy-dom.
  window.__modules = { ...domain, ...interaction, ...copy, me: structuredClone(copy.me) };
  window.fetch = async (url) => {
    const relative = String(url).replace(/^\.\//, '');
    if (!relative.startsWith('assets/') || relative.includes('..')) throw Error('Unexpected test request');
    try {
      const body = await readFile(new URL(`../dist/${relative}`, import.meta.url), 'utf8');
      return { ok: true, json: async () => JSON.parse(body) };
    } catch { return { ok: false }; }
  };
  let source = await readFile(new URL('../dist/app.mjs', import.meta.url), 'utf8');
  source = source.replace(/import\s*\{([^}]+)\}\s*from\s*['"][^'"]+['"];?/g,
    (_, names) => `const {${names.replace(/\s+as\s+/g, ":")}} = window.__modules;`);
  window.eval(source);
  const query = (selector) => window.document.querySelector(selector);
  return {
    window, document: window.document, query,
    click(selector) {
      const element = query(selector);
      if (!element) throw Error(`Missing control: ${selector}`);
      element.click();
      return element;
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
    settle: () => new Promise(resolve => setTimeout(resolve, 360)),
    close: () => window.happyDOM.close(),
  };
}
