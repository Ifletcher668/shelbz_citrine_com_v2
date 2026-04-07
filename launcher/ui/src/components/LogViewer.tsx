import { useEffect, useRef, useState } from "react";
import { useLogs } from "../hooks/useLogs";
import { showBrowser, hideBrowser, reloadBrowser, navigateBrowser, openUrl } from "../lib/tauri";

const LOG_TABS = ["frontend", "backend", "storybook"] as const;
const BROWSER_TABS = ["browser-frontend", "browser-backend"] as const;
const TABS = [...LOG_TABS, ...BROWSER_TABS] as const;

export type Tab = (typeof TABS)[number];
type LogTab = (typeof LOG_TABS)[number];
type BrowserTab = (typeof BROWSER_TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  frontend: "Development Website",
  backend: "CMS Admin",
  storybook: "Storybook",
  "browser-frontend": "Dev Browser",
  "browser-backend": "CMS Browser",
};

const BROWSER_URLS: Record<BrowserTab, string> = {
  "browser-frontend": "http://localhost:3000",
  "browser-backend": "http://localhost:1337/admin/",
};

function isBrowserTab(tab: Tab): tab is BrowserTab {
  return tab === "browser-frontend" || tab === "browser-backend";
}

function LogPane({ process }: { process: string }) {
  const { lines, clear } = useLogs(process);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  async function copyAll() {
    if (lines.length === 0) return;
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col h-full">
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
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 select-text cursor-text">
        {lines.length === 0 ? (
          <p className="text-xs text-zinc-600 italic select-none">No output yet.</p>
        ) : (
          lines.map((line, i) => (
            <p key={i} className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all leading-4">
              {line}
            </p>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function BrowserPane({ label, url }: { label: BrowserTab; url: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [urlInput, setUrlInput] = useState(url);

  useEffect(() => {
    setUrlInput(url);
  }, [url]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    showBrowser(label, url, rect.x, rect.y, rect.width, rect.height).catch(console.error);

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
          onClick={() => reloadBrowser(label).catch(console.error)}
          title="Reload"
          className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors px-1 shrink-0"
        >
          ⟳
        </button>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 min-w-0"
        />
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
