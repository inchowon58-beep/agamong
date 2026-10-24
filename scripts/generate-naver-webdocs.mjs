import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { SEO_REGIONS, seoRegionPath } = await import(
  pathToFileURL(path.join(root, "src", "data", "seo", "regions.js")).href
);
const { SITE_URL } = await import(pathToFileURL(path.join(root, "src", "data", "site.js")).href);

/** 네이버 웹문서 등록 우선순위 */
const NAVER_KEYWORD_ORDER = ["강아지무료분양", "강아지분양", "고양이무료분양", "고양이분양"];

const outDir = path.join(root, "웹문서등록");
fs.mkdirSync(outDir, { recursive: true });

function urlsForKeyword(slug) {
  return SEO_REGIONS.map((region) => `${SITE_URL}${seoRegionPath(slug, region)}`);
}

const commonUrls = [`${SITE_URL}/`, `${SITE_URL}/local-links`];
fs.writeFileSync(path.join(outDir, "00-메인및목록.txt"), `${commonUrls.join("\n")}\n`, "utf8");

const allInOrder = [...commonUrls];
for (const slug of NAVER_KEYWORD_ORDER) {
  const urls = urlsForKeyword(slug);
  fs.writeFileSync(path.join(outDir, `${slug}.txt`), `${urls.join("\n")}\n`, "utf8");
  allInOrder.push(...urls);
}

fs.writeFileSync(path.join(outDir, "전체-등록순.txt"), `${allInOrder.join("\n")}\n`, "utf8");

console.log(`네이버 웹문서등록 → ${outDir}`);
for (const slug of NAVER_KEYWORD_ORDER) {
  console.log(`  ${slug}.txt: ${SEO_REGIONS.length} URLs`);
}
console.log(`  전체-등록순.txt: ${allInOrder.length} URLs`);
