import AdminArticlesInfinite from "./components/AdminArticlesInfinite";

import { getArticleAuthors } from "@/actions/admin-actions";
import { getRootCategoriesWithChildren } from "@/actions/categories-actions";

export default async function AdminArticlesPage() {
  const [categories, authors] = await Promise.all([
    getRootCategoriesWithChildren(),
    getArticleAuthors(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight">
          Articles
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez l&rsquo;ensemble des articles publiés sur le site.
        </p>
      </div>

      <AdminArticlesInfinite categories={categories} authors={authors} />
    </div>
  );
}
