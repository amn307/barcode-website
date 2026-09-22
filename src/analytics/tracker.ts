import {
  collection,
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { ensureAnonymousVisitor } from "./ensureVisitor";
import {
  createPageVisitId,
  getOrCreateSessionId,
} from "./session";

type AnalyticsEventName =
  | "page_view"
  | "project_open"
  | "blog_open"
  | "contact_click"
  | "phone_click"
  | "email_click"
  | "whatsapp_click"
  | "contact_form_submit"
  | "consultation_panel_open"
  | "consultation_panel_collapse"
  | "consultation_panel_choice"
  | "consultation_booking_confirmed"
  | "scroll_depth";

type EventMetadata = Record<
  string,
  string | number | boolean | null | undefined
>;

let activePageVisitId: string | null = null;
let activePagePath: string | null = null;
let pageEnteredAt = Date.now();
let maxScrollDepth = 0;
let pageSequence = 0;

function isTrackablePublicPath(path: string): boolean {
  return !path.startsWith("/admin");
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function readCampaignParameters() {
  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
  };
}

async function finishCurrentPage(): Promise<void> {
  if (!activePageVisitId || !activePagePath) return;

  const user = await ensureAnonymousVisitor();
  if (!user) return;
  const sessionId = getOrCreateSessionId();
  const durationSeconds = Math.max(
    0,
    Math.round((Date.now() - pageEnteredAt) / 1000)
  );

  await updateDoc(
    doc(
      db,
      "analyticsSessions",
      sessionId,
      "pages",
      activePageVisitId
    ),
    {
      exitedAt: serverTimestamp(),
      durationSeconds,
      maxScrollDepth,
    }
  );

  await updateDoc(doc(db, "analyticsSessions", sessionId), {
    currentPage: activePagePath,
    likelyExitPage: activePagePath,
    lastActivityAt: serverTimestamp(),
    sessionDurationSeconds: increment(durationSeconds),
  });
}

export async function trackPageView(
  path: string,
  title = document.title
): Promise<void> {
  if (!isTrackablePublicPath(path)) return;

  try {
    await finishCurrentPage();

    const user = await ensureAnonymousVisitor();
    if (!user) return;
    const sessionId = getOrCreateSessionId();
    const sessionReference = doc(
      db,
      "analyticsSessions",
      sessionId
    );

    activePageVisitId = createPageVisitId();
    activePagePath = path;
    pageEnteredAt = Date.now();
    maxScrollDepth = 0;
    pageSequence += 1;

    const campaign = readCampaignParameters();

    await setDoc(
      doc(db, "analyticsVisitors", user.uid),
      {
        visitorId: user.uid,
        firstSeenAt: serverTimestamp(),
        lastSeenAt: serverTimestamp(),
        lastPath: path,
      },
      { merge: true }
    );

    await setDoc(
      sessionReference,
      {
        visitorId: user.uid,
        sessionId,
        startedAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
        endedAt: null,

        landingPage: path,
        currentPage: path,
        likelyExitPage: path,

        referrer: document.referrer || null,
        language:
          document.documentElement.lang ||
          navigator.language ||
          "en",
        deviceType: getDeviceType(),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,

        ...campaign,

        pageViewCount: increment(1),
        eventCount: increment(1),
        converted: false,
        conversionType: null,
        active: true,
      },
      { merge: true }
    );

    await setDoc(
      doc(
        db,
        "analyticsSessions",
        sessionId,
        "pages",
        activePageVisitId
      ),
      {
        visitorId: user.uid,
        sessionId,
        path,
        title,
        enteredAt: serverTimestamp(),
        exitedAt: null,
        durationSeconds: 0,
        maxScrollDepth: 0,
        sequence: pageSequence,
      }
    );

    await trackEvent("page_view", {
      path,
      title,
    });
  } catch (error) {
    console.error("Analytics page-view error:", error);
  }
}

export async function trackEvent(
  name: AnalyticsEventName,
  metadata: EventMetadata = {}
): Promise<void> {
  const path = window.location.pathname;

  if (!isTrackablePublicPath(path)) return;

  try {
    const user = await ensureAnonymousVisitor();
    if (!user) return;
    const sessionId = getOrCreateSessionId();

    await setDoc(
      doc(
        collection(
          db,
          "analyticsSessions",
          sessionId,
          "events"
        )
      ),
      {
        visitorId: user.uid,
        sessionId,
        name,
        path,
        metadata,
        createdAt: serverTimestamp(),
      }
    );

    await setDoc(
      doc(db, "analyticsSessions", sessionId),
      {
        lastActivityAt: serverTimestamp(),
        eventCount: increment(1),
        ...(name === "contact_form_submit"
          ? {
              converted: true,
              conversionType: "contact_form",
              convertedAt: serverTimestamp(),
            }
          : {}),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Analytics event error:", error);
  }
}

export function startScrollTracking(): () => void {
  const thresholds = [25, 50, 75, 100];
  const sent = new Set<number>();

  const handler = () => {
    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const depth =
      documentHeight <= 0
        ? 100
        : Math.min(
            100,
            Math.round(
              (window.scrollY / documentHeight) * 100
            )
          );

    maxScrollDepth = Math.max(maxScrollDepth, depth);

    for (const threshold of thresholds) {
      if (depth >= threshold && !sent.has(threshold)) {
        sent.add(threshold);

        void trackEvent("scroll_depth", {
          depth: threshold,
        });
      }
    }
  };

  window.addEventListener("scroll", handler, {
    passive: true,
  });

  return () => {
    window.removeEventListener("scroll", handler);
  };
}

export async function markSessionExit(): Promise<void> {
  if (!isTrackablePublicPath(window.location.pathname)) return;

  try {
    await finishCurrentPage();

    const sessionId = getOrCreateSessionId();

    await updateDoc(doc(db, "analyticsSessions", sessionId), {
      active: false,
      endedAt: serverTimestamp(),
      likelyExitPage:
        activePagePath ?? window.location.pathname,
      lastActivityAt: serverTimestamp(),
    });
  } catch {
    // Browsers may terminate async requests while closing.
  }
}