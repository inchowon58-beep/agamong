import { Link } from "react-router-dom";

export function FooterSeoLinks() {
  return (
    <div className="footer-seo-links">
      <Link className="footer-seo-links__btn" to="/local-links" aria-label="인천 지역 분양 안내 목록 페이지">
        <span className="seo-toggle seo-toggle--sm" />
      </Link>
    </div>
  );
}
