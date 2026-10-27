import { how, steps } from "@/content/site";
import { Media } from "./Media";
import { Cherries, Smiley } from "./Stickers";
import { QuoteLink } from "./QuoteLink";

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="pb-20 pt-4 lg:pb-28">
      <div className="container-x">
        <div className="card relative overflow-hidden !rounded-[36px] px-5 py-14 sm:px-10 lg:!rounded-[44px] lg:px-16 lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-32 h-[480px] w-[480px] rounded-full bg-glow/20 blur-[110px]" />
          <div aria-hidden="true" className="bg-word absolute -bottom-[0.12em] left-1/2 -translate-x-1/2 text-[22vw] text-cream lg:text-[15vw]" data-word="YOUR DESIGN" />

          <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="eyebrow" data-reveal>{how.eyebrow}</p>
              <h2 id="how-title" className="display-lg mt-5" data-reveal>{how.title}</h2>
              <ol className="mt-10 space-y-7 lg:mt-12">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-5" data-reveal>
                    <span dir="ltr" className="font-brand text-[2.4rem] font-[900] italic leading-none text-cherry">{s.n}</span>
                    <div>
                      <h3 className="text-[1.45rem] font-bold">{s.title}</h3>
                      <p className="mt-1.5 max-w-md text-ink-2">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <QuoteLink className="btn btn-primary mt-10" data-reveal>קבלו הצעה לאירוע</QuoteLink>
            </div>

            <div className="relative mx-auto w-full max-w-[460px] lg:col-span-6" data-reveal>
              {/* Arch frame, like a doorway into the event */}
              <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[32px] shadow-[0_40px_80px_-36px_rgba(23,19,15,0.5)]">
                <Media media={how.media} />
              </div>
              <div aria-hidden="true" className="absolute -right-6 top-[12%] w-[22%]">
                <div className="float-y" style={{ ["--r" as string]: "10deg" }}>
                  <Cherries className="sticker w-full" />
                </div>
              </div>
              <div aria-hidden="true" className="absolute -left-5 bottom-[14%] w-[19%]">
                <div className="float-y" style={{ ["--r" as string]: "-8deg", animationDelay: "1.4s" }}>
                  <Smiley className="sticker w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
