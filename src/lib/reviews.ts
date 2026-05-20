import { supabase } from "@/integrations/supabase/client";

export type ReviewService = "flight" | "listing" | "hotel" | "tour" | "agency" | "visa" | "car-rental" | "hajj-umrah";

export interface Review {
  id: string;
  booking_ref: string | null;
  service: string;
  offer_id: string;
  provider_name: string;
  rating_quality: number;
  rating_timeliness: number;
  rating_communication: number;
  comment: string | null;
  reviewer_name: string;
  created_at: string;
}

export interface NewReview {
  bookingRef?: string | null;
  service: ReviewService;
  offerId: string;
  providerName: string;
  ratingQuality: number;
  ratingTimeliness: number;
  ratingCommunication: number;
  comment?: string;
  reviewerName: string;
}

export interface AggregateRating {
  count: number;
  overall: number;        // 1-5, average of all three dims across all reviews
  quality: number;
  timeliness: number;
  communication: number;
}

const LOCAL_REVIEWED_KEY = "mh.reviewed-bookings.v1";

function readReviewedLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_REVIEWED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeReviewedLocal(refs: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_REVIEWED_KEY, JSON.stringify(refs));
    window.dispatchEvent(new CustomEvent("mh:reviews:changed"));
  } catch {
    /* ignore */
  }
}

export function hasReviewed(bookingRef: string): boolean {
  return readReviewedLocal().includes(bookingRef);
}

export function markReviewed(bookingRef: string) {
  const list = readReviewedLocal();
  if (!list.includes(bookingRef)) {
    list.push(bookingRef);
    writeReviewedLocal(list);
  }
}

export async function submitReview(r: NewReview): Promise<{ ok: true } | { ok: false; error: string }> {
  // Validation
  const dims = [r.ratingQuality, r.ratingTimeliness, r.ratingCommunication];
  if (dims.some((v) => !Number.isInteger(v) || v < 1 || v > 5)) {
    return { ok: false, error: "Please rate all three categories from 1 to 5." };
  }
  const name = r.reviewerName.trim();
  if (name.length < 1 || name.length > 80) {
    return { ok: false, error: "Please enter your name (1–80 characters)." };
  }
  const comment = (r.comment ?? "").trim();
  if (comment.length > 1000) {
    return { ok: false, error: "Comment is too long (max 1000 characters)." };
  }

  const { error } = await supabase.from("reviews").insert({
    booking_ref: r.bookingRef ?? null,
    service: r.service,
    offer_id: r.offerId,
    provider_name: r.providerName,
    rating_quality: r.ratingQuality,
    rating_timeliness: r.ratingTimeliness,
    rating_communication: r.ratingCommunication,
    comment: comment || null,
    reviewer_name: name,
  });

  if (error) {
    if (error.code === "23505") {
      // duplicate booking_ref
      if (r.bookingRef) markReviewed(r.bookingRef);
      return { ok: false, error: "This booking has already been reviewed." };
    }
    return { ok: false, error: error.message };
  }

  if (r.bookingRef) markReviewed(r.bookingRef);
  return { ok: true };
}

export async function getReviewsForOffer(service: ReviewService, offerId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("service", service)
    .eq("offer_id", offerId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data as Review[];
}

export function aggregate(reviews: Review[]): AggregateRating {
  if (reviews.length === 0) {
    return { count: 0, overall: 0, quality: 0, timeliness: 0, communication: 0 };
  }
  const sum = reviews.reduce(
    (acc, r) => {
      acc.q += r.rating_quality;
      acc.t += r.rating_timeliness;
      acc.c += r.rating_communication;
      return acc;
    },
    { q: 0, t: 0, c: 0 },
  );
  const n = reviews.length;
  const quality = sum.q / n;
  const timeliness = sum.t / n;
  const communication = sum.c / n;
  return {
    count: n,
    overall: (quality + timeliness + communication) / 3,
    quality,
    timeliness,
    communication,
  };
}

export function subscribeReviews(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("mh:reviews:changed", cb);
  return () => window.removeEventListener("mh:reviews:changed", cb);
}
