import "dotenv/config";

import {
  CATEGORY_MAP,
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

function buildPrompt(source: NewsdataArticle): string {
  return `Tu es journaliste pour "La Voie De L'Info", un site d'actualités indépendant en français.

Rédige un article à partir de la dépêche source ci-dessous. Règles strictes :
- N'invente AUCUN fait, chiffre, citation ou détail qui n'est pas déjà présent dans la dépêche source. Si l'information est limitée, reste court plutôt que d'inventer pour remplir de l'espace.
- Ton neutre et factuel, style journalistique.
- La dépêche source ne contient qu'une ou deux phrases : n'écris PAS un article de plusieurs paragraphes à partir de ça. 1 à 2 paragraphes courts (60 à 100 mots au total) suffisent largement.
- Ne recopie pas les phrases de la dépêche mot pour mot : reformule avec tes propres mots.

Dépêche source :
Titre : ${source.title}
Résumé : ${source.description ?? "(aucun résumé disponible)"}
Source : ${source.source_name}

Réponds UNIQUEMENT avec un objet JSON de cette forme, sans aucun texte autour :
{"title": "titre de l'article reformulé", "parts": ["premier paragraphe", "deuxième paragraphe", "..."]}`;
}

async function generateFromArticle(
  source: NewsdataArticle
): Promise<GeneratedArticle> {
  const res = await fetch(OLLAMA_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: buildPrompt(source),
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

  const source = articles[0];
  console.log(`Dépêche source : "${source.title}" (${source.source_name})\n`);
  console.log("Génération en cours avec Mistral...\n");

  const generated = await generateFromArticle(source);

  console.log(`=== ${generated.title} ===\n`);
  for (const paragraph of generated.parts) {
    console.log(`${paragraph}\n`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
