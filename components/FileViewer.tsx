"use client";

import type { FileContent } from "@/lib/types";
import { FrontmatterBadges } from "./FrontmatterBadges";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { FileText } from "lucide-react";

interface FileViewerProps {
  fileContent: FileContent | null;
  loading: boolean;
}

export function FileViewer({ fileContent, loading }: FileViewerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!fileContent) {
    return (
      <div data-testid="empty-state" className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <FileText className="h-12 w-12" />
        <p className="text-lg">Select a file to view its contents</p>
      </div>
    );
  }

  const isMarkdown = fileContent.path.endsWith(".md");

  return (
    <div data-testid="file-viewer" className="p-6 space-y-4">
      <FrontmatterBadges frontmatter={fileContent.frontmatter} />
      {isMarkdown ? (
        <MarkdownRenderer content={fileContent.bodyContent} />
      ) : (
        <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg overflow-auto">
          {fileContent.bodyContent}
        </pre>
      )}
    </div>
  );
}
