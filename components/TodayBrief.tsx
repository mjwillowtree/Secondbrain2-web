"use client";

import { useState, useEffect } from "react";
import type { TodayBrief as TodayBriefType } from "@/lib/types";
import { MeetingCard } from "./MeetingCard";
import { PersonCard } from "./PersonCard";
import { Calendar, Users, Sun } from "lucide-react";

export function TodayBrief() {
  const [brief, setBrief] = useState<TodayBriefType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/today")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => setBrief(data))
      .catch(() => setBrief(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        <div className="animate-pulse text-sm">Loading your brief...</div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        <p className="text-sm">Could not load today&apos;s brief.</p>
      </div>
    );
  }

  const dateFormatted = new Date(brief.date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  );

  return (
    <div data-testid="today-brief" className="p-8 max-w-[720px] mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sun className="h-4 w-4" />
          <span className="text-[13px] font-medium">{dateFormatted}</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Today</h1>
      </div>

      {/* Meetings */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            Meetings
          </h2>
        </div>
        {brief.meetings.length === 0 ? (
          <p className="text-sm text-muted-foreground pl-6">
            No meetings scheduled. Clear day.
          </p>
        ) : (
          <div className="space-y-3">
            {brief.meetings.map((meeting) => (
              <MeetingCard key={meeting.filename} meeting={meeting} />
            ))}
          </div>
        )}
      </section>

      {/* People to reach out to */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            People to connect with
          </h2>
        </div>
        {brief.peopleSuggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground pl-6">
            Everyone&apos;s up to date. No overdue contacts.
          </p>
        ) : (
          <div className="space-y-3">
            {brief.peopleSuggestions.map((person) => (
              <PersonCard key={person.name} person={person} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
