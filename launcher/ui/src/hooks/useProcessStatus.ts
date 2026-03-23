import { useState, useEffect, useCallback } from "react";
import { getProcessStatus, ProcessStatus } from "../lib/tauri";

export function useProcessStatus() {
  const [status, setStatus] = useState<ProcessStatus>({
    frontend: false,
    backend: false,
    storybook: false,
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const s = await getProcessStatus();
      setStatus(s);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [refresh]);

  const setOptimistic = useCallback((key: keyof ProcessStatus, value: boolean) => {
    setStatus((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { status, refresh, setOptimistic, loading, setLoading };
}
