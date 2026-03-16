import { docs } from "$lib/docs";
import type { RequestHandler } from "./$types";

const SITE = "https://pen-docs.vercel.app";

export const prerender = true;

export const GET: RequestHandler = () => {
  const urls = docs.map(
    (doc) => `
  <url>
    <loc>${SITE}/docs/${doc.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>${doc.slug === "readme" ? "1.0" : "0.8"}</priority>
  </url>`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600",
    },
  });
};
