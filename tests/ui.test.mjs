import test from 'node:test';
import assert from 'node:assert/strict';
import { bootUI } from './ui-harness.mjs';
import { seedChat } from '../dist/copy.mjs';

const withUI = fn => async t => { const ui = await bootUI();t.after(()=>ui.close());await fn(ui); };
const cardID = ui => ui.query('.swipe-card')?.dataset.person;
function editProfile(ui) {
  ui.click('[data-view="profile"]');
  if(ui.query('[data-action="edit-mode"]'))ui.click('[data-action="edit-mode"]');
}
function demo(ui,action) {
  ui.click('[data-action="project"]');
  ui.click(`[data-action="${action}"]`);
}
const portraits = ui => ui.document.querySelectorAll('svg[aria-label="Retrato ilustrativo de personagem fictício"]').length;
function mediaGeometry(ui) {
  const media=ui.query('.card-media'), card=ui.query('.swipe-card');
  const rect=()=>({left:0,top:0,width:390,height:550,right:390,bottom:550});
  media.getBoundingClientRect=card.getBoundingClientRect=rect;
  Object.defineProperty(media,'clientWidth',{value:390});
  return {media,card};
}
function gesture(ui,{dx=140,dy=0,cancel=false}={}) {
  const {media,card}=mediaGeometry(ui);
  ui.pointer(media,'pointerdown');
  ui.pointer(media,'pointermove',{clientX:100+dx,clientY:100+dy});
  ui.pointer(media,cancel?'pointercancel':'pointerup',{clientX:100+dx,clientY:100+dy});
  return {media,card};
}

