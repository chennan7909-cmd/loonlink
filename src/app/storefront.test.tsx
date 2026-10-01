import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CompatibilityPage from "@/app/compatibility/page";
import Home from "@/app/page";
import ProductDetailPage from "@/app/products/[slug]/page";
import RequestQuotePage from "@/app/request-quote/page";

describe("Phase 1C storefront", () => {
  it("renders the homepage storefront hierarchy and curated fixtures", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /The right optic.*Without the guesswork/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Find a part" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A focused starting point." })).toBeInTheDocument();
    expect(screen.getAllByText("Development fixture")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Information before assumptions." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Can't find your part?" })).toBeInTheDocument();
    expect(screen.queryByText(/live availability/i)).not.toBeInTheDocument();
  });

  it("renders the three-level product detail without restricted operational fields", async () => {
    render(
      await ProductDetailPage({
        params: Promise.resolve({ slug: "cisco-glc-sx-mm" }),
      }),
    );

    expect(screen.getByRole("heading", { level: 1, name: "GLC-SX-MM" })).toBeInTheDocument();
    expect(screen.getByText("Pricing available later")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The decision-level details." })).toBeInTheDocument();
    expect(screen.getByText("Compatibility evidence")).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/serial number|supplier|cost price|private note/i);
  });

  it("keeps compatibility and sourcing as explicit inactive previews", () => {
    const { unmount } = render(<CompatibilityPage />);
    expect(screen.getByText("Preview only · compatibility search is not live")).toBeInTheDocument();
    expect(screen.getByLabelText("Future compatibility search")).toBeDisabled();
    expect(screen.getByRole("heading", { name: "No inferred results" })).toBeInTheDocument();
    unmount();

    render(<RequestQuotePage />);
    expect(screen.getByText("Preview only · submissions are not enabled")).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.getByText("Does not reserve inventory")).toBeInTheDocument();
  });
});
