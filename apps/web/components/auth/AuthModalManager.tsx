"use client";

import { useEffect } from "react";

import { useSession } from "@/lib/auth/auth-client";
import { useWriterModalStore } from "@/store/useWriterModalStore";

export const AuthModalManager = () => {
  const { data: session, isPending, error } = useSession();
  const { openModal } = useWriterModalStore();

  useEffect(() => {
    if (isPending || !session) return;

    const role = session.user.role;

    if (role === "AUTHOR" || role === "ADMIN") {
      const hasSeenModal = sessionStorage.getItem("redirect-modal");

      if (!hasSeenModal) {
        openModal();
        sessionStorage.setItem("redirect-modal", "true");
      }
    }
  }, [session, isPending, openModal]);

  useEffect(() => {
    if (error) {
      console.error("AuthModalManager: Session error:", error);
    }
  }, [error]);

  return null;
};
