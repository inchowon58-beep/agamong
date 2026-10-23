import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { SEO_KEYWORDS } = await import(pathToFileURL(path.join(root, "src", "data", "seo", "keywords.js")).href);
const { SEO_REGIONS, seoRegionPath } = await import(pathToFileURL(path.join(root, "src", "data", "seo", "regions.js")).href);
const { SITE_URL } = await import(pathToFileURL(path.join(root, "src", "data", "site.js")).href);

const urls = [`${SITE_URL}/`];
for (const keyword of SEO_KEYWORDS) {
  for (const region of SEO_REGIONS) {
    urls.push(`${SITE_URL}${seoRegionPath(keyword.slug, region)}`);
  }
}

const outDir = path.join(root, "public");
fs.mkdirSync(outDir, { recursive: true });
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(outDir, "sitemap-seo.xml"), xml, "utf8");
console.log(`URLs: ${urls.length} → public/sitemap-seo.xml`);
