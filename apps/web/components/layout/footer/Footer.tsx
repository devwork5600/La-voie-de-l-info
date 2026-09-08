import { Globe, Rss, Share2 } from "lucide-react";
import Link from "next/link";
import React from "react";

import { NewsletterSignup } from "./NewsletterSignup";

import { Button } from "@/components/ui/button";

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
  <footer className="border-primary bg-brand text-brand-foreground mt-6 w-full border-t-4">
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-playfair text-2xl font-semibold">
            La Voie De L&rsquo;Info
          </h2>

          <div className="mt-6">
            <NewsletterSignup />
          </div>

          <ul className="mt-8 flex gap-4">
            <li>
              <a
                href="/"
                aria-label="Site web"
                className="hover:text-primary transition"
              >
                <Globe className="size-5" />
              </a>
            </li>
            <li>
              <a
                href="/"
                aria-label="Flux RSS"
                className="hover:text-primary transition"
              >
                <Rss className="size-5" />
              </a>
            </li>
            <li>
              <a
                href="/"
                aria-label="Partager"
                className="hover:text-primary transition"
              >
                <Share2 className="size-5" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-primary font-medium tracking-wide uppercase">
            Rubriques
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            {RUBRIQUES.map((rubrique) => (
              <li key={rubrique.slug}>
                <Link
                  href={`/articles?category=${rubrique.slug}`}
                  className="hover:text-primary transition"
                >
                  {rubrique.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-primary font-medium tracking-wide uppercase">
            Institution
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            {INSTITUTION.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-primary transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-primary font-medium tracking-wide uppercase">
            Abonnement
          </p>
          <p className="text-brand-foreground/70 mt-6 text-sm">
            Soutenez le journalisme de qualité en vous abonnant à notre offre
            premium.
          </p>
          <Button asChild className="mt-6 tracking-wide uppercase">
            <Link href="/subscribe">Découvrir les offres</Link>
          </Button>
        </div>
      </div>

      <p className="text-brand-foreground/60 border-t border-white/10 pt-8 text-center text-xs tracking-wide uppercase">
        &copy; {new Date().getFullYear()} La Voie De L&rsquo;Info. Édition
        Prestige.
      </p>
    </div>
  </footer>
);

export default Footer;
