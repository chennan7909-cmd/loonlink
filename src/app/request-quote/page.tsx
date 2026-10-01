import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Request sourcing preview",
  description:
    "Preview LoonLink's planned sourcing path for optical transceiver parts that are not shown in the storefront.",
};

export default function RequestQuotePage() {
  return (
    <Section>
      <Container>
        <div className="max-w-3xl">
          <Badge variant="warning">Preview only · submissions are not enabled</Badge>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Can&apos;t find your part?
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            The planned sourcing workflow will accept the part number, requested quantity, equipment context, and business contact details needed for an operator to review the request.
          </p>
          <div className="mt-10 rounded-lg border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">What this preview does not do</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground sm:grid-cols-2 sm:gap-x-8">
              <li>Does not submit or store contact information</li>
              <li>Does not reserve inventory</li>
              <li>Does not establish price or availability</li>
              <li>Does not create a compatibility conclusion</li>
            </ul>
          </div>
          <p className="mt-8 leading-7 text-muted-foreground">
            RFQ submission, validation, abuse protection, private data handling, and operator review belong to Phase 5.
          </p>
          <Link className={`${buttonVariants({ variant: "outline" })} mt-7`} href="/products">
            Return to fixture products
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
