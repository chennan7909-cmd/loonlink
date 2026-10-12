import { describe, expect, it } from "vitest";

import { metadata as compatibilityMetadata } from "@/app/compatibility/page";
import { metadata as rootMetadata } from "@/app/layout";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as productDetailMetadata } from "@/app/products/[slug]/page";
import { metadata as productsMetadata } from "@/app/products/page";
import { metadata as requestQuoteMetadata } from "@/app/request-quote/page";
import robots from "@/app/robots";

describe("public preview metadata", () => {
  it("describes the preview without fixture or commercial claims", () => {
    const serializedMetadata = JSON.stringify([
      rootMetadata,
      homeMetadata,
      productsMetadata,
      compatibilityMetadata,
      requestQuoteMetadata,
    ]);

    expect(serializedMetadata).toContain("public preview");
    expect(serializedMetadata).toContain("coming soon");
    expect(serializedMetadata).not.toMatch(/development fixture|in stock|tested working/i);
  });

  it("keeps product details and development tooling out of indexing", () => {
    expect(productDetailMetadata.robots).toEqual({ index: false, follow: false });
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/design-system", "/products/"],
      },
    });
  });
});
