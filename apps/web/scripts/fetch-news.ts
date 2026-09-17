import "dotenv/config";

import { CATEGORY_MAP, dedupeByTitle, fetchByCategory } from "@/lib/newsdata";

async function main() {
  const entries = Object.entries(CATEGORY_MAP);

  for (const [siteCategory, newsdataCategory] of entries) {
    const rawArticles = await fetchByCategory(newsdataCategory);
    const articles = dedupeByTitle(rawArticles);
    const dropped = rawArticles.length - articles.length;

    console.log(
      `\n=== ${siteCategory} (newsdata: ${newsdataCategory}) — ${articles.length} articles (${dropped} doublons retirés) ===`
    );

    for (const article of articles) {
      console.log(`— ${article.title}`);
      console.log(`  ${article.source_name} · ${article.pubDate}`);
      console.log(`  ${article.link}`);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
