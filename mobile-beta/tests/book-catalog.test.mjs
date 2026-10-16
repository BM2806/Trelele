import test from 'node:test';
import assert from 'node:assert/strict';
import {searchBooks,BookCatalogError,normalizeBookRecord,safeCoverUrl,bookWorkKey,validateBookSelection,getProfileBooks,getBookCover,localBooks} from '../src/book-catalog.ts';
const google=(id='volumeA',title='Um livro de verdade')=>({id,volumeInfo:{title,authors:['Autora de teste'],publishedDate:'2020-04',imageLinks:{thumbnail:`http://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`},industryIdentifiers:[{identifier:'9788535914849'}]}});
const external=(id='volumeA')=>({id:`google:${id}`,source:'google-books',sourceId:id,title:'Livro externo',author:'Autora',coverUrl:`https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1`});
const json=data=>new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});

test('public Google query is trimmed, bounded and sends no key, identity or cookies; provenance survives normalization',async()=>{
 let requestUrl,requestOptions;
 const result=await searchBooks('  título    autora  ',{limit:999,fetchImpl:async(url,options)=>{requestUrl=new URL(url);requestOptions=options;return json({items:[google()],totalItems:1});}});
 assert.equal(requestUrl.origin,'https://www.googleapis.com');assert.equal(requestUrl.searchParams.get('q'),'título autora');assert.equal(requestUrl.searchParams.get('maxResults'),'20');assert.equal(requestUrl.searchParams.has('key'),false);assert.equal(requestOptions.credentials,'omit');assert.equal(requestOptions.referrerPolicy,'no-referrer');
 assert.equal(result.source,'google-books');assert.equal(result.books[0].id,'google:volumeA');assert.equal(result.books[0].publishedYear,'2020');assert.match(result.books[0].coverUrl,/^https:\/\/books\.google\.com\//);assert.equal(result.books[0].sourceId,'volumeA');
});

test('429 falls back to real Open Library response and makes the provider change explicit',async()=>{
 const calls=[];const result=await searchBooks('Machado de Assis',{fetchImpl:async url=>{calls.push(new URL(url));return calls.length===1?new Response('',{status:429}):json({docs:[{key:'/works/OL123W',title:'Dom Casmurro',author_name:['Machado de Assis'],first_publish_year:1899,cover_i:12345}]});}});
 assert.equal(calls.length,2);assert.equal(calls[1].origin,'https://openlibrary.org');assert.equal(result.source,'open-library');assert.match(result.notice,/Open Library/);assert.equal(result.books[0].id,'openlibrary:OL123W');assert.equal(result.books[0].coverUrl,'https://covers.openlibrary.org/b/id/12345-M.jpg?default=false');assert.equal(result.books[0].publishedYear,'1899');
});

test('offline and missing-key rejection never become fabricated local search results',async()=>{
 let count=0;await assert.rejects(searchBooks('Livro',{fetchImpl:async()=>{count++;if(count===1)return new Response('',{status:403});throw new TypeError('offline');}}),error=>error instanceof BookCatalogError&&error.code==='UNAVAILABLE'&&/conexão/.test(error.message));assert.equal(count,2);
});

test('valid empty Google results remain empty, without swapping in unrelated fixtures',async()=>{
 let calls=0;const result=await searchBooks('Não existe aqui',{fetchImpl:async()=>{calls++;return json({totalItems:0});}});assert.deepEqual(result.books,[]);assert.equal(calls,1);assert.equal(result.notice,undefined);
});

test('titles/authors are plain bounded metadata, malformed/duplicate editions are excluded',async()=>{
 const bad=google('bad');bad.id='javascript:bad';
 const duplicate=google('other-id','UM LIVRO DE VERDADE!');duplicate.volumeInfo.authors=['Autóra de teste'];
 const result=await searchBooks('livro',{fetchImpl:async()=>json({items:[google(),duplicate,bad],totalItems:3})});assert.equal(result.books.length,1);assert.equal(result.books[0].id,'google:volumeA');
 const withoutCover=google('no-cover','Outro');withoutCover.volumeInfo.imageLinks={thumbnail:'https://evil.example/face.svg'};const noCover=await searchBooks('outro',{fetchImpl:async()=>json({items:[withoutCover],totalItems:1})});assert.equal(noCover.books[0].coverUrl,undefined);
});

test('cover allowlist blocks author photographs, SVG, credentials, malicious hosts and URL redirects',()=>{
 for(const url of ['javascript:alert(1)','data:image/svg+xml,evil','https://books.google.com.evil.test/books/content?id=x&img=1','https://user:pass@books.google.com/books/content?id=x&img=1','https://books.google.com:444/books/content?id=x&img=1','https://covers.openlibrary.org/a/id/123-M.jpg','https://covers.openlibrary.org/b/id/123-M.svg','https://books.google.com/books/content?id=x&img=1&url=https://evil.test','http://covers.openlibrary.org/b/id/123-M.jpg','https://covers.openlibrary.org/b/id/123-M.jpg#private'])assert.equal(safeCoverUrl(url),undefined,url);
 assert.equal(safeCoverUrl('https://covers.openlibrary.org/b/id/123-M.jpg?default=false'),'https://covers.openlibrary.org/b/id/123-M.jpg?default=false');
});

test('persistable records are namespaced, whitelisted and cannot select a different volume cover',()=>{
 assert.ok(normalizeBookRecord(external()));
 for(const change of [{id:'estrela'},{sourceId:'other'},{source:'apple-books'},{token:'secret'},{coverUrl:'https://books.google.com/books/content?id=other&img=1'},{coverUrl:'http://books.google.com/books/content?id=volumeA&img=1'},{title:'x'.repeat(301)},{publishedYear:'unknown'},{isbn:'1234567890'}])assert.equal(normalizeBookRecord({...external(),...change}),null);
 assert.equal(normalizeBookRecord({...localBooks[0],title:'Local falso'}),null);
});

test('three IDs from different providers cannot count as three copies of one title and author',()=>{
 const first={...external('first'),title:'Água viva',author:'Clarice Lispector'};
 const second={id:'openlibrary:OL456W',source:'open-library',sourceId:'OL456W',title:'AGUA VIVA!',author:'Clarice  Lispector'};
 assert.equal(bookWorkKey(first),bookWorkKey(second));assert.equal(validateBookSelection([first.id,second.id,'rio'],[first,second]),null);
 assert.equal(validateBookSelection(['google:missing','rio','estrela'],[]),null);
 assert.equal(validateBookSelection(['rio','estrela','torto'],[{...external()}]),null);
});

test('legacy curated IDs resolve without metadata; unknown IDs never invent titles or covers',()=>{
 assert.equal(getProfileBooks({books:['estrela','rio','torto']}).length,3);assert.equal(getBookCover(localBooks[0]),`/assets/books/cover-${localBooks[0].id}.jpg`);assert.deepEqual(getProfileBooks({books:['unknown']}),[]);assert.equal(getBookCover({...external(),coverUrl:'https://evil.test/me'}),undefined);
});

test('late response to an aborted old search is rejected and never starts a fallback',async()=>{
 const controller=new AbortController();let finish,requests=0;
 const pending=searchBooks('consulta antiga',{signal:controller.signal,fetchImpl:async()=>{requests++;return new Promise(resolve=>{finish=resolve;});}});
 controller.abort();finish(json({items:[google()],totalItems:1}));await assert.rejects(pending,error=>error.code==='ABORTED');assert.equal(requests,1);
});

test('timeout cancels each provider request and returns a visible error when both are unavailable',async()=>{
 let count=0;const mock=async(_url,{signal})=>{count++;return new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true}));};
 await assert.rejects(searchBooks('livro',{fetchImpl:mock,timeoutMs:5}),error=>error.code==='TIMEOUT');assert.equal(count,2);
});

test('malformed and oversized responses fail visibly instead of becoming results',async()=>{
 await assert.rejects(searchBooks('livro',{fetchImpl:async()=>json({unexpected:true})}),error=>error.code==='INVALID_RESPONSE');
 await assert.rejects(searchBooks('livro',{fetchImpl:async()=>new Response('x'.repeat(524289))}),error=>error.code==='INVALID_RESPONSE');
 let called=false;await assert.rejects(searchBooks('x',{fetchImpl:async()=>{called=true;return json({totalItems:0});}}),error=>error.code==='INVALID_QUERY');assert.equal(called,false);
});
