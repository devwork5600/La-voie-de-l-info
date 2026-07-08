import { z } from "zod";

export const ContactMessageSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  email: z.email("Adresse e-mail invalide"),
  subject: z.string().min(3, "Le sujet doit faire au moins 3 caractères"),
  message: z.string().min(10, "Le message doit faire au moins 10 caractères"),
});

export type ContactMessageSchemaType = z.infer<typeof ContactMessageSchema>;
