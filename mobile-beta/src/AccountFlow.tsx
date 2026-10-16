import BrandLogo from './BrandLogo';
import {useRef,useState} from 'react';
import {MobileScroll,useKeyboard,useMobileDevice,useKeyboardInsets} from './mobile';
import type {ReaderProfile} from './profile-storage';
import './account-flow.css';

export type AccountScreen='settings'|'privacy'|'notifications'|'help'|'about'|'pause'|'exit'|'delete-intro'|'delete';
type Props={paused:boolean;ownerProfile?:ReaderProfile|null;profile?:ReaderProfile|null;onDelete:()=>Promise<void>;onClose?:()=>void;onBack?:()=>void;onEditProfile?:()=>void;onEdit?:()=>void;onPause?:()=>Promise<void>|void;onResume?:()=>Promise<void>|void;onPauseChange?:(paused:boolean)=>Promise<void>|void;onShowOpening?:()=>void;onDemo?:()=>void;onExit?:()=>void;initialScreen?:AccountScreen;reviewMode?:boolean;onReviewEdit?:()=>void;onReviewAction?:(action:'pause'|'resume'|'exit'|'delete')=>void};
const titles:Record<AccountScreen,string>={settings:'Configurações',privacy:'Privacidade',notifications:'Notificações',help:'Ajuda',about:'Sobre o Trelelê',pause:'Pausar descoberta',exit:'Sair do teste','delete-intro':'Antes de apagar',delete:'Apagar dados do teste'};
const Icon=({name}:{name:string})=><img src={`/assets/icons/${name}.svg`} alt="" draggable={false}/>;

