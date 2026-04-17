"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function TooltipHelp({
  children,
  tooltip,
  delayDuration = 200,
  sideOffset = 4,
  className = "",
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <span
            className={`group transition-colors text-pale-gold/90 hover:text-pale-gold cursor-help ${className}`}
          >
            {children}{" "}
            <HelpCircle className="inline-block w-[0.85em] h-[0.85em] -translate-y-[0.05em]" />
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={sideOffset}>
          {typeof tooltip === "string" ? (
            <p className="glass text-sm">{tooltip}</p>
          ) : (
            tooltip
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
