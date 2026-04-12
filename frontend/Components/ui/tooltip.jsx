"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 8, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          // Base styles - game-inspired tooltip
          "bg-stone-dark/95 backdrop-blur-sm relative z-50 overflow-hidden rounded px-2 py-1 text-xs max-w-xs",
          // Border with subtle glow effect (game UI style)
          "border border-pale-gold/30",
          "shadow-[0_0_20px_rgba(0,0,0,0.8),0_0_2px_rgba(212,175,55,0.3)]",
          // Corner accents (subtle game-style decoration)
          "before:absolute before:top-0 before:left-0 before:w-2 before:h-2 before:border-l before:border-t before:border-pale-gold/50",
          "after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2 after:border-r after:border-b after:border-pale-gold/50",
          // Animations
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-1",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  ),
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
