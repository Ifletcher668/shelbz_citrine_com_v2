import { useState, useEffect } from "react";
import { GitInfo, checkUpdates, gitFetch, gitPull } from "../lib/tauri";

export function GitStatus() {
  const [info, setInfo] = useState<GitInfo | null>(null);
  const [checking, setChecking] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [pullMsg, setPullMsg] = useState("");

  async function refresh() {
    setChecking(true);
    try {
      setInfo(await checkUpdates());
    } catch {
      // ignore
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleFetch() {
    setFetching(true);
    setPullMsg("");
    try {
      await gitFetch();
      await refresh();
    } catch (e) {
      setPullMsg(String(e));
    } finally {
      setFetching(false);
    }
  }

  async function handlePull() {
    setPulling(true);
    setPullMsg("");
    try {
      const msg = await gitPull();
      setPullMsg(msg || "Up to date");
      await refresh();
    } catch (e) {
      setPullMsg(String(e));
    } finally {
      setPulling(false);
    }
  }

  return (
    <div className="border-b border-zinc-800 px-4 py-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-xs text-zinc-400 min-w-0">
        <span className="font-mono truncate">{info?.branch ?? "—"}</span>
        {info && info.behind > 0 && (
          <span className="text-amber-400 shrink-0">↓{info.behind}</span>
        )}
        {info && info.ahead > 0 && (
          <span className="text-sky-400 shrink-0">↑{info.ahead}</span>
        )}
        {info && info.dirty > 0 && (
          <span className="text-zinc-500 shrink-0">{info.dirty} changed</span>
        )}
        {pullMsg && (
          <span className="text-zinc-500 truncate">{pullMsg}</span>
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        {info && info.behind > 0 && (
          <button
            onClick={handlePull}
            disabled={pulling}
            className="text-xs bg-sky-800 hover:bg-sky-700 text-white px-2 py-0.5 rounded disabled:opacity-40"
          >
            {pulling ? "Pulling…" : "Pull"}
          </button>
        )}
        <button
          onClick={handleFetch}
          disabled={fetching || checking}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded disabled:opacity-40"
        >
          {fetching ? "…" : "Fetch"}
        </button>
        <button
          onClick={refresh}
          disabled={checking}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded disabled:opacity-40"
        >
          {checking ? "…" : "↻"}
        </button>
      </div>
    </div>
  );
}
