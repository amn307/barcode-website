import {Mail,Phone} from 'lucide-react';
import {useCms} from '../cms/CmsContext';
export function Footer(){
 const{cms}=useCms(); const n=cms.global.nav; const f=cms.global.footer;
 const phoneHref=`tel:${f.phone.replace(/[^+\d]/g,'')}`;
 return <footer className="site-footer"><div className="footer-container">
  <div className="footer-brand"><img src={cms.global.logo.src} alt={cms.global.logo.alt} className="footer-logo"/><p className="footer-description">{f.description}</p></div>
  <div className="footer-column"><h3>{f.quickLinksTitle}</h3><nav className="footer-links"><a href="/">{n.home}</a><a href="/about">{n.about}</a><a href="/#menu">{n.menu}</a><a href="/#branches">{n.branches}</a><a href="/franchise">{n.franchise}</a></nav></div>
  <div className="footer-column"><h3>{f.contactTitle}</h3><div className="footer-contact"><a href={phoneHref}><Phone size={16}/><span>{f.phone}</span></a><a href={`mailto:${f.email}`}><Mail size={16}/><span>{f.email}</span></a><a href={f.instagramUrl} target="_blank" rel="noreferrer"><span className="footer-contact-icon">◎</span><span>{f.instagramHandle}</span></a></div></div>
  <div className="footer-column footer-follow"><h3>{f.followTitle}</h3><p>{f.followText}</p><div className="footer-socials"><a href={f.instagramUrl} aria-label="Instagram" target="_blank" rel="noreferrer">IG</a><a href={f.tiktokUrl} aria-label="TikTok" target="_blank" rel="noreferrer">♪</a><a href={f.linkedinUrl} aria-label="LinkedIn" target="_blank" rel="noreferrer">in</a></div></div>
 </div><div className="footer-bottom"><p>{f.copyright}</p><div className="footer-bottom-right"><span>{f.goodCoffee}</span><i/><span className="footer-better">{f.betterPeople}</span><span className="footer-dot">•</span><span>{f.established}</span></div></div></footer>
}
