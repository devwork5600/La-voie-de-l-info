"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@lvdi/database";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { toast } from "sonner";

import MediaUpload from "../create-article/components/MediaUpload";

import { createArticle, updateArticle } from "@/actions/author-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateArticleSchema,
  CreateArticleSchemaType,
} from "@/validations/article-schemas";

interface Category {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

type ArticleInitialData = Prisma.ArticleGetPayload<{
  include: {
    category: { select: { parentId: true } };
    media: true;
    parts: { select: { title: true; content: true } };
  };
}>;

interface ArticleFormProps {
  categories: Category[];
  initialData?: ArticleInitialData;
  articleId?: string;
}

export default function ArticleForm({
  categories,
  initialData,
  articleId,
}: ArticleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateArticleSchemaType>({
    resolver: zodResolver(CreateArticleSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          categoryId: initialData.category?.parentId || initialData.categoryId,
          subCategoryId: initialData.category?.parentId
            ? initialData.categoryId
            : "",

          media: {
            url: initialData.media?.url || "",
            thumbnailUrl: initialData.media?.thumbnailUrl || "",
            type: initialData.media?.type || "IMAGE",
            alt: initialData.media?.alt || "",
            legend: initialData.media?.legend || "",
          },

          parts: initialData.parts?.map((p) => ({
            title: p.title || "",
            content: p.content,
          })) || [{ title: "", content: "" }],
        }
      : {
          title: "",
          categoryId: "",
          subCategoryId: "",

          media: {
            url: "",
            thumbnailUrl: "",
            type: "IMAGE",
            alt: "",
            legend: "",
          },

          parts: [{ title: "", content: "" }],
        },
  });

  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  });

  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue("subCategoryId", "");
  }, [selectedCategoryId, setValue]);

  const onSubmit = async (data: CreateArticleSchemaType) => {
    setIsSubmitting(true);

    try {
      const result = articleId
        ? await updateArticle(articleId, data)
        : await createArticle(data);

      if (result.success) {
        toast.success(
          articleId ? "Article mis à jour !" : "Article créé avec succès !"
        );

        router.push("/author/articles");
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* GENERAL INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Titre</FieldLabel>
            <Input {...register("title")} />
            <FieldError errors={[errors.title]} />
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Catégorie principale</FieldLabel>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={(val) =>
                      field.onChange(val === "none" ? "" : val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.categoryId]} />
            </Field>

            <Field>
              <FieldLabel>Sous-catégorie</FieldLabel>
              <Controller
                control={control}
                name="subCategoryId"
                render={({ field }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={(val) =>
                      field.onChange(val === "none" ? "" : val)
                    }
                    disabled={!selectedCategory?.children?.length}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      {selectedCategory?.children?.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {child.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.subCategoryId]} />
            </Field>
          </div>

          {/* MEDIA UPLOAD */}
          <Field>
            <FieldLabel>Média (image ou vidéo)</FieldLabel>

            <Controller
              control={control}
              name="media"
              render={({ field }) => (
                <MediaUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />

            <FieldError errors={[errors.media?.url]} />
          </Field>

          {/* ALT + LEGEND */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Texte alternatif</FieldLabel>
              <Input {...register("media.alt")} />
              <FieldError errors={[errors.media?.alt]} />
            </Field>

            <Field>
              <FieldLabel>Légende</FieldLabel>
              <Input {...register("media.legend")} />
              <FieldError errors={[errors.media?.legend]} />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* CONTENT PARTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Contenu de l&apos;article</h3>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ title: "", content: "" })}
          >
            <Plus className="h-4 w-4" />
            Ajouter une partie
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-base">Partie {index + 1}</CardTitle>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Sous-titre</FieldLabel>
                <Input {...register(`parts.${index}.title` as const)} />
              </Field>

              <Field>
                <FieldLabel>Contenu</FieldLabel>
                <Textarea
                  {...register(`parts.${index}.content` as const)}
                  className="min-h-[200px]"
                />
                <FieldError errors={[errors.parts?.[index]?.content]} />
              </Field>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Annuler
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {articleId ? "Mettre à jour" : "Publier"}
        </Button>
      </div>
    </form>
  );
}
