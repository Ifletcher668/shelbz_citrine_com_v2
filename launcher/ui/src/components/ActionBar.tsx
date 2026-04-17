import { useState } from "react";
import { startFrontend, startBackend, stopProcess } from "../lib/tauri";

interface Props {
  onDeploy: () => void;
  onStarted: () => void;
  disabled?: boolean;
}

export function ActionBar({ onDeploy, onStarted, disabled }: Props) {
  const [error, setError] = useState<string | null>(null);

  async function handleStartBoth() {
    setError(null);
    try {
      await startFrontend();
      await startBackend();
      onStarted();
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleStopAll() {
    setError(null);
    try {
      await stopProcess("all");
      onStarted();
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div className="border-b border-zinc-800 px-4 py-3 space-y-2">
      <div className="flex gap-2 flex-wrap">
        <button
          disabled={disabled}
          onClick={handleStartBoth}
          className="flex-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-1.5 rounded transition-colors disabled:opacity-40"
        >
          Start Both
        </button>
        <button
          disabled={disabled}
          onClick={handleStopAll}
          className="flex-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-1.5 rounded transition-colors disabled:opacity-40"
        >
          Stop All
        </button>
        <button
          disabled={disabled}
          onClick={onDeploy}
          className="w-full text-sm bg-emerald-700 hover:bg-emerald-600 text-white py-1.5 rounded transition-colors disabled:opacity-40"
        >
          Deploy
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-400 font-mono break-all">{error}</p>
      )}
    </div>
  );
}
