import { db } from "@lvdi/database";
import { NextResponse } from "next/server";

import { isBlocked } from "@/lib/content-filter";
import { CATEGORY_MAP, dedupeByTitle, fetchByCategory } from "@/lib/newsdata";

// Auto-published, no admin review: unlike Article (AI-generated text, needs
// human validation before going live), a ticker entry is just a real
// headline + a link to the original source — no generated content, so no
// fabrication risk to review. The only safety net is the keyword filter.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let fetched = 0;
  let blocked = 0;
  let inserted = 0;

  for (const [siteCategory, newsdataCategory] of Object.entries(CATEGORY_MAP)) {
    const rawArticles = await fetchByCategory(newsdataCategory);
    const articles = dedupeByTitle(rawArticles);
    fetched += articles.length;

    const toInsert = articles
      .filter((article) => {
        if (isBlocked(article.title)) {
          blocked += 1;
          return false;
        }
        return true;
      })
      .map((article) => ({
        title: article.title,
        sourceUrl: article.link,
        sourceName: article.source_name,
        category: siteCategory,
        publishedAt: new Date(article.pubDate),
      }));

    if (toInsert.length > 0) {
      const result = await db.tickerItem.createMany({
        data: toInsert,
        skipDuplicates: true,
      });
      inserted += result.count;
    }
  }

  return NextResponse.json({ fetched, blocked, inserted });
}
