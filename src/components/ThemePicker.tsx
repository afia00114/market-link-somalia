import { Check, Monitor, Moon, Sun } from "lucide-react";
import { ACCENTS, useTheme, type ThemeMode } from "@/lib/theme/ThemeProvider";

const MODES: { key: ThemeMode; label: string; icon: typeof Sun }[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "Auto", icon: Monitor },
];

export function ThemePicker() {
  const { mode, setMode, accent, customColor, setAccent, setCustomColor, reset } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs font-semibold text-muted-foreground">Appearance</div>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(({ key, label, icon: Icon }) => {
            const active = mode === key;
            return (
              <button
                key={key}
                onClick={() => setMode(key)}
                aria-pressed={active}
                className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition active:scale-[0.98] sm:flex-row sm:justify-center sm:gap-2 sm:text-sm ${
                  active
                    ? "border-primary bg-primary-soft text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold text-muted-foreground">Accent color</div>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
          {ACCENTS.map((a) => {
            const active = accent === a.key;
            return (
              <button
                key={a.key}
                onClick={() => setAccent(a.key)}
                aria-label={a.label}
                aria-pressed={active}
                title={a.label}
                className={`grid aspect-square w-full place-items-center rounded-full border-2 transition active:scale-95 ${
                  active ? "border-foreground" : "border-transparent"
                }`}
                style={{ backgroundColor: a.color }}
              >
                {active && <Check className="h-4 w-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-secondary p-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-foreground">Custom color</div>
          <div className="truncate text-[11px] text-muted-foreground">
            {accent === "custom" ? customColor.toUpperCase() : "Pick your own accent"}
          </div>
        </div>
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          aria-label="Custom accent color"
          className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-card p-1"
        />
      </div>

      <button
        onClick={reset}
        className="w-full rounded-xl border border-border bg-card py-2.5 text-sm font-semibold text-muted-foreground active:scale-[0.99]"
      >
        Reset to default theme
      </button>
    </div>
  );
}
