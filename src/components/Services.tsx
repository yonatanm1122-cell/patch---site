import { services } from "@/content/site";
import { Media } from "./Media";
import { ShirtWallArt } from "./ShirtWallArt";
import { ArrowIcon } from "./Icons";
import { QuoteLink } from "./QuoteLink";

const statusLabel = { active: "פעיל", "on-request": "בתיאום מראש" } as const;

export function Services() {
  return (
    <section id="experiences" aria-labelledby="services-title" className="section-y relative">
      <div className="container-x">
        <p className="eyebrow" data-reveal>החוויות שלנו</p>
        <h2 id="services-title" className="display-lg mt-5 max-w-3xl" data-reveal>
          לא מוצרים. רגעים שקורים באירוע.
        </h2>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {services.map((s) => {
            const showArt = s.id === "shirt-wall" && !s.media.src;
            return (
              <article key={s.id} aria-labelledby={`svc-${s.id}`} className="card flex flex-col overflow-hidden p-3 sm:p-4" data-reveal>
                <div className="relative aspect-[16/11] overflow-hidden rounded-[22px]">
                  {showArt ? <ShirtWallArt /> : <Media media={s.media} />}
                  {s.status === "on-request" && (
                    <span className="absolute right-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                      הדמיה
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-3 pb-4 pt-6 sm:px-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 id={`svc-${s.id}`} dir="ltr" className="font-brand text-sm font-extrabold tracking-[0.14em] text-ink">
                      {s.name.toUpperCase()}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        s.status === "active" ? "bg-ink text-paper" : "border border-cherry text-cherry-deep"
                      }`}
                    >
                      {statusLabel[s.status]}
                    </span>
                  </div>
                  <p className="display-md mt-3">{s.title}</p>
                  <p className="mt-4 text-[1.05rem] text-ink-2">{s.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-ink-2">
                        <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cherry/10 text-cherry">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5 9-10" /></svg>
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {s.status === "on-request" && (
                    <p className="mt-5 text-sm text-muted">קונספט חדש שאנחנו מציעים בתיאום מראש. ספרו לנו על האירוע ונבדוק התאמה.</p>
                  )}
                  <div className="mt-auto pt-8">
                    <QuoteLink className="btn btn-ghost" context={s.id === "shirt-wall" ? "Shirt Wall באירוע שלי" : "עמדת Custom Bar באירוע שלי"}>
                      {s.status === "on-request" ? "בדקו התאמה לאירוע שלכם" : "קבלו הצעה לאירוע"}
                      <ArrowIcon />
                    </QuoteLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
