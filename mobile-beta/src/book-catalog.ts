// Public catalogue metadata only. Never send profile, identity or private photos.
// Official APIs: developers.google.com/books/docs/v1/using;
// openlibrary.org/dev/docs/api/search and /covers. No API credentials bundled.
// @ts-ignore Existing curated public catalogue (not a mutable owner registry).
import {books as curatedBooks} from './copy.mjs';
export type BookSource='local'|'google-books'|'open-library';
export type BookRecord={id:string;title:string;author:string;coverUrl?:string;source:BookSource;sourceId?:string;isbn?:string;publishedYear?:string};
export type BookSearchResult={books:BookRecord[];source:'google-books'|'open-library';notice?:string};
export type BookCatalogErrorCode='INVALID_QUERY'|'ABORTED'|'TIMEOUT'|'RATE_LIMITED'|'UNAVAILABLE'|'INVALID_RESPONSE';
export class BookCatalogError extends Error{
 code:BookCatalogErrorCode;
 constructor(code:BookCatalogErrorCode,message:string){super(message);this.name='BookCatalogError';this.code=code;}
}
export const localBooks:readonly BookRecord[]=Object.freeze(curatedBooks.map((book:{id:string;title:string;author:string})=>Object.freeze({id:book.id,title:book.title,author:book.author,source:'local' as const,coverUrl:`/assets/books/cover-${book.id}.jpg`})));
const localById=new Map(localBooks.map(book=>[book.id,book]));
const keys=['id','title','author','coverUrl','source','sourceId','isbn','publishedYear'];
const cleanText=(value:unknown,max:number):value is string=>typeof value==='string'&&value.trim().length>0&&value.length<=max&&!/[\u0000-\u001f\u007f]/.test(value);
const isbnValid=(value:string)=>{
 if(/^\d{13}$/.test(value))return [...value].reduce((sum,n,i)=>sum+Number(n)*(i%2?3:1),0)%10===0;
 if(/^\d{9}[\dX]$/.test(value))return [...value].reduce((sum,n,i)=>sum+(n==='X'?10:Number(n))*(10-i),0)%11===0;
 return false;
};
function providerISBN(value:unknown):string|undefined{if(typeof value!=='string')return;const isbn=value.replace(/[\s-]/g,'').toUpperCase();return isbnValid(isbn)?isbn:undefined;}

export function safeCoverUrl(value:unknown,source?:BookSource):string|undefined{
 if(typeof value!=='string'||value.length>2048)return;
 try{
  const url=new URL(value);
  if(url.protocol!=='https:'||url.username||url.password||url.port||url.hash)return;
  if(source!=='open-library'&&['books.google.com','books.googleusercontent.com'].includes(url.hostname)){
   if(!['/books','/books/content'].includes(url.pathname))return;
   const allowed=['id','printsec','img','zoom','edge','source','w','h','fife','jscmd','sig'];
   if([...url.searchParams.keys()].some(key=>!allowed.includes(key))||!url.searchParams.get('id')||url.searchParams.get('img')!=='1')return;
   return url.href;
  }
  if(source!=='google-books'&&url.hostname==='covers.openlibrary.org'&&/^\/b\/(id\/\d{1,12}|isbn\/[\dX]{10,13}|olid\/OL\d{1,12}M)-[SML]\.jpg$/.test(url.pathname)&&[...url.searchParams].every(([key,val])=>key==='default'&&val==='false'))return url.href;
 }catch{/* Untrusted metadata is rejected, not interpreted. */}
}

