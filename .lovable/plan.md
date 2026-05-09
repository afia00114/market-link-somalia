# Travel & Tourism — Full Module Build-Out

This is a large spec covering the Travel hub, all 6 sub-flows (Flights, Agencies, Visa, Hajj/Umrah, Tours, Cars), each with list + detail + booking screens, plus global features (Profile, Wallet, Notifications, Chat). Building it all in one pass would be ~25+ new screens and unreviewable. Proposing a phased plan.

## Current state (already shipped)
- `/travel` hub with 6 category cards (matches your screenshot)
- `/travel/flights` — full 6-step flow (country → route → agency list → filters sheet → passenger form → summary/share)
- `/travel/agencies` — country → filter → results → profile (basic)
- `/travel/visa`, `/travel/tours`, `/travel/hajj-umrah`, `/travel/car-rental` — basic single-page flows

## What's missing vs spec
- Travel hub: search bar with filter icon at top
- Flights: dedicated **detail view** (stopover, refund policy, baggage, payment options) before booking
- Agencies: **agency profile page** with packages list, dedicated route
- Visa: **detail page** with document checklist, upload area, status tracker
- Hajj/Umrah: **detail page** with daily schedule, hotel/flight details, payment schedule
- Tours: category tabs (Safari/Beach/Culture), **detail page** with day-by-day itinerary
- Cars: **car detail page** with insurance, mileage, fuel policy, deposit
- Global: Profile booking history, Wallet, Notifications, Chat support — all new

## Proposed phasing

**Phase A — Travel hub polish + sub-flow detail pages** (this round)
- Add search bar + filter icon to `/travel` hub header
- Add `/travel/flights/$id` detail screen (stopover, refund, baggage, payment options) between agency list and summary
- Add `/travel/agencies/$id` route — full agency profile with packages
- Add `/travel/visa/$country` detail page (checklist, upload placeholder, status stub)
- Add `/travel/hajj-umrah/$id` detail (schedule, hotel, flight, payment plan)
- Add `/travel/tours/$id` detail (day-by-day itinerary)
- Add `/travel/car-rental/$id` detail (insurance, mileage, fuel, deposit)
- Add category tabs (Safari/Beach/Culture) to Tours list

**Phase B — List/search upgrades** (next round)
- Tours/Cars/Visa: align to flights pattern (filters sheet, sort, multi-select)
- Hajj season + package-type selectors
- Visa country selector → results

**Phase C — Global features** (separate round, larger)
- Profile: booking history + saved items tabs
- Wallet: transactions, refunds, payment methods
- Notifications center
- Chat support drawer

## Phase A — files to add
- `src/routes/travel.flights.$id.tsx` — flight detail (mock stopover/refund/baggage)
- `src/routes/travel.agencies.$id.tsx` — agency profile + packages
- `src/routes/travel.visa.$country.tsx` — visa detail + checklist
- `src/routes/travel.hajj-umrah.$id.tsx` — package detail
- `src/routes/travel.tours.$id.tsx` — tour detail + itinerary
- `src/routes/travel.car-rental.$id.tsx` — car detail
- `src/components/travel/DetailHeader.tsx` — shared back-arrow + image-cover header
- `src/components/travel/InfoList.tsx` — shared key/value rows for policies

## Phase A — files to modify
- `src/routes/travel.tsx` — add search bar with filter icon
- `src/routes/travel.flights.tsx` — wire Select → flight detail page (instead of straight to passenger form)
- `src/routes/travel.tours.tsx` — add Safari/Beach/Culture tabs
- `src/data/travel.ts` — add mock fields: `stopover`, `refundPolicy`, `baggage`, `itinerary[]`, `dailySchedule[]`, `insurance`, `mileageLimit`, `fuelPolicy`, `deposit`, `packages[]` on agencies
- `src/data/visa.ts` (new) — countries, types, requirements checklist mock
- `src/data/hotels.ts` not affected

## Out of scope this round
- Real backend / Lovable Cloud (still mock data)
- Document upload (placeholder UI only — no storage)
- Real payment integration
- Phase B + Phase C work

## Questions before I start Phase A
1. Confirm Phase A scope (6 detail pages + hub search) is the right batch, or do you want it smaller (e.g. just Flights detail + Tours tabs first)?
2. Document upload on Visa detail — placeholder UI now, or skip until Cloud is enabled?
3. Top hub search — should it actually search across all sub-flows, or be a visual placeholder for now?