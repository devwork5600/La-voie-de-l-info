"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

 
  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-foreground/70">
        Inscrivez-vous pour recevoir les dernières actualités directement dans votre boîte mail.
      </p>
      <form className="flex gap-2">
        <Input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="max-w-[240px] bg-background text-foreground"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "..." : "S'inscrire"}
        </Button>
      </form>
    </div>
  );
};
