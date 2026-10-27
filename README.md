# PATCHED: אתר Custom Bar לאירועים

אתר תדמית ומכירה סטטי (Next.js + TypeScript + Tailwind + GSAP). אין שרת, אין בסיס נתונים ואין עוגיות.

## עריכת תוכן: הכול בקובץ אחד
`src/content/site.ts`: טקסטים, שירותים, שאלות נפוצות, סוגי אירועים, גלריה, מספר וואטסאפ וכתובת האתר.

### הוספת תמונות וסרטונים
1. מעתיקים את הקובץ ל-`public/media/` (למשל `public/media/hero.mp4`).
2. ב-`site.ts`, בפריט המתאים, ממלאים `src: "/media/hero.mp4"` ו-`alt` (תיאור לקוראי מסך).
3. לסרטונים מומלץ גם `poster: "/media/hero.jpg"`.

כל עוד `src` ריק, מוצגת מסגרת "PLACEHOLDER" מסומנת עם תיאור של מה צריך להופיע בה.

**המלצות לקבצים:** תמונות בפורמט WebP או AVIF, ברוחב של עד 2000px ובמשקל של עד 300KB. סרטונים בפורמט MP4 (H.264), עד 15 שניות, בלי סאונד, ובמשקל של עד 4MB. לסרטון הפתיחה עדיף 1920×1080.

### סטטוס שירות
ב-`services` יש שדה `status`: הערך `"active"` מוצג כ"פעיל", והערך `"on-request"` מוצג כ"בתיאום מראש".

## פקודות
```bash
npm install
npm run dev            # פיתוח: http://localhost:3000
npm run build          # בנייה לתיקיית out/
npm start              # תצוגה מקומית של הבנייה: http://localhost:4173
npm run test:e2e       # בדיקות Playwright (בונה גרסת בדיקה עם מספר וואטסאפ לבדיקה בלבד)
npm run check:launch   # מה חסר לפני עלייה לאוויר
node scripts/generate-assets.mjs   # מייצר מחדש את תמונת השיתוף והאייקונים (כשהשרת המקומי רץ)
```
> אחרי `npm run test:e2e` הריצו `npm run build` מחדש לפני פריסה. הבדיקות משתמשות בתיקייה נפרדת (`.e2e-out`), ותיקיית `out` נבנית מחדש רק בבנייה רגילה.

## פריסה
התיקייה `out/` היא האתר כולו. אפשר להעלות אותה ל-Vercel, Netlify, Cloudflare Pages או לכל אחסון סטטי.
- כותרות אבטחה ו-Cache כבר מוגדרות: `vercel.json` ל-Vercel, ו-`public/_headers` ל-Netlify ול-Cloudflare.
- לפני פריסה ראשונה: `npm run check:launch` צריך לעבור בלי חוסרים.
