import { motion } from "framer-motion";
import { Truck, Plane, Package } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const cards = [
  { key: "van", Icon: Package },
  { key: "truck", Icon: Truck },
  { key: "air", Icon: Plane },
] as const;

// Approximate normalized coordinates (0-100 in both axes) for a stylized world.
// We render an SVG world ellipse + animated routes, so exact geography isn't needed.
const hubs: { name: string; x: number; y: number }[] = [
  { name: "Frankfurt", x: 51, y: 36 },
  { name: "New York", x: 27, y: 40 },
  { name: "Dubai", x: 62, y: 47 },
  { name: "Singapore", x: 76, y: 56 },
  { name: "São Paulo", x: 33, y: 66 },
  { name: "Tokyo", x: 84, y: 40 },
];

export function Fleet() {
  const { t } = useI18n();
  const origin = hubs[0];
  const targets = hubs.slice(1);

  return (
    <section id="fleet" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container">
        <div className="max-w-2xl">
          <div className="section-eyebrow mb-4">
            <span className="inline-block w-8 h-px bg-gold" />
            {t("fleet.eyebrow")}
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-balance">
            {t("fleet.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">{t("fleet.subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Fleet cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0">
                  <c.Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-display font-semibold">
                    {t(`fleet.cards.${c.key}.title`)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t(`fleet.cards.${c.key}.spec`)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 relative glass-strong rounded-3xl p-5 md:p-8 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {t("fleet.map.caption")}
              </div>
              <div className="text-xs text-gold font-semibold">{t("fleet.map.hub")}</div>
            </div>

            <div className="relative aspect-[16/10] rounded-2xl bg-background/60 overflow-hidden">
              {/* Stylized "world" ellipse with grid */}
              <svg viewBox="0 0 100 70" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="globeGrad" cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
                    <stop offset="60%" stopColor="hsl(var(--primary) / 0.04)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                  <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--gold) / 0)" />
                    <stop offset="50%" stopColor="hsl(var(--gold) / 0.9)" />
                    <stop offset="100%" stopColor="hsl(var(--gold) / 0)" />
                  </linearGradient>
                </defs>

                <ellipse cx="50" cy="35" rx="46" ry="28" fill="url(#globeGrad)" />

                {/* meridians */}
                {[20, 35, 50, 65, 80].map((cx) => (
                  <ellipse
                    key={cx}
                    cx="50"
                    cy="35"
                    rx={Math.abs(50 - cx) * 0.9}
                    ry="28"
                    fill="none"
                    stroke="hsl(var(--primary) / 0.18)"
                    strokeWidth="0.15"
                  />
                ))}
                {/* parallels */}
                {[15, 25, 35, 45, 55].map((cy) => (
                  <ellipse
                    key={cy}
                    cx="50"
                    cy="35"
                    rx="46"
                    ry={Math.abs(35 - cy) === 0 ? 28 : Math.abs(35 - cy) * 1.4}
                    fill="none"
                    stroke="hsl(var(--primary) / 0.12)"
                    strokeWidth="0.12"
                  />
                ))}

                {/* Routes from Frankfurt to other hubs */}
                {targets.map((h, i) => {
                  const cx = (origin.x + h.x) / 2;
                  const cy = Math.min(origin.y, h.y) - 10; // arc upward
                  const d = `M ${origin.x} ${origin.y} Q ${cx} ${cy} ${h.x} ${h.y}`;
                  return (
                    <g key={h.name}>
                      <path d={d} fill="none" stroke="hsl(var(--gold) / 0.35)" strokeWidth="0.25" strokeDasharray="0.8 0.8" />
                      <path d={d} fill="none" stroke="url(#routeGrad)" strokeWidth="0.6" strokeLinecap="round">
                        <animate attributeName="stroke-dasharray" from="0,30" to="30,0" dur="3.5s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                      </path>
                    </g>
                  );
                })}

                {/* Hubs */}
                {hubs.map((h, i) => (
                  <g key={h.name}>
                    <circle cx={h.x} cy={h.y} r="0.9" fill={i === 0 ? "hsl(var(--gold))" : "hsl(var(--primary))"} />
                    <circle cx={h.x} cy={h.y} r="2.2" fill={i === 0 ? "hsl(var(--gold) / 0.25)" : "hsl(var(--primary) / 0.25)"}>
                      <animate attributeName="r" values="1.4;3.2;1.4" dur="2.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0;0.7" dur="2.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
              </svg>

              {/* Hub labels */}
              <div className="absolute inset-0 pointer-events-none">
                {hubs.map((h, i) => (
                  <span
                    key={h.name}
                    className={`absolute -translate-x-1/2 -translate-y-[140%] text-[10px] uppercase tracking-wider ${
                      i === 0 ? "text-gold font-semibold" : "text-muted-foreground"
                    }`}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    {h.name}
                  </span>
                ))}
              </div>
            </div>

            {/* live ticker */}
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="font-mono text-gold">SHP-{Math.floor(10000 + Math.random() * 89999)}</span>
                <span>FRA → SIN</span>
                <span className="text-primary">In transit</span>
              </div>
              <div className="font-mono text-muted-foreground hidden sm:block">
                ETA 06:42 UTC
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
