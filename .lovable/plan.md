## What I checked

I read the vendor + customer flows, the category hubs, auth, admin, i18n, search, and queried the live database. Everything below is verified, not guessed.

### Live data right now

| Table | Rows |
|---|---|
| vendor_applications | 4 |
| vendor_profiles | 0 |
| vendor_posts | 0 |
| bookings / payments / conversations / messages / reviews | 0 |
| hospitals | 197 |
| user_roles | 2 (both `user`) |

Storage buckets: none.

## The 5 things that are actually missing

**1. Nobody can approve vendors — there is no admin.**
`user_roles` contains zero `admin` rows, and `approve_vendor_application` raises `Only admins can approve`. `/admin/vendors` also isn't linked from any nav (`AppShell`, `BottomNav`, `profile.tsx`) — an admin would have to type the URL. Result: 4 applications sitting unapproved, 0 vendor profiles, so the entire vendor half of the app has never run.

**2. Approved vendor content is invisible — hubs are all hardcoded.**
Every category hub reads a static file, never the database: `real-estate.tsx:6` (`@/data/properties`), `hotels.index.tsx:5`, `jobs.index.tsx:11`, `restaurants.index.tsx:7`, `livestock.tsx:10`, `travel.index.tsx:6`, `category.$key.tsx:12` (`@/data/listings`). `vendor_posts` is queried only by `posts.$id.tsx`, `vendors.$id.tsx` and the dashboard. A vendor can be approved, publish a post, and it will never appear anywhere a customer browses.

**3. The main "+" button doesn't lead to becoming a vendor.**
`BottomNav.tsx:9` → `/post` → `post.tsx:22-39` is a static "Verification required" screen whose only CTA points at `/profile`, not `/vendor/apply`.

**4. No notifications at all.**
No table, no email, no SMS, no push. The only hit for "notification" in the codebase is the decorative bell at `home.tsx:39-42` — no handler, with a permanently-on unread dot. Vendors aren't told they're approved; customers aren't told a booking or payment was confirmed. The location chip (`home.tsx:36`) is also a dead button.

**5. No image uploads anywhere.**
Zero `storage.from(` calls, zero buckets. Every image is a paste-a-URL input (`PostEditor.tsx:261-264`, vendor avatar). Booking photos at `listing.$id.book.tsx:160-167` are only `URL.createObjectURL` blobs — they're discarded on submit and never reach the vendor.

### Smaller confirmed gaps

- **Explore search is fake**: the input at `explore.tsx:52-55` has no `value`/`onChange` — typing does nothing. No global search exists.
- **i18n is header-only**: `translations.ts` has 11 keys (nav + hero) across 3 languages; used in 4 of ~64 route files. Everything else is hardcoded English.
- **Admin can only approve applications** — no post moderation, no payment oversight (confirm/reject lives only in each vendor's own dashboard, `vendor.dashboard.tsx:322-329`), no admin UI for hospitals/jobs/restaurants.
- **Dead route**: `employee-dashboard.tsx` (+ `payroll.functions.ts`/`payroll.server.ts`) isn't linked from anywhere.
- **Profile says "Reviews coming soon"** (`profile.tsx:275`) even though `reviews.ts:75-104` already writes real rows.
- **Phone OTP may not be enabled** — `auth.tsx:189-192` already catches "provider not enabled" and tells the user to use email/Google.
- Favorites, saved bookings and "already reviewed" state are localStorage-only — they don't follow the user across devices.

## Proposed plan (in priority order)

### Phase 1 — Unblock the vendor pipeline
1. Grant an `admin` role to your account (I'll need to know which email) so the 4 pending applications can be actioned.
2. Add an "Admin" entry to the profile screen, visible only when `has_role(uid,'admin')`.
3. Repoint `/post`: signed-in non-vendors get "Become a vendor → /vendor/apply"; approved vendors get "New post → vendor dashboard".

### Phase 2 — Make vendor content discoverable (biggest win)
4. Add a shared `useVendorPosts(categoryKey)` query over published `vendor_posts` joined to `vendor_profiles`.
5. Render live vendor posts in each hub **above** the existing static demo data (`category.$key`, real-estate, hotels, jobs, restaurants, livestock, travel), reusing `ListingCard`.
6. Wire `explore.tsx` search to real state and search both static data and live posts.

### Phase 3 — Notifications
7. `notifications` table (user_id, type, title, body, link, read_at) with RLS scoped to the owner + GRANTs.
8. Insert on: application approved/rejected, new booking for a vendor, new message, payment confirmed.
9. Make the home bell real: unread badge from live count, plus a `/notifications` list.

### Phase 4 — Images
10. Public `vendor-media` storage bucket + a small `<ImageUploader>` used in `PostEditor` (cover + gallery) and the vendor avatar; keep URL paste as a fallback.
11. Private `booking-photos` bucket so booking photos actually upload and reach the vendor.

### Phase 5 — Polish
12. Move favorites + bookings from localStorage to the database so they follow the account.
13. Replace the "Reviews coming soon" tile with the real review list.
14. Extend i18n coverage beyond nav/hero, starting with the vendor apply flow and category hubs.
15. Decide the fate of `employee-dashboard` / payroll — link it behind a role, or remove it.

### Technical notes
- Phase 1's admin grant is a one-row insert into `user_roles`; everything else is already policy-protected.
- Phase 2 needs no schema change — `vendor_posts` already has `is_published`, `category_key`, gallery/services/hours columns.
- Phase 3/4 need migrations (table + buckets with RLS/GRANTs) and will go through the approval flow.
- Strict semantic tokens throughout; no hardcoded colors.

### One thing I need from you
Which email should get the admin role? Without it nothing in the vendor half of the app can be exercised.
