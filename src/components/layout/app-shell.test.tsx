import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "@/components/layout/app-shell";

describe("AppShell", () => {
  it("renders the accessible LoonLink page structure", () => {
    render(
      <AppShell>
        <h1>Foundation test content</h1>
      </AppShell>,
    );

    const header = screen.getByRole("banner");
    expect(within(header).getByRole("link", { name: "LoonLink" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Foundation test content");
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "LoonLink is under development.",
    );
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
  });
});
