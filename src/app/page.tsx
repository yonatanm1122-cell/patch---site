import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Statement } from "@/components/Statement";
import { HowItWorks } from "@/components/HowItWorks";
import { Experience } from "@/components/Experience";
import { EventTypes } from "@/components/EventTypes";
import { Services } from "@/components/Services";
import { Reasons } from "@/components/Reasons";
import { Gallery } from "@/components/Gallery";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { MotionProvider } from "@/components/MotionProvider";

export default function Home() {
  return (
    <>
      <MotionProvider />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Statement />
        <HowItWorks />
        <Experience />
        <EventTypes />
        <Services />
        <Reasons />
        <Gallery />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
