// Local fictional session only: no account, authentication or private photos.
// @ts-ignore Shared fixture identities, not a remote account directory.
import {profiles} from './copy.mjs';
export type DemoSession={state:any;now:number;passed:string[];drafts:Record<string,string>};
export const DEMO_SESSION_KEY='trelele.demo-session.v1';
const VERSION=1,MAX_LENGTH=512*1024;
const identities=['you',...profiles.map((p:{id:string})=>p.id)] as string[];
const known=new Set(identities);
function fail(code='DEMO_SESSION_INVALID'):never{throw Object.assign(new Error(code==='DEMO_SESSION_STORAGE'?'Não foi possível acessar a conversa salva neste aparelho.':code==='DEMO_SESSION_TOO_LARGE'?'Esta sessão ficou grande demais para salvar neste aparelho.':'A sessão salva não é compatível. Você pode apagar somente os dados deste teste e recomeçar.'),{code});}
function check(ok:unknown):asserts ok{if(!ok)fail();}
function object(value:unknown,keys:string[]):Record<string,any>{check(value!==null&&typeof value==='object'&&!Array.isArray(value));const v=value as Record<string,any>;check(Object.keys(v).length===keys.length&&Object.keys(v).every(k=>keys.includes(k)));return v;}
const integer=(v:unknown,min=0,max=8640000000000000)=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=min&&v<=max;
const text=(v:unknown,max:number)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
const pair=(a:string,b:string)=>JSON.stringify([a,b].sort());
function pairs(value:unknown):string[][]{check(Array.isArray(value)&&value.length<=30);const seen=new Set<string>();for(const p of value){check(Array.isArray(p)&&p.length===2&&known.has(p[0])&&known.has(p[1])&&p[0]!==p[1]&&p.includes('you'));const key=JSON.stringify(p);check(!seen.has(key));seen.add(key);}return value;}
function validate(input:unknown):DemoSession{
 const value=object(input,['state','now','passed','drafts']);check(integer(value.now));
 const state=object(value.state,['users','waitMs','turnsRequired','policyVersion','likes','matches','blocks']);
 check(state.waitMs===86400000&&state.turnsRequired===5&&state.policyVersion===1);
 check(Array.isArray(state.users)&&state.users.length===identities.length);const users=new Map<string,number>();
 for(const entry of state.users){const u=object(entry,['id','photoVersion']);check(known.has(u.id)&&!users.has(u.id)&&integer(u.photoVersion,1,1000000));users.set(u.id,u.photoVersion);}
 const likes=pairs(state.likes),blocks=pairs(state.blocks);check(Array.isArray(state.matches)&&state.matches.length<=15);
 const matches=new Set<string>();let messageCount=0;
 for(const entry of state.matches){
  const m=object(entry,['id','users','status','createdAt','bilateralAt','messages','consents','authorizationVersion']);
  check(Array.isArray(m.users)&&m.users.length===2&&m.users.every((id:unknown)=>typeof id==='string'&&known.has(id))&&m.users[0]<m.users[1]&&m.users.includes('you'));
  const id=pair(m.users[0],m.users[1]);check(m.id===id&&!matches.has(id));matches.add(id);
  check(['ACTIVE','UNMATCHED','BLOCKED'].includes(m.status)&&integer(m.createdAt)&&m.createdAt<=value.now&&integer(m.authorizationVersion,1,1000000));
  check(likes.some(p=>p[0]===m.users[0]&&p[1]===m.users[1])&&likes.some(p=>p[1]===m.users[0]&&p[0]===m.users[1]));
  const isBlocked=blocks.some(p=>pair(p[0],p[1])===id);check(!isBlocked||m.status==='BLOCKED');check(m.status!=='BLOCKED'||isBlocked);
  check(Array.isArray(m.messages)&&m.messages.length<=1000);messageCount+=m.messages.length;check(messageCount<=1000);
  let previous=m.createdAt,bilateral:number|null=null;const authors=new Set<string>(),keys=new Set<string>();
  for(let i=0;i<m.messages.length;i++){
   const msg=object(m.messages[i],['id','from','text','createdAt','clientMessageId']);
   check(msg.id===i+1&&m.users.includes(msg.from)&&text(msg.text,2000)&&msg.text===msg.text.trim()&&text(msg.clientMessageId,128)&&integer(msg.createdAt)&&msg.createdAt>=previous&&msg.createdAt<=value.now);
   const key=JSON.stringify([msg.from,msg.clientMessageId]);check(!keys.has(key));keys.add(key);previous=msg.createdAt;authors.add(msg.from);if(bilateral===null&&authors.size===2)bilateral=msg.createdAt;
  }
  check(m.bilateralAt===bilateral&&Array.isArray(m.consents)&&m.consents.length<=2);check(m.status==='ACTIVE'||m.consents.length===0);const consenters=new Set<string>();
  for(const entry of m.consents){
   const c=object(entry,['userId','photoVersions','policyVersion','createdAt']);check(m.users.includes(c.userId)&&!consenters.has(c.userId)&&c.policyVersion===1&&integer(c.createdAt)&&c.createdAt<=value.now);consenters.add(c.userId);
   check(Array.isArray(c.photoVersions)&&c.photoVersions.length===2&&c.photoVersions.every((v:unknown,i:number)=>v===users.get(m.users[i])));
   check(bilateral!==null&&c.createdAt>=bilateral+state.waitMs);const turns:Map<string,number>=new Map(m.users.map((u:string):[string,number]=>[u,0]));let last:string|undefined;
   for(const msg of m.messages){if(msg.createdAt>c.createdAt)break;if(msg.from!==last)turns.set(msg.from,Number(turns.get(msg.from))+1);last=msg.from;}
   check(m.users.every((u:string)=>Number(turns.get(u))>=state.turnsRequired));
  }
 }
 check(Array.isArray(value.passed)&&value.passed.length<=identities.length-1&&new Set(value.passed).size===value.passed.length&&value.passed.every((id:unknown)=>typeof id==='string'&&id!=='you'&&known.has(id)));
 const drafts=value.drafts;check(drafts!==null&&typeof drafts==='object'&&!Array.isArray(drafts)&&Object.keys(drafts).length<=identities.length-1);
 for(const [id,draft] of Object.entries(drafts))check(id!=='you'&&known.has(id)&&typeof draft==='string'&&draft.length<=2000);
 return value as DemoSession;
}
export function loadDemoSession():DemoSession|null{
 let raw:string|null;try{raw=localStorage.getItem(DEMO_SESSION_KEY);}catch{fail('DEMO_SESSION_STORAGE');}
 if(raw===null)return null;if(raw.length>MAX_LENGTH)fail('DEMO_SESSION_TOO_LARGE');
 let parsed:unknown;try{parsed=JSON.parse(raw);}catch{fail();}
 const envelope=object(parsed,['version','value']);if(envelope.version!==VERSION)fail('DEMO_SESSION_VERSION');return validate(envelope.value);
}
export function saveDemoSession(value:DemoSession):void{
 validate(value);const raw=JSON.stringify({version:VERSION,value});if(raw.length>MAX_LENGTH)fail('DEMO_SESSION_TOO_LARGE');
 try{localStorage.setItem(DEMO_SESSION_KEY,raw);}catch{fail('DEMO_SESSION_STORAGE');}
}
export function clearDemoSession():void{try{localStorage.removeItem(DEMO_SESSION_KEY);}catch{fail('DEMO_SESSION_STORAGE');}}
