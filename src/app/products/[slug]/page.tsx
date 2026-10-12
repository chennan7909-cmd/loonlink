import type { Metadata } from "next";

import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Catalog item unavailable",
  description: "LoonLink has not published individual catalog listings in this preview.",
  robots: { index: false, follow: false },
};

export default function ProductDetailPage() {
  notFound();
}
