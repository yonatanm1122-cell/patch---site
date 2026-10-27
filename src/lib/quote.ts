import { buildWhatsAppUrl } from "./lead";
import { whatsappNumber } from "./whatsapp-number";

/** WhatsApp link with a ready-made quote request. `context` names the event type or service, when known. */
export function quoteUrl(context?: string): string | null {
  const text = context
    ? `היי PATCHED, אשמח לקבל הצעת מחיר ל${context}.`
    : "היי PATCHED, אשמח לקבל הצעת מחיר לאירוע שלי.";
  return buildWhatsAppUrl(whatsappNumber, text);
}
