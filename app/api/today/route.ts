import { NextRequest, NextResponse } from "next/server";
import { getTodayBrief } from "@/lib/today";

export async function GET(request: NextRequest) {
  try {
    // Allow date override for testing
    const dateOverride = request.nextUrl.searchParams.get("date") ?? undefined;
    const brief = getTodayBrief(dateOverride);
    return NextResponse.json(brief);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load today brief";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
