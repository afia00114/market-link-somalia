import { COUNTRIES, type Country } from "@/data/travel";

export function CountrySelect({
  label = "Select country",
  selected,
  onSelect,
  countries = COUNTRIES,
}: {
  label?: string;
  selected?: string;
  onSelect: (c: Country) => void;
  countries?: Country[];
}) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-bold text-foreground">{label}</h2>
      <div className="grid grid-cols-2 gap-2">
        {countries.map((c) => {
          const isSel = selected === c.code;
          return (
            <button
              key={c.code}
              onClick={() => onSelect(c)}
              className={`flex items-center gap-2 rounded-2xl border p-3 text-left transition active:scale-[0.98] ${
                isSel ? "border-primary bg-primary-soft" : "border-border bg-card"
              }`}
            >
              <span className="text-2xl">{c.flag}</span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">+{c.dial}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
