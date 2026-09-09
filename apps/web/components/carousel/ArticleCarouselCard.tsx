"use client";

import { Prisma } from "@lvdi/database";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    media: true;
    category: { select: { name: true } };
    author: { select: { name: true } };
    parts: { select: { content: true; order: true } };
  };
}>;

type Props = { article: ArticleWithRelations; priority?: boolean };

export function ArticleCarouselCard({ article, priority = false }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  if (!article) return null;

  const excerpt = article.parts[0]?.content;

  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="group bg-background flex h-full w-full flex-col overflow-hidden">
        <div className="bg-muted relative aspect-4/3 w-full overflow-hidden">
          {article.media?.url && (
            <Image
              src={article.media.url}
              alt={article.media.alt ?? article.title}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 280px, 60vw"
              className={cn(
                "object-cover opacity-0 transition-[opacity,transform] duration-300 group-hover:scale-105",
                !isLoading && "opacity-100"
              )}
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-1">
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">
            {article.category.name}
          </p>
          <h3 className="group-hover:text-primary line-clamp-2 leading-snug font-semibold transition">
            {article.title}
          </h3>
          {excerpt && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {excerpt}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
