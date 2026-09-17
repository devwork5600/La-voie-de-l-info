import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { NewsdataArticle } from "./newsdata";

const OLLAMA_ENDPOINT = "http://localhost:11434/api/generate";
const MODEL = "mistral";

const EDITORIAL_GUIDELINES = readFileSync(
  join(process.cwd(), "scripts/lib/editorial-guidelines.md"),
  "utf-8"
);

export interface GeneratedArticle {
  title: string;
  parts: string[];
  imageKeyword: string;
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

Donne aussi un mot-clé de recherche d'image d'illustration générique en anglais (1 à 3 mots, pour une banque de photos libres type Pexels) : décris le sujet général (ex. "football stadium", "courtroom", "wind turbines"), jamais un nom propre de personne, de lieu précis ou de club — reste générique.

Réponds UNIQUEMENT avec un objet JSON de cette forme, sans aucun texte autour :
{"title": "titre de l'article reformulé", "parts": ["premier paragraphe", "deuxième paragraphe", "..."], "imageKeyword": "mot-clé générique en anglais"}`;
}

export async function generateFromSources(
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
