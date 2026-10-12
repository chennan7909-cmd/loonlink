import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: "LoonLink",
  title: {
    default: "LoonLink | Optical transceiver sourcing preview",
    template: "%s | LoonLink",
  },
  description:
    "A public preview of LoonLink, a compatibility-first optical transceiver platform under development for Canadian business buyers.",
  robots: { index: true, follow: true },
  openGraph: {
    locale: "en_CA",
    siteName: "LoonLink",
    title: "LoonLink optical transceiver sourcing preview",
    description:
      "LoonLink is preparing a compatibility-first optical transceiver catalog for Canadian business buyers.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LoonLink optical transceiver sourcing preview",
    description:
      "LoonLink is preparing a compatibility-first optical transceiver catalog for Canadian business buyers.",
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html data-scroll-behavior="smooth" lang="en-CA">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
