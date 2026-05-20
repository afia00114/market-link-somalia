import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Plane, MessageCircle, Phone, Trash2, CheckCircle2,
  Clock3, XCircle, Ticket, Star,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { listBookings, removeBooking, updateBookingStatus, type Booking } from "@/lib/bookings";
import { whatsappLink, telLink } from "@/lib/contact";
import { ReviewModal } from "@/components/ReviewModal";
import { hasReviewed, subscribeReviews, type ReviewService } from "@/lib/reviews";

export const Route = createFileRoute("/travel/my-tickets")({
  head: () => ({
    meta: [
      { title: "My Tickets — MaalsoorHub" },
      { name: "description", content: "Your saved flight requests and booking history." },
    ],
  }),
  component: MyTicketsPage,
});

function MyTicketsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Booking[]>([]);

  useEffect(() => {
    const load = () => setItems(listBookings());
    load();
    const onChange = () => load();
    window.addEventListener("mh:bookings:changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("mh:bookings:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return (
    <AppShell>
      <header className="bg-flights-hero rounded-b-3xl px-4 pb-6 pt-5 text-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: "/travel" })}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold">My Tickets</h1>
            <p className="text-xs text-white/85">Saved flight requests</p>
          </div>
        </div>
      </header>

      <section className="px-4 py-4 pb-24">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-flights-soft">
              <Ticket className="h-6 w-6 text-flights" />
            </div>
            <h2 className="text-sm font-bold">No tickets yet</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Browse flights and submit a booking request — it'll appear here.
            </p>
            <Link
              to="/travel/flights"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-flights px-4 py-2 text-sm font-bold text-white active:scale-[0.98]"
            >
              <Plane className="h-4 w-4" /> Browse flights
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function BookingCard({ booking: b }: { booking: Booking }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    const sync = () => setReviewed(hasReviewed(b.ref));
    sync();
    return subscribeReviews(sync);
  }, [b.ref]);

  const statusColor =
    b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
    : b.status === "cancelled" ? "bg-destructive/10 text-destructive border-destructive/30"
    : "bg-amber-500/10 text-amber-700 border-amber-500/40";
  const StatusIcon = b.status === "confirmed" ? CheckCircle2 : b.status === "cancelled" ? XCircle : Clock3;

  const summary = b.title || b.route || "Booking";
  const waMsg = `Hello ${b.providerName}, following up on my booking ref ${b.ref} — ${summary}.`;
  const phoneDigits = b.providerPhone?.replace(/\D/g, "") || "252610000000";
  const canReview = b.status !== "cancelled";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <Plane className="h-3.5 w-3.5 text-flights" /> {b.providerName}
            <span>· Ref {b.ref}</span>
          </div>
          <div className="mt-1 truncate text-sm font-bold">{summary}</div>
          {(b.departDate || b.travelClass || b.passengers) && (
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {b.departDate}{b.returnDate ? ` · Return ${b.returnDate}` : ""}
              {b.travelClass ? ` · ${b.travelClass}` : ""}
              {b.passengers ? ` · ${b.passengers} pax` : ""}
            </div>
          )}
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColor}`}>
          <StatusIcon className="h-3 w-3" /> {b.status}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-[10px] text-muted-foreground">Estimated total</div>
          <div className="text-base font-extrabold text-flights">${(b.total ?? 0).toLocaleString()}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href={whatsappLink(phoneDigits, waMsg)}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          {b.providerPhone && (
            <a
              href={telLink(b.providerPhone)}
              aria-label="Call"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary active:scale-95"
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[11px]">
        {b.status === "pending" && (
          <button
            onClick={() => updateBookingStatus(b.id, "confirmed")}
            className="font-semibold text-emerald-700"
          >
            Mark confirmed
          </button>
        )}
        {b.status !== "cancelled" && b.status !== "confirmed" && (
          <button
            onClick={() => updateBookingStatus(b.id, "cancelled")}
            className="font-semibold text-muted-foreground"
          >
            Cancel
          </button>
        )}
        {canReview && (
          reviewed ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Reviewed
            </span>
          ) : (
            <button
              onClick={() => setReviewOpen(true)}
              className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 font-bold text-amber-700"
            >
              <Star className="h-3.5 w-3.5" /> Rate provider
            </button>
          )
        )}
        <button
          onClick={() => { if (confirm("Remove this booking?")) removeBooking(b.id); }}
          className="ml-auto inline-flex items-center gap-1 font-semibold text-destructive"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        bookingRef={b.ref}
        service={(b.service as ReviewService) ?? "flight"}
        offerId={b.offerId}
        providerName={b.providerName}
        defaultReviewerName={b.passengerName}
      />
    </div>
  );
}
