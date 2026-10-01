import { expect, test } from "@playwright/test";

test("homepage presents the LoonLink design foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/LoonLink/);
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Optical transceiver decisions, made clearer." })).toBeVisible();
  await expect(page.getByText("Phase 1B placeholder", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Review the foundation" })).toBeVisible();
  await expect(page.locator('a[href="/design-system"]')).toHaveCount(0);
  await expect(page.getByRole("contentinfo")).toContainText("No purchasing services are available yet.");
});

test("mobile navigation exposes state and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("navigation", { name: "Mobile primary" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile primary" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("design-system showcase is non-indexed and disclosure is operable", async ({ page }) => {
  await page.goto("/design-system");

  await expect(page.getByRole("heading", { level: 1, name: "LoonLink design system" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /nofollow/);
  await expect(page.getByText("Development reference · not live catalog data")).toBeVisible();

  const disclosure = page.getByText("View complete technical specifications");
  await disclosure.click();
  await expect(page.getByText(/Detailed engineering fields belong behind progressive disclosure/)).toBeVisible();
});

const responsiveViewports = [
  { name: "small mobile", width: 320, height: 720 },
  { name: "normal mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide desktop", width: 1920, height: 1080 },
] as const;

for (const viewport of responsiveViewports) {
  test(`homepage fits ${viewport.name} without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
}
