import AuthorArticlesInfinite from "./components/AuthorArticlesInfinite";
import AuthorStats from "./components/AuthorStats";

import { getUser } from "@/lib/auth/auth-session";

export default async function AuthorPage() {
  const user = await getUser();
  const authorId = user?.id ?? "";

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos articles et suivez vos performances.
        </p>
      </div>

      <AuthorStats />

      <div>
        <h2 className="font-playfair mb-4 text-xl font-bold tracking-tight">
          Articles récents
        </h2>
        <AuthorArticlesInfinite authorId={authorId} limit={6} />
      </div>
    </div>
  );
}
