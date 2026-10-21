import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PRIZES = ["강아지 무료분양", "5만원 할인권", "용품 무료교환권"];

export function pickLotteryPrize() {
  return PRIZES[Math.floor(Math.random() * PRIZES.length)];
}

function paintFoil(canvas) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return false;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const { width, height } = rect;
  const foil = ctx.createLinearGradient(0, 0, width, height);
  foil.addColorStop(0, "#f3eadc");
  foil.addColorStop(0.48, "#d9cbb6");
  foil.addColorStop(1, "#c3b39d");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = foil;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255, 253, 249, 0.45)";
  ctx.lineWidth = 10;
  for (let x = -height; x < width + height; x += 18) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height, height);
    ctx.stroke();
  }
  ctx.fillStyle = "#8a5a42";
  ctx.font = '400 22px "Song Myung", Batang, serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("여기를 긁어보세요", width / 2, height / 2);
  return true;
}

function scratchedRatio(canvas) {
  const ctx = canvas.getContext("2d");
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let clear = 0;
  let total = 0;
  for (let index = 3; index < data.length; index += 32) {
    total += 1;
    if (data[index] < 24) clear += 1;
  }
  return total ? clear / total : 0;
}

export function ScratchLottery({ prize, onClose }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let painted = false;
    let drawing = false;
    let last = null;
    let frame = 0;

    const tryPaint = () => {
      if (!painted) painted = paintFoil(canvas);
    };

    const pointOf = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const erase = (from, to) => {
      const ctx = canvas.getContext("2d");
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 36;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(to.x, to.y, 18, 0, Math.PI * 2);
      ctx.fill();
    };

    const finishIfOpen = () => {
      if (scratchedRatio(canvas) > 0.42) setRevealed(true);
    };

    const onDown = (event) => {
      if (!painted) return;
      drawing = true;
      last = pointOf(event);
      erase(last, last);
      canvas.setPointerCapture?.(event.pointerId);
    };
    const onMove = (event) => {
      if (!drawing || !last) return;
      event.preventDefault();
      const next = pointOf(event);
      erase(last, next);
      last = next;
      frame += 1;
      if (frame % 6 === 0) finishIfOpen();
    };
    const onUp = () => {
      if (!drawing) return;
      drawing = false;
      last = null;
      finishIfOpen();
    };

    tryPaint();
    const observer = new ResizeObserver(tryPaint);
    observer.observe(canvas);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return createPortal(
    <div className="lottery-modal" role="dialog" aria-modal="true" aria-labelledby="lottery-title">
      <button type="button" className="lottery-backdrop" aria-label="닫기" onClick={onClose} />
      <div className="lottery-card">
        <button type="button" className="lottery-close" onClick={onClose}>닫기</button>
        <p className="kicker">TODAY</p>
        <h2 id="lottery-title">아가몽 행운복권</h2>
        <p className="lottery-hint">마우스로 긁어보세요. 휴대폰에서는 화면을 문질러 주세요.</p>
        <div className={revealed ? "scratch is-revealed" : "scratch"}>
          <div className="scratch-prize">
            <span>당첨</span>
            <strong>{prize}</strong>
          </div>
          <canvas ref={canvasRef} aria-label="복권 긁는 면" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
