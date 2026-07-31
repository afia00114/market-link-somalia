import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  mode: ThemeMode;
  /** Accent preset key, or "custom" when a custom color is used */
  accent: string;
  /** Hex color used when accent === "custom" */
  customColor: string;
}

export const ACCENTS: { key: string; label: string; color: string }[] = [
  { key: "ocean", label: "Ocean", color: "#0F6CBD" },
  { key: "emerald", label: "Emerald", color: "#0E9F6E" },
  { key: "sunset", label: "Sunset", color: "#F97316" },
  { key: "royal", label: "Royal", color: "#6D4AFF" },
  { key: "rose", label: "Rose", color: "#E11D48" },
  { key: "teal", label: "Teal", color: "#0D9488" },
];

const STORAGE_KEY = "maalsoor.theme.v1";
const DEFAULT: ThemeState = { mode: "system", accent: "ocean", customColor: "#0F6CBD" };

interface ThemeCtx extends ThemeState {
  resolvedMode: "light" | "dark";
  setMode: (m: ThemeMode) => void;
  setAccent: (key: string) => void;
  setCustomColor: (hex: string) => void;
  reset: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function readStored(): ThemeState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<ThemeState>;
    return {
      mode: parsed.mode === "light" || parsed.mode === "dark" || parsed.mode === "system" ? parsed.mode : DEFAULT.mode,
      accent: typeof parsed.accent === "string" ? parsed.accent : DEFAULT.accent,
      customColor:
        typeof parsed.customColor === "string" && /^#[0-9a-fA-F]{6}$/.test(parsed.customColor)
          ? parsed.customColor
          : DEFAULT.customColor,
    };
  } catch {
    return DEFAULT;
  }
}

export function accentColorOf(state: ThemeState) {
  if (state.accent === "custom") return state.customColor;
  return ACCENTS.find((a) => a.key === state.accent)?.color ?? DEFAULT.customColor;
}

function applyTheme(state: ThemeState, resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;

  const color = accentColorOf(state);
  root.style.setProperty("--primary", color);
  root.style.setProperty("--ring", color);
  root.style.setProperty(
    "--primary-foreground",
    resolved === "dark" ? "oklch(0.15 0.02 255)" : "oklch(0.99 0 0)"
  );
  root.style.setProperty(
    "--primary-soft",
    resolved === "dark"
      ? `color-mix(in oklab, ${color} 28%, oklch(0.16 0.02 255))`
      : `color-mix(in oklab, ${color} 14%, white)`
  );
  root.style.setProperty(
    "--grad-hero",
    `linear-gradient(135deg, color-mix(in oklab, ${color} 88%, black), color-mix(in oklab, ${color} 78%, white))`
  );

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", color);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(DEFAULT);
  const [systemDark, setSystemDark] = useState(false);

  // Hydrate from storage + system preference on the client only.
  useEffect(() => {
    setState(readStored());
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const resolvedMode: "light" | "dark" =
    state.mode === "system" ? (systemDark ? "dark" : "light") : state.mode;

  useEffect(() => {
    applyTheme(state, resolvedMode);
  }, [state, resolvedMode]);

  const persist = useCallback((next: ThemeState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const value = useMemo<ThemeCtx>(
    () => ({
      ...state,
      resolvedMode,
      setMode: (mode) => persist({ ...state, mode }),
      setAccent: (accent) => persist({ ...state, accent }),
      setCustomColor: (customColor) => persist({ ...state, accent: "custom", customColor }),
      reset: () => persist(DEFAULT),
    }),
    [state, resolvedMode, persist]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/** Inline script that applies the saved theme before first paint (no flash). */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement;var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY
)})||"{}");var m=s.mode||"system";var dark=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",dark);d.style.colorScheme=dark?"dark":"light";var presets=${JSON.stringify(
  Object.fromEntries(ACCENTS.map((a) => [a.key, a.color]))
)};var c=s.accent==="custom"?s.customColor:presets[s.accent||"ocean"];if(c){d.style.setProperty("--primary",c);d.style.setProperty("--ring",c);d.style.setProperty("--primary-foreground",dark?"oklch(0.15 0.02 255)":"oklch(0.99 0 0)");d.style.setProperty("--primary-soft",dark?"color-mix(in oklab, "+c+" 28%, oklch(0.16 0.02 255))":"color-mix(in oklab, "+c+" 14%, white)");d.style.setProperty("--grad-hero","linear-gradient(135deg, color-mix(in oklab, "+c+" 88%, black), color-mix(in oklab, "+c+" 78%, white))");}}catch(e){}})();`;
