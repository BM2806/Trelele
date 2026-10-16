import { strings } from '../copy.mjs';
import { classifySwipe } from '../interaction.mjs';
import { session as s, books, profiles, person, book, match, blocked, sent, activeMatches, matchPerson, shared, available, candidates, received, sentPeople, message, decide, rewind, reveal, consent, revoke, simulate, endContact } from './state.mjs';
import { esc, icon, button, cover, avatar, empty, portrait } from './components.mjs';

const $=selector=>document.querySelector(selector);
let route=parseRoute(), modal=null, modalParent=null, modalOrigin=null, expandedBook=null, drag=null, suppressTap=0;
let mode=route.view==='discover'?route.mode:'nearby', deckPerson=null;
const rootViews=['discover','connections','chat','profile'];
const routeKey=r=>r.view+(r.id?`/${r.id}`:r.mode?`/${r.mode}`:r.edit?'/edit':'');
function parseRoute(){
 const [view,value]=location.hash.slice(1).split('/');
 if(view==='people'&&available(value))return {view,id:value};
 if(view==='chat'&&value&&available(value)&&match(value)?.status==='ACTIVE')return {view,id:value};
 if(view==='profile')return {view,edit:value==='edit'};
 if(view==='connections'||view==='chat')return {view};
 if(view==='studio')return {view};
 return {view:'discover',mode:value==='for-you'?'for-you':'nearby'};
}
const url=r=>`#${routeKey(r)}`;
const currentId=()=>route.id;
function capture(){
 const key=routeKey(route),entry=s.scrolls[key]??{};
 entry.main=$('#main').scrollTop;entry.focus=document.activeElement?.dataset?.focus;
 if(route.view==='chat'&&route.id){entry.messages=$('.messages')?.scrollTop??0;s.drafts[route.id]=$('#message')?.value??s.drafts[route.id]??'';}
 s.scrolls[key]=entry;
}
function navigate(next,{replace=false,origin=true}={}){
 capture();
 if(modal){hideModal();replace=true;}
 if(next.view==='people'&&origin)next={...next,origin:route};
 if(next.view==='discover')mode=next.mode??mode;
 route=next;expandedBook=null;
 history[replace?'replaceState':'pushState']({route},'',url(route));render(true);
}
function back(){
 if(modal){closeModal();return;}
 if(route.view==='people'){const origin=route.origin??{view:'discover',mode};navigate(origin,{replace:true,origin:false});return;}
 if(route.view==='chat'&&route.id){navigate({view:'chat'},{replace:true});return;}
 if(route.view==='profile'&&route.edit){navigate({view:'profile'},{replace:true});return;}
 if(route.view==='studio'){navigate(route.origin??{view:'profile'},{replace:true});}
}
window.addEventListener('popstate',event=>{
 capture();
 if(modal&&event.state?.modal!==modal.token){hideModal();}
 route=event.state?.route??parseRoute();
 if(route.view==='people'&&!available(route.id))route={view:'discover',mode};
 if(route.view==='chat'&&route.id&&(!available(route.id)||match(route.id)?.status!=='ACTIVE'))route={view:'chat'};
 if(event.state?.modal){const candidate=event.state.modalData;const id=candidate?.data?.id;const valid=['how','project','filters','bio','setting','reset'].includes(candidate?.type)||(available(id)&&(candidate.type!=='match'||match(id)?.status==='ACTIVE'));if(valid){modal={...candidate,token:event.state.modal};drawModal();}else{hideModal();history.replaceState({route},'',url(route));}}
 render(true);
});
function notify(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
function header(){
 const detail=route.view==='people'||route.view==='chat'&&route.id||route.edit||route.view==='studio';
 $('#nav').hidden=Boolean(detail);
 $('.app-shell').classList.toggle('thread-mode',route.view==='chat'&&Boolean(route.id));
 let content;
 if(route.view==='people'){const p=person(route.id);content=`${button('back','Voltar à tela anterior','back')}<span class="header-detail">Conheça ${esc(p.name)}</span>${button('safety','Opções deste perfil','more','',p.id)}`;}
 else if(route.view==='chat'&&route.id){const p=person(route.id);content=`${button('back','Voltar para conversas','back')}<button class="thread-person" data-action="person" data-id="${p.id}">${avatar(p)}<span><strong>${p.name}</strong><small>Foto oculta · perfil fictício</small></span></button>${button('safety','Opções da conversa','more','',p.id)}`;}
 else if(route.edit)content=`${button('back','Voltar ao meu perfil','back')}<span class="header-detail">Editar perfil</span><button class="text-btn light" data-action="back">Concluir</button>`;
 else if(route.view==='studio')content=`${button('back','Voltar','back')}<span class="header-detail">Nos bastidores</span>${button('project','Sobre a demonstração','info')}`;
 else content=`<button class="brand" data-view="discover" aria-label="Trelelê, descobrir"><span class="brand-mark">t.</span>trelelê<span class="demo-label">DEMO · 18+</span></button>${route.view==='discover'?button('filters','Preferências de descoberta','filter'):button('project','Sobre este teste fictício','info')}`;
 $('#header').innerHTML=content;
 $('#nav').innerHTML=[['discover','Descobrir','discover'],['connections','Curtidas','heart'],['chat','Conversas','chat'],['profile','Meu perfil','profile']].map(([view,label,ic])=>`<button data-view="${view}" class="${route.view===view?'active':''}" ${route.view===view?'aria-current="page"':''}>${icon(ic)}<span>${label}</span>${view==='chat'&&activeMatches().some(m=>!m.messages.length)?'<i></i>':''}</button>`).join('');
}
function render(focus=false){
 if(route.id&&!available(route.id)){route={view:route.view==='chat'?'chat':'discover',...(route.view==='chat'?{}:{mode})};history.replaceState({route},'',url(route));}
 header();
 const main=$('#main');main.dataset.screen=route.view;main.dataset.person=route.id??'';main.className=`screen screen-${route.view}${route.id?' has-detail':''}${route.edit?' edit-mode':''}`;
 main.innerHTML=({discover,connections,inbox,profile,people,thread,studio}[route.view==='chat'?(route.id?'thread':'inbox'):route.view])();
 const scroll=s.scrolls[routeKey(route)];main.scrollTop=scroll?.main??0;
 if(route.view==='chat'&&route.id){const log=$('.messages');log.scrollTop=scroll?.messages??log.scrollHeight;}
 if(focus){const target=scroll?.focus&&[...document.querySelectorAll('[data-focus]')].find(el=>el.dataset.focus===scroll.focus);(target??main).focus({preventScroll:true});}
 document.title=`Trelelê · ${route.id?person(route.id).name:({discover:'Descobrir',connections:'Curtidas',chat:'Conversas',profile:'Meu perfil',studio:'Bastidores'}[route.view])}`;
}
function discover(){
 const list=candidates();
 const segments=`<div class="segments" aria-label="Modo de descoberta"><button data-action="discovery-mode" data-mode="for-you" aria-pressed="${mode==='for-you'}">Para você</button><button data-action="discovery-mode" data-mode="nearby" aria-pressed="${mode==='nearby'}">Por perto</button></div>`;
 const context=`<div class="discovery-context"><span>${icon('pin')} ${esc(s.preferences.city)}</span><small>Perfis fictícios · fotos após conversa e duplo aceite</small></div>`;
 if(s.paused)return segments+empty(strings.pauseTitle,strings.pauseBody,'<button class="primary" data-action="pause">Voltar a descobrir</button>');
 if(!list.length)return segments+context+empty(strings.endTitle,strings.endBody,'<button class="primary" data-action="review">Ver perfis de novo</button><button class="text-btn" data-action="filters">Ajustar preferências</button>');
 if(mode==='nearby')return segments+context+`<section class="nearby-board" aria-label="Pessoas no cenário fictício">${list.map(tile).join('')}</section>`;
 const p=list.find(p=>p.id===deckPerson)??list[0];deckPerson=p.id;
 const index=Math.min(s.books[p.id]??0,p.books.length-1),b=book(p.books[index]);
 return segments+`<article class="opinion-card" data-person="${p.id}"><div class="deck-identity"><div><h1>${p.name}<span>, ${p.age}</span></h1><p>${p.city} · ${p.intent}</p></div><button data-action="person" data-id="${p.id}" data-focus="deck-profile" class="profile-link">Perfil ${icon('next')}</button></div><div class="book-stage"><button class="book-turn" data-action="book-next" data-id="${p.id}" aria-label="Próximo livro de ${p.name}">${cover(b.id)}</button><div><span class="eyebrow">UM DOS MEUS LIVROS</span><h2>${esc(b.title)}</h2><p>${esc(b.author)}</p><div class="book-pagination">${p.books.map((_,i)=>`<button data-action="book-index" data-id="${p.id}" data-index="${i}" aria-label="Livro ${i+1} de ${p.books.length}" aria-pressed="${index===i}"></button>`).join('')}</div><span class="stage-hint">${index+1} de ${p.books.length} ${icon('next')}</span></div></div><div class="opinion-panel"><blockquote>“${esc(p.bookOpinions[b.id])}”</blockquote></div><div class="deck-affinity">${icon('discover')}<span>${shared(p).length?`${shared(p).length} livros em comum`:'Um novo livro para conhecer'}</span><button data-action="how" aria-label="Como funciona a foto oculta">${icon('lock')}</button></div></article><div class="deck-actions">${button('rewind','Voltar ao último perfil passado','rewind','rewind')}<button class="decision pass" data-action="pass" data-id="${p.id}">${icon('close')}<span>Passar</span></button><button class="decision like" data-action="like" data-id="${p.id}">${icon('heart')}<span>Curtir</span></button></div><p class="deck-note">Perfis fictícios · fotos após conversa e duplo aceite</p>`;
}
function tile(p){return `<button class="person-tile" data-action="person" data-id="${p.id}" data-focus="tile-${p.id}" aria-label="Conhecer ${p.name}, ${p.age}, perfil fictício"><span class="tile-identity"><strong>${p.name}<span>, ${p.age}</span></strong>${icon('next')}</span><span class="tile-stage">${cover(p.books[0],'',false)}</span><span class="tile-copy"><span class="tile-quote">“${esc(p.bookOpinions[p.books[0]])}”</span></span></button>`;}
function people(){
 const p=person(route.id),ids=shared(p),m=match(p.id);
 return `<article class="person-profile"><div class="person-intro"><span class="eyebrow">PERFIL FICTÍCIO · FOTO OCULTA</span><h1>${p.name}<span>, ${p.age}</span></h1><p>${p.city}</p><div class="intent-line">${icon('heart')} ${p.intent}</div></div><div class="profile-quote"><span class="eyebrow">UM LIVRO PARA COMEÇAR</span><blockquote>“${esc(p.quote)}”</blockquote></div><section class="bio-section"><h2>Além dos livros</h2><p>${esc(p.note)}</p></section><section class="shelf-section"><div class="section-heading"><h2>Na estante de ${p.name}</h2><span>${p.books.length} livros</span></div><p class="section-note">Toque numa capa para ler a opinião.</p><div class="profile-shelf">${p.books.map(id=>`<div class="shelf-entry"><button class="shelf-book" data-action="book" data-id="${id}" aria-expanded="${expandedBook===id}" aria-controls="opinion-${id}">${cover(id)}<span>${esc(book(id).title)}</span>${icon(expandedBook===id?'close':'next')}</button><div class="inline-opinion" id="opinion-${id}" ${expandedBook===id?'':'hidden'}><strong>${esc(book(id).title)}</strong><p>“${esc(p.bookOpinions[id])}”</p><small>${esc(book(id).author)}</small></div></div>`).join('')}</div></section><div class="shared-line">${icon('discover')}<p>${ids.length?strings.sharedBooks(ids.map(id=>book(id).title)):strings.noSharedBooks}</p></div><button class="settings-row" data-action="safety" data-id="${p.id}"><span>Bloquear ou denunciar</span>${icon('more')}</button><div class="profile-actions">${m?.status==='ACTIVE'?`<button class="primary" data-action="open-chat" data-id="${p.id}">${icon('chat')} Abrir conversa</button>`:sent(p.id)?`<span class="sent-state">${icon('check')} Curtida enviada</span>`:`<button class="secondary" data-action="pass" data-id="${p.id}">Passar</button><button class="primary" data-action="like" data-id="${p.id}">${icon('heart')} Curtir ${p.name}</button>`}</div></article>`;
}
function connections(){
 return `<div class="page-heading"><span class="eyebrow">QUANDO O INTERESSE VAI E VOLTA</span><h1>Curtidas</h1><p>Um livro chamou a atenção. Agora conheça a pessoa.</p></div><section><div class="section-heading"><h2>Recebidas</h2><span>${received().length}</span></div><div class="likes-board">${received().map(tile).join('')||empty(strings.receivedEmpty,strings.receivedEmptyBody)}</div></section><section class="sent-list"><div class="section-heading"><h2>Você curtiu</h2><span>${sentPeople().length}</span></div>${sentPeople().map(p=>personRow(p,'Curtida enviada · ainda sem match','person')).join('')||'<p class="section-note">Suas próximas curtidas aparecem aqui.</p>'}</section><p class="privacy-line">${icon('lock')} As fotos continuam ocultas.</p>`;
}
function personRow(p,subtitle,action='open-chat'){return `<button class="person-row" data-action="${action}" data-id="${p.id}" data-focus="row-${p.id}">${avatar(p)}<span><strong>${p.name}<span>, ${p.age}</span></strong><small>${esc(subtitle)}</small></span>${icon('next')}</button>`;}
function inbox(){
 const all=activeMatches(),fresh=all.filter(m=>!m.messages.length),threads=all.filter(m=>m.messages.length);
 return `<div class="page-heading"><span class="eyebrow">TEM ASSUNTO AQUI</span><h1>Conversas<span class="title-dot">.</span></h1></div><section class="new-connections"><div class="section-heading"><h2>Novos matches</h2><span>${fresh.length}</span></div>${fresh.length?`<div class="match-strip">${fresh.map(m=>{const p=matchPerson(m);return `<button data-action="open-chat" data-id="${p.id}">${avatar(p)}<strong>${p.name}</strong><small>Diga um oi</small></button>`;}).join('')}</div>`:'<p class="section-note">Quando o interesse for mútuo, aparece aqui.</p>'}</section><section class="conversation-list"><div class="section-heading"><h2>Mensagens</h2><span>${threads.length}</span></div>${threads.map(m=>{const p=matchPerson(m),last=m.messages.at(-1);return personRow(p,`${last.from==='you'?'Você: ':''}${last.text}`);}).join('')||empty(strings.inboxEmpty,strings.inboxEmptyBody,'<button class="primary" data-view="discover">Descobrir pessoas</button>')}</section><p class="privacy-line">Teste fictício · ninguém recebe suas mensagens.</p>`;
}
function thread(){
 const p=person(route.id),m=match(p.id),rv=reveal(p.id),isRevealed=rv.status==='REVEALED';
 return `<div class="thread"><div class="thread-context">${icon('discover')}<span>${shared(p).length?strings.sharedBooks(shared(p).map(id=>book(id).title)):'O assunto pode começar pelos livros.'}</span>${button('project','Simulação e informações do teste','info')}</div><button class="photo-status" data-action="photo">${icon('lock')}<span>${isRevealed?'Ilustrações liberadas':rv.ownConsent?'Sua escolha de mostrar foi registrada':rv.status==='ELIGIBLE'?'Vocês já podem escolher mostrar a foto':'Foto oculta · primeiro, a conversa'}</span>${icon('next')}</button><div class="messages" role="log" aria-label="Conversa fictícia" aria-live="polite"><div class="chat-begin"><span>Vocês se curtiram</span><p>Que tal começar pelo livro?</p></div>${m.messages.map(x=>`<div class="message ${x.from==='you'?'own':''}"><p>${esc(x.text)}</p><small>${x.from==='you'?'Você':p.name} · teste</small></div>`).join('')}</div><div class="composer-wrap"><p class="chat-demo">${strings.threadDemo}</p><form data-form="chat" data-person="${p.id}" class="composer"><label for="message" class="sr-only">Mensagem de teste</label><input id="message" name="message" data-focus="composer-${p.id}" maxlength="2000" autocomplete="off" placeholder="${strings.composer}" value="${esc(s.drafts[p.id]??'')}" required><button type="submit" aria-label="Adicionar mensagem fictícia">${icon('send')}</button></form></div></div>`;
}
function photoPanel(p){const rv=reveal(p.id),isRevealed=rv.status==='REVEALED';return `<section class="reveal-card">${isRevealed?`<div class="portraits">${portrait(s.me.name)}${portrait(p.name,1)}</div><h2>Fotos liberadas</h2><p>${strings.revealedBody}</p><button class="text-btn" data-action="revoke">Deixar de mostrar minha foto</button>`:`<div class="reveal-heading">${icon('lock')}<h2>${rv.status==='ELIGIBLE'?(rv.ownConsent?strings.revealAccepted:strings.revealReadyTitle):strings.revealLockedTitle}</h2></div><p>${rv.status==='ELIGIBLE'?(rv.ownConsent?strings.revealAcceptedBody:strings.revealReadyBody):'Primeiro, tempo para conversar. Depois, a escolha de cada um.'}</p>${rv.status==='ELIGIBLE'?(rv.ownConsent?'<button class="text-btn" data-action="revoke">Mudei de ideia</button>':`<button class="primary" data-action="consent">${strings.revealAction}</button>`):'<button class="text-btn" data-action="how">Quando a foto aparece?</button>'}`}</section>`;}

function profile(){
 const me=s.me;
 if(route.edit)return `<div class="edit-intro"><h1>Do seu jeito<span class="title-dot">.</span></h1><p>Use só informações fictícias neste teste.</p></div><button class="settings-row" data-action="edit-bio"><span>Nome e apresentação<small>${esc(me.name)}, ${me.age}</small></span>${icon('next')}</button>${[['intent','O que você procura'],['relationship','Relacionamento'],['interest','Se interessa por']].map(([key,label])=>`<button class="settings-row" data-action="select-setting" data-key="${key}"><span>${label}<small>${esc(me[key])}</small></span>${icon('next')}</button>`).join('')}<section class="edit-shelf"><div class="section-heading"><h2>Seus livros</h2><span>${me.books.length}/5</span></div><p class="section-note">Escolha de um a cinco livros.</p><div class="book-picker">${books.map(b=>`<button data-action="toggle-book" data-id="${b.id}" aria-pressed="${me.books.includes(b.id)}">${cover(b.id)}<span>${icon(me.books.includes(b.id)?'check':'discover')}</span></button>`).join('')}</div></section>`;
 return `<div class="my-profile"><div class="my-profile-heading"><span class="eyebrow">SEU JEITO DE COMEÇAR</span><h1>${esc(me.name)}<span>, ${me.age}</span></h1><p>${esc(me.city)} · ${esc(me.intent)}</p></div><div class="my-books">${me.books.map(id=>cover(id)).join('')}</div><div class="my-bio"><p>${esc(me.bio)}</p><span>${esc(me.relationship)}</span></div><button class="primary" data-action="edit-mode">Editar meu perfil ${icon('next')}</button><button class="settings-row" data-action="filters"><span>Preferências de descoberta<small>${esc(s.preferences.city)} · ${s.preferences.min} a ${s.preferences.max} anos</small></span>${icon('filter')}</button><button class="settings-row" data-action="pause" role="switch" aria-checked="${s.paused}"><span>Pausar descoberta<small>${s.paused?'Seu perfil está pausado':'Seu perfil pode aparecer no teste'}</small></span><span class="switch ${s.paused?'on':''}"></span></button><button class="settings-row" data-action="project"><span>Sobre esta demonstração<small>Perfis fictícios · maiores de 18 anos</small></span>${icon('info')}</button><p class="privacy-line">Seus livros aparecem antes da foto.</p></div>`;
}
function studio(){return `<div class="page-heading"><span class="eyebrow">PROTÓTIPO TRELELÊ</span><h1>Como foi feito.</h1><p>Referências, decisões e arquivos deste teste.</p></div><a class="settings-row" href="./pesquisa.html">Pesquisa de interação ${icon('next')}</a><a class="settings-row" href="./assets/v5/asset-manifest.json">Fontes e capas ${icon('next')}</a><a class="settings-row" href="./trelele-desenvolvimento.zip" download>Pacote de desenvolvimento ${icon('next')}</a><p class="section-note">Demonstração estática: sem conta, chat real, cobrança ou proteção de fotos em produção.</p>`;}

let modalSequence=0;
function openModal(type,data={},parent=null){
 capture();modalOrigin=document.activeElement;modalParent=parent;
 const wasOpen=Boolean(modal);modal={type,data,token:++modalSequence};
 history[wasOpen?'replaceState':'pushState']({route,modal:modal.token,modalData:{type,data}},'',url(route));
 drawModal();
}
function hideModal(){modal=null;modalParent=null;if($('#dialog').open)$('#dialog').close();}
function closeModal(){if(!modal)return;hideModal();history.back();modalOrigin?.focus?.({preventScroll:true});}
function drawModal(){
 if(!modal)return;
 const {type,data}=modal;let title='',body='',actions='';
 if(type==='photo'){title='Você decide sobre a foto';body=photoPanel(person(route.id));}
 if(type==='how'){title=strings.howTitle;body=`<p>${strings.howBody}</p><div class="rule-box">${icon('lock')}<p>${strings.revealRule}</p></div><p class="section-note">Na demo, só ilustrações são liberadas.</p>`;}
 if(type==='project'){
  title='Um teste para começar';body=`<span class="eyebrow">TRELELÊ · DEMONSTRAÇÃO 18+</span><p>${strings.projectBody}</p>`;
  if(route.view==='chat'&&route.id)body+=`<div class="demo-tools"><h3>${strings.demoControls}</h3><p>${strings.demoControlsBody}</p><button class="settings-row" data-action="simulate-reply">${strings.simulateReply(person(route.id).name)} ${icon('next')}</button><button class="settings-row" data-action="simulate-time">${strings.simulateTime} ${icon('next')}</button><button class="settings-row" data-action="simulate-consent">${strings.simulateConsent(person(route.id).name)} ${icon('next')}</button><button class="settings-row" data-action="simulate-photo">Simular troca de ilustração ${icon('next')}</button></div>`;
  actions='<button class="secondary" data-action="studio">Referências e arquivos</button><button class="text-btn" data-action="reset">Recomeçar o teste</button>';
 }
 if(type==='match'){
  const p=person(data.id);title='Deu match!';body=`<div class="match-art"><span class="match-letter">t.</span><div>${cover(s.me.books[0])}${cover(p.books[0])}</div></div><p class="match-line">Você e <strong>${p.name}</strong><br>já têm por onde começar.</p><p class="section-note">A foto continua oculta. A conversa está aberta.</p>`;actions=`<button class="primary" data-action="match-chat" data-id="${p.id}">Mandar mensagem ${icon('chat')}</button><button class="text-btn" data-action="close">Continuar vendo perfis</button>`;
 }
 if(type==='filters'){
  const f=s.preferences;title='Quem aparece por aqui';body=`<form data-form="filters" id="filters-form"><label>Cidade do cenário<select name="city">${['São Paulo','Rio de Janeiro'].map(x=>`<option ${f.city===x?'selected':''}>${x}</option>`).join('')}</select></label><div class="form-pair"><label>Idade mínima<input type="number" min="18" max="99" name="min" value="${f.min}" required></label><label>Idade máxima<input type="number" min="18" max="99" name="max" value="${f.max}" required></label></div><label>Leitura<select name="genre">${['Tudo','Ficção brasileira','Romance','Suspense'].map(x=>`<option ${f.genre===x?'selected':''}>${x}</option>`).join('')}</select></label><p class="section-note">Cidade fictícia. Não usamos sua localização.</p><p class="form-error" role="alert"></p></form>`;actions='<button class="primary" type="submit" form="filters-form">Aplicar filtros</button><button class="text-btn" data-action="close">Cancelar</button>';
 }
 if(type==='safety'){
  title='Você escolhe como continuar';body=`<p>Opções para o perfil fictício de ${person(data.id).name}.</p><button class="settings-row danger" data-action="block" data-id="${data.id}">Bloquear perfil ${icon('next')}</button><button class="settings-row" data-action="report" data-id="${data.id}">Denúncia de teste ${icon('next')}</button>${match(data.id)?.status==='ACTIVE'?`<button class="settings-row danger" data-action="unmatch" data-id="${data.id}">Desfazer match ${icon('next')}</button>`:''}`;
 }
 if(type==='confirm'){
  title=data.kind==='block'?strings.blockTitle:strings.unmatchTitle;body=`<p>${data.kind==='block'?strings.blockBody:strings.unmatchBody}</p>`;actions=`<button class="primary danger-fill" data-action="confirm" data-id="${data.id}" data-kind="${data.kind}">${data.kind==='block'?'Bloquear':'Desfazer match'}</button><button class="text-btn" data-action="safety" data-id="${data.id}">Cancelar</button>`;
 }
 if(type==='report'){
  title=strings.reportTitle;body=`<p>${strings.reportBody}</p><form data-form="report" data-person="${data.id}" id="report-form"><label>Motivo<select name="reason"><option>Comportamento inadequado</option><option>Perfil parece falso</option><option>Outro motivo</option></select></label><label class="check-label"><input type="checkbox" name="block">Bloquear este perfil também</label></form>`;actions=`<button class="primary" type="submit" form="report-form">Salvar neste teste</button><button class="text-btn" data-action="safety" data-id="${data.id}">Cancelar</button>`;
 }
 if(type==='bio'){
  title='Sua apresentação';body=`<form data-form="bio" id="bio-form"><p class="section-note">Preencha com informações fictícias.</p><label>Nome<input name="name" value="${esc(s.me.name)}" maxlength="32" required></label><label>Idade<input type="number" min="18" max="99" name="age" value="${s.me.age}" required></label><label>Sobre você<textarea name="bio" maxlength="500" required>${esc(s.me.bio)}</textarea></label><p class="form-error" role="alert"></p></form>`;actions='<button class="primary" type="submit" form="bio-form">Salvar</button><button class="text-btn" data-action="close">Cancelar</button>';
 }
 if(type==='setting'){
  const options={intent:['Quero namorar','Quero conhecer alguém','Ainda não sei'],relationship:['Monogamia','Não monogamia','Ainda não sei'],interest:['Todos','Mulheres','Homens']}[data.key];title={intent:'O que você procura?',relationship:'Tipo de relacionamento',interest:'Se interessa por'}[data.key];body=`<form data-form="setting" data-key="${data.key}" id="setting-form">${options.map(value=>`<label class="radio-option"><input type="radio" name="value" value="${value}" ${s.me[data.key]===value?'checked':''}>${value}</label>`).join('')}</form>`;actions='<button class="primary" type="submit" form="setting-form">Concluir</button><button class="text-btn" data-action="close">Cancelar</button>';
 }
 if(type==='reset'){title='Recomeçar este teste?';body='<p>As mensagens, as escolhas e a apresentação fictícia desta sessão serão apagadas.</p>';actions='<button class="primary danger-fill" data-action="confirm-reset">Recomeçar</button><button class="text-btn" data-action="project">Cancelar</button>';}
 $('#dialog').className=`sheet sheet-${type}`;
 $('#dialog-content').innerHTML=`<div class="sheet-grip"></div><div class="dialog-title"><h2 id="dialog-title">${title}</h2>${button('close','Fechar','close')}</div><div class="dialog-body">${body}</div>${actions?`<div class="dialog-actions">${actions}</div>`:''}`;
 if(!$('#dialog').open)$('#dialog').showModal();
}
function decision(id,action){
 if(!id||!available(id))return;
 const origin=route.view==='people'?route.origin??{view:'discover',mode}:route;
 const result=decide(id,action);deckPerson=null;
 if(action==='pass'||result){navigate(origin,{replace:route.view==='people',origin:false});}
 else {capture();render();notify('Curtida enviada. O match depende dos dois.');}
 if(result)openModal('match',{id});
}
function updateThread(bottom=false){capture();if(bottom)delete s.scrolls[routeKey(route)];render();if(modal)drawModal();}
function act(action,el){
 const id=el.dataset.id;
 switch(action){
  case 'discovery-mode':mode=el.dataset.mode;navigate({view:'discover',mode});break;
  case 'person':if(available(id))navigate({view:'people',id});break;
  case 'back':back();break;
  case 'inbox':navigate({view:'chat'},{replace:true});break;
  case 'open-chat':case 'match-chat':if(match(id)?.status==='ACTIVE')navigate({view:'chat',id},{replace:Boolean(modal)});break;
  case 'like':case 'pass':decision(id,action);break;
  case 'rewind':{const restored=rewind();if(restored){deckPerson=restored;render();notify('O perfil anterior voltou.');}else notify('Você ainda não passou nenhum perfil disponível.');break;}
  case 'book-next':s.books[id]=((s.books[id]??0)+1)%person(id).books.length;capture();render();break;
  case 'book-index':s.books[id]=Number(el.dataset.index);capture();render();break;
  case 'book':capture();expandedBook=expandedBook===id?null:id;render();break;
  case 'review':s.passed.clear();s.decisions=[];render();break;
  case 'filters':openModal('filters');break;
  case 'how':openModal('how');break;
  case 'photo':openModal('photo',{id:currentId()});break;
  case 'project':openModal('project');break;
  case 'safety':openModal('safety',{id:id??currentId()});break;
  case 'block':case 'unmatch':openModal('confirm',{id,kind:action});break;
  case 'report':openModal('report',{id});break;
  case 'confirm':endContact(id,el.dataset.kind);navigate({view:route.view==='chat'?'chat':'discover',...(route.view==='chat'?{}:{mode})},{replace:true});notify(el.dataset.kind==='block'?'Perfil bloqueado neste teste.':'Match desfeito neste teste.');break;
  case 'consent':try{consent(currentId());updateThread();notify('Você escolheu mostrar sua foto neste teste.');}catch{notify('Ainda falta tempo ou respostas dos dois.');}break;
  case 'revoke':revoke(currentId());updateThread();notify('Sua escolha de mostrar foi retirada.');break;
  case 'simulate-reply':case 'simulate-time':case 'simulate-consent':case 'simulate-photo':try{simulate(currentId(),action.slice(9));updateThread(true);drawModal();notify(action==='simulate-time'?strings.simulateDone:'Simulação aplicada só nesta conversa.');}catch{notify('Ainda falta tempo ou resposta dos dois.');}break;
  case 'close':closeModal();break;
  case 'studio':navigate({view:'studio',origin:route},{replace:true});break;
  case 'edit-mode':navigate({view:'profile',edit:true});break;
  case 'edit-bio':openModal('bio');break;
  case 'select-setting':openModal('setting',{key:el.dataset.key});break;
  case 'toggle-book':{const chosen=s.me.books.includes(id);if(chosen&&s.me.books.length===1){notify('Mantenha pelo menos um livro.');break;}if(!chosen&&s.me.books.length===5){notify('Você pode escolher até cinco livros.');break;}s.me.books=chosen?s.me.books.filter(x=>x!==id):[...s.me.books,id];capture();render();break;}
  case 'pause':s.paused=!s.paused;capture();render();break;
  case 'reset':openModal('reset');break;
  case 'confirm-reset':location.reload();break;
 }
}
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action],[data-view]');if(!el)return;
 if(Date.now()<suppressTap){event.preventDefault();return;}
 if(el.dataset.view){navigate({view:el.dataset.view,...(el.dataset.view==='discover'?{mode}:{})});return;}
 act(el.dataset.action,el);
});
document.addEventListener('input',event=>{if(event.target.id==='message'&&route.id)s.drafts[route.id]=event.target.value;});
document.addEventListener('submit',event=>{
 const form=event.target.closest('[data-form]');if(!form)return;event.preventDefault();const data=new FormData(form);
 switch(form.dataset.form){
  case 'chat':{const text=String(data.get('message')??'').trim();if(!text)return;try{message(form.dataset.person,'you',text);s.drafts[form.dataset.person]='';delete s.scrolls[routeKey(route)];render();$('#message').focus();}catch{notify('Não foi possível adicionar a mensagem.');}break;}
  case 'filters':{const min=Number(data.get('min')),max=Number(data.get('max'));if(!Number.isInteger(min)||!Number.isInteger(max)||min<18||max>99||min>max){$('.form-error').textContent='Escolha idades entre 18 e 99; a mínima não pode superar a máxima.';return;}s.preferences={city:String(data.get('city')),genre:String(data.get('genre')),min,max};closeModal();deckPerson=null;render();break;}
  case 'bio':{const name=String(data.get('name')).trim(),bio=String(data.get('bio')).trim(),age=Number(data.get('age'));if(!name||!bio||!Number.isInteger(age)||age<18||age>99){$('.form-error').textContent='Preencha nome, apresentação e uma idade entre 18 e 99.';return;}Object.assign(s.me,{name,bio,age});closeModal();render();break;}
  case 'setting':s.me[form.dataset.key]=String(data.get('value'));closeModal();render();break;
  case 'report':{const id=form.dataset.person;s.reports.push({id,reason:String(data.get('reason'))});if(data.has('block')){endContact(id,'block');navigate({view:'chat'},{replace:true});}else closeModal();notify(strings.reportSaved);break;}
 }
});
$('#dialog').addEventListener('cancel',event=>{event.preventDefault();closeModal();});
$('#dialog').addEventListener('click',event=>{if(event.target===$('#dialog'))closeModal();});

