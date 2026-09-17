const ENDPOINT = "https://newsdata.io/api/1/latest";

// Maps this site's top-level editorial categories (packages/database Category
// table) to newsdata.io's category enum. "Opinions" has no equivalent: it's
// house-written commentary, not something to source from a news wire.
export const CATEGORY_MAP: Record<string, string> = {
  politique: "politics",
  économie: "business",
  "high-tech": "technology",
  écologie: "environment",
  culture: "entertainment",
  sport: "sports",
  sciences: "science",
  société: "domestic",
};

export interface NewsdataArticle {
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

export async function fetchByCategory(
  newsdataCategory: string
): Promise<NewsdataArticle[]> {
  const apiKey = process.env.NEWS_DATA_IO_SECRET;
  if (!apiKey) {
    throw new Error("NEWS_DATA_IO_SECRET manquant dans apps/web/.env");
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set("apikey", apiKey);
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

export function dedupeByTitle(articles: NewsdataArticle[]): NewsdataArticle[] {
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
