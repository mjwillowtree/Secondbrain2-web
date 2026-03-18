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

export interface Automation {
  name: string; // e.g., "meeting-prep"
  displayName: string; // e.g., "Meeting Prep"
  status: "active" | "inactive";
  schedule: string; // raw cron expression
  scheduleHuman: string; // e.g., "Weekdays, every hour at :07"
  scriptPath: string;
  promptPath: string | null;
  logPath: string | null;
  prompt: string | null;
  lastRun: string | null;
  recentLogs: string | null;
  deleteInstruction: string;
}

export interface MeetingPrep {
  title: string;
  time: string;
  filename: string;
  path: string;
  content: string;
}

export interface PersonSuggestion {
  name: string;
  role: string;
  priority: "invest" | "maintain" | "monitor";
  cadence: string;
  lastContact: string;
  daysOverdue: number;
  recentTopics: string[];
  profilePath: string;
}

export interface TodayBrief {
  date: string;
  meetings: MeetingPrep[];
  peopleSuggestions: PersonSuggestion[];
}
