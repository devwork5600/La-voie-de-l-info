import { z } from "zod";

export const CreateArticleSchema = z.object({
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),

  categoryId: z.uuid("Catégorie principale invalide"),

  subCategoryId: z.uuid("Sous-catégorie invalide").optional().or(z.literal("")),

  media: z.object({
    type: z.enum(["IMAGE", "VIDEO"]),
    url: z.url("URL du média invalide"),
    thumbnailUrl: z.url("URL de miniature invalide"),
    alt: z.string().min(1, "Le texte alternatif est requis"),
    legend: z.string().min(1, "La légende est requise"),
  }),

  parts: z
    .array(
      z.object({
        title: z.string().optional(),
        content: z.string().min(1, "Le contenu ne peut pas être vide"),
      })
    )
    .min(1, "L'article doit avoir au moins une partie"),
});

export type CreateArticleSchemaType = z.infer<typeof CreateArticleSchema>;
