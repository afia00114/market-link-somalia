import { useState } from "react";
import { Plus, X, Save, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type CategoryKey } from "@/data/categories";

export interface PostFormValue {
  id?: string;
  title: string;
  description: string;
  category_key: string;
  price: string;
  price_unit: string;
  currency: string;
  image_url: string;
  location: string;
  gallery_urls: string[];
  services: ServiceItem[];
  departments: DeptItem[];
  working_hours: WorkingHours;
  languages: string[];
  amenities: string[];
  badges: string[];
  response_time_minutes: string;
  experience_years: string;
  contact: { phone: string; whatsapp: string; email: string; address: string };
  booking_enabled: boolean;
  booking_note: string;
}

export interface ServiceItem {
  name: string;
  price: string;
  price_unit: string;
  badge?: string;
  description?: string;
}
export interface DeptItem { name: string; }

export type WorkingHours = Record<
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
  { open: string; close: string; closed: boolean }
> & { note?: string };

const DAYS: Array<keyof WorkingHours> = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABEL: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

const DEFAULT_HOURS: WorkingHours = {
  mon: { open: "08:00", close: "20:00", closed: false },
  tue: { open: "08:00", close: "20:00", closed: false },
  wed: { open: "08:00", close: "20:00", closed: false },
  thu: { open: "08:00", close: "20:00", closed: false },
  fri: { open: "08:00", close: "20:00", closed: false },
  sat: { open: "09:00", close: "18:00", closed: false },
  sun: { open: "00:00", close: "00:00", closed: true },
};

const BADGE_OPTIONS = ["Verified", "24/7 Open", "Popular", "Featured", "New"];
const AMENITY_BY_CATEGORY: Partial<Record<CategoryKey, string[]>> = {
  health: ["24/7 Emergency", "Pharmacy", "Laboratory", "ICU", "Ambulance", "Maternity", "Radiology", "Dental"],
  hotels: ["WiFi", "Parking", "Restaurant", "AC", "Pool", "Gym", "Airport shuttle", "Laundry"],
  services: ["Licensed", "Insured", "Locally owned", "Card & cash", "Same-day"],
  food: ["Delivery", "Takeaway", "Dine-in", "Halal", "Family"],
  travel: ["Visa support", "24/7 support", "Refundable", "Group rates"],
  vehicles: ["Warranty", "Financing", "Trade-in", "Test drive"],
  "real-estate": ["Verified listings", "Site visits", "Mortgage help"],
  livestock: ["Healthy", "Vaccinated", "Delivery"],
  jobs: ["Remote OK", "Visa sponsor"],
  banking: ["Mobile app", "ATM", "Forex"],
};
const LANGUAGE_OPTIONS = ["Somali", "English", "Arabic", "Swahili", "Turkish"];

export function emptyForm(defaultCategory: string): PostFormValue {
  return {
    title: "",
    description: "",
    category_key: defaultCategory,
    price: "",
    price_unit: "",
    currency: "USD",
    image_url: "",
    location: "",
    gallery_urls: [],
    services: [],
    departments: [],
    working_hours: DEFAULT_HOURS,
    languages: [],
    amenities: [],
    badges: [],
    response_time_minutes: "",
    experience_years: "",
    contact: { phone: "", whatsapp: "", email: "", address: "" },
    booking_enabled: true,
    booking_note: "",
  };
}

export function formFromPost(p: any, defaultCategory: string): PostFormValue {
  const base = emptyForm(defaultCategory);
  if (!p) return base;
  return {
    ...base,
    id: p.id,
    title: p.title ?? "",
    description: p.description ?? "",
    category_key: p.category_key ?? defaultCategory,
    price: p.price?.toString() ?? "",
    price_unit: p.price_unit ?? "",
    currency: p.currency ?? "USD",
    image_url: p.image_url ?? "",
    location: p.location ?? "",
    gallery_urls: p.gallery_urls ?? [],
    services: Array.isArray(p.services) ? p.services : [],
    departments: Array.isArray(p.departments) ? p.departments : [],
    working_hours: p.working_hours && Object.keys(p.working_hours).length ? { ...DEFAULT_HOURS, ...p.working_hours } : DEFAULT_HOURS,
    languages: p.languages ?? [],
    amenities: p.amenities ?? [],
    badges: p.badges ?? [],
    response_time_minutes: p.response_time_minutes?.toString() ?? "",
    experience_years: p.experience_years?.toString() ?? "",
    contact: { phone: "", whatsapp: "", email: "", address: "", ...(p.contact ?? {}) },
    booking_enabled: p.booking_enabled ?? true,
    booking_note: p.booking_note ?? "",
  };
}

