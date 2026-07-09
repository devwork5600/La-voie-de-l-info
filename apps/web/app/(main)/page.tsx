import React from "react";

import ArticlesGrid from "./components/ArticlesGrid";
import FeaturedThreeUp from "./components/FeaturedThreeUp";
import FeaturedWithSide from "./components/FeaturedWithSide";

import {
  getArticles,
  getCategoriesByArticleCount,
} from "@/actions/categories-actions";
import { ArticleCarousel } from "@/components/carousel/ArticleCarousel";

const Page = async () => {
  const [
    { articles: sideArticles },
    { articles: featuredPool },
    { articles: threeUpPool },
    { articles: sideArticles2 },
    { articles: featuredPool2 },
    { articles: sideArticles3 },
    { articles: featuredPool3 },
    categories,
  ] = await Promise.all([
    getArticles({ limit: 4 }),
    getArticles({ limit: 2 }),
    getArticles({ limit: 3, page: 2 }),
    getArticles({ limit: 4, page: 2 }),
    getArticles({ limit: 2, page: 3 }),
    getArticles({ limit: 4, page: 3 }),
    getArticles({ limit: 2, page: 4 }),
    getCategoriesByArticleCount(2, false),
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
      <FeaturedWithSide
        articles={featuredPool}
        sideArticles={sideArticles}
        special="subscribe"
        priority
      />

      <div className="mx-auto w-full max-w-[1180px] px-4 py-8">
        <FeaturedThreeUp articles={threeUpPool} />
      </div>

      <FeaturedWithSide
        articles={featuredPool2}
        sideArticles={sideArticles2}
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
        sideArticles={sideArticles3}
        special="subscribe"
      />
    </>
  );
};

export default Page;
