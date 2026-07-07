"use client";

import { Prisma } from "@lvdi/database";
import Link from "next/link";
import * as React from "react";

import { ArticleCarouselCard } from "./ArticleCarouselCard";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    media: true;
    category: { select: { name: true } };
    author: { select: { name: true } };
    parts: { select: { content: true; order: true } };
  };
}>;

type ArticleCarouselProps = {
  articles: ArticleWithRelations[];
  title?: string;
  href?: string;
};

export function ArticleCarousel({
  articles,
  title,
  href,
}: ArticleCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const sync = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    // Defer the initial snapshot read so setState isn't called
    // synchronously within the effect body.
    queueMicrotask(sync);

    api.on("select", sync);
    return () => {
      api.off("select", sync);
    };
  }, [api]);

  if (!articles.length) return null;

  return (
    <div className="mx-auto my-16 w-full max-w-[1180px] px-4">
      {title && (
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-playfair text-2xl font-bold">{title}</h2>
          {href && (
            <Link
              href={href}
              className="text-primary text-sm font-semibold tracking-wide uppercase transition hover:underline"
            >
              Voir tout →
            </Link>
          )}
        </div>
      )}

      <div className="relative">
        <div
          className={cn(
            "from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-12 bg-gradient-to-r to-transparent",
            current === 1 && "hidden"
          )}
        />

        <Carousel
          setApi={setApi}
          opts={{ align: "start", dragFree: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {articles.map(
              (article) =>
                article && (
                  <CarouselItem
                    key={article.id}
                    className="shrink-0 basis-[286px] pl-4 md:basis-[312px] lg:basis-[334px]"
                  >
                    <ArticleCarouselCard article={article} />
                  </CarouselItem>
                )
            )}
          </CarouselContent>
        </Carousel>

        <div
          className={cn(
            "from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-12 bg-gradient-to-l to-transparent",
            current === count && "hidden"
          )}
        />
      </div>
    </div>
  );
}
