import { useState } from "react";
import { startFrontend, startBackend, stopProcess, checkBackendHealth } from "../lib/tauri";

interface Props {
  onDeploy: () => void;
  onPublishImages: () => void;
  onStarted: () => void;
  disabled?: boolean;
}

export function ActionBar({ onDeploy, onPublishImages, onStarted, disabled }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [startingBoth, setStartingBoth] = useState(false);

  async function handleStartBoth() {
    setError(null);
    setStartingBoth(true);
    try {
      // Backend must be healthy before the frontend dev server starts,
      // because Strapi generates TypeScript types that the frontend needs on first compile.
      await startBackend();

      // Poll until Strapi is actually accepting connections.
      const deadline = Date.now() + 120_000;
      let healthy = false;
      while (Date.now() < deadline) {
        healthy = await checkBackendHealth();
        if (healthy) break;
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!healthy) {
        setError("Backend did not become healthy within 2 minutes. Check the Backend log tab.");
        return;
      }

      await startFrontend();
      onStarted();
    } catch (e) {
      setError(String(e));
    } finally {
      setStartingBoth(false);
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
          disabled={disabled || startingBoth}
          onClick={handleStartBoth}
          className="flex-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-1.5 rounded transition-colors disabled:opacity-40"
        >
          {startingBoth ? "Starting…" : "Start Both"}
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
        <button
          disabled={disabled}
          onClick={onPublishImages}
          className="w-full text-sm bg-sky-800 hover:bg-sky-700 text-white py-1.5 rounded transition-colors disabled:opacity-40"
        >
          Publish Images
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-400 font-mono break-all">{error}</p>
      )}
    </div>
  );
}
