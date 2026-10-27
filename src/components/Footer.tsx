import { nav, site } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/lead";
import { whatsappNumber } from "@/lib/whatsapp-number";
import { Logo } from "./Logo";

export function Footer({ home = true }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  const wa = buildWhatsAppUrl(whatsappNumber, "היי PATCHED");
  return (
    <footer className="on-dark bg-espresso text-paper">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light className="scale-125 origin-right" />
          <p className="mt-5 max-w-sm text-[#d9cdbf]">Custom Bar לאירועים. האורחים בוחרים, מעצבים ויוצאים עם מזכרת שהם יצרו בעצמם.</p>
        </div>
        <nav aria-label="ניווט בכותרת התחתונה" className="md:col-span-3">
          <ul className="space-y-3 text-[#d9cdbf]">
            {nav.map((i) => (
              <li key={i.href}>
                <a className="link-underline hover:text-paper" href={`${prefix}${i.href}`}>{i.label}</a>
              </li>
            ))}
            <li>
              <a className="link-underline hover:text-paper" href={`${prefix}#contact`}>צרו קשר</a>
            </li>
          </ul>
        </nav>
        <div className="md:col-span-4">
          <ul className="space-y-3 text-[#d9cdbf]">
            {wa && (
              <li>
                <a className="link-underline hover:text-paper" href={wa} target="_blank" rel="noopener noreferrer">וואטסאפ<span className="sr-only"> (נפתח בחלון חדש)</span></a>
              </li>
            )}
            {site.instagramUrl && (
              <li>
                <a className="link-underline hover:text-paper" href={site.instagramUrl} target="_blank" rel="noopener noreferrer">אינסטגרם<span className="sr-only"> (נפתח בחלון חדש)</span></a>
              </li>
            )}
            {site.email && (
              <li>
                <a className="link-underline hover:text-paper" href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            )}
            <li><a className="link-underline hover:text-paper" href="/accessibility/">הצהרת נגישות</a></li>
            <li><a className="link-underline hover:text-paper" href="/privacy/">מדיניות פרטיות</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-paper/10 py-6 text-sm text-[#b9ab9a] sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} PATCHED. כל הזכויות שמורות.</p>
        <p dir="ltr">Custom Bar · Events</p>
      </div>
    </footer>
  );
}
