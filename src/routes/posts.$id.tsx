import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Share2, MapPin, Phone, Mail, Copy, Star, Clock, ShieldCheck,
  MessageCircle, Stethoscope, Hospital as HospitalIcon, HeartPulse, Baby,
  Bone, Eye, Smile, FlaskConical, Scan, Pill, Wrench, BedDouble, Plane, Home, Languages,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { ChatStartButton } from "@/components/ChatStartButton";
import { PayButton } from "@/components/PayButton";

const SITE_URL = "https://market-link-somalia.lovable.app";

interface PostRow {
  id: string;
  vendor_id: string;
  title: string;
  description: string | null;
  category_key: string;
  price: number | null;
  price_unit: string | null;
  currency: string | null;
  image_url: string | null;
  location: string | null;
  gallery_urls: string[] | null;
  services: any[] | null;
  departments: any[] | null;
  working_hours: any;
  languages: string[] | null;
  amenities: string[] | null;
  badges: string[] | null;
  response_time_minutes: number | null;
  experience_years: number | null;
  contact: any;
  booking_enabled: boolean;
  booking_note: string | null;
}

interface VendorLite {
  id: string;
  business_name: string;
  phone: string;
  whatsapp: string | null;
  location: string | null;
}

export const Route = createFileRoute("/posts/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("vendor_posts")
      .select("*")
      .eq("id", params.id)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) throw notFound();
    const { data: vendor } = await supabase
      .from("vendor_profiles")
      .select("id,business_name,phone,whatsapp,location")
      .eq("id", (data as any).vendor_id)
      .maybeSingle();
    return { post: data as PostRow, vendor: (vendor as VendorLite) ?? null };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.post;
    const url = `${SITE_URL}/posts/${params.id}`;
    if (!p) {
      return { meta: [{ title: "Listing — MaalsoorHub" }, { name: "description", content: "View this listing on MaalsoorHub." }] };
    }
    const cat = p.category_key.replace(/-/g, " ");
    const title = trunc(`${p.title} — ${cat} on MaalsoorHub`, 60);
    const desc = trunc(p.description?.trim() || `${p.title} on MaalsoorHub. Browse details, contact directly, and request a booking.`, 160);
    const meta: any[] = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: url },
      { property: "og:type", content: "product" },
      { property: "twitter:title", content: title },
      { property: "twitter:description", content: desc },
    ];
    if (p.image_url) {
      meta.push({ property: "og:image", content: p.image_url });
      meta.push({ property: "twitter:image", content: p.image_url });
    }
    return { meta, links: [{ rel: "canonical", href: url }] };
  },
  notFoundComponent: () => <AppShell><div className="p-6 text-sm">Listing not found.</div></AppShell>,
  errorComponent: () => <AppShell><div className="p-6 text-sm">Something went wrong loading this listing.</div></AppShell>,
  component: PostDetail,
});

