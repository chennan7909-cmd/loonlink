import { expect, test } from "@playwright/test";

test("homepage presents the LoonLink foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/LoonLink/);
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "LoonLink" })).toBeVisible();
  const footer = page.getByRole("contentinfo");
  await expect(footer).toBeVisible();
  await expect(footer.getByText("LoonLink is under development.", { exact: true })).toBeVisible();
});
