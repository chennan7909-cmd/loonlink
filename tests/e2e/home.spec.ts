import { expect, test } from "@playwright/test";

test("homepage presents the public preview without fixture products", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Optical transceiver sourcing preview/);
  await expect(
    page.getByRole("heading", { level: 1, name: /The right optic.*Without the guesswork/ }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Catalog coming soon." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Information before assumptions." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sourcing workflow preview" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/GLC-SX-MM|740-031981|development fixture/i);
  await expect(page.locator('a[href="/design-system"]')).toHaveCount(0);
});

test("catalog page shows a mobile-ready coming-soon state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/products", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Catalog coming soon." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nothing is offered for sale yet" })).toBeVisible();
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/GLC-SX-MM|740-031981|in stock/i);
});

test("fixture product URLs are unavailable and non-indexed", async ({ page }) => {
  const response = await page.goto("/products/cisco-glc-sx-mm");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Catalog item unavailable." })).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).not.toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/GLC-SX-MM|Pricing available later/i);
});

test("sourcing path remains a non-submitting preview", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View sourcing preview" }).click();

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
