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
    { articles: sidePool },
    { articles: featuredPool },
    { articles: threeUpPool },
    { articles: sidePool2 },
    { articles: featuredPool2 },
    { articles: sidePool3 },
    { articles: featuredPool3 },
    categories,
  ] = await Promise.all([
    getArticles({ limit: 12 }),
    getArticles({ limit: 3 }),
    getArticles({ limit: 3, page: 2 }),
    getArticles({ limit: 12, page: 2 }),
    getArticles({ limit: 3, page: 3 }),
    getArticles({ limit: 12, page: 3 }),
    getArticles({ limit: 3, page: 4 }),
    getCategoriesByArticleCount(2, false),
  ]);

  const sideChunks = [
    sidePool.slice(0, 4),
    sidePool.slice(4, 8),
    sidePool.slice(8, 12),
  ];
  const sideChunks2 = [
    sidePool2.slice(0, 4),
    sidePool2.slice(4, 8),
    sidePool2.slice(8, 12),
  ];
  const sideChunks3 = [
    sidePool3.slice(0, 4),
    sidePool3.slice(4, 8),
    sidePool3.slice(8, 12),
  ];

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
      <FeaturedWithSide articles={featuredPool} sideChunks={sideChunks} />

      <div className="mx-auto w-full max-w-[1180px] px-4 py-8">
        <FeaturedThreeUp articles={threeUpPool} />
      </div>

      <FeaturedWithSide articles={featuredPool2} sideChunks={sideChunks2} />

      <ArticleCarousel
        articles={carouselArticles}
        title={carouselTitle}
        href={
          carouselCategory
            ? `/articles?category=${carouselCategory.slug}`
            : undefined
        }
      />

      <FeaturedWithSide articles={featuredPool3} sideChunks={sideChunks3} />
    </>
  );
};

export default Page;