function trunc(s: string, n: number) { return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…"; }

function PostDetail() {
  const { post, vendor } = Route.useLoaderData();
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  const contact = {
    phone: post.contact?.phone || vendor?.phone || "",
    whatsapp: post.contact?.whatsapp || vendor?.whatsapp || "",
    email: post.contact?.email || "",
    address: post.contact?.address || post.location || vendor?.location || "",
  };

  const openNow = useMemo(() => isOpenNow(post.working_hours), [post.working_hours]);
  const galleryAll = [post.image_url, ...(post.gallery_urls ?? [])].filter(Boolean) as string[];
  const [activePhoto, setActivePhoto] = useState(0);
  const cover = galleryAll[activePhoto] ?? null;

  const copy = (label: string, value: string) => {
    if (!value) return;
    navigator.clipboard?.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const share = async () => {
    const url = `${SITE_URL}/posts/${post.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url }); return; } catch {}
    }
    copy("link", url);
  };

  const goBook = () => navigate({ to: "/messages" });

  return (
    <AppShell>
      {/* Hero */}
      <div className="relative">
        {cover ? (
          <img src={cover} alt={post.title} className="h-56 w-full object-cover" />
        ) : (
          <div className="h-56 w-full bg-secondary" />
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-3">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </Link>
          <button onClick={share} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft">
            <Share2 className="h-4 w-4 text-foreground" />
          </button>
        </div>
        <div className="absolute left-3 top-14 flex flex-wrap gap-1.5">
          {openNow !== null && (
            <Badge tone={openNow ? "success" : "muted"} icon={<Clock className="h-3 w-3" />}>{openNow ? "Open now" : "Closed"}</Badge>
          )}
          {(post.badges ?? []).map((b) => (
            <Badge key={b} tone={b.toLowerCase().includes("verified") ? "primary" : "neutral"} icon={b.toLowerCase().includes("verified") ? <ShieldCheck className="h-3 w-3" /> : undefined}>{b}</Badge>
          ))}
        </div>
      </div>

      {/* Title block */}
      <section className="px-4 pt-4">
        <h1 className="flex items-start gap-2 text-lg font-bold leading-tight">
          {post.title}
          {(post.badges ?? []).some((b) => b.toLowerCase().includes("verified")) && (
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          )}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="capitalize">{post.category_key.replace(/-/g, " ")}</span>
          {post.experience_years != null && <span>• {post.experience_years}+ yrs experience</span>}
          {post.response_time_minutes != null && <span>• Responds in under {post.response_time_minutes < 60 ? `${post.response_time_minutes} min` : `${Math.round(post.response_time_minutes / 60)} hr`}</span>}
        </div>
        {post.price != null && (
          <p className="mt-1 text-sm font-bold text-primary">
            From {post.currency ?? "USD"} {post.price}{post.price_unit ? `/${post.price_unit}` : ""}
          </p>
        )}
        {post.location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {post.location}</p>
        )}
      </section>

      {/* Gallery strip */}
      {galleryAll.length > 1 && (
        <section className="mt-3 px-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {galleryAll.map((url, i) => (
              <button key={i} onClick={() => setActivePhoto(i)}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border ${i === activePhoto ? "border-primary ring-2 ring-primary" : "border-border"}`}>
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Quick actions */}
      <section className="mt-4 grid grid-cols-4 gap-2 px-4">
        <ActionTile icon={<Phone className="h-4 w-4" />} label="Call" disabled={!contact.phone} onClick={() => contact.phone && (window.location.href = `tel:${contact.phone}`)} />
        <ActionTile icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" disabled={!contact.whatsapp} onClick={() => contact.whatsapp && window.open(`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`, "_blank")} />
        <ActionTile icon={<Mail className="h-4 w-4" />} label="Email" disabled={!contact.email} onClick={() => contact.email && (window.location.href = `mailto:${contact.email}`)} />
        <ActionTile icon={<Copy className="h-4 w-4" />} label={copied === "link" ? "Copied" : "Copy"} onClick={() => copy("link", `${SITE_URL}/posts/${post.id}`)} />
      </section>

      {/* About */}
      {post.description && (
        <section className="mt-5 px-4">
          <h2 className="mb-1 text-sm font-bold">About</h2>
          <p className="text-sm text-muted-foreground">{post.description}</p>
        </section>
      )}

      {/* Amenities */}
      {(post.amenities ?? []).length > 0 && (
        <section className="mt-5 px-4">
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold"><Star className="h-3.5 w-3.5 text-primary" /> What we offer</h2>
          <div className="grid grid-cols-2 gap-2">
            {(post.amenities ?? []).map((a) => (
              <div key={a} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> {a}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services menu */}
      {(post.services ?? []).length > 0 && (
        <section className="mt-5 px-4">
          <div className="mb-2 flex items-end justify-between">
            <h2 className="text-sm font-bold">What {post.title} offers</h2>
            <span className="text-[11px] text-muted-foreground">{(post.services ?? []).length} services</span>
          </div>
          <ul className="space-y-2">
            {(post.services ?? []).map((s: any, i: number) => (
              <li key={i} className="rounded-2xl border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{s.name}</span>
                      {s.badge && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">{s.badge}</span>}
                    </div>
                    {s.description && <p className="mt-0.5 text-[11px] text-muted-foreground">{s.description}</p>}
                  </div>
                  {s.price && (
                    <span className="whitespace-nowrap text-xs font-bold text-primary">
                      {post.currency ?? "USD"} {s.price}{s.price_unit ? `/${s.price_unit}` : ""}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Departments */}
      {(post.departments ?? []).length > 0 && (
        <section className="mt-5 px-4">
          <h2 className="mb-2 text-sm font-bold">Departments</h2>
          <div className="grid grid-cols-3 gap-2">
            {(post.departments ?? []).map((d: any, i: number) => {
              const Icon = pickDeptIcon(d.name);
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card px-2 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-center text-[11px] font-semibold">{d.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Working hours */}
      {post.working_hours && Object.keys(post.working_hours).length > 0 && (
        <section className="mt-5 px-4">
          <h2 className="mb-2 text-sm font-bold">Working hours</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card text-xs">
            {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const).map((d) => {
              const day = post.working_hours?.[d];
              if (!day) return null;
              return (
                <div key={d} className="flex items-center justify-between border-b border-border px-3 py-2 last:border-b-0">
                  <span className="font-semibold">{DAY_FULL[d]}</span>
                  <span className="text-muted-foreground">
                    {day.closed ? "Closed" : `${day.open} – ${day.close}`}
                  </span>
                </div>
              );
            })}
            {post.working_hours?.note && (
              <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">{post.working_hours.note}</div>
            )}
          </div>
        </section>
      )}

      {/* Languages */}
      {(post.languages ?? []).length > 0 && (
        <section className="mt-5 px-4">
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold"><Languages className="h-3.5 w-3.5" /> Languages</h2>
          <div className="flex flex-wrap gap-1.5">
            {(post.languages ?? []).map((l) => (
              <span key={l} className="rounded-full border border-border bg-card px-3 py-1 text-xs">{l}</span>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="mt-5 px-4">
        <h2 className="mb-2 text-sm font-bold">Contact</h2>
        <div className="space-y-2">
          {contact.phone && <ContactRow icon={<Phone className="h-4 w-4 text-primary" />} label="Phone" value={contact.phone} onCopy={() => copy("phone", contact.phone)} copied={copied === "phone"} />}
          {contact.whatsapp && <ContactRow icon={<MessageCircle className="h-4 w-4 text-primary" />} label="WhatsApp" value={contact.whatsapp} onCopy={() => copy("whatsapp", contact.whatsapp)} copied={copied === "whatsapp"} />}
          {contact.email && <ContactRow icon={<Mail className="h-4 w-4 text-primary" />} label="Email" value={contact.email} onCopy={() => copy("email", contact.email)} copied={copied === "email"} />}
          {contact.address && <ContactRow icon={<MapPin className="h-4 w-4 text-primary" />} label="Address" value={contact.address} onCopy={() => copy("address", contact.address)} copied={copied === "address"} />}
        </div>
      </section>

      {/* Booking CTA */}
      {post.booking_enabled && vendor && (
        <section className="mt-6 px-4">
          <div className="rounded-2xl bg-primary/10 p-4">
            <h3 className="text-sm font-bold text-primary">Book an Appointment</h3>
            <p className="mt-1 text-xs text-foreground/80">{post.booking_note ?? `Send a booking request directly to ${post.title}. They'll confirm via your preferred channel.`}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <ChatStartButton vendorId={vendor.id} postId={post.id} label="Request Appointment" className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground" />
              <PayButton vendorId={vendor.id} postId={post.id} defaultAmount={post.price ?? undefined} defaultCurrency={(post.currency as "USD" | "SOS") ?? "USD"} className="flex items-center justify-center gap-1.5 rounded-xl bg-card py-2.5 text-sm font-semibold text-primary" label="Pay now" />
            </div>
          </div>
        </section>
      )}

      <div className="h-6" />
    </AppShell>
  );
}

const DAY_FULL: Record<string, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
};

function Badge({ children, tone, icon }: { children: React.ReactNode; tone: "primary" | "success" | "neutral" | "muted"; icon?: React.ReactNode }) {
  const cls = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-emerald-500 text-white",
    neutral: "bg-white/90 text-foreground",
    muted: "bg-foreground/70 text-white",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-soft ${cls}`}>
      {icon}{children}
    </span>
  );
}

function ActionTile({ icon, label, onClick, disabled }: { icon: React.ReactNode; label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card py-3 text-xs font-semibold disabled:opacity-40">
      <span className="text-primary">{icon}</span>{label}
    </button>
  );
}

function ContactRow({ icon, label, value, onCopy, copied }: { icon: React.ReactNode; label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
      <button onClick={onCopy} className="rounded-lg bg-secondary px-2 py-1.5 text-xs">
        {copied ? "Copied" : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}

function pickDeptIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("cardio")) return HeartPulse;
  if (n.includes("pediat") || n.includes("child")) return Baby;
  if (n.includes("ortho")) return Bone;
  if (n.includes("eye") || n.includes("oph")) return Eye;
  if (n.includes("dental") || n.includes("teeth")) return Smile;
  if (n.includes("lab") || n.includes("path")) return FlaskConical;
  if (n.includes("radio") || n.includes("mri") || n.includes("ct")) return Scan;
  if (n.includes("pharm")) return Pill;
  if (n.includes("neuro") || n.includes("brain")) return Stethoscope;
  if (n.includes("surg") || n.includes("gener")) return HospitalIcon;
  if (n.includes("plumb") || n.includes("repair") || n.includes("electr")) return Wrench;
  if (n.includes("room") || n.includes("suite")) return BedDouble;
  if (n.includes("flight") || n.includes("travel")) return Plane;
  if (n.includes("home") || n.includes("house") || n.includes("property")) return Home;
  return Stethoscope;
}

function isOpenNow(hours: any): boolean | null {
  if (!hours || typeof hours !== "object") return null;
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const now = new Date();
  const key = days[now.getDay()];
  const d = hours[key];
  if (!d) return null;
  if (d.closed) return false;
  if (!d.open || !d.close) return null;
  const [oh, om] = d.open.split(":").map(Number);
  const [ch, cm] = d.close.split(":").map(Number);
  const mins = now.getHours() * 60 + now.getMinutes();
  const openMins = oh * 60 + (om || 0);
  const closeMins = ch * 60 + (cm || 0);
  return mins >= openMins && mins <= closeMins;
}
