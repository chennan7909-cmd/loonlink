import { ArrowRight, Boxes, FileSearch, Network } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const focusAreas = [
  {
    id: "products",
    icon: Boxes,
    title: "Curated product discovery",
    description:
      "A focused catalog is planned around clear product identity, condition, and the specifications needed for a purchase decision.",
  },
  {
    id: "compatibility",
    icon: Network,
    title: "Evidence before conclusions",
    description:
      "Future compatibility results will communicate their scope, evidence, and uncertainty instead of relying on specification matching alone.",
  },
  {
    id: "request-quote",
    icon: FileSearch,
    title: "A path for non-standard needs",
    description:
      "A request-for-quote path is planned for volume, ambiguous, unavailable, or otherwise non-checkout requirements.",
  },
] as const;

export default function Home() {
  return (
    <>
      <Section className="pb-12 sm:pb-16 lg:pb-20">
        <Container>
          <div className="max-w-4xl">
            <Badge variant="info">Phase 1B placeholder</Badge>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              Optical transceiver decisions, made clearer.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              LoonLink is building a compatibility-first commerce experience for B2B optical transceiver buyers, with an initial focus on Canada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className={cn(buttonVariants({ size: "lg" }), "group")} href="#discover">
                Review the foundation
                <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link className={buttonVariants({ size: "lg", variant: "outline" })} href="#about">
                About LoonLink
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface" id="discover">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Planned experience
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
              Start with the next decision.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Product and compatibility detail will appear progressively, keeping the default view useful to both technical and non-specialist B2B buyers.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {focusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Card className="h-full" id={area.id} key={area.id}>
                  <CardHeader>
                    <Icon aria-hidden="true" className="size-5 text-primary" />
                    <h3 className="mt-6 text-lg font-semibold tracking-tight">{area.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{area.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section id="about">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <h2 className="text-3xl font-semibold tracking-[-0.025em]">Calm interface. Precise information.</h2>
            <div className="space-y-4 text-base leading-7 text-muted-foreground">
              <p>
                LoonLink is intended to help businesses discover, assess, and eventually purchase optical transceivers through structured specifications and evidence-backed compatibility information.
              </p>
              <p>
                The project does not yet offer live inventory, compatibility results, quote submission, or purchasing. Those capabilities belong to later phases and will only present claims supported by actual records.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
