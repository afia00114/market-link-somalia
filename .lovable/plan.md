## Goal
Let customers pay vendors with **EVC Plus** or **eDahab**, confirm the transaction in-app, and track everything in your database — without needing API approval from Hormuud or Golis.

## How it works (customer view)
1. Customer clicks "Pay" on an order/booking.
2. App shows the vendor's EVC Plus and eDahab numbers + the amount due.
3. Customer sends the money from their own phone (USSD or app).
4. Customer enters the **transaction reference** they received and taps "I've paid".
5. Vendor sees a pending payment, verifies on their phone, and approves → order is marked paid.

## What I'll build

### 1. Database
- `payment_methods` table on `vendor_profiles`: `evc_number`, `edahab_number` (vendor adds in their settings).
- `payments` table:
  - `id`, `customer_id`, `vendor_id`, `amount`, `currency` (USD/SOS)
  - `method` (`evc` | `edahab`)
  - `reference` (transaction ID entered by customer)
  - `status` (`pending` | `confirmed` | `rejected`)
  - `note` (optional vendor reason if rejected)
  - timestamps
- RLS: customer sees their own, vendor sees payments to them, admin sees all.

### 2. UI
- **Vendor settings**: add/edit EVC and eDahab numbers.
- **Checkout page**: shows vendor's numbers, amount, method picker, reference input, submit.
- **Vendor dashboard → Payments tab**: list of pending payments with Approve / Reject buttons.
- **Customer profile → My Payments**: history with status.

### 3. Notifications
Realtime row update on the `payments` table so vendor sees new pending payments instantly.

## Upgrade path (later)
When you get WaafiPay (EVC) or eDahab API credentials, I can swap the manual confirmation for automatic verification — the `payments` table stays the same.

## Not included
- No automatic verification against Hormuud/Golis (requires merchant API access).
- No subscription billing (the current `subscribe.tsx` $5/$50 page would need a different model — confirm if you want that converted to manual too, or keep it for now).

Approve and I'll start with the migration.
