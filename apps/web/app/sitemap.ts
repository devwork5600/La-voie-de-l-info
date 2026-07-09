import { db } from "@lvdi/database";
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const STATIC_ROUTE_DEFS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "hourly", priority: 1 },
  { path: "/articles", changeFrequency: "hourly", priority: 0.9 },
  { path: "/subscribe", changeFrequency: "monthly", priority: 0.6 },
  { path: "/redaction", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.1 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.1 },
];

const STATIC_ROUTES: MetadataRoute.Sitemap = STATIC_ROUTE_DEFS.map((route) => ({
  url: `${baseUrl}${route.path}`,
  changeFrequency: route.changeFrequency,
  priority: route.priority,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await db.article.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...STATIC_ROUTES, ...articleRoutes];
}
