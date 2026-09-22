import { useEffect, useMemo, useState } from "react";
import {
  clearFirestoreAnalytics,
  subscribeToAnalyticsEvents,
  type FirestoreAnalyticsEvent,
} from "../cms/FirestoreAnalytic";

type RangeDays = 7 | 30 | 90 | 365;

const CONVERSION_EVENTS = new Set([
  "contact_form_submit",
  "whatsapp_click",
  "phone_click",
  "email_click",
]);

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes < 60) return remaining ? `${minutes}m ${remaining}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

function titleForEvent(event: FirestoreAnalyticsEvent): string {
  const labels: Record<string, string> = {
    page_view: "Page viewed",
    page_engagement: "Page engagement",
    contact_form_submit: "Contact form submitted",
    whatsapp_click: "WhatsApp clicked",
    phone_click: "Phone clicked",
    email_click: "Email clicked",
    outbound_click: "External link clicked",
    link_click: "Link clicked",
    button_click: "Button clicked",
  };
  return labels[event.type] || event.type.replaceAll("_", " ");
}

function eventDetail(event: FirestoreAnalyticsEvent): string {
  if (event.type === "page_engagement") {
    return formatDuration(Number(event.meta?.durationSeconds || 0));
  }
  const label = String(event.meta?.label || "").trim();
  return label || event.path;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="qa-stat">
      <p className="qa-stat-label">{label}</p>
      <p className="qa-stat-value">{value}</p>
    </div>
  );
}

export default function AdminAnalytics() {
  const [rangeDays, setRangeDays] = useState<RangeDays>(30);
  const [events, setEvents] = useState<FirestoreAnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [subscriptionKey, setSubscriptionKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAnalyticsEvents(
      (nextEvents) => {
        setEvents(nextEvents);
        setLoading(false);
        setAnalyticsError("");
      },
      (error) => {
        setLoading(false);
        setAnalyticsError(error.message);
      },
    );
    return unsubscribe;
  }, [subscriptionKey]);

  const report = useMemo(() => {
    const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
    const filteredEvents = events
      .filter((event) => new Date(event.createdAt).getTime() >= cutoff)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const pageViews = filteredEvents.filter((event) => event.type === "page_view");
    const engagementEvents = filteredEvents.filter(
      (event) => event.type === "page_engagement",
    );
    const visitors = new Set(filteredEvents.map((event) => event.visitorId)).size;
    const sessions = new Set(filteredEvents.map((event) => event.sessionId)).size;
    const conversions = filteredEvents.filter((event) =>
      CONVERSION_EVENTS.has(event.type),
    ).length;
    const totalEngagement = engagementEvents.reduce(
      (sum, event) => sum + Number(event.meta?.durationSeconds || 0),
      0,
    );
    const avgEngagement = sessions ? totalEngagement / sessions : 0;

    const countByPath = pageViews.reduce<Record<string, number>>((acc, event) => {
      acc[event.path] = (acc[event.path] || 0) + 1;
      return acc;
    }, {});
    const topPages = Object.entries(countByPath)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const sessionGroups = filteredEvents.reduce<Record<string, FirestoreAnalyticsEvent[]>>(
      (acc, event) => {
        (acc[event.sessionId] ||= []).push(event);
        return acc;
      },
      {},
    );

    const journeys = Object.values(sessionGroups)
      .map((sessionEvents) => {
        const ordered = [...sessionEvents].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        const views = ordered.filter((event) => event.type === "page_view");
        const engagement = ordered
          .filter((event) => event.type === "page_engagement")
          .reduce(
            (sum, event) => sum + Number(event.meta?.durationSeconds || 0),
            0,
          );
        return {
          sessionId: ordered[0]?.sessionId || "",
          visitorId: ordered[0]?.visitorId || "",
          startedAt: ordered[0]?.createdAt || "",
          lastAt: ordered.at(-1)?.createdAt || "",
          pages: views.map((event) => event.path),
          activities: ordered.filter((event) => event.type !== "page_engagement"),
          engagement,
          converted: ordered.some((event) => CONVERSION_EVENTS.has(event.type)),
        };
      })
      .filter((journey) => journey.pages.length > 0)
      .sort(
        (a, b) =>
          new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime(),
      );

    const exitCounts = journeys.reduce<Record<string, number>>((acc, journey) => {
      const exitPage = journey.pages.at(-1);
      if (exitPage) acc[exitPage] = (acc[exitPage] || 0) + 1;
      return acc;
    }, {});
    const exitPages = Object.entries(exitCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const activityCounts = filteredEvents
      .filter((event) => !["page_view", "page_engagement"].includes(event.type))
      .reduce<Record<string, number>>((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {});
    const activities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);

    return {
      events: filteredEvents,
      visitors,
      sessions,
      pageViews: pageViews.length,
      avgEngagement,
      conversions,
      topPages,
      exitPages,
      activities,
      journeys: journeys.slice(0, 20),
    };
  }, [events, rangeDays]);

  const hasData = report.events.length > 0;

  return (
    <div className="qa-analytics">
      <header className="qa-analytics-hero">
        <div className="qa-analytics-head">
          <div>
            <h1 className="qa-analytics-title">
              Visitor Analytics
            </h1>
            <p className="qa-analytics-copy">
              See pages visited, activities, engagement time, journeys, and the
              likely last page before visitors left. Admin routes are excluded.
            </p>
          </div>
          <div className="qa-actions">
            <select
              value={rangeDays}
              onChange={(event) => setRangeDays(Number(event.target.value) as RangeDays)}
              className="qa-select"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>12 months</option>
            </select>
            <button
              onClick={() => setSubscriptionKey((value) => value + 1)}
              className="qa-button qa-button-secondary"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                if (!window.confirm("Delete all visitor analytics? This cannot be undone.")) return;
                setIsClearing(true);
                void clearFirestoreAnalytics()
                  .then(() => setEvents([]))
                  .catch((error: unknown) => {
                    setAnalyticsError(error instanceof Error ? error.message : "Unable to clear analytics.");
                  })
                  .finally(() => setIsClearing(false));
              }}
              className="qa-button qa-button-danger"
             disabled={isClearing || loading}>
              {isClearing ? "Clearing..." : "Clear"}
            </button>
          </div>
        </div>
      </header>

      {analyticsError && (
        <div className="qa-alert qa-alert-danger">
          {analyticsError}
        </div>
      )}

      {loading && !events.length && (
        <div className="qa-empty">
          Loading analytics from Firestore...
        </div>
      )}

      {!loading && !analyticsError && !hasData && (
        <div className="qa-alert qa-alert-warn">
          No public website activity has been recorded yet. Enable first-party
          analytics on the Pixels page, save it, browse the public website, and
          then return here.
        </div>
      )}

      <div className="qa-grid qa-grid-5">
        <StatCard label="Visitors" value={report.visitors} />
        <StatCard label="Sessions" value={report.sessions} />
        <StatCard label="Page views" value={report.pageViews} />
        <StatCard label="Avg. engagement" value={formatDuration(report.avgEngagement)} />
        <StatCard label="Conversions" value={report.conversions} />
      </div>

      <div className="qa-analytics-columns">
        <section className="qa-card qa-analytics-card">
          <h2 className="qa-card-title">Top pages</h2>
          <div className="qa-list-rows">
            {report.topPages.map(([path, count]) => (
              <div key={path} className="qa-row qa-row-divided">
                <span className="qa-muted">{path}</span>
                <strong className="qa-strong">{count}</strong>
              </div>
            ))}
            {!report.topPages.length && (
              <p className="qa-empty">No page views yet.</p>
            )}
          </div>
        </section>

        <section className="qa-card qa-analytics-card">
          <h2 className="qa-card-title">Likely exit pages</h2>
          <p className="qa-subtle">
            Last page recorded in each visitor session.
          </p>
          <div className="qa-list-rows">
            {report.exitPages.map(([path, count]) => (
              <div key={path} className="qa-row qa-row-divided">
                <span className="qa-muted">{path}</span>
                <strong className="qa-strong">{count}</strong>
              </div>
            ))}
            {!report.exitPages.length && (
              <p className="qa-empty">No completed journeys yet.</p>
            )}
          </div>
        </section>

        <section className="qa-card qa-analytics-card">
          <h2 className="qa-card-title">Activities</h2>
          <div className="qa-list-rows">
            {report.activities.map(([type, count]) => (
              <div key={type} className="qa-row qa-row-divided">
                <span className="qa-muted">
                  {type.replaceAll("_", " ")}
                </span>
                <strong className="qa-strong">{count}</strong>
              </div>
            ))}
            {!report.activities.length && (
              <p className="qa-empty">No interactions recorded yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="qa-card qa-analytics-card">
        <div className="qa-row">
          <div>
            <h2 className="qa-card-title">
              Recent visitor journeys
            </h2>
            <p className="qa-subtle">
              Sessions are grouped after 30 minutes of inactivity.
            </p>
          </div>
          <span className="qa-pill">
            {report.journeys.length} shown
          </span>
        </div>

        <div className="qa-stack">
          {report.journeys.map((journey, index) => (
            <article
              key={journey.sessionId}
              className="qa-journey"
            >
              <div className="qa-row">
                <div>
                  <p className="qa-strong">
                    Visitor {journey.visitorId.slice(0, 8)} · Session {index + 1}
                  </p>
                  <p className="qa-subtle">
                    {new Date(journey.startedAt).toLocaleString()} · {formatDuration(journey.engagement)} engagement
                  </p>
                </div>
                {journey.converted && (
                  <span className="qa-pill qa-pill-success">
                    Converted
                  </span>
                )}
              </div>

              <div className="qa-tags">
                {journey.pages.map((path, pageIndex) => (
                  <div key={`${path}-${pageIndex}`} className="qa-tags">
                    <span className="qa-pill">
                      {path}
                    </span>
                    {pageIndex < journey.pages.length - 1 && (
                      <span className="qa-subtle">→</span>
                    )}
                  </div>
                ))}
              </div>

              {journey.activities.length > journey.pages.length && (
                <div className="qa-divider">
                  <p className="qa-kicker">
                    Activity
                  </p>
                  <div className="qa-actions">
                    {journey.activities
                      .filter((event) => event.type !== "page_view")
                      .slice(-8)
                      .map((event) => (
                        <span
                          key={event.id}
                          className="qa-pill qa-pill-outline"
                        >
                          {titleForEvent(event)}: {eventDetail(event)}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </article>
          ))}

          {!report.journeys.length && (
            <p className="qa-empty">
              Visitor journeys will appear after people browse the public website.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
