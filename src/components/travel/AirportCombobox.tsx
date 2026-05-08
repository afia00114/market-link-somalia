import { useState } from "react";
import { Check, ChevronsUpDown, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { Airport } from "@/data/travel";

export function AirportCombobox({
  value,
  onChange,
  options,
  placeholder = "Select airport",
}: {
  value: string;
  onChange: (code: string) => void;
  options: Airport[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const sel = options.find((o) => o.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-card px-3 text-left text-sm outline-none focus:border-primary"
        >
          {sel ? (
            <span className="flex min-w-0 items-center gap-2">
              <Plane className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              <span className="truncate font-medium">
                {sel.city} <span className="text-muted-foreground">({sel.code})</span>
              </span>
              {sel.international && <span>🌍</span>}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search city or code…" />
          <CommandList>
            <CommandEmpty>No airports found.</CommandEmpty>
            <CommandGroup>
              {options.map((a) => (
                <CommandItem
                  key={a.code}
                  value={`${a.city} ${a.code} ${a.country}`}
                  onSelect={() => {
                    onChange(a.code);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === a.code ? "opacity-100" : "opacity-0")} />
                  <span className="flex-1">
                    {a.city} <span className="text-muted-foreground">({a.code})</span>
                  </span>
                  {a.international && <span className="ml-2">🌍</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
