import { useCallback, useState } from "react";
import { saveBooking, type Booking, type BookingChannel, type BookingService } from "@/lib/bookings";
import { bookingFormSchema, type BookingFormValues, type FieldErrors } from "@/lib/booking/schema";
import { createBooking } from "@/lib/booking/createBooking.functions";
import { useServerFn } from "@tanstack/react-start";

export interface SubmitBookingArgs {
  service: BookingService;
  offerId: string;
  providerName: string;
  providerPhone?: string;
  providerWhatsapp?: string;
  title?: string;
  details?: Record<string, string | number | undefined>;
  unitPrice?: number;
  total?: number;
  currency?: string;
  channel: BookingChannel;
  values: BookingFormValues;
}

export function useBookingSubmit() {
  const createBookingFn = useServerFn(createBooking);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = useCallback((values: BookingFormValues) => {
    const parsed = bookingFormSchema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const next: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof BookingFormValues;
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return false;
  }, []);

  const submit = useCallback(
    async (args: SubmitBookingArgs): Promise<Booking | null> => {
      if (!validate(args.values)) return null;
      setSubmitting(true);

      // Save locally first so the user always gets a confirmation, even offline.
      const local = saveBooking({
        service: args.service,
        offerId: args.offerId,
        providerName: args.providerName,
        providerPhone: args.providerPhone,
        providerWhatsapp: args.providerWhatsapp,
        title: args.title,
        details: args.details as Record<string, string | number | undefined> | undefined,
        passengerName: args.values.passengerName,
        passengerEmail: args.values.passengerEmail,
        passengerPhone: args.values.passengerPhone,
        notes: args.values.notes,
        unitPrice: args.unitPrice,
        total: args.total,
        currency: args.currency ?? "USD",
        channel: args.channel,
      });

      // Fire-and-forget: persist to backend so the provider/user can see it later.
      try {
        // Convert details values to a JSON-safe shape
        const safeDetails: Record<string, string | number | boolean | null> = {};
        if (args.details) {
          for (const [k, v] of Object.entries(args.details)) {
            if (v === undefined) continue;
            safeDetails[k] = v as string | number | boolean | null;
          }
        }
        await createBookingFn({
          data: {
            ref: local.ref,
            service: args.service,
            offerId: args.offerId,
            providerName: args.providerName,
            providerPhone: args.providerPhone,
            providerWhatsapp: args.providerWhatsapp,
            title: args.title,
            details: safeDetails,
            passengerName: args.values.passengerName,
            passengerEmail: args.values.passengerEmail,
            passengerPhone: args.values.passengerPhone,
            notes: args.values.notes,
            unitPrice: args.unitPrice ?? null,
            total: args.total ?? null,
            currency: args.currency ?? "USD",
            channel: args.channel,
          },
        });
      } catch (err) {
        // Network failure is non-fatal — the booking is already in local storage.
        console.warn("Cloud save failed, continuing with local booking:", err);
      } finally {
        setSubmitting(false);
      }

      return local;
    },
    [createBookingFn, validate],
  );

  return { submit, submitting, errors, setErrors, validate };
}
