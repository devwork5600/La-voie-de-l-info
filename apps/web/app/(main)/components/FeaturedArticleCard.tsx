import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FeaturedArticleCardProps {
  tag?: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  author: string;
  publishedAt: Date | string;
  commentsCount?: number;
  slug: string;
}

const FeaturedArticleCard: React.FC<FeaturedArticleCardProps> = ({
  tag = "À la une",
  title,
  excerpt,
  body,
  imageUrl,
  imageAlt,
  author,
  publishedAt,
  commentsCount,
  slug,
}) => {
  const date = new Date(publishedAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="w-full">
      <div className="flex items-center gap-3 text-xs">
        <span className="bg-primary px-2 py-1 font-semibold uppercase tracking-wide text-primary-foreground">
          {tag}
        </span>
        <span className="uppercase tracking-wide text-muted-foreground">{date}</span>
      </div>

      <h1 className="mt-4 font-playfair text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>

      <blockquote className="mt-4 border-l-2 border-primary pl-4 font-serif text-lg italic text-muted-foreground">
        {excerpt}
      </blockquote>

      <div className="mt-6 border-t border-foreground" />

      <div className="relative mt-6 aspect-16/9 w-full overflow-hidden bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            className="object-cover grayscale"
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        )}
      </div>

      <p className="mt-6 leading-relaxed text-foreground/90">{body}</p>

      <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-wide">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Par {author}</span>
          {typeof commentsCount === "number" && (
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {commentsCount}
            </span>
          )}
        </div>

        <Link href={`/articles/${slug}`} className="font-semibold text-primary transition hover:underline">
          Lire la suite →
        </Link>
      </div>
    </article>
  );
};

export default FeaturedArticleCard;
