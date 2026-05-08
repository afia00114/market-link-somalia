import { Minus, Plus } from "lucide-react";

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 9,
  label,
  hint,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label: string;
  hint?: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center justify-between rounded-xl border border-input bg-card px-3 py-2">
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground active:scale-95 disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center text-base font-bold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground active:scale-95 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
