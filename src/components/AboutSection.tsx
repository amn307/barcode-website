import { useCms } from "../cms/CmsContext";

export function AboutSection() {
  const { cms } = useCms();
  const a = cms.home.about;
  return (
    <section id="about" className="about-section">
      {/* LEFT CONTENT */}
      <div className="about-copy">
        <div className="eyebrow">
          {a.eyebrow} <i />
        </div>

        <h2>
          {a.title}<br />
          <em>{a.accent}</em>
        </h2>

        <h3>
          {a.subheading.split("\n").map((x,i)=><span key={i}>{x}<br/></span>)}
        </h3>

        {a.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
        <a className="outline-btn" href="#branches">
          {a.button} <span>→</span>
        </a>

        <div className="est">
          {a.est} <i />
        </div>
      </div>

      {/* GEOMETRIC PATTERN */}
      <div className="about-geometry" aria-hidden="true">
        <svg
          viewBox="0 0 260 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            {/* =========================================
                TOP — MORE GEOMETRY
            ========================================= */}

            {/* cropped geometry entering from top */}
            <path d="M35 0 L80 24 L125 0" />
            <path d="M80 24 V72" />

            <path d="M125 0 L170 24 L215 0" />
            <path d="M170 24 V72" />

            <path d="M215 0 L260 24" />

            {/* first connected upper cube */}
            <path d="M35 48 L80 72 L125 48" />
            <path d="M35 48 V96" />
            <path d="M125 48 V96" />

            <path d="M35 96 L80 120 L125 96" />
            <path d="M80 72 V120" />

            {/* right branch */}
            <path d="M125 48 L170 72 L215 48" />
            <path d="M170 72 V120" />
            <path d="M125 96 L170 120 L215 96" />

            {/* =========================================
                LARGE UPPER CUBE
            ========================================= */}

            <path d="M80 120 V168" />

            <path d="M80 168 L125 144 L170 168" />
            <path d="M80 168 L125 192 L170 168" />

            <path d="M80 168 V216" />
            <path d="M170 168 V216" />

            <path d="M80 216 L125 240 L170 216" />
            <path d="M125 192 V240" />

            {/* branches toward image */}
            <path d="M170 168 L215 144" />
            <path d="M170 216 L215 240" />

            {/* =========================================
                SECOND CUBE
            ========================================= */}

            <path d="M125 240 V288" />

            <path d="M125 288 L170 264 L215 288" />
            <path d="M125 288 L170 312 L215 288" />

            <path d="M125 288 V336" />
            <path d="M215 288 V336" />

            <path d="M125 336 L170 360 L215 336" />
            <path d="M170 312 V360" />

            <path d="M215 336 L260 360" />

            {/* =========================================
                CENTRAL STEM
            ========================================= */}

            <path d="M170 360 V430" />

            {/* open shape extending left */}
            <path d="M65 405 V453" />
            <path d="M65 405 L105 427" />
            <path d="M65 453 L110 477" />

            <path d="M110 477 L155 453" />
            <path d="M170 430 L155 439" />

            {/* =========================================
                MIDDLE CUBE
            ========================================= */}

            <path d="M110 477 L155 501 L200 477" />
            <path d="M155 453 L200 477" />

            <path d="M110 477 V525" />
            <path d="M200 477 V525" />

            <path d="M110 525 L155 549 L200 525" />
            <path d="M155 501 V549" />

            {/* right extension */}
            <path d="M200 477 L245 501" />

            {/* =========================================
                CONNECTION
            ========================================= */}

            <path d="M155 549 V617" />

            {/* right partial structure */}
            <path d="M155 617 L200 593 L245 617" />
            <path d="M155 617 L200 641 L245 617" />
            <path d="M200 593 V641" />

            {/* =========================================
                LOWER CUBE
            ========================================= */}

            <path d="M110 685 L155 661 L200 685" />
            <path d="M110 685 L155 709 L200 685" />

            <path d="M110 685 V733" />
            <path d="M200 685 V733" />

            <path d="M110 733 L155 757 L200 733" />
            <path d="M155 709 V757" />

            <path d="M200 641 V685" />

            {/* right continuation */}
            <path d="M200 733 L245 757" />

            {/* =========================================
                LOWER STEM
            ========================================= */}

            <path d="M155 757 V825" />

            <path d="M155 825 L200 849 L245 825" />

            {/* =========================================
                BOTTOM CUBE
            ========================================= */}

            <path d="M110 893 L155 869 L200 893" />
            <path d="M110 893 L155 917 L200 893" />

            <path d="M110 893 V941" />
            <path d="M200 893 V941" />

            <path d="M110 941 L155 965 L200 941" />
            <path d="M155 917 V965" />

            <path d="M200 849 V893" />

            {/* =========================================
                CROPPED BOTTOM GEOMETRY
            ========================================= */}

            <path d="M65 1000 L110 976 L155 1000" />
            <path d="M110 976 L155 952 L200 976" />
            <path d="M155 952 V1000" />
          </g>
        </svg>
      </div>

      {/* RIGHT IMAGE */}
      <div className="about-photo">
  <img
    src={a.image.src}
    alt={a.image.alt}
  />

  <span className="photo-country">
    SAUDI ARABIA <i />
  </span>
</div>
    </section>
  );
}