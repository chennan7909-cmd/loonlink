import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "@/components/layout/app-shell";

describe("AppShell", () => {
  it("renders the accessible LoonLink page structure and primary navigation", () => {
    render(
      <AppShell>
        <h1>Foundation test content</h1>
      </AppShell>,
    );

    const header = screen.getByRole("banner");
    expect(within(header).getByRole("link", { name: "LoonLink" })).toHaveAttribute("href", "/");

    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(within(navigation).getByRole("link", { name: "Products" })).toHaveAttribute("href", "/#products");
    expect(within(navigation).getByRole("link", { name: "Compatibility" })).toHaveAttribute("href", "/#compatibility");
    expect(within(navigation).getByRole("link", { name: "Request a Quote" })).toHaveAttribute("href", "/#request-quote");
    expect(within(navigation).getByRole("link", { name: "About" })).toHaveAttribute("href", "/#about");

    expect(screen.getByRole("main")).toHaveTextContent("Foundation test content");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Storefront preview only.");
    expect(screen.queryByRole("link", { name: /design system/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
  });

  it("opens, closes, and keyboard-dismisses mobile navigation", () => {
    render(<AppShell><h1>Content</h1></AppShell>);

    const openButton = screen.getByRole("button", { name: "Open navigation menu" });
    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile primary" })).not.toBeInTheDocument();

    fireEvent.click(openButton);
    const closeButton = screen.getByRole("button", { name: "Close navigation menu" });
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile primary" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Mobile primary" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveFocus();
  });
});
