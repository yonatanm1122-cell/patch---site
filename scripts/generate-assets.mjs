// Renders the share image (public/og.png) and PNG icons from the running site, using the site's own fonts.
// Usage: npm run build && npm start (in another terminal) && node scripts/generate-assets.mjs
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:4173";
const browser = await chromium.launch();

// Share image 1200x630
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.body.innerHTML = `
    <div style="position:fixed;inset:0;background:#F4EEE6;display:flex;align-items:center;justify-content:space-between;padding:0 64px;gap:16px;overflow:hidden">
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family:var(--font-brand);font-weight:900;font-size:300px;letter-spacing:-0.04em;color:#E9DFD2;white-space:nowrap">PATCHED</div>
      <div style="position:relative;z-index:1;max-width:520px">
        <div dir="ltr" style="display:inline-flex;flex-direction:column;align-items:center;line-height:1;color:#17130F">
          <span style="font-family:var(--font-brand);font-weight:900;font-size:34px">PATCHED</span>
          <span style="font-family:var(--font-brand);font-weight:600;font-size:12px;letter-spacing:.62em;margin-top:5px">CUSTOM BAR</span>
        </div>
        <div style="font-family:var(--font-rubik);font-weight:900;font-size:76px;line-height:.98;color:#17130F;margin-top:30px">לא עוד מתנה<br>מהאירוע.</div>
        <div style="font-family:var(--font-rubik);font-weight:700;font-size:34px;color:#C41E3A;margin-top:16px">חוויה שהאורחים יוצרים בעצמם.</div>
        <div style="font-family:var(--font-heebo);font-size:22px;color:#6E655B;margin-top:18px">Custom Bar לאירועים · חתונות · בר/בת מצווה · אירועי חברה</div>
      </div>
      <div style="position:relative;z-index:1;width:580px;flex-shrink:0;filter:drop-shadow(0 30px 30px rgba(23,19,15,.25))">
        <img src="/media/hero-base-760.webp" style="display:block;width:100%">
        <img src="/media/hero-lid-760.webp" style="position:absolute;inset:0;width:100%">
      </div>
    </div>`;
});
await page.waitForTimeout(400);
await page.screenshot({ path: "public/og.png" });

// Icons from favicon.svg
const svg = await readFile("public/favicon.svg", "utf8");
for (const [size, file] of [[32, "public/favicon-32.png"], [180, "public/apple-touch-icon.png"]]) {
  const p = await browser.newPage({ viewport: { width: size, height: size } });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  await p.screenshot({ path: file });
}

await browser.close();
console.log("Generated public/og.png, public/favicon-32.png, public/apple-touch-icon.png");
