import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16 sm:py-24 lg:px-8">
      <section aria-labelledby="page-title" className="max-w-3xl">
        <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Phase 1A foundation
        </p>
        <h1
          id="page-title"
          className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          LoonLink
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-xl leading-8 text-foreground sm:text-2xl">
          Compatibility-first optical transceiver commerce.
        </p>
        <p className="mt-5 max-w-2xl text-pretty leading-7 text-muted-foreground">
          LoonLink is under development. This foundation establishes the
          application shell and engineering toolchain; storefront functionality
          is not available yet.
        </p>
        <div className="mt-8">
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="#status" />}
          >
            View project status
          </Button>
        </div>
      </section>

      <section
        id="status"
        aria-labelledby="status-title"
        className="mt-20 max-w-3xl border-t border-border pt-8"
      >
        <h2 id="status-title" className="text-xl font-semibold tracking-tight">
          Project status
        </h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          The production-oriented project foundation is in place. Product,
          compatibility, inventory, purchasing, and request-for-quote features
          belong to later phases.
        </p>
      </section>
    </div>
  );
}
