import "dotenv/config";

const NEWSDATA_API_KEY = process.env.NEWS_DATA_IO_SECRET;
const ENDPOINT = "https://newsdata.io/api/1/latest";

// Maps this site's top-level editorial categories (packages/database Category
// table) to newsdata.io's category enum. "Opinions" has no equivalent: it's
// house-written commentary, not something to source from a news wire.
const CATEGORY_MAP: Record<string, string> = {
  politique: "politics",
  économie: "business",
  "high-tech": "technology",
  écologie: "environment",
  culture: "entertainment",
  sport: "sports",
  sciences: "science",
  société: "domestic",
};

interface NewsdataArticle {
  article_id: string;
  title: string;
  link: string;
  description: string | null;
  image_url: string | null;
  pubDate: string;
  source_name: string;
  category: string[];
}

interface NewsdataResponse {
  status: "success" | "error";
  totalResults?: number;
  results?: NewsdataArticle[];
  nextPage?: string;
  results_error?: unknown;
}

async function fetchByCategory(
  newsdataCategory: string
): Promise<NewsdataArticle[]> {
  const url = new URL(ENDPOINT);
  url.searchParams.set("apikey", NEWSDATA_API_KEY!);
  url.searchParams.set("country", "fr");
  url.searchParams.set("language", "fr");
  url.searchParams.set("category", newsdataCategory);

  const res = await fetch(url);
  const data: NewsdataResponse = await res.json();

  if (!res.ok || data.status !== "success") {
    throw new Error(
      `newsdata.io a répondu une erreur (HTTP ${res.status}) pour "${newsdataCategory}": ${JSON.stringify(data.results_error ?? data)}`
    );
  }

  return data.results ?? [];
}

// Wire dispatches get republished nearly verbatim by every outlet in a press
// group (e.g. the Ebra group titles seen while testing). Same normalized
// title = same dispatch, regardless of which outlet's byline is on it.
function normalizeTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeByTitle(articles: NewsdataArticle[]): NewsdataArticle[] {
  const seen = new Set<string>();
  const unique: NewsdataArticle[] = [];

  for (const article of articles) {
    const key = normalizeTitle(article.title);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(article);
  }

  return unique;
}

async function main() {
  if (!NEWSDATA_API_KEY) {
    throw new Error("NEWS_DATA_IO_SECRET manquant dans apps/web/.env");
  }

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
