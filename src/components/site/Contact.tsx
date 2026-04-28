import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Instagram, User, Send } from "lucide-react";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(2000),
});

export function Contact() {
  const { t } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    // Open user's mail client with prefilled message; sanitized via encodeURIComponent.
    const subject = `GFT Anfrage von ${parsed.data.name}`;
    const body = `${parsed.data.message}\n\n— ${parsed.data.name}\n${parsed.data.email}`;
    window.location.href = `mailto:yilmaz.business27@gmail.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      toast.success(t("contact.sent"));
      setForm({ name: "", email: "", message: "" });
      setSubmitting(false);
    }, 600);
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="section-eyebrow mb-4">
              <span className="inline-block w-8 h-px bg-gold" />
              {t("contact.eyebrow")}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-balance">
              {t("contact.title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty max-w-md">{t("contact.subtitle")}</p>

            <div className="mt-10 space-y-4">
              <ContactRow
                Icon={User}
                label={t("contact.contactPerson")}
                value="Yasin Yilmaz"
              />
              <ContactRow
                Icon={Mail}
                label={t("contact.email")}
                value="yilmaz.business27@gmail.com"
                href="mailto:yilmaz.business27@gmail.com"
              />
              <ContactRow
                Icon={Phone}
                label={t("contact.phone")}
                value="+49 176 32850515"
                href="tel:+4917632850515"
              />
              <ContactRow
                Icon={Instagram}
                label={t("contact.instagram")}
                value="@germanfreighttransports"
                href="https://instagram.com/germanfreighttransports"
              />
            </div>
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-3xl p-6 md:p-8"
          >
            <h3 className="font-display text-xl font-semibold mb-6">{t("contact.formTitle")}</h3>

            <div className="space-y-4">
              <Field
                label={t("contact.name")}
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                maxLength={100}
                required
              />
              <Field
                label={t("contact.emailField")}
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                maxLength={254}
                required
              />
              <Field
                label={t("contact.message")}
                textarea
                value={form.message}
                onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                maxLength={2000}
                required
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-neon mt-6 w-full sm:w-auto">
              <Send className="w-4 h-4" />
              {t("contact.send")}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const Wrapper: React.ElementType = href ? "a" : "div";
  return (
    <Wrapper
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex items-center gap-4 p-3 rounded-2xl glass hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </Wrapper>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  maxLength,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  maxLength?: number;
  required?: boolean;
}) {
  const cls =
    "w-full bg-input/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition";
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          className={`${cls} mt-1.5 min-h-[120px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          required={required}
        />
      ) : (
        <input
          type={type}
          className={`${cls} mt-1.5`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          required={required}
        />
      )}
    </label>
  );
}
