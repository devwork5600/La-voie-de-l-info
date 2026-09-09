"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

import { promoteToAuthor } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";

export interface AdminUserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "USER" | "AUTHOR" | "ADMIN";
  isSubscribed: boolean;
  createdAt: Date;
}

const ROLE_LABELS: Record<AdminUserData["role"], string> = {
  USER: "Utilisateur",
  AUTHOR: "Auteur",
  ADMIN: "Administrateur",
};

const UserRow: React.FC<{ user: AdminUserData }> = ({ user }) => {
  const queryClient = useQueryClient();

  const { mutate: promote, isPending } = useMutation({
    mutationFn: () => promoteToAuthor(user.id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Une erreur est survenue");
        return;
      }
      toast.success(`${user.name ?? user.email} est désormais auteur`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Erreur de connexion au serveur");
    },
  });

  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b py-4 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-full">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name ?? user.email}
              fill
              sizes="40px"
              className="object-cover"
            />
          )}
        </div>
        <div>
          <p className="font-medium">{user.name ?? "Sans nom"}</p>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <span className="text-muted-foreground text-xs tracking-wide uppercase">
          {ROLE_LABELS[user.role]}
        </span>

        <span
          className={
            user.isSubscribed
              ? "bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-semibold"
              : "bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-semibold"
          }
        >
          {user.isSubscribed ? "Abonné" : "Inscrit"}
        </span>

        {user.role === "USER" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => promote()}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <UserPlus className="size-3.5" />
            )}
            Promouvoir en auteur
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserRow;
