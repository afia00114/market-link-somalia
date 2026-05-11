## Goal
Add end-to-end ticket processing on the Airline Tickets flow.

## Scope
1. **Flight booking form** — on `/travel/flights/$id`, add a "Book this flight" panel: passenger name, email, phone, passengers count, travel class (uses `flight.classes`). Validated with Zod.
2. **Checkout step** — review screen showing route, dates, provider, class, total price, then two actions:
   - **Pay online (Stripe)** — Lovable built-in Stripe payments, one-time charge in the chosen currency.
   - **Request via WhatsApp** — only shown when the offer has `whatsapp` (agency type); opens WhatsApp with the exact required message format.
3. **Booking history** — new `/travel/my-tickets` route listing the current user's bookings (status: `pending` for WhatsApp, `paid` for Stripe). Linked from the travel hub and bottom nav.
4. **Agencies list & detail polish** — ensure `/travel/agencies` shows all agencies with ratings/contact, and `/travel/agencies/$id` shows agency details + their flight offers (already partly in place — wire bookings/WhatsApp through the same flow).

## Backend (Lovable Cloud)
- Enable Lovable Cloud (Supabase under the hood).
- Table `bookings`:
  - `id uuid pk`, `user_id uuid` (nullable for guest WhatsApp), `flight_id text`, `provider_name text`, `route text`, `depart_at timestamptz`, `arrive_at timestamptz`, `class text`, `passengers int`, `passenger_name text`, `passenger_email text`, `passenger_phone text`, `amount_cents int`, `currency text`, `channel text` (`stripe` | `whatsapp`), `status text` (`pending` | `paid` | `cancelled`), `stripe_session_id text`, `created_at timestamptz default now()`.
  - RLS: user can `select`/`insert` own rows; service role used by Stripe webhook to update `status`.

## Payments (Stripe)
- Run `recommend_payment_provider`, then enable **Stripe** built-in payments (digital service: ticket booking).
- Server function `createBookingCheckout` → creates the booking row (`status=pending`, `channel=stripe`) and a Stripe Checkout session, returns the URL.
- `/api/public/stripe-webhook` route → on `checkout.session.completed`, mark booking `paid`.
- Success URL: `/travel/my-tickets?session_id={CHECKOUT_SESSION_ID}`. Cancel URL: back to flight detail.

## Auth
- Optional sign-in (email + Google) so users can see history. Guest checkout still allowed (booking saved by `stripe_session_id`).

## Files to add/edit
- `src/routes/travel.flights.$id.tsx` — add booking panel + checkout step.
- `src/routes/travel.my-tickets.tsx` — new history page.
- `src/routes/travel.agencies.$id.tsx` — wire booking flow.
- `src/routes/travel.tsx` — add "My Tickets" card.
- `src/lib/booking.functions.ts` — `createBookingCheckout`, `listMyBookings`.
- `src/routes/api/public/stripe-webhook.ts` — webhook handler.
- `src/lib/whatsapp.ts` — builds the exact required message format.

## Out of scope (this round)
- Seat selection, multi-leg itineraries, refunds, multi-currency conversion, admin dashboard.

## Confirm before I proceed
This needs **Lovable Cloud** + **Stripe built-in payments** (Pro plan required for Stripe). OK to enable both now?
