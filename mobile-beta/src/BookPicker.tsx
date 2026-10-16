import {useEffect,useRef,useState} from 'react';
import {KeyboardInput} from './mobile';
import {searchBooks,BookCatalogError,localBooks,getBookCover,bookWorkKey,type BookRecord} from './book-catalog';
import './book-picker.css';
type Props={selectedIds:string[];bookDetails?:BookRecord[];onChange:(ids:string[],details:BookRecord[])=>void};
const sameBook=(a:BookRecord,b:BookRecord)=>bookWorkKey(a)===bookWorkKey(b)||!!a.isbn&&a.isbn===b.isbn;
const sourceName=(source:BookRecord['source'])=>source==='google-books'?'Google Books':source==='open-library'?'Open Library':'Catálogo local';
function BookCover({book}:{book:BookRecord}){
 const url=getBookCover(book),[failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[url]);
 return url&&!failed?<img src={url} alt={`Capa de ${book.title}`} loading="lazy" referrerPolicy="no-referrer" draggable={false} onError={()=>setFailed(true)}/>:<span className="book-cover-fallback" role="img" aria-label={`${book.title}, sem capa disponível`}><img src="/assets/icons/book-open.svg" alt=""/><small>Sem capa</small></span>;
}
export default function BookPicker({selectedIds,bookDetails=[],onChange}:Props){
 const [query,setQuery]=useState(''),[rows,setRows]=useState<BookRecord[]>([]),[status,setStatus]=useState<'idle'|'waiting'|'loading'|'success'|'error'>('idle'),[source,setSource]=useState<'google-books'|'open-library'>('google-books'),[error,setError]=useState(''),[selectionError,setSelectionError]=useState(''),[notice,setNotice]=useState(''),[retry,setRetry]=useState(0);
 const currentRequest=useRef(0),term=query.trim().replace(/\s+/g,' ');
 const selected=selectedIds.map(id=>bookDetails.find(b=>b.id===id)||localBooks.find(b=>b.id===id));
 useEffect(()=>{
  const request=++currentRequest.current,controller=new AbortController();
  setRows([]);setError('');setNotice('');
  if(term.length<2){setStatus('idle');return()=>controller.abort();}
  setStatus('waiting');
  const timer=setTimeout(async()=>{if(controller.signal.aborted||request!==currentRequest.current)return;setStatus('loading');try{const result=await searchBooks(term,{signal:controller.signal,limit:12});if(controller.signal.aborted||request!==currentRequest.current)return;setRows(result.books);setSource(result.source);setNotice(result.notice||'');setStatus('success');}catch(cause){if(controller.signal.aborted||request!==currentRequest.current)return;if(cause instanceof BookCatalogError&&cause.code==='ABORTED')return;setError(cause instanceof BookCatalogError?cause.message:'Não conseguimos buscar agora. Tente de novo daqui a pouco.');setStatus('error');}},400);
  return()=>{clearTimeout(timer);controller.abort();};
 },[term,retry]);
 function remove(id:string){setSelectionError('');const ids=selectedIds.filter(x=>x!==id);onChange(ids,ids.map(x=>bookDetails.find(b=>b.id===x)||localBooks.find(b=>b.id===x)).filter((b):b is BookRecord=>!!b));}
 function select(book:BookRecord){setSelectionError('');if(selectedIds.includes(book.id)){remove(book.id);return;}if(selectedIds.length>=3){setSelectionError('Você já escolheu três. Remova um para colocar outro.');return;}if(selected.some(b=>b&&sameBook(b,book))){setSelectionError('Esse livro já está entre os seus três. Escolha outra obra.');return;}const ids=[...selectedIds,book.id];onChange(ids,[...selected.filter((b):b is BookRecord=>!!b),book]);}
 return <div className="book-picker">
  <p className="book-picker-intro">Escolha três livros que renderiam uma boa conversa.</p>
  <div className="book-picker-slots" aria-label="Seus três livros">{[0,1,2].map(i=>{const book=selected[i],id=selectedIds[i];return <div className="book-picker-slot" key={id||`empty-${i}`}>{book?<><div className="book-picker-selected-cover"><BookCover book={book}/></div><strong>{book.title}</strong><button type="button" aria-label={`Remover ${book.title}`} onClick={()=>remove(book.id)}>Remover</button></>:id?<><span className="book-picker-slot-empty">Livro indisponível</span><button type="button" onClick={()=>remove(id)}>Remover</button></>:<span className="book-picker-slot-empty"><img src="/assets/icons/plus.svg" alt=""/><small>Livro {i+1}</small></span>}</div>;})}</div>
  <p className="book-picker-count">{selectedIds.length} de 3 escolhidos</p>
  {selectionError&&<p className="book-picker-error" role="alert">{selectionError}</p>}
  <label className="book-picker-search">Busque um livro<KeyboardInput aria-label="Buscar livro por título ou autor" value={query} maxLength={120} placeholder="Título ou autor" onChange={e=>{setQuery(e.target.value);setSelectionError('');}} autoComplete="off"/></label>
  {term.length<2?<><p className="book-picker-help">Digite pelo menos duas letras para buscar por título ou autor.</p><h2 className="book-picker-section-title">Livros deste teste</h2><p className="book-picker-source">Catálogo local · opções já disponíveis</p></>:null}
  {(status==='waiting'||status==='loading')&&<p className="book-picker-status" role="status">Buscando livros…</p>}
  {status==='error'&&<div className="book-picker-feedback"><p className="book-picker-error" role="alert">{error}</p><button type="button" onClick={()=>setRetry(n=>n+1)}>Tentar novamente</button></div>}
  {status==='success'&&<><p className="book-picker-source">Resultados de {sourceName(source)}</p>{notice&&<p className="book-picker-help">{notice}</p>}{!rows.length&&<p className="book-picker-status" role="status">Não encontramos esse livro. Tente o nome do autor ou outra parte do título.</p>}</>}
  <div className="book-picker-results">{(term.length<2?localBooks:status==='success'?rows:[]).map(book=>{const isSelected=selectedIds.includes(book.id),sameWork=selected.some(b=>b&&sameBook(b,book));return <button className="book-picker-result" type="button" key={book.id} aria-pressed={isSelected} disabled={!isSelected&&(selectedIds.length>=3||sameWork)} onClick={()=>select(book)}><span className="book-picker-result-cover"><BookCover book={book}/></span><span className="book-picker-result-text"><strong>{book.title}</strong><span>{book.author}</span>{book.publishedYear&&<small>{book.publishedYear}</small>}<small className="book-picker-source">{sourceName(book.source)}{sameWork&&!isSelected?' · Já escolhido':''}</small></span><span className="book-picker-add" aria-hidden="true">{isSelected?'✓':'+'}</span></button>;})}</div>
 </div>;
}
