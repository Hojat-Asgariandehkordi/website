import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page max-w-xl py-24 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-3 text-4xl">That page isn&apos;t on the map</h1>
      <p className="mt-4 text-ink-soft">Try the course roadmap instead.</p>
      <Link href="/course" className="btn-primary mt-8">Go to the course</Link>
    </div>
  );
}
