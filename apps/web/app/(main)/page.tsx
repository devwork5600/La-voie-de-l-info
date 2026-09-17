import React from "react";

import ArticlesGrid from "./components/ArticlesGrid";
import FeaturedThreeUp from "./components/FeaturedThreeUp";
import FeaturedWithSide from "./components/FeaturedWithSide";

import {
  getArticles,
  getCategoriesByArticleCount,
} from "@/actions/categories-actions";
import { getTickerItems } from "@/actions/ticker-actions";
import { ArticleCarousel } from "@/components/carousel/ArticleCarousel";

const Page = async () => {
  const [
    { articles: featuredPool },
    { articles: threeUpPool },
    { articles: featuredPool2 },
    { articles: featuredPool3 },
    categories,
    tickerSlices,
  ] = await Promise.all([
    getArticles({ limit: 2 }),
    getArticles({ limit: 3, page: 2 }),
    getArticles({ limit: 2, page: 3 }),
    getArticles({ limit: 2, page: 4 }),
    getCategoriesByArticleCount(2, false),
    getTickerItems(),
  ]);

  const [carouselCategory, gridCategory] = categories;

  const [{ articles: carouselArticles }, { articles: gridArticles }] =
    await Promise.all([
      getArticles({ limit: 8, categorySlug: carouselCategory?.slug }),
      getArticles({ limit: 8, categorySlug: gridCategory?.slug }),
    ]);

  const carouselTitle = carouselCategory
    ? `Découvrez ${carouselCategory.name}`
    : "Découvrez nos articles";
  const gridTitle = gridCategory
    ? `Les derniers articles ${gridCategory.name}`
    : "Les derniers articles";

  return (
    <>
      <h1 className="sr-only">
        La Voie De L&rsquo;Info — Actualités indépendantes
      </h1>

      <FeaturedWithSide
        articles={featuredPool}
        tickerItems={tickerSlices[0]}
        special="subscribe"
        priority
      />

      <div className="mx-auto w-full max-w-[1180px] px-4 py-8">
        <FeaturedThreeUp articles={threeUpPool} />
      </div>

      <FeaturedWithSide
        articles={featuredPool2}
        tickerItems={tickerSlices[1]}
        special="newsletter"
      />

      <ArticleCarousel
        articles={carouselArticles}
        title={carouselTitle}
        href={
          carouselCategory
            ? `/articles?category=${carouselCategory.slug}`
            : undefined
        }
      />

      <FeaturedWithSide
        articles={featuredPool3}
        tickerItems={tickerSlices[2]}
        special="subscribe"
      />
    </>
  );
};

export default Page;
