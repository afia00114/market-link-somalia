## Goal
Polish every booking flow (Flights, Listings, Hotels) end-to-end with better UX, real validation, a great confirmation screen, persistence to Lovable Cloud, and an email submission option alongside WhatsApp/Call.

## 1. Enable backend
- Enable **Lovable Cloud** (Supabase under the hood).
- Create a `bookings` table:
  - `id uuid pk`, `ref text unique`, `user_id uuid null`, `service text` (flight/listing/hotel/...), `offer_id text`, `provider_name text`, `provider_phone text`, `provider_whatsapp text`,
    `details jsonb` (route, dates, class, qty, hotel/listing fields),
    `passenger_name text`, `passenger_email text`, `passenger_phone text`, `notes text`,
    `unit_price numeric`, `total numeric`, `currency text`, `channel text` (whatsapp/call/email), `status text` default 'pending', `created_at timestamptz default now()`.
  - RLS: anyone can `insert`; only the owner (or matching email) can `select`.

## 2. Email infrastructure
- Set up Lovable Emails (need user to configure email domain).
- Create one transactional template `booking-request-confirmation` covering all services with dynamic data (service, route/title, dates, total, ref, provider).
- After form submission, fire-and-forget email to the customer + a copy via the same template to provider email if available.

## 3. Shared booking module
Create `src/lib/booking/` with:
- `schema.ts` — single Zod schema with field-level errors (name min 2, valid email, phone E.164-ish, agree to terms).
- `submit.functions.ts` — `createBooking` server fn → inserts row, returns `{ ref, id }`.
- `useBookingForm.ts` — React hook handling state, validation, dirty tracking, friendly error map.
- `BookingFields.tsx` — reusable form section (Name, Email, Phone, Notes, Submit-channel toggle).
- `BookingReviewCard.tsx` — reusable review summary.
- `BookingSuccess.tsx` — reusable confirmation screen with: ref + copy, “We’ve emailed you a confirmation”, share buttons, view My Tickets, return home.

## 4. Refactor each flow to use the shared module
- `src/routes/travel.book.$id.tsx` (flights)
- `src/routes/listing.$id.book.tsx` (listings)
- `src/routes/hotels.$id.book.tsx` (hotels)
Each keeps its own service-specific top section (class picker / dates / room) but pipes everything through `BookingFields`, `BookingReviewCard`, `createBooking`, and `BookingSuccess`.

## 5. Visual polish & micro-interactions
- Smooth step transitions (Framer-Motion-free CSS: `transition-all`, slide-in/fade).
- Animated step indicator with check ticks.
- Sticky bottom CTA with price + channel chips (WhatsApp / Email / Call).
- Skeleton + spinner state on submit, success bounce-in animation, copy-ref feedback.
- Inline field validation (red ring + helper text) on blur.

## 6. My Tickets
- `travel.my-tickets.tsx` reads from Cloud (`bookings` table) for the signed-in user, falls back to localStorage history for guests. Status badge per booking.

## Out of scope
- Online payments (Stripe), seat selection, refunds, multi-currency.

## Confirm before I proceed
This needs **Lovable Cloud** and **Lovable Emails** (which needs a verified email domain). OK to enable both?
