import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { de } from "@/locales/de";
import { en } from "@/locales/en";

export type Lang = "de" | "en";
type Dict = typeof de;

const dictionaries: Record<Lang, Dict> = { de, en };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

const STORAGE_KEY = "gft.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Lang | null)) || null;
    if (stored === "de" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: string) => {
      const parts = key.split(".");
      let node: unknown = dictionaries[lang];
      for (const p of parts) {
        if (node && typeof node === "object" && p in (node as Record<string, unknown>)) {
          node = (node as Record<string, unknown>)[p];
        } else {
          return key;
        }
      }
      return typeof node === "string" ? node : key;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
