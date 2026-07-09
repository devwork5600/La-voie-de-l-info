import { PenTool, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getEditorialTeam } from "@/actions/categories-actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "La Rédaction",
  description:
    "Découvrez l'équipe de journalistes indépendants qui fait La Voie De L'Info : une information rigoureuse, vérifiée et accessible à tous.",
  alternates: { canonical: "/redaction" },
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Rédacteur en chef",
  AUTHOR: "Journaliste",
};

export default async function RedactionPage() {
  const team = await getEditorialTeam();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="max-w-2xl">
        <h1 className="font-playfair text-4xl font-bold tracking-tight sm:text-5xl">
          La Rédaction
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          La Voie De L&rsquo;Info est portée par une équipe de journalistes
          indépendants, engagés pour une information rigoureuse, vérifiée et
          accessible à tous.
        </p>
      </div>

      <div className="border-primary mt-12 grid grid-cols-1 gap-6 border-t-2 pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {team.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            L&rsquo;équipe éditoriale sera bientôt présentée ici.
          </p>
        ) : (
          team.map((member) => (
            <div key={member.id} className="flex items-center gap-4">
              <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-full">
                {member.image && (
                  <Image
                    src={member.image}
                    alt={member.name ?? "Membre de la rédaction"}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-playfair font-bold">
                  {member.name ?? "Sans nom"}
                </p>
                <p className="text-muted-foreground flex items-center gap-1 text-xs tracking-wide uppercase">
                  {member.role === "ADMIN" ? (
                    <ShieldCheck className="size-3" />
                  ) : (
                    <PenTool className="size-3" />
                  )}
                  {ROLE_LABELS[member.role] ?? member.role}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {member._count.articles} article
                  {member._count.articles > 1 ? "s" : ""} publié
                  {member._count.articles > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-muted/50 mt-16 rounded-lg p-8 text-center">
        <p className="font-playfair text-xl font-bold">
          Rejoindre la rédaction
        </p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-lg text-sm">
          Vous êtes journaliste et partagez nos valeurs d&rsquo;indépendance et
          de rigueur ? Contactez-nous pour rejoindre l&rsquo;aventure.
        </p>
        <Button asChild className="mt-4">
          <Link href="/contact">Nous contacter</Link>
        </Button>
      </div>
    </div>
  );
}
