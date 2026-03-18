"use client";

import type { PersonSuggestion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PersonCardProps {
  person: PersonSuggestion;
}

export function PersonCard({ person }: PersonCardProps) {
  const urgencyLabel =
    person.daysOverdue >= 14
      ? "very overdue"
      : person.daysOverdue >= 7
        ? "overdue"
        : "due";

  const urgencyColor =
    person.daysOverdue >= 14
      ? "text-destructive"
      : person.daysOverdue >= 7
        ? "text-warning"
        : "text-muted-foreground";

  return (
    <div
      data-testid={`person-card-${person.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="rounded-lg border bg-card p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{person.name}</h3>
          <p className="text-xs text-muted-foreground">{person.role}</p>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium font-mono",
              person.priority === "invest"
                ? "bg-primary/10 text-primary border-primary/20"
                : person.priority === "maintain"
                  ? "bg-muted text-muted-foreground border-border"
                  : "bg-muted text-muted-foreground/60 border-border"
            )}
          >
            {person.priority}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Last contact: <span className="font-mono">{person.lastContact}</span>
          {" "}
          <span className={cn("font-medium", urgencyColor)}>
            ({urgencyLabel} — {person.daysOverdue}d past {person.cadence} cadence)
          </span>
        </span>
      </div>

      {person.recentTopics.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Recent topics: </span>
          {person.recentTopics.join(" · ")}
        </div>
      )}
    </div>
  );
}
