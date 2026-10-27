"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { Logo } from "./Logo";
import { CloseIcon, WhatsAppIcon } from "./Icons";
import { QuoteLink } from "./QuoteLink";

export function Header({ home = true }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pendingTarget = useRef<string | null>(null);
  const prefix = home ? "" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
      window.__lenis?.stop();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const onDialogClose = () => {
    setOpen(false);
    document.documentElement.style.overflow = "";
    window.__lenis?.start();
    const id = pendingTarget.current;
    pendingTarget.current = null;
    const target = id ? document.getElementById(id) : null;
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus({ preventScroll: true });
      history.replaceState(null, "", `#${id}`);
    } else {
      triggerRef.current?.focus();
    }
  };

  // Close the menu first, then scroll, so the page isn't scroll-locked while navigating.
  const goTo = (e: React.MouseEvent, href: string) => {
    if (!home) return setOpen(false);
    e.preventDefault();
    pendingTarget.current = href.replace("#", "");
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-b border-sand bg-cream/85 shadow-[0_8px_30px_-20px_rgba(23,19,15,0.35)] backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <a href={home ? "#top" : "/"} aria-label="PATCHED: לראש העמוד" className="flex min-h-11 shrink-0 items-center">
          <Logo />
        </a>

        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem] font-medium text-ink-2">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={`${prefix}${item.href}`} className="link-underline inline-flex min-h-11 min-w-11 items-center justify-center transition-colors hover:text-cherry">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <QuoteLink className="btn btn-primary !min-h-[44px] !px-5 !text-[0.95rem]">
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            הצעת מחיר
          </QuoteLink>
          <button
            ref={triggerRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper lg:hidden"
            aria-label="פתיחת תפריט"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span aria-hidden="true" className="flex w-5 flex-col gap-[6px]">
              <span className="h-[2px] w-full rounded bg-ink" />
              <span className="h-[2px] w-3/5 rounded bg-ink" />
            </span>
          </button>
        </div>
      </div>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        onClose={onDialogClose}
        aria-label="תפריט"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-cream p-0 text-ink backdrop:bg-cream"
      >
        <div className="container-x flex h-16 items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper"
            aria-label="סגירת תפריט"
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="ניווט במובייל" className="container-x mt-10">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={`${prefix}${item.href}`}
                  onClick={(e) => goTo(e, item.href)}
                  className="flex items-baseline justify-between py-5 font-display text-[2rem] font-extrabold leading-none"
                >
                  {item.label}
                  <span dir="ltr" className="font-brand text-xs font-bold tracking-widest text-cherry">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <QuoteLink onClick={() => setOpen(false)} className="btn btn-primary mt-10 w-full">
            <WhatsAppIcon className="h-5 w-5" />
            קבלו הצעה לאירוע
          </QuoteLink>
        </nav>
      </dialog>
    </header>
  );
}
