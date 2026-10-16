import {useEffect,useRef,useState,type ReactNode} from 'react';
import {animate,motion,useMotionValue,useReducedMotion,useTransform} from 'motion/react';
import {useDrag} from '@use-gesture/react';
// @ts-ignore Pure module is also tested directly in Node.
import {classifyRelease,createCommitGate} from './swipe-deck-state.mjs';
export type Decision='like'|'pass';
type Controls={requestDecision:(decision:Decision)=>void;busy:boolean};
type Props={cardId:string;enabled:boolean;holdOnLike:boolean;onCommit:(decision:Decision)=>void;children:(controls:Controls)=>ReactNode};
export default function SwipeDeck({cardId,enabled,holdOnLike,onCommit,children}:Props){
 const x=useMotionValue(0),y=useMotionValue(0),rotate=useTransform(x,[-360,0,360],[-10,0,10]);
 const reduced=useReducedMotion(),surface=useRef<HTMLDivElement>(null),gate=useRef(createCommitGate(cardId));
 const session=useRef({token:0,dragging:false,released:false,axis:'pending',origin:[0,0],suppressUntil:0,blocked:false,blockedTarget:false,primary:true});
 const animation=useRef<ReturnType<typeof animate>|null>(null),yAnimation=useRef<ReturnType<typeof animate>|null>(null),mounted=useRef(true),pending=useRef(false),commitRef=useRef(onCommit);
 const [busy,setBusy]=useState(false),[direction,setDirection]=useState<Decision|null>(null);commitRef.current=onCommit;gate.current.setCard(cardId);
 function reset(invalidate=true){if(invalidate){session.current.token++;session.current.blocked=true;}animation.current?.stop();yAnimation.current?.stop();animation.current=null;pending.current=false;setBusy(false);setDirection(null);if(reduced){x.set(0);y.set(0);}else{animation.current=animate(x,0,{type:'spring',stiffness:470,damping:34,mass:.65});yAnimation.current=animate(y,0,{type:'spring',stiffness:470,damping:34,mass:.65});}}
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;session.current.token++;animation.current?.stop();yAnimation.current?.stop();};},[]);
 useEffect(()=>{reset();return()=>{session.current.token++;animation.current?.stop();yAnimation.current?.stop();};},[cardId]);
 useEffect(()=>{if(!enabled)reset();},[enabled]);
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){session.current.suppressUntil=Date.now()+400;reset();}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[]);
 async function requestDecision(decision:Decision){if(!enabled||pending.current)return;pending.current=true;setBusy(true);setDirection(decision);const token=++session.current.token;session.current.suppressUntil=Date.now()+500;const held=decision==='like'&&holdOnLike;
  if(!reduced){const width=surface.current?.getBoundingClientRect().width??360;animation.current=animate(x,held?0:(decision==='like'?1:-1)*(width+100),held?{type:'spring',stiffness:470,damping:34,mass:.65}:{duration:.22,ease:[.2,.65,.35,1]});yAnimation.current=animate(y,0,{duration:held?.16:.22});await animation.current;}
  if(!mounted.current||token!==session.current.token)return;if(gate.current.claim(cardId)){x.set(0);y.set(0);commitRef.current(decision);}pending.current=false;setBusy(false);setDirection(null);
 }
 const bind=useDrag(g=>{const st=session.current,target=g.event.target as HTMLElement;if(g.first){st.blocked=!enabled||pending.current||st.blockedTarget;st.axis='pending';st.released=false;if(!st.blocked){animation.current?.stop();yAnimation.current?.stop();}st.origin=[x.get(),y.get()];st.dragging=false;}const [dx,dy]=g.movement;if(Math.hypot(dx,dy)>7){st.dragging=true;st.suppressUntil=Date.now()+400;}if(st.blocked)return;if(g.canceled||g.event.type==='pointercancel'){reset();return;}if(st.axis==='pending'&&Math.hypot(dx,dy)>9)st.axis=Math.abs(dx)>Math.abs(dy)*1.35?'horizontal':'vertical';if(st.axis==='horizontal'){g.event.stopPropagation();x.set(st.origin[0]+dx);y.set(st.origin[1]+dy*.12);setDirection(dx>=0?'like':'pass');}if(!g.last)return;st.released=g.event.type==='pointerup'||g.event.type==='mouseup'||g.event.type==='touchend';if(st.axis!=='horizontal'){reset();return;}const choice=classifyRelease({dx,dy,width:surface.current?.getBoundingClientRect().width??0,velocityX:g.velocity[0]*g.direction[0],durationMs:g.elapsedTime,cancelled:g.canceled,primary:st.primary});if(choice)void requestDecision(choice);else reset();},{filterTaps:true,pointer:{capture:false},threshold:4});
 return <div ref={surface} className="swipe-deck" data-card-id={cardId} data-decision={direction??''} data-busy={busy?'true':'false'} style={{touchAction:'pan-y'}} {...bind()} onPointerDownCapture={e=>{session.current.blockedTarget=!!(e.target as HTMLElement).closest('button,a,input,textarea,select,[data-swipe-ignore]');session.current.primary=e.isPrimary&&e.button===0;}} onClickCapture={e=>{if(Date.now()<session.current.suppressUntil){e.preventDefault();e.stopPropagation();}}} onLostPointerCapture={()=>{if(session.current.dragging&&!session.current.blocked&&!pending.current)reset();}}><motion.div className="swipe-deck-motion" style={{x,y,rotate:reduced?0:rotate}}>{children({requestDecision,busy})}<div className="swipe-intent" aria-hidden="true">{direction==='like'?'CURTIR':direction==='pass'?'PASSAR':''}</div></motion.div></div>;
}
