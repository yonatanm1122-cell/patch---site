import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WA = "972504999308"; // business number from src/content/site.ts

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

async function stubWindowOpen(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((url: string) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

async function fillValidForm(page: Page) {
  await page.locator("#f-name").fill("דנה כהן");
  await page.locator("#f-phone").fill("050-1234567");
  await page.locator("#f-eventType").selectOption("חתונה");
  const next = new Date();
  next.setMonth(next.getMonth() + 5);
  const iso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
  await page.locator("#f-date").fill(iso);
  await page.locator("#f-location").fill("תל אביב");
  await page.locator("#f-guests").fill("250");
  await page.locator("#f-message").fill("קונספט לבן & זהב");
  return iso;
}

test("1. home page loads with correct language, title and headline, without JS errors", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page).toHaveTitle(/PATCHED/);
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("לא עוד מתנה");
  await expect(page.getByRole("link", { name: "קבלו הצעה לאירוע" }).first()).toBeVisible();
  await page.waitForTimeout(800);
  expect(errors).toEqual([]);
});

test("2. mobile menu opens, traps focus, closes with Esc and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "פתיחת תפריט" });
  await trigger.click();
  const dialog = page.locator("#mobile-menu");
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("#mobile-menu"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("3. navigation moves to each section", async ({ page, isMobile }) => {
  await page.goto("/");
  for (const [label, id] of [["איך זה עובד", "how"], ["לאילו אירועים", "events"], ["החוויות", "experiences"], ["גלריה", "gallery"], ["שאלות", "faq"]]) {
    if (isMobile) {
      await page.getByRole("button", { name: "פתיחת תפריט" }).click();
      await page.locator("#mobile-menu").getByRole("link", { name: label }).click();
    } else {
      await page.getByRole("navigation", { name: "ניווט ראשי" }).getByRole("link", { name: label }).click();
    }
    await expect.poll(async () => page.evaluate((i) => Math.round(document.getElementById(i)!.getBoundingClientRect().top), id), { timeout: 4000 }).toBeLessThan(200);
    await expect.poll(async () => page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().bottom > 0, id)).toBe(true);
  }
});

test("4. every quote button opens WhatsApp to the business number with a ready message", async ({ page, context, isMobile }) => {
  await context.route("https://wa.me/**", (r) => r.fulfill({ status: 200, body: "whatsapp" }));
  await page.goto("/");
  const quotes = page.locator("a[data-quote]");
  const n = await quotes.count();
  expect(n).toBeGreaterThanOrEqual(isMobile ? 8 : 8);
  for (let i = 0; i < n; i++) {
    const href = (await quotes.nth(i).getAttribute("href"))!;
    const u = new URL(href);
    expect(u.origin + u.pathname, href).toBe(`https://wa.me/${WA}`);
    expect(u.searchParams.get("text")).toMatch(/^היי PATCHED, אשמח לקבל הצעת מחיר/);
    expect(await quotes.nth(i).getAttribute("target")).toBe("_blank");
  }
  // Real click on the main hero button opens WhatsApp in a new tab
  const [popup] = await Promise.all([context.waitForEvent("page"), page.locator("#top a[data-quote]").first().click()]);
  expect(popup.url()).toContain(`wa.me/${WA}`);
  // Event-type button names the event in the message
  await page.getByRole("tab", { name: "אירועי חברה" }).click();
  const eventHref = await page.getByRole("tabpanel").locator("a[data-quote]").getAttribute("href");
  expect(new URL(eventHref!).searchParams.get("text")).toBe("היי PATCHED, אשמח לקבל הצעת מחיר לאירוע חברה.");
  // Floating WhatsApp button points to the same number
  expect(await page.locator('a[aria-label^="שיחה איתנו בוואטסאפ"]').getAttribute("href")).toContain(`wa.me/${WA}`);
});

test("every visible button and link is clickable (not covered) and does something", async ({ page, isMobile }) => {
  await page.goto("/");
  // Let reveal animations settle as we pass each section
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(isMobile ? 40 : 90);
  }
  await page.waitForTimeout(1500);
  const problems = await page.evaluate(async () => {
    const out: string[] = [];
    const els = [...document.querySelectorAll<HTMLElement>("header a, header button, main a, main button, footer a, footer button")];
    for (const el of els) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || el.closest("dialog:not([open])") || el.getClientRects().length === 0) continue;
      const name = (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30);
      if (el.tagName === "A") {
        const href = el.getAttribute("href") || "";
        if (!href || href === "#") out.push(`empty link: ${name}`);
      } else if (el.getAttribute("type") !== "submit" && !(el as HTMLButtonElement).onclick && !el.hasAttribute("aria-controls") && !el.hasAttribute("aria-expanded") && el.getAttribute("role") !== "tab" && !el.getAttribute("aria-label")) {
        out.push(`button without clear action: ${name}`);
      }
      el.scrollIntoView({ block: "center" });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      // The fixed header may sit on top of an element scrolled under it; that's not a real obstruction
      if (hit && !el.contains(hit) && !hit.closest("header")) out.push(`covered: ${el.tagName} "${name}" by ${hit.tagName}.${String(hit.className).slice(0, 40)}`);
    }
    return out;
  });
  expect(problems).toEqual([]);
});

