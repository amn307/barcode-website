export type AnalyticsEvent = {
  id: string;
  type: string;
  path: string;
  createdAt: string;
  visitorId: string;
  sessionId: string;
  meta?: Record<string, string | number | boolean>;
};

const KEY = "barcode_analytics_events_v2";
const LEGACY_KEY = "barcode_analytics_events_v1";
const VISITOR_KEY = "barcode_analytics_visitor_id";
const SESSION_KEY = "barcode_analytics_session";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function isPublicWebsitePath(path: string): boolean {
  return !path.startsWith("/admin");
}

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = createId();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  const now = Date.now();
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null") as
      | { id: string; lastActivity: number }
      | null;
    if (saved && now - saved.lastActivity < SESSION_TIMEOUT_MS) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ id: saved.id, lastActivity: now }),
      );
      return saved.id;
    }
  } catch {
    // Start a new session if saved state is invalid.
  }

  const id = createId();
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id, lastActivity: now }));
  return id;
}

export function getEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY) || "[]";
    const events = JSON.parse(raw) as Array<Partial<AnalyticsEvent>>;
    return events
      .filter((event) => Boolean(event.path) && isPublicWebsitePath(event.path || ""))
      .map((event) => ({
        id: event.id || createId(),
        type: event.type || "unknown",
        path: event.path || "/",
        createdAt: event.createdAt || new Date().toISOString(),
        visitorId: event.visitorId || "legacy-visitor",
        sessionId: event.sessionId || "legacy-session",
        meta: event.meta,
      }));
  } catch {
    return [];
  }
}

export function trackEvent(
  type: string,
  meta?: AnalyticsEvent["meta"],
  pathOverride?: string,
): void {
  const path = pathOverride || window.location.pathname;
  if (!isPublicWebsitePath(path)) return;

  const items = getEvents();
  items.unshift({
    id: createId(),
    type,
    path,
    createdAt: new Date().toISOString(),
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    meta,
  });

  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 10000)));
}

export function clearEvents(): void {
  localStorage.removeItem(KEY);
  localStorage.removeItem(LEGACY_KEY);
}
