"use client";

import { useEffect, useRef } from "react";
import { statement } from "@/content/site";
import { loadMotion, prefersReducedMotion } from "@/lib/motion";

/** The brand sentence darkens word by word as you scroll, so it's read at the intended pace. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = statement.text.split(" ");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let cleanup = () => {};
    loadMotion().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const mm = gsap.matchMedia();
      cleanup = () => mm.revert();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // #8d8378 keeps ≥3:1 contrast on cream (large text, WCAG AA) before the word "lights up"
        gsap.fromTo(
          ref.current!.querySelectorAll("[data-word]"),
          { color: "#8d8378" },
          { color: "#17130f", ease: "none", stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 45%", scrub: true } },
        );
      });
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section aria-label="מה זה PATCHED" className="relative py-20 lg:py-28">
      <div className="container-x">
        <p ref={ref} className="mx-auto max-w-[24ch] text-center font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-extrabold leading-[1.15]">
          {words.map((w, i) => (
            <span key={i} data-word>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