test("5-7. form validation, then WhatsApp handoff with the full message (no fake success)", async ({ page }) => {
  await stubWindowOpen(page);
  await page.goto("/#contact");
  const submit = page.getByRole("button", { name: /קבלו הצעה אישית/ });

  // Empty submit
  await submit.click();
  await expect(page.getByRole("alert").first()).toContainText("6 שדות");
  await expect(page.locator("#f-name")).toBeFocused();
  await expect(page.locator("#f-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#e-name")).toBeVisible();

  // Invalid phone / past date / bad guests
  await fillValidForm(page);
  await page.locator("#f-phone").fill("123");
  await page.locator("#f-date").fill("2020-01-01");
  await page.locator("#f-guests").fill("0");
  await submit.click();
  await expect(page.locator("#e-phone")).toContainText("לא נראה תקין");
  await expect(page.locator("#e-date")).toContainText("כבר עבר");
  await expect(page.locator("#e-guests")).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);

  // Valid
  const iso = await fillValidForm(page);
  await submit.click();
  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened).toHaveLength(1);
  const url = new URL(opened[0]);
  expect(url.origin + url.pathname).toBe(`https://wa.me/${WA}`);
  const text = url.searchParams.get("text")!;
  const [y, m, d] = iso.split("-");
  for (const line of ["היי PATCHED, אשמח לקבל הצעה לאירוע שלי.", "שם: דנה כהן", "טלפון: 050-1234567", "סוג האירוע: חתונה", `תאריך: ${d}/${m}/${y}`, "מיקום: תל אביב", "מספר אורחים: 250", "הערות: קונספט לבן & זהב"])
    expect(text).toContain(line);

  // Honest status: explains the user still needs to press send; never claims success
  await expect(page.getByText("עוד צעד אחד: השליחה בוואטסאפ.")).toBeVisible();
  await expect(page.getByRole("link", { name: /וואטסאפ לא נפתח/ })).toHaveAttribute("href", opened[0]);
  await expect(page.locator("body")).not.toContainText(/נשלח בהצלחה|הפנייה נשלחה|תודה, קיבלנו/);
});

test("event-type tabs support arrow keys (RTL)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "חתונות" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "בר ובת מצווה" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "בר ובת מצווה" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("החברים יוצאים");
});

test("8. gallery opens full-screen, navigates, closes with Esc and restores focus", async ({ page }) => {
  await page.goto("/#gallery");
  const first = page.locator("#gallery ul button").first();
  await first.click();
  const dialog = page.getByRole("dialog", { name: "גלריה במסך מלא" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("1 / 6");
  await dialog.getByRole("button", { name: "התמונה הבאה" }).click();
  await expect(dialog).toContainText("2 / 6");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("1 / 6");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
});

test("9. FAQ items open and close", async ({ page }) => {
  await page.goto("/#faq");
  const q = page.getByRole("button", { name: "כמה זמן נמשכת הפעילות?" });
  await expect(q).toHaveAttribute("aria-expanded", "false");
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-a-4")).toBeVisible();
  await q.click();
  await expect(page.locator("#faq-a-4")).toBeHidden();
});

for (const width of [360, 390, 768, 1280]) {
  test(`10. layout at ${width}px: no horizontal scroll, nothing clipped, tap targets ≥ 44px`, async ({ page, isMobile }) => {
    test.skip(isMobile, "viewport set explicitly");
    await page.setViewportSize({ width, height: 860 });
    for (const path of ["/", "/privacy/", "/accessibility/"]) {
      await page.goto(path);
      const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(sw, `${path} horizontal overflow`).toBeLessThanOrEqual(iw);
    }
    await page.goto("/");
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("main a, main button, header a, header button, input, select, textarea")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden" || r.width === 0) return false;
          if (el.closest("[aria-hidden='true']")) return false;
          // Inline text links inside sentences are exempt (WCAG 2.5.8 inline exception)
          if (el.tagName === "A" && getComputedStyle(el.parentElement!).display !== "flex" && el.closest("p")) return false;
          return r.height < 44 || r.width < 44;
        })
        .map((el) => `${el.tagName} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`),
    );
    expect(small).toEqual([]);
  });
}

