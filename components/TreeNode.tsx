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
          "flex w-full items-center gap-1.5 rounded-md px-2 py-[6px] text-left text-[13px] transition-colors hover:bg-accent",
          isSelected &&
            "bg-primary/10 text-primary font-medium border-l-2 border-primary",
          isDirectory && isExpanded && !isSelected &&
            "bg-primary/5 text-primary font-medium"
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        data-testid={`tree-node-${node.path}`}
        data-type={node.type}
      >
        {isDirectory ? (
          <>
            <ChevronRight
              className={cn(
                "h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150",
                isExpanded && "rotate-90"
              )}
            />
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </>
        ) : (
          <>
            <span className="w-3 shrink-0" />
            <File className="h-4 w-4 shrink-0 text-muted-foreground/60" />
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
