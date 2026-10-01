import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LoonLink",
    template: "%s | LoonLink",
  },
  description: "Compatibility-first optical transceiver commerce.",
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
