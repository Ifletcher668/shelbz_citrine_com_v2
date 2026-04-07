import { useState } from "react";
import { ProcessStatus, startFrontend, startBackend, startStorybook, stopProcess, openUrl } from "../lib/tauri";

interface Props {
  status: ProcessStatus;
  onAction: (key: keyof ProcessStatus, running: boolean) => void;
  disabled?: boolean;
}

const SERVICE_URLS: Record<keyof ProcessStatus, string> = {
  frontend: "http://localhost:3000",
  backend: "http://localhost:1337/admin",
  storybook: "http://localhost:6006",
};

const services: { key: keyof ProcessStatus; label: string; start: () => Promise<unknown> }[] = [
  { key: "frontend", label: "Development Website", start: startFrontend },
  { key: "backend", label: "CMS Admin", start: startBackend },
  { key: "storybook", label: "Storybook", start: startStorybook },
];

export function StatusPanel({ status, onAction, disabled }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof ProcessStatus, string>>>({});

  async function handleToggle(key: keyof ProcessStatus, running: boolean, start: () => Promise<unknown>) {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    onAction(key, !running);
    try {
      if (running) {
        await stopProcess(key);
      } else {
        await start();
      }
    } catch (e) {
      // revert optimistic
      onAction(key, running);
      setErrors((prev) => ({ ...prev, [key]: String(e) }));
    }
  }

  return (
    <div className="border-b border-zinc-800 px-4 py-3 space-y-2">
      {services.map(({ key, label, start }) => {
        const running = status[key];
        const error = errors[key];
        return (
          <div key={key}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${running ? "bg-green-500" : "bg-zinc-600"}`}
                />
                <span className="text-sm text-zinc-200">{label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {running && (
                  <button
                    onClick={() => openUrl(SERVICE_URLS[key])}
                    title={`Open ${label} in browser`}
                    className="text-xs px-2 py-1 rounded text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    ↗
                  </button>
                )}
                <button
                  disabled={disabled}
                  onClick={() => handleToggle(key, running, start)}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    running
                      ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                  } disabled:opacity-40`}
                >
                  {running ? "Stop" : "Start"}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-1 font-mono break-all">{error}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