test('DOM: pass advances to exactly the next person and undo restores that person',withUI(ui=>{
  assert.equal(cardID(ui),'ana');ui.click('[data-action="pass"]');assert.equal(cardID(ui),'davi');
  ui.click('[data-action="rewind"]');assert.equal(cardID(ui),'ana');
}));
test('DOM: mutual like opens match overlay and undo cannot silently remove generated match',withUI(ui=>{
  ui.click('[data-action="like"]');assert.equal(ui.query('#dialog-title').textContent,'Deu match!');
  ui.click('[data-action="close"]');ui.click('[data-action="rewind"]');assert.equal(cardID(ui),'davi');
  ui.click('[data-view="chat"]');assert.match(ui.query('.new-matches').textContent,/Ana/);
  assert.equal(ui.document.querySelectorAll('.new-matches button[data-id="ana"]').length,1);
  assert.equal(ui.query('.chat-row[data-id="ana"]'),null);
}));
test('DOM: inbox has new matches and list; opening row selects the intended conversation',withUI(ui=>{
  ui.click('[data-view="chat"]');assert.doesNotMatch(ui.query('.new-matches').textContent,/Lia/);
  assert.ok(ui.query('.chat-list').textContent.includes(seedChat.at(-1).text));
  ui.click('.chat-row[data-id="lia"]');assert.match(ui.query('.thread-person').textContent,/Lia/);
  ui.click('[data-action="inbox"]');assert.ok(ui.query('.new-matches'));
}));
test('DOM: message HTML remains text and never creates attacker markup',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');
  const payload='<img src=x onerror="window.pwned=1"> & “Oi”';ui.query('#message').value=payload;ui.submit('[data-form="chat"]');
  assert.equal(ui.document.querySelector('.message.own:last-of-type p')?.textContent??ui.document.querySelectorAll('.message.own p').item(1)?.textContent,payload);
  assert.equal(ui.query('.messages img[onerror]'),null);assert.equal(ui.window.pwned,undefined);
}));
test('DOM: disclosure requires eligibility and both consents, then revocation hides portraits',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');assert.equal(portraits(ui),0);
  demo(ui,'simulate-consent');assert.equal(portraits(ui),0);
  demo(ui,'simulate-conversation');ui.click('[data-action="consent"]');assert.equal(portraits(ui),0);
  demo(ui,'simulate-consent');assert.equal(portraits(ui),2);
  ui.click('[data-action="revoke"]');assert.equal(portraits(ui),0);
}));
test('DOM: photo version change withdraws both consents',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');demo(ui,'simulate-conversation');
  ui.click('[data-action="consent"]');demo(ui,'simulate-consent');assert.equal(portraits(ui),2);
  demo(ui,'change-photo');assert.equal(portraits(ui),0);assert.equal(ui.query('[data-action="consent"]').disabled,false);
}));
test('DOM: ended connection can still be reported without reopening its conversation',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');ui.click('[data-action="safety"]');
  ui.click('[data-action="confirm-unmatch"]');ui.click('[data-action="unmatch"]');assert.equal(ui.query('.chat-row[data-id="lia"]'),null);
  editProfile(ui);ui.click('[data-action="reports"]');ui.click('[data-action="report"][data-id="lia"]');
  ui.submit('[data-form="report"]');assert.equal(ui.query('.chat-row[data-id="lia"]'),null);
  editProfile(ui);ui.click('[data-action="reports"]');assert.match(ui.query('#dialog-content').textContent,/Lia.*Pressão para revelar/);
}));
test('DOM: edit sheet saves to preview and cancel leaves saved data intact',withUI(ui=>{
  editProfile(ui);ui.click('[data-action="edit-bio"]');ui.query('#name').value='Nome de teste';ui.query('#bio').value='<b>Uma leitura</b>';ui.submit('[data-form="profile"]');
  ui.click('[data-action="preview-mode"]');assert.match(ui.query('.preview-card').textContent,/Nome de teste/);assert.match(ui.query('.preview-card').textContent,/<b>Uma leitura<\/b>/);assert.equal(ui.query('.preview-card b'),null);
  ui.click('[data-action="edit-mode"]');ui.click('[data-action="edit-bio"]');ui.query('#name').value='Não salvar';ui.click('[data-action="close"]');ui.click('[data-action="preview-mode"]');assert.match(ui.query('.preview-card').textContent,/Nome de teste/);
}));
test('DOM: changing books recomputes shared-book count in discovery',withUI(ui=>{
  assert.match(ui.query('.affinity-chip').textContent,/2 livros/);editProfile(ui);
  ui.click('[data-action="toggle-book"][data-id="estrela"]');ui.click('[data-action="toggle-book"][data-id="torto"]');
  ui.click('[data-view="discover"]');assert.match(ui.query('.affinity-chip').textContent,/0 livros/);
}));
test('DOM: tap changes book, never person; native click following tap is suppressed',withUI(ui=>{
  const {media}=mediaGeometry(ui);ui.pointer(media,'pointerdown',{clientX:300});ui.pointer(media,'pointerup',{clientX:300});
  assert.equal(cardID(ui),'ana');assert.equal(ui.query('.book-counter').textContent,'2 de 3');
  ui.query('[data-action="like"]').dispatchEvent(new ui.window.MouseEvent('click',{bubbles:true,cancelable:true,detail:1}));assert.equal(cardID(ui),'ana');
}));
test('DOM: horizontal swipe commits once even if pointerup and click are repeated',withUI(ui=>{
  const {media}=gesture(ui);assert.equal(cardID(ui),'davi');assert.equal(ui.query('#dialog-title').textContent,'Deu match!');
  ui.pointer(media,'pointerup',{clientX:240});
  ui.query('#dialog').dispatchEvent(new ui.window.MouseEvent('click',{bubbles:true,cancelable:true,detail:1}));
  assert.equal(cardID(ui),'davi');ui.click('[data-action="close"]');ui.click('[data-view="chat"]');assert.equal(ui.document.querySelectorAll('.new-matches button[data-id="ana"]').length,1);
  assert.equal(ui.query('.chat-row[data-id="ana"]'),null);
}));
test('DOM: vertical scroll, short drag and pointer cancellation do not decide a profile',withUI(ui=>{
  gesture(ui,{dx:20,dy:150});assert.equal(cardID(ui),'ana');
  gesture(ui,{dx:30,dy:0});assert.equal(cardID(ui),'ana');
  gesture(ui,{dx:160,dy:0,cancel:true});assert.equal(cardID(ui),'ana');assert.equal(ui.query('#dialog').open,false);
}));
test('DOM: pointer sequence on a card control does not become a swipe',withUI(ui=>{
  const target=ui.query('[data-action="book-index"]');ui.pointer(target,'pointerdown');ui.pointer(target,'pointermove',{clientX:300});ui.pointer(target,'pointerup',{clientX:300});
  assert.equal(cardID(ui),'ana');assert.equal(ui.query('#dialog').open,false);
}));
test('DOM: loss of pointer capture cancels the pending swipe',withUI(ui=>{
  const {media}=mediaGeometry(ui);ui.pointer(media,'pointerdown');ui.pointer(media,'pointermove',{clientX:260});
  ui.pointer(media,'lostpointercapture',{clientX:260});ui.pointer(media,'pointerup',{clientX:260});
  assert.equal(cardID(ui),'ana');assert.equal(ui.query('#dialog').open,false);
}));
test('DOM: setting sheet stages selection, cancel discards and Concluir applies to preview',withUI(ui=>{
  editProfile(ui);ui.click('[data-action="select-setting"][data-key="relationship"]');
  ui.click('[data-action="set-setting"][data-value="Não monogamia ética"]');
  assert.equal(ui.query('[data-action="set-setting"][data-value="Não monogamia ética"]').getAttribute('aria-pressed'),'true');
  ui.click('[data-action="close"]');assert.match(ui.query('[data-action="select-setting"][data-key="relationship"]').textContent,/Monogamia/);
  ui.click('[data-action="select-setting"][data-key="relationship"]');ui.click('[data-action="set-setting"][data-value="Não monogamia ética"]');ui.click('[data-action="apply-setting"]');
  ui.click('[data-action="preview-mode"]');assert.match(ui.query('.preview-card').textContent,/Não monogamia ética/);
}));
test('DOM: message draft survives inbox navigation and clears only after successful send',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');ui.query('#message').value='Rascunho com acentuação';
  ui.query('#message').dispatchEvent(new ui.window.Event('input',{bubbles:true}));ui.click('[data-action="inbox"]');ui.click('.chat-row[data-id="lia"]');
  assert.equal(ui.query('#message').value,'Rascunho com acentuação');ui.submit('[data-form="chat"]');assert.equal(ui.query('#message').value,'');
  assert.match(ui.query('.messages').textContent,/Rascunho com acentuação/);
}));
test('DOM: left swipe passes once, secondary pointer cannot replace active gesture',withUI(ui=>{
  const {media}=mediaGeometry(ui);ui.pointer(media,'pointerdown');ui.pointer(media,'pointerdown',{pointerId:2,isPrimary:false,clientX:200});
  ui.pointer(media,'pointermove',{clientX:-50});ui.pointer(media,'pointerup',{clientX:-50});assert.equal(cardID(ui),'davi');
  ui.click('[data-action="rewind"]');assert.equal(cardID(ui),'ana');
}));
test('DOM: invalid filter range shows an error and keeps the dialog open',withUI(ui=>{
  ui.click('[data-action="filters"]');ui.query('#min-age').value='50';ui.query('#max-age').value='20';ui.submit('[data-form="filters"]');
  assert.equal(ui.query('#dialog').open,true);assert.match(ui.query('#filter-error').textContent,/mínima/);
  ui.query('#min-age').value='18';ui.query('#max-age').value='65';ui.submit('[data-form="filters"]');assert.equal(ui.query('#dialog').open,false);assert.equal(cardID(ui),'ana');
}));
test('DOM: blocking after reveal removes thread and later report is still available',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');demo(ui,'simulate-conversation');ui.click('[data-action="consent"]');demo(ui,'simulate-consent');assert.equal(portraits(ui),2);
  ui.click('[data-action="safety"]');ui.click('[data-action="confirm-block"]');ui.click('[data-action="block"]');assert.equal(portraits(ui),0);assert.equal(ui.query('.chat-row[data-id="lia"]'),null);
  editProfile(ui);ui.click('[data-action="reports"]');assert.ok(ui.query('[data-action="report"][data-id="lia"]'));
}));
test('DOM: V3 opens a focused app and hides global navigation inside a thread',withUI(ui=>{
  assert.ok(ui.query('.swipe-card'));
  assert.equal(ui.query('.hero,.plans-layout,.studio-intro'),null);
  assert.equal(ui.query('.demo-controls'),null);
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');
  assert.equal(ui.window.location.hash,'#chat/lia');
  assert.equal(ui.query('#nav').hidden,true);assert.equal(ui.query('.topbar').hidden,true);
  assert.equal(ui.query('.demo-controls'),null);
  assert.equal(ui.query('.messages').textContent.includes('${'),false);
  ui.click('[data-action="inbox"]');assert.equal(ui.window.location.hash,'#chat');assert.ok(ui.query('.chat-list'));
  assert.equal(ui.query('#nav').hidden,false);assert.equal(ui.query('.topbar').hidden,false);
}));
test('DOM: V3 contextual simulated replies are varied and do not fill the chat with controls',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');
  demo(ui,'simulate-reply');const first=[...ui.document.querySelectorAll('.message:not(.own) p')].at(-1).textContent;
  demo(ui,'simulate-reply');const second=[...ui.document.querySelectorAll('.message:not(.own) p')].at(-1).textContent;
  assert.notEqual(first,second);assert.equal(ui.query('.messages .demo-controls'),null);
  demo(ui,'simulate-conversation');assert.equal(ui.query('.messages').textContent.includes('${'),false);
}));
test('DOM: direct hash to an ended conversation falls back to inbox without resurrecting it',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');ui.click('[data-action="safety"]');
  ui.click('[data-action="confirm-unmatch"]');ui.click('[data-action="unmatch"]');
  ui.window.history.replaceState(null,'','#chat/lia');ui.window.dispatchEvent(new ui.window.PopStateEvent('popstate'));
  assert.equal(ui.query('.thread'),null);assert.ok(ui.query('.chat-list'));assert.equal(ui.query('.chat-row[data-id="lia"]'),null);
}));
test('DOM: unilateral consent can be withdrawn before the other participant accepts',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');demo(ui,'simulate-conversation');
  ui.click('[data-action="consent"]');assert.equal(portraits(ui),0);
  ui.click('[data-action="revoke"]');demo(ui,'simulate-consent');assert.equal(portraits(ui),0);
  assert.equal(ui.query('[data-action="consent"]').disabled,false);
}));
test('DOM: book opinion expands and collapses inline without leaving the person',withUI(ui=>{
  ui.click('[data-action="person"][data-id="ana"]');assert.ok(ui.query('.person-page'));
  const length=ui.window.history.length;ui.click('.person-books [data-action="book"]');assert.ok(ui.query('.book-opinion'));
  assert.equal(ui.query('#dialog').open,false);assert.equal(ui.window.history.length,length);
  ui.click('.book-opinion [data-action="book"]');assert.equal(ui.query('.book-opinion'),null);assert.equal(ui.window.location.hash,'#people/ana');
}));
test('DOM: leaving and reopening a conversation preserves its reading position',withUI(ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');
  ui.query('.messages').scrollTop=80;ui.query('.messages').dispatchEvent(new ui.window.Event('scroll'));ui.click('[data-action="inbox"]');ui.click('.chat-row[data-id="lia"]');
  assert.equal(ui.query('.messages').scrollTop,80);
}));
test('DOM: liking from a full person route returns to the origin after closing the match',withUI(async ui=>{
  ui.click('[data-action="person"][data-id="ana"]');ui.click('.person-books [data-action="book"]');
  ui.click('#screen-actions [data-action="like"][data-id="ana"]');assert.equal(ui.query('#dialog-title').textContent,'Deu match!');
  await waitHistoryClose(ui,()=>ui.click('[data-action="close"]'));assert.equal(ui.query('#dialog').open,false);
  assert.equal(ui.query('.person-page'),null);assert.equal(cardID(ui),'davi');
}));

