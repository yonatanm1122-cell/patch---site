import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuoteLink } from "@/components/QuoteLink";

export const metadata: Metadata = { title: "העמוד לא נמצא", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header home={false} />
      <main id="main" tabIndex={-1} className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-24 outline-none">
        <p className="eyebrow" dir="ltr">404</p>
        <h1 className="display-lg mt-6">נראה שהתפר הזה נפרם.</h1>
        <p className="mt-5 max-w-md text-lg text-ink-2">העמוד שחיפשתם לא קיים. אבל העמדה שלנו בהחלט כן.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="/" className="btn btn-primary">לעמוד הבית</a>
          <QuoteLink className="btn btn-ghost">קבלו הצעה לאירוע</QuoteLink>
        </div>
      </main>
      <Footer home={false} />
    </>
  );
}
