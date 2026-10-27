import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";

type Motion = { gsap: typeof GSAP; ScrollTrigger: typeof ST };
let pending: Promise<Motion> | null = null;

/**
 * Loads GSAP + ScrollTrigger on demand, so the animation code stays out of the initial bundle
 * and never loads for visitors who prefer reduced motion.
 */
export function loadMotion(): Promise<Motion> {
  pending ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
  });
  return pending;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
