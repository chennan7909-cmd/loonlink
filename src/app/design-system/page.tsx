import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Section } from "@/components/ui/section";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { TechnicalMetadataRow } from "@/components/ui/technical-metadata-row";

export const metadata: Metadata = {
  title: "Design system",
  description: "Internal visual reference for the LoonLink interface system.",
  robots: { index: false, follow: false },
};

function ShowcaseHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h2>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      <Section className="border-b border-border bg-surface">
        <Container>
          <Badge variant="warning">Development reference · not live catalog data</Badge>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            LoonLink design system
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            A calm, precise interface foundation for compatibility-first optical transceiver commerce. Every product, price, test, and status below is an illustrative UI fixture only.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <ShowcaseHeading eyebrow="Foundations" title="Typography and spacing" />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-7">
              <p className="text-5xl font-semibold tracking-[-0.035em]">Display heading</p>
              <p className="text-4xl font-semibold tracking-[-0.03em]">Page heading</p>
              <p className="text-2xl font-semibold tracking-[-0.02em]">Section heading</p>
              <p className="max-w-xl leading-7 text-muted-foreground">
                Body copy stays measured and readable. It explains what a buyer needs now, while detailed engineering information remains available on request.
              </p>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Technical metadata · 10GBASE-LR</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {["4", "8", "16", "24"].map((space, index) => (
                <div className="flex flex-col gap-3" key={space}>
                  <div
                    aria-hidden="true"
                    className="w-full rounded-sm bg-secondary"
                    style={{ height: `${(index + 1) * 16}px` }}
                  />
                  <span className="font-mono text-xs text-muted-foreground">{space}px step</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface">
        <Container>
          <ShowcaseHeading eyebrow="Actions and fields" title="Clear controls, restrained emphasis" />
          <div className="space-y-10">
            <div className="flex flex-wrap gap-3">
              <Button type="button">Primary action</Button>
              <Button type="button" variant="secondary">Secondary action</Button>
              <Button type="button" variant="outline">Outline action</Button>
              <Button type="button" variant="ghost">Quiet action</Button>
              <Button disabled type="button">Unavailable</Button>
            </div>
            <div className="grid max-w-4xl gap-6 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Part number
                <Input placeholder="Enter a manufacturer part number" />
              </label>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Future compatibility search</span>
                <SearchInput label="What are you trying to match?" placeholder="What are you trying to match?" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <ShowcaseHeading eyebrow="Product hierarchy" title="A small catalog can still feel intentional" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <Card aria-labelledby="fixture-product-title">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge>Illustrative fixture</Badge>
                  <span className="font-mono text-xs text-muted-foreground">Not live inventory</span>
                </div>
                <p className="mt-8 text-sm font-medium text-muted-foreground">Example Networks</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight" id="fixture-product-title">EX-10G-LR</h3>
                <p className="mt-2 text-base text-muted-foreground">10GBASE-LR SFP+</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral">Pre-owned example</Badge>
                  <Badge variant="info">Testing record example</Badge>
                </div>
                <p className="mt-6 text-sm leading-6">10 Gbps · Single-mode · 10 km</p>
                <p className="mt-5 text-lg font-semibold">CAD $125.00 <span className="text-xs font-normal text-muted-foreground">illustrative only</span></p>
              </CardContent>
              <CardFooter>
                <Button type="button">View example details <ArrowRight aria-hidden="true" /></Button>
              </CardFooter>
            </Card>
            <Card aria-labelledby="metadata-title">
              <CardHeader>
                <h3 className="text-lg font-semibold" id="metadata-title">Essential specifications</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Level-two information, after the purchase-decision summary.</p>
              </CardHeader>
              <CardContent>
                <dl>
                  <TechnicalMetadataRow label="Data rate" value="10 Gbps" />
                  <TechnicalMetadataRow label="Fiber" value="Single-mode" />
                  <TechnicalMetadataRow label="Reach" value="10 km" />
                  <TechnicalMetadataRow label="Wavelength" value="1310 nm" />
                  <TechnicalMetadataRow label="Connector" value="LC duplex" />
                </dl>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface">
        <Container>
          <ShowcaseHeading eyebrow="Status language" title="Meaning comes from labels and provenance—not color" />
          <p className="-mt-4 mb-8 max-w-3xl text-sm leading-6 text-muted-foreground">
            These are visual-state examples, not compatibility conclusions. “Verified” is reserved for a future reviewed record with adequate, active provenance. Testing status is a separate concept.
          </p>
          <div className="flex flex-wrap gap-3">
            <StatusIndicator tone="info">Manufacturer documented</StatusIndicator>
            <StatusIndicator tone="success">Verified</StatusIndicator>
            <StatusIndicator tone="warning">Customer reported · unverified</StatusIndicator>
            <StatusIndicator tone="neutral">Untested / Unknown</StatusIndicator>
          </div>
          <Divider className="my-10" />
          <div className="grid gap-4 lg:grid-cols-2">
            <Disclosure title="View complete technical specifications">
              <p>
                Detailed engineering fields belong behind progressive disclosure after the buyer understands the product identity and essential optical characteristics.
              </p>
            </Disclosure>
            <Disclosure title="Review compatibility evidence">
              <p>
                A future record will distinguish evidence source, scope, review status, version constraints, conflicts, and obsolescence. Shared optical specifications alone never establish compatibility.
              </p>
            </Disclosure>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <ShowcaseHeading eyebrow="Empty state" title="Absence should be useful, not alarming" />
          <EmptyState
            action={<Button type="button" variant="outline">Clear example query</Button>}
            description="Try another manufacturer part number or return later. No compatibility conclusion is made when evidence is absent."
            title="No evidence-backed result"
          />
        </Container>
      </Section>
    </>
  );
}
