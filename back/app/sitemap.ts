import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "http://localhost:3000", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "http://localhost:3000/login", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "http://localhost:3000/register", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "http://localhost:3000/dashboard", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "http://localhost:3000/projects", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];
}
