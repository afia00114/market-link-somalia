import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export type FlightSort = "price" | "rating" | "high" | "duration";

export interface FlightFilters {
  sort: FlightSort;
  priceRange: [number, number];
  airlines: string[];
  directOnly: boolean;
  verifiedOnly: boolean;
}

const SORT_OPTIONS: { value: FlightSort; label: string }[] = [
  { value: "price", label: "Lowest price" },
  { value: "rating", label: "Highest rating" },
  { value: "high", label: "Highest price" },
  { value: "duration", label: "Shortest duration" },
];

export function FlightFiltersSheet({
  filters,
  onChange,
  priceMin,
  priceMax,
  airlineOptions,
  resultsCount,
  activeCount,
}: {
  filters: FlightFilters;
  onChange: (f: FlightFilters) => void;
  priceMin: number;
  priceMax: number;
  airlineOptions: string[];
  resultsCount: number;
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FlightFilters>(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const reset = () => {
    setDraft({
      sort: "price",
      priceRange: [priceMin, priceMax],
      airlines: [],
      directOnly: false,
      verifiedOnly: false,
    });
  };

  const apply = () => {
    onChange(draft);
    setOpen(false);
  };

  const toggleAirline = (name: string, checked: boolean) => {
    setDraft((d) => ({
      ...d,
      airlines: checked ? [...d.airlines, name] : d.airlines.filter((n) => n !== name),
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground active:scale-[0.98]">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle>Sort & filter</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-6 pb-24">
          {/* Sort */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Sort by</h3>
            <RadioGroup
              value={draft.sort}
              onValueChange={(v) => setDraft({ ...draft, sort: v as FlightSort })}
              className="grid grid-cols-2 gap-2"
            >
              {SORT_OPTIONS.map((o) => (
                <Label
                  key={o.value}
                  htmlFor={`sort-${o.value}`}
                  className={`flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 ${
                    draft.sort === o.value ? "border-primary bg-primary-soft" : "border-border bg-card"
                  }`}
                >
                  <RadioGroupItem id={`sort-${o.value}`} value={o.value} />
                  <span className="text-sm font-medium">{o.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          {/* Price */}
          {priceMax > priceMin && (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Price range</h3>
                <span className="text-xs font-semibold text-foreground">
                  ${draft.priceRange[0]} – ${draft.priceRange[1]}
                </span>
              </div>
              <Slider
                min={priceMin}
                max={priceMax}
                step={10}
                value={draft.priceRange}
                onValueChange={(v) => setDraft({ ...draft, priceRange: [v[0], v[1]] as [number, number] })}
                className="py-3"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>${priceMin}</span>
                <span>${priceMax}</span>
              </div>
            </section>
          )}

          {/* Airlines */}
          {airlineOptions.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Airlines / agencies</h3>
              <div className="space-y-1.5">
                {airlineOptions.map((name) => {
                  const checked = draft.airlines.includes(name);
                  return (
                    <Label
                      key={name}
                      htmlFor={`airline-${name}`}
                      className={`flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 ${
                        checked ? "border-primary bg-primary-soft" : "border-border bg-card"
                      }`}
                    >
                      <Checkbox
                        id={`airline-${name}`}
                        checked={checked}
                        onCheckedChange={(v) => toggleAirline(name, v === true)}
                      />
                      <span className="text-sm font-medium">{name}</span>
                    </Label>
                  );
                })}
              </div>
            </section>
          )}

          {/* Toggles */}
          <section className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5">
              <div>
                <div className="text-sm font-semibold">Direct flights only</div>
                <div className="text-[11px] text-muted-foreground">Hide flights with stopovers</div>
              </div>
              <Switch
                checked={draft.directOnly}
                onCheckedChange={(v) => setDraft({ ...draft, directOnly: v })}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5">
              <div>
                <div className="text-sm font-semibold">Verified agencies only</div>
                <div className="text-[11px] text-muted-foreground">Only MaalsoorHub-verified providers</div>
              </div>
              <Switch
                checked={draft.verifiedOnly}
                onCheckedChange={(v) => setDraft({ ...draft, verifiedOnly: v })}
              />
            </div>
          </section>
        </div>

        {/* Sticky footer */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 border-t border-border bg-background p-3">
          <button
            onClick={reset}
            className="h-12 flex-1 rounded-xl border border-border bg-card text-sm font-semibold active:scale-[0.98]"
          >
            Reset
          </button>
          <button
            onClick={apply}
            className="h-12 flex-[2] rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
          >
            Show {resultsCount} {resultsCount === 1 ? "result" : "results"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
