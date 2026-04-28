import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plane, ShieldAlert, Warehouse, Globe2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ServiceType = "express" | "special" | "warehouse" | "network";

interface FormState {
  service_type: ServiceType | "";
  pickup_address: string;
  delivery_address: string;
  desired_date: string;
  weight_kg: string;
  dimensions: string;
  hazardous: boolean;
  description: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string;
}

const initial: FormState = {
  service_type: "",
  pickup_address: "",
  delivery_address: "",
  desired_date: "",
  weight_kg: "",
  dimensions: "",
  hazardous: false,
  description: "",
  company: "",
  contact_name: "",
  email: "",
  phone: "",
};

const schema = z.object({
  service_type: z.enum(["express", "special", "warehouse", "network"]),
  pickup_address: z.string().trim().min(2).max(500),
  delivery_address: z.string().trim().min(2).max(500),
  desired_date: z.string().optional(),
  weight_kg: z.string().optional(),
  dimensions: z.string().max(200).optional(),
  hazardous: z.boolean(),
  description: z.string().max(2000).optional(),
  company: z.string().max(200).optional(),
  contact_name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(4).max(40),
});

const steps = [1, 2, 3, 4] as const;

export function QuoteModal({ open, onClose }: Props) {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const close = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setForm(initial);
      setDone(false);
    }, 300);
  };

  const canNext = () => {
    if (step === 1) return !!form.service_type;
    if (step === 2) return form.pickup_address.trim().length > 1 && form.delivery_address.trim().length > 1;
    if (step === 3) return true;
    return true;
  };

  const submit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    const payload = {
      service_type: parsed.data.service_type,
      pickup_address: parsed.data.pickup_address,
      delivery_address: parsed.data.delivery_address,
      desired_date: parsed.data.desired_date || null,
      weight_kg: parsed.data.weight_kg ? Number(parsed.data.weight_kg) : null,
      dimensions: parsed.data.dimensions || null,
      hazardous: parsed.data.hazardous,
      description: parsed.data.description || null,
      company: parsed.data.company || null,
      contact_name: parsed.data.contact_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
    };
    const { error } = await supabase.from("quote_requests").insert(payload);
    setSubmitting(false);
    if (error) {
      toast.error(t("quote.error"));
      return;
    }
    setDone(true);
    toast.success(t("quote.success"));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-2xl glass-strong rounded-t-3xl sm:rounded-3xl overflow-hidden border-border max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  {t("quote.step")} {step} {t("quote.of")} 4
                </div>
                <div className="font-display font-semibold text-lg mt-0.5">{t("quote.title")}</div>
              </div>
              <button
                onClick={close}
                className="w-9 h-9 rounded-full glass flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-5 pt-3">
              <div className="flex gap-1.5">
                {steps.map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      s <= step ? "bg-primary glow-blue" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-6 overflow-y-auto">
              {done ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 flex items-center justify-center text-primary glow-blue">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{t("quote.success")}</h3>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step === 1 && <Step1 form={form} update={update} />}
                    {step === 2 && <Step2 form={form} update={update} />}
                    {step === 3 && <Step3 form={form} update={update} />}
                    {step === 4 && <Step4 form={form} update={update} />}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {!done && (
              <div className="p-5 border-t border-border/50 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="btn-ghost-neon disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("quote.back")}
                </button>
                {step < 4 ? (
                  <button
                    onClick={() => canNext() && setStep((s) => Math.min(4, s + 1))}
                    disabled={!canNext()}
                    className="btn-neon disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("quote.next")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={submit} disabled={submitting} className="btn-neon disabled:opacity-50">
                    {submitting ? t("quote.sending") : t("quote.submit")}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const services: { key: ServiceType; Icon: typeof Plane }[] = [
  { key: "express", Icon: Plane },
  { key: "special", Icon: ShieldAlert },
  { key: "warehouse", Icon: Warehouse },
  { key: "network", Icon: Globe2 },
];

function Step1({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const { t } = useI18n();
  return (
    <div>
      <h3 className="font-display text-lg font-semibold mb-4">{t("quote.s1.title")}</h3>
      <div className="grid grid-cols-2 gap-3">
        {services.map((s) => {
          const active = form.service_type === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => update("service_type", s.key)}
              className={`text-left rounded-2xl p-4 border transition-all ${
                active
                  ? "border-primary bg-primary/10 glow-blue"
                  : "border-border bg-background/40 hover:border-primary/50"
              }`}
            >
              <s.Icon className={`w-6 h-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <div className="mt-3 font-semibold text-sm">{t(`quote.s1.${s.key}`)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const { t } = useI18n();
  return (
    <div>
      <h3 className="font-display text-lg font-semibold mb-4">{t("quote.s2.title")}</h3>
      <div className="space-y-3">
        <Input label={t("quote.s2.pickup")} value={form.pickup_address} onChange={(v) => update("pickup_address", v)} maxLength={500} />
        <Input label={t("quote.s2.delivery")} value={form.delivery_address} onChange={(v) => update("delivery_address", v)} maxLength={500} />
        <Input label={t("quote.s2.date")} type="date" value={form.desired_date} onChange={(v) => update("desired_date", v)} />
      </div>
    </div>
  );
}

function Step3({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const { t } = useI18n();
  return (
    <div>
      <h3 className="font-display text-lg font-semibold mb-4">{t("quote.s3.title")}</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label={t("quote.s3.weight")} type="number" value={form.weight_kg} onChange={(v) => update("weight_kg", v)} />
          <Input label={t("quote.s3.dimensions")} value={form.dimensions} onChange={(v) => update("dimensions", v)} maxLength={200} />
        </div>
        <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background/40 cursor-pointer">
          <input
            type="checkbox"
            checked={form.hazardous}
            onChange={(e) => update("hazardous", e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">{t("quote.s3.hazardous")}</span>
        </label>
        <Textarea label={t("quote.s3.description")} value={form.description} onChange={(v) => update("description", v)} maxLength={2000} />
      </div>
    </div>
  );
}

function Step4({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const { t } = useI18n();
  return (
    <div>
      <h3 className="font-display text-lg font-semibold mb-4">{t("quote.s4.title")}</h3>
      <div className="space-y-3">
        <Input label={t("quote.s4.company")} value={form.company} onChange={(v) => update("company", v)} maxLength={200} />
        <Input label={t("quote.s4.name")} value={form.contact_name} onChange={(v) => update("contact_name", v)} maxLength={200} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label={t("quote.s4.email")} type="email" value={form.email} onChange={(v) => update("email", v)} maxLength={254} />
          <Input label={t("quote.s4.phone")} type="tel" value={form.phone} onChange={(v) => update("phone", v)} maxLength={40} />
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-input/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <textarea
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-input/60 border border-border rounded-xl px-4 py-3 text-sm min-h-[100px] resize-y focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
      />
    </label>
  );
}
