import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { bootUI } from './ui-harness.mjs';

const withUI = (fn, options) => async t => {
  const ui = await bootUI(options); t.after(() => ui.close()); await fn(ui);
};
const action = (name, id) => `[data-action="${name}"]${id ? `[data-id="${id}"]` : ''}`;
const tap = async (ui, selector) => { ui.click(selector); await ui.settle(); };
const card = ui => ui.query('.opinion-card')?.dataset.person;
const portraits = ui => ui.document.querySelectorAll('.portrait[role="img"]').length;
const screen = ui => ui.query('#main').dataset.screen;
const openLia = async ui => { await tap(ui, '[data-view="chat"]'); await tap(ui, action('open-chat','lia')); assert.equal(ui.window.location.hash,'#chat/lia'); };
const demo = async (ui,kind) => { await tap(ui,action('project')); await tap(ui,action(`simulate-${kind}`)); await tap(ui,'#dialog [data-action="close"]'); };
function stage(ui) {
  const node=ui.query('.book-stage');
  assert.ok(node,'Discovery must offer the book interaction surface');
  node.getBoundingClientRect=ui.query('.opinion-card').getBoundingClientRect=()=>({left:0,top:0,width:390,height:550,right:390,bottom:550});
  return node;
}
function gesture(ui,{dx=145,dy=0,cancel=false,secondary=false}={}) {
  const node=stage(ui);ui.pointer(node,'pointerdown');
  if(secondary)ui.pointer(node,'pointerdown',{pointerId:2,isPrimary:false,clientX:300});
  ui.pointer(node,'pointermove',{clientX:100+dx,clientY:100+dy});
  ui.pointer(node,cancel?'pointercancel':'pointerup',{clientX:100+dx,clientY:100+dy});
  return node;
}

test('V5 journey: board → same person → inline opinion → same board, match → intended chat',withUI(async ui=>{
  await tap(ui,'[data-action="discovery-mode"][data-mode="nearby"]');
  ui.query('#main').scrollTop=125;
  assert.equal(portraits(ui),0); await tap(ui,action('person','ana'));
  assert.equal(ui.window.location.hash,'#people/ana');assert.equal(ui.query('#main').dataset.person,'ana');
  const depth=ui.window.history.length;
  await tap(ui,'.profile-shelf [data-action="book"]');
  assert.ok(ui.query('.inline-opinion:not([hidden])'));assert.equal(ui.window.history.length,depth);
  await tap(ui,'.profile-shelf [data-action="book"]');assert.equal(ui.query('.inline-opinion:not([hidden])'),null);
  await tap(ui,action('back'));assert.equal(ui.window.location.hash,'#discover/nearby');assert.equal(ui.query('#main').scrollTop,125);
  await tap(ui,action('person','ana'));await tap(ui,'.profile-actions [data-action="like"]');
  assert.match(ui.query('#dialog').textContent,/match/i);assert.equal(portraits(ui),0);
  await tap(ui,'#dialog [data-action="match-chat"]');assert.equal(ui.window.location.hash,'#chat/ana');assert.equal(portraits(ui),0);
  ui.query('#message').value='Oi, Ana!';ui.submit('[data-form="chat"]');await ui.settle();
  assert.match(ui.query('.messages').textContent,/Oi, Ana!/);
  await tap(ui,action('back'));assert.ok(ui.query('.conversation-list [data-id="ana"]'));assert.equal(ui.query('.new-connections [data-id="ana"]'),null);
}));

test('V5 journey: card book survives profile and Back; Passar commits one decision and cannot revive via Back',withUI(async ui=>{
  await tap(ui,'[data-action="discovery-mode"][data-mode="for-you"]');
  await tap(ui,'[data-action="book-index"][data-index="2"]');assert.equal(card(ui),'ana');assert.equal(ui.state.session.books.ana,2);
  await tap(ui,'.opinion-card [data-action="person"]');await ui.back();
  assert.equal(card(ui),'ana');assert.equal(ui.state.session.books.ana,2);
  await tap(ui,'.opinion-card [data-action="person"]');await tap(ui,'.profile-actions [data-action="pass"]');
  assert.equal(card(ui),'davi');assert.equal(ui.state.session.decisions.length,1);
  await ui.back();assert.notEqual(ui.query('#main').dataset.person,'ana');assert.equal(ui.state.session.decisions.length,1);
}));

