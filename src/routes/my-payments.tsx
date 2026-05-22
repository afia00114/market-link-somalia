import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/my-payments")({
  head: () => ({
    meta: [
      { title: "My Payments — MaalsoorHub" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyPayments,
});

interface Row {
  id: string;
  vendor_id: string;
  amount: number;
  currency: string;
  method: string;
  reference: string;
  status: "pending" | "confirmed" | "rejected";
  note: string | null;
  created_at: string;
  vendor_profiles?: { business_name: string } | null;
}

function MyPayments() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("payments")
        .select("id,vendor_id,amount,currency,method,reference,status,note,created_at,vendor_profiles(business_name)")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      setRows((data as unknown as Row[]) ?? []);
      setLoading(false);
    })();
  }, [user?.id]);

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-6 pt-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold">My Payments</h1>
        </div>
      </header>
      <section className="px-4 py-4">
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center">
            <Wallet className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">You haven't made any payments yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {rows.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{p.vendor_profiles?.business_name ?? "Vendor"}</div>
                    <div className="text-[11px] text-muted-foreground">{p.method === "evc" ? "EVC Plus" : "eDahab"} · {new Date(p.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold">{p.currency} {p.amount}</div>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="mt-2 rounded-lg bg-secondary px-2 py-1.5 text-xs">
                  <span className="text-muted-foreground">Ref:</span> <span className="font-mono font-semibold">{p.reference}</span>
                </div>
                {p.note && <p className="mt-1 text-[11px] text-muted-foreground">Vendor note: {p.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: "pending" | "confirmed" | "rejected" }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  } as const;
  return <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${map[status]}`}>{status}</span>;
}
