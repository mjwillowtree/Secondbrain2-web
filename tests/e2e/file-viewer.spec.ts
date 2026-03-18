import { test, expect } from "@playwright/test";

test.describe("File viewer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays file content when a file is clicked", async ({ page }) => {
    // Navigate to the sample meeting file
    await page.getByTestId("tree-node-notes").click();
    await page.getByTestId("tree-node-notes/processed").click();
    await page
      .getByTestId(
        "tree-node-notes/processed/2026-01-15-sample-meeting.md"
      )
      .click();

    // File viewer should appear with content
    await expect(page.getByTestId("file-viewer")).toBeVisible();
    await expect(page.getByTestId("markdown-content")).toBeVisible();

    // Should render markdown heading
    await expect(page.getByText("Summary")).toBeVisible();
    await expect(
      page.getByText("Discussed project architecture")
    ).toBeVisible();
  });

  test("displays frontmatter badges for processed notes", async ({
    page,
  }) => {
    await page.getByTestId("tree-node-notes").click();
    await page.getByTestId("tree-node-notes/processed").click();
    await page
      .getByTestId(
        "tree-node-notes/processed/2026-01-15-sample-meeting.md"
      )
      .click();

    await expect(page.getByTestId("frontmatter-badges")).toBeVisible();
    // Should show processed: true badge
    await expect(page.getByText("processed: true")).toBeVisible();
    // Should show project badge
    await expect(page.getByText("project: Ascensus")).toBeVisible();
  });

  test("displays raw text files without markdown rendering", async ({
    page,
  }) => {
    await page.getByTestId("tree-node-notes").click();
    await page.getByTestId("tree-node-notes/raw").click();
    await page
      .getByTestId("tree-node-notes/raw/2026-01-20-unprocessed.md")
      .click();

    await expect(page.getByTestId("file-viewer")).toBeVisible();
    await expect(
      page.getByText("Quick call with Tyler")
    ).toBeVisible();
  });

  test("updates breadcrumb when file is selected", async ({ page }) => {
    await page.getByTestId("tree-node-notes").click();
    await page.getByTestId("tree-node-notes/processed").click();
    await page
      .getByTestId(
        "tree-node-notes/processed/2026-01-15-sample-meeting.md"
      )
      .click();

    const breadcrumb = page.getByTestId("breadcrumb");
    await expect(breadcrumb).toContainText("notes");
    await expect(breadcrumb).toContainText("processed");
    await expect(breadcrumb).toContainText("2026-01-15-sample-meeting.md");
  });

  test("displays people profile with frontmatter", async ({ page }) => {
    await page.getByTestId("tree-node-knowledgebase").click();
    await page.getByTestId("tree-node-knowledgebase/people").click();
    await page
      .getByTestId("tree-node-knowledgebase/people/sample-person.md")
      .click();

    await expect(page.getByTestId("file-viewer")).toBeVisible();
    await expect(page.getByText("name: Jane Smith")).toBeVisible();
    await expect(page.getByText("role: Senior Developer")).toBeVisible();
  });
});
