/** Product choices, not measurements of another app. Velocity is px/ms. */
export function classifyRelease({dx,dy,width,velocityX=0,durationMs=0,cancelled=false,primary=true}) {
 if(cancelled||!primary||![dx,dy,width,velocityX,durationMs].every(Number.isFinite)||width<=0||durationMs<0)return null;
 if(Math.abs(dx)<Math.abs(dy)*1.35)return null;
 const distance=Math.abs(dx)>=Math.max(72,width*.24);
 const fling=Math.abs(dx)>=48&&Math.abs(velocityX)>=.65&&Math.sign(dx)===Math.sign(velocityX);
 return distance||fling?(dx>0?'like':'pass'):null;
}
export function createCommitGate(initialCardId){
 let current=initialCardId,claimed=false;
 return {setCard(id){if(id!==current){current=id;claimed=false;}},claim(id){if(id!==current||claimed)return false;claimed=true;return true;}};
}
