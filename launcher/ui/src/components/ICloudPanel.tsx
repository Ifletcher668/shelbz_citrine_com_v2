import { useEffect, useState } from "react";
import { icloudSave, icloudRestore, icloudStatus, getProcessStatus, stopProcess } from "../lib/tauri";

type Op = "save" | "restore" | "stopping" | null;

function parseLastSaved(status: string): string {
  const match = status.match(/Last save:\s+(\S+)/);
  if (!match) return "Never";
  const date = new Date(match[1]);
  if (isNaN(date.getTime())) return "Never";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ICloudPanel() {
  const [lastSaved, setLastSaved] = useState<string>("…");
  const [op, setOp] = useState<Op>(null);
  const [error, setError] = useState("");
  const [confirmStop, setConfirmStop] = useState(false);

  async function fetchStatus() {
    const text = await icloudStatus().catch(() => "");
    setLastSaved(parseLastSaved(text));
  }

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 60_000);
    return () => clearInterval(id);
  }, []);

  async function runOp(kind: "save" | "restore") {
    setOp(kind);
    setError("");
    setConfirmStop(false);
    try {
      await (kind === "save" ? icloudSave() : icloudRestore());
      await fetchStatus();
    } catch (e) {
      setError(String(e));
    } finally {
      setOp(null);
    }
  }

  async function handleSave() {
    try {
      const status = await getProcessStatus();
      if (status.backend) {
        setConfirmStop(true);
        return;
      }
    } catch {
      // Can't check; let the script report the error via the Launcher log.
    }
    runOp("save");
  }

  async function handleStopAndSave() {
    setOp("stopping");
    setError("");
    setConfirmStop(false);
    try {
      await stopProcess("backend");
      await new Promise((r) => setTimeout(r, 1200));
    } catch (e) {
      setError(`Failed to stop CMS: ${e}`);
      setOp(null);
      return;
    }
    runOp("save");
  }

  const busy = op !== null;

  return (
    <div className="px-3 pb-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">Last saved: {lastSaved}</span>
        <span className="text-[9px] text-zinc-600">→ Launcher log</span>
      </div>

      {confirmStop ? (
        <div className="bg-yellow-950 border border-yellow-700 rounded p-2 space-y-1.5">
          <p className="text-[10px] text-yellow-300">
            CMS is running. Stop it before saving to avoid a locked database.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleStopAndSave}
              className="flex-1 text-[10px] bg-yellow-700 hover:bg-yellow-600 text-white py-1 rounded transition-colors"
            >
              Stop CMS &amp; Save
            </button>
            <button
              onClick={() => setConfirmStop(false)}
              className="flex-1 text-[10px] bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-1 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={busy}
            className="flex-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1 rounded disabled:opacity-40 transition-colors"
          >
            {op === "save" ? "Saving…" : op === "stopping" ? "Stopping…" : "Save"}
          </button>
          <button
            onClick={() => runOp("restore")}
            disabled={busy}
            className="flex-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1 rounded disabled:opacity-40 transition-colors"
          >
            {op === "restore" ? "Restoring…" : "Restore"}
          </button>
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-400 bg-red-950 rounded px-2 py-1">{error}</p>
      )}
    </div>
  );
}
