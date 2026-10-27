import { site } from "@/content/site";

/** Business WhatsApp number: from content/site.ts, or from the NEXT_PUBLIC_WHATSAPP_NUMBER build variable. */
export const whatsappNumber = site.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
