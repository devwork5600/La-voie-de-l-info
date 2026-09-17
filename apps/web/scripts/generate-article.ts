import "dotenv/config";

import { generateFromSources } from "./lib/mistral";

import {
  CATEGORY_MAP,
  clusterBySimilarTopic,
  dedupeByTitle,
  fetchByCategory,
} from "@/lib/newsdata";

const MIN_SOURCES = 2;

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
