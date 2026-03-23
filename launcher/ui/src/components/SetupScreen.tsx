import { useState, useEffect, useRef } from "react";
import {
  Prerequisites,
  checkPrerequisites,
  installDeps,
  cloneRepo,
  setProjectPath,
  onInstallLog,
  onCloneLog,
} from "../lib/tauri";

interface Props {
  onDone: () => void;
}

type Step = "clone" | "install" | "env" | "done";

function prereqsMet(p: Prerequisites): boolean {
  return !!p.node && !!p.yarn && !!p.git;
}

function isFullyReady(p: Prerequisites): boolean {
  return prereqsMet(p) && !!p.project_root && p.node_modules;
}

export function SetupScreen({ onDone }: Props) {
  const [prereqs, setPrereqs] = useState<Prerequisites | null>(null);
  const [step, setStep] = useState<Step>("clone");

  // Clone step state
  const [clonePath, setClonePath] = useState("~/Projects/shelbz_citrine_com_v2");
  const [cloneMode, setCloneMode] = useState<"clone" | "existing">("clone");
  const [existingPath, setExistingPath] = useState("");
  const [cloneRunning, setCloneRunning] = useState(false);
  const [cloneLogs, setCloneLogs] = useState<string[]>([]);
  const [cloneError, setCloneError] = useState("");

  // Install step state
  const [installing, setInstalling] = useState(false);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [installError, setInstallError] = useState("");

  const cloneBottomRef = useRef<HTMLDivElement>(null);
  const installBottomRef = useRef<HTMLDivElement>(null);

  async function refreshPrereqs() {
    const p = await checkPrerequisites();
    setPrereqs(p);
    return p;
  }

  useEffect(() => {
    refreshPrereqs().then((p) => {
      if (isFullyReady(p)) {
        onDone();
      } else if (p.project_root) {
        setStep("install");
      }
    });
  }, []);

  useEffect(() => {
    cloneBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cloneLogs]);

  useEffect(() => {
    installBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [installLogs]);

  async function handleClone() {
    setCloneRunning(true);
    setCloneLogs([]);
    setCloneError("");
    const unlisten = await onCloneLog((line) => setCloneLogs((prev) => [...prev, line]));
    try {
      await cloneRepo(clonePath);
      await refreshPrereqs();
      setStep("install");
    } catch (e) {
      setCloneError(String(e));
    } finally {
      unlisten();
      setCloneRunning(false);
    }
  }

  async function handleUseExisting() {
    setCloneError("");
    try {
      await setProjectPath(existingPath);
      await refreshPrereqs();
      setStep("install");
    } catch (e) {
      setCloneError(String(e));
    }
  }

  async function handleInstall() {
    setInstalling(true);
    setInstallLogs([]);
    setInstallError("");
    const unlisten = await onInstallLog((line) => setInstallLogs((prev) => [...prev, line]));
    try {
      await installDeps();
      const p = await refreshPrereqs();
      if (isFullyReady(p)) onDone();
      else setStep("env");
    } catch (e) {
      setInstallError(String(e));
    } finally {
      unlisten();
      setInstalling(false);
    }
  }

  if (!prereqs) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-zinc-500">Checking prerequisites…</p>
      </div>
    );
  }

  const missingTools = !prereqsMet(prereqs);

  // ─── Clone / Select repo ─────────────────────────────────────────────────
  if (step === "clone") {
    return (
      <div className="p-4 space-y-4 overflow-y-auto h-full">
        <div>
          <h1 className="text-base font-semibold text-zinc-100">First-time Setup</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Set up the project repository to get started.
          </p>
        </div>

        {missingTools && (
          <div className="bg-red-950 border border-red-800 rounded p-3 space-y-1 text-xs text-red-300">
            <p className="font-medium text-red-200">Missing required tools:</p>
            {!prereqs.node && <p>• Node.js — install from <span className="text-red-200">nodejs.org</span></p>}
            {!prereqs.yarn && <p>• Yarn — run <code className="bg-red-900 px-1">npm install -g yarn</code></p>}
            {!prereqs.git && <p>• Git — install from <span className="text-red-200">git-scm.com</span></p>}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setCloneMode("clone")}
            className={`flex-1 text-xs py-1.5 rounded border transition-colors ${
              cloneMode === "clone"
                ? "border-emerald-600 bg-emerald-950 text-emerald-300"
                : "border-zinc-700 bg-zinc-800 text-zinc-400"
            }`}
          >
            Clone from GitHub
          </button>
          <button
            onClick={() => setCloneMode("existing")}
            className={`flex-1 text-xs py-1.5 rounded border transition-colors ${
              cloneMode === "existing"
                ? "border-emerald-600 bg-emerald-950 text-emerald-300"
                : "border-zinc-700 bg-zinc-800 text-zinc-400"
            }`}
          >
            Use existing clone
          </button>
        </div>

        {cloneMode === "clone" ? (
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Clone into directory</label>
            <input
              value={clonePath}
              onChange={(e) => setClonePath(e.target.value)}
              className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-zinc-500"
              placeholder="/Users/you/Projects/shelbz_citrine_com_v2"
            />
            <button
              onClick={handleClone}
              disabled={cloneRunning || missingTools || !clonePath.trim()}
              className="w-full text-sm bg-emerald-700 hover:bg-emerald-600 text-white py-1.5 rounded disabled:opacity-40"
            >
              {cloneRunning ? "Cloning…" : "Clone Repository"}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Path to existing clone</label>
            <input
              value={existingPath}
              onChange={(e) => setExistingPath(e.target.value)}
              className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-zinc-200 font-mono focus:outline-none focus:border-zinc-500"
              placeholder="/Users/you/Projects/shelbz_citrine_com_v2"
            />
            <button
              onClick={handleUseExisting}
              disabled={!existingPath.trim()}
              className="w-full text-sm bg-zinc-700 hover:bg-zinc-600 text-white py-1.5 rounded disabled:opacity-40"
            >
              Use This Path
            </button>
          </div>
        )}

        {cloneLogs.length > 0 && (
          <div className="bg-zinc-950 rounded p-2 max-h-40 overflow-y-auto">
            {cloneLogs.map((l, i) => (
              <p key={i} className="text-xs font-mono text-zinc-400">{l}</p>
            ))}
            <div ref={cloneBottomRef} />
          </div>
        )}

        {cloneError && (
          <p className="text-xs text-red-400 bg-red-950 rounded px-3 py-2">{cloneError}</p>
        )}
      </div>
    );
  }

  // ─── Install dependencies ─────────────────────────────────────────────────
  if (step === "install") {
    return (
      <div className="p-4 space-y-4 overflow-y-auto h-full">
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Install Dependencies</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Run <code className="bg-zinc-800 px-1 rounded">yarn install</code> to set up packages.
          </p>
        </div>

        {prereqs.project_root && (
          <p className="text-xs text-zinc-500 font-mono truncate">{prereqs.project_root}</p>
        )}

        {!prereqs.node_modules ? (
          <button
            onClick={handleInstall}
            disabled={installing}
            className="w-full text-sm bg-emerald-700 hover:bg-emerald-600 text-white py-1.5 rounded disabled:opacity-40"
          >
            {installing ? "Installing…" : "Install Dependencies"}
          </button>
        ) : (
          <button
            onClick={() => setStep("env")}
            className="w-full text-sm bg-zinc-700 hover:bg-zinc-600 text-white py-1.5 rounded"
          >
            Already installed — Continue →
          </button>
        )}

        {installLogs.length > 0 && (
          <div className="bg-zinc-950 rounded p-2 max-h-48 overflow-y-auto">
            {installLogs.map((l, i) => (
              <p key={i} className="text-xs font-mono text-zinc-400">{l}</p>
            ))}
            <div ref={installBottomRef} />
          </div>
        )}

        {installError && (
          <p className="text-xs text-red-400 bg-red-950 rounded px-3 py-2">{installError}</p>
        )}
      </div>
    );
  }

  // ─── Environment files ────────────────────────────────────────────────────
  if (step === "env") {
    const allEnvReady = prereqs.backend_env && prereqs.frontend_env;
    return (
      <div className="p-4 space-y-4 overflow-y-auto h-full">
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Environment Files</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Create <code className="bg-zinc-800 px-1 rounded">.env</code> files for each package.
          </p>
        </div>

        <div className="space-y-2">
          {[
            {
              ok: prereqs.backend_env,
              label: "backend/.env",
              hint: "Copy backend/.env.example → backend/.env and fill in secrets",
            },
            {
              ok: prereqs.frontend_env,
              label: "frontend/.env.local",
              hint: "Copy frontend/.env.example → frontend/.env.local",
            },
          ].map(({ ok, label, hint }) => (
            <div key={label} className="flex items-start gap-2">
              <span className={`mt-0.5 ${ok ? "text-emerald-500" : "text-zinc-600"}`}>
                {ok ? "✓" : "○"}
              </span>
              <div>
                <p className={`text-xs font-mono ${ok ? "text-zinc-300" : "text-zinc-400"}`}>{label}</p>
                {!ok && <p className="text-xs text-zinc-600 mt-0.5">{hint}</p>}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={async () => {
            await refreshPrereqs();
            onDone();
          }}
          className="w-full text-sm bg-zinc-700 hover:bg-zinc-600 text-white py-1.5 rounded"
        >
          {allEnvReady ? "Continue →" : "Skip for now →"}
        </button>
      </div>
    );
  }

  return null;
}
