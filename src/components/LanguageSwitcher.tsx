import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LANGUAGES } from "@/lib/i18n/translations";

export function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const btnClass =
    variant === "light"
      ? "bg-white/20 text-white backdrop-blur"
      : "bg-secondary text-foreground";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold active:scale-95 ${btnClass}`}
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{current.flag} {current.code.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-card">
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-secondary ${active ? "bg-primary-soft" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{l.flag}</span>
                  <span className="font-medium">{l.native}</span>
                </span>
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
