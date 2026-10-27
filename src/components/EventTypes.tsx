"use client";

import { useRef, useState } from "react";
import { eventTypes, eventTypeToOption } from "@/content/site";
import { Media } from "./Media";
import { WhatsAppIcon } from "./Icons";
import { QuoteLink } from "./QuoteLink";

export const PREFILL_EVENT = "patched:prefill";

/** Accessible tabs (WAI-ARIA pattern, RTL-aware arrow keys). The CTA pre-fills the event type in the form. */
export function EventTypes() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = eventTypes.length;
    let next = active;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = (active + 1) % n; // RTL: left = next
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = eventTypes[active];
  const hasMedia = Boolean(current.media.src);

  return (
    <section id="events" aria-labelledby="events-title" className="section-y relative overflow-hidden bg-paper">
      <div className="container-x">
        <div aria-hidden="true" className="bg-word absolute -top-[0.08em] left-0 text-[20vw] text-cream lg:text-[14vw]" data-word="EVENTS" />
        <p className="eyebrow relative" data-reveal>לאילו אירועים</p>
        <h2 id="events-title" className="display-lg relative mt-5 max-w-3xl" data-reveal>
          אותה עמדה. ארבעה סיפורים שונים.
        </h2>

        <div className="relative mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div
            role="tablist"
            aria-label="סוגי אירועים"
            onKeyDown={onKeyDown}
            className="grid grid-cols-2 gap-2 lg:col-span-4 lg:flex lg:flex-col lg:gap-3"
          >
            {eventTypes.map((t, i) => {
              const selected = i === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-right transition-all duration-300 lg:rounded-[22px] lg:px-6 lg:py-5 ${
                    selected ? "border-ink bg-ink text-paper shadow-lg" : "border-line bg-cream text-ink-2 hover:border-ink hover:text-ink"
                  }`}
                >
                  <span className="font-display text-lg font-bold leading-tight sm:text-xl lg:text-[1.6rem]">{t.label}</span>
                  <span
                    aria-hidden="true"
                    className={`hidden h-3 w-3 shrink-0 rounded-full transition-all duration-500 lg:block ${
                      selected ? "scale-125 bg-cherry" : "bg-line"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            tabIndex={0}
            className="lg:col-span-8"
          >
            <div key={current.id} className={`panel-in grid gap-8 md:items-center lg:gap-12 ${hasMedia ? "md:grid-cols-2" : "max-w-2xl"}`}>
              {hasMedia && (
                <div className="photo aspect-[4/5] md:order-2">
                  <Media media={current.media} />
                </div>
              )}
              <div>
                <h3 className="display-md">{current.title}</h3>
                <p className="mt-5 text-lg leading-relaxed text-ink-2">{current.body}</p>
                <p className="mt-7 text-sm font-semibold text-muted">איפה זה משתלב:</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {current.moments.map((m) => (
                    <li key={m} className="chip">
                      {m}
                    </li>
                  ))}
                </ul>
                <QuoteLink className="btn btn-primary mt-9" context={eventTypeToOption[current.id]}>
                  <WhatsAppIcon className="h-5 w-5" />
                  קבלו הצעה לאירוע שלכם
                </QuoteLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
