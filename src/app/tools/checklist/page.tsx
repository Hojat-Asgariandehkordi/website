import Link from "next/link";
import type { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getChecklist as getSaved } from "@/lib/repo";
import { getChecklist } from "@/lib/content";
import { Checklist } from "@/components/Checklist";

export const metadata: Metadata = { title: "Deal-readiness checklist" };
export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const user = await currentUser();
  const checked = user ? [...getSaved(getDb(), user.id)] : [];
  return (
    <div className="container-page pt-12">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft"><Link href="/tools" className="hover:text-cedar-700">Tools</Link> / Deal-readiness checklist</nav>
      <header className="mt-6 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl">Deal-readiness checklist</h1>
        <p className="mt-4 text-lg text-ink-soft">Tick off what you have prepared as you work through the course.</p>
      </header>
      <div className="mt-10"><Checklist groups={getChecklist()} checked={checked} signedIn={Boolean(user)} /></div>
    </div>
  );
}
