"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import {
  MagicLinkSignInSchema,
  MagicLinkSignInSchemaType,
} from "@/validations/email-schemas";

const LoginPage = () => {
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<MagicLinkSignInSchemaType>({
    resolver: zodResolver(MagicLinkSignInSchema),
    defaultValues: { email: "" },
  });

  const authLoading = isSubmitting || socialLoading !== null;

  const onSubmit = async (values: MagicLinkSignInSchemaType) => {
    await authClient.signIn.magicLink(
      { email: values.email },
      {
        onSuccess: () => {
          toast.success("Un lien magique a été envoyé à votre adresse email.");
        },
        onError: (ctx) => {
          setError("email", {
            message: ctx.error?.message || "Échec de l&rsquo;envoi du lien.",
          });
        },
      }
    );
  };

  const handleProviderSignIn = async (provider: "google" | "github") => {
    try {
      setSocialLoading(provider);
      await authClient.signIn.social({ provider });
    } catch {
      setSocialLoading(null);
      toast.error("Impossible de se connecter.");
    }
  };

  return (
    <div className="min-h-[80vh] w-full max-w-md">
      <div className="border-border bg-card border p-10">
        <h1 className="font-playfair text-3xl font-bold">Bon retour</h1>
        <p className="text-muted-foreground mt-2">
          Accédez à votre espace abonné.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-52 space-y-6"
          noValidate
        >
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="text-xs font-semibold tracking-wide uppercase"
                >
                  Adresse email
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="nom@exemple.com"
                  disabled={authLoading}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={authLoading}
            className="w-full tracking-wide uppercase"
          >
            {isSubmitting ? "Envoi en cours..." : "Recevoir le lien magique"}
          </Button>

          <div className="text-muted-foreground flex items-center gap-3 text-xs tracking-wide uppercase">
            <div className="bg-border h-px flex-1" />
            Ou continuer avec
            <div className="bg-border h-px flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleProviderSignIn("google")}
              disabled={authLoading}
              className="flex items-center gap-2"
            >
              <FcGoogle size={18} />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleProviderSignIn("github")}
              disabled={authLoading}
              className="flex items-center gap-2"
            >
              <FaGithub size={18} />
              GitHub
            </Button>
          </div>

          {errors.root && (
            <p className="text-destructive text-center text-sm">
              {errors.root.message}
            </p>
          )}
        </form>
      </div>

      <p className="text-muted-foreground mt-10 text-center font-serif text-lg italic">
        « Le journalisme, c&rsquo;est raconter aux gens ce qu&rsquo;ils ne
        veulent pas entendre. »
      </p>
      <p className="text-muted-foreground mt-2 text-center text-xs tracking-wide uppercase">
        — George Orwell
      </p>
    </div>
  );
};

export default LoginPage;
