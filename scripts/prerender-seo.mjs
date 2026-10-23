import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const { SEO_KEYWORDS } = await import(pathToFileURL(path.join(root, "src", "data", "seo", "keywords.js")).href);
const { SEO_REGIONS, seoRegionPath } = await import(pathToFileURL(path.join(root, "src", "data", "seo", "regions.js")).href);

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("dist/index.html 없음. 먼저 npm run build 하세요.");
  process.exit(1);
}

const paths = ["/"];
for (const keyword of SEO_KEYWORDS) {
  for (const region of SEO_REGIONS) {
    paths.push(seoRegionPath(keyword.slug, region));
  }
}

const host = "127.0.0.1";
const port = 4173;
const origin = `http://${host}:${port}`;

function waitForServer(maxMs = 60000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(`${origin}/`, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) resolve();
        else if (Date.now() - started > maxMs) reject(new Error("preview timeout"));
        else setTimeout(tick, 400);
      });
      req.on("error", () => {
        if (Date.now() - started > maxMs) reject(new Error("preview timeout"));
        else setTimeout(tick, 400);
      });
    };
    tick();
  });
}

const preview = spawn("npx", ["vite", "preview", "--host", host, "--port", String(port), "--strictPort"], {
  cwd: root,
  shell: true,
  stdio: "ignore",
});

await waitForServer();
console.log(`prerender ${paths.length} pages…`);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
let done = 0;
for (const routePath of paths) {
  try {
    await page.goto(`${origin}${routePath}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForFunction(
      () => document.querySelector("#main h1, #main .seo-lead h1, #main .hero h1"),
      { timeout: 25000 },
    );
    await new Promise((resolve) => setTimeout(resolve, 350));
    const html = await page.content();
    const segments = routePath.split("/").filter(Boolean);
    const outDir = segments.length ? path.join(dist, ...segments.map(decodeURIComponent)) : dist;
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
    done += 1;
    if (done % 50 === 0) console.log(`  ${done}/${paths.length}`);
  } catch (error) {
    console.warn("skip", routePath, error.message);
  }
}
await page.close();

await browser.close();
preview.kill();
console.log(`완료: ${done} HTML → dist/`);
