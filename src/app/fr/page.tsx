import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "NextOwner en français (brouillon)" };

/** French route. Every French string here is a DRAFT and must be reviewed by a qualified translator before use. */
export default function FrenchHome() {
  return (
    <div lang="fr" className="container-page pt-12">
      <div role="note" data-draft-notice className="rounded-xl border border-clay-500/50 bg-clay-100/60 px-4 py-3 text-sm">
        <strong>Brouillon.</strong> Cette version française n&apos;a pas encore été révisée par un traducteur. Le contenu complet du cours est offert en anglais.{" "}
        <span lang="en" className="text-ink-soft">(Draft. This French version has not been reviewed yet. The full course is in English.)</span>
      </div>
      <p className="eyebrow mt-12">Repreneuriat au Canada</p>
      <h1 className="mt-4 max-w-3xl text-5xl leading-tight">Préparez-vous à reprendre une petite entreprise au Canada, avec une feuille de route plus claire.</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-soft">Nouvel arrivant au Canada? Un parcours complémentaire vous est offert.</p>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        <li className="card p-6"><h2 className="text-2xl">Cours</h2><p className="mt-2 text-[15px] text-ink-soft">Douze modules, de la décision d&apos;acheter jusqu&apos;aux cent premiers jours.</p></li>
        <li className="card p-6"><h2 className="text-2xl">Équipe de transaction</h2><p className="mt-2 text-[15px] text-ink-soft">Le rôle du courtier, de l&apos;avocat, du comptable, du prêteur et des autres conseillers.</p></li>
        <li className="card p-6"><h2 className="text-2xl">Outils</h2><p className="mt-2 text-[15px] text-ink-soft">Une calculatrice de capacité d&apos;achat et une liste de préparation.</p></li>
      </ul>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/course" className="btn-primary">Commencer le cours (en anglais)</Link>
        <Link href="/newcomers/quebec-and-french" className="btn-secondary">Québec et termes en français</Link>
      </div>
    </div>
  );
}
