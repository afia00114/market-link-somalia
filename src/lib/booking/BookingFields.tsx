import { User, Mail, Smartphone } from "lucide-react";
import type { BookingFormValues, FieldErrors } from "@/lib/booking/schema";

interface Props {
  values: BookingFormValues;
  onChange: (next: BookingFormValues) => void;
  errors: FieldErrors;
  accent?: string; // Tailwind color class like "primary", "flights"
  showNotes?: boolean;
}

export function BookingFields({
  values,
  onChange,
  errors,
  accent = "primary",
  showNotes = true,
}: Props) {
  const set = <K extends keyof BookingFormValues>(k: K, v: BookingFormValues[K]) =>
    onChange({ ...values, [k]: v });

  return (
    <div className="space-y-3">
      <FieldRow icon={User} label="Full name" error={errors.passengerName} accent={accent}>
        <input
          value={values.passengerName}
          onChange={(e) => set("passengerName", e.target.value)}
          placeholder="As on ID / passport"
          autoComplete="name"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </FieldRow>

      <FieldRow icon={Mail} label="Email" error={errors.passengerEmail} accent={accent}>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.passengerEmail}
          onChange={(e) => set("passengerEmail", e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </FieldRow>

      <FieldRow icon={Smartphone} label="Phone" error={errors.passengerPhone} accent={accent}>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.passengerPhone}
          onChange={(e) => set("passengerPhone", e.target.value)}
          placeholder="+252 61 000 0000"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </FieldRow>

      {showNotes && (
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
            Notes (optional)
          </label>
          <textarea
            value={values.notes ?? ""}
            onChange={(e) => set("notes", e.target.value.slice(0, 500))}
            rows={3}
            placeholder="Special requests, preferences, etc."
            className={`w-full rounded-xl border bg-card p-3 text-sm outline-none transition focus:border-${accent} ${
              errors.notes ? "border-destructive" : "border-border"
            }`}
          />
          <div className="mt-1 flex items-center justify-between text-[10px]">
            {errors.notes ? (
              <span className="text-destructive">{errors.notes}</span>
            ) : (
              <span className="text-muted-foreground">Helps the provider prepare</span>
            )}
            <span className="text-muted-foreground">{(values.notes ?? "").length}/500</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldRow({
  icon: Icon,
  label,
  error,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  error?: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 transition ${
          error
            ? "border-destructive ring-1 ring-destructive/20"
            : `border-border focus-within:border-${accent} focus-within:ring-1 focus-within:ring-${accent}/30`
        }`}
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
      </div>
      {error && <div className="mt-1 text-[11px] font-medium text-destructive">{error}</div>}
    </div>
  );
}
