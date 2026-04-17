import { useState, useEffect, useRef } from "react";
import { publishImages, onPublishImagesStep, onPublishImagesLog } from "../lib/tauri";
import type { ProcessStatus } from "../lib/tauri";

interface Props {
  status: ProcessStatus;
  onClose: () => void;
}

export function PublishImagesFlow({ status, onClose }: Props) {
  const [steps, setSteps] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [logsExpanded, setLogsExpanded] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const unlistenStepRef = useRef<(() => void) | null>(null);
  const unlistenLogRef = useRef<(() => void) | null>(null);
  const startTimeRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    onPublishImagesStep((msg) => {
      setSteps((prev) => [...prev, msg]);
    }).then((u) => { unlistenStepRef.current = u; });

    onPublishImagesLog((line) => {
      setLogs((prev) => [...prev, line]);
    }).then((u) => { unlistenLogRef.current = u; });

    return () => {
      unlistenStepRef.current?.();
      unlistenLogRef.current?.();
    };
  }, []);

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
    setLogs([]);
    try {
      await publishImages();
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
          <h2 className="text-sm font-semibold text-zinc-100">Publish Images</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-lg leading-none">×</button>
        </div>

        {backendRunning && !running && !done && (
          <div className="text-xs text-amber-400 bg-amber-950 rounded px-3 py-2">
            Stop the CMS backend before publishing images.
          </div>
        )}

        <div className="text-xs text-zinc-400 space-y-1">
          <p>Runs the <code className="font-mono text-zinc-300">images:publish</code> script against the Strapi database. The CMS backend must be stopped first.</p>
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

        {logs.length > 0 && (
          <div>
            <button
              onClick={() => setLogsExpanded((v) => !v)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {logsExpanded ? "▾" : "▸"} Output ({logs.length} lines)
            </button>
            {logsExpanded && (
              <div className="mt-1 bg-zinc-950 rounded p-2 max-h-40 overflow-y-auto space-y-0.5">
                {logs.map((l, i) => (
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
            Images published successfully!
          </p>
        )}

        <div className="flex gap-2">
          {!done && (
            <button
              onClick={handlePublish}
              disabled={running || backendRunning}
              title={backendRunning ? "Stop CMS backend before publishing images" : undefined}
              className="flex-1 text-sm bg-sky-700 hover:bg-sky-600 text-white py-1.5 rounded disabled:opacity-40"
            >
              {running ? "Publishing…" : "Publish Images"}
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
