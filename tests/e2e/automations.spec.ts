import { test, expect } from "@playwright/test";

test.describe("Automations dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/automations");
  });

  test("renders the automations dashboard", async ({ page }) => {
    await expect(page.getByTestId("automations-dashboard")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Automations" })).toBeVisible();
  });

  test("shows the meeting-prep automation", async ({ page }) => {
    await expect(
      page.getByTestId("automation-card-meeting-prep")
    ).toBeVisible();
    await expect(page.getByText("Meeting Prep")).toBeVisible();
  });

  test("shows active status for scheduled automation", async ({ page }) => {
    await expect(page.getByTestId("status-meeting-prep")).toContainText(
      "active"
    );
  });

  test("shows human-readable schedule", async ({ page }) => {
    await expect(
      page.getByTestId("schedule-meeting-prep")
    ).toContainText("Weekdays");
  });

  test("shows last run timestamp", async ({ page }) => {
    await expect(
      page.getByTestId("last-run-meeting-prep")
    ).toContainText("2026-03-18 09:07:03");
  });

  test("expands prompt section", async ({ page }) => {
    await page
      .getByTestId("automation-card-meeting-prep")
      .getByText("Prompt")
      .click();

    await expect(
      page.getByTestId("prompt-meeting-prep")
    ).toBeVisible();
    await expect(
      page.getByTestId("prompt-meeting-prep")
    ).toContainText("meeting prep notes");
  });

  test("expands logs section", async ({ page }) => {
    await page
      .getByTestId("automation-card-meeting-prep")
      .getByText("Recent logs")
      .click();

    await expect(
      page.getByTestId("logs-meeting-prep")
    ).toBeVisible();
    await expect(
      page.getByTestId("logs-meeting-prep")
    ).toContainText("Meeting prep complete");
  });

  test("shows delete instruction", async ({ page }) => {
    await expect(
      page.getByTestId("delete-instruction-meeting-prep")
    ).toContainText("delete the meeting-prep cron job");
  });

  test("shows hint to create new automation", async ({ page }) => {
    await expect(page.getByText("/new-cron-job")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("can navigate between explorer and automations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("main-nav")).toBeVisible();

    // Navigate to automations
    await page.getByTestId("main-nav").getByText("Automations").click();
    await expect(page.getByTestId("automations-dashboard")).toBeVisible();

    // Navigate back to explorer
    await page.getByTestId("main-nav").getByText("Explorer").click();
    await expect(page.getByTestId("file-explorer")).toBeVisible();
  });
});
