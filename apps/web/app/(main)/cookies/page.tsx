import type { Metadata } from "next";
import Link from "next/link";

import LegalSection from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Quels cookies La Voie De L'Info utilise, et pourquoi.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <div>
        <h1 className="font-playfair text-4xl font-bold tracking-tight sm:text-5xl">
          Politique de cookies
        </h1>
        <p className="text-muted-foreground mt-4">
          Dernière mise à jour : {new Date().getFullYear()}.
        </p>
      </div>

      <LegalSection title="Cookies essentiels">
        <p>
          La Voie De L&rsquo;Info utilise un cookie de session pour te garder
          connecté après ta connexion. Ce cookie est strictement nécessaire au
          fonctionnement du site : sans lui, tu ne peux pas rester connecté ni
          accéder à ton compte ou à ton abonnement.
        </p>
      </LegalSection>

      <LegalSection title="Paiement et abonnement">
        <p>
          Le paiement est géré par Stripe sur une page hébergée par Stripe
          elle-même. Aucun script Stripe n&rsquo;est chargé sur ce domaine :
          aucun cookie lié au paiement n&rsquo;est posé par La Voie De
          L&rsquo;Info. Les cookies éventuellement posés pendant le paiement le
          sont par Stripe, sous sa propre politique de confidentialité.
        </p>
      </LegalSection>

      <LegalSection title="Aucun cookie publicitaire ou de mesure d'audience">
        <p>
          La Voie De L&rsquo;Info n&rsquo;utilise actuellement aucun outil de
          mesure d&rsquo;audience ni aucun cookie publicitaire ou traceur tiers
          à des fins de marketing ou de revente de données.
        </p>
      </LegalSection>

      <LegalSection title="Gérer les cookies">
        <p>
          Tu peux supprimer ou bloquer les cookies à tout moment depuis les
          réglages de ton navigateur. Bloquer le cookie de session
          t&rsquo;empêchera de rester connecté à ton compte.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative à cette politique, tu peux nous contacter
          via notre{" "}
          <Link href="/contact" className="text-primary hover:underline">
            page de contact
          </Link>
          .
        </p>
      </LegalSection>
    </div>
  );
}
