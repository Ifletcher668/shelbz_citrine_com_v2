import { useState } from "react";
import { GitStatus } from "./GitStatus";
import { StatusPanel } from "./StatusPanel";
import { ActionBar } from "./ActionBar";
import { reloadBrowser } from "../lib/tauri";
import type { ProcessStatus } from "../lib/tauri";

const LOG_TABS = ["frontend", "backend", "storybook"] as const;
const BROWSER_TABS = ["browser-frontend", "browser-backend"] as const;

export type Tab = (typeof LOG_TABS)[number] | (typeof BROWSER_TABS)[number];

const LOG_LABELS: Record<(typeof LOG_TABS)[number], string> = {
  frontend: "Development Website",
  backend: "CMS Admin",
  storybook: "Storybook",
};

const BROWSER_LABELS: Record<(typeof BROWSER_TABS)[number], string> = {
  "browser-frontend": "Dev Browser",
  "browser-backend": "CMS Browser",
};

interface Props {
  active: Tab;
  onTabChange: (tab: Tab) => void;
  status: ProcessStatus;
  onAction: (key: keyof ProcessStatus, running: boolean) => void;
  onPublish: () => void;
  onStarted: () => void;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="px-3 pt-3 pb-1">
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{children}</span>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled ? "Server not running" : undefined}
      className={`text-left text-xs px-4 py-1.5 w-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "text-zinc-100 bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}

function BrowserTabRow({
  label,
  name,
  active,
  disabled,
  onSelect,
}: {
  label: (typeof BROWSER_TABS)[number];
  name: string;
  active: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="flex items-center">
      <TabButton label={name} active={active} onClick={onSelect} disabled={disabled} />
      <button
        onClick={() => reloadBrowser(label).catch(console.error)}
        disabled={disabled}
        title="Reload"
        className="shrink-0 pr-3 text-sm text-zinc-600 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ⟳
      </button>
    </div>
  );
}

export function Sidebar({ active, onTabChange, status, onAction, onPublish, onStarted }: Props) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(true);
  const expanded = hovered || pinned;

  return (
    <div
      className={`flex-shrink-0 flex flex-col bg-zinc-950 border-r border-zinc-800 transition-[width] duration-200 overflow-hidden ${
        expanded ? "w-60" : "w-10"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Collapsed sliver — toggle indicator */}
      <div
        className={`flex items-center justify-center h-full transition-opacity duration-150 ${
          expanded ? "opacity-0 pointer-events-none absolute" : "opacity-100"
        }`}
      >
        <span className="text-zinc-400 text-base select-none">›</span>
      </div>

      {/* Expanded content */}
      <div
        className={`flex flex-col h-full overflow-y-auto overflow-x-hidden transition-opacity duration-150 ${
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-end px-2 pt-1.5">
          <button
            onClick={() => setPinned((p) => !p)}
            title={pinned ? "Unpin sidebar" : "Pin sidebar open"}
            className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
              pinned
                ? "text-emerald-400 bg-emerald-900/40 hover:bg-emerald-900/60"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {pinned ? "pinned" : "pin"}
          </button>
        </div>
        <GitStatus />

        <SectionHeading>Actions</SectionHeading>
        <StatusPanel status={status} onAction={onAction} />
        <ActionBar onPublish={onPublish} onStarted={onStarted} />

        <SectionHeading>Logs</SectionHeading>
        {LOG_TABS.map((tab) => (
          <TabButton
            key={tab}
            label={LOG_LABELS[tab]}
            active={active === tab}
            onClick={() => onTabChange(tab)}
          />
        ))}

        <SectionHeading>Browsers</SectionHeading>
        <BrowserTabRow
          label="browser-frontend"
          name={BROWSER_LABELS["browser-frontend"]}
          active={active === "browser-frontend"}
          disabled={!status.frontend}
          onSelect={() => onTabChange("browser-frontend")}
        />
        <BrowserTabRow
          label="browser-backend"
          name={BROWSER_LABELS["browser-backend"]}
          active={active === "browser-backend"}
          disabled={!status.backend}
          onSelect={() => onTabChange("browser-backend")}
        />
      </div>
    </div>
  );
}
