import { Globe, Rss, Share2 } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

import { NewsletterSignup } from "./NewsletterSignup";

const RUBRIQUES = [
  { name: "Politique", slug: "politique" },
  { name: "Économie", slug: "economie" },
  { name: "High-Tech", slug: "high-tech" },
  { name: "Écologie", slug: "ecologie" },
  { name: "Culture", slug: "culture" },
];

const INSTITUTION = [
  { name: "Contact", href: "/contact" },
  { name: "Rédaction", href: "/redaction" },
  { name: "Mentions légales", href: "/mentions-legales" },
  { name: "Confidentialité", href: "/confidentialite" },
];

const Footer: React.FC = () => (
  <footer className="w-full mt-6 border-t-4 border-primary bg-brand text-brand-foreground">
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-2xl font-semibold font-playfair">La Voie De L&rsquo;Info</h2>

          <div className="mt-6">
            <NewsletterSignup />
          </div>

          <ul className="flex gap-4 mt-8">
            <li>
              <a href="/" aria-label="Site web" className="transition hover:text-primary">
                <Globe className="size-5" />
              </a>
            </li>
            <li>
              <a href="/" aria-label="Flux RSS" className="transition hover:text-primary">
                <Rss className="size-5" />
              </a>
            </li>
            <li>
              <a href="/" aria-label="Partager" className="transition hover:text-primary">
                <Share2 className="size-5" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-medium uppercase tracking-wide text-primary">Rubriques</p>
          <ul className="mt-6 space-y-4 text-sm">
            {RUBRIQUES.map((rubrique) => (
              <li key={rubrique.slug}>
                <Link
                  href={`/articles?category=${rubrique.slug}`}
                  className="transition hover:text-primary"
                >
                  {rubrique.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium uppercase tracking-wide text-primary">Institution</p>
          <ul className="mt-6 space-y-4 text-sm">
            {INSTITUTION.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-primary">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium uppercase tracking-wide text-primary">Abonnement</p>
          <p className="mt-6 text-sm text-brand-foreground/70">
            Soutenez le journalisme de qualité en vous abonnant à notre offre premium.
          </p>
          <Button asChild className="mt-6 uppercase tracking-wide">
            <Link href="/subscribe">Découvrir les offres</Link>
          </Button>
        </div>
      </div>

      <p className="border-t border-white/10 pt-8 text-center text-xs uppercase tracking-wide text-brand-foreground/60">
        &copy; {new Date().getFullYear()} La Voie De L&rsquo;Info. Édition Prestige.
      </p>
    </div>
  </footer>
);

export default Footer;
