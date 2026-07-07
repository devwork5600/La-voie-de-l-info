import { Prisma } from "@lvdi/database";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    media: true;
    category: { select: { name: true } };
    author: { select: { name: true } };
    parts: { select: { content: true; order: true } };
  };
}>;

type Props = { article: ArticleWithRelations };

export function ArticleCarouselCard({ article }: Props) {
  if (!article) return null;

  const excerpt = article.parts[0]?.content;

  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="group flex h-full w-full flex-col overflow-hidden bg-background">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          {article.media?.url && (
            <Image
              src={article.media.url}
              alt={article.media.alt ?? article.title}
              fill
              sizes="(min-width: 1024px) 280px, 60vw"
              className="object-cover grayscale transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {article.category.name}
          </p>
          <h3 className="line-clamp-2 font-semibold leading-snug transition group-hover:text-primary">
            {article.title}
          </h3>
          {excerpt && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
