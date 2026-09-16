import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Voie De L'Info",
    short_name: "La Voie De L'Info",
    description:
      "Journal d'information indépendant : actualités politiques, économiques, technologiques, écologiques et culturelles vérifiées et analysées par notre rédaction.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e1b30",
    theme_color: "#0e1b30",
    icons: [
      {
        src: "/icons/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
