import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { TreeNode, FileContent } from "./types";

const SKIP_DIRS = new Set([
  ".git",
  ".claude",
  ".cursor",
  "node_modules",
  "code",
  "research",
]);

const ALLOWED_EXTENSIONS = new Set([".md", ".txt", ".sh"]);

function getRepoRoot(): string {
  const root = process.env.REPO_ROOT;
  if (!root) {
    throw new Error("REPO_ROOT environment variable is not set");
  }
  return path.resolve(root);
}

export function validatePath(relativePath: string): string {
  const root = getRepoRoot();
  const resolved = path.resolve(root, relativePath);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    throw new Error("Path escapes REPO_ROOT");
  }
  return resolved;
}

export function readTree(dir?: string, relativeBase?: string): TreeNode[] {
  const root = dir ?? getRepoRoot();
  const base = relativeBase ?? "";
  const entries = fs.readdirSync(root, { withFileTypes: true });

  const dirs: TreeNode[] = [];
  const files: TreeNode[] = [];

  for (const entry of entries) {
    const relativePath = base ? `${base}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const children = readTree(
        path.join(root, entry.name),
        relativePath
      );
      // Only include directories that have visible children
      if (children.length > 0) {
        dirs.push({
          name: entry.name,
          path: relativePath,
          type: "directory",
          children,
        });
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext)) {
        files.push({
          name: entry.name,
          path: relativePath,
          type: "file",
        });
      }
    }
  }

  // Sort: dirs first (alphabetical), then files (alphabetical)
  dirs.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));

  return [...dirs, ...files];
}

export function readFileContent(relativePath: string): FileContent {
  const absolutePath = validatePath(relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error("File not found");
  }

  const raw = fs.readFileSync(absolutePath, "utf-8");
  const ext = path.extname(absolutePath).toLowerCase();

  if (ext === ".md") {
    const { data, content } = matter(raw);
    return {
      path: relativePath,
      frontmatter: data,
      bodyContent: content,
    };
  }

  return {
    path: relativePath,
    frontmatter: {},
    bodyContent: raw,
  };
}
