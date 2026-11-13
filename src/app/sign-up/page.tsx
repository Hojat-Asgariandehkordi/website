import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Create account" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/dashboard";
  if (await currentUser()) redirect(next);
  return (
    <div className="container-page max-w-md pt-16">
      <h1 className="mb-8 text-center text-4xl">Create your free account</h1>
      <AuthForm mode="sign-up" next={next} />
    </div>
  );
}