async function realHistoryBack(ui) {
  await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(Error('history.back() did not emit popstate')),250);
    ui.window.addEventListener('popstate',()=>{clearTimeout(timeout);resolve();},{once:true});
    ui.window.history.back();
  });
  // Let app handlers triggered by the actual traversal finish before asserting.
  await new Promise(resolve=>setTimeout(resolve,0));
}
async function waitHistoryClose(ui,action) {
  const traversal=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(Error('Closing a history-backed layer did not traverse back')),250);
    ui.window.addEventListener('popstate',()=>{clearTimeout(timeout);resolve();},{once:true});
  });
  action();await traversal;await new Promise(resolve=>setTimeout(resolve,0));
}
test('DOM history: a person is a route and real Back returns to the same discovery card',withUI(async ui=>{
  const length=ui.window.history.length,hash=ui.window.location.hash;
  ui.click('[data-action="person"][data-id="ana"]');assert.equal(ui.window.history.length,length+1);
  assert.equal(ui.window.location.hash,'#people/ana');assert.equal(ui.query('#dialog').open,false);
  await realHistoryBack(ui);assert.equal(ui.query('.person-page'),null);assert.equal(cardID(ui),'ana');assert.equal(ui.window.location.hash,hash);
}));
test('DOM history: inline book adds no navigation layer and real Back returns to discovery',withUI(async ui=>{
  const base=ui.window.history.length,hash=ui.window.location.hash;
  ui.click('[data-action="person"][data-id="ana"]');ui.click('.person-books [data-action="book"]');
  assert.equal(ui.window.history.length,base+1);assert.ok(ui.query('.book-opinion'));
  await realHistoryBack(ui);assert.equal(ui.window.history.length,base+1);assert.equal(ui.query('.person-page'),null);assert.equal(ui.window.location.hash,hash);
}));
test('DOM history: a short sheet still has one real Back entry without phantom cycles',withUI(async ui=>{
  const base=ui.window.history.length,hash=ui.window.location.hash;
  for(let i=0;i<3;i++){
    ui.click('[data-action="project"]');assert.equal(ui.window.history.length,base+1);
    await waitHistoryClose(ui,()=>ui.click('[data-action="close"]'));
    assert.equal(ui.query('#dialog').open,false);assert.equal(ui.window.location.hash,hash);
  }
  ui.click('[data-view="profile"]');assert.equal(ui.window.history.length,base+1);
  await realHistoryBack(ui);assert.equal(cardID(ui),'ana');assert.equal(ui.query('#dialog').open,false);
}));

