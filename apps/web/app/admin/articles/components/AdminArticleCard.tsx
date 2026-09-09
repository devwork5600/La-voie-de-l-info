"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

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

export interface AdminArticleCardData {
  id: string;
  title: string;
  category: { name: string };
  author: { name: string | null };
  media: { url: string; alt: string | null; legend: string | null } | null;
}

const AdminArticleCard: React.FC<{ article: AdminArticleCardData }> = ({
  article,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: removeArticle, isPending } = useMutation({
    mutationFn: () => deleteArticle(article.id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Une erreur est survenue");
        return;
      }
      toast.success("Article supprimé");
      setConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["adminOverviewStats"] });
    },
    onError: () => {
      toast.error("Erreur de connexion au serveur");
    },
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
              {article.author.name ?? "Rédaction"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex items-center justify-between gap-2 border-t pt-4 pb-4">
          <p className="text-muted-foreground line-clamp-1 flex-1 text-sm">
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
              aria-label="Supprimer l'article"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&rsquo;article ?</DialogTitle>
            <DialogDescription>
              &laquo;&nbsp;{article.title}&nbsp;&raquo; sera définitivement
              supprimé. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeArticle()}
              disabled={isPending}
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminArticleCard;
