export interface TreeNode {
  name: string;
  path: string; // relative to REPO_ROOT
  type: "file" | "directory";
  children?: TreeNode[];
}

export interface FileContent {
  path: string;
  frontmatter: Record<string, unknown>;
  bodyContent: string;
}
