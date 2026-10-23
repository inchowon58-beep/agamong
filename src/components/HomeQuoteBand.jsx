import { useEffect, useRef, useState } from "react";

const FAMILY_COUNT = 8352;

const HEARTS = [
  { x: 8, y: 18, size: 14, delay: 0, dur: 3.2 },
  { x: 92, y: 22, size: 18, delay: 0.6, dur: 2.8 },
  { x: 15, y: 72, size: 16, delay: 1.1, dur: 3.6 },
  { x: 84, y: 68, size: 22, delay: 0.3, dur: 3.1 },
  { x: 48, y: 12, size: 12, delay: 1.8, dur: 2.6 },
  { x: 62, y: 82, size: 15, delay: 2.2, dur: 3.4 },
  { x: 28, y: 42, size: 20, delay: 0.9, dur: 2.9 },
  { x: 74, y: 38, size: 13, delay: 1.5, dur: 3.3 },
  { x: 5, y: 48, size: 17, delay: 2.6, dur: 3.5 },
  { x: 95, y: 52, size: 19, delay: 0.2, dur: 2.7 },
  { x: 38, y: 78, size: 11, delay: 1.3, dur: 3.8 },
  { x: 55, y: 28, size: 16, delay: 2.0, dur: 3.0 },
];

function formatCount(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export function HomeQuoteBand() {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [motionOk] = useState(
    () => typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!motionOk) {
      setVisible(true);
      setCount(FAMILY_COUNT);
    }
  }, [motionOk]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    if (!motionOk) {
      setCount(FAMILY_COUNT);
      return undefined;
    }
    let start = null;
    let raf = 0;
    const duration = 2600;

    function tick(ts) {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      setCount(Math.round(FAMILY_COUNT * easeOutCubic(progress)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, motionOk]);

  return (
    <section className="quote-band" aria-label="집으로 돌아갈 이유">
      <div ref={rootRef} className={visible ? "home-quote is-live" : "home-quote"}>
        <img src="/hero/banner-together.jpg" alt="" />
        {motionOk ? (
          <div className="home-quote__hearts" aria-hidden="true">
            {HEARTS.map((heart) => (
              <span
                key={`${heart.x}-${heart.y}-${heart.delay}`}
                className="home-quote__heart"
                style={{
                  "--hx": `${heart.x}%`,
                  "--hy": `${heart.y}%`,
                  "--hs": `${heart.size}px`,
                  "--hd": `${heart.delay}s`,
                  "--ht": `${heart.dur}s`,
                }}
              />
            ))}
          </div>
        ) : null}
        <p className="home-quote__lines">
          <span className="q-sm home-quote__line">나는 오늘</span>
          <span className="q-md home-quote__line">집으로 돌아갈 이유가</span>
          <span className="q-lg home-quote__line">하나 더 생겼습니다</span>
        </p>
        <p className="home-quote__note">
          <strong>
            아가몽과 함께 가족이 된 <b>{formatCount(count)}</b>가정
          </strong>
          <span>작은 만남이 모여 수많은 가족의 이야기가 되었습니다.</span>
        </p>
      </div>
    </section>
  );
}
