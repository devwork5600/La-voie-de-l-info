"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { useWriterModalStore } from "@/store/useWriterModalStore";

export const AuthModalManager = () => {
  const { data: session, isPending, error } = useSession();
  const { openModal } = useWriterModalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isPending || !session) return;

    // Explicitly log the session to see if role is present
    console.log("AuthModalManager: Full Session data:", session);

    const user = session.user as any;
    const role = user?.role;

    console.log("AuthModalManager: User role:", role);

    if (role === "AUTHOR" || role === "ADMIN") {
      const hasSeenModal = sessionStorage.getItem("redirect-modal");
      console.log("AuthModalManager: hasSeenModal:", hasSeenModal);

      if (!hasSeenModal) {
        console.log("AuthModalManager: Opening Modal...");
        openModal();
        sessionStorage.setItem("redirect-modal", "true");
      }
    }
  }, [session, isPending, openModal, mounted]);

  if (error) {
    console.error("AuthModalManager: Session error:", error);
  }

  return null;
};
