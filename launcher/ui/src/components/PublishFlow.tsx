import { useState, useEffect, useRef } from "react";
import { publish, onPublishStep } from "../lib/tauri";
import { ProcessStatus } from "../lib/tauri";

interface Props {
  status: ProcessStatus;
  onClose: () => void;
}

export function PublishFlow({ status, onClose }: Props) {
  const [steps, setSteps] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const unlistenRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onPublishStep((msg) => {
      setSteps((prev) => [...prev, msg]);
    }).then((u) => { unlistenRef.current = u; });
    return () => { unlistenRef.current?.(); };
  }, []);

  async function handlePublish() {
    setRunning(true);
    setError("");
    setSteps([]);
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

        {backendRunning && !running && !done && (
          <div className="text-xs text-amber-400 bg-amber-950 rounded px-3 py-2">
            CMS Admin is running. It will be stopped automatically before saving.
          </div>
        )}

        <div className="text-xs text-zinc-400 space-y-1">
          <p>This will:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-zinc-500">
            <li>Save Strapi data to iCloud</li>
            <li>Trigger a Netlify deploy</li>
          </ol>
        </div>

        {steps.length > 0 && (
          <div className="bg-zinc-950 rounded p-2 space-y-1 max-h-32 overflow-y-auto">
            {steps.map((s, i) => (
              <p key={i} className="text-xs text-zinc-300">{s}</p>
            ))}
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
              disabled={running}
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
