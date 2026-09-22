import { useEffect, useState } from "react";
import { useCms } from "../cms/CmsContext";
type HeaderProps={activePage?:"home"|"about"|"menu"|"branches"|"franchise";alwaysVisible?:boolean};
export function Header({activePage,alwaysVisible=false}:HeaderProps){
 const {cms}=useCms(); const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{const f=()=>setScrolled(window.scrollY>40);f();window.addEventListener('scroll',f,{passive:true});return()=>window.removeEventListener('scroll',f)},[]);
 const isHome=activePage==='home', isFranchise=activePage==='franchise';
 let headerClass=''; if(alwaysVisible)headerClass='header-normal';else if(isHome)headerClass=scrolled?'header-normal header-visible':'header-normal header-hidden';else headerClass=scrolled?'header-normal':'header-inverse';
 const n=cms.global.nav;
 const click=(e:React.MouseEvent<HTMLAnchorElement>)=>{if(!isFranchise)return;e.preventDefault();window.dispatchEvent(new Event('open-franchise-application'))};
 return <header className={`site-header ${headerClass}`}><a className="brand" href="/" aria-label="Barcode home"><img src={cms.global.logo.src} alt={cms.global.logo.alt} className="brand-logo"/></a><nav><a href="/#hero" className={activePage==='home'?'active':''}>{n.home}</a><a href="/about" className={activePage==='about'?'active':''}>{n.about}</a><a href="/#menu" className={activePage==='menu'?'active':''}>{n.menu}</a><a href="/#branches" className={activePage==='branches'?'active':''}>{n.branches}</a><a href="/franchise" className={activePage==='franchise'?'active':''}>{n.franchise}</a></nav><div className="header-actions"><button className="language" type="button">{n.language}</button><a className="partner" href={isFranchise?'#application':'/franchise'} onClick={click}>{isFranchise?n.application:n.partner}<span>→</span></a></div></header>
}
