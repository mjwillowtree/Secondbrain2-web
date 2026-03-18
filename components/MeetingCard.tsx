"use client";

import { useState } from "react";
import type { MeetingPrep } from "@/lib/types";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MeetingCardProps {
  meeting: MeetingPrep;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-testid={`meeting-card-${meeting.filename}`}
      className="rounded-lg border bg-card p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{meeting.title}</h3>
        {meeting.time && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Clock className="h-3 w-3" />
            {meeting.time}
          </div>
        )}
      </div>

      {meeting.content && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Prep notes
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      )}

      {expanded && (
        <ScrollArea className="max-h-[200px]">
          <pre className="text-xs leading-relaxed bg-muted/50 border border-border p-3 rounded-md whitespace-pre-wrap font-mono">
            {meeting.content}
          </pre>
        </ScrollArea>
      )}
    </div>
  );
}
