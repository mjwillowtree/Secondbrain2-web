"use client";

import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  path: string | null;
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  if (!path) {
    return (
      <div data-testid="breadcrumb" className="flex items-center gap-1 h-10 text-[13px] text-muted-foreground px-5 border-b font-mono">
        <span>Select a file to view</span>
      </div>
    );
  }

  const segments = path.split("/");

  return (
    <div data-testid="breadcrumb" className="flex items-center gap-1 h-10 text-[13px] px-5 border-b font-mono">
      {segments.map((segment, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/50" />}
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
