import { Link } from "react-router-dom";
import { breedsByType, content, filterPets, imageUrl } from "../data/index.js";
import { BannerSlot, ReactCounts, reactions } from "../components/Bits.jsx";
import { PetCard } from "../components/PetCard.jsx";
import { usePageTitle } from "../usePageTitle.js";

const HERO_DOGS = [
  { slug: "doodle", label: "골든두들" },
  { slug: "whiteterrier", label: "화이트테리어" },
  { slug: "sheltie", label: "셔틀랜드쉽독" },
];

export function Home() {
  const home = content.home;
  usePageTitle("");
  const heroDogs = HERO_DOGS.map((item) => ({ ...item, pet: filterPets({ slug: item.slug })[0] })).filter((item) => item.pet);
  const featured = filterPets({ premium: true }).slice(0, 6);
  const puppies = filterPets({ type: "puppy" }).filter((pet) => pet.index === 0).slice(0, 12);
  const kittens = filterPets({ type: "kitten" }).filter((pet) => pet.index === 0).slice(0, 12);
  const dogBreeds = breedsByType("puppy").slice(0, 14);
  const catBreeds = breedsByType("kitten").filter((breed) => breed.slug !== "ksh" && breed.slug !== "american").slice(0, 8);

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

      <section className="quote-band" aria-label="집으로 돌아갈 이유">
        <div className="home-quote">
          <img src="/hero/banner-together.jpg" alt="" />
          <p>
            <span className="q-sm">나는 오늘</span>
            <span className="q-md">집으로 돌아갈 이유가</span>
            <span className="q-lg">하나 더 생겼습니다</span>
          </p>
          <p className="home-quote__note">
            <strong>아가몽과 함께 가족이 된 <b>2,634</b>가정</strong>
            <span>작은 만남이 모여 수많은 가족의 이야기가 되었습니다.</span>
          </p>
        </div>
      </section>

      <section className="band">
        <div className="philosophy-band">
          <p className="kicker">PHILOSOPHY</p>
          <h2>{home.aboutTitle}</h2>
          {home.aboutLead ? <p className="band-lead">{home.aboutLead}</p> : null}
          <div className="philosophy-note">
            {content.philosophy.map((item) => (
              <p key={item.slug}>
                <Link to={`/philosophy/${item.slug}`}>{item.title}</Link>
                {" — "}
                {item.teaser}
              </p>
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
              <img src={imageUrl(breed.folder, 1)} alt="" />
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
              <img src={imageUrl(breed.folder, 1)} alt="" />
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

      <section className="section philosophy-deep">
        <div className="section-head">
          <div>
            <p className="kicker">READ MORE</p>
            <h2>분양 안내를 자세히</h2>
            <p className="lead philosophy-deep__lead">건강관리부터 계약, 사후관리, 업체 차이, 안심배송까지. 궁금한 항목을 눌러 전체 내용을 확인하세요.</p>
          </div>
        </div>
        <div className="philosophy-cards">
          {content.philosophy.map((item, index) => (
            <Link key={item.slug} to={`/philosophy/${item.slug}`} className="philosophy-card">
              <span className="philosophy-card__num">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <em>자세히 보기</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">STORIES</p>
            <h2>상담에서 자주 나오는 이야기</h2>
          </div>
          <Link to="/reviews">이야기 더보기</Link>
        </div>
        <div className="story-grid">
          {content.stories.slice(0, 3).map((story) => (
            <article key={story.title}>
              <h3>{story.title}</h3>
              <p>{story.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="kicker">PLACE</p>
            <h2>전국 지점안내</h2>
          </div>
        </div>
        <div className="region-grid">
          {["수도권", "강원", "충청", "호남", "영남", "제주"].map((name) => (
            <Link key={name} to="/place">{name}</Link>
          ))}
        </div>
        <div className="section-gap">
          <BannerSlot id="map-visual" label="지점 안내 배너" note="지도 이미지는 이후 제작" />
        </div>
      </section>
    </>
  );
}
