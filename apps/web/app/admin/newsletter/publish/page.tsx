import { NewsletterPublishForm } from "../components/NewsletterPublishForm";

export default function AdminNewsletterPublishPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight">
          Publier une newsletter
        </h1>
        <p className="text-muted-foreground mt-1">
          Envoyez un message à tous vos abonnés.
        </p>
      </div>

      <NewsletterPublishForm />
    </div>
  );
}
