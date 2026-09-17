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

// Common French function words carry no topical signal and would make
// unrelated articles look similar just because they share "de", "le", "des"...
const FRENCH_STOPWORDS = new Set([
  "le",
  "la",
  "les",
  "un",
  "une",
  "des",
  "de",
  "du",
  "et",
  "ou",
  "à",
  "au",
  "aux",
  "en",
  "dans",
  "pour",
  "sur",
  "avec",
  "sans",
  "par",
  "ce",
  "cet",
  "cette",
  "ces",
  "qui",
  "que",
  "quoi",
  "dont",
  "où",
  "il",
  "elle",
  "ils",
  "elles",
  "son",
  "sa",
  "ses",
  "leur",
  "leurs",
  "plus",
  "moins",
  "très",
  "est",
  "sont",
  "a",
  "ont",
  "être",
  "avoir",
  "ne",
  "pas",
  "se",
  "s",
  "d",
  "l",
  "c",
  "n",
  "après",
  "avant",
  "entre",
  "vers",
  "chez",
]);

function significantWords(title: string): Set<string> {
  return new Set(
    normalizeTitle(title)
      .split(" ")
      .filter((word) => word.length > 2 && !FRENCH_STOPWORDS.has(word))
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = [...a].filter((word) => b.has(word)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

// Groups articles that are likely covering the same underlying story but
// were written independently by different outlets — distinct from
// dedupeByTitle, which only catches near-identical wire reprints. A cluster
// gives generate-article.ts several real, independent descriptions of the
// same event to draw from instead of a single sentence.
//
// Same-outlet articles are never merged into the same cluster, even if their
// titles are similar: two write-ups from one newsroom about the same
// statement are usually near-identical in substance (verified case: two
// TF1 Info pieces with the exact same description, just a different
// headline) and add no real new material — asking Mistral to "expand" on
// that duplicated content is what caused it to fabricate a detail (an
// invented, factually wrong name for a political party) rather than
// genuinely synthesizing independent reporting.
const SIMILARITY_THRESHOLD = 0.3;

export function clusterBySimilarTopic(
  articles: NewsdataArticle[]
): NewsdataArticle[][] {
  const wordSets = articles.map((article) => significantWords(article.title));
  const assigned = new Set<number>();
  const clusters: NewsdataArticle[][] = [];

  for (let i = 0; i < articles.length; i++) {
    if (assigned.has(i)) continue;

    const cluster = [articles[i]];
    const sourcesInCluster = new Set([articles[i].source_name]);
    assigned.add(i);

    for (let j = i + 1; j < articles.length; j++) {
      if (assigned.has(j)) continue;
      if (sourcesInCluster.has(articles[j].source_name)) continue;
      if (jaccardSimilarity(wordSets[i], wordSets[j]) >= SIMILARITY_THRESHOLD) {
        cluster.push(articles[j]);
        sourcesInCluster.add(articles[j].source_name);
        assigned.add(j);
      }
    }

    clusters.push(cluster);
  }

  return clusters.sort((a, b) => b.length - a.length);
}
