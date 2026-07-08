import Image from "next/image";

import DeleteAccountCard from "./components/DeleteAccountCard";
import LikedArticlesInfinite from "./components/LikedArticlesInfinite";
import SubscriptionCard from "./components/SubscriptionCard";

import { getMyAccount } from "@/actions/user-actions";
import { Card, CardContent } from "@/components/ui/card";

const ROLE_LABELS: Record<string, string> = {
  USER: "Utilisateur",
  AUTHOR: "Auteur",
  ADMIN: "Administrateur",
};

export default async function UserPage() {
  const account = await getMyAccount();

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-8">
      <div>
        <h1 className="font-playfair text-4xl font-bold tracking-tight">
          Mon compte
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations, votre abonnement et vos articles favoris.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-full">
            {account.image && (
              <Image
                src={account.image}
                alt={account.name ?? account.email}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-playfair text-xl font-bold">
              {account.name ?? "Sans nom"}
            </p>
            <p className="text-muted-foreground text-sm">{account.email}</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 font-semibold">
                {ROLE_LABELS[account.role] ?? account.role}
              </span>
              <span className="text-muted-foreground">
                Membre depuis{" "}
                {new Date(account.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubscriptionCard
        isSubscribed={account.isSubscribed}
        cancelAtPeriodEnd={account.cancelAtPeriodEnd}
        currentPeriodEnd={account.currentPeriodEnd}
      />

      <div>
        <h2 className="font-playfair mb-4 text-xl font-bold tracking-tight">
          Articles aimés
        </h2>
        <LikedArticlesInfinite />
      </div>

      <DeleteAccountCard />
    </div>
  );
}
