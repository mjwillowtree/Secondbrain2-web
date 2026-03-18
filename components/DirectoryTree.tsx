"use client";

import type { TreeNode as TreeNodeType } from "@/lib/types";
import { TreeNode } from "./TreeNode";

interface DirectoryTreeProps {
  tree: TreeNodeType[];
  selectedPath: string | null;
  expandedPaths: Set<string>;
  onFileClick: (path: string) => void;
  onToggleExpand: (path: string) => void;
}

export function DirectoryTree({
  tree,
  selectedPath,
  expandedPaths,
  onFileClick,
  onToggleExpand,
}: DirectoryTreeProps) {
  return (
    <nav data-testid="directory-tree" className="py-2">
      {tree.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          expandedPaths={expandedPaths}
          onFileClick={onFileClick}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </nav>
  );
}
