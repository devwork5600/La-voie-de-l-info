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
  const multiSource = sources.length > 1;

  const lengthRule = multiSource
    ? `Tu disposes de ${sources.length} sources indépendantes sur le même sujet : croise-les pour écrire un article plus complet, 2 à 3 paragraphes (150 à 250 mots). N'utilise que les faits présents dans au moins une des sources ci-dessous.`
    : "La source ne contient qu'une ou deux phrases : n'écris PAS un article de plusieurs paragraphes à partir de ça. 1 à 2 paragraphes courts (60 à 100 mots au total) suffisent largement.";

  return `Tu es journaliste pour "La Voie De L'Info", un site d'actualités indépendant en français.

Rédige un article à partir de la ou des source(s) ci-dessous. Règles strictes :
- N'invente AUCUN fait, chiffre, citation ou détail qui n'est pas déjà présent dans les sources. Si l'information est limitée, reste court plutôt que d'inventer pour remplir de l'espace.
- Ton neutre et factuel, style journalistique.
- ${lengthRule}
- Ne recopie pas les phrases sources mot pour mot : reformule avec tes propres mots.

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
  const sources = clusters[0];

  console.log(
    sources.length > 1
      ? `${sources.length} sources regroupées sur le même sujet :`
      : "Une seule source disponible pour ce sujet :"
  );
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
