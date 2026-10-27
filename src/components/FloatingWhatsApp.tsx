"use client";

import { useEffect, useState } from "react";
import { whatsappNumber } from "@/lib/whatsapp-number";
import { buildWhatsAppUrl } from "@/lib/lead";
import { WhatsAppIcon } from "./Icons";

/** Always reachable, but steps aside on the hero (which has its own CTAs) and while the contact form is on screen. */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const href = buildWhatsAppUrl(whatsappNumber, "היי PATCHED, אשמח לשמוע על העמדה לאירוע שלי") ?? "#contact";
  const external = href.startsWith("https://");

  useEffect(() => {
    const contact = document.getElementById("contact");
    let contactInView = false;
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.6 && !contactInView);
    const io = contact
      ? new IntersectionObserver(([e]) => {
          contactInView = e.isIntersecting;
          update();
        }, { rootMargin: "0px 0px -20% 0px" })
      : null;
    if (contact) io!.observe(contact);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={external ? "שיחה איתנו בוואטסאפ (נפתח בחלון חדש)" : "מעבר לטופס יצירת קשר"}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-[#0b3d1f] shadow-[0_12px_30px_-10px_rgba(37,211,102,0.7)] transition-all duration-500 hover:scale-105 md:left-6 md:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <WhatsAppIcon />
    </a>
  );
}
