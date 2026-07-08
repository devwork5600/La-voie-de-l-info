import { Send } from "lucide-react";
import Link from "next/link";

import { getNewsletterSubscribers } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold tracking-tight">
            Newsletter
          </h1>
          <p className="text-muted-foreground mt-1">
            Liste des utilisateurs inscrits à la newsletter.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/newsletter/publish">
            <Send className="size-4" />
            Publier une newsletter
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-lg">
            Abonnés ({subscribers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Aucun abonné pour le moment.
            </p>
          ) : (
            <div>
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between border-b py-3 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">
                      {subscriber.name || "Sans nom"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {subscriber.email}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {new Date(subscriber.createdAt).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
