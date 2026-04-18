import { useRef, useState } from "react";
import {
  ProcessStatus,
  startFrontend,
  startBackend,
  startStorybook,
  stopProcess,
  openUrl,
  checkBackendHealth,
} from "../lib/tauri";

interface Props {
  status: ProcessStatus;
  onAction: (key: keyof ProcessStatus, running: boolean) => void;
  disabled?: boolean;
}

const SERVICE_URLS: Record<keyof ProcessStatus, string> = {
  frontend: "http://localhost:3000",
  backend: `${process.env.STRAPI_URL}admin/`,
  storybook: "http://localhost:6006",
};

const services: {
  key: keyof ProcessStatus;
  label: string;
  start: () => Promise<unknown>;
}[] = [
  { key: "frontend", label: "Frontend", start: startFrontend },
  { key: "backend", label: "Backend", start: startBackend },
  { key: "storybook", label: "Storybook", start: startStorybook },
];

export function StatusPanel({ status, onAction, disabled }: Props) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProcessStatus, string>>
  >({});
  // Track when we're waiting for the backend to become healthy before starting another service.
  const [waitingFor, setWaitingFor] = useState<keyof ProcessStatus | null>(
    null,
  );
  const cancelRef = useRef(false);

  async function waitForBackendHealth(): Promise<boolean> {
    cancelRef.current = false;
    const deadline = Date.now() + 120_000; // 2 min timeout
    while (Date.now() < deadline) {
      if (cancelRef.current) return false;
      const healthy = await checkBackendHealth();
      if (healthy) return true;
      await new Promise((r) => setTimeout(r, 2000));
    }
    return false;
  }

  async function handleToggle(
    key: keyof ProcessStatus,
    running: boolean,
    start: () => Promise<unknown>,
  ) {
    setErrors((prev) => ({ ...prev, [key]: undefined }));

    if (running) {
      // Stopping is always straightforward.
      onAction(key, false);
      try {
        await stopProcess(key);
      } catch (e) {
        onAction(key, true);
        setErrors((prev) => ({ ...prev, [key]: String(e) }));
      }
      return;
    }

    // Starting the frontend requires the backend to be healthy first,
    // because Strapi generates TypeScript types at startup that the
    // frontend dev server needs on first compile.
    if (key === "frontend" && !status.backend) {
      onAction("backend", true); // optimistic
      onAction("frontend", true); // optimistic
      setWaitingFor("frontend");

      try {
        await startBackend();
      } catch (e) {
        onAction("backend", false);
        onAction("frontend", false);
        setWaitingFor(null);
        setErrors((prev) => ({
          ...prev,
          frontend: `Could not start backend: ${String(e)}`,
        }));
        return;
      }

      const healthy = await waitForBackendHealth();
      setWaitingFor(null);

      if (!healthy) {
        onAction("backend", false);
        onAction("frontend", false);
        setErrors((prev) => ({
          ...prev,
          frontend:
            "Backend did not become healthy within 2 minutes. Check the Backend log tab for errors.",
        }));
        return;
      }

      try {
        await start(); // start frontend now that backend is healthy
      } catch (e) {
        onAction("frontend", false);
        setErrors((prev) => ({ ...prev, frontend: String(e) }));
      }
      return;
    }

    // All other services: start directly.
    onAction(key, true);
    try {
      await start();
    } catch (e) {
      onAction(key, false);
      setErrors((prev) => ({ ...prev, [key]: String(e) }));
    }
  }

  return (
    <div className="border-b border-zinc-800 px-4 py-3 space-y-2">
      {services.map(({ key, label, start }) => {
        const running = status[key];
        const error = errors[key];
        const isWaiting = waitingFor === key;

        return (
          <div key={key}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isWaiting
                      ? "bg-amber-400 animate-pulse"
                      : running
                        ? "bg-green-500"
                        : "bg-zinc-600"
                  }`}
                />
                <span className="text-sm text-zinc-200">{label}</span>
                {isWaiting && (
                  <span className="text-[10px] text-zinc-500">
                    waiting for backend…
                  </span>
                )}
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
                  disabled={disabled || isWaiting}
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
              <p className="text-xs text-red-400 mt-1 font-mono break-all">
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
