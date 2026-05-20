import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { aggregate, getReviewsForOffer, subscribeReviews, type ReviewService } from "@/lib/reviews";

interface Props {
  service: ReviewService;
  offerId: string;
  size?: "sm" | "md";
}

export function RatingSummary({ service, offerId, size = "sm" }: Props) {
  const [agg, setAgg] = useState({ count: 0, overall: 0 });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const reviews = await getReviewsForOffer(service, offerId);
      if (!alive) return;
      const a = aggregate(reviews);
      setAgg({ count: a.count, overall: a.overall });
    };
    load();
    const off = subscribeReviews(load);
    return () => {
      alive = false;
      off();
    };
  }, [service, offerId]);

  if (agg.count === 0) {
    return (
      <span className={`inline-flex items-center gap-1 text-muted-foreground ${size === "md" ? "text-sm" : "text-xs"}`}>
        <Star className="h-3.5 w-3.5" /> No reviews yet
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${size === "md" ? "text-sm" : "text-xs"}`}>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-bold">{agg.overall.toFixed(1)}</span>
      <span className="text-muted-foreground">({agg.count})</span>
    </span>
  );
}
