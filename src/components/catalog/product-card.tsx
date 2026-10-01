import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProductMediaPlaceholder } from "@/components/catalog/product-media-placeholder";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { PublicProductFixture } from "@/features/catalog/public-fixtures";
import { cn } from "@/lib/utils";

type ProductCardProps = Readonly<{
  product: PublicProductFixture;
}>;

export function ProductCard({ product }: ProductCardProps) {
  const titleId = `product-${product.slug}`;

  return (
    <Card aria-labelledby={titleId} className="flex h-full flex-col overflow-hidden">
      <ProductMediaPlaceholder partNumber={product.partNumber} />
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{product.manufacturer}</p>
          <Badge>Development fixture</Badge>
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-tight" id={titleId}>
          {product.partNumber}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{product.identity}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm font-medium">{product.conditionDisplay}</p>
        <p className="mt-2 text-sm text-muted-foreground">{product.testingDisplay}</p>
        <p className="mt-6 text-sm leading-6 text-foreground">
          {product.essentialSpecs.dataRate} · {product.essentialSpecs.formFactor} ·{" "}
          {product.essentialSpecs.fiberType} · {product.essentialSpecs.reach}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          aria-label={`View fixture details for ${product.manufacturer} ${product.partNumber}`}
          className={cn(buttonVariants({ variant: "link" }), "group")}
          href={`/products/${product.slug}`}
        >
          View details
          <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
