"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/content/site";
import { whatsappNumber } from "@/lib/whatsapp-number";
import {
  buildLeadMessage,
  buildWhatsAppUrl,
  LIMITS,
  maxDateISO,
  todayISO,
  validateLead,
  type LeadErrors,
  type LeadInput,
} from "@/lib/lead";
import { PREFILL_EVENT } from "./EventTypes";
import { ArrowIcon, WhatsAppIcon } from "./Icons";

const empty: LeadInput = { name: "", phone: "", eventType: "", date: "", location: "", guests: "", message: "" };
const order: (keyof LeadInput)[] = ["name", "phone", "eventType", "date", "location", "guests", "message"];

type Status = { kind: "idle" } | { kind: "handoff"; url: string } | { kind: "not-configured" };

export function Contact() {
  const [values, setValues] = useState<LeadInput>(empty);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dateBounds, setDateBounds] = useState({ min: "", max: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDateBounds({ min: todayISO(), max: maxDateISO() });
    const onPrefill = (e: Event) => {
      const option = (e as CustomEvent<string>).detail;
      if (option) setValues((v) => ({ ...v, eventType: option }));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const set = (key: keyof LeadInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    // After the first submit attempt, re-validate live so errors clear as soon as they're fixed.
    if (submitted) setErrors(validateLead(next, contact.eventTypeOptions));
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    // Honeypot: real visitors never see or fill this field.
    const trap = (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value;
    if (trap) return;

    const errs = validateLead(values, contact.eventTypeOptions);
    setErrors(errs);
    const first = order.find((k) => errs[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const url = buildWhatsAppUrl(whatsappNumber, buildLeadMessage(values));
    if (!url) {
      setStatus({ kind: "not-configured" });
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus({ kind: "handoff", url });
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const errorCount = Object.keys(errors).length;
  const fieldProps = (key: keyof LeadInput) => ({
    id: `f-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `e-${key}` : undefined,
    className: "field",
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-glow/20 blur-[120px]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>הצעה לאירוע</p>
          <h2 id="contact-title" className="display-lg mt-5" data-reveal>{contact.title}</h2>
          <p className="mt-5 font-display text-2xl font-bold text-cherry lg:text-3xl" data-reveal>{contact.subtitle}</p>
          <ul className="mt-10 hidden space-y-4 text-ink-2 lg:block" data-reveal>
            {["מילוי של פחות מדקה", "הפרטים נפתחים אצלכם בוואטסאפ, מוכנים לשליחה", "בלי התחייבות: נחזור עם הצעה מותאמת"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-cherry" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <form ref={formRef} noValidate onSubmit={onSubmit} className="card p-5 sm:p-8 lg:p-10" aria-describedby="form-note">
            <p className="mb-6 text-sm text-muted">כל השדות חובה, חוץ מהערות.</p>
            {submitted && errorCount > 0 && (
              <p role="alert" className="mb-6 rounded-xl border border-cherry/40 bg-cherry/5 px-4 py-3 text-sm text-cherry-deep">
                {errorCount === 1 ? "יש שדה אחד שצריך לתקן." : `יש ${errorCount} שדות שצריך לתקן.`}
              </p>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="שם מלא" id="name" error={errors.name}>
                <input {...fieldProps("name")} type="text" autoComplete="name" maxLength={LIMITS.name} required />
              </Field>
              <Field label="טלפון" id="phone" error={errors.phone}>
                <input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="field text-right" placeholder="050-0000000" maxLength={20} required />
              </Field>
              <Field label="סוג האירוע" id="eventType" error={errors.eventType}>
                <select {...fieldProps("eventType")} required>
                  <option value="" disabled>בחרו סוג אירוע</option>
                  {contact.eventTypeOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="תאריך האירוע" id="date" error={errors.date}>
                <input {...fieldProps("date")} type="date" min={dateBounds.min || undefined} max={dateBounds.max || undefined} required />
              </Field>
              <Field label="מיקום האירוע" id="location" error={errors.location}>
                <input {...fieldProps("location")} type="text" autoComplete="address-level2" placeholder="עיר או אולם" maxLength={LIMITS.location} required />
              </Field>
              <Field label="מספר אורחים משוער" id="guests" error={errors.guests}>
                <input {...fieldProps("guests")} type="text" inputMode="numeric" pattern="[0-9]*" placeholder="לדוגמה: 250" maxLength={5} required />
              </Field>
              <div className="sm:col-span-2">
                <Field label="הערות (לא חובה)" id="message" error={errors.message}>
                  <textarea {...fieldProps("message")} rows={3} maxLength={LIMITS.message} className="field resize-y" placeholder="קונספט, שעות, משהו שחשוב לכם שנדע" />
                </Field>
              </div>
            </div>

            {/* Honeypot */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="f-company">חברה</label>
              <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button type="submit" className="btn btn-primary mt-8 w-full !min-h-[60px] text-lg">
              <WhatsAppIcon className="h-5 w-5" />
              {contact.cta}
              <ArrowIcon />
            </button>
            <p id="form-note" className="mt-4 text-center text-sm text-muted">{contact.note}</p>

            <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
              {status.kind === "handoff" && (
                <div className="mt-6 rounded-2xl border border-dashed border-cherry/50 bg-cherry/5 p-5">
                  <p className="font-bold text-ink">עוד צעד אחד: השליחה בוואטסאפ.</p>
                  <p className="mt-1 text-ink-2">פתחנו לכם את וואטסאפ עם כל הפרטים. כדי שהפנייה תגיע אלינו, לחצו שם על “שליחה”.</p>
                  <a href={status.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-cherry-deep underline underline-offset-4">
                    וואטסאפ לא נפתח? לחצו כאן<span className="sr-only"> (נפתח בחלון חדש)</span>
                  </a>
                </div>
              )}
              {status.kind === "not-configured" && (
                <div role="alert" className="mt-6 rounded-2xl border border-cherry/40 bg-cherry/5 p-5 text-cherry-deep">
                  הפרטים תקינים, אבל החיבור לוואטסאפ עדיין לא הוגדר באתר, ולכן הפנייה לא נשלחה.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, error, children }: { label: string; id: keyof LeadInput; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="mb-2 block text-[0.95rem] font-medium text-ink-2">{label}</label>
      {children}
      {error && (
        <p id={`e-${id}`} className="mt-2 text-sm text-cherry-deep">{error}</p>
      )}
    </div>
  );
}
