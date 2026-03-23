import { useState, useEffect, useRef } from "react";
import { useLogs } from "../hooks/useLogs";

const TABS = ["frontend", "backend", "storybook"] as const;
type Tab = (typeof TABS)[number];

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

export function LogViewer() {
  const [active, setActive] = useState<Tab>("frontend");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex border-b border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-1.5 text-xs capitalize transition-colors ${
              active === tab
                ? "text-zinc-100 border-b-2 border-emerald-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0 min-h-24">
        <LogPane process={active} />
      </div>
    </div>
  );
}
