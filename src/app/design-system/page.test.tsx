import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DesignSystemPage from "@/app/design-system/page";

describe("DesignSystemPage", () => {
  it("renders the component reference with fixture and status safeguards", () => {
    render(<DesignSystemPage />);

    expect(screen.getByRole("heading", { level: 1, name: "LoonLink design system" })).toBeInTheDocument();
    expect(screen.getByText("Development reference · not live catalog data")).toBeInTheDocument();
    expect(screen.getByText("CAD $125.00", { exact: false })).toHaveTextContent("illustrative only");
    expect(screen.getByText("Customer reported · unverified")).toBeInTheDocument();
    expect(screen.getByText("Untested / Unknown")).toBeInTheDocument();
  });

  it("uses an operable native disclosure for technical detail", () => {
    render(<DesignSystemPage />);

    const summary = screen.getByText("View complete technical specifications");
    const details = summary.closest("details");
    expect(details).not.toHaveAttribute("open");

    fireEvent.click(summary);
    expect(details).toHaveAttribute("open");
    expect(screen.getByText(/Detailed engineering fields belong behind progressive disclosure/)).toBeInTheDocument();
  });
});
