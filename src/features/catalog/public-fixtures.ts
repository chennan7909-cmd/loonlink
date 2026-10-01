export const fixtureCatalogNotice = "Development fixtures · not live inventory";

export type PublicProductFixture = Readonly<{
  slug: string;
  manufacturer: string;
  partNumber: string;
  identity: string;
  conditionDisplay: string;
  testingDisplay: string;
  pricingDisplay: string;
  searchTerms: readonly string[];
  essentialSpecs: Readonly<{
    dataRate: string;
    formFactor: string;
    fiberType: string;
    reach: string;
    wavelength: string;
    connector: string;
  }>;
  additionalSpecs: readonly Readonly<{
    label: string;
    value: string;
  }>[];
  publicNotes: string;
}>;

export const publicProductFixtures = [
  {
    slug: "cisco-glc-sx-mm",
    manufacturer: "Cisco",
    partNumber: "GLC-SX-MM",
    identity: "1000BASE-SX SFP",
    conditionDisplay: "Pre-owned · fixture condition",
    testingDisplay: "Testing status not connected",
    pricingDisplay: "Pricing available later",
    searchTerms: ["Cisco", "GLC-SX-MM", "1000BASE-SX", "1 Gbps", "SFP", "multimode"],
    essentialSpecs: {
      dataRate: "1 Gbps",
      formFactor: "SFP",
      fiberType: "Multimode",
      reach: "550 m",
      wavelength: "850 nm",
      connector: "LC duplex",
    },
    additionalSpecs: [
      { label: "Standard", value: "1000BASE-SX" },
      { label: "Fixture purpose", value: "Storefront interface development" },
    ],
    publicNotes:
      "This synthetic presentation record demonstrates the intended information hierarchy. It is not a live listing or an offer to sell.",
  },
  {
    slug: "cisco-glc-lh-sm",
    manufacturer: "Cisco",
    partNumber: "GLC-LH-SM",
    identity: "1000BASE-LX/LH SFP",
    conditionDisplay: "Pre-owned · fixture condition",
    testingDisplay: "Testing status not connected",
    pricingDisplay: "Pricing available later",
    searchTerms: ["Cisco", "GLC-LH-SM", "1000BASE-LX", "1 Gbps", "SFP", "single-mode"],
    essentialSpecs: {
      dataRate: "1 Gbps",
      formFactor: "SFP",
      fiberType: "Single-mode",
      reach: "10 km",
      wavelength: "1310 nm",
      connector: "LC duplex",
    },
    additionalSpecs: [
      { label: "Standard", value: "1000BASE-LX/LH" },
      { label: "Fixture purpose", value: "Storefront interface development" },
    ],
    publicNotes:
      "This synthetic presentation record demonstrates the intended information hierarchy. It is not a live listing or an offer to sell.",
  },
  {
    slug: "juniper-740-031981",
    manufacturer: "Juniper",
    partNumber: "740-031981",
    identity: "10GBASE-LR SFP+",
    conditionDisplay: "Pre-owned · fixture condition",
    testingDisplay: "Testing status not connected",
    pricingDisplay: "Pricing available later",
    searchTerms: [
      "Juniper",
      "740-031981",
      "Finisar",
      "FTLX1471D3BNL-J1",
      "10GBASE-LR",
      "10 Gbps",
      "SFP+",
      "single-mode",
    ],
    essentialSpecs: {
      dataRate: "10 Gbps",
      formFactor: "SFP+",
      fiberType: "Single-mode",
      reach: "10 km",
      wavelength: "1310 nm",
      connector: "LC duplex",
    },
    additionalSpecs: [
      { label: "Standard", value: "10GBASE-LR" },
      { label: "Related fixture reference", value: "Finisar FTLX1471D3BNL-J1" },
      { label: "Fixture purpose", value: "Storefront interface development" },
    ],
    publicNotes:
      "The displayed part relationship is an illustrative fixture supplied for interface development. It is not a compatibility, authenticity, or sourcing claim.",
  },
] as const satisfies readonly PublicProductFixture[];

export type CatalogFixtureFilters = Readonly<{
  query?: string;
  manufacturer?: string;
  dataRate?: string;
}>;

export function getPublicProductFixture(slug: string) {
  return publicProductFixtures.find((product) => product.slug === slug);
}

export function filterPublicProductFixtures({
  dataRate = "all",
  manufacturer = "all",
  query = "",
}: CatalogFixtureFilters) {
  const normalizedQuery = query.trim().toLocaleLowerCase("en-CA");

  return publicProductFixtures.filter((product) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      product.searchTerms.some((term) =>
        term.toLocaleLowerCase("en-CA").includes(normalizedQuery),
      );
    const matchesManufacturer =
      manufacturer === "all" || product.manufacturer === manufacturer;
    const matchesDataRate =
      dataRate === "all" || product.essentialSpecs.dataRate === dataRate;

    return matchesQuery && matchesManufacturer && matchesDataRate;
  });
}
