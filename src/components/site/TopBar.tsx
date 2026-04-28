import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";

interface Props {
  onOpenQuote: () => void;
}

const navIds = ["services", "fleet", "careers", "contact"] as const;

export function TopBar({ onOpenQuote }: Props) {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLang = (l: Lang) => setLang(l);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container">
        <div
          className={`glass-strong rounded-full flex items-center justify-between pl-5 pr-2 py-2 transition-all ${
            scrolled ? "shadow-[0_10px_40px_-20px_hsl(var(--primary)/0.4)]" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group" aria-label="GFT German Freight Transport">
            <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow glow-blue">
              <span className="font-display font-bold text-primary-foreground text-sm">G</span>
            </span>
            <span className="font-display font-semibold tracking-wider text-sm">
              GFT
              <span className="hidden sm:inline text-muted-foreground font-normal ml-2 text-xs uppercase tracking-[0.2em]">
                German Freight Transport
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navIds.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full"
              >
                {t(`nav.${id}`)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center text-xs font-semibold rounded-full border border-border/60 overflow-hidden">
              {(["de", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => switchLang(l)}
                  className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${
                    lang === l ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={lang === l}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenQuote}
              className="hidden sm:inline-flex btn-neon !px-5 !py-2 !text-xs"
            >
              {t("nav.quote")}
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full glass"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-3xl p-4 animate-fade-in">
            <nav className="flex flex-col">
              {navIds.map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm text-foreground/90 border-b border-border/40 last:border-0"
                >
                  {t(`nav.${id}`)}
                </a>
              ))}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                <div className="flex items-center text-xs font-semibold rounded-full border border-border/60 overflow-hidden">
                  {(["de", "en"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLang(l)}
                      className={`px-3 py-1.5 uppercase ${
                        lang === l ? "bg-primary/20 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    onOpenQuote();
                  }}
                  className="btn-neon !px-5 !py-2 !text-xs"
                >
                  {t("nav.quote")}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
