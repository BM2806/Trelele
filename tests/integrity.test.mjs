// Integrity only: does not render assets or prove a visual layout.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const local=value=>value&&!value.includes('${')&&!/^(?:https?:|data:|#|mailto:)/.test(value);
const checked=new Set();
async function checkFile(file) {
  const target=resolve(file);
  assert.ok(target.startsWith(root.endsWith(sep)?root:root+sep),`Outside distribution: ${target}`);
  if(checked.has(target))return;
  checked.add(target);
  assert.ok((await stat(target)).isFile(),`Missing file: ${target}`);
  if(!/\.(?:html|css|mjs)$/.test(target))return;
  const source=await readFile(target,'utf8');
  const refs=[];
  if(target.endsWith('.html'))for(const match of source.matchAll(/(?:src|href)=["']([^"']+)["']/g))refs.push(match[1]);
  if(target.endsWith('.css'))for(const match of source.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g))refs.push(match[1]);
  if(target.endsWith('.mjs'))for(const match of source.matchAll(/from\s+["'](\.[^"']+)["']/g))refs.push(match[1]);
  for(const ref of refs.filter(local))await checkFile(resolve(dirname(target),ref.split(/[?#]/)[0]));
}
test('integrity: local HTML, stylesheet and module dependencies exist inside distribution',async()=>{
  await checkFile(resolve(root,'index.html'));
  assert.ok(checked.size>=4,'Dependency traversal must inspect the application, CSS and imported modules');
});

test('integrity: V3 font, icons and license files match recorded provenance hashes',async()=>{
  const folder=resolve(root,'assets/v3');
  const entries=JSON.parse(await readFile(resolve(folder,'PROVENANCE.json'),'utf8'));
  assert.ok(entries.some(item=>item.file.endsWith('.ttf')),'Font provenance missing');
  assert.ok(entries.some(item=>item.file==='PHOSPHOR-LICENSE.txt'),'Icon license missing');
  for(const entry of entries){
    assert.equal(resolve(folder,entry.file).startsWith(folder+sep),true);
    const data=await readFile(resolve(folder,entry.file));
    assert.equal(data.length,entry.bytes,`${entry.file}: size mismatch`);
    assert.equal(createHash('sha256').update(data).digest('hex'),entry.sha256,`${entry.file}: hash mismatch`);
    assert.ok(/^https:\/\/raw\.githubusercontent\.com\/(?:google\/fonts|phosphor-icons\/core)\//.test(entry.url),`${entry.file}: unexpected provenance source`);
  }
});
