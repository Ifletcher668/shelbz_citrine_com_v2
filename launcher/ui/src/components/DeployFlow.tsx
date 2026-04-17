import { useState, useEffect, useRef } from "react";
import {
  deploy,
  onDeployStep,
  onDeployCiLog,
  getDeployStatus,
  startBackend,
  checkBackendHealth,
} from "../lib/tauri";
import type { ProcessStatus } from "../lib/tauri";

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

export function DeployFlow({ status, onClose }: Props) {
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

  // Backend health tracking — separate from "process alive" (status.backend).
  // Strapi needs time after the process starts before it accepts connections.
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [backendStarting, setBackendStarting] = useState(false);
  const healthPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopHealthPoll() {
    if (healthPollRef.current !== null) {
      clearInterval(healthPollRef.current);
      healthPollRef.current = null;
    }
  }

  // When the backend process comes up, poll until the TCP port accepts connections.
  useEffect(() => {
    if (!status.backend) {
      setBackendHealthy(false);
      setBackendStarting(false);
      stopHealthPoll();
      return;
    }

    if (backendHealthy) return; // already confirmed, nothing to do

    // Process is alive but we haven't confirmed health yet — start polling.
    setBackendStarting(true);
    stopHealthPoll();
    healthPollRef.current = setInterval(async () => {
      const healthy = await checkBackendHealth();
      if (healthy) {
        setBackendHealthy(true);
        setBackendStarting(false);
        stopHealthPoll();
      }
    }, 2000);

    return stopHealthPoll;
  }, [status.backend]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getDeployStatus()
      .then((s) => setLastDeployed(formatLastDeployed(s.last_deployed_at)))
      .catch(() => {});

    onDeployStep((msg) => setSteps((prev) => [...prev, msg]))
      .then((u) => { unlistenStepRef.current = u; });

    onDeployCiLog((line) => setCiLogs((prev) => [...prev, line]))
      .then((u) => { unlistenCiRef.current = u; });

    return () => {
      unlistenStepRef.current?.();
      unlistenCiRef.current?.();
      stopHealthPoll();
    };
  }, []);

  // Elapsed timer while deploying
  useEffect(() => {
    if (!running) { setElapsed(0); return; }
    startTimeRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  async function handleStartBackend() {
    setError("");
    try {
      await startBackend();
      // Health polling kicks in automatically via the status.backend effect once
      // useProcessStatus detects the new process (within ~3 s).
      // Set starting state immediately so the UI reflects intent.
      setBackendStarting(true);
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleDeploy() {
    setRunning(true);
    setError("");
    setSteps([]);
    setCiLogs([]);
    try {
      await deploy();
      setDone(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  }

  const backendRunning = status.backend;
  const deployReady = backendHealthy && !running;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-80 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">Deploy to Netlify</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-lg leading-none">×</button>
        </div>

        <p className="text-[10px] text-zinc-500">Last deployed: {lastDeployed}</p>

        {/* Backend status banner */}
        {!backendRunning && !running && !done && (
          <div className="space-y-2">
            <div className="text-xs text-amber-400 bg-amber-950 rounded px-3 py-2">
              The CMS backend must be running. Netlify fetches all page content from Strapi during its build.
            </div>
            <button
              onClick={handleStartBackend}
              className="w-full text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 py-1.5 rounded transition-colors"
            >
              Start Backend
            </button>
          </div>
        )}

        {backendRunning && backendStarting && !done && (
          <div className="text-xs text-zinc-400 bg-zinc-800 rounded px-3 py-2 flex items-center gap-2">
            <span className="animate-pulse">⬤</span>
            Waiting for backend to be ready…
          </div>
        )}

        {backendRunning && backendHealthy && !running && !done && (
          <div className="text-xs text-emerald-400 bg-emerald-950/40 rounded px-3 py-2">
            Backend is ready.
          </div>
        )}

        <div className="text-xs text-zinc-400 space-y-1">
          <p>This will:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-zinc-500">
            <li>Run a build smoke test</li>
            <li>Stop backend → publish images → save to iCloud</li>
            <li>Restart backend and confirm it's healthy</li>
            <li>Trigger the Netlify deploy</li>
          </ol>
          <p className="text-zinc-600 pt-1">Keep the backend running after — Netlify needs it.</p>
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
            Netlify build triggered! Keep the backend running — Netlify is fetching content from it now.
          </p>
        )}

        <div className="flex gap-2">
          {!done && (
            <button
              onClick={handleDeploy}
              disabled={!deployReady}
              title={
                !backendRunning ? "Start the CMS backend first" :
                backendStarting ? "Waiting for backend to be ready…" :
                undefined
              }
              className="flex-1 text-sm bg-emerald-700 hover:bg-emerald-600 text-white py-1.5 rounded disabled:opacity-40 transition-colors"
            >
              {running ? "Deploying…" : "Deploy"}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-1.5 rounded transition-colors"
          >
            {done ? "Done" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
