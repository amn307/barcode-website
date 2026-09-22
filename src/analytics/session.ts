const SESSION_ID_KEY = "barcode_analytics_session_id";
const SESSION_STARTED_KEY = "barcode_analytics_session_started_at";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function createId(): string {
  return crypto.randomUUID();
}

export function getOrCreateSessionId(): string {
  const previousId = sessionStorage.getItem(SESSION_ID_KEY);
  const previousStarted = Number(
    sessionStorage.getItem(SESSION_STARTED_KEY) ?? 0
  );

  const expired =
    !previousStarted ||
    Date.now() - previousStarted > SESSION_TIMEOUT_MS;

  if (!previousId || expired) {
    const nextId = createId();

    sessionStorage.setItem(SESSION_ID_KEY, nextId);
    sessionStorage.setItem(
      SESSION_STARTED_KEY,
      String(Date.now())
    );

    return nextId;
  }

  return previousId;
}

export function createPageVisitId(): string {
  return crypto.randomUUID();
}