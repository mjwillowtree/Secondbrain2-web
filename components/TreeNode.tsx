"use client";

import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import type { TreeNode as TreeNodeType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  selectedPath: string | null;
  expandedPaths: Set<string>;
  onFileClick: (path: string) => void;
  onToggleExpand: (path: string) => void;
}

export function TreeNode({
  node,
  depth,
  selectedPath,
  expandedPaths,
  onFileClick,
  onToggleExpand,
}: TreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const isDirectory = node.type === "directory";

  const handleClick = () => {
    if (isDirectory) {
      onToggleExpand(node.path);
    } else {
      onFileClick(node.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1 rounded-md px-2 py-1 text-left text-sm hover:bg-accent",
          isSelected && "bg-accent text-accent-foreground font-medium"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        data-testid={`tree-node-${node.path}`}
        data-type={node.type}
      >
        {isDirectory ? (
          <>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-blue-500" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {isDirectory && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onFileClick={onFileClick}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
