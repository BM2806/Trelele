import './brand-logo.css';
/** Enquadra o artwork aprovado, sem redesenhar símbolo ou lettering. */
export default function BrandLogo({className=''}:{className?:string}) {
 return <div className={`trelele-brand-logo ${className}`}><img src="/assets/brand/trelele-book-heart-v13.png" alt="Trelelê" draggable={false}/></div>;
}
