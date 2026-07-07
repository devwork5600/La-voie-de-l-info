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
        <span className="bg-primary text-primary-foreground px-2 py-1 font-semibold tracking-wide uppercase">
          {tag}
        </span>
        <span className="text-muted-foreground tracking-wide uppercase">
          {date}
        </span>
      </div>

      <h1 className="font-playfair mt-4 text-3xl leading-tight font-bold sm:text-4xl">
        {title}
      </h1>

      <blockquote className="border-primary text-muted-foreground mt-4 border-l-2 pl-4 font-serif text-lg italic">
        {excerpt}
      </blockquote>

      <div className="border-foreground mt-6 border-t" />

      <div className="bg-muted relative mt-6 aspect-16/9 w-full overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        )}
      </div>

      <p className="text-foreground/90 mt-6 leading-relaxed">{body}</p>

      <div className="mt-6 flex items-center justify-between text-xs tracking-wide uppercase">
        <div className="text-muted-foreground flex items-center gap-4">
          <span>Par {author}</span>
          {typeof commentsCount === "number" && (
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {commentsCount}
            </span>
          )}
        </div>

        <Link
          href={`/articles/${slug}`}
          className="text-primary font-semibold transition hover:underline"
        >
          Lire la suite →
        </Link>
      </div>
    </article>
  );
};

export default FeaturedArticleCard;
