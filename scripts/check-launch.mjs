// Pre-launch gate: lists everything that must be filled in before the site goes live.
// Usage: npm run check:launch   (exits with code 1 while anything is missing)
import { readFile } from "node:fs/promises";

const content = await import("../src/content/site.ts");
const { site, how, experience, eventTypes, services, gallery } = content;
const problems = [];
const warnings = [];

const wa = site.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
if (!wa) problems.push("מספר וואטסאפ עסקי חסר (site.whatsappNumber ב-src/content/site.ts)");
else if (!/^972\d{8,9}$/.test(wa.replace(/\D/g, ""))) warnings.push(`מספר הוואטסאפ "${wa}" לא בפורמט ישראלי בינלאומי (972...). ודאו שהוא נכון.`);
if (wa.replace(/\D/g, "") === "972500000000") problems.push("מספר הוואטסאפ הוא מספר הבדיקה. יש להחליף במספר האמיתי");
if (!site.url) problems.push("כתובת האתר חסרה (site.url). נדרשת ל-SEO, ל-sitemap ולתמונת השיתוף");

const media = [
  ["איך זה עובד", how.media],
  ...experience.items.map((m, i) => [`החוויה באירוע #${i + 1}`, m]),
  ...eventTypes.map((e) => [`סוג אירוע: ${e.label}`, e.media]),
  ...services.map((s) => [`שירות: ${s.name}`, s.media]),
  ...gallery.map((m, i) => [`גלריה #${i + 1}`, m]),
];
for (const [where, m] of media) {
  if (!m.src) {
    // The Shirt Wall has a designed concept illustration as its fallback
    if (where.includes("Shirt Wall")) warnings.push(`${where}: מוצג איור קונספט (אפשר להוסיף צילום)`);
    else warnings.push(`${where}: אין עדיין ${m.kind === "video" ? "וידאו" : "תמונה"}, ולכן המקום מוסתר באתר (${m.placeholder})`);
  } else if (!m.alt) problems.push(`${where}: חסר טקסט חלופי (alt)`);
  if (m.kind === "video" && m.src && !m.poster) warnings.push(`${where}: מומלץ להוסיף poster לסרטון (תמונת פתיחה)`);
}

for (const s of services) if (s.status === "on-request") warnings.push(`שירות "${s.name}" מסומן "בתיאום מראש". שנו ל-"active" כשיש תיעוד מאירועים`);

for (const page of ["src/app/privacy/page.tsx", "src/app/accessibility/page.tsx"]) {
  const n = ((await readFile(page, "utf8")).match(/<Fill>/g) || []).length;
  if (n) problems.push(`${page}: ${n} פרטים מסומנים [למלא]`);
}

console.log("\nבדיקת מוכנות להשקה: PATCHED\n");
if (problems.length) {
  console.log(`✗ ${problems.length} דברים שחייבים להשלים לפני עלייה לאוויר:`);
  for (const p of problems) console.log("  - " + p);
}
if (warnings.length) {
  console.log(`\n! ${warnings.length} הערות:`);
  for (const w of warnings) console.log("  - " + w);
}
if (!problems.length) console.log("✓ אין חוסרים חוסמים.");
process.exit(problems.length ? 1 : 0);
