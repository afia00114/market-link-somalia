## Goal

Make the "Become a Vendor" application form adapt to the category the user picks. A Real Estate agent should see real-estate fields; a Hotel owner should see hotel fields, etc. Today every applicant sees the same generic 4 fields (name, phone, location, description), which loses critical info admins need to verify the business.

## UX flow

Keep the 5-step wizard, but reshape it:

1. **Welcome** — unchanged.
2. **Business** — name + category picker. As soon as a category is picked, the wizard knows which extra fields to ask in step 3.
3. **Contact** — phone, WhatsApp, location (unchanged base) **+ category-specific fields injected here**.
4. **About** — description (unchanged) + 1–2 category-specific qualitative fields (e.g. "Specialties", "Years in business").
5. **Review** — show all answered fields, including the category-specific ones, with proper labels.

The category-specific schema is defined per category; switching category resets only the category-specific answers so the user doesn't lose generic data.

## Category-specific fields

| Category | Extra fields |
|---|---|
| Real Estate | License/registration #, agency name (if different), areas served (multi-chip: Mogadishu/Hargeisa/…), property types handled (Houses, Apartments, Land, Commercial), years of experience |
| Services | Service type (Plumbing, Electrical, Cleaning, Repairs, Other-text), service area (city/neighborhood), call-out fee (optional), available hours |
| Travel | Sub-type (Agency, Flights, Visa, Tours, Cars, Cargo, Hajj/Umrah — multi), IATA #/license (optional), countries covered |
| Hotels | Hotel name (if different), star rating, number of rooms, check-in/out times, amenities chips (WiFi, Parking, Restaurant, AC, Pool) |
| Health & Medical | Facility type (Hospital, Clinic, Pharmacy, Doctor), specialties (multi-chip from departments list), 24/7 availability toggle, license # |
| Food | Cuisine type, delivery available (yes/no), opening hours |
| Vehicles | Dealer type (New, Used, Both), brands handled, showroom address |
| Livestock | Animal types (Camels, Goats, Cattle, Sheep), market location |
| Jobs | Employer industry, company size |
| Banking | Institution type (Bank, Mobile money, Forex), license # |

(MVP build covers the first 5 categories in the table; the remaining ones get a sensible default of base fields only and can be extended later.)

## Technical plan

- **Schema-driven forms.** Create `src/data/vendor-application-schemas.ts` exporting a map `CategoryKey → FieldSpec[]`. Each `FieldSpec` is one of: `text`, `tel`, `number`, `select`, `multiselect-chip`, `toggle`, `textarea`. This keeps the wizard code generic — adding a new field later is a one-line data change.
- **Reusable inputs.** Add a small `CategoryFields` component in `src/components/vendor/CategoryFields.tsx` that renders any `FieldSpec[]` and returns its values. Reuse styling from existing `Field`/inputs in `vendor.apply.tsx`.
- **State.** Replace the flat `useState` setup in `vendor.apply.tsx` with a `categoryAnswers: Record<string, string | string[] | boolean>` object alongside the existing generic fields. Reset it when `categoryKey` changes.
- **Validation.** Per-field `required` flag in the schema; step 3 validates required category fields in addition to phone. Errors display inline using the existing red error banner.
- **Persistence.** The `vendor_applications` table only has `description` for free text. To avoid a migration in this iteration, **serialize category-specific answers into the `description` column** as a human-readable block appended to the user's about text, e.g.:

  ```
  [Real Estate details]
  License #: 12345
  Areas: Mogadishu, Hargeisa
  Property types: Houses, Land
  Years of experience: 5

  [About]
  …user's description…
  ```

  This keeps admins able to read everything in the existing admin view with zero schema changes. (A future migration can add a `details jsonb` column; called out below.)
- **Review step.** Render the generic fields + a grouped list of category-specific answers from the schema (so labels stay consistent).
- **Stepper labels.** Unchanged (Welcome / Business / Contact / About / Review). Step 3 visibly grows when a category with extra contact-side fields is picked — that's intentional and signals to the user "this category needs more info".

### Files touched

- `src/data/vendor-application-schemas.ts` *(new)* — field specs per category.
- `src/components/vendor/CategoryFields.tsx` *(new)* — renders a `FieldSpec[]` + manages local controlled values via props.
- `src/routes/vendor.apply.tsx` *(edit)* — wire category schema into steps 3/4/5, update validation, update submit to serialize details into `description`.

### Out of scope (called out for transparency)

- No DB migration in this pass. If you'd prefer structured storage (recommended long-term), I can add a `details jsonb` column to `vendor_applications` and store answers as JSON instead of appending to `description`. Say the word and I'll fold that into the build.
- Admin UI changes are not required — admins will see the formatted block inside the existing "description" field in `admin.vendors`.

## Open question

Do you want me to also add the **`details jsonb` column** now (cleaner, future-proof), or keep this iteration zero-migration and serialize into `description`?
