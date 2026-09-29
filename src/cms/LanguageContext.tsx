import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useCms } from "./CmsContext";
import type { CmsState, PublicCmsContent } from "./types";

type Language = "en" | "ar";
const LanguageContext = createContext<{language:Language; setLanguage:(l:Language)=>void; toggleLanguage:()=>void; isArabic:boolean} | null>(null);
const KEY = "barcode-language";

export function LanguageProvider({children}:{children:ReactNode}) {
  const [language,setLanguageState] = useState<Language>(() => localStorage.getItem(KEY)==="ar" ? "ar" : "en");
  const setLanguage=(l:Language)=>{setLanguageState(l);localStorage.setItem(KEY,l)};
  useEffect(()=>{
    document.documentElement.lang=language;
    document.documentElement.dir=language==="ar"?"rtl":"ltr";
    document.body.classList.toggle("is-arabic",language==="ar");
  },[language]);
  const value=useMemo(()=>({language,setLanguage,toggleLanguage:()=>setLanguage(language==="ar"?"en":"ar"),isArabic:language==="ar"}),[language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const v=useContext(LanguageContext);if(!v)throw new Error("useLanguage must be used inside LanguageProvider");return v}

export function buildArabicContent(cms:CmsState): PublicCmsContent {
  const a=structuredClone(cms);
  a.global.nav={home:"الرئيسية",about:"من نحن",menu:"القائمة",branches:"الفروع",franchise:"الامتياز التجاري",language:"◎   English",partner:"كن شريكاً",application:"ابدأ طلبك"};
  Object.assign(a.global.footer,{description:"نصنع تجارب قهوة استثنائية منذ عام 2019. كل كوب يحكي قصة من الشغف والجودة والمجتمع.",quickLinksTitle:"روابط سريعة",contactTitle:"تواصل معنا",followTitle:"تابعنا",followText:"انضم إلى مجتمع محبي القهوة وابقَ على اطلاع على أحدث عروضنا.",goodCoffee:"قهوة مميزة",betterPeople:"أشخاص أفضل",established:"منذ 2019",copyright:`© ${new Date().getFullYear()} BARCODE® Coffee Experts. جميع الحقوق محفوظة.`});
  Object.assign(a.home.hero,{smallTitle:"نصنع لحظات من",mainTitle:"خبراء القهوة",est:"منذ 2019",country:"المملكة العربية السعودية",motto:"قهوة\nمميزة\nأشخاص\nأفضل",scroll:"مرر\nللاستكشاف",bottom:["الأشخاص","الأماكن","الإمكانات"]});
  a.home.stats=[{...a.home.stats[0],line1:"عاماً من",line2:"التميّز"},{...a.home.stats[1],line1:"كوب",line2:"تم تقديمه"},{...a.home.stats[2],line1:"مصادر",line2:"للقهوة"},{...a.home.stats[3],line1:"وصول عبر",line2:"التواصل الاجتماعي"}];
  Object.assign(a.home.about,{eyebrow:"قصتنا",title:"رحلتنا مع",accent:"القهوة المختصة",subheading:"قهوة مميزة\nأشخاص أفضل",paragraphs:["بدأت رحلتنا مع القهوة المختصة منذ زمن، لكن قصة مقهى BARCODE® بدأت في عام 2019. صممنا المقهى بطابع كلاسيكي عصري يعكس رؤيتنا للابتكار والإبداع.","في BARCODE® Cafe نولي القهوة المختصة اهتماماً أساسياً إلى جانب مجموعة واسعة من المشروبات والحلويات والمنتجات الأخرى، مع التركيز على خدمة العملاء الاستثنائية ورضاهم.","الخدمة الحقيقية التي نقدمها في BARCODE® Cafe هي جودة قهوتنا ومنتجاتنا. نفخر باستخدام أجود حبوب القهوة من أنحاء العالم لنقدم تجربة تليق بأصحاب الذوق الرفيع."],button:"رحلتنا",est:"منذ 2019",country:"المملكة العربية السعودية"});
  Object.assign(a.home.menu,{eyebrow:"قائمتنا",title:"صُنعت بشغف،",accent:"وقُدمت بمحبة.",intro:"من مشروبات الإسبريسو الكلاسيكية إلى ابتكاراتنا الموسمية، يُحضّر كل كوب على يد باريستا محترف باستخدام أجود المكونات.",leftSide:"قهوة\nمميزة\nأشخاص\nأفضل",rightSide:"كوب\nلغدٍ\nأكثر\nإشراقاً",items:[{title:"كلاسيكيات الإسبريسو",desc:"مشروبات إسبريسو غنية وقوية تشمل أمريكانو وماكياتو وكورتادو."},{title:"القهوة الباردة",desc:"قهوة باردة ناعمة ومحضّرة ببطء وخيارات قهوة مثلجة منعشة."},{title:"لاتيه مختص",desc:"لاتيه كريمي مع نكهات منزلية وخيارات حليب مميزة."},{title:"شاي فاخر",desc:"تشكيلة مختارة بعناية من أنواع الشاي من حول العالم."},{title:"مخبوزات طازجة",desc:"مخبوزات طازجة يومياً تشمل الكرواسون والمافن والسكونز."},{title:"وجبات خفيفة",desc:"ساندويتشات وسلطات ووجبات خفيفة بمكونات مختارة."}]});
  Object.assign(a.home.branches,{title:"اعثر على BARCODE بالقرب منك.",intro:"زر أحد فروع BARCODE واكتشف قهوة مختصة صُنعت للأشخاص والأماكن والإمكانات.",items:a.home.branches.items.map((x,i)=>({...x,name:["الهفوف","المبرز","الروابي"][i]??x.name,address:i===0?"الأمير سعود بن جلوي، المحمدية 8270، الوقوف 31982":x.address}))});
  Object.assign(a.home.faq,{title:"أسئلتك، مجابة.",intro:"كل ما قد ترغب في معرفته عن BARCODE."});
  Object.assign(a.about.hero,{since:"قهوة مختصة منذ 2019",title:"القهوة حرفتنا.",accent:"والناس غايتنا.",lead:"بُني BARCODE® على إيمان بسيط: تصبح القهوة الاستثنائية أكثر معنى عندما تصنع تجارب لا تُنسى وروابط حقيقية وسبباً للعودة.",cta:"اكتشف قصتنا",side:["قهوة","مميزة","أشخاص","أفضل"]});
  Object.assign(a.about.story,{label:"قصتنا",title:"رحلتنا مع",accent:"القهوة المختصة.",paragraphs:["بدأت رحلتنا مع القهوة المختصة منذ زمن، لكن قصة BARCODE® Cafe بدأت في عام 2019. أنشأنا المقهى بطابع كلاسيكي عصري يعكس رؤيتنا للابتكار والإبداع.","في BARCODE® Cafe نركز على القهوة المختصة إلى جانب مجموعة واسعة من المشروبات والحلويات والمنتجات الأخرى، مع اهتمام استثنائي بخدمة العملاء ورضاهم.","جوهر ما نقدمه هو جودة القهوة والمنتجات. نفخر باستخدام حبوب قهوة مميزة من أنحاء العالم لمن يقدّر متعة الرشفة المثالية."]});
  Object.assign(a.about.direction,{visionTitle:"الرؤية",visionText:"التوسع بفروعنا ومنتجاتنا في المملكة العربية السعودية والخليج والعالم العربي وما بعده، بطموح أن نصبح علامة رائدة في القهوة المختصة.",missionTitle:"الرسالة",missionText:"نؤمن بأن الابتكار والتنوع يجب أن يسيرا دائماً مع الجودة العالية. نطور منتجاتنا باستمرار لنكسب ثقة عملائنا ورضاهم."});
  a.about.goals=[{title:"منتجات بأعلى جودة",text:"تقديم قهوة مختصة وحلويات ومنتجات استثنائية تتجاوز التوقعات باستمرار."},{title:"علامة رائدة",text:"بناء علامة مميزة للقهوة المختصة بمعيار جودة يعرفه الناس ويثقون به."},{title:"توسع عالمي",text:"تنمية حضورنا محلياً وإقليمياً وعالمياً للوصول إلى المزيد من محبي القهوة."}];
  a.about.values=[{title:"النزاهة والشفافية",text:"نعمل بصدق ومصداقية وشفافية في كل ما نقوم به."},{title:"تجربة العميل",text:"صناعة تجربة أفضل للعملاء تقع في قلب كل ما نبنيه."},{title:"الإبداع والابتكار",text:"نتبنى الأفكار الجديدة والابتكار المستمر لدفع القهوة المختصة إلى الأمام."},{title:"الالتزام والموثوقية",text:"التزامنا بالجودة والمعايير الموثوقة يحدد طريقة عملنا."}];
  Object.assign(a.franchise.hero,{kicker:"فرصة امتياز تجاري",title:"كن",accent:"شريكاً.",intro:"قدّم تجربة قهوة مختصة مميزة في سوقك وابنِ الفصل القادم من BARCODE معنا.",cta:"ابدأ طلبك",country:"المملكة العربية السعودية"});
  Object.assign(a.franchise.opportunity,{label:"الفرصة",title:"أكثر من مجرد قهوة.",accent:"علامة صُممت للنمو.",text:"يجمع BARCODE® بين القهوة المختصة والتصميم المدروس وتجربة تتمحور حول العميل. صُممت فرصة الامتياز للشركاء الذين يرغبون في نقل هذه التجربة إلى مجتمعات جديدة مع الحفاظ على معايير العلامة.",cta:"ابدأ طلبك"});
  Object.assign(a.franchise.includes,{label:"يشمل امتيازك",title:"نبنيها معك.",accent:"بدعم BARCODE.",items:[{icon:"badge",title:"ترخيص العلامة التجارية",text:"العمل تحت علامة BARCODE® وهويتها البصرية المعتمدة."},{icon:"map",title:"اعتماد الموقع",text:"إرشاد واعتماد لاختيار موقع يتوافق مع مفهوم العلامة."},{icon:"training",title:"التدريب والدعم",text:"تدريب تشغيلي ودعم لإعداد فريقك للافتتاح."},{icon:"marketing",title:"التسويق",text:"إرشادات تسويقية ودعم لاتصالات الإطلاق."},{icon:"building",title:"دعم الافتتاح",text:"دعم خلال مراحل التجهيز النهائية والافتتاح."},{icon:"book",title:"دليل التشغيل",text:"إطار تشغيلي منظم للحفاظ على الاتساق."}]});
  Object.assign(a.franchise.investment,{label:"الاستثمار",title:"شروط واضحة.",accent:"وطموح مشترك.",items:[{value:"60,000",unit:"ر.س",label:"رسوم الامتياز"},{value:"5%",unit:"",label:"حقوق الامتياز"},{value:"2%",unit:"",label:"رسوم الإعلان"},{value:"5",unit:"سنوات",label:"مدة العقد"}],note:"* الرسوم الموضحة لا تشمل ضريبة القيمة المضافة. يتم تأكيد الشروط التجارية النهائية خلال إجراءات الامتياز."});
  Object.assign(a.franchise.journey,{label:"من الطلب إلى الافتتاح",title:"رحلتك نحو",accent:"يوم الافتتاح.",items:[{number:"01",title:"الطلب",text:"قدّم اهتمامك الأولي بالامتياز."},{number:"02",title:"المراجعة",text:"يراجع BARCODE الطلب ومدى الملاءمة."},{number:"03",title:"المناقشة",text:"اجتماع لمناقشة الفرصة والتوقعات."},{number:"04",title:"الإفصاح",text:"إكمال مرحلة الإفصاح واتفاقية السرية المطلوبة."},{number:"05",title:"زيارة الموقع",text:"تقييم واعتماد الموقع المقترح."},{number:"06",title:"الاتفاقية",text:"إتمام اتفاقية الامتياز."},{number:"07",title:"البناء",text:"الانتقال إلى التصميم والإنشاء والتجهيز."},{number:"08",title:"التدريب",text:"إعداد الفريق وتنفيذ الافتتاح التجريبي."},{number:"09",title:"الافتتاح",text:"الإطلاق بدعم BARCODE للافتتاح."},{number:"10",title:"التسويق",text:"بدء برنامج تسويق الافتتاح."}]});
  Object.assign(a.franchise.faq,{label:"الأسئلة الشائعة",title:"إجابات لما",accent:"يأتي بعد ذلك.",intro:"معلومات أساسية للشركاء المحتملين في امتياز BARCODE®."});
  Object.assign(a.franchise.application,{title:"فرصة الامتياز التجاري",intro:"انضم إلى عائلتنا المتنامية من رواد أعمال القهوة. ابدأ رحلتك مع علامة موثوقة ونموذج عمل مثبت.",firstName:"الاسم الأول *",lastName:"اسم العائلة *",email:"البريد الإلكتروني *",phone:"رقم الهاتف *",city:"المدينة",country:"الدولة",target:"الهدف",targetOptions:["امتياز تجاري"],trader:"هل أنت تاجر؟",traderOptions:["نعم","لا"],experience:"حدثنا عن خبرتك",submit:"إرسال الطلب",submitting:"جارٍ الإرسال…",success:"تم استلام طلبك. شكراً لك.",error:"تعذر إرسال الطلب. يرجى المحاولة مرة أخرى."});
  a.home.faq.items=a.home.faq.items.map(x=>x); // CMS FAQ questions remain as entered until Arabic versions are added.
  return { global:a.global, home:a.home, about:a.about, franchise:a.franchise };
}

export function useSiteCms(): { cms: CmsState; isArabic: boolean } {
  const {cms}=useCms();
  const {isArabic}=useLanguage();
  if(!isArabic) return {cms,isArabic};
  const arabic = cms.arabic ?? buildArabicContent(cms);
  return {cms:{...cms,...arabic},isArabic};
}
