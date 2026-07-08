"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { sendContactMessage } from "@/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ContactMessageSchema,
  ContactMessageSchemaType,
} from "@/validations/contact-schemas";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMessageSchemaType>({
    resolver: zodResolver(ContactMessageSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactMessageSchemaType) => {
    setIsSubmitting(true);
    try {
      const result = await sendContactMessage(data);
      if (result.success) {
        toast.success("Votre message a bien été envoyé.");
        setIsSent(true);
        reset();
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="border-primary/30 bg-primary/5 rounded-lg border p-6 text-center">
        <p className="font-playfair text-lg font-bold">Message envoyé</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Merci de nous avoir contactés, nous vous répondrons dans les meilleurs
          délais.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setIsSent(false)}
        >
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Nom</FieldLabel>
          <Input {...register("name")} placeholder="Votre nom" />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel>E-mail</FieldLabel>
          <Input
            {...register("email")}
            type="email"
            placeholder="vous@exemple.com"
          />
          <FieldError errors={[errors.email]} />
        </Field>
      </div>

      <Field>
        <FieldLabel>Sujet</FieldLabel>
        <Input {...register("subject")} placeholder="Objet de votre message" />
        <FieldError errors={[errors.subject]} />
      </Field>

      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea
          {...register("message")}
          className="min-h-[160px]"
          placeholder="Votre message..."
        />
        <FieldError errors={[errors.message]} />
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        Envoyer le message
      </Button>
    </form>
  );
}
