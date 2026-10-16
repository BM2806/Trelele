import { books, profiles, me as initialMe, seedChat, nextDemoLine, simulatedDialogue } from '../copy.mjs';
import { createDemoState, like, getMatch, sendMessage, getRevealView, consentPhoto, revokeConsent, block, unmatch, changePhoto } from '../domain.mjs';

export { books, profiles };
export const session = {
  domain: createDemoState({userIds:['you', ...profiles.map(p=>p.id)]}),
  me:structuredClone(initialMe), now:Date.now(), sequence:0,
  preferences:{city:'São Paulo',min:18,max:65,genre:'Tudo'},
  paused:false, passed:new Set(), decisions:[], drafts:{}, scrolls:{}, books:{}, reports:[],
};
export const person = id => profiles.find(p=>p.id===id);
export const book = id => books.find(b=>b.id===id);
export const match = id => getMatch(session.domain,'you',id);
export const blocked = id => session.domain.blocks.some(pair=>pair.includes(id));
export const sent = id => session.domain.likes.some(([from,to])=>from==='you'&&to===id);
export const activeMatches = () => session.domain.matches.filter(m=>m.status==='ACTIVE');
export const matchPerson = m => profiles.find(p=>m.users.includes(p.id));
export const shared = p => p.books.filter(id=>session.me.books.includes(id));
export const available = id => Boolean(person(id))&&!blocked(id)&&!['BLOCKED','UNMATCHED'].includes(match(id)?.status);
export function candidates(){
 const f=session.preferences;
 return profiles.filter(p=>available(p.id)&&!match(p.id)&&!sent(p.id)&&!session.passed.has(p.id)&&p.city===f.city&&p.age>=f.min&&p.age<=f.max&&(f.genre==='Tudo'||p.category===f.genre));
}
export const received = () => profiles.filter(p=>available(p.id)&&!match(p.id)&&session.domain.likes.some(([from,to])=>from===p.id&&to==='you'));
export const sentPeople = () => profiles.filter(p=>available(p.id)&&sent(p.id)&&!match(p.id));
export function message(id,from,text){return sendMessage(session.domain,match(id).id,from,text,++session.now,`v5-${++session.sequence}`);}
export function decide(id,action){
 if(!available(id)||match(id)||sent(id))return null;
 session.decisions.push({id,action});
 if(action==='pass'){session.passed.add(id);return null;}
 return like(session.domain,'you',id,++session.now);
}
export function rewind(){
 const last=session.decisions.at(-1);
 if(!last||last.action!=='pass'||!available(last.id))return false;
 session.decisions.pop();session.passed.delete(last.id);return last.id;
}
export const reveal = id => getRevealView(session.domain,match(id).id,'you',session.now);
export function consent(id,from='you'){const view=reveal(id);return consentPhoto(session.domain,match(id).id,from,++session.now,view.photoVersions);}
export function revoke(id){revokeConsent(session.domain,match(id).id,'you');}
export function simulate(id,kind){
 if(kind==='reply'){const text=nextDemoLine(id,id,match(id).messages);if(text)message(id,id,text);return;}
 if(kind==='time'){
  for(const line of simulatedDialogue[id])if(!match(id).messages.some(m=>m.text===line.text))message(id,line.from,line.text);
  session.now+=86400001;
 }
 if(kind==='consent')consent(id,id);
 if(kind==='photo')changePhoto(session.domain,id);
}
export function endContact(id,kind){if(kind==='block')block(session.domain,'you',id);else unmatch(session.domain,match(id).id,'you');}
for(const id of ['ana','lia'])like(session.domain,id,'you',session.now);
like(session.domain,'you','lia',session.now);
for(const line of seedChat)message('lia',line.from,line.text);
