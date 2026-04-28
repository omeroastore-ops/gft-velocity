import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { HERO_VIDEO_DESKTOP, HERO_VIDEO_MOBILE } from "@/lib/media";
import { useI18n } from "@/lib/i18n";

interface Props {
  onOpenQuote: () => void;
}

export function Hero({ onOpenQuote }: Props) {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const src = isMobile ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP;

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] overflow-hidden flex items-end md:items-center"
    >
      {/* Background video */}
      <video
        key={src}
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent md:from-background/60" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Content */}
      <div className="relative z-10 container pb-16 pt-32 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="section-eyebrow mb-6">
            <span className="inline-block w-8 h-px bg-gold" />
            {t("hero.eyebrow")}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-balance">
            {t("hero.title").split(":").map((part, i, arr) =>
              i === 0 ? (
                <span key={i}>
                  {part}
                  {arr.length > 1 && <span className="gold-text">:</span>}
                </span>
              ) : (
                <span key={i} className="block neon-text mt-2">
                  {part.trim()}
                </span>
              ),
            )}
          </h1>

          <p className="mt-6 text-base md:text-lg text-foreground/80 max-w-xl text-pretty">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={onOpenQuote} className="btn-neon animate-pulse-glow group">
              {t("hero.cta")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a href="#services" className="btn-ghost-neon">
              {t("hero.ctaGhost")}
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-12 hidden md:grid grid-cols-3 gap-px bg-border/50 rounded-2xl overflow-hidden glass max-w-2xl">
            {[
              { v: "120+", l: "Länder / Countries" },
              { v: "24/7", l: "Air Cargo" },
              { v: "<2h", l: "Response" },
            ].map((s) => (
              <div key={s.l} className="px-6 py-4 bg-background/40">
                <div className="font-display text-2xl text-primary">{s.v}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#services"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>{t("hero.scroll")}</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
}
