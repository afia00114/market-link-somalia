import { useMemo, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { COUNTRIES, type Country } from "@/data/travel";

export function CountryPickerSheet({
  selected,
  onSelect,
  label = "Country",
  placeholder = "Choose a country",
}: {
  selected?: string;
  onSelect: (c: Country) => void;
  label?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const sel = COUNTRIES.find((c) => c.code === selected);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(s) || c.code.toLowerCase().includes(s) || c.dial.includes(s),
    );
  }, [q]);

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold text-foreground">{label}</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-card px-3 text-left text-sm">
            {sel ? (
              <span className="flex items-center gap-2">
                <span className="text-xl">{sel.flag}</span>
                <span className="font-medium">{sel.name}</span>
                <span className="text-muted-foreground">+{sel.dial}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
          <SheetHeader className="border-b border-border p-4 text-left">
            <SheetTitle>Select country</SheetTitle>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, code or dial"
                className="h-11 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </SheetHeader>
          <div className="overflow-y-auto px-2 py-2" style={{ maxHeight: "calc(85vh - 130px)" }}>
            {list.map((c) => {
              const isSel = c.code === selected;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    onSelect(c);
                    setOpen(false);
                    setQ("");
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition active:scale-[0.99] ${
                    isSel ? "bg-primary-soft" : "hover:bg-secondary"
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">+{c.dial}</div>
                  </div>
                  {isSel && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
            {list.length === 0 && (
              <div className="py-10 text-center text-xs text-muted-foreground">No matches</div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
