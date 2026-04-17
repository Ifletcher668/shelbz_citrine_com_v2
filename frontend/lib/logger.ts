/**
 * Structured logger for the Shelbz Citrine frontend.
 *
 * Server-side (during `next build` / SSR): writes structured JSON via pino.
 * Client-side (browser): stores to a localStorage ring-buffer (cap 500 entries).
 */

const isServer = typeof window === "undefined";

/* ─── Server logger (pino) ─────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let serverLogger: any = null;

function getServerLogger() {
  if (!serverLogger) {
    // Dynamic require so pino is never bundled into client JS.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pino = require("pino");
    serverLogger = pino({ name: "shelbz-frontend", level: "info" });
  }
  return serverLogger;
}

/* ─── Browser logger ───────────────────────────────────────────────────── */

const BROWSER_LOG_KEY = "shelbz_logs";
const BROWSER_LOG_CAP = 500;

function browserLog(level: string, data: object) {
  try {
    const entry = { ts: new Date().toISOString(), level, ...data };
    const existing: object[] = JSON.parse(localStorage.getItem(BROWSER_LOG_KEY) ?? "[]");
    existing.push(entry);
    if (existing.length > BROWSER_LOG_CAP) existing.splice(0, existing.length - BROWSER_LOG_CAP);
    localStorage.setItem(BROWSER_LOG_KEY, JSON.stringify(existing));
  } catch {
    // localStorage unavailable (e.g. SSR hydration mismatch) — silently skip.
  }
}

/* ─── Public API ────────────────────────────────────────────────────────── */

export const logger = {
  info(data: object) {
    if (isServer) {
      getServerLogger().info(data);
    } else {
      browserLog("info", data);
    }
  },

  warn(data: object) {
    if (isServer) {
      getServerLogger().warn(data);
    } else {
      browserLog("warn", data);
    }
  },

  error(context: string, error: Error | unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    if (isServer) {
      getServerLogger().error({ context, message, stack });
    } else {
      browserLog("error", { context, message });
      // Also surface to DevTools for visibility.
      console.error(`[${context}]`, error);
    }
  },
};

/** Instrument a CMS data fetch call — call with the result after awaiting. */
export function logCmsFetch(slug: string, found: boolean, durationMs: number) {
  logger.info({ event: "cms_fetch", slug, found, duration: durationMs });
}

/** Log a page build (call from getStaticProps on success). */
export function logBuildPage(slug: string, durationMs: number) {
  logger.info({ event: "build_page", slug, duration: durationMs });
}
