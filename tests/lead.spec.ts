import { test, expect } from "@playwright/test";
import { buildLeadMessage, buildWhatsAppUrl, isValidPhone, validateLead, sanitizeLead } from "../src/lib/lead";

const options = ["חתונה", "אירוע חברה"];
const now = new Date(2026, 9, 27);
const good = { name: "דנה כהן", phone: "050-1234567", eventType: "חתונה", date: "2027-03-14", location: "תל אביב", guests: "250", message: "" };

test.describe("lead logic", () => {
  test.skip(({ isMobile }) => isMobile, "pure logic: run once");

  test("valid lead has no errors", () => {
    expect(validateLead(good, options, now)).toEqual({});
  });

  test("required fields and formats are enforced", () => {
    const e = validateLead({ name: "", phone: "", eventType: "", date: "", location: "", guests: "", message: "" }, options, now);
    expect(Object.keys(e).sort()).toEqual(["date", "eventType", "guests", "location", "name", "phone"]);
    expect(validateLead({ ...good, phone: "12345" }, options, now).phone).toBeTruthy();
    expect(validateLead({ ...good, date: "2026-10-01" }, options, now).date).toBe("התאריך כבר עבר");
    expect(validateLead({ ...good, date: "2027-02-30" }, options, now).date).toBe("התאריך לא תקין");
    expect(validateLead({ ...good, date: "2031-01-01" }, options, now).date).toBeTruthy();
    expect(validateLead({ ...good, guests: "0" }, options, now).guests).toBeTruthy();
    expect(validateLead({ ...good, guests: "99999" }, options, now).guests).toBeTruthy();
    expect(validateLead({ ...good, eventType: "משהו אחר" }, options, now).eventType).toBeTruthy();
  });

  test("phone formats", () => {
    for (const p of ["0501234567", "050-123-4567", "+972501234567", "972 50 123 4567", "03-6123456", "+447911123456"]) expect(isValidPhone(p), p).toBe(true);
    for (const p of ["050123", "abc", "+972", "05012345678901"]) expect(isValidPhone(p), p).toBe(false);
  });

  test("message contains every field and survives URL encoding", () => {
    const msg = buildLeadMessage({ ...good, message: "קונספט: לבן & זהב\nשורה 2" });
    for (const line of ["היי PATCHED, אשמח לקבל הצעה לאירוע שלי.", "שם: דנה כהן", "טלפון: 050-1234567", "סוג האירוע: חתונה", "תאריך: 14/03/2027", "מיקום: תל אביב", "מספר אורחים: 250", "הערות: קונספט: לבן & זהב\nשורה 2"])
      expect(msg).toContain(line);
    const url = buildWhatsAppUrl("972500000000", msg)!;
    expect(url.startsWith("https://wa.me/972500000000?text=")).toBe(true);
    expect(decodeURIComponent(new URL(url).search.slice(6))).toBe(msg);
    expect(url).not.toMatch(/[ \n]/);
  });

  test("no number → no URL; control characters are stripped", () => {
    expect(buildWhatsAppUrl("", "x")).toBeNull();
    expect(sanitizeLead({ ...good, name: "דנה‮\u0007 כהן" }).name).toBe("דנה כהן");
  });
});
