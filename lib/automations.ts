import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import type { Automation } from "./types";

const LOG_TAIL_LINES = 30;

function getRepoRoot(): string {
  const root = process.env.REPO_ROOT;
  if (!root) throw new Error("REPO_ROOT environment variable is not set");
  return path.resolve(root);
}

function getScriptsDir(): string {
  return path.join(getRepoRoot(), "scripts");
}

/**
 * Convert a cron expression to a human-readable string.
 * Handles common patterns; falls back to the raw expression.
 */
export function cronToHuman(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return expr;

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const dayMap: Record<string, string> = {
    "0": "Sundays",
    "1": "Mondays",
    "2": "Tuesdays",
    "3": "Wednesdays",
    "4": "Thursdays",
    "5": "Fridays",
    "6": "Saturdays",
    "1-5": "Weekdays",
    "0,6": "Weekends",
    "*": "",
  };

  const dayLabel = dayMap[dayOfWeek] ?? `days ${dayOfWeek}`;

  // Every N minutes
  if (minute.startsWith("*/") && hour === "*" && dayOfMonth === "*" && month === "*") {
    const interval = minute.slice(2);
    const base = `Every ${interval} minutes`;
    return dayLabel ? `${dayLabel}, ${base.toLowerCase()}` : base;
  }

  // Specific minute, every hour
  if (!minute.includes("*") && !minute.includes("/") && hour === "*" && dayOfMonth === "*" && month === "*") {
    const base = `Every hour at :${minute.padStart(2, "0")}`;
    return dayLabel ? `${dayLabel}, ${base.toLowerCase()}` : base;
  }

  // Specific time
  if (!minute.includes("*") && !minute.includes("/") && !hour.includes("*") && !hour.includes("/") && dayOfMonth === "*" && month === "*") {
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const time = `${h12}:${minute.padStart(2, "0")} ${ampm}`;
    const base = `At ${time}`;
    return dayLabel ? `${dayLabel} at ${time}` : base;
  }

  return expr;
}

/**
 * Parse a crontab string into entries pointing to scripts in the repo.
 * Returns an array of { schedule, scriptPath } objects.
 */
export function parseCrontab(
  crontabContent: string,
  scriptsDir: string
): { schedule: string; scriptPath: string }[] {
  const results: { schedule: string; scriptPath: string }[] = [];

  for (const line of crontabContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Cron line: 5 fields + command
    const match = trimmed.match(
      /^(\S+\s+\S+\s+\S+\s+\S+\s+\S+)\s+(.+)$/
    );
    if (!match) continue;

    const [, schedule, command] = match;

    // Check if the command references a script in our scripts directory
    if (command.includes(scriptsDir) || command.includes("scripts/")) {
      // Extract the .sh file path from the command
      const shMatch = command.match(/(\S+\.sh)/);
      if (shMatch) {
        results.push({ schedule, scriptPath: shMatch[1] });
      }
    }
  }

  return results;
}

/**
 * Read system crontab. Returns empty string if unavailable.
 */
function readSystemCrontab(): string {
  try {
    return execSync("crontab -l 2>/dev/null", { encoding: "utf-8" });
  } catch {
    return "";
  }
}

/**
 * Extract the last run timestamp from a log file.
 * Looks for lines matching "YYYY-MM-DD HH:MM:SS — " pattern.
 */
function extractLastRun(logContent: string): string | null {
  const lines = logContent.trim().split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
    if (match) return match[1];
  }
  return null;
}

/**
 * Get the last N lines of a string.
 */
function tailLines(content: string, n: number): string {
  const lines = content.trim().split("\n");
  return lines.slice(-n).join("\n");
}

/**
 * Convert a script filename to a display name.
 * "meeting-prep.sh" → "Meeting Prep"
 */
function toDisplayName(filename: string): string {
  return filename
    .replace(/\.sh$/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Discover all automations by reading crontab and scanning the scripts directory.
 * Accepts optional crontab content override for testing.
 */
export function discoverAutomations(
  crontabOverride?: string
): Automation[] {
  const scriptsDir = getScriptsDir();
  const crontabContent = crontabOverride ?? readSystemCrontab();

  // If scripts directory doesn't exist, return empty
  if (!fs.existsSync(scriptsDir)) return [];

  // Get all .sh files in scripts directory
  const allScripts = fs.readdirSync(scriptsDir).filter((f) => f.endsWith(".sh"));

  // Parse crontab to find active entries
  const crontabEntries = parseCrontab(crontabContent, scriptsDir);

  // Build a map of script filename → crontab entry
  const activeScripts = new Map<string, string>();
  for (const entry of crontabEntries) {
    const filename = path.basename(entry.scriptPath);
    activeScripts.set(filename, entry.schedule);
  }

  return allScripts.map((scriptFilename) => {
    const name = scriptFilename.replace(/\.sh$/, "");
    const schedule = activeScripts.get(scriptFilename);

    const promptFilename = `${name}-prompt.txt`;
    const logFilename = `${name}.log`;

    const promptPath = path.join(scriptsDir, promptFilename);
    const logPath = path.join(scriptsDir, logFilename);

    const hasPrompt = fs.existsSync(promptPath);
    const hasLog = fs.existsSync(logPath);

    let prompt: string | null = null;
    if (hasPrompt) {
      prompt = fs.readFileSync(promptPath, "utf-8");
    }

    let lastRun: string | null = null;
    let recentLogs: string | null = null;
    if (hasLog) {
      const logContent = fs.readFileSync(logPath, "utf-8");
      lastRun = extractLastRun(logContent);
      recentLogs = tailLines(logContent, LOG_TAIL_LINES);
    }

    return {
      name,
      displayName: toDisplayName(scriptFilename),
      status: schedule ? "active" as const : "inactive" as const,
      schedule: schedule ?? "not scheduled",
      scheduleHuman: schedule ? cronToHuman(schedule) : "Not scheduled",
      scriptPath: path.join(scriptsDir, scriptFilename),
      promptPath: hasPrompt ? promptPath : null,
      logPath: hasLog ? logPath : null,
      prompt,
      lastRun,
      recentLogs,
      deleteInstruction: `To remove this automation, tell Claude: "delete the ${name} cron job"`,
    };
  });
}
