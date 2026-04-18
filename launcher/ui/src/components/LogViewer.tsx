import { useEffect, useRef, useState } from "react";
import { useLogs } from "../hooks/useLogs";
import {
  showBrowser,
  hideBrowser,
  reloadBrowser,
  navigateBrowser,
  openUrl,
  goBack,
  goForward,
  getWebviewUrl,
  onBrowserLoaded,
} from "../lib/tauri";

// Persists across BrowserPane mounts so the loading overlay is not re-shown
// when the user switches tabs and returns to an already-loaded browser.
const loadedBrowsers = new Set<string>();

type LogLevel = "error" | "warn" | "success" | "info" | "default";

function classifyLine(line: string): LogLevel {
  const l = line.toLowerCase();
  if (l.includes("error") || l.includes("[err]") || l.startsWith("error:"))
    return "error";
  if (l.includes("warn") || l.includes("warning")) return "warn";
  if (
    l.includes("success") ||
    l.includes("ready") ||
    l.includes("compiled") ||
    l.includes("✓")
  )
    return "success";
  if (l.includes("info") || l.includes("[launcher]")) return "info";
  return "default";
}

const LINE_COLORS: Record<LogLevel, string> = {
  error: "text-red-400",
  warn: "text-yellow-400",
  info: "text-sky-400",
  success: "text-emerald-400",
  default: "text-zinc-300",
};

const LOG_TABS = ["launcher", "frontend", "backend", "storybook"] as const;
const BROWSER_TABS = [
  "browser-frontend",
  "browser-backend",
  "browser-storybook",
] as const;
const TABS = [...LOG_TABS, ...BROWSER_TABS] as const;

export type Tab = (typeof TABS)[number];
type LogTab = (typeof LOG_TABS)[number];
type BrowserTab = (typeof BROWSER_TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  launcher: "Launcher",
  frontend: "Frontend",
  backend: "Backend",
  storybook: "Storybook",
  "browser-frontend": "Frontend",
  "browser-backend": "Backend",
  "browser-storybook": "Storybook",
};

const BROWSER_URLS: Record<BrowserTab, string> = {
  "browser-frontend": "http://localhost:3000",
  "browser-backend": `${process.env.STRAPI_URL}admin/`,
  "browser-storybook": "http://localhost:6006",
};

function isBrowserTab(tab: Tab): tab is BrowserTab {
  return (
    tab === "browser-frontend" ||
    tab === "browser-backend" ||
    tab === "browser-storybook"
  );
}

function LogPane({ process }: { process: string }) {
  const { lines, clear } = useLogs(process);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [pinned, setPinned] = useState(true);

  // Auto-scroll only when pinned to bottom
  useEffect(() => {
    if (!pinned) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, pinned]);

  // Re-pin when user scrolls back to the bottom
  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setPinned(atBottom);
  }

  async function copyAll() {
    if (lines.length === 0) return;
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function jumpToBottom() {
    setPinned(true);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex justify-end gap-3 px-2 py-1 border-b border-zinc-800">
        <button
          onClick={copyAll}
          disabled={lines.length === 0}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-30"
        >
          {copied ? "Copied!" : "Copy All"}
        </button>
        <button
          onClick={clear}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Clear
        </button>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 space-y-0.5 select-text cursor-text"
      >
        {lines.length === 0 ? (
          <p className="text-xs text-zinc-600 italic select-none">
            No output yet.
          </p>
        ) : (
          lines.map((line, i) => (
            <p
              key={i}
              className={`text-xs font-mono whitespace-pre-wrap break-all leading-4 ${LINE_COLORS[classifyLine(line)]}`}
            >
              {line}
            </p>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      {!pinned && (
        <button
          onClick={jumpToBottom}
          className="absolute bottom-14 right-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs px-2 py-1 rounded shadow transition-colors"
        >
          ↓ Latest
        </button>
      )}
    </div>
  );
}

function BrowserPane({ label, url }: { label: BrowserTab; url: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [urlInput, setUrlInput] = useState(url);
  const [isLoading, setIsLoading] = useState(!loadedBrowsers.has(label));
  const inputFocused = useRef(false);

  useEffect(() => {
    setUrlInput(url);
  }, [url]);

  // Listen for the backend signal that the browser has finished its initial load.
  useEffect(() => {
    const unlistenPromise = onBrowserLoaded(label, () => {
      loadedBrowsers.add(label);
      setIsLoading(false);
    });
    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [label]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    showBrowser(label, url, rect.x, rect.y, rect.width, rect.height).catch(
      console.error,
    );

    const observer = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      showBrowser(label, url, r.x, r.y, r.width, r.height).catch(console.error);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      hideBrowser(label).catch(console.error);
    };
  }, [label, url]);

  // Poll current URL every 2s, but don't overwrite while user is typing
  useEffect(() => {
    const id = setInterval(() => {
      if (!inputFocused.current) {
        getWebviewUrl(label)
          .then((u) => {
            if (u) setUrlInput(u);
          })
          .catch(() => {});
      }
    }, 2000);
    return () => clearInterval(id);
  }, [label]);

  function handleNavigate(e: React.FormEvent) {
    e.preventDefault();
    navigateBrowser(label, urlInput).catch(console.error);
  }

  return (
    <div className="flex flex-col h-full">
      <form
        onSubmit={handleNavigate}
        className="flex items-center gap-1.5 px-2 py-1 border-b border-zinc-800 bg-zinc-950"
      >
        <button
          type="button"
          onClick={() => goBack(label).catch(console.error)}
          title="Back"
          className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors px-1 shrink-0"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => goForward(label).catch(console.error)}
          title="Forward"
          className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors px-1 shrink-0"
        >
          →
        </button>
        <button
          type="button"
          onClick={() =>
            !isLoading && reloadBrowser(label).catch(console.error)
          }
          title={isLoading ? "Loading…" : "Reload"}
          className={`text-sm px-1 shrink-0 transition-colors ${
            isLoading
              ? "text-zinc-500 cursor-default animate-spin"
              : "text-zinc-500 hover:text-zinc-200"
          }`}
        >
          ⟳
        </button>
        <button
          type="button"
          onClick={() => navigateBrowser(label, url).catch(console.error)}
          title="Home"
          className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors px-1 shrink-0"
        >
          ⌂
        </button>
        <div className="flex-1 relative min-w-0">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onFocus={(e) => {
              inputFocused.current = true;
              e.target.select();
            }}
            onBlur={() => {
              inputFocused.current = false;
            }}
            className={`w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 transition-opacity ${
              isLoading ? "opacity-60" : ""
            }`}
          />
          {isLoading && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 animate-pulse pointer-events-none select-none">
              loading…
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => openUrl(urlInput).catch(console.error)}
          title="Open in external browser"
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors px-1 shrink-0"
        >
          ↗
        </button>
      </form>
      <div ref={panelRef} className="flex-1" />
    </div>
  );
}

export function LogViewer({ active }: { active: Tab }) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0">
        {isBrowserTab(active) ? (
          <BrowserPane label={active} url={BROWSER_URLS[active]} />
        ) : (
          <LogPane process={active as LogTab} />
        )}
      </div>
    </div>
  );
}
