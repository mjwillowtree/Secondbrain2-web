"use client";

import { useState, useCallback } from "react";
import type { TreeNode, FileContent } from "@/lib/types";
import { DirectoryTree } from "./DirectoryTree";
import { FileViewer } from "./FileViewer";
import { Breadcrumb } from "./Breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileExplorerProps {
  tree: TreeNode[];
}

export function FileExplorer({ tree }: FileExplorerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const handleToggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const handleFileClick = useCallback(async (path: string) => {
    setSelectedPath(path);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/file?path=${encodeURIComponent(path)}`
      );
      if (!res.ok) {
        throw new Error("Failed to load file");
      }
      const data: FileContent = await res.json();
      setFileContent(data);
    } catch {
      setFileContent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div data-testid="file-explorer" className="grid grid-cols-[280px_1fr] h-[calc(100vh-49px)]">
      {/* Left panel — directory tree */}
      <div className="border-r flex flex-col">
        <ScrollArea className="flex-1">
          <DirectoryTree
            tree={tree}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            onFileClick={handleFileClick}
            onToggleExpand={handleToggleExpand}
          />
        </ScrollArea>
      </div>

      {/* Right panel — file viewer */}
      <div className="flex flex-col min-h-0">
        <Breadcrumb path={selectedPath} />
        <ScrollArea className="flex-1">
          <FileViewer fileContent={fileContent} loading={loading} />
        </ScrollArea>
      </div>
    </div>
  );
}
