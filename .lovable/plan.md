## Goal
After the user finishes the 3 onboarding slides on the splash route (`/`), show a choice screen with two paths: **Register as Customer** or **Register as Vendor** — instead of the single "Get Started" button that currently dumps everyone on `/home`.

## Changes

### `src/routes/index.tsx`
- Add a 4th stage `"choose"` after the last onboarding slide.
- On the final slide, replace "Get Started" with **Continue** → moves to the choose stage.
- Choose stage shows:
  - Heading: "How will you use MaalsoorHub?"
  - Two large cards/buttons:
    - **I'm a Customer** — "Browse listings, book services, chat with vendors." → navigates to `/auth` (signup mode).
    - **I'm a Vendor** — "List your business, get bookings, receive payments." → navigates to `/auth?next=/vendor/apply` (after signup, lands on the vendor application form).
  - Small text below: "Already have an account? **Sign in**" → `/auth`.

### `src/routes/auth.tsx` (small additions)
- Read `next` from search params.
- Default `mode` to `"signup"` when arriving from the choose screen (use a `mode=signup` search param).
- After successful signup/signin, navigate to `next` if present, else `/profile` (current behavior).
- Already-signed-in redirect: also honor `next`.

### Route search params
- `/auth` accepts optional `?mode=signup&next=/vendor/apply`. Validated with a small Zod schema in `validateSearch`.

## Not changing
- No database changes — vendor role is still granted only after admin approves the vendor application (existing flow).
- No new translations strings wired (English only for now, matching existing splash copy). Can add i18n keys later if you want.
- Splash auto-advance timing and the 3 slides themselves stay the same.

Approve and I'll implement.