export function normalizeBookRecord(value:unknown):BookRecord|null{
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const book=value as Record<string,unknown>;
 if(Object.keys(book).some(key=>!keys.includes(key))||!cleanText(book.id,150)||!cleanText(book.title,300)||!cleanText(book.author,200))return null;
 if(!['local','google-books','open-library'].includes(book.source as string))return null;
 const source=book.source as BookSource;
 if(source==='local'){
  const local=localById.get(book.id);
  if(!local||book.title!==local.title||book.author!==local.author||book.sourceId!==undefined||book.isbn!==undefined||book.publishedYear!==undefined||(book.coverUrl!==undefined&&book.coverUrl!==local.coverUrl))return null;
  return {...local};
 }
 if(!cleanText(book.sourceId,128))return null;
 if(source==='google-books'&&(!/^[A-Za-z0-9_-]{1,128}$/.test(book.sourceId)||book.id!==`google:${book.sourceId}`))return null;
 if(source==='open-library'&&(!/^OL\d{1,12}W$/.test(book.sourceId)||book.id!==`openlibrary:${book.sourceId}`))return null;
 const record:BookRecord={id:book.id,title:book.title.trim(),author:book.author.trim(),source,sourceId:book.sourceId};
 if(book.coverUrl!==undefined){const cover=safeCoverUrl(book.coverUrl,source);if(!cover)return null;if(source==='google-books'&&new URL(cover).searchParams.get('id')!==book.sourceId)return null;record.coverUrl=cover;}
 if(book.isbn!==undefined){if(typeof book.isbn!=='string'||!isbnValid(book.isbn))return null;record.isbn=book.isbn;}
 if(book.publishedYear!==undefined){if(typeof book.publishedYear!=='string'||!/^[12]\d{3}$/.test(book.publishedYear))return null;record.publishedYear=book.publishedYear;}
 return record;
}
const keyText=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
// A transparent title/author comparison, not a claim of universal work identity.
export function bookWorkKey(book:BookRecord):string{return `${keyText(book.title)}|${keyText(book.author)}`;}
export function validateBookSelection(ids:unknown,details:unknown=undefined):BookRecord[]|null{
 if(!Array.isArray(ids)||ids.length>3||ids.some(id=>!cleanText(id,150))||new Set(ids).size!==ids.length)return null;
 if(details!==undefined&&(!Array.isArray(details)||details.length>3))return null;
 const records=new Map<string,BookRecord>();
 for(const raw of (details??[]) as unknown[]){const record=normalizeBookRecord(raw);if(!record||!ids.includes(record.id)||records.has(record.id))return null;records.set(record.id,record);}
 const selected:BookRecord[]=[];
 for(const id of ids){const record=records.get(id)??localById.get(id);if(!record)return null;selected.push({...record});}
 if(new Set(selected.map(bookWorkKey)).size!==selected.length)return null;
 const isbns=selected.map(book=>book.isbn).filter(Boolean);if(new Set(isbns).size!==isbns.length)return null;
 return selected;
}
export function getProfileBooks(profile:{books:string[];bookDetails?:BookRecord[]}):BookRecord[]{return validateBookSelection(profile.books,profile.bookDetails)??[];}
export function getBookCover(book:BookRecord):string|undefined{return normalizeBookRecord(book)?.coverUrl;}

