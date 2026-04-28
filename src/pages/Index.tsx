import { useEffect, useState } from "react";
import Lenis from "lenis";
import { I18nProvider } from "@/lib/i18n";
import { TopBar } from "@/components/site/TopBar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Fleet } from "@/components/site/Fleet";
import { Careers } from "@/components/site/Careers";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { QuoteModal } from "@/components/site/QuoteModal";

const Index = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <I18nProvider>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <TopBar onOpenQuote={() => setQuoteOpen(true)} />
        <main>
          <Hero onOpenQuote={() => setQuoteOpen(true)} />
          <Services />
          <Fleet />
          <Careers />
          <Contact />
        </main>
        <Footer />
        <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
      </div>
    </I18nProvider>
  );
};

export default Index;
