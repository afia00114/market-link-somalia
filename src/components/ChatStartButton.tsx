import { MessageCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { startConversation } from "@/lib/vendor.functions";

interface Props {
  vendorId: string;
  postId?: string | null;
  className?: string;
  label?: string;
}

export function ChatStartButton({ vendorId, postId, className, label = "Message" }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const start_ = useServerFn(startConversation);

  const start = async () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setLoading(true);
    try {
      const res = await start_({ data: { vendorId, postId: postId ?? null } });
      if (res?.conversationId) {
        navigate({ to: "/messages/$id", params: { id: String(res.conversationId) } });
      }
    } catch (e: any) {
      alert(e?.message ?? "Could not start conversation");
    } finally {
      setLoading(false);
    }
  };


  return (
    <button
      type="button"
      onClick={start}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
      }
    >
      <MessageCircle className="h-4 w-4" />
      {loading ? "Opening…" : label}
    </button>
  );
}
