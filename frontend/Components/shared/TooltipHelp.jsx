"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";

/**
 * TooltipHelp - Inline help tooltip component
 *
 * Wraps text with a subtle help icon that shows additional information on hover.
 * Icon scales automatically with font size for consistent inline appearance.
 *
 * @param {string} children - The text to display inline
 * @param {string|React.ReactNode} tooltip - The tooltip content to show on hover
 * @param {number} delayDuration - Delay before tooltip appears in ms (default: 200)
 * @param {number} sideOffset - Distance from trigger element in px (default: 8)
 * @param {string} className - Additional classes for the wrapper span
 */
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