export default function AccountFlow(props:Props){
 const {device}=useMobileDevice(),{bottomInset}=useKeyboardInsets(),keyboard=useKeyboard();
 const [screen,setScreen]=useState<AccountScreen>(props.initialScreen??'settings'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const actionLock=useRef(false);
 const profile=props.ownerProfile??props.profile;
 const editCallback=props.onEditProfile??props.onEdit;
 const exitCallback=props.onExit??props.onShowOpening??props.onDemo;
 const pauseAvailable=Boolean(props.onPauseChange||(props.paused?props.onResume:props.onPause));
 function open(next:AccountScreen){if(actionLock.current)return;keyboard.hide();setError('');setNotice('');setScreen(next);}
 function close(){if(actionLock.current)return;keyboard.hide();setError('');setNotice('');if(screen==='settings')(props.onClose??props.onBack)?.();else setScreen(screen==='delete'?'delete-intro':'settings');}
 function review(message:string){setError('');setNotice(`Prévia: ${message} Nenhum dado foi alterado.`);}
 async function pause(){
  if(actionLock.current)return;
  keyboard.hide();
  if(props.reviewMode){review(props.paused?'a descoberta seria retomada.':'a descoberta seria pausada neste aparelho.');props.onReviewAction?.(props.paused?'resume':'pause');return;}
  if(!pauseAvailable){setError('Não foi possível mudar a descoberta por aqui. Volte e tente novamente.');return;}
  actionLock.current=true;setBusy(true);setError('');setNotice('');
  try{if(props.onPauseChange)await props.onPauseChange(!props.paused);else if(props.paused)await props.onResume?.();else await props.onPause?.();setScreen('settings');}
  catch{setError('Não foi possível guardar essa mudança. Tente novamente.');}
  finally{actionLock.current=false;setBusy(false);}
 }
 async function remove(){
  if(actionLock.current)return;
  keyboard.hide();
  if(props.reviewMode){review('os dados deste teste seriam apagados somente depois da confirmação.');props.onReviewAction?.('delete');return;}
  actionLock.current=true;setBusy(true);setError('');setNotice('');
  try{await props.onDelete();}
  catch{setError('Não conseguimos apagar todos os dados. Você pode tentar novamente; nenhuma exclusão online foi solicitada.');}
  finally{actionLock.current=false;setBusy(false);}
 }
 function exit(){keyboard.hide();if(props.reviewMode){review('você voltaria à entrada, mantendo seus dados.');props.onReviewAction?.('exit');return;}exitCallback?.();}
 function edit(){keyboard.hide();if(props.reviewMode){if(props.onReviewEdit)props.onReviewEdit();else review('a edição do perfil não está disponível nesta prévia.');return;}editCallback?.();}
 function row(label:string,action:()=>void,value?:string,icon?:string){return <button className="account-row" onClick={action}><span className="account-row-label">{icon&&<Icon name={icon}/>}<span>{label}</span></span>{value&&<small>{value}</small>}<span className="account-chevron"><Icon name="caret-right"/></span></button>;}
 const confirmation=screen==='pause'||screen==='exit'||screen==='delete-intro'||screen==='delete';
 const title=screen==='pause'&&props.paused?'Retomar descoberta':titles[screen];
 return <div className="account-flow" style={{paddingTop:device.geometry.safeArea.top+18}} data-account-screen={screen} data-review-mode={props.reviewMode?'true':undefined}>
  <div className="account-underlay" aria-hidden="true"><span><Icon name="books"/>{profile?.name||'Meu perfil'}</span><i/><i/><i/></div>
  <div className="account-sheet">
   <header className={`account-header ${screen==='settings'?'is-settings':''}`}>
    {screen==='settings'?<span className="account-header-spacer"/>:<button className="account-back" aria-label="Voltar" disabled={busy} onClick={close}><Icon name="arrow-left"/></button>}
    <h1>{title}</h1>
    {screen==='settings'?<button className="account-done" aria-label="Concluir configurações" disabled={busy} onClick={close}><Icon name="check"/></button>:<span className="account-header-spacer"/>}
   </header>
   {props.reviewMode&&<div className="account-review-label">Prévia das telas · sem alterar dados</div>}
   <div className="account-scroll-slot"><MobileScroll key={screen}><section className={`account-content ${confirmation?'account-confirmation':''}`}>
    {screen==='settings'?<>
     <div className="account-group"><h2>Seu perfil</h2><div className="account-card">{row('Editar perfil',edit,profile?.name||'Livros e apresentação','user')}<div className="account-static-row"><span>Tipo de perfil</span><small>Teste neste aparelho</small></div></div></div>
     <div className="account-group"><h2>Descoberta</h2><div className="account-card">{row(props.paused?'Retomar descoberta':'Pausar descoberta',()=>open('pause'),props.paused?'Pausada':'Ativa','books')}</div><p className="account-group-note">Pausa a descoberta sem apagar suas conversas de demonstração.</p></div>
     <div className="account-group"><h2>Preferências</h2><div className="account-card">{row('Notificações',()=>open('notifications'),'Neste beta','bell')}</div></div>
     <div className="account-group"><h2>Privacidade</h2><div className="account-card">{row('Privacidade e dados',()=>open('privacy'),undefined,'lock-simple')}{row('Como as fotos funcionam',()=>open('privacy'))}</div></div>
     <div className="account-group"><h2>Ajuda e informações</h2><div className="account-card">{row('Ajuda',()=>open('help'))}{row('Sobre o Trelelê',()=>open('about'))}</div></div>
     <button className="account-wide-row" onClick={()=>open('exit')}>Sair</button>
     <div className="account-signature"><Icon name="books"/><strong>Trelelê</strong><small>Beta local · 18+</small></div>
     <button className="account-wide-row account-destructive" onClick={()=>open('delete-intro')}>Apagar dados deste aparelho</button>
    </>:screen==='privacy'?<>
     <div className="account-group"><h2>Seus dados, neste aparelho</h2><div className="account-card account-copy-card"><h3>Perfil e conversas</h3><p>Este é um beta local: seu perfil e suas conversas de demonstração ficam neste aparelho.</p><h3>Suas três fotos</h3><p>Suas fotos só aparecem para você, no editor e no seu perfil.</p></div></div>
     <div className="account-group"><h2>Fotos na conversa</h2><div className="account-card account-copy-card"><p>A foto só aparece depois de conversa, tempo e aceite dos dois. Você pode mudar de ideia e retirar seu aceite.</p></div></div>
     <div className="account-group"><h2>Controle dos dados</h2><div className="account-card">{row('Apagar dados deste aparelho',()=>open('delete-intro'))}</div><p className="account-group-note">Apagar os dados do navegador também pode apagar seu perfil. Guarde uma cópia das fotos na sua galeria.</p></div>
    </>:screen==='notifications'?<>
     <div className="account-page-icon"><Icon name="bell"/></div><h2>Sem avisos fora do app.</h2><p>As notificações do celular ainda não estão disponíveis neste beta.</p>
     <div className="account-card"><div className="account-static-row"><span>Avisos no celular</span><small>Indisponíveis</small></div><div className="account-static-row"><span>E-mail e SMS</span><small>Não enviados</small></div></div>
     <p className="account-disclosure">Veja suas conexões e conversas nas abas do Trelelê.</p>
    </>:screen==='help'?<>
     <div className="account-group"><h2>Como funciona</h2><div className="account-card account-faq">
      <details open><summary>Como conheço alguém?</summary><p>Explore os três livros da pessoa. Curta ou passe pelo cartão. Quando a curtida é dos dois, dá liga e a conversa pode começar.</p></details>
      <details><summary>Por que as fotos estão bloqueadas?</summary><p>O primeiro encontro é com os livros. A foto só aparece depois de conversa, tempo e aceite dos dois.</p></details>
      <details><summary>Estou conversando com pessoas reais?</summary><p>Não. Os perfis e as respostas deste beta são fictícios. Nenhuma mensagem é enviada para outra pessoa.</p></details>
      <details><summary>Como pauso ou apago meus dados?</summary><p>Em Configurações, escolha Pausar descoberta para manter seus dados. Para remover o que ficou neste navegador, escolha Apagar dados deste aparelho e confirme.</p></details>
      <details><summary>Como bloqueio um perfil?</summary><p>Abra o menu da conversa e escolha bloquear. Isso encerra a conexão com aquele perfil de demonstração.</p></details>
     </div></div>
     <p className="account-disclosure">Este é um teste local, ainda sem atendimento online.</p>
    </>:screen==='about'?<>
     <BrandLogo className="account-brand-mark"/><h2>O seu app de encontros literários.</h2><p>Primeiro os livros, depois o papo. A foto só entra na conversa com tempo e aceite dos dois.</p>
     <div className="account-card account-copy-card"><h3>Uma versão para experimentar</h3><p>Este beta tem perfis e conversas fictícios. Seus dados ficam neste aparelho, sem criar uma conta online.</p></div>
     <div className="account-group"><h2>Créditos</h2><div className="account-card"><a className="account-row" href="/assets/icons/LICENSE.txt" target="_blank" rel="noopener noreferrer"><span className="account-row-label">Ícones Phosphor</span><small>Licença MIT</small><span className="account-chevron"><Icon name="arrow-up-right"/></span></a></div></div>
    </>:screen==='pause'?<>
     <div className="account-page-icon"><Icon name="books"/></div><h2>{props.paused?'Vamos voltar aos livros?':'Uma pausa no próximo capítulo?'}</h2><p>{props.paused?'Retome a descoberta quando quiser.':'A descoberta dá uma pausa. Suas conexões e conversas continuam aqui.'}</p>
     <div className="account-card account-summary-card"><strong>Manter</strong><p>Seu perfil, seus livros, suas fotos e suas conversas.</p><strong>{props.paused?'Retomar':'Pausar'}</strong><p>Somente a descoberta neste aparelho.</p></div><p className="account-disclosure">Esta pausa vale para o teste neste aparelho.</p>
    </>:screen==='exit'?<>
     <h2>Quer sair por agora?</h2><p>Você volta à tela de entrada. Seu perfil, suas fotos e suas conversas continuam guardados neste aparelho.</p><div className="account-card account-summary-card"><strong>Seus dados ficam</strong><p>Você pode voltar ao teste depois, no mesmo navegador.</p></div>
    </>:screen==='delete-intro'?<>
     <h2>Prefere fazer uma pausa?</h2><p>Você pode parar de descobrir pessoas sem perder o que ficou aqui.</p><div className="account-card account-summary-card"><strong>Pausar</strong><p>Manter seu perfil, fotos e conversas de demonstração.</p><strong>Apagar</strong><p>Remover seus dados deste teste no navegador.</p></div><p className="account-disclosure">Se quiser apagar, você ainda vai confirmar na próxima tela.</p>
    </>:<>
     <h2>Tem certeza de que quer apagar seus dados?</h2><p>Seu perfil, suas três fotos, os rascunhos e o histórico deste teste serão removidos deste aparelho.</p><p>Não será possível recuperar esses dados por aqui. Não há conta online para excluir.</p><div className="account-card account-summary-card"><strong>O que continua igual</strong><p>As fotos da galeria e os dados de outros aplicativos não são apagados.</p></div>
    </>}
   </section></MobileScroll></div>
   {(confirmation||error||notice)&&<footer className={`account-footer ${screen==='delete'?'account-final-footer':''}`} style={{paddingBottom:bottomInset+12}}>
    {error&&<p role="alert" className="account-error">{error}</p>}{notice&&<p role="status" className="account-notice">{notice}</p>}
    {screen==='pause'?<><button className="account-primary" disabled={busy||(!props.reviewMode&&!pauseAvailable)} onClick={()=>void pause()}>{busy?'Aguarde…':props.paused?'Retomar descoberta':'Pausar neste aparelho'}</button><button className="account-secondary" disabled={busy} onClick={close}>Agora não</button></>:screen==='exit'?<><button className="account-primary" disabled={!props.reviewMode&&!exitCallback} onClick={exit}>Sair e voltar à entrada</button><button className="account-secondary" onClick={close}>Continuar no teste</button></>:screen==='delete-intro'?<><button className="account-primary" onClick={()=>open(props.paused?'settings':'pause')}>{props.paused?'Manter a pausa':'Pausar descoberta'}</button><button className="account-secondary account-secondary-filled" onClick={()=>open('delete')}>Continuar com a exclusão</button></>:screen==='delete'?<><button className="account-delete" disabled={busy} onClick={()=>void remove()}>{busy?'Apagando…':'Apagar dados deste aparelho'}</button><button className="account-secondary" disabled={busy} onClick={()=>open('settings')}>Manter meus dados</button></>:null}
   </footer>}
  </div>
 </div>;
}
