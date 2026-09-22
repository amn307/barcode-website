
import {
  ArrowDownRight,
  Coffee,
  Globe2,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";
import { useCms } from "../cms/CmsContext";



export function AboutPage() {
  const { cms } = useCms();
  const ac = cms.about;
  const goals = ac.goals.map((x,i)=>({number:String(i+1).padStart(2,"0"),icon:[Coffee,Sparkles,Globe2][i%3],...x}));
  const values = ac.values.map((x,i)=>({number:String(i+1).padStart(2,"0"),icon:[ShieldCheck,HeartHandshake,Lightbulb,Target][i%4],...x}));
  return (
    <div className="about-page">
      <Header activePage="about"  />

      <main>
        <section
  className="about-page-hero"
  style={{ backgroundImage: `url(${ac.hero.background.src})` }}
>
  <div className="about-page-hero-overlay" />

  <div className="about-page-hero-content">
    <Reveal>
    

      <p className="about-page-since">
        {ac.hero.since}
      </p>

      <h1>
        {ac.hero.title}
        <br />
        <em>{ac.hero.accent}</em>
      </h1>

      <p className="about-page-lead">
        {ac.hero.lead}
      </p>

      <a className="about-page-scroll" href="#our-story">
        {ac.hero.cta}
        <ArrowDownRight size={16} strokeWidth={1.4} />
      </a>
    </Reveal>
  </div>

  <div className="about-page-hero-side">
    {ac.hero.side.map((x) => <span key={x}>{x}</span>)}
    <i />
  </div>
</section>

        <section id="our-story" className="about-story">
  <div className="about-story-label">
    <span>01</span>
    <i />
    <span>{ac.story.label}</span>
  </div>

  <div className="about-story-grid">
    <div className="about-story-heading">
      <h2>{ac.story.title}<br/><em>{ac.story.accent}</em></h2>
    </div>

    <div className="about-story-visual">
      <img
        src={ac.story.image.src}
        alt={ac.story.image.alt}
      />
    </div>

    <div className="about-story-copy">
      {ac.story.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
    </div>
  </div>

  <div className="about-story-footer">
    <div>
      <span>GOOD COFFEE</span>
      <i />
      <span>BETTER PEOPLE</span>
    </div>

    <span>EST. 2019</span>
  </div>
</section>

        <section
  className="about-direction"
  style={{ backgroundImage: `url(${ac.direction.background.src})` }}
>
  <div className="about-direction-grid">

    {/* VISION */}
    <div className="direction-side direction-vision">
      <div className="direction-content">
        <div className="direction-label">
          <span>01</span>
          <i />
          <span>VISION</span>
        </div>

        <h2>{ac.direction.visionTitle}</h2>

        <p>{ac.direction.visionText}</p>
      </div>
    </div>

    {/* MISSION */}
    <div className="direction-side direction-mission">
      <div className="direction-content">
        <div className="direction-label">
          <span>02</span>
          <i />
          <span>MISSION</span>
        </div>

        <h2>{ac.direction.missionTitle}</h2>

        <p>{ac.direction.missionText}</p>
      </div>
    </div>

  </div>
</section>

        <section className="about-page-goals about-page-pad">
          <Reveal>
            <div className="about-page-label"><span>03</span><i /> OUR GOALS</div>
            <h2>What we aim<br /><em>to achieve.</em></h2>
          </Reveal>

          <div className="about-page-goal-grid">
            {goals.map((goal, index) => {
              const Icon = goal.icon;
              return (
                <Reveal key={goal.number} delay={index * 90} className="about-page-card-reveal">
                  <article className="about-page-goal-card">
                    <div className="about-page-card-top">
                      <Icon size={31} strokeWidth={1.25} />
                      <span>{goal.number}</span>
                    </div>
                    <h3>{goal.title}</h3>
                    <p>{goal.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="about-page-values about-page-pad">
          <div className="about-page-values-heading">
            <Reveal direction="left">
              <div className="about-page-label"><span>04</span><i /> OUR VALUES</div>
              <h2>What moves us<br /><em>forward.</em></h2>
            </Reveal>
            <Reveal direction="right">
              <p>
                The principles behind every cup, every space, and every interaction carrying the BARCODE® name.
              </p>
            </Reveal>
          </div>

          <div className="about-page-values-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.number} delay={index * 80} className="about-page-card-reveal">
                  <article className="about-page-value-card">
                    <div className="about-page-value-icon"><Icon size={27} strokeWidth={1.25} /></div>
                    <span>{value.number}</span>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