test('V5 journey: inbox → Lia → draft and reading position survive profile/opinion and inbox detours',withUI(async ui=>{
  await openLia(ui);const log=ui.query('.messages');log.scrollTop=90;
  ui.query('#message').value='Rascunho para Lia';ui.query('#message').dispatchEvent(new ui.window.Event('input',{bubbles:true}));
  await tap(ui,'.thread-person');assert.equal(ui.window.location.hash,'#people/lia');assert.equal(portraits(ui),0);
  await tap(ui,'.profile-shelf [data-action="book"]');await tap(ui,action('back'));
  assert.equal(ui.window.location.hash,'#chat/lia');assert.equal(ui.query('#message').value,'Rascunho para Lia');assert.equal(ui.query('.messages').scrollTop,90);
  await tap(ui,action('back'));await tap(ui,action('open-chat','lia'));
  assert.equal(ui.query('#message').value,'Rascunho para Lia');assert.equal(ui.query('.messages').scrollTop,90);
  ui.submit('[data-form="chat"]');await ui.settle();assert.equal(ui.query('#message').value,'');
}));

test('V5 gestures: tap changes book only; swipe and repeated pointerup/click commit once',withUI(async ui=>{
  await tap(ui,'[data-action="discovery-mode"][data-mode="for-you"]');
  let node=stage(ui);ui.pointer(node,'pointerdown',{clientX:300});ui.pointer(node,'pointerup',{clientX:300});node.dispatchEvent(new ui.window.MouseEvent('click',{bubbles:true,cancelable:true,detail:1}));await ui.settle();
  assert.equal(card(ui),'ana');assert.equal(ui.state.session.books.ana,1);assert.equal(ui.state.session.decisions.length,0);
  node=gesture(ui,{secondary:true});await ui.settle();ui.pointer(node,'pointerup',{clientX:245});
  node.dispatchEvent(new ui.window.MouseEvent('click',{bubbles:true,cancelable:true,detail:1}));await ui.settle();
  assert.equal(ui.state.session.decisions.length,1);assert.equal(ui.state.match('ana').status,'ACTIVE');
  assert.equal(ui.state.session.domain.matches.filter(m=>m.users.includes('ana')).length,1);
}));

test('V5 gestures: scroll, small drag, cancellation and loss of capture cannot decide',withUI(async ui=>{
  await tap(ui,'[data-action="discovery-mode"][data-mode="for-you"]');
  for(const options of [{dx:20,dy:150},{dx:30},{cancel:true}]){gesture(ui,options);await ui.settle();assert.equal(card(ui),'ana');}
  const node=stage(ui);ui.pointer(node,'pointerdown');ui.pointer(node,'pointermove',{clientX:260});ui.pointer(node,'lostpointercapture');ui.pointer(node,'pointerup',{clientX:260});
  await ui.settle();assert.equal(ui.state.session.decisions.length,0);assert.equal(card(ui),'ana');
}));

test('V5 disclosure: eligibility plus both consents, revoke unilateral, version invalidation',withUI(async ui=>{
  await openLia(ui);assert.equal(portraits(ui),0);assert.equal(ui.query(action('consent')),null);
  await demo(ui,'consent');assert.equal(portraits(ui),0);assert.equal(ui.state.reveal('lia').status,'LOCKED');
  await demo(ui,'time');await tap(ui,action('consent'));assert.equal(portraits(ui),0);
  await tap(ui,action('revoke'));await demo(ui,'consent');assert.equal(portraits(ui),0);assert.equal(ui.state.reveal('lia').ownConsent,false);
  await tap(ui,action('consent'));assert.equal(portraits(ui),2);
  await demo(ui,'photo');assert.equal(portraits(ui),0);assert.equal(ui.state.match('lia').consents.length,0);
  await tap(ui,action('consent'));await demo(ui,'consent');assert.equal(portraits(ui),2);
  await tap(ui,action('revoke'));assert.equal(portraits(ui),0);
}));

for(const kind of ['block','unmatch'])test(`V5 safety: ${kind} invalidates old chat/person history and direct links`,withUI(async ui=>{
  await openLia(ui);await demo(ui,'time');await tap(ui,action('consent'));await demo(ui,'consent');assert.equal(portraits(ui),2);
  await tap(ui,'.thread-person');await tap(ui,action('safety','lia'));await tap(ui,action(kind));await tap(ui,`[data-action="confirm"][data-kind="${kind}"]`);
  assert.equal(ui.state.available('lia'),false);assert.equal(portraits(ui),0);
  await ui.route('#chat/lia');assert.equal(ui.query('.thread'),null);assert.equal(portraits(ui),0);
  await ui.route('#people/lia');assert.notEqual(screen(ui),'people');assert.equal(portraits(ui),0);
  await ui.back();assert.equal(ui.query('.thread'),null);assert.equal(portraits(ui),0);
}));

