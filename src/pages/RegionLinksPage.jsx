import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHero, Pager } from "../components/Bits.jsx";
import { SEO_KEYWORDS } from "../data/seo/keywords.js";
import { SEO_REGIONS, seoRegionPath } from "../data/seo/regions.js";
import { usePageTitle } from "../usePageTitle.js";

const PAGE_SIZE = 30;

export function RegionLinksPage() {
  usePageTitle("인천 지역 분양 안내 목록 | 아가몽");
  const [searchParams, setSearchParams] = useSearchParams();

  const keywordSlug = SEO_KEYWORDS.some((k) => k.slug === searchParams.get("k"))
    ? searchParams.get("k")
    : SEO_KEYWORDS[0].slug;
  const page = Math.max(1, Number(searchParams.get("p")) || 1);
  const keywordMeta = SEO_KEYWORDS.find((k) => k.slug === keywordSlug) || SEO_KEYWORDS[0];

  const totalPages = Math.ceil(SEO_REGIONS.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const slice = useMemo(
    () => SEO_REGIONS.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [safePage],
  );

  function pickKeyword(slug) {
    setSearchParams({ k: slug, p: "1" });
  }

  function onPage(next) {
    setSearchParams({ k: keywordSlug, p: String(next) });
    window.scrollTo(0, 0);
  }

  return (
    <article className="page region-links-page">
      <PageHero
        kicker="LOCAL GUIDE"
        title="인천 지역 분양 안내"
        lead="키워드를 고른 뒤 지역을 누르면 해당 안내 페이지로 이동합니다."
      />
      <div className="wrap region-links-page__body">
        <div className="region-links-page__keywords" role="tablist" aria-label="분양 키워드">
          {SEO_KEYWORDS.map((item) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={keywordSlug === item.slug}
              className={keywordSlug === item.slug ? "is-active" : undefined}
              onClick={() => pickKeyword(item.slug)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="region-links-page__meta">
          {keywordMeta.label} · {SEO_REGIONS.length}개 지역 · {safePage}/{totalPages}페이지
        </p>
        <ul className="region-links-page__list">
          {slice.map((region) => (
            <li key={`${keywordSlug}-${region.place}`}>
              <Link to={seoRegionPath(keywordSlug, region)}>
                {region.label} {keywordMeta.label}
              </Link>
            </li>
          ))}
        </ul>
        {totalPages > 1 ? <Pager page={safePage} pages={totalPages} onPage={onPage} /> : null}
      </div>
    </article>
  );
}
