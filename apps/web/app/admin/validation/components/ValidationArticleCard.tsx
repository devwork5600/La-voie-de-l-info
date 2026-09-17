"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

import { publishArticle } from "@/actions/admin-actions";
import { deleteArticle } from "@/actions/author-actions";
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
import { getMediaThumbnail } from "@/lib/media";

export interface ValidationArticleCardData {
  id: string;
  title: string;
  category: { name: string };
  author: { name: string | null; email: string };
  media: { url: string; alt: string | null; legend: string | null } | null;
  parts: { content: string }[];
}

const ValidationArticleCard: React.FC<{
  article: ValidationArticleCardData;
}> = ({ article }) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const queryClient = useQueryClient();

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ["unpublished-articles"] });
    queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    queryClient.invalidateQueries({ queryKey: ["adminOverviewStats"] });
  };

  const { mutate: removeArticle, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteArticle(article.id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Une erreur est survenue");
        return;
      }
      toast.success("Brouillon supprimé");
      setConfirmDeleteOpen(false);
      invalidateLists();
    },
    onError: () => toast.error("Erreur de connexion au serveur"),
  });

  const { mutate: confirmPublish, isPending: isPublishing } = useMutation({
    mutationFn: () => publishArticle(article.id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Une erreur est survenue");
        return;
      }
      toast.success("Article publié");
      setConfirmPublishOpen(false);
      invalidateLists();
    },
    onError: () => toast.error("Erreur de connexion au serveur"),
  });

  return (
    <>
      <Card className="overflow-hidden py-0">
        <Link
          href={`/author/articles/${article.id}/edit`}
          className="relative block aspect-video w-full transition-opacity hover:opacity-90"
        >
          <Image
            src={getMediaThumbnail(article.media?.url)}
            alt={article.media?.alt || article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </Link>

        <CardHeader className="pt-4">
          <Link
            href={`/author/articles/${article.id}/edit`}
            className="hover:underline"
          >
            <CardTitle className="font-playfair truncate text-lg">
              {article.title}
            </CardTitle>
          </Link>
          <div className="flex items-center justify-between">
            <p className="text-primary text-xs font-semibold tracking-wide uppercase">
              {article.category.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {article.author.name ?? article.author.email}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 border-t pt-4 pb-4">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {article.parts[0]?.content}
          </p>

          <div className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground line-clamp-1 flex-1 text-xs">
              {article.media?.legend}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/author/articles/${article.id}/edit`}>
                  <Pencil className="size-3.5" />
                  Modifier
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Supprimer le brouillon"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => setConfirmPublishOpen(true)}
          >
            <CheckCircle2 className="size-4" />
            Valider et publier
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le brouillon ?</DialogTitle>
            <DialogDescription>
              &laquo;&nbsp;{article.title}&nbsp;&raquo; sera définitivement
              supprimé. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeArticle()}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmPublishOpen} onOpenChange={setConfirmPublishOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publier cet article ?</DialogTitle>
            <DialogDescription>
              &laquo;&nbsp;{article.title}&nbsp;&raquo; deviendra immédiatement
              visible sur le site public. Relis bien le contenu avant de
              confirmer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmPublishOpen(false)}
              disabled={isPublishing}
            >
              Annuler
            </Button>
            <Button onClick={() => confirmPublish()} disabled={isPublishing}>
              {isPublishing && <Loader2 className="size-4 animate-spin" />}
              Publier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ValidationArticleCard;
