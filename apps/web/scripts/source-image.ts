import "dotenv/config";

import { searchPhoto, uploadToCloudinary } from "./lib/pexels";

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

  const uploaded = await uploadToCloudinary(photo);

  console.log(`URL Cloudinary : ${uploaded.secure_url}`);
  console.log(
    `Légende suggérée : "Photo d'illustration — ${photo.photographer} / Pexels"`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
