import { useState, useEffect, useRef } from "react";
import { publish, onPublishStep, onPublishCiLog, getDeployStatus, ProcessStatus } from "../lib/tauri";

interface Props {
  status: ProcessStatus;
  onClose: () => void;
}

function formatLastDeployed(iso: string | null): string {
  if (!iso) return "Never deployed";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Unknown";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function PublishFlow({ status, onClose }: Props) {
  const [steps, setSteps] = useState<string[]>([]);
  const [ciLogs, setCiLogs] = useState<string[]>([]);
  const [ciExpanded, setCiExpanded] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [lastDeployed, setLastDeployed] = useState<string>("…");
  const unlistenStepRef = useRef<(() => void) | null>(null);
  const unlistenCiRef = useRef<(() => void) | null>(null);
  const startTimeRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    getDeployStatus()
      .then((s) => setLastDeployed(formatLastDeployed(s.last_deployed_at)))
      .catch(() => {});

    onPublishStep((msg) => {
      setSteps((prev) => [...prev, msg]);
    }).then((u) => { unlistenStepRef.current = u; });

    onPublishCiLog((line) => {
      setCiLogs((prev) => [...prev, line]);
    }).then((u) => { unlistenCiRef.current = u; });

    return () => {
      unlistenStepRef.current?.();
      unlistenCiRef.current?.();
    };
  }, []);

  // Elapsed timer while running
  useEffect(() => {
    if (!running) { setElapsed(0); return; }
    startTimeRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  async function handlePublish() {
    setRunning(true);
    setError("");
    setSteps([]);
    setCiLogs([]);
    try {
      await publish();
      setDone(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  }

  const backendRunning = status.backend;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-80 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">Publish</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-lg leading-none">×</button>
        </div>

        <p className="text-[10px] text-zinc-500">Last deployed: {lastDeployed}</p>

        {backendRunning && !running && !done && (
          <div className="text-xs text-amber-400 bg-amber-950 rounded px-3 py-2">
            Stop the CMS Admin before publishing.
          </div>
        )}

        <div className="text-xs text-zinc-400 space-y-1">
          <p>This will:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-zinc-500">
            <li>Run frontend tests</li>
            <li>Run a build smoke test</li>
            <li>Save Strapi data to iCloud</li>
            <li>Trigger a Netlify deploy</li>
          </ol>
        </div>

        {steps.length > 0 && (
          <div className="bg-zinc-950 rounded p-2 space-y-1 max-h-28 overflow-y-auto">
            {steps.map((s, i) => (
              <p key={i} className="text-xs text-zinc-300">{s}</p>
            ))}
            {running && (
              <p className="text-[10px] text-zinc-500">Elapsed: {elapsed}s</p>
            )}
          </div>
        )}

        {ciLogs.length > 0 && (
          <div>
            <button
              onClick={() => setCiExpanded((v) => !v)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {ciExpanded ? "▾" : "▸"} CI Output ({ciLogs.length} lines)
            </button>
            {ciExpanded && (
              <div className="mt-1 bg-zinc-950 rounded p-2 max-h-40 overflow-y-auto space-y-0.5">
                {ciLogs.map((l, i) => (
                  <p key={i} className="text-[10px] font-mono text-zinc-400 whitespace-pre-wrap break-all leading-4">{l}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 bg-red-950 rounded px-3 py-2">{error}</p>
        )}

        {done && (
          <p className="text-xs text-emerald-400 bg-emerald-950 rounded px-3 py-2">
            Published successfully!
          </p>
        )}

        <div className="flex gap-2">
          {!done && (
            <button
              onClick={handlePublish}
              disabled={running || backendRunning}
              title={backendRunning ? "Stop CMS Admin before publishing" : undefined}
              className="flex-1 text-sm bg-emerald-700 hover:bg-emerald-600 text-white py-1.5 rounded disabled:opacity-40"
            >
              {running ? "Publishing…" : "Publish"}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 rounded"
          >
            {done ? "Done" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