type Tab = "basics" | "media" | "services" | "sections" | "hours" | "contact";
const TABS: { key: Tab; label: string }[] = [
  { key: "basics", label: "Basics" },
  { key: "media", label: "Media" },
  { key: "services", label: "Services" },
  { key: "sections", label: "Sections" },
  { key: "hours", label: "Hours" },
  { key: "contact", label: "Contact" },
];

interface Props {
  vendorId: string;
  defaultCategory: string;
  post: any | null;
  onClose: () => void;
  onSaved: () => void;
}

export function PostEditor({ vendorId, defaultCategory, post, onClose, onSaved }: Props) {
  const [form, setForm] = useState<PostFormValue>(() => formFromPost(post, defaultCategory));
  const [tab, setTab] = useState<Tab>("basics");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const update = <K extends keyof PostFormValue>(key: K, value: PostFormValue[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setErr(null);
    if (form.title.trim().length < 2) { setTab("basics"); return setErr("Title is required"); }
    setSaving(true);
    const payload: any = {
      vendor_id: vendorId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      category_key: form.category_key,
      price: form.price ? Number(form.price) : null,
      price_unit: form.price_unit.trim() || null,
      currency: form.currency || "USD",
      image_url: form.image_url.trim() || null,
      location: form.location.trim() || null,
      gallery_urls: form.gallery_urls.filter((u) => u.trim()),
      services: form.services.filter((s) => s.name.trim()),
      departments: form.departments.filter((d) => d.name.trim()),
      working_hours: form.working_hours,
      languages: form.languages,
      amenities: form.amenities,
      badges: form.badges,
      response_time_minutes: form.response_time_minutes ? Number(form.response_time_minutes) : null,
      experience_years: form.experience_years ? Number(form.experience_years) : null,
      contact: form.contact,
      booking_enabled: form.booking_enabled,
      booking_note: form.booking_note.trim() || null,
    };
    const { error } = post
      ? await supabase.from("vendor_posts").update(payload).eq("id", post.id)
      : await supabase.from("vendor_posts").insert(payload);

    setSaving(false);
    if (error) return setErr(error.message);
    onSaved();
  };

  const catKey = form.category_key as CategoryKey;
  const amenityChoices = AMENITY_BY_CATEGORY[catKey] ?? AMENITY_BY_CATEGORY.services!;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex h-[92vh] w-full max-w-lg flex-col rounded-t-3xl bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 pb-3 pt-4">
          <h2 className="text-base font-bold">{post ? "Edit posting" : "New posting"}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >{t.label}</button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {tab === "basics" && (
            <>
              <Field label="Title" required>
                <input value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} placeholder="e.g. Fast Plumbing" />
              </Field>
              <Field label="Category">
                <select value={form.category_key} onChange={(e) => update("category_key", e.target.value)} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Short description">
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} maxLength={600} className={inputCls} placeholder="A short intro shown on the listing page." />
              </Field>
              <Field label="Location">
                <input value={form.location} onChange={(e) => update("location", e.target.value)} className={inputCls} placeholder="e.g. Wadajir, Mogadishu" />
              </Field>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Price">
                  <input value={form.price} onChange={(e) => update("price", e.target.value)} inputMode="decimal" className={inputCls} placeholder="25" />
                </Field>
                <Field label="Per">
                  <input value={form.price_unit} onChange={(e) => update("price_unit", e.target.value)} className={inputCls} placeholder="hr, job, night" />
                </Field>
                <Field label="Currency">
                  <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className={inputCls}>
                    <option>USD</option><option>SOS</option>
                  </select>
                </Field>
              </div>
              <Field label="Badges (what to show on the cover)">
                <ChipPicker options={BADGE_OPTIONS} selected={form.badges} onChange={(v) => update("badges", v)} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Responds within (mins)">
                  <input value={form.response_time_minutes} onChange={(e) => update("response_time_minutes", e.target.value)} inputMode="numeric" className={inputCls} placeholder="60" />
                </Field>
                <Field label="Years of experience">
                  <input value={form.experience_years} onChange={(e) => update("experience_years", e.target.value)} inputMode="numeric" className={inputCls} placeholder="5" />
                </Field>
              </div>
            </>
          )}

          {tab === "media" && (
            <>
              <Field label="Cover image URL">
                <input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} className={inputCls} placeholder="https://…" />
              </Field>
              {form.image_url && (
                <img src={form.image_url} alt="" className="h-40 w-full rounded-xl object-cover" />
              )}
              <Field label="Gallery (extra photos)">
                <div className="space-y-2">
                  {form.gallery_urls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={url}
                        onChange={(e) => update("gallery_urls", form.gallery_urls.map((u, idx) => idx === i ? e.target.value : u))}
                        className={inputCls}
                        placeholder="https://…"
                      />
                      <button type="button" onClick={() => update("gallery_urls", form.gallery_urls.filter((_, idx) => idx !== i))}
                        className="rounded-xl bg-secondary px-3 text-sm"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => update("gallery_urls", [...form.gallery_urls, ""])}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-xs text-muted-foreground">
                    <ImageIcon className="h-3 w-3" /> Add photo URL
                  </button>
                </div>
              </Field>
            </>
          )}

          {tab === "services" && (
            <>
              <p className="text-xs text-muted-foreground">"What we offer" — each row shows on the listing page with a price and a tap-to-book action.</p>
              {form.services.map((s, i) => (
                <div key={i} className="space-y-2 rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Service {i + 1}</span>
                    <button type="button" onClick={() => update("services", form.services.filter((_, idx) => idx !== i))}
                      className="text-xs text-destructive">Remove</button>
                  </div>
                  <input value={s.name} onChange={(e) => updateServiceField(form, update, i, "name", e.target.value)} className={inputCls} placeholder="Service name (e.g. Leak Detection)" />
                  <div className="grid grid-cols-3 gap-2">
                    <input value={s.price} onChange={(e) => updateServiceField(form, update, i, "price", e.target.value)} className={inputCls} placeholder="Price" inputMode="decimal" />
                    <input value={s.price_unit} onChange={(e) => updateServiceField(form, update, i, "price_unit", e.target.value)} className={inputCls} placeholder="unit (flat, hr)" />
                    <input value={s.badge ?? ""} onChange={(e) => updateServiceField(form, update, i, "badge", e.target.value)} className={inputCls} placeholder="Badge (Popular)" />
                  </div>
                  <input value={s.description ?? ""} onChange={(e) => updateServiceField(form, update, i, "description", e.target.value)} className={inputCls} placeholder="Short detail (optional)" />
                </div>
              ))}
              <button type="button" onClick={() => update("services", [...form.services, { name: "", price: "", price_unit: "" }])}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary py-2.5 text-sm font-semibold text-primary">
                <Plus className="h-4 w-4" /> Add service
              </button>
            </>
          )}

          {tab === "sections" && (
            <>
              <Field label="Departments / categories (icon tiles on listing)">
                <div className="space-y-2">
                  {form.departments.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={d.name}
                        onChange={(e) => update("departments", form.departments.map((x, idx) => idx === i ? { name: e.target.value } : x))}
                        className={inputCls}
                        placeholder="e.g. Cardiology, Pediatrics"
                      />
                      <button type="button" onClick={() => update("departments", form.departments.filter((_, idx) => idx !== i))}
                        className="rounded-xl bg-secondary px-3"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => update("departments", [...form.departments, { name: "" }])}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-xs">
                    <Plus className="h-3 w-3" /> Add department
                  </button>
                </div>
              </Field>
              <Field label="Amenities / features">
                <ChipPicker options={amenityChoices} selected={form.amenities} onChange={(v) => update("amenities", v)} allowCustom />
              </Field>
              <Field label="Languages spoken">
                <ChipPicker options={LANGUAGE_OPTIONS} selected={form.languages} onChange={(v) => update("languages", v)} />
              </Field>
            </>
          )}

          {tab === "hours" && (
            <>
              <p className="text-xs text-muted-foreground">Customers will see "Open now" automatically based on these hours.</p>
              <div className="overflow-hidden rounded-xl border border-border">
                {DAYS.map((d) => {
                  const day = form.working_hours[d] as { open: string; close: string; closed: boolean };
                  return (
                    <div key={d} className="grid grid-cols-[60px_1fr_1fr_72px] items-center gap-2 border-b border-border bg-background px-3 py-2 last:border-b-0">
                      <span className="text-xs font-semibold">{DAY_LABEL[d]}</span>
                      <input type="time" disabled={day.closed} value={day.open}
                        onChange={(e) => update("working_hours", { ...form.working_hours, [d]: { ...day, open: e.target.value } })}
                        className="rounded-lg border border-border bg-card px-2 py-1 text-xs disabled:opacity-40" />
                      <input type="time" disabled={day.closed} value={day.close}
                        onChange={(e) => update("working_hours", { ...form.working_hours, [d]: { ...day, close: e.target.value } })}
                        className="rounded-lg border border-border bg-card px-2 py-1 text-xs disabled:opacity-40" />
                      <label className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                        <input type="checkbox" checked={day.closed}
                          onChange={(e) => update("working_hours", { ...form.working_hours, [d]: { ...day, closed: e.target.checked } })} />
                        Closed
                      </label>
                    </div>
                  );
                })}
              </div>
              <Field label="Hours note (optional)">
                <input value={form.working_hours.note ?? ""}
                  onChange={(e) => update("working_hours", { ...form.working_hours, note: e.target.value })}
                  className={inputCls} placeholder="e.g. Sunday on call (emergency)" />
              </Field>
            </>
          )}

          {tab === "contact" && (
            <>
              <p className="text-xs text-muted-foreground">These contact details show on this posting. Leave blank to use your profile defaults.</p>
              <Field label="Phone"><input value={form.contact.phone} onChange={(e) => update("contact", { ...form.contact, phone: e.target.value })} className={inputCls} inputMode="tel" placeholder="+252 61 123 4567" /></Field>
              <Field label="WhatsApp"><input value={form.contact.whatsapp} onChange={(e) => update("contact", { ...form.contact, whatsapp: e.target.value })} className={inputCls} inputMode="tel" placeholder="+252 61 123 4567" /></Field>
              <Field label="Email"><input value={form.contact.email} onChange={(e) => update("contact", { ...form.contact, email: e.target.value })} className={inputCls} inputMode="email" placeholder="info@example.so" /></Field>
              <Field label="Address"><input value={form.contact.address} onChange={(e) => update("contact", { ...form.contact, address: e.target.value })} className={inputCls} placeholder="Street, district, city" /></Field>

              <label className="flex items-center justify-between rounded-xl bg-secondary p-3 text-sm">
                <span>Allow booking requests on this posting</span>
                <input type="checkbox" checked={form.booking_enabled} onChange={(e) => update("booking_enabled", e.target.checked)} />
              </label>
              <Field label="Booking note (shown above the booking button)">
                <textarea value={form.booking_note} onChange={(e) => update("booking_note", e.target.value)} rows={2} className={inputCls}
                  placeholder="Send a booking request directly. We'll confirm via your preferred channel." />
              </Field>
            </>
          )}
        </div>

        {err && <p className="px-4 pb-1 text-xs text-destructive">{err}</p>}
        <div className="flex gap-2 border-t border-border px-4 py-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-secondary py-2.5 text-sm font-semibold">Cancel</button>
          <button onClick={save} disabled={saving} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save posting"}
          </button>
        </div>
      </div>
    </div>
  );
}

function updateServiceField(
  form: PostFormValue,
  update: <K extends keyof PostFormValue>(k: K, v: PostFormValue[K]) => void,
  i: number,
  key: keyof ServiceItem,
  value: string,
) {
  update("services", form.services.map((s, idx) => idx === i ? { ...s, [key]: value } : s));
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}{required && " *"}</label>
      {children}
    </div>
  );
}

function ChipPicker({ options, selected, onChange, allowCustom }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void; allowCustom?: boolean;
}) {
  const [custom, setCustom] = useState("");
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt]);
  };
  const addCustom = () => {
    const v = custom.trim();
    if (!v || selected.includes(v)) return;
    onChange([...selected, v]);
    setCustom("");
  };
  const all = Array.from(new Set([...options, ...selected]));
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {all.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
              }`}>{opt}</button>
          );
        })}
      </div>
      {allowCustom && (
        <div className="mt-2 flex gap-2">
          <input value={custom} onChange={(e) => setCustom(e.target.value)} className={inputCls + " text-xs"} placeholder="Add your own…" />
          <button type="button" onClick={addCustom} className="rounded-xl bg-secondary px-3 text-xs font-semibold">Add</button>
        </div>
      )}
    </div>
  );
}
