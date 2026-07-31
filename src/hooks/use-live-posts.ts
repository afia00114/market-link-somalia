import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LivePost {
  id: string;
  title: string;
  description: string | null;
  category_key: string;
  price: number | null;
  price_unit: string | null;
  currency: string | null;
  image_url: string | null;
  location: string | null;
  created_at: string;
  vendor: {
    id: string;
    business_name: string;
    phone: string;
    whatsapp: string | null;
    location: string | null;
  } | null;
}

export function formatLivePrice(p: LivePost) {
  if (p.price == null) return undefined;
  const cur = p.currency ?? "USD";
  const symbol = cur === "USD" ? "$" : `${cur} `;
  return `${symbol}${p.price}${p.price_unit ? `/${p.price_unit}` : ""}`;
}

/** Live vendor postings from the database for a given category key. */
export function useLivePosts(categoryKey?: string) {
  const [posts, setPosts] = useState<LivePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let q = supabase
        .from("vendor_posts")
        .select(
          "id,title,description,category_key,price,price_unit,currency,image_url,location,created_at,vendor:vendor_profiles(id,business_name,phone,whatsapp,location)",
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(60);
      if (categoryKey) q = q.eq("category_key", categoryKey);
      const { data } = await q;
      if (cancelled) return;
      setPosts((data ?? []) as unknown as LivePost[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [categoryKey]);

  return { posts, loading };
}
