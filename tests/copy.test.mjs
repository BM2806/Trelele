import test from 'node:test';
import assert from 'node:assert/strict';
import { books, profiles, nextDemoLine, seedChat } from '../dist/copy.mjs';

test('copy: fictional profiles reference existing books and have an opinion for every chosen book',()=>{
  const catalog=new Set(books.map(book=>book.id));
  for(const person of profiles){
    assert.ok(person.books.length>0,`${person.id}: missing books`);
    for(const book of person.books){assert.ok(catalog.has(book),`${person.id}: unknown ${book}`);assert.ok(person.bookOpinions[book]?.trim(),`${person.id}: missing opinion for ${book}`);}
  }
});
test('copy: simulated reply sequences do not repeat and stop once exhausted',()=>{
  for(const person of profiles){
    const messages=person.id==='lia'?structuredClone(seedChat):[];
    const replies=[];
    for(let i=0;i<30;i++){
      const line=nextDemoLine(person.id,person.id,messages);
      if(line===null)break;
      assert.equal(typeof line,'string');assert.ok(line.trim());assert.ok(!replies.includes(line),`${person.id}: repeated reply`);
      replies.push(line);messages.push({from:person.id,text:line});
    }
    assert.ok(replies.length>=5,`${person.id}: not enough varied dialogue`);
    assert.equal(nextDemoLine(person.id,person.id,messages),null);
  }
  assert.equal(nextDemoLine('unknown','unknown',[]),null);
});
