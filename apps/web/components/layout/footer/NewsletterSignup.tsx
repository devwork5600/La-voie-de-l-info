"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NewsletterSignupProps {
  buttonClassName?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  buttonClassName,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-sm opacity-70">
        Inscrivez-vous pour recevoir les dernières actualités directement dans
        votre boîte mail.
      </p>
      <form className="flex gap-2">
        <Input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background text-foreground max-w-[240px]"
        />
        <Button
          type="submit"
          disabled={loading}
          className={cn(buttonClassName)}
        >
          {loading ? "..." : "S'inscrire"}
        </Button>
      </form>
    </div>
  );
};
