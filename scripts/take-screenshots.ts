import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

const OUTPUT_DIR = path.resolve("screenshots");
const BASE_URL = "http://localhost:3000";

const pages = [
  { name: "explorer", path: "/" },
  { name: "automations", path: "/automations" },
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const { name, path: pagePath } of pages) {
    for (const colorScheme of ["light", "dark"] as const) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        colorScheme,
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: "networkidle" });

      // For explorer page, expand the tree so there's content to review
      if (name === "explorer") {
        try {
          await page.getByTestId("tree-node-notes").click();
          await page.waitForTimeout(300);
        } catch {
          // Fixture data may differ
        }
      }

      const filename = `${name}-${colorScheme}.png`;
      await page.screenshot({ path: path.join(OUTPUT_DIR, filename), fullPage: true });
      console.log(`Captured: ${filename}`);

      await context.close();
    }
  }

  await browser.close();
  console.log(`Screenshots saved to ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
