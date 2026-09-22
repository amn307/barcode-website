import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  markSessionExit,
  startScrollTracking,
  trackPageView,
} from "./tracker";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;

    void trackPageView(
      `${location.pathname}${location.search}`,
      document.title
    );
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;

    return startScrollTracking();
  }, [location.pathname]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        void markSessionExit();
      }
    };

    const handlePageHide = () => {
      void markSessionExit();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
      window.removeEventListener(
        "pagehide",
        handlePageHide
      );
    };
  }, []);

  return null;
}