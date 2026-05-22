import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Phone, MessageCircle as WaIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { whatsappLink, telLink } from "@/lib/contact";

export const Route = createFileRoute("/messages/$id")({
  head: () => ({
    meta: [
      { title: "Chat — MaalsoorHub" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThreadPage,
});

interface Msg {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

interface ConvDetail {
  id: string;
  customer_id: string;
  vendor_id: string;
  post_id: string | null;
  vendor: { business_name: string; user_id: string; phone: string; whatsapp: string | null; avatar_url: string | null } | null;
  customer: { display_name: string | null; avatar_url: string | null; phone: string | null } | null;
  post: { title: string } | null;
}

function ThreadPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [conv, setConv] = useState<ConvDetail | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: c } = await supabase
        .from("conversations")
        .select(
          "id,customer_id,vendor_id,post_id," +
            "vendor:vendor_profiles!conversations_vendor_id_fkey(business_name,user_id,phone,whatsapp,avatar_url)," +
            "customer:profiles!conversations_customer_id_fkey(display_name,avatar_url,phone)," +
            "post:vendor_posts!conversations_post_id_fkey(title)"
        )
        .eq("id", id)
        .maybeSingle();
      setConv(((c as unknown) as ConvDetail | null) ?? null);

      const { data: m } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
      setMessages((m as Msg[]) ?? []);
    })();

    const ch = supabase
      .channel(`conv-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Msg])
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [id, user?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || !user) return;
    setSending(true);
    setErr(null);
    const { error } = await supabase.from("messages").insert({
      conversation_id: id,
      sender_id: user.id,
      body: text,
    });
    setSending(false);
    if (error) return setErr(error.message);
    setBody("");
  };

  if (authLoading || !conv) {
    return <AppShell><div className="p-6 text-sm">Loading…</div></AppShell>;
  }

  const isCustomer = conv.customer_id === user!.id;
  const otherName = isCustomer
    ? conv.vendor?.business_name ?? "Vendor"
    : conv.customer?.display_name ?? "Customer";
  const otherAvatar = isCustomer ? conv.vendor?.avatar_url : conv.customer?.avatar_url;
  const phone = isCustomer ? conv.vendor?.phone : conv.customer?.phone;
  const wa = isCustomer ? conv.vendor?.whatsapp ?? conv.vendor?.phone : conv.customer?.phone;

  return (
    <AppShell>
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <Link to="/messages" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {otherAvatar ? (
          <img src={otherAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
            {otherName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{otherName}</div>
          {conv.post?.title && (
            <div className="truncate text-[11px] text-muted-foreground">Re: {conv.post.title}</div>
          )}
        </div>
        {wa && (
          <a
            href={whatsappLink(wa.replace(/\D/g, ""), `Hello ${otherName}, regarding our chat on MaalsoorHub.`)}
            target="_blank" rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[hsl(142_70%_38%)] hover:bg-secondary"
            aria-label="WhatsApp"
          >
            <WaIcon className="h-4 w-4" />
          </a>
        )}
        {phone && (
          <a href={telLink(phone)} className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-secondary" aria-label="Call">
            <Phone className="h-4 w-4" />
          </a>
        )}
      </header>

      <div className="flex-1 space-y-2 px-3 py-3" style={{ minHeight: "60vh" }}>
        {messages.length === 0 && (
          <p className="py-10 text-center text-xs text-muted-foreground">Say hi 👋</p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === user!.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
                  mine ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{m.body}</div>
                <div className={`mt-0.5 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="sticky bottom-0 flex items-end gap-2 border-t border-border bg-card px-3 py-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(e as unknown as React.FormEvent);
            }
          }}
          rows={1}
          maxLength={4000}
          placeholder="Type a message…"
          className="max-h-28 flex-1 resize-none rounded-2xl border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      {err && <p className="px-3 pb-2 text-xs text-destructive">{err}</p>}
    </AppShell>
  );
}
