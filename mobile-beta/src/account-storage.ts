export type AccountPreferences={paused:boolean};
const KEY='trelele.account-preferences.v1';
export function loadAccountPreferences():AccountPreferences{
 const raw=localStorage.getItem(KEY);if(!raw)return {paused:false};
 const value=JSON.parse(raw);
 if(!value||typeof value.paused!=='boolean')throw new Error('Não conseguimos ler sua preferência de pausa. Revise as configurações.');
 return {paused:value.paused};
}
export function saveAccountPreferences(value:AccountPreferences){
 if(typeof value.paused!=='boolean')throw new Error('Preferência de pausa inválida.');
 localStorage.setItem(KEY,JSON.stringify({paused:value.paused}));
}
export function clearAccountPreferences(){localStorage.removeItem(KEY);}
