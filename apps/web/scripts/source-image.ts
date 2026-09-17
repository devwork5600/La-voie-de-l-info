import "dotenv/config";

import cloudinary from "../lib/cloudinary";

const PEXELS_ENDPOINT = "https://api.pexels.com/v1/search";

interface PexelsPhoto {
  id: number;
  photographer: string;
  photographer_url: string;
  url: string;
  alt: string;
  src: {
    large2x: string;
  };
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

async function searchPhoto(query: string): Promise<PexelsPhoto> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    throw new Error("PEXELS_API_KEY manquant dans apps/web/.env");
  }

  const url = new URL(PEXELS_ENDPOINT);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "5");
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    throw new Error(`Pexels a répondu HTTP ${res.status}: ${await res.text()}`);
  }

  const data: PexelsResponse = await res.json();
  if (data.photos.length === 0) {
    throw new Error(`Aucune photo Pexels trouvée pour "${query}"`);
  }

  return data.photos[0];
}

async function uploadToCloudinary(photo: PexelsPhoto) {
  return cloudinary.uploader.upload(photo.src.large2x, {
    folder: "articles/illustrations",
    public_id: `pexels-${photo.id}`,
  });
}

async function main() {
  const query = process.argv[2];
  if (!query) {
    throw new Error(
      "Usage : npx tsx scripts/source-image.ts <mot-clé de recherche>"
    );
  }

  console.log(`Recherche Pexels pour "${query}"...\n`);
  const photo = await searchPhoto(query);

  console.log(`Photo trouvée : ${photo.url}`);
  console.log(
    `Photographe : ${photo.photographer} (${photo.photographer_url})\n`
  );
  console.log("Upload vers Cloudinary...\n");

  const uploaded = (await uploadToCloudinary(photo)) as { secure_url: string };

  console.log(`URL Cloudinary : ${uploaded.secure_url}`);
  console.log(
    `Légende suggérée : "Photo d'illustration — ${photo.photographer} / Pexels"`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
