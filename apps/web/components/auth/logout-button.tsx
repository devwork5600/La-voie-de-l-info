"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { signOut } from "@/lib/auth/auth-client";

export const LogoutButton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const router = useRouter();

  const handleSignout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          sessionStorage.removeItem("redirect-modal");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignout}
      className={className ?? "flex cursor-pointer items-center"}
    >
      <LogOutIcon className="mr-2 size-4" />
      Déconnexion
    </button>
  );
};
