## Remove Hotels from Travel & Tourism

Remove the "Hotels" sub-category from the Travel & Tourism section and clean up the Browse category copy that mentions hotels.

### Changes
1. **`src/data/travel.ts`** — Remove the `hotels` entry from `TRAVEL_SUBS` so it no longer appears in the Travel & Tourism sub-category grid.
2. **`src/data/categories.ts`** — Update the Travel & Tourism card's `short` description from "Tickets, hotels, tours" to "Tickets, visas, tours" on the Browse / Explore page.
3. **`src/routes/travel.tsx`** — Remove "Hotels" from the page meta description and the hero subtitle ("Flights · Hotels · Visa · Tours · Cars" → "Flights · Visa · Tours · Cars").

### Kept as-is
- The `/travel/hotels` route file, `HOTELS` data, and `Hotel` type remain in the codebase but are no longer linked from any menu. This avoids breaking imports and keeps the option to re-enable later. Let me know if you'd prefer a full delete (route file + data + type).