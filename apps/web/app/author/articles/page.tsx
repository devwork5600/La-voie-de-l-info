import AuthorArticlesInfinite from "../components/AuthorArticlesInfinite";

import { getUser } from "@/lib/auth/auth-session";

export default async function AuthorArticlesPage() {
  const user = await getUser();
  const authorId = user?.id ?? "";

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight">
          Mes articles
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez et suivez vos articles publiés.
        </p>
      </div>

      <AuthorArticlesInfinite authorId={authorId} limit={12} />
    </div>
  );
}
