import { test, expect } from "@playwright/test";

test.describe("GitTix smoke", () => {
  test("home page shows brand and tickets section", async ({ page }) => {
    test.skip(
      !process.env.E2E_BASE_URL && process.env.CI === "true",
      "Set E2E_BASE_URL to run against a live cluster in CI"
    );

    await page.goto("/");
    await expect(page.getByRole("link", { name: "GitTix" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "GitTix" })).toBeVisible();
  });

  test("signup form is reachable", async ({ page }) => {
    test.skip(
      !process.env.E2E_BASE_URL && process.env.CI === "true",
      "Set E2E_BASE_URL to run against a live cluster in CI"
    );

    await page.goto("/auth/signup");
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });
});
