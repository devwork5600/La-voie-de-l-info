import { Lock } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

const ArticlePaywall: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  return (
    <div className="border-primary/30 bg-muted/30 mt-8 rounded-lg border p-8 text-center sm:p-12">
      <div className="bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-full">
        <Lock className="text-primary size-5" />
      </div>

      <h2 className="font-playfair mt-4 text-2xl font-bold">
        Limite de lecture atteinte
      </h2>

      <p className="text-muted-foreground mx-auto mt-2 max-w-md">
        Vous avez atteint votre limite de 5 articles gratuits aujourd&rsquo;hui.{" "}
        {isLoggedIn
          ? "Abonnez-vous pour un accès illimité à tous nos contenus."
          : "Connectez-vous ou abonnez-vous pour continuer votre lecture."}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {!isLoggedIn && (
          <Button variant="outline" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
        )}
        <Button asChild>
          <Link href="/subscribe">Découvrir nos offres</Link>
        </Button>
      </div>
    </div>
  );
};

export default ArticlePaywall;
