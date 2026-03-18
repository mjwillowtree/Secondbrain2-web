"use client";

import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  path: string | null;
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  if (!path) {
    return (
      <div data-testid="breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground px-4 py-2 border-b">
        <span>Select a file to view</span>
      </div>
    );
  }

  const segments = path.split("/");

  return (
    <div data-testid="breadcrumb" className="flex items-center gap-1 text-sm px-4 py-2 border-b">
      {segments.map((segment, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          <span
            className={
              i === segments.length - 1
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            }
          >
            {segment}
          </span>
        </span>
      ))}
    </div>
  );
}