test("11a. reduced motion: no motion classes, all content visible immediately", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.classList.contains("js-motion"))).toBe(false);
  const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity !== "1").length);
  expect(hidden).toBe(0);
  // The pinned hero story collapses to normal flow (no extra scroll length)
  expect(await page.evaluate(() => document.querySelector("#top > div")!.getBoundingClientRect().height <= innerHeight * 1.2)).toBe(true);
  await ctx.close();
});

test("11b. with motion: scroll reveals content and the hero press closes", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/js-motion/);
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 500) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(isMobile ? 60 : 120);
  }
  await page.waitForTimeout(1500);
  const stillHidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => Number(getComputedStyle(e).opacity) < 0.99).length);
  expect(stillHidden).toBe(0);
  if (!isMobile) {
    // Hero: halfway through the pinned story the press lid has closed onto the shirt
    await page.evaluate(() => {
      const pin = document.querySelector<HTMLElement>("#top > div")!;
      window.__lenis?.scrollTo((pin.offsetHeight - innerHeight) * 0.5, { immediate: true });
    });
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.querySelectorAll("#top img")[1]).transform), { timeout: 4000 })
      .not.toBe("none");
  }
});

test("12. images, icons, share image and media load", async ({ page, request }) => {
  await page.goto("/");
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  expect(broken).toEqual([]);
  for (const path of ["/og.png", "/favicon.svg", "/favicon-32.png", "/apple-touch-icon.png", "/robots.txt", "/sitemap.xml"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\.png$/);
});

test("13. no JS errors on any page; 404 page works; all internal links resolve", async ({ page, request }) => {
  const errors = trackErrors(page);
  const hrefs = new Set<string>();
  for (const path of ["/", "/privacy/", "/accessibility/"]) {
    await page.goto(path);
    await page.waitForTimeout(500);
    for (const h of await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) hrefs.add(`${path}|${h}`);
  }
  expect(errors).toEqual([]);

  const problems: string[] = [];
  for (const entry of hrefs) {
    const [from, href] = entry.split("|");
    if (href === "#" || href === "") problems.push(`${from}: empty link`);
    else if (href.startsWith("#")) {
      await page.goto(from);
      if (!(await page.locator(href).count())) problems.push(`${from}: missing anchor ${href}`);
    } else if (href.startsWith("/")) {
      const [p, hash] = href.split("#");
      if ((await request.get(p)).status() !== 200) problems.push(`${from}: ${href} not found`);
      if (hash) {
        await page.goto(href);
        if (!(await page.locator(`#${hash}`).count())) problems.push(`${from}: missing anchor ${href}`);
      }
    } else if (!/^(https:\/\/wa\.me\/|mailto:|tel:|https:\/\/)/.test(href)) problems.push(`${from}: unexpected ${href}`);
  }
  expect(problems).toEqual([]);

  const res = await page.goto("/this-page-does-not-exist/");
  expect(res!.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("נפרם");
});

for (const path of ["/", "/privacy/", "/accessibility/", "/missing-page/"]) {
  test(`a11y (axe, WCAG 2.1 AA): ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
    expect(summary).toEqual([]);
  });
}

test("a11y: keyboard-only user can reach and submit the form", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow on desktop");
  await stubWindowOpen(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "דילוג לתוכן הראשי" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.locator("#f-name").focus();
  await fillValidForm(page);
  await page.locator("#f-message").focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /קבלו הצעה אישית/ })).toBeFocused();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(1);
});

test("deep links (/#section) land on the section, with its content visible, and scrolling back up shows earlier sections", async ({ page }) => {
  for (const id of ["faq", "contact", "gallery"]) {
    await page.goto(`/#${id}`);
    await expect.poll(() => page.evaluate((i) => Math.round(document.getElementById(i)!.getBoundingClientRect().top), id), { timeout: 4000 }).toBeLessThan(200);
    await expect
      .poll(
        () =>
          page.evaluate((i) =>
            [...document.getElementById(i)!.querySelectorAll("[data-reveal]")].filter((e) => {
              const r = e.getBoundingClientRect();
              return r.top < innerHeight && r.bottom > 0 && Number(getComputedStyle(e).opacity) < 0.99;
            }).length,
          id),
        { timeout: 4000 },
      )
      .toBe(0);
  }
  // Everything above the deep-link target must already be visible when scrolling back up
  const hiddenAbove = await page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal]")].filter((e) => e.getBoundingClientRect().bottom <= 0 && Number(getComputedStyle(e).opacity) < 0.99).length,
  );
  expect(hiddenAbove).toBe(0);
});

test("no empty image placeholders are shown anywhere (missing photos are hidden)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[aria-label^="מקום שמור"]')).toHaveCount(0);
  for (const tab of ["חתונות", "בר ובת מצווה", "אירועי חברה", "מסיבות ואירועים פרטיים"]) {
    await page.getByRole("tab", { name: tab }).click();
    await expect(page.locator('[aria-label^="מקום שמור"]')).toHaveCount(0);
  }
});
