import { test, expect } from "@playwright/test";

test.describe("Today page", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the API call and override the date to match our fixtures
    await page.route("**/api/today", async (route) => {
      const url = new URL(route.request().url());
      url.searchParams.set("date", "2026-03-18");
      const response = await route.fetch({ url: url.toString() });
      await route.fulfill({ response });
    });
    await page.goto("/today");
  });

  test("renders the today brief", async ({ page }) => {
    await expect(page.getByTestId("today-brief")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  });

  test("shows meetings section", async ({ page }) => {
    await expect(page.getByText("Meetings")).toBeVisible();
    await expect(page.getByText("Team Standup")).toBeVisible();
    await expect(page.getByText("Client Review")).toBeVisible();
  });

  test("shows meeting times", async ({ page }) => {
    await expect(page.getByText("10:00 AM")).toBeVisible();
    await expect(page.getByText("2:00 PM")).toBeVisible();
  });

  test("expands meeting prep notes", async ({ page }) => {
    await page
      .getByTestId("meeting-card-2026-03-18-team-standup.md")
      .getByText("Prep notes")
      .click();

    await expect(
      page.getByText("sprint progress")
    ).toBeVisible();
  });

  test("shows people suggestions", async ({ page }) => {
    await expect(page.getByText("People to connect with")).toBeVisible();
    await expect(page.getByText("Alex Johnson")).toBeVisible();
    await expect(page.getByText("Engineering Manager")).toBeVisible();
  });

  test("shows overdue indicator for people", async ({ page }) => {
    const alexCard = page.getByTestId("person-card-alex-johnson");
    await expect(alexCard.getByText("overdue")).toBeVisible();
  });

  test("shows recent topics for people", async ({ page }) => {
    await expect(page.getByText("API migration timeline")).toBeVisible();
  });

  test("shows priority badge", async ({ page }) => {
    const alexCard = page.getByTestId("person-card-alex-johnson");
    await expect(alexCard.getByText("invest")).toBeVisible();
  });
});

test.describe("Navigation to Today", () => {
  test("Today tab appears in nav", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByTestId("main-nav").getByText("Today")
    ).toBeVisible();
  });

  test("can navigate to Today from Explorer", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("main-nav").getByText("Today").click();
    await expect(page.getByTestId("today-brief")).toBeVisible();
  });
});
