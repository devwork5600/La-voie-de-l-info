import React from 'react'

import { getArticles, getCategoriesByArticleCount } from '@/actions/categories-actions'
import { ArticleCarousel } from '@/components/carousel/ArticleCarousel'
import SidebarContent from '@/components/layout/sidebar/SidebarContent'

import ArticlesGrid from './components/ArticlesGrid'
import FeaturedArticleCard from './components/FeaturedArticleCard'
import TrendingArticles from './components/TrendingArticles'

const Page = async () => {
  const [{ articles }, categories] = await Promise.all([
    getArticles({ limit: 13 }),
    getCategoriesByArticleCount(6, false),
  ])

  const trendingArticles = articles.slice(0, 5)
  const carouselArticles = articles
  const gridArticles = articles.slice(0, 8)

  return (
    <>
    <div className="mx-auto flex max-w-[1440px] justify-center gap-6 px-4 py-8">
      <aside className="hidden xl:block">
        <div className="w-[260px] shrink-0">
          <SidebarContent categories={categories} />
        </div>
      </aside>

      <main className="w-full max-w-2xl">
        <FeaturedArticleCard
          slug="le-defi-du-stockage-de-lenergie"
          title="Le défi du stockage de l'énergie"
          excerpt="Malgré les progrès réalisés dans le développement des énergies renouvelables, la question du stockage demeure l'un des principaux défis du secteur."
          body="Contrairement aux centrales traditionnelles capables de produire de l'électricité à la demande, les installations solaires et éoliennes dépendent fortement des conditions météorologiques, rendant l'infrastructure de stockage cruciale pour la stabilité du réseau national..."
          author="Adrien"
          publishedAt="2026-06-23"
          commentsCount={12}
        />
      </main>

      <aside className="hidden md:block">
        <div className="w-[260px] shrink-0">
          <TrendingArticles articles={trendingArticles} />
        </div>
      </aside>
    </div>

    <ArticleCarousel articles={carouselArticles} />

    <div className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <ArticlesGrid articles={gridArticles} />
    </div>
    </>
  )
}

export default Page 