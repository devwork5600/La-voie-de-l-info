"use client";

import { PenTool, Globe, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth/auth-client";
import { useWriterModalStore } from "@/store/useWriterModalStore";

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
      <DialogContent
        className="z-[100] gap-6 rounded-2xl p-6 sm:max-w-[425px]"
        showCloseButton={false}
      >
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Sélectionnez votre espace
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            {isAdmin
              ? "Vous êtes connecté en tant qu'administrateur. Souhaitez-vous accéder au panneau d'administration ou continuer sur le site public ?"
              : "Vous êtes connecté en tant que rédacteur. Souhaitez-vous accéder à l'espace de rédaction pour écrire des articles ou continuer sur le site public ?"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
          <Button
            variant="outline"
            className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 border-2 transition-all hover:border-zinc-900 hover:bg-zinc-50 dark:hover:border-zinc-50 dark:hover:bg-zinc-900"
            onClick={handleGoToMain}
          >
            <Globe className="h-6 w-6 text-zinc-500" />
            <span className="text-sm font-semibold">Site public</span>
          </Button>

          <Button
            className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 transition-all hover:opacity-95"
            onClick={handleGoToPortal}
          >
            {isAdmin ? (
              <ShieldCheck className="h-6 w-6 text-zinc-100" />
            ) : (
              <PenTool className="h-6 w-6 text-zinc-100" />
            )}
            <span className="text-sm font-semibold">
              {isAdmin ? "Espace Admin" : "Espace Rédacteur"}
            </span>
          </Button>
        </div>

        <DialogFooter className="bg-muted/40 -mx-6 -mb-6 rounded-b-xl border-t p-4 sm:justify-center">
          <p className="text-muted-foreground w-full text-center text-[11px]">
            Vous pouvez changer d&apos;espace à tout moment depuis votre profil.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
