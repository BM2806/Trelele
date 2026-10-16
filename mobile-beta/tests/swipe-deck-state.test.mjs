import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyRelease,createCommitGate} from '../src/swipe-deck-state.mjs';
const release=(overrides={})=>({dx:0,dy:0,width:400,velocityX:0,durationMs:500,cancelled:false,...overrides});

test('release distance chooses a person in either direction at the inclusive threshold',()=>{
 assert.equal(classifyRelease(release({dx:96})), 'like');
 assert.equal(classifyRelease(release({dx:-96})), 'pass');
 assert.equal(classifyRelease(release({dx:95.9})), null);
 assert.equal(classifyRelease(release({dx:72,width:300})), 'like');
 assert.equal(classifyRelease(release({dx:71.9,width:300})), null);
});
test('intentional fling requires minimum travel, velocity and matching direction',()=>{
 assert.equal(classifyRelease(release({dx:48,velocityX:.65})), 'like');
 assert.equal(classifyRelease(release({dx:-48,velocityX:-.65})), 'pass');
 for(const change of [{dx:47.9,velocityX:2},{dx:48,velocityX:.649},{dx:48,velocityX:-1},{dx:-48,velocityX:1}])assert.equal(classifyRelease(release(change)),null,JSON.stringify(change));
});
test('vertical scroll, steep diagonals, tap and cancelled pointer cannot decide',()=>{
 for(const change of [{dx:0,dy:180},{dx:120,dy:120},{dx:4,dy:1,velocityX:3},{dx:150,cancelled:true},{dx:-150,cancelled:true}])assert.equal(classifyRelease(release(change)),null,JSON.stringify(change));
 assert.equal(classifyRelease(release({dx:135,dy:100})), 'like');
});
test('invalid geometry, time or velocity fail closed',()=>{
 for(const change of [{dx:NaN},{dy:Infinity},{width:0},{width:-1},{width:NaN},{durationMs:-1},{durationMs:Infinity},{velocityX:NaN},{velocityX:Infinity}])assert.equal(classifyRelease(release({dx:200,...change})),null,JSON.stringify(change));
});
test('one card accepts only one commit even if release, click and button handlers repeat',()=>{
 const gate=createCommitGate('ana');
 assert.equal(gate.claim('ana'),true);
 assert.equal(gate.claim('ana'),false);
 gate.setCard('ana');
 assert.equal(gate.claim('ana'),false);
});
test('a late release from the old person cannot commit the new person',()=>{
 const gate=createCommitGate('ana');
 gate.setCard('lia');
 assert.equal(gate.claim('ana'),false);
 assert.equal(gate.claim('lia'),true);
 assert.equal(gate.claim('lia'),false);
});
test('cancelled movement does not consume the person, and a new person gets one commit',()=>{
 const gate=createCommitGate('ana');
 const choice=classifyRelease(release({dx:150,cancelled:true}));
 assert.equal(choice,null);
 if(choice!==null)gate.claim('ana');
 assert.equal(gate.claim('ana'),true);
 gate.setCard('davi');
 assert.equal(gate.claim('davi'),true);
});
