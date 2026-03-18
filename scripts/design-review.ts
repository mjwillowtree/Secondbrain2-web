import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const SCREENSHOTS_DIR = path.resolve("screenshots");
const DESIGN_SPEC = path.resolve("DESIGN.md");

async function main() {
  const client = new Anthropic();

  const designSpec = fs.readFileSync(DESIGN_SPEC, "utf-8");

  // Load all screenshots as base64
  const screenshotFiles = fs.readdirSync(SCREENSHOTS_DIR).filter((f) => f.endsWith(".png")).sort();

  if (screenshotFiles.length === 0) {
    console.error("No screenshots found. Run take-screenshots.ts first.");
    process.exit(1);
  }

  const imageContent: Anthropic.ImageBlockParam[] = screenshotFiles.map((filename) => {
    const data = fs.readFileSync(path.join(SCREENSHOTS_DIR, filename)).toString("base64");
    return {
      type: "image",
      source: { type: "base64", media_type: "image/png", data },
    };
  });

  const screenshotList = screenshotFiles
    .map((f, i) => `${i + 1}. ${f}`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    messages: [
      {
        role: "user",
        content: [
          ...imageContent,
          {
            type: "text",
            text: `You are a design auditor reviewing a web application against its design specification.

## Screenshots provided (in order):
${screenshotList}

## Design Specification:
${designSpec}

## Your Task

Compare each screenshot against the design spec. For each issue found, report:

**Category**: Color | Typography | Spacing | Component | Layout | Accessibility
**Severity**: BLOCKER (violates spec, must fix) | WARNING (deviates from spec, should fix) | NOTE (suggestion for improvement)
**Location**: Which page and which element
**Issue**: What's wrong
**Expected**: What the spec says
**Actual**: What the screenshot shows

## Output Format

Start with a one-line summary: "X issues found (Y blockers, Z warnings, W notes)"

Then list each issue using this format:

### [SEVERITY] Category — Short description
- **Page:** explorer-light / explorer-dark / automations-light / automations-dark
- **Element:** e.g., "nav bar", "tree node", "badge"
- **Issue:** What's wrong
- **Expected:** Per the spec
- **Actual:** What you see

End with a "What Looks Good" section highlighting 2-3 things that match the spec well.

Be specific and actionable. Reference exact spec values (colors, sizes, spacing) when relevant. Only flag real issues — don't nitpick pixel-level differences that are within normal rendering variance.`,
          },
        ],
      },
    ],
  });

  // Extract text from response
  for (const block of response.content) {
    if (block.type === "text") {
      console.log(block.text);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
