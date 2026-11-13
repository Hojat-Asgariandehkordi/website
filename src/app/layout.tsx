import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: { default: "NextOwner: prepare to buy a small business in Canada", template: "%s · NextOwner" },
  description: "A course, a deal-team guide and practice tools for anyone preparing to buy an existing small business in Canada, with an extra pathway for newcomers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks that JS is running, so scroll-reveal content is only hidden when it can be revealed. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }} />
      </head>
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cedar-900 focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
