import { readTree } from "@/lib/fs-tree";
import { FileExplorer } from "@/components/FileExplorer";

export default function Home() {
  const tree = readTree();

  return <FileExplorer tree={tree} />;
}
