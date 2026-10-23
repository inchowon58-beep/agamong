import extra from "./gemini.json";
import { content as base } from "./content.js";

function merge(a, b) {
  if (b === undefined || b === null || b === "") return a;
  const aObj = Boolean(a) && typeof a === "object" && !Array.isArray(a);
  const bObj = Boolean(b) && typeof b === "object" && !Array.isArray(b);
  if (!aObj || !bObj) return b;
  const out = { ...a };
  for (const key of Object.keys(b)) out[key] = merge(a[key], b[key]);
  return out;
}

function mergeGuides(baseGuides, extraGuides) {
  if (!Array.isArray(extraGuides)) return baseGuides;
  return baseGuides.map((guide) => {
    const next = extraGuides.find((item) => item.slug === guide.slug);
    return next ? merge(guide, next) : guide;
  });
}

const { guides, qna, philosophy, adoptionReviews, ...rest } = extra || {};
const merged = merge(base, rest);
merged.guides = mergeGuides(base.guides, guides);
if (Array.isArray(qna) && qna.length >= 4) merged.qna = qna;
if (Array.isArray(philosophy) && philosophy.length >= 5) merged.philosophy = philosophy;
if (Array.isArray(adoptionReviews) && adoptionReviews.length >= 30) merged.adoptionReviews = adoptionReviews;

export const content = merged;

export * from "./site.js";
export * from "./breeds.js";
export * from "./pets.js";
