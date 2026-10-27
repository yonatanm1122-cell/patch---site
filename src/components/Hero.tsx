"use client";

import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import { hero } from "@/content/site";
import { loadMotion, prefersReducedMotion } from "@/lib/motion";
import { ArrowIcon, WhatsAppIcon } from "./Icons";
import { Cherries, Disco, GoodVibes, Heart, Palm, Smiley } from "./Stickers";
import { QuoteLink } from "./QuoteLink";

// Hinge of the press lid inside the product image (percent of width / height)
const HINGE = "51.4% 33.3%";
const SIZES = "(min-width: 1024px) 760px, 92vw";

const stickers = [
  { C: Cherries, pos: "left-[1%] top-[2%] w-[15%]", r: "-10deg", depth: 1.4 },
  { C: Heart, pos: "left-[29%] -top-[7%] w-[11%]", r: "8deg", depth: 0.9 },
  { C: Smiley, pos: "left-[87%] top-[8%] w-[11.5%]", r: "12deg", depth: 1.2 },
  { C: Palm, pos: "-left-[3%] top-[46%] w-[12%]", r: "-6deg", depth: 1.6 },
  { C: Disco, pos: "left-[90%] top-[50%] w-[10.5%]", r: "6deg", depth: 1 },
  { C: GoodVibes, pos: "left-[3%] top-[80%] w-[17%]", r: "-8deg", depth: 1.3 },
];

/**
 * Cinematic opening: the real PATCHED bar, cut out of its photo. On scroll the camera pushes in on the press,
 * the lid closes onto the shirt (warm glow = heat), opens again, while the design stickers drift away.
 * Mobile: same idea without pinning. Reduced motion: a still image.
 */
