import { useState } from "react";
import { Star, X, Loader2, CheckCircle2 } from "lucide-react";
import { submitReview, type ReviewService } from "@/lib/reviews";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  bookingRef?: string | null;
  service: ReviewService;
  offerId: string;
  providerName: string;
  defaultReviewerName?: string;
}

interface DimProps {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}

function StarRow({ label, hint, value, onChange }: DimProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      </div>
      <div className="mt-1.5 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${label} ${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5 active:scale-90 transition"
            >
              <Star
                className={`h-7 w-7 ${active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewModal({
  open,
  onClose,
  onSubmitted,
  bookingRef,
  service,
  offerId,
  providerName,
  defaultReviewerName = "",
}: Props) {
  const [quality, setQuality] = useState(0);
  const [timeliness, setTimeliness] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(defaultReviewerName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const canSubmit = quality > 0 && timeliness > 0 && communication > 0 && name.trim().length > 0 && !busy;

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    const res = await submitReview({
      bookingRef: bookingRef ?? undefined,
      service,
      offerId,
      providerName,
      ratingQuality: quality,
      ratingTimeliness: timeliness,
      ratingCommunication: communication,
      comment,
      reviewerName: name,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    onSubmitted?.();
    setTimeout(() => {
      onClose();
      setDone(false);
      setQuality(0);
      setTimeliness(0);
      setCommunication(0);
      setComment("");
    }, 1400);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-card p-5 shadow-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold">Rate your experience</h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              with <span className="font-semibold text-foreground">{providerName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="my-8 flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <div className="text-sm font-bold">Thanks for your review!</div>
            <div className="text-[12px] text-muted-foreground">It helps other customers choose better.</div>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-4">
              <StarRow label="Quality" hint="Did they do the job well?" value={quality} onChange={setQuality} />
              <StarRow label="Timeliness" hint="Were they on time?" value={timeliness} onChange={setTimeliness} />
              <StarRow label="Communication" hint="Was it easy to talk?" value={communication} onChange={setCommunication} />
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold">Your name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 80))}
                placeholder="e.g. Ahmed M."
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="mt-3">
              <label className="text-sm font-semibold">
                Comment <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                rows={3}
                placeholder="Share details that would help others…"
                className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="mt-1 text-right text-[10px] text-muted-foreground">{comment.length}/1000</div>
            </div>

            {error && (
              <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-2 text-[12px] text-destructive">
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50 active:scale-[0.99]"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit review
            </button>
          </>
        )}
      </div>
    </div>
  );
}
