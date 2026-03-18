"use client";

import { useState } from "react";
import type { Automation } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Clock,
  FileText,
  Terminal,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";

interface AutomationCardProps {
  automation: Automation;
}

export function AutomationCard({ automation }: AutomationCardProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyDelete = () => {
    navigator.clipboard.writeText(automation.deleteInstruction);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-testid={`automation-card-${automation.name}`}
      className="rounded-lg border bg-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold tracking-tight">{automation.displayName}</h3>
        </div>
        <span
          data-testid={`status-${automation.name}`}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium font-mono",
            automation.status === "active"
              ? "bg-success/10 text-success border-success/20"
              : "bg-muted text-muted-foreground border-border"
          )}
        >
          {automation.status}
        </span>
      </div>

      {/* Schedule + Last Run */}
      <div className="grid grid-cols-2 gap-4 text-[13px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span data-testid={`schedule-${automation.name}`}>
            {automation.scheduleHuman}
          </span>
        </div>
        {automation.lastRun && (
          <div className="text-muted-foreground font-mono">
            <span className="text-foreground font-sans font-medium">Last run: </span>
            <span data-testid={`last-run-${automation.name}`}>
              {automation.lastRun}
            </span>
          </div>
        )}
      </div>

      {/* Prompt (collapsible) */}
      {automation.prompt && (
        <div className="pt-1">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Prompt
            {showPrompt ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          {showPrompt && (
            <ScrollArea className="mt-2 max-h-[200px]">
              <pre
                data-testid={`prompt-${automation.name}`}
                className="text-xs leading-relaxed bg-muted/50 border border-border p-4 rounded-md whitespace-pre-wrap font-mono"
              >
                {automation.prompt}
              </pre>
            </ScrollArea>
          )}
        </div>
      )}

      {/* Logs (collapsible) */}
      {automation.recentLogs && (
        <div className="pt-1">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Terminal className="h-3.5 w-3.5" />
            Recent logs
            {showLogs ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          {showLogs && (
            <ScrollArea className="mt-2 max-h-[200px]">
              <pre
                data-testid={`logs-${automation.name}`}
                className="text-xs leading-relaxed bg-muted/50 border border-border p-4 rounded-md whitespace-pre-wrap font-mono"
              >
                {automation.recentLogs}
              </pre>
            </ScrollArea>
          )}
        </div>
      )}

      {/* Delete instruction */}
      <div className="pt-3 border-t">
        <button
          onClick={handleCopyDelete}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid={`delete-instruction-${automation.name}`}
        >
          {copied ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied!" : automation.deleteInstruction}
        </button>
      </div>
    </div>
  );
}
