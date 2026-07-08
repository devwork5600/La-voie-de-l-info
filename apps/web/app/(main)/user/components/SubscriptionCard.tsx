"use client";

import { Loader2, ShieldCheck, ShieldX } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

import { cancelMySubscription } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface SubscriptionCardProps {
  isSubscribed: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  isSubscribed,
  cancelAtPeriodEnd: initialCancelAtPeriodEnd,
  currentPeriodEnd: initialCurrentPeriodEnd,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(
    initialCancelAtPeriodEnd
  );
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState(
    initialCurrentPeriodEnd
  );

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelMySubscription();
      if (result.success) {
        setCancelAtPeriodEnd(true);
        if (result.currentPeriodEnd) {
          setCurrentPeriodEnd(new Date(result.currentPeriodEnd));
        }
        toast.success(
          "Votre abonnement est programmé pour se terminer à la fin de la période en cours."
        );
        setConfirmOpen(false);
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-lg">Abonnement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSubscribed ? (
            <>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary size-5" />
                <span className="font-medium">Abonnement actif</span>
              </div>

              {cancelAtPeriodEnd ? (
                <p className="text-muted-foreground text-sm">
                  Votre abonnement a été annulé et ne sera pas renouvelé. Vous
                  conservez un accès illimité aux articles
                  {currentPeriodEnd ? (
                    <> jusqu&rsquo;au {formatDate(currentPeriodEnd)}</>
                  ) : null}
                  .
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground text-sm">
                    {currentPeriodEnd ? (
                      <>
                        Prochain renouvellement le{" "}
                        {formatDate(currentPeriodEnd)}.
                      </>
                    ) : (
                      "Votre abonnement se renouvelle automatiquement."
                    )}
                  </p>
                  <Button
                    variant="outline"
                    className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Annuler l&rsquo;abonnement
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="text-muted-foreground flex items-center gap-2">
                <ShieldX className="size-5" />
                <span className="font-medium">Aucun abonnement actif</span>
              </div>
              <Button asChild>
                <Link href="/subscribe">S&rsquo;abonner</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => !isCancelling && setConfirmOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler votre abonnement ?</DialogTitle>
            <DialogDescription>
              Vous ne serez plus facturé à la prochaine échéance, mais vous
              conserverez l&rsquo;accès illimité aux articles jusqu&rsquo;à la
              fin de la période déjà payée.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isCancelling}
            >
              Garder mon abonnement
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
            >
              {isCancelling && <Loader2 className="size-4 animate-spin" />}
              Confirmer l&rsquo;annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionCard;
