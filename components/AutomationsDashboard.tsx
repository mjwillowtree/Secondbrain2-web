"use client";

import { useState, useEffect } from "react";
import type { Automation } from "@/lib/types";
import { AutomationCard } from "./AutomationCard";
import { Bot } from "lucide-react";

export function AutomationsDashboard() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/automations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load automations");
        return res.json();
      })
      .then((data) => setAutomations(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        <div className="animate-pulse text-sm">Loading automations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-destructive">
        <p className="text-sm">Error: {error}</p>
      </div>
    );
  }

  if (automations.length === 0) {
    return (
      <div
        data-testid="no-automations"
        className="flex flex-col items-center justify-center h-[60vh] gap-3 text-muted-foreground"
      >
        <Bot className="h-12 w-12 opacity-30" />
        <p className="text-base">No automations found</p>
        <p className="text-sm">
          Create one with Claude:{" "}
          <code className="bg-muted border border-border px-2 py-0.5 rounded text-xs font-mono">/new-cron-job</code>
        </p>
      </div>
    );
  }

  return (
    <div data-testid="automations-dashboard" className="p-8 max-w-[720px] mx-auto space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Automations</h1>
        <p className="text-[13px] text-muted-foreground">
          Create new:{" "}
          <code className="bg-muted border border-border px-2 py-0.5 rounded text-xs font-mono">/new-cron-job</code>
        </p>
      </div>
      {automations.map((automation) => (
        <AutomationCard key={automation.name} automation={automation} />
      ))}
    </div>
  );
}
