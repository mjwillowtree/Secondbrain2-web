"use client";

import { Badge } from "@/components/ui/badge";

interface FrontmatterBadgesProps {
  frontmatter: Record<string, unknown>;
}

function getBadgeVariant(
  key: string,
  value: unknown
): "default" | "secondary" | "destructive" | "outline" {
  if (key === "processed") {
    return value === true ? "default" : "destructive";
  }
  if (key === "project") return "secondary";
  return "outline";
}

export function FrontmatterBadges({ frontmatter }: FrontmatterBadgesProps) {
  if (Object.keys(frontmatter).length === 0) return null;

  return (
    <div data-testid="frontmatter-badges" className="flex flex-wrap gap-2 pb-4 border-b">
      {Object.entries(frontmatter).map(([key, value]) => {
        if (key === "topics" && Array.isArray(value)) {
          return value.map((topic) => (
            <Badge key={`topic-${topic}`} variant="outline">
              {String(topic)}
            </Badge>
          ));
        }

        const display =
          typeof value === "boolean" ? `${key}: ${value}` : `${key}: ${String(value)}`;

        return (
          <Badge key={key} variant={getBadgeVariant(key, value)}>
            {display}
          </Badge>
        );
      })}
    </div>
  );
}
