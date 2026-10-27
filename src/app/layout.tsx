import type { Metadata, Viewport } from "next";
import { Heebo, Montserrat, Rubik } from "next/font/google";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["700", "900"],
  variable: "--font-rubik",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

// Brand wordmark / big background words: matches the bold geometric sign on the bar
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const title = "PATCHED | Custom Bar לאירועים: האורחים מעצבים את המתנה";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | PATCHED" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "PATCHED",
    title,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PATCHED: Custom Bar לאירועים" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/og.png"] },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-32.png", sizes: "32x32", type: "image/png" }], apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#f4eee6",
  width: "device-width",
  initialScale: 1,
};

// Enables reveal styles only when motion is allowed; falls back to visible content if the motion layer never boots.
const motionBoot = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('js-motion');setTimeout(function(){if(!window.__patchedMotion)d.classList.remove('js-motion')},4000)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${heebo.variable} ${montserrat.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 right-3 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-paper focus:translate-y-0"
        >
          דילוג לתוכן הראשי
        </a>
        {children}
      </body>
    </html>
  );
}
