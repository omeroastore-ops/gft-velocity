import { motion } from "framer-motion";
import { BadgeEuro, Truck, Clock4, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const benefits = [
  { key: "pay", Icon: BadgeEuro },
  { key: "fleet", Icon: Truck },
  { key: "flex", Icon: Clock4 },
  { key: "team", Icon: Users },
] as const;

const WHATSAPP_NUMBER = "4917632850515";

export function Careers() {
  const { t, lang } = useI18n();
  const message =
    lang === "de"
      ? "Hallo GFT, ich interessiere mich für die Stelle als Kurierfahrer."
      : "Hi GFT, I'm interested in the courier driver position.";
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <section id="careers" className="relative py-24 md:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] glass-strong p-8 md:p-14">
          {/* Decorative glows */}
          <div className="absolute -top-40 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <div className="section-eyebrow mb-4">
                <span className="inline-block w-8 h-px bg-gold" />
                {t("careers.eyebrow")}
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-balance">
                {t("careers.title")}
              </h2>
              <p className="mt-4 text-muted-foreground text-pretty">{t("careers.subtitle")}</p>

              <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-gold/40">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                </span>
                <span className="text-sm font-semibold">{t("careers.position")}</span>
              </div>

              <div className="mt-8">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon group"
                >
                  {t("careers.cta")}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary">
                    <b.Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-4 font-display font-semibold">
                    {t(`careers.benefits.${b.key}.title`)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t(`careers.benefits.${b.key}.desc`)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
