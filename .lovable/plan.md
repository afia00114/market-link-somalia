## Goal

Today a vendor post is just `title / description / price / image_url / location`. The two reference screens (Mogadishu Turkish Hospital, Fast Plumbing) need a lot more: cover + gallery, verified / 24-7 / open-now badges, rating, services menu with prices, departments, working hours, languages, response time, recent work, and a "Request appointment / Book" CTA.

This pass extends `vendor_posts` so a vendor can capture all of that from the dashboard, then renders it on the public post page using the same visual language as the screenshots.

## Scope

In:
- DB: add structured + flexible columns to `vendor_posts`.
- Editor: rebuild `PostEditor` in `vendor.dashboard.tsx` as a tabbed sheet (Basics / Media / Services / Hours & Contact / Extras) with category-aware sections (e.g. Hospitals get "Departments", Services get "Recent work").
- Public detail: new route `src/routes/posts.$id.tsx` rendering the rich layout. Keep `vendors/$id` listing thumbnails linking to it.
- Reuse existing `ChatStartButton`, `PayButton`, `ContactBar`, `RatingSummary`, booking flow.

Out:
- Real-time "Open now" (computed from hours only).
- Review collection (uses existing `RatingSummary`).
- Image upload pipeline — keep URL inputs for this pass (storage bucket can come later).

## DB changes (single migration)

Add to `public.vendor_posts`:
- `gallery_urls text[]` — additional photos beyond `image_url`.
- `services jsonb` — `[{ name, price, price_unit, badge?, description? }]` for the "What we offer" list.
- `departments jsonb` — `[{ name, icon? }]` (hospitals, hotels with sections, etc.).
- `working_hours jsonb` — `{ mon:{open,close,closed}, tue:{...}, ..., note }`.
- `languages text[]`.
- `amenities text[]` — generic chips (24/7, Pharmacy, Lab, Pool, Wifi…).
- `badges text[]` — display chips ("Verified", "24/7 Open", "Popular").
- `response_time_minutes int` — for "Responds in under 1 hr".
- `experience_years int`.
- `contact jsonb` — `{ phone, whatsapp, email, address }` (overrides vendor defaults per-post).
- `booking_enabled boolean default true`, `booking_note text`.

All nullable / default `'{}'` so existing rows keep working. No RLS changes — current "vendor manages own posts" policy still applies.

## Editor changes — `src/routes/vendor.dashboard.tsx`

Replace the small `PostEditor` modal with a taller sheet split into tabs:

```text
Basics:    title, category, short description, location, price + unit, badges chips
Media:     cover image URL + gallery URLs (add/remove rows)
Services:  repeating rows { name, price, unit, badge } — "What we offer"
Sections:  category-dependent — Departments grid (health/hotels) OR Recent work gallery (services/trades)
Hours:     7-day grid (open/close/closed toggle) + note, languages chips, response-time select, experience years
Contact:   phone, whatsapp, email, address (prefilled from vendor profile), booking_enabled toggle + note
```

Each tab is a small sub-component; state lives in a single `form` object. Save serializes the structured fields straight into the new columns. Category drives which tabs/sections appear (reuse the same `CategoryKey` map from `src/data/vendor-application-schemas.ts` style).

## Public detail — `src/routes/posts.$id.tsx` (new)

Loader fetches the post + parent `vendor_profiles`. Layout mirrors the screenshots:

1. Hero: cover image with floating badges (Verified, 24/7), back + share buttons.
2. Title block: title, category, rating (existing `RatingSummary`), location.
3. Gallery strip: thumbnails from `gallery_urls`.
4. Action row: Call / WhatsApp / Email / Copy (icon buttons, semantic tokens).
5. About: `description`.
6. "What we offer": `services[]` rendered as tappable rows with price; clicking opens booking sheet pre-filled with that service.
7. Sections: Departments grid (icon tiles) OR Recent work gallery, based on `departments` / extra gallery.
8. Contact card: phone / whatsapp / email / address rows with copy buttons.
9. Sticky bottom CTA: "Request Appointment" → existing booking flow (`/listing/$id/book` equivalent — wire to `createBooking` server fn with `post_id`).

`vendors/$id` list items already link by post id — point them at `/posts/$id`.

## Technical notes

- All new columns are JSON/array; no enums to keep flexible.
- Reuse `src/components/ChatStartButton`, `PayButton`, `ContactBar`, `RatingSummary`, `ReviewModal`, and the booking helpers in `src/lib/booking/`.
- "Open now" derived client-side from `working_hours` + device time; no cron.
- Icons via existing `lucide-react` imports (Stethoscope, Hospital, Wrench, etc.) chosen from category map.
- Strict design tokens — no hardcoded colors. Reuse `grad-hero`, `shadow-card`, `bg-card`, `text-primary`, `bg-secondary` already in the project.
- Types: `src/integrations/supabase/types.ts` regenerates after migration approval.

## Open question

Image hosting: keep "paste URL" for this pass, or add a Supabase storage bucket + uploader now? Adding it later is cheap (single new bucket + a small `<ImageUploader>` component), so I'd defer unless you say otherwise.
