import { expect, test } from "@playwright/test";

test("homepage presents the storefront hierarchy and fixture boundary", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Optical transceiver storefront preview/);
  await expect(
    page.getByRole("heading", { level: 1, name: /The right optic.*Without the guesswork/ }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find a part" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A focused starting point." })).toBeVisible();
  await expect(page.getByText("Development fixture", { exact: true })).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Information before assumptions." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Can't find your part?" })).toBeVisible();
  await expect(page.getByText(/Development fixtures · not live inventory/)).toBeVisible();
  await expect(page.locator('a[href="/design-system"]')).toHaveCount(0);
});

test("homepage search leads to filtered fixture discovery", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByLabel("Search by part number or model").fill("740-031981");
  await page.getByRole("button", { name: "Search products" }).click();

  await expect(page).toHaveURL(/\/products\?q=740-031981/);
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Showing 1 of 3 development fixtures")).toBeVisible();
  await expect(page.getByRole("heading", { name: "740-031981" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "GLC-SX-MM" })).toBeHidden();

  const filters = page.locator("summary").filter({ hasText: /^Filters/ });
  await filters.focus();
  await filters.press("Enter");
  await expect(page.getByLabel("Manufacturer")).toBeVisible();
  await page.getByLabel("Manufacturer").selectOption("Cisco");
  await expect(page.getByText("1 active")).toBeVisible();
  await expect(page.getByRole("heading", { name: "No fixture products match" })).toBeVisible();
  await page.getByRole("button", { name: "Reset catalog filters" }).click();
  await expect(page.getByText("Showing 3 of 3 development fixtures")).toBeVisible();
});

test("product detail preserves hierarchy and progressive disclosure", async ({ page }) => {
  await page.goto("/products/cisco-glc-sx-mm");

  await expect(page.getByRole("heading", { level: 1, name: "GLC-SX-MM" })).toBeVisible();
  await expect(page.getByText("Pricing available later")).toBeVisible();
  await expect(page.getByRole("heading", { name: "The decision-level details." })).toBeVisible();
  await expect(page.getByText("Testing information")).toBeVisible();

  await page.getByText("Compatibility evidence").click();
  await expect(page.getByText(/No compatibility conclusion or evidence record is connected/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/serial number|cost price|supplier information|private notes/i);
});

test("sourcing path remains a non-submitting preview", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Preview request sourcing" }).click();

  await expect(page).toHaveURL(/\/request-quote$/);
  await expect(page.getByText("Preview only · submissions are not enabled")).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.getByText("Does not reserve inventory")).toBeVisible();
});

test("compatibility destination makes no result or availability claim", async ({ page }) => {
  await page.goto("/compatibility");

  await expect(page.getByText("Preview only · compatibility search is not live")).toBeVisible();
  await expect(page.getByLabel("Future compatibility search")).toBeDisabled();
  await expect(page.getByRole("heading", { name: "No inferred results" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/verified compatible|in stock|guaranteed compatible/i);
});

test("mobile navigation exposes storefront destinations and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  const navigation = page.getByRole("navigation", { name: "Mobile primary" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/products");
  await expect(navigation.getByRole("link", { name: "Compatibility" })).toHaveAttribute("href", "/compatibility");

  await page.keyboard.press("Escape");
  await expect(navigation).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("design-system showcase remains isolated and non-indexed", async ({ page }) => {
  await page.goto("/design-system");

  await expect(page.getByRole("heading", { level: 1, name: "LoonLink design system" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /nofollow/);
  await expect(page.getByText("Development reference · not live catalog data")).toBeVisible();
});

const responsiveViewports = [
  { name: "small mobile", width: 320, height: 720 },
  { name: "normal mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide desktop", width: 1920, height: 1080 },
] as const;

for (const viewport of responsiveViewports) {
  test(`storefront fits ${viewport.name} without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
}
