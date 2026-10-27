"use client";

import { useState } from "react";
import { faq } from "@/content/site";
import { PlusIcon } from "./Icons";
import { QuoteLink } from "./QuoteLink";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-paper">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow" data-reveal>שאלות נפוצות</p>
            <h2 id="faq-title" className="display-lg mt-5" data-reveal>מה שואלים אותנו.</h2>
            <p className="mt-5 max-w-xs text-ink-2" data-reveal>
              לא מצאתם תשובה? <QuoteLink className="font-semibold text-cherry-deep underline decoration-cherry decoration-2 underline-offset-4" context="שאלה על העמדה">שאלו אותנו ישירות</QuoteLink>.
            </p>
          </div>
        </div>
        <ul className="space-y-3 lg:col-span-8">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className={`rounded-[22px] border transition-colors duration-300 ${isOpen ? "border-ink/15 bg-cream" : "border-sand bg-cream/60"}`} data-reveal>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-[64px] w-full items-center justify-between gap-6 px-5 py-4 text-right text-[1.15rem] font-bold leading-snug md:px-7 md:text-[1.3rem]"
                  >
                    {item.q}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                        isOpen ? "rotate-45 bg-cherry text-paper" : "bg-paper text-ink shadow-sm"
                      }`}
                    >
                      <PlusIcon />
                    </span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen} className="faq-panel">
                  <p className="max-w-2xl px-5 pb-6 text-[1.05rem] leading-relaxed text-ink-2 md:px-7">{item.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
