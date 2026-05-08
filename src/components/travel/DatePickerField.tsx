import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerField({
  value,
  onChange,
  placeholder = "Pick a date",
  minDate,
}: {
  value?: Date;
  onChange: (d?: Date) => void;
  placeholder?: string;
  minDate?: Date;
}) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = minDate ?? today;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-input bg-card px-3 text-left text-sm outline-none focus:border-primary",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">{value ? format(value, "EEE, d MMM yyyy") : placeholder}</span>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d);
            if (d) setOpen(false);
          }}
          disabled={(date) => date < min}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
