import Link from "next/link";

import LegalSection from "@/components/legal/LegalSection";

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <div>
        <h1 className="font-playfair text-4xl font-bold tracking-tight sm:text-5xl">
          Mentions légales
        </h1>
        <p className="text-muted-foreground mt-4">
          Dernière mise à jour : janvier 2026.
        </p>
      </div>

      <LegalSection title="Éditeur du site">
        <p>
          Le site La Voie De L&rsquo;Info est édité par La Voie de l&rsquo;Info
          SAS, société fictive à des fins de démonstration, au capital de 10 000
          €, immatriculée au Registre du Commerce et des Sociétés de Paris.
        </p>
        <p>
          Siège social : 12 rue de la Presse, 75002 Paris, France.
          <br />
          Directeur de la publication : la Rédaction.
          <br />
          Contact :{" "}
          <Link href="/contact" className="text-primary hover:underline">
            formulaire de contact
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Ce site est hébergé par Vercel Inc. Les données sont stockées sur une
          base de données PostgreSQL gérée par un fournisseur cloud tiers.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&rsquo;ensemble des contenus présents sur ce site (textes, images,
          logos, mise en page) est protégé par le droit d&rsquo;auteur. Toute
          reproduction, représentation ou diffusion, totale ou partielle, sans
          autorisation préalable, est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          La Voie De L&rsquo;Info s&rsquo;efforce d&rsquo;assurer
          l&rsquo;exactitude des informations publiées, mais ne peut garantir
          l&rsquo;absence d&rsquo;erreurs ou d&rsquo;omissions.
          L&rsquo;utilisation des informations du site se fait sous la seule
          responsabilité de l&rsquo;utilisateur.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative à ces mentions légales, vous pouvez nous
          contacter via notre{" "}
          <Link href="/contact" className="text-primary hover:underline">
            page de contact
          </Link>
          .
        </p>
      </LegalSection>
    </div>
  );
}
