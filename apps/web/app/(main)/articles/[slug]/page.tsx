import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleActions } from "../components/ArticleActions";
import ArticlePaywall from "../components/ArticlePaywall";

import { getArticleBySlug, getArticles } from "@/actions/categories-actions";
import {
  checkAndRecordUserVisit,
  checkAndRecordVisitorVisit,
} from "@/actions/visitor-actions";
import TrendingArticles from "@/app/(main)/components/TrendingArticles";
import { ArticleCarousel } from "@/components/carousel/ArticleCarousel";
import { getUser } from "@/lib/auth/auth-session";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function buildExcerpt(text: string, maxLength = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article introuvable" };
  }

  const description = buildExcerpt(article.parts[0]?.content ?? article.title);
  const imageUrl = article.media?.url;
  const url = `${baseUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: article.author.name ? [article.author.name] : undefined,
      section: article.category.name,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const user = await getUser();
  const hasFullAccess =
    !!user &&
    (user.isSubscribed || user.role === "AUTHOR" || user.role === "ADMIN");

  let isRestricted = false;
  let remainingReads: number | null = null;

  if (!hasFullAccess) {
    const visitStatus = user
      ? await checkAndRecordUserVisit(user.id, article.id)
      : await checkAndRecordVisitorVisit(article.id);

    isRestricted = !visitStatus.allowed;
    remainingReads = visitStatus.remaining;
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

  const articleUrl = `${baseUrl}/articles/${article.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: buildExcerpt(article.parts[0]?.content ?? article.title),
    image: article.media?.url ? [article.media.url] : undefined,
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: [{ "@type": "Person", name: article.author.name ?? "Rédaction" }],
    publisher: {
      "@type": "Organization",
      name: "La Voie De L'Info",
      logo: { "@type": "ImageObject", url: `${baseUrl}/icon` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
                      sizes="(min-width: 1024px) 896px, 100vw"
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

            {isRestricted ? (
              <ArticlePaywall isLoggedIn={!!user} />
            ) : (
              <>
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

                {!hasFullAccess &&
                  remainingReads !== null &&
                  remainingReads <= 2 && (
                    <p className="text-muted-foreground mt-8 text-center text-sm">
                      {remainingReads === 0
                        ? "C'était votre dernier article gratuit aujourd'hui."
                        : `Il vous reste ${remainingReads} article${remainingReads > 1 ? "s" : ""} gratuit${remainingReads > 1 ? "s" : ""} aujourd'hui.`}{" "}
                      <Link
                        href="/subscribe"
                        className="text-primary font-semibold hover:underline"
                      >
                        S&rsquo;abonner
                      </Link>
                    </p>
                  )}
              </>
            )}
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
