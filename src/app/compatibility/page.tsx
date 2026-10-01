import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SearchInput } from "@/components/ui/search-input";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Compatibility preview",
  description:
    "Preview LoonLink's planned evidence-backed optical transceiver compatibility workflow.",
};

const workflowSteps = [
  {
    title: "Search the equipment context",
    description: "Identify a part number, device, model, or supported platform reference.",
  },
  {
    title: "Review the evidence",
    description:
      "See the source, scope, constraints, review state, and uncertainty behind any future conclusion.",
  },
  {
    title: "Consider relevant products",
    description:
      "Review available products only after the compatibility record and its limits are understood.",
  },
] as const;

export default function CompatibilityPage() {
  return (
    <>
      <Section className="pb-12 sm:pb-16">
        <Container>
          <Badge variant="warning">Preview only · compatibility search is not live</Badge>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Compatibility, with the evidence in view.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            LoonLink is designed to present compatibility information with its provenance, applicable equipment scope, constraints, and review state.
          </p>
          <div className="mt-10 max-w-2xl rounded-lg border border-border bg-surface p-5 sm:p-6">
            <SearchInput
              disabled
              label="Future compatibility search"
              placeholder="Search part number or device model"
            />
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              This control is intentionally inactive. Phase 1C does not contain a compatibility engine or compatibility records.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface" aria-labelledby="workflow-title">
        <Container>
          <h2 className="text-3xl font-semibold tracking-[-0.025em]" id="workflow-title">
            The planned workflow
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {workflowSteps.map((step, index) => (
              <li className="border-t border-border pt-6" key={step.title}>
                <p className="font-mono text-xs font-semibold text-muted-foreground">0{index + 1}</p>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">No inferred results</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Similar speed, reach, wavelength, connector, or fiber type can help narrow a search, but those attributes alone do not establish compatibility. Unknown, incomplete, conflicting, or obsolete evidence will never be presented as verified.
            </p>
            <Link className={`${buttonVariants({ variant: "outline" })} mt-7`} href="/products">
              Browse fixture products
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