document.addEventListener('pointerdown',event=>{
 const card=event.target.closest('.opinion-card');if(!card||event.target.closest('button,a,input')||!event.isPrimary||event.button!==0)return;
 drag={id:card.dataset.person,x:event.clientX,y:event.clientY,time:Date.now(),pointer:event.pointerId,card,axis:null};
});
document.addEventListener('pointermove',event=>{
 if(!drag||drag.pointer!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
 if(!drag.axis&&Math.max(Math.abs(dx),Math.abs(dy))>12)drag.axis=Math.abs(dx)>Math.abs(dy)*1.35?'x':'y';
 if(drag.axis==='x'){event.preventDefault();drag.card.style.transform=`translateX(${dx*.65}px) rotate(${dx/35}deg)`;drag.card.classList.add('dragging');}
},{passive:false});
function resetDrag(){if(drag){drag.card.style.transform='';drag.card.classList.remove('dragging');drag=null;}}
document.addEventListener('pointerup',event=>{
 if(!drag||drag.pointer!==event.pointerId)return;const d=drag,dx=event.clientX-d.x,dy=event.clientY-d.y;resetDrag();
 if(Math.max(Math.abs(dx),Math.abs(dy))>12)suppressTap=Date.now()+350;
 if(d.axis!=='x')return;
 const result=classifySwipe({dx,dy,width:d.card.getBoundingClientRect().width,durationMs:Date.now()-d.time});if(result!=='cancel')decision(d.id,result);
});
document.addEventListener('pointercancel',()=>{if(drag)suppressTap=Date.now()+350;resetDrag();});
document.addEventListener('lostpointercapture',resetDrag);
history.replaceState({route},'',url(route));render();
