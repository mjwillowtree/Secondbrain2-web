"use client";

import { useState } from "react";
import type { Automation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      className="rounded-lg border bg-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{automation.displayName}</h3>
        </div>
        <Badge
          variant={automation.status === "active" ? "default" : "secondary"}
          data-testid={`status-${automation.name}`}
        >
          {automation.status}
        </Badge>
      </div>

      {/* Schedule + Last Run */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span data-testid={`schedule-${automation.name}`}>
            {automation.scheduleHuman}
          </span>
        </div>
        {automation.lastRun && (
          <div className="text-muted-foreground">
            <span className="font-medium">Last run:</span>{" "}
            <span data-testid={`last-run-${automation.name}`}>
              {automation.lastRun}
            </span>
          </div>
        )}
      </div>

      {/* Prompt (collapsible) */}
      {automation.prompt && (
        <div>
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            Prompt
            {showPrompt ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          {showPrompt && (
            <ScrollArea className="mt-2 max-h-48">
              <pre
                data-testid={`prompt-${automation.name}`}
                className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap font-mono"
              >
                {automation.prompt}
              </pre>
            </ScrollArea>
          )}
        </div>
      )}

      {/* Logs (collapsible) */}
      {automation.recentLogs && (
        <div>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Terminal className="h-4 w-4" />
            Recent logs
            {showLogs ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          {showLogs && (
            <ScrollArea className="mt-2 max-h-48">
              <pre
                data-testid={`logs-${automation.name}`}
                className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap font-mono"
              >
                {automation.recentLogs}
              </pre>
            </ScrollArea>
          )}
        </div>
      )}

      {/* Delete instruction */}
      <div className="pt-2 border-t">
        <button
          onClick={handleCopyDelete}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          data-testid={`delete-instruction-${automation.name}`}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied!" : automation.deleteInstruction}
        </button>
      </div>
    </div>
  );
}
