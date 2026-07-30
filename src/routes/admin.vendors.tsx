import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Shield } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useVendor } from "@/hooks/use-vendor";

export const Route = createFileRoute("/admin/vendors")({
  head: () => ({
    meta: [{ title: "Admin · Vendors — MaalsoorHub" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminVendors,
});

interface AppRow {
  id: string;
  user_id: string;
  business_name: string;
  category_key: string;
  phone: string;
  whatsapp: string | null;
  location: string | null;
  description: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

function AdminVendors() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useVendor();
  const [apps, setApps] = useState<AppRow[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [working, setWorking] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("vendor_applications").select("*")
      .eq("status", filter).order("created_at", { ascending: false });
    setApps((data as AppRow[]) ?? []);
  }, [filter]);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/" });
  }, [loading, isAdmin, navigate]);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const approve = async (id: string) => {
    setWorking(id);
    try {
      await approveApp({ data: { applicationId: id } });
      load();
    } catch (e: any) {
      alert(e?.message ?? "Approval failed");
    } finally {
      setWorking(null);
    }
  };

  const reject = async (id: string) => {
    const notes = prompt("Rejection reason (optional)") ?? null;
    setWorking(id);
    const { error } = await supabase.from("vendor_applications")
      .update({ status: "rejected", admin_notes: notes }).eq("id", id);
    setWorking(null);
    if (error) alert(error.message); else load();
  };

  if (loading) return <AppShell><div className="p-6 text-sm">Loading…</div></AppShell>;
  if (!isAdmin) return null;

  return (
    <AppShell>
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"><ArrowLeft className="h-4 w-4" /></Link>
        <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /><h1 className="text-lg font-bold">Vendor applications</h1></div>
      </header>

      <div className="flex gap-2 px-4 py-3">
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${filter === s ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{s}</button>
        ))}
      </div>

      <section className="px-4 pb-6">
        {apps.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No {filter} applications.</p>
        ) : (
          <ul className="space-y-2">
            {apps.map((a) => (
              <li key={a.id} className="rounded-2xl border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{a.business_name}</div>
                    <div className="text-[11px] capitalize text-muted-foreground">{a.category_key.replace("-", " ")} · {a.phone}</div>
                    {a.location && <div className="text-[11px] text-muted-foreground">{a.location}</div>}
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] capitalize">{a.status}</span>
                </div>
                {a.description && <p className="mt-2 text-xs text-muted-foreground">{a.description}</p>}
                {a.admin_notes && <p className="mt-2 rounded-lg bg-secondary p-2 text-xs">Note: {a.admin_notes}</p>}
                {filter === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button disabled={working === a.id} onClick={() => approve(a.id)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60">
                      <CheckCircle2 className="h-3 w-3" /> Approve
                    </button>
                    <button disabled={working === a.id} onClick={() => reject(a.id)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-secondary py-1.5 text-xs font-semibold text-destructive disabled:opacity-60">
                      <XCircle className="h-3 w-3" /> Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
