import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { discoverAutomations } from "@/lib/automations";

export async function GET() {
  try {
    // In test mode, read crontab from a fixture file
    const repoRoot = process.env.REPO_ROOT ?? "";
    const crontabFixture = path.resolve(repoRoot, "crontab.txt");

    let crontabOverride: string | undefined;
    if (fs.existsSync(crontabFixture)) {
      crontabOverride = fs.readFileSync(crontabFixture, "utf-8");
    }

    const automations = discoverAutomations(crontabOverride);

    // Strip absolute paths from response for security
    const sanitized = automations.map((a) => ({
      ...a,
      scriptPath: path.basename(a.scriptPath),
      promptPath: a.promptPath ? path.basename(a.promptPath) : null,
      logPath: a.logPath ? path.basename(a.logPath) : null,
    }));

    return NextResponse.json(sanitized);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to read automations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
