"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWriterModalStore } from "@/store/useWriterModalStore";
import { PenTool, Globe, ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";

export const WriterRedirectModal: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { isOpen, closeModal } = useWriterModalStore();

  const userRole = session?.user?.role;
  const isAdmin = userRole === "ADMIN";

  const handleGoToPortal = () => {
    closeModal();
    router.push(isAdmin ? "/admin" : "/author");
  };

  const handleGoToMain = () => {
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-2xl gap-6 z-[100]" showCloseButton={false}>
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Sélectionnez votre espace
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            {isAdmin 
              ? "Vous êtes connecté en tant qu'administrateur. Souhaitez-vous accéder au panneau d'administration ou continuer sur le site public ?"
              : "Vous êtes connecté en tant que rédacteur. Souhaitez-vous accéder à l'espace de rédaction pour écrire des articles ou continuer sur le site public ?"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-28 gap-2 border-2 hover:border-zinc-900 dark:hover:border-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer"
            onClick={handleGoToMain}
          >
            <Globe className="h-6 w-6 text-zinc-500" />
            <span className="font-semibold text-sm">Site public</span>
          </Button>

          <Button
            className="flex flex-col items-center justify-center h-28 gap-2 hover:opacity-95 transition-all cursor-pointer"
            onClick={handleGoToPortal}
          >
            {isAdmin ? (
              <ShieldCheck className="h-6 w-6 text-zinc-100" />
            ) : (
              <PenTool className="h-6 w-6 text-zinc-100" />
            )}
            <span className="font-semibold text-sm">
              {isAdmin ? "Espace Admin" : "Espace Rédacteur"}
            </span>
          </Button>
        </div>

        <DialogFooter className="sm:justify-center -mx-6 -mb-6 p-4 bg-muted/40 border-t rounded-b-xl">
          <p className="text-[11px] text-muted-foreground text-center w-full">
            Vous pouvez changer d&apos;espace à tout moment depuis votre profil.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
