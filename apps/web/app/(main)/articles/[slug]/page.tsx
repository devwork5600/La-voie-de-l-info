import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleActions } from "../components/ArticleActions";

import { getArticleBySlug, getArticles } from "@/actions/categories-actions";
import TrendingArticles from "@/app/(main)/components/TrendingArticles";
import { ArticleCarousel } from "@/components/carousel/ArticleCarousel";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const rootCategorySlug =
    article.category.parent?.slug ?? article.category.slug;

  const [{ articles: recentArticles }, { articles: sameCategoryArticles }] =
    await Promise.all([
      getArticles({ limit: 12 }),
      getArticles({ limit: 9, categorySlug: rootCategorySlug }),
    ]);

  const sideArticles = recentArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 4);

  // Same-category articles come first; when a category is too thin, fill the
  // rest of the carousel with recent articles so it's never empty/sparse.
  const carouselSeen = new Set([article.id]);
  const carouselArticles = [...sameCategoryArticles, ...recentArticles]
    .filter((a) => {
      if (carouselSeen.has(a.id)) return false;
      carouselSeen.add(a.id);
      return true;
    })
    .slice(0, 8);

  const categoryHref = article.category.parent
    ? `/articles?category=${article.category.parent.slug}&subcategory=${article.category.slug}`
    : `/articles?category=${article.category.slug}`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const articleUrl = `${baseUrl}/articles/${article.slug}`;

  return (
    <>
      <div className="mx-auto flex max-w-[1440px] justify-center gap-6 px-4 py-8">
        <main className="w-full max-w-4xl">
          <article>
            <Link
              href={categoryHref}
              className="text-primary text-xs font-semibold tracking-wide uppercase transition hover:underline"
            >
              {article.category.name}
            </Link>

            <h1 className="font-playfair mt-4 text-4xl leading-tight font-bold sm:text-5xl">
              {article.title}
            </h1>

            <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
              <span className="text-foreground font-medium">
                {article.author.name ?? "Rédaction"}
              </span>
              <span>·</span>
              <span>
                {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {article.media && (
              <div className="mt-6">
                <div className="bg-muted relative aspect-video w-full overflow-hidden">
                  {article.media.type === "IMAGE" ? (
                    <Image
                      src={article.media.url}
                      alt={article.media.alt ?? article.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={article.media.url}
                      controls
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className="absolute top-3 right-3 z-10">
                    <ArticleActions
                      articleId={article.id}
                      initialLikes={article.likesCount}
                      initialIsLiked={article.isLiked}
                      title={article.title}
                      url={articleUrl}
                    />
                  </div>
                </div>
                {article.media.legend && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    {article.media.legend}
                  </p>
                )}
              </div>
            )}

            {article.audioUrl && (
              <div className="bg-muted/50 mt-6 space-y-2 p-4">
                <p className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                  <span className="relative flex size-2">
                    <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                    <span className="bg-primary relative inline-flex size-2 rounded-full" />
                  </span>
                  Écouter cet article
                </p>
                <audio controls className="h-10 w-full">
                  <source src={article.audioUrl} type="audio/wav" />
                  Votre navigateur ne supporte pas l&rsquo;élément audio.
                </audio>
              </div>
            )}

            <div className="mt-8 space-y-8">
              {article.parts.map((part) => (
                <div key={part.id} className="space-y-4">
                  {part.title && (
                    <h2 className="font-playfair text-2xl font-bold">
                      {part.title}
                    </h2>
                  )}
                  <div className="text-foreground/90 text-lg leading-relaxed whitespace-pre-wrap">
                    {part.content}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </main>

        <aside className="hidden md:block">
          <div className="sticky top-24 w-[260px] shrink-0">
            <TrendingArticles articles={sideArticles} title="À lire aussi" />
          </div>
        </aside>
      </div>

      <ArticleCarousel
        articles={carouselArticles}
        title={`Plus dans ${article.category.name}`}
        href={categoryHref}
      />
    </>
  );
}
