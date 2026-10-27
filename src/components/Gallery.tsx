"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gallery as allPhotos } from "@/content/site";

// Only photos that exist are shown
const gallery = allPhotos.filter((m) => m.src);
import { Media } from "./Media";
import { ChevronIcon, CloseIcon } from "./Icons";

const tiles = [
  "col-span-2 aspect-[16/10] md:col-span-4",
  "aspect-[4/5] md:col-span-2 md:row-span-2 md:aspect-auto",
  "aspect-[4/5] md:col-span-2 md:aspect-[4/3]",
  "col-span-2 aspect-[16/10] md:col-span-2 md:aspect-[4/3]",
  "aspect-[4/5] md:col-span-3 md:aspect-[3/2]",
  "aspect-[4/5] md:col-span-3 md:aspect-[3/2]",
];

function label(i: number) {
  return gallery[i].alt || gallery[i].placeholder;
}

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const n = gallery.length;

  const open = (i: number, el: HTMLElement) => {
    returnFocus.current = el;
    setIndex(i);
  };
  const close = useCallback(() => dialogRef.current?.close(), []);
  const go = useCallback((delta: number) => setIndex((i) => (i === null ? i : (i + delta + n) % n)), [n]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
      window.__lenis?.stop();
    }
  }, [index]);

  const onClose = () => {
    setIndex(null);
    document.documentElement.style.overflow = "";
    window.__lenis?.start();
    returnFocus.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // RTL: left arrow moves forward
    if (e.key === "ArrowLeft") go(1);
    else if (e.key === "ArrowRight") go(-1);
  };

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section-y">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow" data-reveal>גלריה</p>
            <h2 id="gallery-title" className="display-lg mt-5" data-reveal>רגעים מהעמדה.</h2>
          </div>
          <p className="max-w-sm text-ink-2" data-reveal>לחצו על תמונה כדי לראות אותה במסך מלא.</p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-5 lg:mt-16">
          {gallery.map((m, i) => (
            <li key={i} className={tiles[i % tiles.length]} data-reveal>
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                aria-label={`פתיחה במסך מלא: ${label(i)}`}
                className="photo group relative block h-full w-full"
              >
                <span className="block h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]">
                  <Media media={m} />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" /></svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        onClose={onClose}
        onKeyDown={onKeyDown}
        aria-label="גלריה במסך מלא"
        className="on-dark m-0 h-[100dvh] max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/90"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {index !== null && (
          <div
            className="flex h-full flex-col"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) go(dx > 0 ? 1 : -1); // RTL: swipe right = next
              touchX.current = null;
            }}
          >
            <div className="container-x flex h-16 shrink-0 items-center justify-between">
              <p aria-live="polite" dir="ltr" className="text-sm tracking-widest text-[#cdbfae]">
                {index + 1} / {n}
              </p>
              <button type="button" onClick={close} aria-label="סגירה" className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/25">
                <CloseIcon />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-20">
              <div key={index} className="panel-in h-full max-h-[80vh] w-full max-w-5xl overflow-hidden rounded-[18px]">
                <Media media={gallery[index]} className="!object-contain" />
              </div>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="התמונה הקודמת"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/25 bg-ink/70 md:right-6"
              >
                <ChevronIcon dir="right" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="התמונה הבאה"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/25 bg-ink/70 md:left-6"
              >
                <ChevronIcon dir="left" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