test('V5 XSS: message payload stays literal across thread and inbox',withUI(async ui=>{
  await openLia(ui);const payload='<img src=x onerror="window.pwned=1"> & “Oi”';
  ui.query('#message').value=payload;ui.submit('[data-form="chat"]');await ui.settle();
  assert.equal([...ui.document.querySelectorAll('.message.own p')].at(-1).textContent,payload);
  assert.equal(ui.query('img[onerror]'),null);await tap(ui,action('back'));assert.ok(ui.query('.conversation-list').textContent.includes(payload));assert.equal(ui.query('img[onerror]'),null);assert.equal(ui.window.pwned,undefined);
}));

test('V5 routes: unknown and encoded injection identifiers fail closed',withUI(async ui=>{
  for(const route of ['#chat/ana','#chat/%3Cimg%20src=x%20onerror=alert(1)%3E','#people/__proto__','#people/%22%3E%3Cimg%20onerror=x%3E']){
    await ui.route(route);assert.equal(ui.query('.thread'),null);assert.notEqual(screen(ui),'people');assert.equal(ui.query('img[onerror]'),null);assert.equal(portraits(ui),0);
  }
}));

test('V5 runtime assets: all rendered local covers resolve to nonempty image files',withUI(async ui=>{
  const urls=new Set([...ui.document.querySelectorAll('img')].map(img=>img.getAttribute('src')));
  await tap(ui,'[data-view="profile"]');await tap(ui,action('edit-mode'));
  for(const img of ui.document.querySelectorAll('img'))urls.add(img.getAttribute('src'));
  assert.ok(urls.size>=5);
  for(const source of urls){assert.ok(source.startsWith('./assets/'));const path=resolve('dist',source);assert.ok((await stat(path)).size>100);const data=await readFile(path);assert.ok(data[0]===0xff || data.subarray(0,8).toString('hex')==='89504e470d0a1a0a','Cover must be an image, not a successful HTML fallback');}
}));

test('V5 gestures: left swipe advances once and explicit undo restores only the passed person',withUI(async ui=>{
  await tap(ui,'[data-action="discovery-mode"][data-mode="for-you"]');
  const node=gesture(ui,{dx:-145});await ui.settle();
  ui.pointer(node,'pointerup',{clientX:-45});await ui.settle();
  assert.equal(card(ui),'davi');assert.equal(ui.state.session.decisions.length,1);assert.equal(ui.state.match('ana'),null);
  // The app deliberately suppresses the native click emitted after a swipe.
  await new Promise(resolve=>setTimeout(resolve,360));await tap(ui,action('rewind'));
  assert.equal(card(ui),'ana');assert.equal(ui.state.session.decisions.length,0);
}));

test('V5 XSS: editable own profile name and bio stay text, including modal re-open',withUI(async ui=>{
  await tap(ui,'[data-view="profile"]');await tap(ui,action('edit-mode'));await tap(ui,action('edit-bio'));
  const name='<img src=x onerror="pwned=1">',bio='</textarea><svg onload="pwned=2">texto & aspas';
  ui.query('[name="name"]').value=name;ui.query('[name="bio"]').value=bio;
  ui.submit('[data-form="bio"]');await ui.settle();await tap(ui,action('back'));
  assert.ok(ui.query('#main').textContent.includes(name));assert.ok(ui.query('#main').textContent.includes(bio));assert.equal(ui.query('[onload],[onerror]'),null);
  await tap(ui,action('edit-mode'));await tap(ui,action('edit-bio'));
  assert.equal(ui.query('[name="name"]').value,name);assert.equal(ui.query('[name="bio"]').value,bio);assert.equal(ui.query('[onload],[onerror]'),null);
}));

test('V5 router: closing a sheet and immediately selecting a root cannot be overwritten by late Back',withUI(async ui=>{
  ui.click(action('filters'));ui.click('#dialog [data-action="close"]');ui.click('[data-view="profile"]');await ui.settle();
  assert.equal(ui.window.location.hash,'#profile');assert.equal(screen(ui),'profile');assert.equal(ui.query('#dialog').open,false);
}));

test('V5 router: revocation remains effective after a real history detour',withUI(async ui=>{
  await openLia(ui);await demo(ui,'time');await tap(ui,action('consent'));await demo(ui,'consent');assert.equal(portraits(ui),2);
  await tap(ui,action('revoke'));await tap(ui,'.thread-person');await ui.back();
  assert.equal(ui.window.location.hash,'#chat/lia');assert.equal(portraits(ui),0);assert.equal(ui.state.reveal('lia').ownConsent,false);
}));
