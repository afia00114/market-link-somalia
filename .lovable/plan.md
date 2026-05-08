## Airline Tickets UX revamp (`/travel/flights`)

Align the flights flow with the 6-step spec. Scope is limited to this single route — no changes to Agencies, Visa, Tours, Car Rental, or Hajj.

### Step-by-step changes

**Step 1 — Country picker (modal list with search)**
- Replace the inline `CountrySelect` grid with a trigger field ("Where are you flying from?") that opens a full-screen Sheet.
- Sheet contents: search input at top + scrollable list of countries (flag, name, dial code). Tapping a row selects the country, closes the sheet, and advances to Step 2.

**Step 2 — Route selection (searchable dropdowns + date picker)**
- Replace the two native `<select>` fields with shadcn Combobox (Popover + Command) for **From** and **To** — type-to-filter by city or IATA code, "🌍" marker for international destinations.
- Keep One way / Round trip chips.
- Replace the native `<input type="date">` with the shadcn Datepicker (Popover + Calendar, `pointer-events-auto`). Show Return picker only when Round trip is selected.
- Primary CTA: "Search agencies".

**Step 3 — Agency list (cards with inline contact + Select)**
- Each card shows: airline/agency logo, name + verified badge, rating + reviews, route schedule (depart→arrive, duration, direct / via), price, and a row of actions:
  - Small icon-only **Call** button (`tel:` link)
  - Small icon-only **WhatsApp** button (opens prefilled WA message)
  - Primary **Select** button → advances to Step 5 (passenger form)
- Add a sticky **Filters** button at the top of the list (with active-filter count badge) that opens the Step 4 sheet.

**Step 4 — Sorting & filtering (bottom sheet)**
- shadcn Sheet (side="bottom") with three sections:
  - **Sort by** — RadioGroup: Lowest price / Highest rating / Highest price / Shortest duration
  - **Price range** — shadcn Slider (min/max derived from current results), shows `$min – $max`
  - **Airlines** — Checkbox list of airline names present in the current result set (multi-select)
  - **Toggles** — Switches: Direct only, Verified only
- Footer: "Reset" (ghost) + "Show N results" (primary, closes sheet).

**Step 5 — Passenger form (steppers + class + datepicker + textarea)**
- Top: compact recap of picked agency + route + price.
- Fields:
  - Full name (text)
  - Phone / WhatsApp (text)
  - **Adults** and **Children** as `–` / number / `+` steppers (Adults min 1, Children min 0; max 9 each)
  - Class dropdown: Economy / Business / First
  - Departure date confirmation via shadcn Datepicker (prefilled from Step 2)
  - Special requests (textarea)
- Primary CTA: "Review & share" (disabled until name + phone filled).

**Step 6 — Summary & share**
- Keep the existing `SummaryShare` component as-is. It already provides WhatsApp (primary), Call, screenshot Share/Save image, Email, and Copy.

### Files to add

- `src/components/travel/CountryPickerSheet.tsx` — Sheet wrapper around the country list with search.
- `src/components/travel/AirportCombobox.tsx` — shadcn Combobox for From/To airport selection.
- `src/components/travel/DatePickerField.tsx` — Wraps shadcn Calendar in a Popover with the project's `Field` label style.
- `src/components/travel/NumberStepper.tsx` — Reusable `–` / value / `+` control for passenger counts.
- `src/components/travel/FlightFiltersSheet.tsx` — Bottom Sheet with sort radios, price Slider, airline checkboxes, and toggles.
- `src/components/travel/FlightResultCard.tsx` — Replaces `ProviderRow` for flights only; renders schedule, price, and inline Call/WhatsApp/Select actions.

### Files to modify

- `src/routes/travel.flights.tsx` — Wire the new components into steps 1–5; keep `SummaryShare` for step 6. Add filter state for `priceRange` and `airlines`; compute price min/max and airline list from the unfiltered route results.
- `src/components/travel/Stepper.tsx` — No structural change; the step labels become `["Country", "Route", "Agencies", "Details", "Send"]` (filters live inside step 3 as a sheet, not a stepper step).

### Files unchanged

- `src/data/travel.ts` — `FLIGHT_OFFERS` schema already covers everything needed (price, rating, direct/via, departTime, durationHrs, whatsapp, phone). No data changes.
- All other `travel.*` routes.
- `SummaryShare.tsx`, `CountrySelect.tsx` (still used by other travel routes).

### Technical notes

- shadcn primitives needed (verify presence, install missing): `sheet`, `command`, `popover`, `calendar`, `slider`, `radio-group`, `checkbox`, `switch`, `button`. Most should already be in `src/components/ui/`.
- Datepicker must include `className={cn("p-3 pointer-events-auto")}` on the `Calendar` so it stays interactive inside the Popover.
- Combobox value = IATA code; display = `{city} ({code})` with optional 🌍 suffix for international.
- WhatsApp link uses the existing `whatsappLink(picked.whatsapp, prefill)` helper from `@/lib/contact`; Call uses `telLink(picked.phone)`.
- Active-filter badge counts non-default sort, non-full price range, any airline filter, and each enabled toggle.
- Mobile-first: sheets use `side="bottom"`, comboboxes full-width, steppers tap targets ≥ 44px.

### Out of scope

- Real flight inventory / pricing API — still uses `FLIGHT_OFFERS` mock data.
- Saving searches, login, or backend persistence.
- Other travel sub-flows.
