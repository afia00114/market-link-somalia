import { MessageCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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

  const start = async () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc("start_conversation", {
      _vendor_id: vendorId,
      _post_id: postId ?? undefined,
    });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    if (!data) return;
    navigate({ to: "/messages/$id", params: { id: String(data) } });
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
