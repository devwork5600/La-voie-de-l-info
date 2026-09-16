import { Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
      <Newspaper className="text-primary mb-6 size-12" strokeWidth={1.5} />

      <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
        Erreur 404
      </p>

      <h1 className="font-playfair mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Cette édition n&rsquo;existe pas
      </h1>

      <p className="text-muted-foreground mt-4 max-w-md text-lg">
        La page que vous cherchez a été déplacée, retirée ou n&rsquo;a jamais
        été publiée.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wide uppercase transition hover:opacity-90"
        >
          Retour à la une
        </Link>
        <Link
          href="/articles"
          className="text-primary text-sm font-semibold tracking-wide uppercase hover:underline"
        >
          Voir tous les articles
        </Link>
      </div>
    </div>
  );
}
