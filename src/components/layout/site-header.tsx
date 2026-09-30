import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          className="rounded-sm text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          href="/"
        >
          LoonLink
        </Link>
        <nav aria-label="Primary">
          <a
            className="rounded-sm text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
            href="#status"
          >
            Project status
          </a>
        </nav>
      </div>
    </header>
  );
}
