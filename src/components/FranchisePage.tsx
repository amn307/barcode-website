import { useEffect, useState, type FormEvent } from "react";
import { saveContactMessage } from "../cms/firestoreMessages";
import { trackEvent } from "../analytics/tracker";
import { ArrowRight, BadgeCheck, BookOpen, Building2, Megaphone, MapPinCheck, GraduationCap, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { Footer } from "./Footer";
import { useCms } from "../cms/CmsContext";
import { Header } from "./Header";
import franchiseHero from "../assets/about/about-cafe.jpg";
import branchImage from "../assets/branches/al-hofuf.jpg";

const inclusions = [
  { icon: BadgeCheck, title: "Trademark License", text: "Operate under the BARCODE® brand and its established visual identity." },
  { icon: MapPinCheck, title: "Site Approval", text: "Guidance and approval to help select a location aligned with the concept." },
  { icon: GraduationCap, title: "Training & Support", text: "Operational training and support to prepare your team for opening." },
  { icon: Megaphone, title: "Marketing", text: "Brand-led marketing guidance and launch communication support." },
  { icon: Building2, title: "Opening Support", text: "Support through the final preparation and opening stages." },
  { icon: BookOpen, title: "Operations Manual", text: "A structured operating framework designed to protect consistency." },
];

const journey = [
  ["01", "Application", "Submit your initial franchise interest."],
  ["02", "Review", "BARCODE reviews the application and fit."],
  ["03", "Discussion", "Meet to discuss the opportunity and expectations."],
  ["04", "Disclosure", "Complete the required disclosure and NDA stage."],
  ["05", "Site Visit", "Evaluate and approve the proposed location."],
  ["06", "Agreement", "Finalize the franchise agreement."],
  ["07", "Build", "Move into design, construction and setup."],
  ["08", "Training", "Prepare the team and conduct the soft opening."],
  ["09", "Opening", "Launch with BARCODE opening assistance."],
  ["10", "Marketing", "Begin the opening marketing programme."],
];

export function FranchisePage() {
  const { cms } = useCms();
  const faqs = cms.home.faq.items;
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
          <img src={franchiseHero} alt="BARCODE café interior" className="franchise-hero-image" />
          <div className="franchise-hero-shade" />
          <div className="franchise-hero-content">
            <span className="franchise-kicker">FRANCHISE OPPORTUNITY</span>
            <h1>Become a<br /><em>PARTNER.</em></h1>
            <p>Bring a distinctive specialty coffee experience to your market and build the next chapter of BARCODE with us.</p>
            <button type="button" onClick={openApplication} className="franchise-primary-cta">START YOUR APPLICATION <ArrowRight size={18} /></button>
          </div>
          <div className="franchise-hero-index">01 <i /> SAUDI ARABIA</div>
        </section>

        <section className="franchise-opportunity franchise-pad">
          <Reveal direction="left" className="franchise-section-label"><span>01</span><i />THE OPPORTUNITY</Reveal>
          <Reveal delay={80}>
            <div className="franchise-opportunity-grid">
              <h2>More Than Coffee.<br /><em>A Brand Built to Grow.</em></h2>
              <div className="franchise-copy">
                <p>BARCODE® brings together specialty coffee, considered design and a customer-first experience. The franchise opportunity is built for partners who want to carry that experience into new communities while maintaining the standards behind the brand.</p>
                <button type="button" onClick={openApplication}>START YOUR APPLICATION <ArrowRight size={16} /></button>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="franchise-includes franchise-pad">
          <Reveal className="franchise-section-label"><span>02</span><i />YOUR FRANCHISE INCLUDES</Reveal>
          <Reveal delay={70}><h2>Built with you.<br /><em>Backed by BARCODE.</em></h2></Reveal>
          <div className="franchise-includes-grid">
            {inclusions.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 65} className="include-reveal">
                <article className="include-card"><Icon /><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="franchise-investment">
          <div className="investment-image"><img src={branchImage} alt="BARCODE café" /></div>
          <div className="investment-content">
            <Reveal className="franchise-section-label"><span>03</span><i />THE INVESTMENT</Reveal>
            <Reveal delay={80}><h2>Clear terms.<br /><em>A shared ambition.</em></h2></Reveal>
            <div className="investment-grid">
              <Reveal delay={100}><div><strong><small>SAR</small> 60,000</strong><span>FRANCHISE FEE</span></div></Reveal>
              <Reveal delay={160}><div><strong>5%</strong><span>ROYALTY</span></div></Reveal>
              <Reveal delay={220}><div><strong>2%</strong><span>ADVERTISING FEE</span></div></Reveal>
              <Reveal delay={280}><div><strong>5 <small>YEARS</small></strong><span>CONTRACT TERM</span></div></Reveal>
            </div>
            <p className="investment-note">* Fees shown exclude VAT. Final commercial terms are confirmed during the franchise process.</p>
          </div>
        </section>

        <section className="franchise-journey franchise-pad">
          <Reveal className="franchise-section-label"><span>04</span><i />FROM APPLICATION TO OPENING</Reveal>
          <Reveal delay={70}><h2>Your journey to<br /><em>opening day.</em></h2></Reveal>
          <div className="journey-grid">
            {journey.map(([num, title, text], index) => (
              <Reveal key={num} delay={index * 45} className="journey-reveal">
                <article><span>{num}</span><i /><h3>{title}</h3><p>{text}</p></article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="franchise-faq franchise-pad">
          <div className="franchise-faq-intro">
            <Reveal direction="left" className="franchise-section-label"><span>05</span><i />FAQ</Reveal>
            <Reveal direction="left" delay={80}><h2>Answers for<br /><em>what's next.</em></h2><p>Key information for prospective BARCODE® franchise partners.</p></Reveal>
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
              <h2 id="franchise-modal-title">Franchise Opportunity</h2>
              <p>Join our growing family of coffee entrepreneurs. Start your journey with a trusted brand and proven business model.</p>
            </div>
            <form className="franchise-modal-form" onSubmit={submitApplication}>
              <div className="modal-form-row">
                <label>First name *<input required name="firstName" /></label>
                <label>Last name *<input required name="lastName" /></label>
              </div>
              <div className="modal-form-row">
                <label>Email Address *<input required type="email" name="email" /></label>
                <label>Phone No *<input required type="tel" name="phone" /></label>
              </div>
              <div className="modal-form-row">
                <label>City<input name="city" /></label>
                <label>Country<input name="country" /></label>
              </div>
              <label>Target<select name="target" defaultValue="Franchise"><option>Franchise</option></select></label>
              <label>Are you a trader?<select name="trader" defaultValue="Yes"><option>Yes</option><option>No</option></select></label>
              <label>Tell us about your experience<textarea name="experience" rows={3} /></label>
              <button className="franchise-modal-submit" type="submit" disabled={submitState === "sending"}>{submitState === "sending" ? "Submitting…" : "Submit Application"}</button>{submitState === "sent" && <p>Application received. Thank you.</p>}{submitState === "error" && <p>Unable to submit. Please try again.</p>}
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
