import { useEffect } from "react";
import { BUSINESS, SITE_URL } from "../data/site.js";

function upsertMeta(attr, key, content) {
  let node = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let node = document.head.querySelector(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", rel);
    document.head.appendChild(node);
  }
  node.setAttribute("href", href);
}

export function useSeoDocument({ title, description, url, faqs }) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", BUSINESS.name);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertLink("canonical", url);

    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": title,
          "url": url,
          "description": description,
          "inLanguage": "ko-KR",
          "isPartOf": { "@type": "WebSite", "name": BUSINESS.name, "url": `${SITE_URL}/` },
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqs.map(([question, answer]) => ({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": { "@type": "Answer", "text": answer },
          })),
        },
      ],
    };

    let script = document.getElementById("seo-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-jsonld";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(graph);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [title, description, url, faqs]);
}
