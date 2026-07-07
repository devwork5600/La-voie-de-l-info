"use client";

import { Prisma } from "@lvdi/database";
import * as React from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { ArticleCarouselCard } from "./ArticleCarouselCard";

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
};

export function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!articles.length) return null;

  return (
    <div className="relative mx-auto my-16 w-full max-w-[1440px] px-4">
      <div
        className={cn(
          "pointer-events-none absolute top-0 bottom-0 left-4 z-10 w-12 bg-gradient-to-r from-background to-transparent",
          current === 1 && "hidden"
        )}
      />

      <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {articles.map(
            (article) =>
              article && (
                <CarouselItem
                  key={article.id}
                  className="basis-[220px] shrink-0 pl-4 md:basis-[240px] lg:basis-[280px]"
                >
                  <ArticleCarouselCard article={article} />
                </CarouselItem>
              )
          )}
        </CarouselContent>
      </Carousel>

      <div
        className={cn(
          "pointer-events-none absolute top-0 right-4 bottom-0 z-10 w-12 bg-gradient-to-l from-background to-transparent",
          current === count && "hidden"
        )}
      />
    </div>
  );
}
