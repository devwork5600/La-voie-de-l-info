"use client";

import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { sendNewsletter } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NewsletterPublishForm() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSend = async () => {
    setIsSending(true);
    try {
      const result = await sendNewsletter(subject, content);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/newsletter");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSending(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-playfair text-lg">
            Rédiger une newsletter
          </CardTitle>
          <CardDescription>
            Le message sera envoyé à tous les utilisateurs ayant accepté de
            recevoir la newsletter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field>
              <FieldLabel>Sujet de l&rsquo;e-mail</FieldLabel>
              <Input
                placeholder="Ex: Les actualités de la semaine"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Contenu du message</FieldLabel>
              <Textarea
                placeholder="Écrivez votre message ici..."
                className="min-h-[300px] resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <p className="text-muted-foreground text-xs">
                Le contenu sera envoyé tel quel. Évitez le HTML brut pour le
                moment.
              </p>
            </Field>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button type="submit">
                <Send className="size-4" />
                Envoyer la newsletter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => !isSending && setConfirmOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer cette newsletter ?</DialogTitle>
            <DialogDescription>
              &laquo;&nbsp;{subject}&nbsp;&raquo; sera envoyé à tous les abonnés
              à la newsletter. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isSending}
            >
              Annuler
            </Button>
            <Button onClick={handleConfirmSend} disabled={isSending}>
              {isSending && <Loader2 className="size-4 animate-spin" />}
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
