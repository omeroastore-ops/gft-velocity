import { motion } from "framer-motion";
import { Plane, ShieldAlert, Warehouse, Globe2, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ServiceDef {
  key: "express" | "special" | "warehouse" | "network";
  Icon: LucideIcon;
  accent: "blue" | "gold";
}

const services: ServiceDef[] = [
  { key: "express", Icon: Plane, accent: "blue" },
  { key: "special", Icon: ShieldAlert, accent: "gold" },
  { key: "warehouse", Icon: Warehouse, accent: "blue" },
  { key: "network", Icon: Globe2, accent: "gold" },
];

export function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container">
        <div className="max-w-2xl">
          <div className="section-eyebrow mb-4">
            <span className="inline-block w-8 h-px bg-gold" />
            {t("services.eyebrow")}
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-balance">
            {t("services.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">{t("services.subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => {
            const isGold = s.accent === "gold";
            return (
              <motion.article
                key={s.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-3xl glass p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                {/* glow ring on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: isGold
                      ? "var(--shadow-gold)"
                      : "var(--shadow-neon-strong)",
                  }}
                />
                {/* corner accent */}
                <div
                  className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity ${
                    isGold ? "bg-gold" : "bg-primary"
                  }`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${
                      isGold ? "bg-gold/10 text-gold" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <s.Icon className="w-6 h-6" />
                  </div>

                  <h3 className="mt-5 font-display text-xl font-semibold">
                    {t(`services.items.${s.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`services.items.${s.key}.desc`)}
                  </p>

                  <div className="mt-5 h-px bg-border" />
                  <ul className="mt-4 space-y-1.5 text-xs">
                    {(["bullet1", "bullet2", "bullet3"] as const).map((b) => (
                      <li key={b} className="flex items-center gap-2 text-foreground/80">
                        <span
                          className={`inline-block w-1 h-1 rounded-full ${
                            isGold ? "bg-gold" : "bg-primary"
                          }`}
                        />
                        {t(`services.items.${s.key}.${b}`)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* gold underline draw */}
                <div className="absolute left-6 right-6 bottom-4 h-px bg-gradient-to-r from-transparent via-gold to-transparent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
