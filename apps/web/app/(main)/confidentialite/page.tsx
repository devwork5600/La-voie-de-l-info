import Link from "next/link";

import LegalSection from "@/components/legal/LegalSection";

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-16">
      <div>
        <h1 className="font-playfair text-4xl font-bold tracking-tight sm:text-5xl">
          Politique de confidentialité
        </h1>
        <p className="text-muted-foreground mt-4">
          Dernière mise à jour : janvier 2026.
        </p>
      </div>

      <LegalSection title="Données collectées">
        <p>
          Lorsque vous créez un compte ou utilisez le site, nous collectons :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Votre nom, adresse e-mail et photo de profil (via connexion par lien
            magique ou Google/GitHub)
          </li>
          <li>Vos articles aimés et vos préférences de newsletter</li>
          <li>
            Des données d&rsquo;usage anonymisées (pages consultées) pour nos
            statistiques internes
          </li>
        </ul>
        <p>
          Les informations de paiement (carte bancaire) sont traitées
          directement par Stripe et ne transitent jamais par nos serveurs.
        </p>
      </LegalSection>

      <LegalSection title="Utilisation des données">
        <p>
          Ces données nous permettent de vous authentifier, de gérer votre
          abonnement, de vous envoyer notre newsletter si vous y avez souscrit,
          et d&rsquo;améliorer notre contenu éditorial.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Nous utilisons des cookies strictement nécessaires au fonctionnement
          du site : maintien de votre session de connexion et mémorisation de
          votre préférence d&rsquo;affichage (thème clair/sombre). Aucun cookie
          publicitaire ou de traçage tiers n&rsquo;est utilisé.
        </p>
      </LegalSection>

      <LegalSection title="Partage avec des tiers">
        <p>
          Certaines données sont partagées avec des prestataires nécessaires au
          service :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Stripe, pour le traitement des paiements et abonnements</li>
          <li>
            Resend, pour l&rsquo;envoi de nos e-mails (connexion, newsletter)
          </li>
          <li>
            Google / GitHub, si vous choisissez de vous connecter via ces
            services
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément à la réglementation en vigueur, vous disposez d&rsquo;un
          droit d&rsquo;accès, de rectification et de suppression de vos
          données. Vous pouvez à tout moment supprimer définitivement votre
          compte et l&rsquo;ensemble de vos données associées depuis votre{" "}
          <Link href="/user" className="text-primary hover:underline">
            espace personnel
          </Link>
          , ou nous contacter via notre{" "}
          <Link href="/contact" className="text-primary hover:underline">
            page de contact
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Conservation des données">
        <p>
          Vos données sont conservées pendant toute la durée de vie de votre
          compte. En cas de suppression de compte, elles sont supprimées
          immédiatement de nos bases de données, à l&rsquo;exception des données
          que nous sommes légalement tenus de conserver.
        </p>
      </LegalSection>
    </div>
  );
}
