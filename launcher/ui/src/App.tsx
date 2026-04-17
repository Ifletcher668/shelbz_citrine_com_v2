import { useState, useEffect } from "react";
import { checkPrerequisites, getStoredProjectPath } from "./lib/tauri";
import { useProcessStatus } from "./hooks/useProcessStatus";
import { LogViewer } from "./components/LogViewer";
import type { Tab } from "./components/LogViewer";
import { Sidebar } from "./components/Sidebar";
import { DeployFlow } from "./components/DeployFlow";
import { PublishImagesFlow } from "./components/PublishImagesFlow";
import { SetupScreen } from "./components/SetupScreen";
import type { ProcessStatus } from "./lib/tauri";

type AppView = "loading" | "setup" | "dashboard";

export default function App() {
  const [view, setView] = useState<AppView>("loading");
  const [showDeploy, setShowDeploy] = useState(false);
  const [showPublishImages, setShowPublishImages] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("frontend");
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
    // If the server being stopped is the one backing the active browser tab, switch away
    if (!running) {
      if (key === "frontend" && activeTab === "browser-frontend") setActiveTab("frontend");
      if (key === "backend" && activeTab === "browser-backend") setActiveTab("backend");
      if (key === "storybook" && activeTab === "browser-storybook") setActiveTab("storybook");
    }
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex select-none">
      <Sidebar
        active={activeTab}
        onTabChange={setActiveTab}
        status={status}
        onAction={handleOptimistic}
        onDeploy={() => setShowDeploy(true)}
        onPublishImages={() => setShowPublishImages(true)}
        onStarted={() => setTimeout(refresh, 1500)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <LogViewer active={activeTab} />
      </div>
      {showDeploy && (
        <DeployFlow status={status} onClose={() => setShowDeploy(false)} />
      )}
      {showPublishImages && (
        <PublishImagesFlow status={status} onClose={() => setShowPublishImages(false)} />
      )}
    </div>
  );
}
