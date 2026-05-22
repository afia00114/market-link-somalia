import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, Store, Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useVendor, type VendorProfile } from "@/hooks/use-vendor";
import { CATEGORIES } from "@/data/categories";

export const Route = createFileRoute("/vendor/dashboard")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard — MaalsoorHub" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VendorDashboard,
});

interface VendorPost {
  id: string;
  title: string;
  description: string | null;
  category_key: string;
  price: number | null;
  price_unit: string | null;
  currency: string | null;
  image_url: string | null;
  location: string | null;
  is_published: boolean;
  created_at: string;
}

function VendorDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isVendor, vendorProfile, loading, refresh } = useVendor();
  const [posts, setPosts] = useState<VendorPost[]>([]);
  const [tab, setTab] = useState<"posts" | "profile">("posts");
  const [editing, setEditing] = useState<VendorPost | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!vendorProfile) return;
    supabase
      .from("vendor_posts")
      .select("*")
      .eq("vendor_id", vendorProfile.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts((data as VendorPost[]) ?? []));
  }, [vendorProfile?.id]);

  const reloadPosts = async () => {
    if (!vendorProfile) return;
    const { data } = await supabase
      .from("vendor_posts").select("*").eq("vendor_id", vendorProfile.id)
      .order("created_at", { ascending: false });
    setPosts((data as VendorPost[]) ?? []);
  };

  if (loading) return <AppShell><div className="p-6 text-sm">Loading…</div></AppShell>;

  if (!isVendor || !vendorProfile) {
    return (
      <AppShell>
        <div className="px-4 py-8 text-center">
          <Store className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-3 text-base font-semibold">You're not a vendor yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Apply to start listing your services.</p>
          <Link to="/vendor/apply" className="mt-4 inline-block rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Apply now</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-6 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">{vendorProfile.business_name}</h1>
            <p className="text-xs opacity-80 capitalize">{vendorProfile.category_key.replace("-", " ")}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Posts" value={posts.length} />
          <Stat label="Published" value={posts.filter((p) => p.is_published).length} />
          <Stat label="Status" value={vendorProfile.is_active ? "Active" : "Off"} />
        </div>
      </header>

      <div className="sticky top-0 z-10 flex gap-2 border-b border-border bg-card px-4 py-2">
        <TabBtn active={tab === "posts"} onClick={() => setTab("posts")}>Posts</TabBtn>
        <TabBtn active={tab === "profile"} onClick={() => setTab("profile")}>Profile</TabBtn>
      </div>

      {tab === "posts" && (
        <section className="px-4 py-4">
          <button
            onClick={() => setCreating(true)}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary py-3 text-sm font-semibold text-primary"
          >
            <Plus className="h-4 w-4" /> New post
          </button>
          {posts.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <ul className="space-y-2">
              {posts.map((p) => (
                <li key={p.id} className="rounded-2xl border border-border bg-card p-3">
                  <div className="flex items-start gap-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-secondary" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-semibold">{p.title}</div>
                        {!p.is_published && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">Hidden</span>}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {p.price ? `${p.currency ?? "USD"} ${p.price}${p.price_unit ? `/${p.price_unit}` : ""}` : "No price"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setEditing(p)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-secondary py-1.5 text-xs"><Pencil className="h-3 w-3" /> Edit</button>
                    <button
                      onClick={async () => {
                        await supabase.from("vendor_posts").update({ is_published: !p.is_published }).eq("id", p.id);
                        reloadPosts();
                      }}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-secondary py-1.5 text-xs"
                    >
                      {p.is_published ? <><EyeOff className="h-3 w-3" /> Hide</> : <><Eye className="h-3 w-3" /> Show</>}
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this post?")) return;
                        await supabase.from("vendor_posts").delete().eq("id", p.id);
                        reloadPosts();
                      }}
                      className="flex items-center justify-center rounded-lg bg-secondary px-2 py-1.5 text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "profile" && (
        <ProfileEditor profile={vendorProfile} onSaved={refresh} />
      )}

      {(creating || editing) && (
        <PostEditor
          vendorId={vendorProfile.id}
          defaultCategory={vendorProfile.category_key}
          post={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); reloadPosts(); }}
        />
      )}
    </AppShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-1.5 text-sm font-medium ${active ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{children}</button>
  );
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/15 px-2 py-2 backdrop-blur">
      <div className="text-base font-extrabold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
}

function ProfileEditor({ profile, onSaved }: { profile: VendorProfile; onSaved: () => void }) {
  const [businessName, setBusinessName] = useState(profile.business_name);
  const [description, setDescription] = useState(profile.description ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [phone, setPhone] = useState(profile.phone);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? "");
  const [isActive, setIsActive] = useState(profile.is_active);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("vendor_profiles").update({
      business_name: businessName.trim(),
      description: description.trim() || null,
      location: location.trim() || null,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || null,
      is_active: isActive,
    }).eq("id", profile.id);
    setSaving(false);
    setMsg(error ? error.message : "Saved");
    if (!error) onSaved();
  };

  return (
    <form onSubmit={save} className="space-y-3 px-4 py-4">
      <Input label="Business name" value={businessName} onChange={setBusinessName} required />
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
      </div>
      <Input label="Location" value={location} onChange={setLocation} />
      <Input label="Phone" value={phone} onChange={setPhone} required inputMode="tel" />
      <Input label="WhatsApp" value={whatsapp} onChange={setWhatsapp} inputMode="tel" />
      <label className="flex items-center justify-between rounded-xl bg-secondary p-3 text-sm">
        <span>Show my profile publicly</span>
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
      </label>
      {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
      <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function PostEditor({ vendorId, defaultCategory, post, onClose, onSaved }: {
  vendorId: string; defaultCategory: string; post: VendorPost | null; onClose: () => void; onSaved: () => void;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [categoryKey, setCategoryKey] = useState(post?.category_key ?? defaultCategory);
  const [price, setPrice] = useState(post?.price?.toString() ?? "");
  const [priceUnit, setPriceUnit] = useState(post?.price_unit ?? "");
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? "");
  const [location, setLocation] = useState(post?.location ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (title.trim().length < 2) return setErr("Title is required");
    setSaving(true);
    const payload = {
      vendor_id: vendorId,
      title: title.trim(),
      description: description.trim() || null,
      category_key: categoryKey,
      price: price ? Number(price) : null,
      price_unit: priceUnit.trim() || null,
      image_url: imageUrl.trim() || null,
      location: location.trim() || null,
    };
    const { error } = post
      ? await supabase.from("vendor_posts").update(payload).eq("id", post.id)
      : await supabase.from("vendor_posts").insert(payload);
    setSaving(false);
    if (error) return setErr(error.message);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg space-y-3 rounded-t-3xl bg-card p-4 pb-6">
        <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        <h2 className="text-base font-bold">{post ? "Edit post" : "New post"}</h2>
        <Input label="Title" value={title} onChange={setTitle} required />
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
          <select value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Price" value={price} onChange={setPrice} inputMode="tel" placeholder="100" />
          <Input label="Per (unit)" value={priceUnit} onChange={setPriceUnit} placeholder="hour, day, job" />
        </div>
        <Input label="Image URL" value={imageUrl} onChange={setImageUrl} placeholder="https://…" />
        <Input label="Location" value={location} onChange={setLocation} />
        {err && <p className="text-xs text-destructive">{err}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-secondary py-2.5 text-sm font-semibold">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, required, inputMode, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; inputMode?: "tel" | "text"; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}{required && " *"}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} inputMode={inputMode} placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
    </div>
  );
}
