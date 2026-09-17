import "dotenv/config";

import { db } from "@lvdi/database";

import { generateFromSources } from "./lib/mistral";
import {
  CATEGORY_MAP,
  clusterBySimilarTopic,
  dedupeByTitle,
  fetchByCategory,
} from "./lib/newsdata";
import { searchPhoto, uploadToCloudinary } from "./lib/pexels";

const MIN_SOURCES = 2;
const REVIEWER_EMAIL = "delagneauadrien@yahoo.fr"; // compte ADMIN : seul habilité à valider les articles

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  const categoryArg = process.argv[2] ?? "politique";
  const newsdataCategory = CATEGORY_MAP[categoryArg];

  if (!newsdataCategory) {
    throw new Error(
      `Catégorie inconnue : "${categoryArg}". Valeurs possibles : ${Object.keys(CATEGORY_MAP).join(", ")}`
    );
  }

  // Les clés de CATEGORY_MAP correspondent aux slugs des catégories en base
  // (ex: "politique" -> Category { name: "Politique", slug: "politique" }).
  const category = await db.category.findUnique({
    where: { slug: categoryArg },
  });
  if (!category) {
    throw new Error(
      `Catégorie "${categoryArg}" introuvable en base (slug attendu)`
    );
  }

  const author = await db.user.findUnique({ where: { email: REVIEWER_EMAIL } });
  if (!author) {
    throw new Error(`Compte relecteur introuvable (${REVIEWER_EMAIL})`);
  }

  console.log(`Recherche de dépêches pour "${categoryArg}"...`);
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

  console.log("\nGénération du texte avec Mistral...");
  const generated = await generateFromSources(sources);
  console.log(`Titre généré : "${generated.title}"`);

  console.log(
    `\nRecherche d'une photo d'illustration ("${generated.imageKeyword}")...`
  );
  const photo = await searchPhoto(generated.imageKeyword);
  const uploaded = await uploadToCloudinary(photo);
  console.log(`Image : ${uploaded.secure_url}`);

  const slug = slugify(generated.title);

  const article = await db.article.create({
    data: {
      title: generated.title,
      slug,
      published: false,
      authorId: author.id,
      categoryId: category.id,
      parts: {
        create: generated.parts.map((content, index) => ({
          content,
          order: index,
        })),
      },
      media: {
        create: {
          type: "IMAGE",
          url: uploaded.secure_url,
          alt: photo.alt || generated.title,
          legend: `Photo d'illustration — ${photo.photographer} / Pexels`,
        },
      },
    },
  });

  console.log(
    `\nArticle créé en base, en attente de relecture : /author/articles/${article.id}/edit`
  );
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