const providerText=(value:unknown,max:number)=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max):'';
function googleRecord(raw:unknown):BookRecord|null{
 if(!raw||typeof raw!=='object')return null;const item=raw as Record<string,any>,info=item.volumeInfo;
 if(!info||typeof info!=='object'||typeof item.id!=='string')return null;
 const record:BookRecord={id:`google:${item.id}`,source:'google-books',sourceId:item.id,title:providerText(info.title,300),author:Array.isArray(info.authors)?info.authors.map((value:unknown)=>providerText(value,200)).filter(Boolean).slice(0,3).join('; ').slice(0,200):'Autoria não informada'};
 if(!record.author)record.author='Autoria não informada';
 const candidate=info.imageLinks?.thumbnail??info.imageLinks?.smallThumbnail;
 if(typeof candidate==='string'){
  // Upgrade only trusted provider image hosts. Persisted/user input never permits HTTP.
  let upgraded=candidate;try{const u=new URL(candidate);if(u.protocol==='http:'&&['books.google.com','books.googleusercontent.com'].includes(u.hostname))u.protocol='https:';upgraded=u.href;}catch{/* No cover when provider URL is malformed. */}
  const cover=safeCoverUrl(upgraded,'google-books');if(cover&&new URL(cover).searchParams.get('id')===item.id)record.coverUrl=cover;
 }
 const isbn=Array.isArray(info.industryIdentifiers)?info.industryIdentifiers.map((entry:any)=>providerISBN(entry?.identifier)).find(Boolean):undefined;if(isbn)record.isbn=isbn;
 if(typeof info.publishedDate==='string'&&/^[12]\d{3}/.test(info.publishedDate))record.publishedYear=info.publishedDate.slice(0,4);
 return normalizeBookRecord(record);
}
function openLibraryRecord(raw:unknown):BookRecord|null{
 if(!raw||typeof raw!=='object')return null;const item=raw as Record<string,any>;
 const sourceId=typeof item.key==='string'?item.key.replace(/^\/works\//,''):'';
 const record:BookRecord={id:`openlibrary:${sourceId}`,source:'open-library',sourceId,title:providerText(item.title,300),author:Array.isArray(item.author_name)?item.author_name.map((value:unknown)=>providerText(value,200)).filter(Boolean).slice(0,3).join('; ').slice(0,200):'Autoria não informada'};
 if(!record.author)record.author='Autoria não informada';
 if(Number.isSafeInteger(item.cover_i)&&item.cover_i>0&&item.cover_i<1e12)record.coverUrl=`https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg?default=false`;
 const isbn=Array.isArray(item.isbn)?item.isbn.map(providerISBN).find(Boolean):undefined;if(isbn)record.isbn=isbn;
 if(Number.isInteger(item.first_publish_year)&&item.first_publish_year>=1000&&item.first_publish_year<3000)record.publishedYear=String(item.first_publish_year);
 return normalizeBookRecord(record);
}
function unique(records:(BookRecord|null)[],limit:number):BookRecord[]{const ids=new Set(),works=new Set(),isbns=new Set();return records.filter((book):book is BookRecord=>{if(!book||ids.has(book.id)||works.has(bookWorkKey(book))||(book.isbn&&isbns.has(book.isbn)))return false;ids.add(book.id);works.add(bookWorkKey(book));if(book.isbn)isbns.add(book.isbn);return true;}).slice(0,limit);}

type SearchOptions={signal?:AbortSignal;limit?:number;fetchImpl?:typeof fetch;timeoutMs?:number};
async function requestJSON(url:URL,options:SearchOptions):Promise<any>{
 const controller=new AbortController();let timedOut=false;
 const abort=()=>controller.abort();
 if(options.signal?.aborted)throw new BookCatalogError('ABORTED','Busca cancelada.');
 options.signal?.addEventListener('abort',abort,{once:true});
 const timeout=setTimeout(()=>{timedOut=true;controller.abort();},options.timeoutMs??6000);
 try{
  const response=await (options.fetchImpl??fetch)(url,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer',redirect:'error'});
  if(controller.signal.aborted)throw new Error('aborted');
  if(response.status===429)throw new BookCatalogError('RATE_LIMITED','A busca recebeu muitos pedidos. Tente novamente em instantes.');
  if(!response.ok)throw new BookCatalogError('UNAVAILABLE','A busca de livros não respondeu. Tente novamente.');
  if(Number(response.headers.get('content-length'))>524288)throw new BookCatalogError('INVALID_RESPONSE','O catálogo retornou uma resposta que não conseguimos abrir.');
  const reader=response.body?.getReader();if(!reader)throw new BookCatalogError('INVALID_RESPONSE','O catálogo retornou uma resposta que não conseguimos abrir.');
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>524288){await reader.cancel();throw new BookCatalogError('INVALID_RESPONSE','O catálogo retornou uma resposta grande demais.');}chunks.push(value);}
  if(controller.signal.aborted)throw new Error('aborted');
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new BookCatalogError('INVALID_RESPONSE','O catálogo retornou uma resposta que não conseguimos abrir.');}
 }catch(error){
  if(options.signal?.aborted)throw new BookCatalogError('ABORTED','Busca cancelada.');
  if(timedOut)throw new BookCatalogError('TIMEOUT','A busca demorou mais que o esperado. Tente novamente.');
  if(error instanceof BookCatalogError)throw error;
  throw new BookCatalogError('UNAVAILABLE','Não conseguimos consultar os livros. Confira sua conexão e tente novamente.');
 }finally{clearTimeout(timeout);options.signal?.removeEventListener('abort',abort);}
}
export async function searchBooks(query:string,options:SearchOptions={}):Promise<BookSearchResult>{
 const trimmed=query.trim().replace(/\s+/g,' ');
 if(trimmed.length<2||trimmed.length>120)throw new BookCatalogError('INVALID_QUERY','Digite um título ou autor com 2 a 120 caracteres.');
 const limit=Number.isFinite(options.limit)?Math.max(1,Math.min(20,Math.floor(options.limit!))):12;
 const google=new URL('https://www.googleapis.com/books/v1/volumes');google.search=new URLSearchParams({q:trimmed,maxResults:String(limit),printType:'books',fields:'totalItems,items(id,volumeInfo(title,authors,publishedDate,imageLinks,industryIdentifiers))'}).toString();
 try{
  const data=await requestJSON(google,options);
  if(!data||typeof data!=='object'||(!Array.isArray(data.items)&&data.totalItems!==0))throw new BookCatalogError('INVALID_RESPONSE','O Google Books retornou uma resposta que não conseguimos abrir.');
  return {books:unique((data.items??[]).slice(0,20).map(googleRecord),limit),source:'google-books'};
 }catch(error){
  if(error instanceof BookCatalogError&&error.code==='ABORTED')throw error;
  if(options.signal?.aborted)throw new BookCatalogError('ABORTED','Busca cancelada.');
  const library=new URL('https://openlibrary.org/search.json');library.search=new URLSearchParams({q:trimmed,limit:String(limit),fields:'key,title,author_name,first_publish_year,cover_i,isbn',lang:'pt'}).toString();
  const data=await requestJSON(library,options);
  if(!data||!Array.isArray(data.docs))throw new BookCatalogError('INVALID_RESPONSE','A Open Library retornou uma resposta que não conseguimos abrir.');
  return {books:unique(data.docs.slice(0,20).map(openLibraryRecord),limit),source:'open-library',notice:'O Google Books está indisponível. Resultados da Open Library.'};
 }
}
