import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Shield,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  createCheckoutSession,
  createPortalSession,
} from "@/actions/subscription-actions";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/auth-session";

export const metadata: Metadata = {
  title: "Abonnement",
  description:
    "Accédez en illimité à tous les articles de La Voie De L'Info : sans publicité, avec nos newsletters exclusives et un accès prioritaire à nos nouveaux formats.",
  alternates: { canonical: "/subscribe" },
};

const FEATURES = [
  { icon: BookOpen, label: "Accès illimité à tous les articles" },
  { icon: Bell, label: "Newsletters & alertes en avant-première" },
  { icon: Shield, label: "Expérience sans publicité" },
  { icon: Sparkles, label: "Accès prioritaire aux nouveaux formats" },
];

interface SubscribePageProps {
  searchParams: Promise<{
    subscribed?: string;
    cancelled?: string;
    already_subscribed?: string;
  }>;
}

export default async function SubscribePage({
  searchParams,
}: SubscribePageProps) {
  const { subscribed, cancelled, already_subscribed } = await searchParams;
  const user = await getUser();

  return (
    <main className="flex flex-col items-center px-4 py-16">
      <div className="mb-14 max-w-xl space-y-4 text-center">
        <span className="bg-primary/10 text-primary inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-widest uppercase">
          <Sparkles className="size-3" />
          Abonnement Premium
        </span>
        <h1 className="font-playfair text-4xl leading-tight font-bold tracking-tight md:text-5xl">
          L&rsquo;information sans limites
        </h1>
        <p className="text-muted-foreground text-lg">
          Soutenez un journalisme indépendant et accédez à l&rsquo;intégralité
          de nos contenus.
        </p>
      </div>

      {subscribed === "1" && (
        <div className="mb-8 flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-5 shrink-0" />
          Bienvenue&nbsp;! Votre abonnement est actif. Bonne lecture.
        </div>
      )}
      {cancelled === "1" && (
        <div className="mb-8 flex items-center gap-3 border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-medium text-amber-600 dark:text-amber-400">
          Paiement annulé. Vous pouvez réessayer à tout moment.
        </div>
      )}
      {already_subscribed === "1" && (
        <div className="border-primary/30 bg-primary/10 text-primary mb-8 flex items-center gap-3 border px-5 py-3 text-sm font-medium">
          <CheckCircle2 className="size-5 shrink-0" />
          Vous êtes déjà abonné — profitez de votre accès illimité&nbsp;!
        </div>
      )}

      <div className="border-border bg-card w-full max-w-md border">
        <div className="bg-primary text-primary-foreground px-8 pt-8 pb-10">
          <p className="mb-2 text-sm font-semibold tracking-widest uppercase opacity-80">
            Premium
          </p>
          <div className="flex items-end gap-2">
            <span className="font-playfair text-5xl leading-none font-bold">
              2&nbsp;€
            </span>
            <span className="mb-1 text-base opacity-75">/ mois</span>
          </div>
          <p className="mt-2 text-sm opacity-75">
            Annulable à tout moment, sans engagement
          </p>
        </div>

        <div className="space-y-4 px-8 py-8">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-6 shrink-0 items-center justify-center">
                <Icon className="text-primary size-3.5" />
              </div>
              <span className="text-foreground text-sm">{label}</span>
            </div>
          ))}
        </div>

        <div className="px-8 pb-8">
          {user?.isSubscribed ? (
            <form action={createPortalSession}>
              <Button
                type="submit"
                variant="outline"
                className="h-12 w-full text-base font-semibold"
              >
                Gérer mon abonnement
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </form>
          ) : user ? (
            <form action={createCheckoutSession}>
              <Button
                type="submit"
                className="h-12 w-full text-base font-semibold"
              >
                S&rsquo;abonner maintenant
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </form>
          ) : (
            <Button asChild className="h-12 w-full text-base font-semibold">
              <Link href="/login">
                Se connecter pour s&rsquo;abonner
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          )}

          <p className="text-muted-foreground mt-4 text-center text-xs">
            Paiement sécurisé par{" "}
            <span className="text-foreground font-semibold">Stripe</span> ·
            Résiliable en 1 clic
          </p>
        </div>
      </div>

      <p className="text-muted-foreground mt-10 max-w-xs text-center text-sm">
        Sans abonnement, vous accédez à{" "}
        <strong className="text-foreground">
          5 articles gratuits par jour
        </strong>
        .
      </p>
    </main>
  );
}
