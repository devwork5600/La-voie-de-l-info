import cloudinary from "../../lib/cloudinary";

const PEXELS_ENDPOINT = "https://api.pexels.com/v1/search";

export interface PexelsPhoto {
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

export async function searchPhoto(query: string): Promise<PexelsPhoto> {
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

export async function uploadToCloudinary(
  photo: PexelsPhoto
): Promise<{ secure_url: string }> {
  const result = await cloudinary.uploader.upload(photo.src.large2x, {
    folder: "articles/illustrations",
    public_id: `pexels-${photo.id}`,
  });
  return result as { secure_url: string };
}
