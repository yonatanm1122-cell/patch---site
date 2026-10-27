export type LeadInput = {
  name: string;
  phone: string;
  eventType: string;
  date: string;
  location: string;
  guests: string;
  message: string;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

export const LIMITS = { name: 60, location: 80, message: 500, guestsMax: 5000 } as const;

// Strip control characters (keeps newlines only where allowed) and trim.
function clean(value: string, allowNewlines = false): string {
  const pattern = allowNewlines ? /[\u0000-\u0009\u000B-\u001F\u007F‎‏‪-‮]/g : /[\u0000-\u001F\u007F‎‏‪-‮]/g;
  return value.replace(pattern, "").replace(/[ \t]+/g, " ").trim();
}

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, "");
}

export function isValidPhone(raw: string): boolean {
  const p = normalizePhone(raw);
  // Israeli mobile/landline (05X…, 0X…, 07X…) or with +972 / 972 prefix
  if (/^(?:\+?972|0)(?:5\d|7\d|[23489])\d{7}$/.test(p)) return true;
  // Other international numbers in E.164 form
  return /^\+(?!972)[1-9]\d{7,14}$/.test(p);
}

function parseISODate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (d.getFullYear() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) return null;
  return d;
}

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function maxDateISO(now = new Date()): string {
  return todayISO(new Date(now.getFullYear() + 3, now.getMonth(), now.getDate()));
}

export function sanitizeLead(input: LeadInput): LeadInput {
  return {
    name: clean(input.name).slice(0, LIMITS.name),
    phone: clean(input.phone).slice(0, 20),
    eventType: clean(input.eventType),
    date: clean(input.date),
    location: clean(input.location).slice(0, LIMITS.location),
    guests: clean(input.guests).replace(/[^\d]/g, ""),
    message: clean(input.message, true).replace(/\n{3,}/g, "\n\n").slice(0, LIMITS.message),
  };
}

export function validateLead(input: LeadInput, eventTypeOptions: readonly string[], now = new Date()): LeadErrors {
  const v = sanitizeLead(input);
  const errors: LeadErrors = {};

  if (v.name.length < 2 || !/\p{L}/u.test(v.name)) errors.name = "נא למלא שם מלא";
  if (!v.phone) errors.phone = "נא למלא מספר טלפון";
  else if (!isValidPhone(v.phone)) errors.phone = "מספר הטלפון לא נראה תקין. לדוגמה: 050-1234567";
  if (!eventTypeOptions.includes(v.eventType)) errors.eventType = "נא לבחור סוג אירוע";

  const d = parseISODate(v.date);
  if (!v.date) errors.date = "נא לבחור תאריך";
  else if (!d) errors.date = "התאריך לא תקין";
  else if (v.date < todayISO(now)) errors.date = "התאריך כבר עבר";
  else if (v.date > maxDateISO(now)) errors.date = "אפשר לבחור תאריך עד שלוש שנים קדימה";

  if (v.location.length < 2) errors.location = "נא לציין עיר או מקום האירוע";

  const g = Number(v.guests);
  if (!v.guests) errors.guests = "נא לציין מספר אורחים משוער";
  else if (!Number.isInteger(g) || g < 1 || g > LIMITS.guestsMax) errors.guests = `נא לציין מספר בין 1 ל-${LIMITS.guestsMax.toLocaleString("he-IL")}`;

  if (input.message.length > LIMITS.message + 50) errors.message = `עד ${LIMITS.message} תווים`;
  return errors;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function buildLeadMessage(input: LeadInput): string {
  const v = sanitizeLead(input);
  return [
    "היי PATCHED, אשמח לקבל הצעה לאירוע שלי.",
    "",
    `שם: ${v.name}`,
    `טלפון: ${v.phone}`,
    `סוג האירוע: ${v.eventType}`,
    `תאריך: ${formatDate(v.date)}`,
    `מיקום: ${v.location}`,
    `מספר אורחים: ${v.guests}`,
    `הערות: ${v.message || "-"}`,
  ].join("\n");
}

export function buildWhatsAppUrl(number: string, text: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
