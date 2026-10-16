import test from 'node:test';
import assert from 'node:assert/strict';
import {ageFromBirthDate,emptyProfile,profileProblem,saveProfile,loadProfile,putOwnerPhoto} from '../src/profile-storage.ts';

const today=new Date(2026,9,16,12);
const complete=()=>({...emptyProfile(),name:'Ana',birthDate:'1995-05-20',city:'',identity:'Mulher',interestedIn:['Todos'],intention:'Um namoro',genres:['Romance'],books:['estrela','torto','avesso'],bio:'Leio no caminho do trabalho.'});

test('age boundary requires a completed eighteenth birthday, not just birth year',()=>{
 assert.equal(ageFromBirthDate('2008-10-16',today),18);
 assert.equal(ageFromBirthDate('2008-10-17',today),17);
 assert.equal(ageFromBirthDate('2008-10-15',today),18);
});
test('birthdate rejects impossible dates, rollovers, future values and ambiguous formats',()=>{
 for(const date of ['2025-02-29','2000-02-30','2008-13-01','2008-00-01','2008-01-00','2026-10-17','16/10/2008','2008-1-01','','1899-12-31'])assert.equal(ageFromBirthDate(date,today),null,date);
 assert.equal(ageFromBirthDate('2000-02-29',today),26);
});
test('leap birthday has a deterministic calendar boundary',()=>{
 assert.equal(ageFromBirthDate('2008-02-29',new Date(2026,1,28,12)),17);
 assert.equal(ageFromBirthDate('2008-02-29',new Date(2026,2,1,12)),18);
});
test('completion requires exactly three distinct books and exactly three photos',()=>{
 assert.equal(profileProblem(complete(),3),'');
 for(const books of [[],['estrela'],['estrela','torto'],['estrela','torto','avesso','rio'],['estrela','estrela','torto']])assert.notEqual(profileProblem({...complete(),books},3),'');
 for(const photoCount of [0,1,2,4,NaN])assert.notEqual(profileProblem(complete(),photoCount),'');
});
test('completion rejects minor, invalid birthdate and missing required semantic fields; city is optional',()=>{
 for(const change of [{name:' '},{birthDate:'invalid'},{birthDate:`${new Date().getFullYear()-10}-01-01`},{identity:''},{interestedIn:[]},{intention:''},{genres:[]},{bio:' '}])assert.notEqual(profileProblem({...complete(),...change},3),'',JSON.stringify(change));
 assert.equal(profileProblem({...complete(),city:''},3),'');
});
test('metadata whitelist excludes owner photos, object URLs, and unexpected fields',()=>{
 const original=Object.getOwnPropertyDescriptor(globalThis,'localStorage');const memory=new Map();
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)}});
 try{
  assert.equal(loadProfile(),null);
  saveProfile({...complete(),photos:[new Blob(['private'])],blobUrl:'blob:private',token:'should-not-persist'});
  const serialized=[...memory.values()][0];assert.equal(serialized.includes('private'),false);assert.equal(serialized.includes('token'),false);
  assert.deepEqual(loadProfile(),complete());
  memory.set([...memory.keys()][0],'{broken');assert.throws(()=>loadProfile());
 }finally{if(original)Object.defineProperty(globalThis,'localStorage',original);else delete globalThis.localStorage;}
});
test('malformed storage fails visibly; failed write is not reported as saved',()=>{
 const original=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>'{"name":"Ana","books":["estrela","estrela",42],"completed":"true"}',setItem:()=>{throw new Error('QuotaExceededError');}}});
 try{const loaded=loadProfile();assert.deepEqual(loaded.books,['estrela']);assert.equal(loaded.completed,false);assert.throws(()=>saveProfile(complete()),/QuotaExceededError/);}
 finally{if(original)Object.defineProperty(globalThis,'localStorage',original);else delete globalThis.localStorage;}
});

test('photo intake rejects unsupported type, empty files and files larger than 5 MB before storage',async()=>{
 await assert.rejects(putOwnerPhoto(new File(['<svg/>'],'x.svg',{type:'image/svg+xml'})),/JPG, PNG ou WebP/);
 await assert.rejects(putOwnerPhoto(new File([],'empty.png',{type:'image/png'})),/até 5 MB/);
 await assert.rejects(putOwnerPhoto(new File([new Uint8Array(5*1024*1024+1)],'big.png',{type:'image/png'})),/até 5 MB/);
});

test('a renamed SVG with an allowed MIME is rejected before image decoding or storage',async()=>{
 await assert.rejects(putOwnerPhoto(new File(['<svg xmlns="http://www.w3.org/2000/svg"></svg>'],'pretend.png',{type:'image/png'})),/conteúdo não é uma foto/);
});

function memoryProfile(run){const original=Object.getOwnPropertyDescriptor(globalThis,'localStorage'),values=new Map();Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)}});try{run(values);}finally{if(original)Object.defineProperty(globalThis,'localStorage',original);else delete globalThis.localStorage;}}
test('a legacy profile gains optional literary defaults without losing its confirmed fields',()=>memoryProfile(values=>{const legacy={...complete(),completed:true};delete legacy.readingHabits;delete legacy.literaryDates;delete legacy.bookRecommendation;values.set('trelele.owner-profile.v1',JSON.stringify(legacy));const loaded=loadProfile();for(const [key,value] of Object.entries(legacy))assert.deepEqual(loaded[key],value,key);assert.deepEqual(loaded.readingHabits,[]);assert.deepEqual(loaded.literaryDates,[]);assert.equal(loaded.bookRecommendation,'');}));
test('literary extras stay optional; recommendation is capped at 200 and cannot add image fields',()=>memoryProfile(values=>{assert.equal(profileProblem({...complete(),readingHabits:[],literaryDates:[],bookRecommendation:''},3),'');saveProfile({...complete(),readingHabits:['No metrô'],literaryDates:['Livraria'],bookRecommendation:'a'.repeat(201),photos:['private-original'],imageUrl:'blob:private'});const loaded=loadProfile();assert.equal(loaded.bookRecommendation.length,200);assert.deepEqual(loaded.readingHabits,['No metrô']);assert.deepEqual(loaded.literaryDates,['Livraria']);const raw=[...values.values()][0];assert.equal(raw.includes('private'),false);assert.equal(raw.includes('imageUrl'),false);assert.equal(profileProblem(loaded,3),'');}));
