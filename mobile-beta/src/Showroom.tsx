import { MobileScroll, useMobileDevice } from './mobile';
import './showroom.css';

export const reviewGroups = [
  { title: 'Chegando', icon: 'house', screens: [
    ['welcome', 'Abertura', 'Marca Trelelê'],
    ['entry', 'Entrar', 'Apple, Google e e-mail'],
    ['login-email', 'Seu e-mail', 'Formulário de demonstração'],
    ['login-code', 'Código de acesso', 'Estado visual, sem envio'],
    ['login-provider', 'Acesso ainda indisponível', 'Explicação e retorno'],
    ['rules', 'Antes de começar', 'Regras de convivência'],
  ]},
  { title: 'Seu perfil, passo a passo', icon: 'pencil-simple', screens: [
    ['onboarding-1', 'Como você se chama?', '01 · Nome'],
    ['confirm-name', 'Confirmar nome', 'Confirmação sobre a tela'],
    ['onboarding-2', 'Quando você nasceu?', '02 · Idade mínima de 18 anos'],
    ['onboarding-3', 'Como você se identifica?', '03 · Identidade'],
    ['identity-empty', 'Identidade · sem seleção', 'Estado inicial'],
    ['identity-selected', 'Identidade · selecionada', 'Opção marcada'],
    ['identity-expanded', 'Identidade · mais opções', 'Lista expandida'],
    ['identity-detail', 'Identidade · detalhe escolhido', 'Opção complementar'],
    ['onboarding-4', 'Quem você quer conhecer?', '04 · Interesse'],
    ['onboarding-5', 'O que você está buscando?', '05 · Intenção'],
    ['onboarding-6', 'O que você gosta de ler?', '06 · Gêneros literários'],
    ['onboarding-7', 'Como a leitura entra na sua rotina?', '07 · Jeito de ler'],
    ['onboarding-8', 'Que programa você toparia?', '08 · Encontros com livros'],
    ['onboarding-9', 'Seus três livros', '09 · Seleção no catálogo'],
    ['onboarding-10', 'Suas três fotos', '10 · Galeria privada'],
    ['onboarding-11', 'Um pouco de você', '11 · Apresentação e revisão'],
    ['permission-location', 'Gente por perto', 'Explicação de localização'],
    ['permission-notifications', 'Avisos de conversa', 'Explicação de notificações'],
  ]},
  { title: 'Conhecendo alguém', icon: 'book-open', screens: [
    ['discover', 'Descobrir', 'Cartão e decisões'],
    ['explore', 'Explorar', 'Quadro de pessoas e livros'],
    ['person', 'Perfil completo', 'Livros e assuntos para conversar'],
    ['locked', 'Foto protegida', 'Três espaços privados'],
    ['liga', 'Deu liga!', 'Celebração sobre o cartão'],
    ['connections', 'Suas conexões', 'Somente interesses recíprocos'],
    ['conversations', 'Conversas', 'Novas conexões e histórico'],
    ['chat-empty', 'Primeiro papo', 'Conversa ainda sem mensagens'],
    ['chat', 'Conversa em andamento', 'Mensagens e compositor'],
  ]},
  { title: 'Seu espaço', icon: 'user', screens: [
    ['profile', 'Meu perfil', 'Hub de livros, fotos e perguntas'],
    ['settings', 'Configurações', 'Lista de preferências'],
    ['settings-privacy', 'Privacidade', 'Proteção de fotos e dados'],
    ['settings-notifications', 'Notificações', 'Estado deste beta'],
    ['settings-help', 'Ajuda', 'Como usar o Trelelê'],
    ['settings-about', 'Sobre o Trelelê', 'Marca e informações'],
    ['pause', 'Pausar descoberta', 'Confirmação antes de pausar'],
    ['exit', 'Sair', 'Retorno à entrada'],
    ['delete-intro', 'Antes de apagar', 'Alternativas e consequências'],
    ['delete', 'Confirmar exclusão', 'Última confirmação'],
  ]},
] as const;

export default function Showroom({ onOpen }: { onOpen: (id: string) => void }) {
  const { device } = useMobileDevice();
  const total = reviewGroups.reduce((count, group) => count + group.screens.length, 0);
  return <section className="review-hub" style={{ paddingTop: device.geometry.safeArea.top }} aria-label="Mapa de telas do Trelelê">
    <header className="review-hub-header"><span>Trelelê</span><a href="/?app=1">Abrir beta <img src="/assets/icons/arrow-up-right.svg" alt="" /></a></header>
    <MobileScroll className="review-hub-scroll"><div className="review-hub-content">
      <p className="review-eyebrow">REVISÃO DO APLICATIVO</p>
      <h1>Veja o Trelelê<br/>por inteiro.</h1>
      <p className="review-description">{total} telas para você conferir. Escolha uma e navegue pelo fluxo.</p>
      <p className="review-memory-note"><img src="/assets/icons/lock-simple.svg" alt=""/>Aqui tudo é demonstração. Seus dados ficam de fora.</p>
      {reviewGroups.map((group, index) => <section className="review-group" key={group.title}>
        <h2><span>{String(index + 1).padStart(2, '0')}</span>{group.title}</h2>
        <div className="review-screen-list">{group.screens.map(([id, title, description]) => <button key={id} onClick={() => onOpen(id)} data-review-screen={id}>
          <span><strong>{title}</strong><small>{description}</small></span><img src="/assets/icons/caret-right.svg" alt=""/>
        </button>)}</div>
      </section>)}
      <p className="review-footer-note">Entrada com provedores, e-mail e código são estados visuais. Nenhum login, envio de mensagem ou exclusão real acontece nesta revisão.</p>
    </div></MobileScroll>
  </section>;
}
