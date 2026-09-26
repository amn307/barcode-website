import type { CmsState } from "./types";

import logo from "../assets/logo/barcode-logo.png";
import heroLogo from "../assets/logo/logo.png";
import heroVideo from "../assets/hero.mp4";

import aboutCafe from "../assets/about/about-cafe.jpg";
import aboutHero from "../assets/about/about-hero.png";
import storyVisual from "../assets/about/story-visual.png";
import directionBg from "../assets/about/bg-image.png";

import branchMap from "../assets/branches/branchmap.png";
import hofuf from "../assets/branches/al-hofuf.jpg";
import mubarraz from "../assets/branches/al-mubarraz.jpg";
import rawabi from "../assets/branches/al-rawabi.jpg";

import franchiseHero from "../assets/about/about-cafe.jpg";


export const defaultCms: CmsState = {

  /* =========================================================
     GLOBAL
     ========================================================= */

  global: {
    logo: {
      src: logo,
      alt: "Barcode Coffee Experts",
    },

    heroLogo: {
      src: heroLogo,
      alt: "BARCODE Coffee Experts",
    },

    nav: {
      home: "Home",
      about: "About",
      menu: "Menu",
      branches: "Branches",
      franchise: "Franchise",
      language: "◎   العربية",
      partner: "BECOME A PARTNER",
      application: "START YOUR APPLICATION",
    },

    footer: {
      description:
        "Crafting exceptional coffee experiences since 2019. Every cup tells a story of passion, quality, and community.",

      quickLinksTitle: "Quick Links",
      contactTitle: "Contact Us",
      followTitle: "Follow Us",

      followText:
        "Join our community of coffee lovers and stay updated with our latest offerings.",

      phone: "+966 54 151 5045",
      email: "info@barcode.sa",

      instagramHandle: "@barcode_ksa",
      instagramUrl: "#",
      tiktokUrl: "#",
      linkedinUrl: "#",

      copyright: `© ${new Date().getFullYear()} BARCODE® Coffee Experts. All Rights Reserved.`,

      goodCoffee: "GOOD COFFEE",
      betterPeople: "BETTER PEOPLE",
      established: "EST. 2019",
    },
  },


  /* =========================================================
     HOME PAGE
     ========================================================= */

  home: {

    /* HERO */

    hero: {
      video: heroVideo,

      smallTitle: "CRAFTING MOMENTS FROM THE",
      mainTitle: "COFFEE EXPERTS",

      est: "EST. 2019",
      country: "SAUDI ARABIA",

      motto: "GOOD\nCOFFEE\nBETTER\nPEOPLE",

      scroll: "SCROLL\nTO EXPLORE",

      bottom: [
        "PEOPLE",
        "PLACES",
        "POSSIBILITIES",
      ],
    },


    /* STATS */

    stats: [
      {
        target: 15,
        suffix: "+",
        line1: "Years of",
        line2: "Excellence",
      },

      {
        target: 2,
        suffix: "M+",
        line1: "Cups",
        line2: "Served",
      },

      {
        target: 4,
        suffix: "",
        line1: "Coffee",
        line2: "Origins",
      },

      {
        target: 15,
        suffix: "M+",
        line1: "Social Media",
        line2: "Reach",
      },
    ],


    /* ABOUT */

    about: {
      eyebrow: "OUR STORY",

      title: "Our Journey With",
      accent: "Speciality Coffee",

      subheading: "GOOD COFFEE\nBETTER PEOPLE",

      paragraphs: [
        "Our journey with specialty coffee began long ago, but BARCODE® Cafe's story started in 2019. We crafted the cafe with a classic, modern design that reflects our vision of innovation and creativity.",

        "At BARCODE® Cafe, we prioritize serving specialty coffee alongside a wide variety of drinks, sweets, and other products. All with a focus on exceptional customer service and satisfaction.",

        "The true service we offer at BARCODE® Cafe is the quality of our coffee and products. We take pride in using only the finest coffee beans from around the world, catering to those with refined taste who seek the delight of a perfect sip.",
      ],

      button: "OUR JOURNEY",

      est: "EST. 2019",

      image: {
        src: aboutCafe,
        alt: "Barcode Coffee interior",
      },

      country: "SAUDI ARABIA",
    },


    /* MENU */

    menu: {
      eyebrow: "OUR MENU",

      title: "Crafted with Passion,",
      accent: "Served with Love.",

      intro:
        "From classic espresso drinks to unique seasonal creations, every cup is crafted by our skilled baristas using the finest ingredients.",

      leftSide: "GOOD\nCOFFEE\nBETTER\nPEOPLE",

      rightSide: "A CUP\nFOR A\nBRIGHTER\nTOMORROW",

      items: [
        {
          title: "ESPRESSO CLASSICS",
          desc:
            "Rich, bold espresso drinks including americano, macchiato, and cortado.",
        },

        {
          title: "COLD BREWS",
          desc:
            "Smooth, slow-steeped cold brew and refreshing iced coffee selections.",
        },

        {
          title: "SPECIALTY LATTES",
          desc:
            "Creamy lattes with house-made syrups and premium milk alternatives.",
        },

        {
          title: "PREMIUM TEAS",
          desc:
            "Carefully curated loose-leaf teas from around the world.",
        },

        {
          title: "FRESH PASTRIES",
          desc:
            "Baked fresh daily including croissants, muffins, and scones.",
        },

        {
          title: "LIGHT BITES",
          desc:
            "Sandwiches, salads, and snacks made with local ingredients.",
        },
      ],
    },


    /* BRANCHES */

    branches: {
      title: "Find your BARCODE.",

      intro:
        "Visit a BARCODE branch and discover specialty coffee made for people, places and possibilities.",

      map: {
        src: branchMap,
        alt: "BARCODE branches in Eastern Saudi Arabia",
      },

      items: [
        {
          name: "Al Hofuf",

          address:
            "Al Amir Saud Ibn Jalawi, Al Muhammadiyah 8270, Al Wuqoof 31982",

          image: {
            src: hofuf,
            alt: "Al Hofuf branch",
          },
        },

        {
          name: "Al Mubarraz",

          address: "Add Al Mubarraz branch address here",

          image: {
            src: mubarraz,
            alt: "Al Mubarraz branch",
          },
        },

        {
          name: "Al Rawabi",

          address: "Add Al Rawabi branch address here",

          image: {
            src: rawabi,
            alt: "Al Rawabi branch",
          },
        },
      ],
    },


    /* FAQ */

    faq: {
      title: "Questions, answered.",

      intro:
        "Everything you may want to know about BARCODE.",

      items: [],
    },
  },


  /* =========================================================
     ABOUT PAGE
     ========================================================= */

  about: {

    /* HERO */

    hero: {
      background: {
        src: aboutHero,
        alt: "Coffee beans",
      },

      since: "SPECIALTY COFFEE SINCE 2019",

      title: "Coffee is our craft.",

      accent: "People are our purpose.",

      lead:
        "BARCODE® was built around a simple belief: exceptional coffee becomes more meaningful when it creates memorable experiences, genuine connection, and a reason to return.",

      cta: "DISCOVER OUR STORY",

      side: [
        "GOOD",
        "COFFEE",
        "BETTER",
        "PEOPLE",
      ],
    },


    /* STORY */

    story: {
      label: "OUR STORY",

      title: "Our journey with",

      accent: "specialty coffee.",

      image: {
        src: storyVisual,
        alt: "BARCODE specialty coffee",
      },

      paragraphs: [
        "Our journey with specialty coffee began long ago, but the BARCODE® Cafe story started in 2019. We created the cafe with a classic, modern character that reflects our vision for innovation and creativity.",

        "At BARCODE® Cafe, we prioritize specialty coffee alongside a wide variety of drinks, sweets, and other products — all with a focus on exceptional customer service and satisfaction.",

        "The true service we offer is the quality of our coffee and products. We take pride in using fine coffee beans from around the world for people who appreciate the delight of a perfect sip.",
      ],
    },


    /* DIRECTION */

    direction: {
      background: {
        src: directionBg,
        alt: "BARCODE direction",
      },

      visionTitle: "Vision",

      visionText:
        "To expand our branches and products across Saudi Arabia, the Gulf, the Arab world and beyond, with the ambition of becoming a leading specialty coffee brand.",

      missionTitle: "Mission",

      missionText:
        "Innovation and variety should always move alongside high quality. We continuously develop and modernize our products to earn the trust and satisfaction of our customers.",
    },


    /* GOALS */

    goals: [
      {
        title: "Top-Tier Products",

        text:
          "Deliver exceptional specialty coffee, sweets, and products that consistently exceed expectations.",
      },

      {
        title: "A Leading Brand",

        text:
          "Build a distinctive specialty coffee brand with a standard of quality people recognize and trust.",
      },

      {
        title: "Global Expansion",

        text:
          "Grow our presence locally, regionally, and internationally to reach more coffee lovers.",
      },
    ],


    /* VALUES */

    values: [
      {
        title: "Integrity & Transparency",

        text:
          "We work with honesty, credibility, and transparency in everything we do.",
      },

      {
        title: "Customer Experience",

        text:
          "Creating better customer experiences sits at the heart of what we build.",
      },

      {
        title: "Creativity & Innovation",

        text:
          "We embrace new ideas and continuous innovation to move specialty coffee forward.",
      },

      {
        title: "Commitment & Reliability",

        text:
          "Our commitment to quality and dependable standards defines the way we operate.",
      },
    ],
  },


  /* =========================================================
     FRANCHISE PAGE
     ========================================================= */

  franchise: {
    hero: {
      image: { src: franchiseHero, alt: "BARCODE café interior" },
      kicker: "FRANCHISE OPPORTUNITY",
      title: "Become a",
      accent: "PARTNER.",
      intro: "Bring a distinctive specialty coffee experience to your market and build the next chapter of BARCODE with us.",
      cta: "START YOUR APPLICATION",
      index: "01",
      country: "SAUDI ARABIA",
    },
    opportunity: {
      index: "01",
      label: "THE OPPORTUNITY",
      title: "More Than Coffee.",
      accent: "A Brand Built to Grow.",
      text: "BARCODE® brings together specialty coffee, considered design and a customer-first experience. The franchise opportunity is built for partners who want to carry that experience into new communities while maintaining the standards behind the brand.",
      cta: "START YOUR APPLICATION",
    },
    includes: {
      index: "02",
      label: "YOUR FRANCHISE INCLUDES",
      title: "Built with you.",
      accent: "Backed by BARCODE.",
      items: [
        { icon: "badge", title: "Trademark License", text: "Operate under the BARCODE® brand and its established visual identity." },
        { icon: "map", title: "Site Approval", text: "Guidance and approval to help select a location aligned with the concept." },
        { icon: "training", title: "Training & Support", text: "Operational training and support to prepare your team for opening." },
        { icon: "marketing", title: "Marketing", text: "Brand-led marketing guidance and launch communication support." },
        { icon: "building", title: "Opening Support", text: "Support through the final preparation and opening stages." },
        { icon: "book", title: "Operations Manual", text: "A structured operating framework designed to protect consistency." },
      ],
    },
    investment: {
      image: { src: hofuf, alt: "BARCODE café" },
      index: "03",
      label: "THE INVESTMENT",
      title: "Clear terms.",
      accent: "A shared ambition.",
      items: [
        { value: "60,000", unit: "SAR", label: "FRANCHISE FEE" },
        { value: "5%", unit: "", label: "ROYALTY" },
        { value: "2%", unit: "", label: "ADVERTISING FEE" },
        { value: "5", unit: "YEARS", label: "CONTRACT TERM" },
      ],
      note: "* Fees shown exclude VAT. Final commercial terms are confirmed during the franchise process.",
    },
    journey: {
      index: "04",
      label: "FROM APPLICATION TO OPENING",
      title: "Your journey to",
      accent: "opening day.",
      items: [
        { number: "01", title: "Application", text: "Submit your initial franchise interest." },
        { number: "02", title: "Review", text: "BARCODE reviews the application and fit." },
        { number: "03", title: "Discussion", text: "Meet to discuss the opportunity and expectations." },
        { number: "04", title: "Disclosure", text: "Complete the required disclosure and NDA stage." },
        { number: "05", title: "Site Visit", text: "Evaluate and approve the proposed location." },
        { number: "06", title: "Agreement", text: "Finalize the franchise agreement." },
        { number: "07", title: "Build", text: "Move into design, construction and setup." },
        { number: "08", title: "Training", text: "Prepare the team and conduct the soft opening." },
        { number: "09", title: "Opening", text: "Launch with BARCODE opening assistance." },
        { number: "10", title: "Marketing", text: "Begin the opening marketing programme." },
      ],
    },
    faq: {
      index: "05",
      label: "FAQ",
      title: "Answers for",
      accent: "what's next.",
      intro: "Key information for prospective BARCODE® franchise partners.",
    },
    application: {
      title: "Franchise Opportunity",
      intro: "Join our growing family of coffee entrepreneurs. Start your journey with a trusted brand and proven business model.",
      firstName: "First name *", lastName: "Last name *", email: "Email Address *", phone: "Phone No *", city: "City", country: "Country",
      target: "Target", targetOptions: ["Franchise"], trader: "Are you a trader?", traderOptions: ["Yes", "No"],
      experience: "Tell us about your experience", submit: "Submit Application", submitting: "Submitting…", success: "Application received. Thank you.", error: "Unable to submit. Please try again.",
    },
  },

  /* =========================================================
     TRACKING / PIXELS
     ========================================================= */

  tracking: {

    meta: {
      enabled: false,
      pixelId: "",
    },

    tiktok: {
      enabled: false,
      pixelId: "",
    },

    linkedin: {
      enabled: false,
      partnerId: "",
    },

    snapchat: {
      enabled: false,
      pixelId: "",
    },

    googleMode: "none",

    ga4: {
      enabled: false,
      measurementId: "",
    },

    gtm: {
      enabled: false,
      containerId: "",
    },

    customHeadScript: "",

    customBodyScript: "",
  },


  /* =========================================================
     MEDIA
     ========================================================= */

  media: [],


  /* =========================================================
     MESSAGES
     ========================================================= */

  messages: [],


  /* =========================================================
     CMS SETTINGS
     ========================================================= */

  settings: {
    companyName: "BARCODE Coffee Experts",

    email: "info@barcode.sa",

    phone: "+966 54 151 5045",

    baseUrl: "https://barcode.sa",

    instagram: "",

    linkedin: "",
  },


  /* =========================================================
     CMS LAST UPDATE
     ========================================================= */

  updatedAt: new Date().toISOString(),
};