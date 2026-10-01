import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CatalogExplorer } from "@/components/catalog/catalog-explorer";

describe("CatalogExplorer", () => {
  it("filters the fixture catalog through keyboard-accessible controls", () => {
    render(<CatalogExplorer />);

    expect(screen.getByText("Showing 3 of 3 development fixtures")).toBeInTheDocument();
    const filterSummary = screen.getByText("Filters");
    const filterDisclosure = filterSummary.closest("details");
    expect(filterDisclosure).not.toHaveAttribute("open");

    fireEvent.click(filterSummary);
    expect(filterDisclosure).toHaveAttribute("open");

    fireEvent.change(screen.getByLabelText("Search fixture products"), {
      target: { value: "740-031981" },
    });
    expect(screen.getByText("Showing 1 of 3 development fixtures")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "740-031981" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "GLC-SX-MM" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByText("Showing 3 of 3 development fixtures")).toBeInTheDocument();
  });

  it("announces active secondary filters in the disclosure label", () => {
    render(<CatalogExplorer />);

    fireEvent.click(screen.getByText("Filters"));
    fireEvent.change(screen.getByLabelText("Manufacturer"), {
      target: { value: "Cisco" },
    });

    expect(screen.getByText("1 active")).toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 3 development fixtures")).toBeInTheDocument();
  });

  it("renders a safe empty state without implying inventory or compatibility", () => {
    render(<CatalogExplorer initialQuery="not-a-fixture" />);

    expect(screen.getByRole("heading", { name: "No fixture products match" })).toBeInTheDocument();
    expect(screen.getByText(/No inventory or compatibility conclusion is implied/)).toBeInTheDocument();
  });
});
