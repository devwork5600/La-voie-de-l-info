import { readFileSync } from "node:fs";
import { join } from "node:path";

import "dotenv/config";

import {
  CATEGORY_MAP,
  clusterBySimilarTopic,
  dedupeByTitle,
  fetchByCategory,
  type NewsdataArticle,
} from "./lib/newsdata";

const OLLAMA_ENDPOINT = "http://localhost:11434/api/generate";
const MODEL = "mistral";
const MIN_SOURCES = 3;

const EDITORIAL_GUIDELINES = readFileSync(
  join(process.cwd(), "scripts/lib/editorial-guidelines.md"),
  "utf-8"
);

interface GeneratedArticle {
  title: string;
  parts: string[];
}

function formatSources(sources: NewsdataArticle[]): string {
  return sources
    .map(
      (source, i) =>
        `Source ${i + 1} (${source.source_name}) :\nTitre : ${source.title}\nRésumé : ${source.description ?? "(aucun résumé disponible)"}`
    )
    .join("\n\n");
}

function buildPrompt(sources: NewsdataArticle[]): string {
  return `Tu es journaliste pour "La Voie De L'Info". Voici la ligne éditoriale du journal, à respecter strictement :

${EDITORIAL_GUIDELINES}

Rédige un article à partir des ${sources.length} sources indépendantes ci-dessous, en croisant leurs informations. N'utilise que les faits présents dans au moins une des sources. Ne recopie pas les phrases sources mot pour mot : reformule avec tes propres mots.

${formatSources(sources)}

Réponds UNIQUEMENT avec un objet JSON de cette forme, sans aucun texte autour :
{"title": "titre de l'article reformulé", "parts": ["premier paragraphe", "deuxième paragraphe", "..."]}`;
}

async function generateFromSources(
  sources: NewsdataArticle[]
): Promise<GeneratedArticle> {
  const res = await fetch(OLLAMA_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: buildPrompt(sources),
      format: "json",
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama a répondu HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return JSON.parse(data.response) as GeneratedArticle;
}

async function main() {
  const categoryArg = process.argv[2] ?? "politique";
  const newsdataCategory = CATEGORY_MAP[categoryArg];

  if (!newsdataCategory) {
    throw new Error(
      `Catégorie inconnue : "${categoryArg}". Valeurs possibles : ${Object.keys(CATEGORY_MAP).join(", ")}`
    );
  }

  const rawArticles = await fetchByCategory(newsdataCategory);
  const articles = dedupeByTitle(rawArticles);

  if (articles.length === 0) {
    throw new Error(`Aucun article trouvé pour la catégorie "${categoryArg}"`);
  }

  const clusters = clusterBySimilarTopic(articles);
  const sources = clusters.find((cluster) => cluster.length >= MIN_SOURCES);

  if (!sources) {
    const best = clusters[0]?.length ?? 0;
    throw new Error(
      `Aucun sujet avec au moins ${MIN_SOURCES} sources indépendantes dans "${categoryArg}" sur ce lot (meilleur regroupement trouvé : ${best} source(s)). Réessaie plus tard ou sur une autre catégorie.`
    );
  }

  console.log(`${sources.length} sources regroupées sur le même sujet :`);
  for (const source of sources) {
    console.log(`  — "${source.title}" (${source.source_name})`);
  }
  console.log("\nGénération en cours avec Mistral...\n");

  const generated = await generateFromSources(sources);

  console.log(`=== ${generated.title} ===\n`);
  for (const paragraph of generated.parts) {
    console.log(`${paragraph}\n`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
