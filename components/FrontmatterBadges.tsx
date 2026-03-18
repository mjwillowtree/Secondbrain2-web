"use client";

import { cn } from "@/lib/utils";

interface FrontmatterBadgesProps {
  frontmatter: Record<string, unknown>;
}

function getBadgeClasses(key: string, value: unknown): string {
  if (key === "processed" && value === true)
    return "bg-success/10 text-success border-success/20";
  if (key === "processed" && value === false)
    return "bg-destructive/10 text-destructive border-destructive/20";
  if (key === "project")
    return "bg-primary/10 text-primary border-primary/20";
  if (key === "topics")
    return "bg-muted text-muted-foreground border-border";
  return "bg-muted text-muted-foreground border-border";
}

export function FrontmatterBadges({ frontmatter }: FrontmatterBadgesProps) {
  if (Object.keys(frontmatter).length === 0) return null;

  return (
    <div data-testid="frontmatter-badges" className="flex flex-wrap gap-1.5 pb-5 border-b">
      {Object.entries(frontmatter).map(([key, value]) => {
        if (key === "topics" && Array.isArray(value)) {
          return value.map((topic) => (
            <span
              key={`topic-${topic}`}
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium font-mono",
                getBadgeClasses("topics", null)
              )}
            >
              {String(topic)}
            </span>
          ));
        }

        const display =
          typeof value === "boolean"
            ? `${key}: ${value}`
            : `${key}: ${String(value)}`;

        return (
          <span
            key={key}
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium font-mono",
              getBadgeClasses(key, value)
            )}
          >
            {display}
          </span>
        );
      })}
    </div>
  );
}
