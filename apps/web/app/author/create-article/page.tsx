import { redirect } from "next/navigation";

import ArticleForm from "../components/ArticleForm";

import { getRootCategoriesWithChildren } from "@/actions/categories-actions";
import { getUser } from "@/lib/auth/auth-session";

export default async function CreateArticlePage() {
  const user = await getUser();

  // Protect the route
  if (!user || user.role !== "AUTHOR") {
    redirect("/login");
  }

  const categories = await getRootCategoriesWithChildren();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nouvel article</h2>
        <p className="text-muted-foreground">
          Partagez vos connaissances et vos actualités avec la communauté.
        </p>
      </div>

      <ArticleForm categories={categories} />
    </div>
  );
}
