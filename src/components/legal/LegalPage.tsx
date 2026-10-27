import { Header } from "../Header";
import { Footer } from "../Footer";

/** Shared shell for text pages. Owner-supplied details are marked with <Fill>. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Header home={false} />
      <main id="main" tabIndex={-1} className="outline-none">
        <article className="container-x max-w-3xl pb-24 pt-32 lg:pt-40">
          <h1 className="display-lg">{title}</h1>
          <p className="mt-4 text-sm text-muted">עודכן לאחרונה: {updated}</p>
          <div className="legal mt-12 space-y-5 text-[1.05rem] leading-relaxed text-ink-2">{children}</div>
        </article>
      </main>
      <Footer home={false} />
    </>
  );
}

export function Fill({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-glow/40 px-1 text-ink">[למלא: {children}]</mark>;
}
