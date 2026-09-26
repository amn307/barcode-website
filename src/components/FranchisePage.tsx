import { useEffect, useState, type FormEvent } from "react";
import { saveContactMessage } from "../cms/firestoreMessages";
import { trackEvent } from "../analytics/tracker";
import { ArrowRight, BadgeCheck, BookOpen, Building2, Megaphone, MapPinCheck, GraduationCap, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { Footer } from "./Footer";
import { useCms } from "../cms/CmsContext";
import { Header } from "./Header";

const franchiseIcons = {
  badge: BadgeCheck, map: MapPinCheck, training: GraduationCap, marketing: Megaphone, building: Building2, book: BookOpen,
};

export function FranchisePage() {
  const { cms } = useCms();
  const faqs = cms.home.faq.items;
  const f = cms.franchise;
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [submitState, setSubmitState] = useState<"idle"|"sending"|"sent"|"error">("idle");

  const submitApplication = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSubmitState("sending");
    const fd = new FormData(e.currentTarget);
    const firstName=String(fd.get("firstName")||""); const lastName=String(fd.get("lastName")||"");
    try {
      await saveContactMessage({name:`${firstName} ${lastName}`.trim(),email:String(fd.get("email")||""),phone:String(fd.get("phone")||""),project:`Franchise - ${String(fd.get("city")||"")}, ${String(fd.get("country")||"")}`,service:"Franchise Application",message:`Target: ${String(fd.get("target")||"")}\nTrader: ${String(fd.get("trader")||"")}\nExperience: ${String(fd.get("experience")||"")}`});
      void trackEvent("contact_form_submit", { form: "franchise_application" });
      setSubmitState("sent"); e.currentTarget.reset();
    } catch(err){ console.error(err); setSubmitState("error"); }
  };

  useEffect(() => {
    const openApplication = () => setApplicationOpen(true);
    window.addEventListener("open-franchise-application", openApplication);
    return () => window.removeEventListener("open-franchise-application", openApplication);
  }, []);

  useEffect(() => {
    document.body.style.overflow = applicationOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [applicationOpen]);

  const openApplication = () => setApplicationOpen(true);

  return (
    <div className="franchise-page">
      <Header activePage="franchise" />

      <main>
        <section className="franchise-hero">
          <img src={f.hero.image.src} alt={f.hero.image.alt} className="franchise-hero-image" />
          <div className="franchise-hero-shade" />
          <div className="franchise-hero-content">
            <span className="franchise-kicker">{f.hero.kicker}</span>
            <h1>{f.hero.title}<br /><em>{f.hero.accent}</em></h1>
            <p>{f.hero.intro}</p>
            <button type="button" onClick={openApplication} className="franchise-primary-cta">{f.hero.cta} <ArrowRight size={18} /></button>
          </div>
          <div className="franchise-hero-index">{f.hero.index} <i /> {f.hero.country}</div>
        </section>

        <section className="franchise-opportunity franchise-pad">
          <Reveal direction="left" className="franchise-section-label"><span>{f.opportunity.index}</span><i />{f.opportunity.label}</Reveal>
          <Reveal delay={80}>
            <div className="franchise-opportunity-grid">
              <h2>{f.opportunity.title}<br /><em>{f.opportunity.accent}</em></h2>
              <div className="franchise-copy">
                <p>{f.opportunity.text}</p>
                <button type="button" onClick={openApplication}>{f.opportunity.cta} <ArrowRight size={16} /></button>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="franchise-includes franchise-pad">
          <Reveal className="franchise-section-label"><span>{f.includes.index}</span><i />{f.includes.label}</Reveal>
          <Reveal delay={70}><h2>{f.includes.title}<br /><em>{f.includes.accent}</em></h2></Reveal>
          <div className="franchise-includes-grid">
            {f.includes.items.map(({ icon, title, text }, index) => { const Icon = franchiseIcons[icon as keyof typeof franchiseIcons] ?? BadgeCheck; return (
              <Reveal key={title} delay={index * 65} className="include-reveal">
                <article className="include-card"><Icon /><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
              </Reveal>
            )})}
          </div>
        </section>

        <section className="franchise-investment">
          <div className="investment-image"><img src={f.investment.image.src} alt={f.investment.image.alt} /></div>
          <div className="investment-content">
            <Reveal className="franchise-section-label"><span>{f.investment.index}</span><i />{f.investment.label}</Reveal>
            <Reveal delay={80}><h2>{f.investment.title}<br /><em>{f.investment.accent}</em></h2></Reveal>
            <div className="investment-grid">
              {f.investment.items.map((item, index) => (
                <Reveal key={`${item.label}-${index}`} delay={100 + index * 60}>
                  <div><strong>{item.unit && <small>{item.unit}</small>} {item.value}</strong><span>{item.label}</span></div>
                </Reveal>
              ))}
            </div>
            <p className="investment-note">{f.investment.note}</p>
          </div>
        </section>

        <section className="franchise-journey franchise-pad">
          <Reveal className="franchise-section-label"><span>{f.journey.index}</span><i />{f.journey.label}</Reveal>
          <Reveal delay={70}><h2>{f.journey.title}<br /><em>{f.journey.accent}</em></h2></Reveal>
          <div className="journey-grid">
            {f.journey.items.map(({ number: num, title, text }, index) => (
              <Reveal key={num} delay={index * 45} className="journey-reveal">
                <article><span>{num}</span><i /><h3>{title}</h3><p>{text}</p></article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="franchise-faq franchise-pad">
          <div className="franchise-faq-intro">
            <Reveal direction="left" className="franchise-section-label"><span>{f.faq.index}</span><i />{f.faq.label}</Reveal>
            <Reveal direction="left" delay={80}><h2>{f.faq.title}<br /><em>{f.faq.accent}</em></h2><p>{f.faq.intro}</p></Reveal>
          </div>
          <div className="franchise-faq-list">
            {faqs.map(({ q, a }, index) => (
              <Reveal key={`${q}-${index}`} delay={index * 45}>
                <details open={index === 0}>
                  <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{q}</strong><b>+</b></summary>
                  <p>{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

      </main>

      {applicationOpen && (
        <div className="franchise-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setApplicationOpen(false); }}>
          <div className="franchise-modal" role="dialog" aria-modal="true" aria-labelledby="franchise-modal-title">
            <button className="franchise-modal-close" type="button" aria-label="Close application" onClick={() => setApplicationOpen(false)}><X size={24} /></button>
            <div className="franchise-modal-heading">
              <h2 id="franchise-modal-title">{f.application.title}</h2>
              <p>{f.application.intro}</p>
            </div>
            <form className="franchise-modal-form" onSubmit={submitApplication}>
              <div className="modal-form-row">
                <label>{f.application.firstName}<input required name="firstName" /></label>
                <label>{f.application.lastName}<input required name="lastName" /></label>
              </div>
              <div className="modal-form-row">
                <label>{f.application.email}<input required type="email" name="email" /></label>
                <label>{f.application.phone}<input required type="tel" name="phone" /></label>
              </div>
              <div className="modal-form-row">
                <label>{f.application.city}<input name="city" /></label>
                <label>{f.application.country}<input name="country" /></label>
              </div>
              <label>{f.application.target}<select name="target" defaultValue={f.application.targetOptions[0] ?? ""}>{f.application.targetOptions.map(x => <option key={x}>{x}</option>)}</select></label>
              <label>{f.application.trader}<select name="trader" defaultValue={f.application.traderOptions[0] ?? ""}>{f.application.traderOptions.map(x => <option key={x}>{x}</option>)}</select></label>
              <label>{f.application.experience}<textarea name="experience" rows={3} /></label>
              <button className="franchise-modal-submit" type="submit" disabled={submitState === "sending"}>{submitState === "sending" ? f.application.submitting : f.application.submit}</button>{submitState === "sent" && <p>{f.application.success}</p>}{submitState === "error" && <p>{f.application.error}</p>}
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
