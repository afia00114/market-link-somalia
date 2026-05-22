import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — MaalsoorHub" },
      { name: "description", content: "Your in-app conversations with vendors and customers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MessagesPage,
});

interface ConvRow {
  id: string;
  customer_id: string;
  vendor_id: string;
  post_id: string | null;
  last_message_at: string;
  vendor: { business_name: string; user_id: string; avatar_url: string | null } | null;
  customer: { display_name: string | null; avatar_url: string | null } | null;
  last: { body: string; sender_id: string; created_at: string }[];
}

function MessagesPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<ConvRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select(
        "id,customer_id,vendor_id,post_id,last_message_at," +
          "vendor:vendor_profiles!conversations_vendor_id_fkey(business_name,user_id,avatar_url)," +
          "customer:profiles!conversations_customer_id_fkey(display_name,avatar_url)," +
          "last:messages(body,sender_id,created_at)"
      )
      .order("last_message_at", { ascending: false });
    setRows(((data as unknown) as ConvRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    load();
    const ch = supabase
      .channel("conv-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, load)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user?.id]);

  if (authLoading || loading) {
    return <AppShell><div className="p-6 text-sm">Loading…</div></AppShell>;
  }

  return (
    <AppShell>
      <header className="border-b border-border bg-card px-4 py-4">
        <h1 className="text-lg font-bold">Messages</h1>
        <p className="text-xs text-muted-foreground">Chat directly with vendors and customers.</p>
      </header>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft text-primary">
            <MessageCircle className="h-10 w-10" />
          </div>
          <h2 className="text-lg font-bold">No conversations yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap "Message" on a vendor or post to start chatting.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((c) => {
            const isCustomer = c.customer_id === user!.id;
            const title = isCustomer
              ? c.vendor?.business_name ?? "Vendor"
              : c.customer?.display_name ?? "Customer";
            const avatar = isCustomer ? c.vendor?.avatar_url : c.customer?.avatar_url;
            const last = c.last?.[c.last.length - 1];
            return (
              <li key={c.id}>
                <Link
                  to="/messages/$id"
                  params={{ id: c.id }}
                  className="flex items-center gap-3 px-4 py-3 active:bg-secondary"
                >
                  {avatar ? (
                    <img src={avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                      {title.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{title}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {new Date(c.last_message_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {last?.body ?? "No messages yet"}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
