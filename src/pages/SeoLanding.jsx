import { Link, Navigate, useParams } from "react-router-dom";
import { ConsultBand } from "../components/Bits.jsx";
import { PhoneLink, TextWithPhone } from "../components/PhoneLink.jsx";
import { HomeMainContent } from "../components/HomeMainContent.jsx";
import { seoFaqs, seoParagraphs } from "../data/seo/content.js";
import { findSeoKeyword } from "../data/seo/keywords.js";
import { findSeoRegion } from "../data/seo/regions.js";
import { SITE_URL } from "../data/site.js";
import { useSeoDocument } from "../hooks/useSeoDocument.js";

export function SeoLanding() {
  const { keyword, city, place } = useParams();
  const decodedCity = decodeURIComponent(city || "");
  const decodedPlace = place ? decodeURIComponent(place) : "";

  const keywordMeta = findSeoKeyword(keyword || "");
  if (!keywordMeta) return <Navigate to="/" replace />;

  const region = findSeoRegion(decodedCity, decodedPlace || decodedCity);
  if (!region) return <Navigate to="/" replace />;

  const phrase = `${region.label} ${keywordMeta.label}`;
  const paragraphs = seoParagraphs(region.label, keywordMeta);
  const faqs = seoFaqs(region.label, keywordMeta);
  const path = place
    ? `/${keyword}/${encodeURIComponent(decodedCity)}/${encodeURIComponent(decodedPlace)}`
    : `/${keyword}/${encodeURIComponent(decodedCity)}`;
  const url = `${SITE_URL}${path}`;
  const title = `${phrase} | 아가몽`;
  const description = `${region.label} ${keywordMeta.label} 상담 안내. ${paragraphs[0].slice(0, 120)}…`;

  useSeoDocument({ title, description, url, faqs });

  return (
    <div className="seo-page">
      <section className="seo-lead">
        <div className="wrap">
          <p className="kicker">LOCAL GUIDE</p>
          <h1>{phrase}</h1>
          <details className="seo-fold seo-fold--lead">
            <summary aria-label="상단 안내 펼치기">
              <span className="seo-toggle" />
            </summary>
            <div className="seo-lead__body">
              <p>{paragraphs[0]}</p>
            </div>
          </details>
        </div>
      </section>

      <HomeMainContent embedded />

      <ConsultBand />

      <section className="section seo-blog">
        <div className="wrap">
          <details className="seo-fold seo-fold--inline">
            <summary aria-label="상세 안내 펼치기">
              <span className="seo-toggle" />
            </summary>
            <article className="seo-blog__card">
              <h2>{region.label}에서 알아보는 {keywordMeta.label}</h2>
              {paragraphs.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <h3>자주 묻는 질문</h3>
              <div className="seo-faq">
                {faqs.map(([question, answer]) => (
                  <div key={question}>
                    <strong>{question}</strong>
                    <p>
                      <TextWithPhone text={answer} />
                    </p>
                  </div>
                ))}
              </div>
              <p className="seo-bottom__note">
                {region.label} {keywordMeta.label} 문의는 아가몽 상담으로 연결됩니다. 전화 <PhoneLink />
              </p>
              <p className="seo-blog__cta">
                <Link to={keywordMeta.petType === "kitten" ? "/kittens" : "/puppies"}>
                  {keywordMeta.animal} 목록
                </Link>
                {" · "}
                <Link to="/local-links">인천 지역 안내 목록</Link>
              </p>
            </article>
          </details>
        </div>
      </section>
    </div>
  );
}

