import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MeetingPrep, PersonSuggestion, TodayBrief } from "./types";

function getRepoRoot(): string {
  const root = process.env.REPO_ROOT;
  if (!root) throw new Error("REPO_ROOT environment variable is not set");
  return path.resolve(root);
}

const CADENCE_DAYS: Record<string, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  quarterly: 90,
};

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a);
  const db = new Date(b);
  return Math.floor((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Find today's meeting prep notes by scanning notes/raw/ for files
 * matching today's date pattern (YYYY-MM-DD-*).
 */
export function getTodaysMeetings(today?: string): MeetingPrep[] {
  const root = getRepoRoot();
  const dateStr = today ?? formatDate(new Date());
  const rawDir = path.join(root, "notes", "raw");

  if (!fs.existsSync(rawDir)) return [];

  const files = fs.readdirSync(rawDir).filter((f) => f.startsWith(dateStr) && f.endsWith(".md"));

  return files.map((filename) => {
    const filePath = path.join(rawDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    // Extract title from frontmatter or filename
    const title =
      (data.title as string) ??
      filename
        .replace(dateStr + "-", "")
        .replace(".md", "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    // Extract time from frontmatter or content
    const timeMatch = content.match(/\*\*Time\*\*:\s*(.+)/i) ??
      content.match(/Time:\s*(.+)/i);
    const time = timeMatch?.[1]?.trim() ?? data.time ?? "";

    return {
      title,
      time: String(time),
      filename,
      path: `notes/raw/${filename}`,
      content: content.trim(),
    };
  }).sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Scan people profiles and find those who are overdue for contact
 * based on their cadence and last_contact date.
 */
export function getPeopleSuggestions(today?: string): PersonSuggestion[] {
  const root = getRepoRoot();
  const dateStr = today ?? formatDate(new Date());
  const peopleDir = path.join(root, "knowledgebase", "people");

  if (!fs.existsSync(peopleDir)) return [];

  const files = fs.readdirSync(peopleDir).filter(
    (f) => f.endsWith(".md") && f !== "index.md"
  );

  const suggestions: PersonSuggestion[] = [];

  for (const filename of files) {
    const filePath = path.join(peopleDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const name = data.name as string;
    const role = (data.role as string) ?? "";
    const priority = (data.priority as string) ?? "monitor";
    const cadence = (data.cadence as string) ?? "as-needed";
    const lastContact = (data.last_contact as string) ?? "";

    // Skip people with no cadence or "as-needed"/"never"
    if (!lastContact || cadence === "as-needed" || cadence === "never") continue;

    const expectedDays = CADENCE_DAYS[cadence];
    if (!expectedDays) continue;

    const daysSince = daysBetween(lastContact, dateStr);
    const daysOverdue = daysSince - expectedDays;

    // Only suggest if overdue or due today
    if (daysOverdue < 0) continue;

    // Extract recent topics from Key Conversations table
    const recentTopics: string[] = [];
    const tableRows = content.match(/\|[^|]+\|[^|]+\|[^|]+\|/g);
    if (tableRows) {
      for (const row of tableRows.slice(-3)) {
        const cols = row.split("|").map((c) => c.trim()).filter(Boolean);
        if (cols.length >= 2 && cols[1] && !cols[1].startsWith("---") && cols[1] !== "Topic") {
          recentTopics.push(cols[1]);
        }
      }
    }

    suggestions.push({
      name,
      role,
      priority: priority as "invest" | "maintain" | "monitor",
      cadence,
      lastContact,
      daysOverdue,
      recentTopics,
      profilePath: `knowledgebase/people/${filename}`,
    });
  }

  // Sort: invest first, then by days overdue (most overdue first)
  return suggestions.sort((a, b) => {
    const priorityOrder = { invest: 0, maintain: 1, monitor: 2 };
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return b.daysOverdue - a.daysOverdue;
  });
}

export function getTodayBrief(today?: string): TodayBrief {
  const dateStr = today ?? formatDate(new Date());
  return {
    date: dateStr,
    meetings: getTodaysMeetings(dateStr),
    peopleSuggestions: getPeopleSuggestions(dateStr),
  };
}
