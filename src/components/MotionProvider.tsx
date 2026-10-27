"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { loadMotion, prefersReducedMotion } from "@/lib/motion";

declare global {
  interface Window {
    __patchedMotion?: boolean;
    __lenis?: Lenis;
  }
}

/**
 * Global motion layer: smooth scrolling (desktop pointer only), reveal-on-scroll and gentle parallax.
 * Libraries load after first render; nothing loads when the user prefers reduced motion.
 */
export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.remove("js-motion");
      return;
    }

    let cancelled = false;
    let cleanup = () => {};
    const desktopPointer = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;

    Promise.all([loadMotion(), desktopPointer ? import("lenis").then((m) => m.default) : null])
      .then(([{ gsap, ScrollTrigger }, LenisCtor]) => {
        if (cancelled) return;
        window.__patchedMotion = true;

        let lenis: Lenis | undefined;
        let tick: ((t: number) => void) | undefined;
        if (LenisCtor) {
          lenis = new LenisCtor({ lerp: 0.11, wheelMultiplier: 0.95 });
          window.__lenis = lenis;
          lenis.on("scroll", ScrollTrigger.update);
          tick = (t: number) => lenis!.raf(t * 1000);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
        }

        // In-page anchors: smooth scroll, then move keyboard focus to the target section.
        const onClick = (e: MouseEvent) => {
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
          if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
          const id = a.getAttribute("href")!.slice(1);
          const target = id ? document.getElementById(id) : null;
          if (!target) return;
          e.preventDefault();
          const focusTarget = () => {
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          };
          history.replaceState(null, "", `#${id}`);
          if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.2, onComplete: focusTarget });
          else {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            focusTarget();
          }
        };
        document.addEventListener("click", onClick);

        // Deep links (/#faq): make sure we land on the section once motion is set up.
        const hashTarget = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
        if (hashTarget) hashTarget.scrollIntoView({ block: "start" });

        const ctx = gsap.context(() => {
          // Elements already scrolled past (deep links, restored scroll) appear instantly;
          // only those on screen animate, so they don't wait behind a long stagger.
          const reveal = (els: Element[]) => {
            const past = els.filter((el) => el.getBoundingClientRect().bottom <= 0);
            if (past.length) gsap.set(past, { opacity: 1, y: 0, overwrite: true });
            const onScreen = els.filter((el) => el.getBoundingClientRect().bottom > 0);
            if (onScreen.length) gsap.to(onScreen, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.09, overwrite: true });
          };
          reveal(gsap.utils.toArray<Element>("[data-reveal]").filter((el) => el.getBoundingClientRect().top < window.innerHeight));
          ScrollTrigger.batch("[data-reveal]", { start: "top 90%", once: true, onEnter: reveal, onEnterBack: reveal });

          gsap.matchMedia().add("(min-width: 1024px)", () => {
            gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
              const speed = Number(el.dataset.speed) || 0.1;
              gsap.fromTo(
                el,
                { yPercent: speed * 40 },
                { yPercent: -speed * 40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
              );
            });
          });
        });

        // Fonts and media can shift layout; recompute trigger positions once settled.
        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener("load", refresh);

        cleanup = () => {
          document.removeEventListener("click", onClick);
          window.removeEventListener("load", refresh);
          ctx.revert();
          if (tick) gsap.ticker.remove(tick);
          lenis?.destroy();
          window.__lenis = undefined;
        };
      })
      .catch(() => root.classList.remove("js-motion")); // never leave content hidden

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
