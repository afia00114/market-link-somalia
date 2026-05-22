All four areas you picked are real chunks of work — too much for one safe pass. I'll ship them in 4 phases. Each phase is self-contained and testable before moving on. Approve and I'll start with Phase 1.

## Phase 1 — Auth upgrades

**Phone (SMS OTP) sign-in**
- Add a "Phone" tab on `/auth` next to Email and Google.
- Flow: enter phone → request OTP → enter 6-digit code → signed in.
- Backend: enable Phone provider in Lovable Cloud Auth. SMS sending requires a provider — I'll connect **Twilio** via the connector (you'll be prompted for Twilio credentials when we get there).

**Password reset**
- "Forgot password?" link on the email tab → sends reset email.
- New public `/reset-password` route that reads the recovery token and lets the user set a new password.

**MFA (TOTP)**
- New `/profile/security` page: enroll authenticator app (QR code), verify code, list/revoke factors.
- Step-up prompt on sign-in for users with MFA enabled.

**Out of scope this phase:** Facebook (not supported on Lovable Cloud), Apple (skip unless you want it — say the word).

---

## Phase 2 — In-app notifications

**Schema (`notifications` table):** `id, user_id, type, title, body, link, read_at, created_at` + RLS so users only see their own.

**Generators (DB triggers, so they're automatic):**
- New message in a conversation → notify the other participant
- Vendor application approved/rejected → notify applicant
- New booking created → notify vendor
- Payment status changes → notify customer

**UI**
- Bell icon in `AppShell` header with unread count badge
- `/notifications` page: list, mark-as-read, mark-all-read
- Realtime subscription so the badge updates live
- `/profile/notifications` preferences (per-type on/off)

**Email alerts** for the same events via Lovable's email system (verified domain required — I'll walk you through it when we hit that step).

---

## Phase 3 — Manual mobile-money checkout

Reworks the existing `payments` table flow into a real checkout.

**`/checkout/$bookingRef` page**
- Order summary (service, vendor, total, currency)
- Pick method: **EVC Plus**, **Edahab**, **M-Pesa** (uses `vendor_profiles.evc_number / edahab_number / phone`)
- Step-by-step USSD/app instructions for the chosen method
- Form: payer name, payer phone, transaction reference, screenshot upload (optional)
- Submits a row to `payments` with `status='pending'`

**Vendor dashboard additions**
- New "Payments" tab: list pending payments, **Confirm received** or **Reject** buttons
- Confirmation updates `payments.status` and notifies the customer (uses Phase 2 notifications)

**Customer side**
- `/my-payments` already exists — extend with status badges and timeline
- Booking flow links to `/checkout/...` instead of "contact via WhatsApp" (WhatsApp stays as a fallback)

**Storage**
- New `payment-proofs` bucket (private, owner-read + vendor-of-payment-read)

---

## Phase 4 — Geolocation: nearby vendors

**Schema**
- Add `latitude numeric, longitude numeric` to `vendor_profiles` (nullable, with a validation trigger for valid ranges).
- Vendor dashboard: "Pin my location" button → uses browser geolocation, saves coords.

**Browse experience**
- `/explore` and category pages: "Use my location" toggle
- Sort vendors by Haversine distance to user
- Display "2.3 km away" badge on cards
- Permission denial fallback: city-based filter (existing behavior)

**Out of scope:** map view (Leaflet/Mapbox). Distance + sort first; map is a follow-up if you want it.

---

## Technical notes

- All new server logic goes through `createServerFn` (TanStack Start pattern already used in the project) — no Supabase Edge Functions.
- All new tables get RLS from day one. Roles continue using the existing `user_roles` + `has_role()` pattern.
- Phone auth, Twilio connection, and email-domain setup each need one-time user input (Lovable Cloud Auth settings, Twilio account, DNS record) — I'll prompt you in-flow when we get to each.
- Phase 1 needs no schema changes. Phases 2–4 each have one migration that I'll show you before applying.

---

Approve and I'll start Phase 1 (auth upgrades), or tell me to reorder / drop a phase.