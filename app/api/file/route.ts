import { NextRequest, NextResponse } from "next/server";
import { readFileContent } from "@/lib/fs-tree";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  try {
    const content = readFileContent(decodeURIComponent(filePath));
    return NextResponse.json(content);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to read file";
    const status = message === "Path escapes REPO_ROOT" ? 403 : 404;
    return NextResponse.json({ error: message }, { status });
  }
}
