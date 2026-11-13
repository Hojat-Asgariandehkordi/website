import Link from "next/link";
import type { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listScenarios } from "@/lib/repo";
import { AffordabilityCalculator } from "@/components/AffordabilityCalculator";

export const metadata: Metadata = { title: "Affordability calculator" };
export const dynamic = "force-dynamic";

export default async function AffordabilityPage() {
  const user = await currentUser();
  const scenarios = user ? listScenarios(getDb(), user.id) : [];
  return (
    <div className="container-page pt-12">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft"><Link href="/tools" className="hover:text-cedar-700">Tools</Link> / Affordability calculator</nav>
      <header className="mt-6 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl">Affordability calculator</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Test a price against a financing structure. See what the debt costs each month, how well cash flow covers it and what is left for you. Pairs with <Link className="link" href="/course/financing-in-canada">Module 6: Financing in Canada</Link>.
        </p>
      </header>
      <div className="mt-10"><AffordabilityCalculator scenarios={scenarios} signedIn={Boolean(user)} /></div>
    </div>
  );
}
