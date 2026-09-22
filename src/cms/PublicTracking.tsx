import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useCms } from "./CmsContext";
import { isPublicWebsitePath, trackEvent } from "./analytics";

function addScript(id: string, src?: string, code?: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  if (src) {
    script.src = src;
    script.async = true;
  } else {
    script.text = code || "";
  }
  document.head.appendChild(script);
}

export default function PublicTracking() {
  const { cms } = useCms();
  const location = useLocation();
  const tracking = cms.tracking;
  const isPublicRoute = isPublicWebsitePath(location.pathname);
  const pageStartRef = useRef(Date.now());
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    if (!isPublicRoute) return;

    if (tracking.meta.enabled && tracking.meta.pixelId) {
      addScript(
        "barcode-meta",
        undefined,
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tracking.meta.pixelId}');fbq('track','PageView');`,
      );
    }

    if (
      tracking.googleMode === "ga4" &&
      tracking.ga4.enabled &&
      tracking.ga4.measurementId
    ) {
      addScript(
        "barcode-ga4-src",
        `https://www.googletagmanager.com/gtag/js?id=${tracking.ga4.measurementId}`,
      );
      addScript(
        "barcode-ga4",
        undefined,
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${tracking.ga4.measurementId}');`,
      );
    }

    if (
      tracking.googleMode === "gtm" &&
      tracking.gtm.enabled &&
      tracking.gtm.containerId
    ) {
      addScript(
        "barcode-gtm",
        undefined,
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${tracking.gtm.containerId}');`,
      );
    }

    if (tracking.customHeadScript) {
      addScript("barcode-custom-head", undefined, tracking.customHeadScript);
    }
  }, [isPublicRoute, tracking]);

  useEffect(() => {
    if (!isPublicRoute) return;

    const previousPath = previousPathRef.current;
    const durationSeconds = Math.max(
      0,
      Math.round((Date.now() - pageStartRef.current) / 1000),
    );

    if (
      previousPath !== location.pathname &&
      isPublicWebsitePath(previousPath)
    ) {
      trackEvent("page_engagement", { durationSeconds }, previousPath);
    }

    previousPathRef.current = location.pathname;
    pageStartRef.current = Date.now();

    trackEvent("page_view", {
      title: document.title,
      referrer: document.referrer || "direct",
    });

    try {
      (window as any).fbq?.("track", "PageView");
      (window as any).gtag?.("event", "page_view", {
        page_path: location.pathname,
      });
    } catch {
      // Third-party scripts may be blocked by browser privacy settings.
    }
  }, [isPublicRoute, location.pathname]);

  useEffect(() => {
    if (!isPublicRoute) return;

    const flushEngagement = () => {
      const durationSeconds = Math.max(
        0,
        Math.round((Date.now() - pageStartRef.current) / 1000),
      );
      if (durationSeconds > 0) {
        trackEvent("page_engagement", { durationSeconds }, previousPathRef.current);
      }
      pageStartRef.current = Date.now();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushEngagement();
      else pageStartRef.current = Date.now();
    };

    window.addEventListener("beforeunload", flushEngagement);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", flushEngagement);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isPublicRoute]);

  useEffect(() => {
    if (!isPublicRoute) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      const button = target.closest("button") as HTMLButtonElement | null;

      if (anchor) {
        const href = anchor.href;
        const label = (anchor.textContent || anchor.getAttribute("aria-label") || "").trim();
        if (href.includes("wa.me")) trackEvent("whatsapp_click", { label });
        else if (href.startsWith("tel:")) trackEvent("phone_click", { label });
        else if (href.startsWith("mailto:")) trackEvent("email_click", { label });
        else if (anchor.target === "_blank") trackEvent("outbound_click", { href, label });
        else trackEvent("link_click", { href: anchor.getAttribute("href") || "", label });
      } else if (button) {
        trackEvent("button_click", {
          label: (button.textContent || button.getAttribute("aria-label") || "Button").trim(),
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isPublicRoute]);

  return null;
}
