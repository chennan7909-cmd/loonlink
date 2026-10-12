import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CompatibilityPage from "@/app/compatibility/page";
import Home from "@/app/page";
import ProductsPage from "@/app/products/page";
import RequestQuotePage from "@/app/request-quote/page";

describe("public preview storefront", () => {
  it("preserves the approved homepage direction without publishing fixtures", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /The right optic.*Without the guesswork/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Catalog coming soon." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Information before assumptions." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sourcing workflow preview" })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/GLC-SX-MM|740-031981|development fixture/i);
  });

  it("renders a clear catalog-coming-soon state without discovery or commerce controls", () => {
    render(<ProductsPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Catalog coming soon." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nothing is offered for sale yet" })).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/GLC-SX-MM|740-031981|in stock/i);
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
