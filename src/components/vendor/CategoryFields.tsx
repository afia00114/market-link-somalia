import type { CategoryAnswers, FieldSpec } from "@/data/vendor-application-schemas";

interface Props {
  fields: FieldSpec[];
  answers: CategoryAnswers;
  onChange: (key: string, value: string | string[] | boolean) => void;
}

export function CategoryFields({ fields, answers, onChange }: Props) {
  if (fields.length === 0) return null;
  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <FieldRenderer key={f.key} field={f} value={answers[f.key]} onChange={(v) => onChange(f.key, v)} />
      ))}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldSpec;
  value: string | string[] | boolean | undefined;
  onChange: (v: string | string[] | boolean) => void;
}) {
  const label = (
    <label className="mb-1 block text-xs font-medium text-muted-foreground">
      {field.label}
      {"required" in field && field.required && " *"}
    </label>
  );

  if (field.type === "text" || field.type === "tel" || field.type === "number") {
    return (
      <div>
        {label}
        <input
          type={field.type === "number" ? "number" : "text"}
          inputMode={field.type === "tel" ? "tel" : field.type === "number" ? "numeric" : undefined}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"placeholder" in field ? field.placeholder : undefined}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        />
        {"hint" in field && field.hint && <p className="mt-1 text-[11px] text-muted-foreground">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder={"placeholder" in field ? field.placeholder : undefined}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        {label}
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        >
          <option value="">Select…</option>
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "multiselect-chip") {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (opt: string) => {
      const next = selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt];
      onChange(next);
    };
    return (
      <div>
        {label}
        <div className="flex flex-wrap gap-1.5">
          {field.options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "toggle") {
    const on = value === true;
    return (
      <button
        type="button"
        onClick={() => onChange(!on)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
      >
        <span className="font-medium text-foreground">{field.label}</span>
        <span
          className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-secondary"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`}
          />
        </span>
      </button>
    );
  }

  return null;
}