test('journey: Por perto to person, inline opinion, same board, reciprocal match and correct chat',withUI(async ui=>{
  ui.click('[data-action="discovery-mode"][data-mode="nearby"]');assert.equal(ui.window.location.hash,'#discover/nearby');
  ui.query('#main').scrollTop=125;assert.ok(ui.query('.nearby-person[data-id="ana"]'));assert.equal(portraits(ui),0);
  ui.click('.nearby-person[data-id="ana"]');assert.equal(ui.window.location.hash,'#people/ana');assert.equal(ui.query('#nav').hidden,true);
  const depth=ui.window.history.length;ui.click('.person-books [data-action="book"]');assert.ok(ui.query('.book-opinion'));assert.equal(ui.window.history.length,depth);
  ui.click('.book-opinion [data-action="book"]');await waitHistoryClose(ui,()=>ui.click('[data-action="back-origin"]'));
  assert.equal(ui.window.location.hash,'#discover/nearby');assert.equal(ui.query('#main').scrollTop,125);assert.ok(ui.query('.nearby-person[data-id="ana"]'));
  ui.click('.nearby-person[data-id="ana"]');ui.click('#screen-actions [data-action="like"]');assert.equal(ui.query('#dialog-title').textContent,'Deu match!');
  ui.click('#dialog [data-action="open-chat"]');assert.match(ui.query('.thread-person').textContent,/Ana/);assert.equal(portraits(ui),0);
  ui.query('#message').value='Oi, Ana!';ui.submit('[data-form="chat"]');assert.match(ui.query('.messages').textContent,/Oi, Ana!/);
  ui.click('[data-action="inbox"]');assert.ok(ui.query('.chat-row[data-id="ana"]'));assert.equal(ui.query('.new-matches [data-id="ana"]'),null);
}));
test('journey: card detail preserves the selected book, then Passar advances exactly once',withUI(async ui=>{
  ui.click('[data-action="book-index"][data-index="2"]');assert.equal(ui.query('.book-counter').textContent,'3 de 3');
  ui.click('.info-open[data-id="ana"]');assert.equal(ui.window.location.hash,'#people/ana');
  await waitHistoryClose(ui,()=>ui.click('[data-action="back-origin"]'));
  assert.equal(cardID(ui),'ana');assert.equal(ui.query('.book-counter').textContent,'3 de 3');
  ui.click('.info-open[data-id="ana"]');ui.click('#screen-actions [data-action="pass"]');
  assert.equal(cardID(ui),'davi');assert.equal(ui.query('.book-counter').textContent,'1 de 3');assert.equal(ui.query('.person-page'),null);
  await realHistoryBack(ui);assert.notEqual(ui.query('.person-page')?.dataset.personId,'ana');assert.equal(cardID(ui),'davi');
}));
test('journey: inbox to thread, draft and reading position survive person and inline-book detour',withUI(async ui=>{
  ui.click('[data-view="chat"]');ui.click('.chat-row[data-id="lia"]');
  ui.query('.messages').scrollTop=90;ui.query('.messages').dispatchEvent(new ui.window.Event('scroll'));
  ui.query('#message').value='Rascunho para Lia';ui.query('#message').dispatchEvent(new ui.window.Event('input',{bubbles:true}));
  ui.click('.thread-person');assert.equal(ui.window.location.hash,'#people/lia');assert.equal(portraits(ui),0);
  ui.click('.person-books [data-action="book"]');ui.click('.book-opinion [data-action="book"]');
  await waitHistoryClose(ui,()=>ui.click('[data-action="back-origin"]'));
  assert.equal(ui.window.location.hash,'#chat/lia');assert.equal(ui.query('#message').value,'Rascunho para Lia');assert.equal(ui.query('.messages').scrollTop,90);
  ui.click('[data-action="inbox"]');ui.click('.chat-row[data-id="lia"]');assert.equal(ui.query('#message').value,'Rascunho para Lia');assert.equal(ui.query('.messages').scrollTop,90);
}));
