"use client";

import { useEffect, useRef } from "react";
import type { Media as MediaT } from "@/content/site";

type Props = {
  media: MediaT;
  className?: string;
  /** Load eagerly (above the fold) */
  priority?: boolean;
  /** Extra classes for the placeholder label (e.g. to center it inside a clipped frame) */
  contentClassName?: string;
};

/**
 * Renders a real image/video when `src` is set, otherwise a clearly marked placeholder frame.
 * Videos autoplay muted only when motion is allowed and pause when off-screen.
 */
export function Media({ media, className = "", priority = false, contentClassName = "" }: Props) {
  if (!media.src) return <Placeholder label={media.placeholder} kind={media.kind} className={className} contentClassName={contentClassName} />;
  if (media.kind === "video") return <AutoVideo media={media} className={className} priority={priority} />;
  return (
    <img
      src={media.src}
      srcSet={media.srcSmall ? `${media.srcSmall} 800w, ${media.src} 1536w` : undefined}
      sizes={media.srcSmall ? "(min-width: 1024px) 50vw, 100vw" : undefined}
      alt={media.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function AutoVideo({ media, className, priority }: { media: MediaT; className: string; priority: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      src={media.src}
      poster={media.poster || undefined}
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      aria-label={media.alt}
    />
  );
}

export function Placeholder({ label, kind, className = "", contentClassName = "" }: { label: string; kind: "image" | "video"; className?: string; contentClassName?: string }) {
  return (
    <div
      role="img"
      aria-label={`מקום שמור ל${kind === "video" ? "סרטון" : "תמונה"}: ${label}`}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#efe6da,#e6dacb)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-3 rounded-[inherit] border-2 border-dashed border-[#cdbfae]" />
      <div className={`relative flex max-w-[80%] flex-col items-center gap-2.5 text-center ${contentClassName}`}>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-muted shadow-sm" aria-hidden="true">
          {kind === "video" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-8 8" /></svg>
          )}
        </span>
        <span className="text-sm font-medium leading-snug text-muted">{label}</span>
      </div>
    </div>
  );
}
