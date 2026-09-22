import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type AnalyticsEventMeta = Record<
  string,
  string | number | boolean | null | undefined
>;

export type FirestoreAnalyticsEvent = {
  id: string;
  type: string;
  path: string;
  createdAt: string;
  visitorId: string;
  sessionId: string;
  meta?: AnalyticsEventMeta;
};

type SessionData = {
  visitorId?: string;
  sessionId?: string;
  landingPage?: string;
  currentPage?: string;
  likelyExitPage?: string;
  converted?: boolean;
  conversionType?: string | null;
  sessionDurationSeconds?: number;
  startedAt?: Timestamp | Date | string | null;
  lastActivityAt?: Timestamp | Date | string | null;
  endedAt?: Timestamp | Date | string | null;
};

type PageData = {
  path?: string;
  title?: string;
  enteredAt?: Timestamp | Date | string | null;
  exitedAt?: Timestamp | Date | string | null;
  durationSeconds?: number;
  maxScrollDepth?: number;
  sequence?: number;
};

type EventData = {
  visitorId?: string;
  sessionId?: string;
  name?: string;
  type?: string;
  path?: string;
  metadata?: AnalyticsEventMeta;
  meta?: AnalyticsEventMeta;
  createdAt?: Timestamp | Date | string | null;
};

function toIso(value: Timestamp | Date | string | null | undefined): string {
  if (!value) return new Date(0).toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
  }
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return new Date(0).toISOString();
}

async function loadSessionEvents(
  sessionSnapshot: QueryDocumentSnapshot<DocumentData>,
): Promise<FirestoreAnalyticsEvent[]> {
  const session = sessionSnapshot.data() as SessionData;
  const sessionId = session.sessionId || sessionSnapshot.id;
  const visitorId = session.visitorId || "unknown-visitor";
  const result: FirestoreAnalyticsEvent[] = [];

  const pagesSnapshot = await getDocs(
    query(
      collection(db, "analyticsSessions", sessionSnapshot.id, "pages"),
      orderBy("sequence", "asc"),
    ),
  );

  for (const pageDoc of pagesSnapshot.docs) {
    const page = pageDoc.data() as PageData;
    const path = page.path || "/";

    result.push({
      id: `page-${pageDoc.id}`,
      type: "page_view",
      path,
      createdAt: toIso(page.enteredAt),
      visitorId,
      sessionId,
      meta: {
        title: page.title || "",
        sequence: page.sequence ?? 0,
        maxScrollDepth: page.maxScrollDepth ?? 0,
      },
    });

    if ((page.durationSeconds ?? 0) > 0) {
      result.push({
        id: `engagement-${pageDoc.id}`,
        type: "page_engagement",
        path,
        createdAt: toIso(page.exitedAt || page.enteredAt),
        visitorId,
        sessionId,
        meta: {
          durationSeconds: page.durationSeconds ?? 0,
          maxScrollDepth: page.maxScrollDepth ?? 0,
          title: page.title || "",
        },
      });
    }
  }

  const storedEventsSnapshot = await getDocs(
    query(
      collection(db, "analyticsSessions", sessionSnapshot.id, "events"),
      orderBy("createdAt", "asc"),
    ),
  );

  for (const eventDoc of storedEventsSnapshot.docs) {
    const stored = eventDoc.data() as EventData;
    const type = stored.name || stored.type || "unknown";
    if (type === "page_view") continue;

    result.push({
      id: eventDoc.id,
      type,
      path: stored.path || session.currentPage || session.landingPage || "/",
      createdAt: toIso(stored.createdAt),
      visitorId: stored.visitorId || visitorId,
      sessionId: stored.sessionId || sessionId,
      meta: stored.metadata || stored.meta || {},
    });
  }

  if (pagesSnapshot.empty && (session.landingPage || session.currentPage)) {
    result.push({
      id: `fallback-page-${sessionSnapshot.id}`,
      type: "page_view",
      path: session.landingPage || session.currentPage || "/",
      createdAt: toIso(session.startedAt || session.lastActivityAt || session.endedAt),
      visitorId,
      sessionId,
      meta: { fallback: true },
    });

    if ((session.sessionDurationSeconds ?? 0) > 0) {
      result.push({
        id: `fallback-engagement-${sessionSnapshot.id}`,
        type: "page_engagement",
        path: session.currentPage || session.likelyExitPage || session.landingPage || "/",
        createdAt: toIso(session.endedAt || session.lastActivityAt || session.startedAt),
        visitorId,
        sessionId,
        meta: {
          durationSeconds: session.sessionDurationSeconds ?? 0,
          fallback: true,
        },
      });
    }
  }

  return result;
}

export function subscribeToAnalyticsEvents(
  onChange: (events: FirestoreAnalyticsEvent[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const sessionsQuery = query(
    collection(db, "analyticsSessions"),
    orderBy("startedAt", "desc"),
    limit(500),
  );

  let version = 0;

  return onSnapshot(
    sessionsQuery,
    async (snapshot) => {
      const currentVersion = ++version;
      try {
        const groups = await Promise.all(snapshot.docs.map(loadSessionEvents));
        if (currentVersion !== version) return;
        onChange(
          groups
            .flat()
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        );
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error("Unable to load analytics."));
      }
    },
    (error) => onError?.(error),
  );
}

async function deleteSession(sessionId: string): Promise<void> {
  const pages = await getDocs(collection(db, "analyticsSessions", sessionId, "pages"));
  await Promise.all(pages.docs.map((item) => deleteDoc(item.ref)));

  const events = await getDocs(collection(db, "analyticsSessions", sessionId, "events"));
  await Promise.all(events.docs.map((item) => deleteDoc(item.ref)));

  await deleteDoc(doc(db, "analyticsSessions", sessionId));
}

export async function clearFirestoreAnalytics(): Promise<void> {
  const sessions = await getDocs(collection(db, "analyticsSessions"));
  for (let index = 0; index < sessions.docs.length; index += 10) {
    await Promise.all(sessions.docs.slice(index, index + 10).map((item) => deleteSession(item.id)));
  }

  const visitors = await getDocs(collection(db, "analyticsVisitors"));
  for (let index = 0; index < visitors.docs.length; index += 25) {
    await Promise.all(visitors.docs.slice(index, index + 25).map((item) => deleteDoc(item.ref)));
  }
}
