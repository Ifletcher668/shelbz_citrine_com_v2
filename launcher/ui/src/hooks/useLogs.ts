import { useState, useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { getLog, onLog, clearLog } from "../lib/tauri";

const POLL_INTERVAL_MS = 3000;

export function useLogs(process: string) {
  const [lines, setLines] = useState<string[]>([]);
  const unlistenRef = useRef<(() => void) | null>(null);
  const unlistenResetRef = useRef<(() => void) | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Load existing log lines on mount / process change
    getLog(process).then(setLines).catch(() => {});

    // Subscribe to new lines streamed in real-time
    onLog(process, (line) => {
      setLines((prev) => [...prev.slice(-999), line]);
    }).then((unlisten) => {
      unlistenRef.current = unlisten;
    });

    // Listen for reset signal emitted when a service starts
    listen<null>(`log:${process}:reset`, () => {
      setLines([]);
    }).then((unlisten) => {
      unlistenResetRef.current = unlisten;
    });

    // Periodic poll as a fallback so the log stays fresh even if an event is missed
    pollRef.current = setInterval(() => {
      getLog(process).then(setLines).catch(() => {});
    }, POLL_INTERVAL_MS);

    return () => {
      unlistenRef.current?.();
      unlistenResetRef.current?.();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [process]);

  const clear = async () => {
    await clearLog(process);
    setLines([]);
  };

  return { lines, clear };
}
