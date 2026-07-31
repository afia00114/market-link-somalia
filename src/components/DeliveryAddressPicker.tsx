import { useEffect, useMemo, useState } from "react";
import { MapPin, Pencil, Check, ChevronRight } from "lucide-react";
import { SOMALI_CITIES, areasForCity } from "@/data/somalia-locations";
import {
  EMPTY_ADDRESS,
  formatAddress,
  isAddressComplete,
  loadAddress,
  saveAddress,
  validateAddress,
  type AddressErrors,
  type DeliveryAddress,
} from "@/lib/delivery-address";

export function DeliveryAddressPicker({
  defaultCity,
  value,
  onChange,
}: {
  defaultCity?: string;
  value: DeliveryAddress;
  onChange: (next: DeliveryAddress) => void;
}) {
  const [editing, setEditing] = useState(true);
  const [errors, setErrors] = useState<AddressErrors>({});

  // Hydrate saved address on mount (client only).
  useEffect(() => {
    const saved = loadAddress();
    if (saved) {
      onChange(saved);
      setEditing(false);
    } else if (defaultCity && SOMALI_CITIES.some((c) => c.name === defaultCity)) {
      onChange({ ...EMPTY_ADDRESS, city: defaultCity });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const areas = useMemo(() => areasForCity(value.city), [value.city]);
  const set = (patch: Partial<DeliveryAddress>) => onChange({ ...value, ...patch });

  const confirm = () => {
    const e = validateAddress(value);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    saveAddress(value);
    setEditing(false);
  };

  if (!editing && isAddressComplete(value)) {
    return (
      <div className="mt-3 rounded-2xl border border-border bg-card p-3">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold">Deliver to</p>
            <p className="truncate text-[12px] text-muted-foreground">{formatAddress(value)}</p>
            <p className="text-[11px] text-muted-foreground">{value.phone}</p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex shrink-0 items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[11px] font-bold"
          >
            <Pencil className="h-3 w-3" />
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <h4 className="text-[13px] font-bold">Delivery address</h4>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <Field label="City" error={errors.city}>
          <select
            value={value.city}
            onChange={(e) => set({ city: e.target.value, area: "" })}
            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-[13px]"
          >
            <option value="">Select city</option>
            {SOMALI_CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Area / district" error={errors.area}>
          <select
            value={value.area}
            onChange={(e) => set({ area: e.target.value })}
            disabled={!value.city}
            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-[13px] disabled:opacity-50"
          >
            <option value="">{value.city ? "Select area" : "Pick city first"}</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-2 space-y-2">
        <Field label="Street / house" error={errors.street}>
          <input
            value={value.street}
            onChange={(e) => set({ street: e.target.value })}
            placeholder="e.g. Maka Al Mukarama Rd, house 12"
            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-[13px]"
          />
        </Field>
        <Field label="Nearby landmark (optional)">
          <input
            value={value.landmark ?? ""}
            onChange={(e) => set({ landmark: e.target.value })}
            placeholder="e.g. next to Jazeera Hotel"
            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-[13px]"
          />
        </Field>
        <Field label="Phone for the courier" error={errors.phone}>
          <input
            value={value.phone}
            onChange={(e) => set({ phone: e.target.value })}
            inputMode="tel"
            placeholder="+252 61 000 0000"
            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-[13px]"
          />
        </Field>
        <Field label="Delivery notes (optional)">
          <input
            value={value.notes ?? ""}
            onChange={(e) => set({ notes: e.target.value })}
            placeholder="e.g. call on arrival, blue gate"
            className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-[13px]"
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={confirm}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground"
      >
        <Check className="h-4 w-4" />
        Save address
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-0.5 block text-[11px] font-medium text-destructive">{error}</span>}
    </label>
  );
}
