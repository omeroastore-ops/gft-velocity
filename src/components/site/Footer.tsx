import { Instagram } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative border-t border-border/60 mt-10">
      <div className="gold-line w-full" />
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <span className="font-display font-bold text-primary-foreground text-sm">G</span>
              </span>
              <span className="font-display font-semibold tracking-wider">
                GFT
                <span className="text-muted-foreground font-normal ml-2 text-xs uppercase tracking-[0.2em]">
                  German Freight Transport
                </span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-md">{t("footer.tagline")}</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a
              href="https://instagram.com/germanfreighttransports"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @germanfreighttransports
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">
              {t("footer.imprint")}
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
          <span>© {new Date().getFullYear()} GFT German Freight Transport. {t("footer.rights")}</span>
          <span className="font-mono">DE · Worldwide</span>
        </div>
      </div>
    </footer>
  );
}