export function Hero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let cleanup = () => {};
    loadMotion().then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      cleanup = () => mm.revert();

      // Desktop: pinned, scrubbed story
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: pinRef.current, start: "top top", end: "bottom bottom", scrub: 0.7 },
        });
        tl.to(copyRef.current, { opacity: 0, y: -60, duration: 0.3, ease: "power1.in" }, 0)
          .to(productRef.current, { xPercent: 31, yPercent: 24, scale: 1.55, duration: 0.55, ease: "power2.inOut" }, 0)
          .to(wordRef.current, { xPercent: 18, duration: 1 }, 0)
          .to(lidRef.current, { rotate: -13, duration: 0.22, ease: "power2.in" }, 0.25)
          .to(glowRef.current, { opacity: 1, duration: 0.08 }, 0.45)
          .to(glowRef.current, { opacity: 0, duration: 0.2 }, 0.6)
          .to(lidRef.current, { rotate: 0, duration: 0.22, ease: "power2.out" }, 0.62)
          .fromTo(captionRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.18 }, 0.66);
        stickerRefs.current.forEach((el, i) => {
          if (!el) return;
          const d = stickers[i].depth;
          tl.to(el, { xPercent: (i % 2 ? 1 : -1) * 120 * d, yPercent: -90 * d, rotate: (i % 2 ? 1 : -1) * 25, opacity: 0, duration: 0.5, ease: "power1.in" }, 0.05);
        });
      });

      // Mobile: the lid presses as the image scrolls through the viewport
      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: productRef.current, start: "top 75%", end: "bottom 25%", scrub: 0.5 },
        });
        tl.to(lidRef.current, { rotate: -13, duration: 0.4, ease: "power2.in" }, 0)
          .to(glowRef.current, { opacity: 1, duration: 0.1 }, 0.4)
          .to(glowRef.current, { opacity: 0, duration: 0.2 }, 0.55)
          .to(lidRef.current, { rotate: 0, duration: 0.35, ease: "power2.out" }, 0.6);
        stickerRefs.current.forEach((el, i) => {
          if (el) tl.to(el, { yPercent: -40 * stickers[i].depth, duration: 1 }, 0);
        });
      });
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const { product } = hero;
  // The cut-out bar is the largest element on first paint: start fetching it with the HTML.
  preload(product.base.src, {
    as: "image",
    imageSrcSet: `${product.base.srcSmall} 760w, /media/hero-base-1000.webp 1000w, ${product.base.src} 1420w`,
    imageSizes: SIZES,
    fetchPriority: "high",
  });

  return (
    <section id="top" aria-labelledby="hero-title" className="relative">
      <div ref={pinRef} className="relative lg:motion-safe:h-[240vh]">
        <div className="relative overflow-x-clip pb-14 pt-28 lg:flex lg:h-screen lg:items-center lg:pb-0 lg:pt-16 lg:motion-safe:sticky lg:motion-safe:top-0">
          {/* Giant background word */}
          <div
            ref={wordRef}
            aria-hidden="true"
            className="bg-word absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 text-[34vw] text-sand lg:top-1/2 lg:text-[23vw]"
           data-word="PATCHED" />

          <div className="container-x relative grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
            {/* Copy */}
            <div ref={copyRef} className="relative z-10 lg:col-span-5">
              <p className="eyebrow hero-in" style={{ animationDelay: "0.05s" }}>
                <span dir="ltr">Custom Bar</span> לאירועים
              </p>
              <h1 id="hero-title" className="hero-in mt-5 text-[clamp(2.9rem,12vw,4.4rem)] font-[900] leading-[0.98] lg:text-[clamp(3.6rem,5.2vw,5.4rem)]" style={{ animationDelay: "0.12s" }}>
                {hero.title.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
                <span className="mt-3 block text-[clamp(1.45rem,3vw,2.25rem)] font-bold leading-tight text-cherry">{hero.subtitle}</span>
              </h1>
              <p className="hero-in mt-5 max-w-[32rem] text-[1.08rem] text-ink-2" style={{ animationDelay: "0.25s" }}>{hero.lead}</p>
              <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.35s" }}>
                <QuoteLink className="btn btn-primary">
                  <WhatsAppIcon className="h-5 w-5" />
                  {hero.primaryCta}
                </QuoteLink>
                <a href="#how" className="btn btn-ghost">
                  {hero.secondaryCta}
                  <ArrowIcon />
                </a>
              </div>
              <ul className="hero-in mt-7 flex flex-wrap gap-2" style={{ animationDelay: "0.45s" }} aria-label="סוגי אירועים">
                {hero.chips.map((c) => (
                  <li key={c} className="chip">{c}</li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div className="relative lg:col-span-7">
              <div ref={productRef} className="relative mx-auto w-full max-w-[760px] will-change-transform" style={{ aspectRatio: `${product.width} / ${product.height}`, transformOrigin: "57% 21%" }}>
                <div aria-hidden="true" className="absolute inset-[8%_6%_0] rounded-[50%] bg-[radial-gradient(closest-side,rgba(233,169,85,0.35),transparent)] blur-2xl" />
                <img
                  src={product.base.src}
                  srcSet={`${product.base.srcSmall} 760w, /media/hero-base-1000.webp 1000w, ${product.base.src} 1420w`}
                  sizes={SIZES}
                  width={product.width}
                  height={product.height}
                  alt={product.alt}
                  fetchPriority="high"
                  decoding="async"
                  className="relative h-full w-full object-contain drop-shadow-[0_40px_40px_rgba(23,19,15,0.25)]"
                />
                <img
                  ref={lidRef}
                  src={product.lid.src}
                  srcSet={`${product.lid.srcSmall} 760w, /media/hero-lid-1000.webp 1000w, ${product.lid.src} 1420w`}
                  sizes={SIZES}
                  width={product.width}
                  height={product.height}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ transformOrigin: HINGE }}
                />
                {/* Heat glow when the press closes */}
                <div
                  ref={glowRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[48%] top-[22%] h-[30%] w-[36%] rounded-full bg-[radial-gradient(closest-side,rgba(255,196,120,0.9),rgba(233,169,85,0.35),transparent)] opacity-0 mix-blend-screen blur-md"
                />
                {stickers.map(({ C, pos, r, depth }, i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      stickerRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className={`absolute ${pos}`}
                  >
                    <div className="float-y" style={{ ["--r" as string]: r, animationDelay: `${i * 0.7}s`, animationDuration: `${5 + depth * 1.5}s` }}>
                      <C className="sticker h-auto w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p
            ref={captionRef}
            className="pointer-events-none absolute top-24 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-6 py-3 text-lg font-semibold text-paper opacity-0 shadow-xl lg:motion-safe:block"
          >
            לחיצה אחת, והעיצוב שלכם על החולצה.
          </p>
        </div>
      </div>
    </section>
  );
}
