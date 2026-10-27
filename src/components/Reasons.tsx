import { reasons } from "@/content/site";
import { ArrowIcon } from "./Icons";
import { Heart } from "./Stickers";
import { QuoteLink } from "./QuoteLink";

const icons = [
  // hand / interact, sparkle, shirt, palette, team, truck-ish
  "M7 11V6a2 2 0 114 0v5m0-1V4a2 2 0 114 0v6m0-1a2 2 0 114 0v5a7 7 0 01-7 7h-1a7 7 0 01-6-3.5L3 13a2 2 0 013-2.5l1 1",
  "M12 3l2.2 5.6L20 9.5l-4.5 3.8 1.4 5.7L12 16l-4.9 3 1.4-5.7L4 9.5l5.8-.9z",
  "M8 3L3 6l2 5 2-1v11h10V10l2 1 2-5-5-3c-.6 1.8-2.2 3-4 3S8.6 4.8 8 3z",
  "M12 3a9 9 0 100 18c1 0 1.5-.8 1.5-1.6 0-.9-.7-1.4-.7-2.3 0-1 .8-1.6 1.8-1.6H17a4 4 0 004-4c0-4.7-4-8.5-9-8.5zM7.5 12a1 1 0 100-2 1 1 0 000 2zm3-4a1 1 0 100-2 1 1 0 000 2zm4.5 0a1 1 0 100-2 1 1 0 000 2z",
  "M16 11a3 3 0 100-6 3 3 0 000 6zM8 11a3 3 0 100-6 3 3 0 000 6zm0 2c-3 0-6 1.5-6 4v2h12v-2c0-2.5-3-4-6-4zm8 0c-.5 0-1 0-1.5.1 1.5.9 2.5 2.2 2.5 3.9v2h5v-2c0-2.5-3-4-6-4z",
  "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z",
];

export function Reasons() {
  return (
    <section aria-labelledby="why-title" className="section-y relative overflow-hidden bg-paper">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow" data-reveal>למה PATCHED</p>
            <h2 id="why-title" className="display-lg mt-5 max-w-2xl" data-reveal>
              מתנה שהאורחים לא שוכחים על השולחן.
            </h2>
          </div>
          <div aria-hidden="true" className="hidden w-28 shrink-0 lg:block">
            <div className="float-y" style={{ ["--r" as string]: "-10deg" }}>
              <Heart className="sticker w-full" />
            </div>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {reasons.map((r, i) => (
            <li key={r.title} className="rounded-[26px] border border-sand bg-cream p-7 transition-transform duration-500 hover:-translate-y-1" data-reveal>
              <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-cherry shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icons[i % icons.length]} />
                </svg>
              </span>
              <h3 className="mt-5 text-[1.35rem] font-bold leading-tight">{r.title}</h3>
              <p className="mt-2 text-ink-2">{r.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-[26px] bg-ink p-7 text-paper sm:flex-row sm:items-center sm:justify-between lg:p-9" data-reveal>
          <p className="text-[1.5rem] font-bold leading-snug">רוצים לראות איך זה ייראה באירוע שלכם?</p>
          <QuoteLink className="btn bg-paper text-ink hover:bg-glow">
            קבלו הצעה לאירוע
            <ArrowIcon />
          </QuoteLink>
        </div>
      </div>
    </section>
  );
}
