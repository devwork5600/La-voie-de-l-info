import { notFound, redirect } from "next/navigation";

import {
  getArticleById,
  getRootCategoriesWithChildren,
} from "@/actions/categories-actions";
import ArticleForm from "@/app/author/components/ArticleForm";
import { getUser } from "@/lib/auth/auth-session";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user || (user.role !== "AUTHOR" && user.role !== "ADMIN")) {
    redirect("/login");
  }

  const [article, categories] = await Promise.all([
    getArticleById(id),
    getRootCategoriesWithChildren(),
  ]);

  if (!article) {
    notFound();
  }

  if (article.authorId !== user.id && user.role !== "ADMIN") {
    redirect("/author");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight">
          Modifier l&rsquo;article
        </h1>
        <p className="text-muted-foreground mt-1">
          Modifiez votre contenu et mettez à jour les informations de votre
          article.
        </p>
      </div>

      <ArticleForm
        categories={categories}
        initialData={article}
        articleId={id}
      />
    </div>
  );
}
