import { test, expect } from "@playwright/test";

test.describe("Directory tree navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the file explorer", async ({ page }) => {
    await expect(page.getByTestId("file-explorer")).toBeVisible();
    await expect(page.getByTestId("directory-tree")).toBeVisible();
  });

  test("shows top-level directories", async ({ page }) => {
    await expect(
      page.getByTestId("tree-node-knowledgebase")
    ).toBeVisible();
    await expect(page.getByTestId("tree-node-notes")).toBeVisible();
  });

  test("expands and collapses folders", async ({ page }) => {
    const notesFolder = page.getByTestId("tree-node-notes");
    await notesFolder.click();

    // After expanding, child folders should be visible
    await expect(
      page.getByTestId("tree-node-notes/processed")
    ).toBeVisible();
    await expect(page.getByTestId("tree-node-notes/raw")).toBeVisible();

    // Collapse
    await notesFolder.click();
    await expect(
      page.getByTestId("tree-node-notes/processed")
    ).not.toBeVisible();
  });

  test("navigates into nested directories", async ({ page }) => {
    // Expand notes > processed
    await page.getByTestId("tree-node-notes").click();
    await expect(page.getByTestId("tree-node-notes/processed")).toBeVisible();
    await page.getByTestId("tree-node-notes/processed").click();

    // Should see the sample meeting file
    await expect(
      page.getByTestId(
        "tree-node-notes/processed/2026-01-15-sample-meeting.md"
      )
    ).toBeVisible();
  });

  test("shows empty state when no file is selected", async ({ page }) => {
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });
});
