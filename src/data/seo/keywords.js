export const SEO_KEYWORDS = [
  { slug: "강아지분양", label: "강아지분양", animal: "강아지", petType: "puppy" },
  { slug: "고양이분양", label: "고양이분양", animal: "고양이", petType: "kitten" },
  { slug: "강아지무료분양", label: "강아지무료분양", animal: "강아지", petType: "puppy", free: true },
  { slug: "고양이무료분양", label: "고양이무료분양", animal: "고양이", petType: "kitten", free: true },
];

export const SEO_CITY = "인천";

export function findSeoKeyword(slug) {
  return SEO_KEYWORDS.find((item) => item.slug === slug);
}
