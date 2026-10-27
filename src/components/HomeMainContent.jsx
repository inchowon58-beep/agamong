import { useState } from "react";
import { Link } from "react-router-dom";
import { breedsByType, content, filterPets, imageUrl } from "../data/index.js";
import { ReactCounts, reactions } from "../components/Bits.jsx";
import { PetCard } from "../components/PetCard.jsx";
import { PhilosophyProse, PhilosophySummary } from "../components/PhilosophyProse.jsx";
import { PhilosophyVisual, scrollToPhilosophy } from "../components/PhilosophyVisual.jsx";
import { HomeQuoteBand } from "../components/HomeQuoteBand.jsx";
import { pickRandomReviews } from "../utils/pickReviews.js";

const HERO_DOGS = [
  { slug: "golden-doodle", label: "골든두들" },
  { slug: "westie", label: "화이트테리어" },
  { slug: "sheltie", label: "셔틀랜드쉽독" },
];

export function HomeMainContent({ embedded = false }) {
  const home = content.home;
  const heroDogs = HERO_DOGS.map((item) => ({ ...item, pet: filterPets({ slug: item.slug })[0] })).filter((item) => item.pet);
  const featured = filterPets({ premium: true }).slice(0, 6);
  const puppies = filterPets({ type: "puppy" }).filter((pet) => pet.index === 0).slice(0, 12);
  const kittens = filterPets({ type: "kitten" }).filter((pet) => pet.index === 0).slice(0, 12);
  const dogBreeds = breedsByType("puppy").slice(0, 14);
  const catBreeds = breedsByType("kitten").filter((breed) => breed.slug !== "ksh" && breed.slug !== "american").slice(0, 8);
  const [homeReviews] = useState(() => pickRandomReviews(content.adoptionReviews, 6));

  const onPhilosophy = (slug) => {
    if (embedded) {
      window.location.href = `/#philosophy-${slug}`;
      return;
    }
    scrollToPhilosophy(slug);
  };

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">{home.kicker}</p>
            <h1>
              {home.title.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="lede">{home.lead}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/puppies">강아지분양</Link>
              <Link className="btn btn-ghost" to="/kittens">고양이분양</Link>
            </div>
          </div>
          <div className="hero-photos">
            {heroDogs.map((item) => {
              const counts = reactions(item.pet.id);
              return (
                <Link key={item.slug} to={`/pets/${item.pet.id}`}>
                  <img src={item.pet.cover} alt={item.label} />
                  <div className="hero-meta">
                    <span className="hero-name">{item.label}</span>
                    <div className="hero-react">
                      <ReactCounts likes={counts.likes} comments={counts.comments} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <HomeQuoteBand />

      <section className="band">
        <div className="philosophy-band">
          <p className="kicker">PHILOSOPHY</p>
          <h2>{home.aboutTitle}</h2>
          {home.aboutLead ? <p className="band-lead">{home.aboutLead}</p> : null}
          <div className="philosophy-teasers">
            {content.philosophy.map((item, index) => (
              <article key={item.slug} className="philosophy-teaser">
                <span className="philosophy-teaser__num">{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.teaser}</p>
                <button type="button" className="philosophy-teaser__link" onClick={() => onPhilosophy(item.slug)}>
                  자세히 보기
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">PET MASTER CHOICE</p>
            <h2>아가몽 <em className="mark-pop">인기몽</em></h2>
          </div>
          <Link to="/puppies">전체보기</Link>
        </div>
        <div className="pet-grid">
          {featured.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">MORE BY TYPE</p>
            <h2>{home.breedTitle}</h2>
          </div>
        </div>
        <div className="breed-row">
          {dogBreeds.map((breed) => (
            <Link key={breed.slug} to={`/puppies/breed/${breed.slug}`}>
              <img src={imageUrl(breed, 1)} alt="" />
              <strong>{breed.en}</strong>
              <span>{breed.ko}</span>
            </Link>
          ))}
          <Link className="breed-more" to="/puppies/breeds">
            <span className="breed-more__circle">더보기</span>
            <strong>More</strong>
            <span>강아지</span>
          </Link>
          {catBreeds.map((breed) => (
            <Link key={breed.slug} to={`/kittens/breed/${breed.slug}`}>
              <img src={imageUrl(breed, 1)} alt="" />
              <strong>{breed.en}</strong>
              <span>{breed.ko}</span>
            </Link>
          ))}
          <Link className="breed-more" to="/kittens/breeds">
            <span className="breed-more__circle">더보기</span>
            <strong>More</strong>
            <span>고양이</span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">NEW PUPPIES</p>
            <h2>가족을 기다리는 <em className="mark-pop">아가몽</em></h2>
          </div>
          <Link to="/puppies">전체보기</Link>
        </div>
        <div className="pet-grid">
          {puppies.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">NEW KITTENS</p>
            <h2>가족을 기다리는 <em className="mark-pop">아기냥</em></h2>
          </div>
          <Link to="/kittens">전체보기</Link>
        </div>
        <div className="pet-grid">
          {kittens.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      </section>

      <section className="section philosophy-home" id={embedded ? undefined : "philosophy-guide"}>
        <div className="philosophy-home__head">
          <p className="kicker">READ MORE</p>
          <h2>분양 안내를 자세히</h2>
          <p className="lead philosophy-deep__lead">
            건강관리부터 계약, 사후관리, 업체 차이, 안심배송까지. 아가몽이 지키는 분양 안내를 차례대로 정리했습니다.
          </p>
        </div>
        <div className="philosophy-stack">
          {content.philosophy.map((item, index) => (
            <article
              key={item.slug}
              className={index % 2 === 1 ? "philosophy-article is-flip" : "philosophy-article"}
              id={embedded ? undefined : `philosophy-${item.slug}`}
            >
              <PhilosophyVisual slug={item.slug} />
              <div className="philosophy-article__copy">
                <header>
                  <span className="philosophy-article__num">{index + 1}</span>
                  <h3>{item.title}</h3>
                  <PhilosophySummary text={item.summary} />
                </header>
                <PhilosophyProse paragraphs={item.body} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section home-reviews" id={embedded ? undefined : "adoption-reviews"}>
        <div className="section-head section-head--solo">
          <div>
            <p className="kicker">REVIEW</p>
            <h2>분양후기</h2>
          </div>
        </div>
        <div className="story-grid story-grid--reviews">
          {homeReviews.map((review) => (
            <article key={`${review.title}-${review.meta}`} className="review-card">
              <h3>{review.title}</h3>
              <p>{review.body}</p>
              {review.meta ? <p className="review-card__meta">{review.meta}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
