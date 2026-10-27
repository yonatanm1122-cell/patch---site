import { experience } from "@/content/site";
import { Media } from "./Media";

// Editorial composition; tiles drift at slightly different speeds on desktop (data-speed).
const layout = [
  { tile: "col-span-2 aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[620px]", speed: undefined },
  { tile: "aspect-[4/5] lg:col-span-5 lg:aspect-[5/4]", speed: "0.12" },
  { tile: "aspect-[4/5] lg:col-span-5 lg:col-start-8 lg:aspect-[5/4]", speed: "0.2" },
  { tile: "aspect-square lg:col-span-5 lg:aspect-[5/4]", speed: "0.08" },
  { tile: "aspect-square lg:col-span-7 lg:aspect-[16/9]", speed: "0.14" },
];

export function Experience() {
  // Only real photos are shown; missing ones simply drop out of the grid until they arrive.
  const items = experience.items.filter((m) => m.src);
  return (
    <section aria-labelledby="exp-title" className="section-y relative">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>{experience.eyebrow}</p>
            <h2 id="exp-title" className="display-lg mt-5" data-reveal>{experience.title}</h2>
          </div>
          <p className="text-lg text-ink-2 lg:col-span-4 lg:col-start-9" data-reveal>{experience.lead}</p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:gap-5 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          {items.map((item, i) => (
            <li key={item.caption} className={`${layout[i].tile} group relative`} data-reveal>
              <figure className="photo relative h-full w-full" data-speed={layout[i].speed}>
                <div className="h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]">
                  <Media media={item} />
                </div>
                <figcaption className="absolute bottom-3 right-3 rounded-full bg-paper/90 px-3.5 py-1 text-sm font-semibold text-ink shadow-sm backdrop-blur lg:bottom-5 lg:right-5">
                  {item.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
