export type CmsAsset = { src: string; alt: string };
export type TrackingSettings = {
  meta:{enabled:boolean;pixelId:string}; tiktok:{enabled:boolean;pixelId:string};
  linkedin:{enabled:boolean;partnerId:string}; snapchat:{enabled:boolean;pixelId:string};
  googleMode:'none'|'ga4'|'gtm'; ga4:{enabled:boolean;measurementId:string}; gtm:{enabled:boolean;containerId:string};
  customHeadScript:string; customBodyScript:string;
};
export type CmsMessage = { id:string; createdAt:string; name:string; email:string; phone:string; project:string; service:string; message:string; status:'new'|'in_progress'|'done'|'archived'; priority:'normal'|'high' };
export type CmsState = {
  global: { logo:CmsAsset; heroLogo:CmsAsset; nav:{home:string;about:string;menu:string;branches:string;franchise:string;language:string;partner:string;application:string}; footer:{description:string;quickLinksTitle:string;contactTitle:string;followTitle:string;followText:string;phone:string;email:string;instagramHandle:string;instagramUrl:string;tiktokUrl:string;linkedinUrl:string;copyright:string;goodCoffee:string;betterPeople:string;established:string} };
  home: { hero:{video:string;smallTitle:string;mainTitle:string;est:string;country:string;motto:string;scroll:string;bottom:string[]}; stats:{target:number;suffix:string;line1:string;line2:string}[]; about:{eyebrow:string;title:string;accent:string;subheading:string;paragraphs:string[];button:string;est:string;image:CmsAsset;country:string}; menu:{eyebrow:string;title:string;accent:string;intro:string;leftSide:string;rightSide:string;items:{title:string;desc:string}[]}; branches:{title:string;intro:string;map:CmsAsset;items:{name:string;address:string;image:CmsAsset}[]}; faq:{title:string;intro:string;items:{q:string;a:string}[]} };
  about:{ hero:{background:CmsAsset;since:string;title:string;accent:string;lead:string;cta:string;side:string[]}; story:{label:string;title:string;accent:string;image:CmsAsset;paragraphs:string[]}; direction:{background:CmsAsset;visionTitle:string;visionText:string;missionTitle:string;missionText:string}; goals:{title:string;text:string}[]; values:{title:string;text:string}[] };
  franchise:{ hero:{image:CmsAsset;kicker:string;title:string;accent:string;intro:string;cta:string}; opportunity:{title:string;text:string}; includes:{title:string;text:string}[]; investment:{image:CmsAsset;title:string;note:string}; journey:{title:string;text:string}[]; faq:{q:string;a:string}[] };
  tracking:TrackingSettings; media:string[]; messages:CmsMessage[]; settings:{companyName:string;email:string;phone:string;baseUrl:string;instagram:string;linkedin:string}; updatedAt:string;
};
