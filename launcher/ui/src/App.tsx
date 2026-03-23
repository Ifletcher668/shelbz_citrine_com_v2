import { useState, useEffect } from "react";
import { checkPrerequisites, getStoredProjectPath } from "./lib/tauri";
import { useProcessStatus } from "./hooks/useProcessStatus";
import { StatusPanel } from "./components/StatusPanel";
import { ActionBar } from "./components/ActionBar";
import { GitStatus } from "./components/GitStatus";
import { LogViewer } from "./components/LogViewer";
import { PublishFlow } from "./components/PublishFlow";
import { SetupScreen } from "./components/SetupScreen";
import type { ProcessStatus } from "./lib/tauri";

type AppView = "loading" | "setup" | "dashboard";

export default function App() {
  const [view, setView] = useState<AppView>("loading");
  const [showPublish, setShowPublish] = useState(false);
  const { status, refresh, setOptimistic } = useProcessStatus();

  useEffect(() => {
    async function init() {
      try {
        // Quick check: do we have a stored project path?
        const stored = await getStoredProjectPath();
        if (!stored) {
          setView("setup");
          return;
        }
        // Verify full prerequisites
        const p = await checkPrerequisites();
        const needsSetup = !p.node || !p.yarn || !p.git || !p.project_root || !p.node_modules;
        setView(needsSetup ? "setup" : "dashboard");
      } catch {
        setView("setup");
      }
    }
    init();
  }, []);

  if (view === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (view === "setup") {
    return (
      <div className="h-screen bg-zinc-950 text-zinc-100">
        <SetupScreen onDone={() => setView("dashboard")} />
      </div>
    );
  }

  function handleOptimistic(key: keyof ProcessStatus, running: boolean) {
    setOptimistic(key, running);
    setTimeout(refresh, 1500);
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col select-none">
      <GitStatus />
      <StatusPanel status={status} onAction={handleOptimistic} />
      <ActionBar
        onPublish={() => setShowPublish(true)}
        onStarted={() => setTimeout(refresh, 1500)}
      />
      <LogViewer />
      {showPublish && (
        <PublishFlow status={status} onClose={() => setShowPublish(false)} />
      )}
    </div>
  );
}
