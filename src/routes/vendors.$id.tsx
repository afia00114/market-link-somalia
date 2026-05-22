import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { ChatStartButton } from "@/components/ChatStartButton";
import { PayButton } from "@/components/PayButton";

export const Route = createFileRoute("/vendors/$id")({
  head: () => ({
    meta: [
      { title: "Vendor — MaalsoorHub" },
      { name: "description", content: "Browse vendor services and message them directly in-app." },
    ],
  }),
  component: VendorPublic,
});

interface VP {
  id: string;
  business_name: string;
  category_key: string;
  description: string | null;
  location: string | null;
  phone: string;
  avatar_url: string | null;
  is_active: boolean;
  evc_number: string | null;
  edahab_number: string | null;
}
interface Post {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  currency: string | null;
  image_url: string | null;
  location: string | null;
}

function VendorPublic() {
  const { id } = Route.useParams();
  const [vendor, setVendor] = useState<VP | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: v }, { data: p }] = await Promise.all([
        supabase.from("vendor_profiles").select("*").eq("id", id).maybeSingle(),
        supabase.from("vendor_posts").select("*").eq("vendor_id", id).eq("is_published", true).order("created_at", { ascending: false }),
      ]);
      setVendor((v as VP | null) ?? null);
      setPosts((p as Post[]) ?? []);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <AppShell><div className="p-6 text-sm">Loading…</div></AppShell>;
  if (!vendor) return <AppShell><div className="p-6 text-sm">Vendor not found.</div></AppShell>;

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-6 pt-5 text-white shadow-card">
        <Link to="/" className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3">
          {vendor.avatar_url ? (
            <img src={vendor.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
              {vendor.business_name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold">{vendor.business_name}</h1>
            <p className="text-xs opacity-80 capitalize">{vendor.category_key.replace("-", " ")}</p>
            {vendor.location && (
              <p className="mt-0.5 flex items-center gap-1 text-xs opacity-80">
                <MapPin className="h-3 w-3" /> {vendor.location}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <ChatStartButton vendorId={vendor.id} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-primary" label="Message vendor" />
          <a href={`tel:${vendor.phone}`} className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2.5 text-sm font-semibold">
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
        {vendor.description && <p className="mt-3 text-sm opacity-90">{vendor.description}</p>}
      </header>

      <section className="px-4 py-4">
        <h2 className="mb-2 text-sm font-bold">Listings</h2>
        {posts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No listings yet.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border bg-card p-3">
                <div className="flex gap-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-semibold">{p.title}</h3>
                      {p.price && (
                        <span className="whitespace-nowrap text-xs font-bold text-primary">
                          {p.currency ?? "USD"} {p.price}{p.price_unit ? `/${p.price_unit}` : ""}
                        </span>
                      )}
                    </div>
                    {p.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>}
                    {p.location && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {p.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <ChatStartButton vendorId={vendor.id} postId={p.id} label="Message" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary py-2 text-xs font-semibold" />
                  <PayButton vendorId={vendor.id} postId={p.id} defaultAmount={p.price ?? undefined} defaultCurrency={(p.currency as "USD" | "SOS") ?? "USD"} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground" label="Pay now" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
