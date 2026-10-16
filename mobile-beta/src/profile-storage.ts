export type ReaderProfile = {
 name:string; birthDate:string; city:string; identity:string; interestedIn:string[];
 intention:string; genres:string[]; books:string[]; bio:string; completed:boolean;
};
export type OwnerPhoto={id:string; blob:Blob; name:string; createdAt:number};
const KEY='trelele.owner-profile.v1';
export const emptyProfile=():ReaderProfile=>({name:'',birthDate:'',city:'',identity:'',interestedIn:[],intention:'',genres:[],books:[],bio:'',completed:false});
export function ageFromBirthDate(value:string,today=new Date()):number|null{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 const [year,month,day]=value.split('-').map(Number), date=new Date(0);
 date.setFullYear(year,month-1,day);date.setHours(0,0,0,0);
 if(year<1900||date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day||date>today)return null;
 return today.getFullYear()-year-(today.getMonth()+1<month||(today.getMonth()+1===month&&today.getDate()<day)?1:0);
}
export function loadProfile():ReaderProfile|null{
 const raw=localStorage.getItem(KEY);if(!raw)return null;const p=JSON.parse(raw);
 if(!p||typeof p!=='object')throw new Error('O perfil salvo não pôde ser lido. Você pode recomeçar.');
 const value=emptyProfile();
 for(const k of ['name','birthDate','city','identity','intention','bio'] as const)if(typeof p[k]==='string')value[k]=p[k].slice(0,1000);
 for(const k of ['interestedIn','genres','books'] as const)if(Array.isArray(p[k]))value[k]=[...new Set<string>(p[k].filter((x:unknown)=>typeof x==='string'))].slice(0,20);
 value.completed=p.completed===true;return value;
}
export function saveProfile(profile:ReaderProfile){
 // Whitelist metadata: original photos, blob URLs and database handles never enter localStorage.
 const {name,birthDate,city,identity,interestedIn,intention,genres,books,bio,completed}=profile;
 localStorage.setItem(KEY,JSON.stringify({name,birthDate,city,identity,interestedIn,intention,genres,books,bio,completed}));
}
function openPhotoDB():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{
 if(!globalThis.indexedDB){reject(new Error('Este navegador não permite guardar suas fotos neste aparelho.'));return;}
 const req=indexedDB.open('trelele-owner-photos-v1',1);
 req.onupgradeneeded=()=>req.result.createObjectStore('photos',{keyPath:'id'});
 req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Não foi possível abrir as fotos.'));
 req.onblocked=()=>reject(new Error('Feche outras abas do Trelelê e tente de novo.'));
});}
async function photoTransaction<T>(mode:IDBTransactionMode,run:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>{
 const db=await openPhotoDB();return new Promise((resolve,reject)=>{const tx=db.transaction('photos',mode);let result:T;let settled=false;
 const req=run(tx.objectStore('photos'));req.onsuccess=()=>{result=req.result;};
 tx.oncomplete=()=>{settled=true;db.close();resolve(result);};
 const fail=()=>{if(settled)return;settled=true;db.close();reject(tx.error||req.error||new Error('Não foi possível salvar. Confira o espaço do aparelho.'));};tx.onerror=fail;tx.onabort=fail;
 });
}
export function listOwnerPhotos():Promise<OwnerPhoto[]>{return photoTransaction('readonly',s=>s.getAll());}
export async function removeOwnerPhoto(id:string){await photoTransaction('readwrite',s=>s.delete(id));}
export async function putOwnerPhoto(file:File,replaceId?:string):Promise<OwnerPhoto>{
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Escolha uma foto JPG, PNG ou WebP.');
 if(!file.size||file.size>5*1024*1024)throw new Error('Cada foto precisa ter até 5 MB.');
 const data=await file.arrayBuffer();const bytes=new Uint8Array(data);const png=[137,80,78,71,13,10,26,10].every((x,i)=>bytes[i]===x),jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255,webp=String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 if(!((file.type==='image/png'&&png)||(file.type==='image/jpeg'&&jpeg)||(file.type==='image/webp'&&webp)))throw new Error('O conteúdo não é uma foto JPG, PNG ou WebP válida.');
 const id=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data))).map(x=>x.toString(16).padStart(2,'0')).join('');
 // Decode actual bytes, rather than trusting the filename or MIME alone.
 const url=URL.createObjectURL(file);try{await new Promise<void>((resolve,reject)=>{const img=new Image();img.onload=()=>img.naturalWidth>0&&img.naturalHeight>0?resolve():reject(new Error('Esta imagem não abriu.'));img.onerror=()=>reject(new Error('Esta imagem não abriu. Tente outra.'));img.src=url;});}finally{URL.revokeObjectURL(url);}
 const row:OwnerPhoto={id,blob:file,name:file.name.slice(0,120),createdAt:Date.now()};
 const db=await openPhotoDB();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('photos','readwrite'),store=tx.objectStore('photos');let validationError='';const req=store.getAll();
 req.onsuccess=()=>{const rows=req.result as OwnerPhoto[];if(rows.some(p=>p.id===id)){validationError='Essa foto já está no seu perfil. Escolha outra.';tx.abort();return;}if(!replaceId&&rows.length>=3){validationError='Os três espaços estão cheios. Remova uma foto antes.';tx.abort();return;}if(replaceId&&!rows.some(p=>p.id===replaceId)){validationError='A foto que você ia trocar não está mais aqui. Atualize e tente de novo.';tx.abort();return;}if(replaceId)store.delete(replaceId);store.put(row);};
 tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('Não foi possível salvar a foto. Confira o espaço e as permissões do aparelho.'));tx.onabort=()=>reject(new Error(validationError||'Não foi possível salvar a foto. Confira o espaço e as permissões do aparelho.'));
 });}finally{db.close();}return row;
}
export async function clearProfile(){await photoTransaction('readwrite',s=>s.clear());localStorage.removeItem(KEY);}
export function profileProblem(p:ReaderProfile,photoCount:number):string{
 const age=ageFromBirthDate(p.birthDate);
 if(!p.name.trim()||p.name.trim().length<2)return 'Como você quer aparecer? Escreva pelo menos duas letras.';
 if(age===null)return 'Confira sua data de nascimento.';
 if(age<18)return 'O Trelelê é para pessoas com 18 anos ou mais.';
 if(!p.identity||!p.interestedIn.length||!p.intention)return 'Escolha sua identificação, quem quer conhecer e sua intenção.';
 if(!p.genres.length)return 'Escolha pelo menos um gênero literário.';
 if(p.books.length!==3||new Set(p.books).size!==3)return 'Escolha três livros diferentes.';
 if(photoCount!==3)return 'Adicione três fotos diferentes, que ficarão só neste aparelho.';
 if(!p.bio.trim())return 'Escreva um pouco sobre você.';
 return '';
}
