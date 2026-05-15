import { z } from "zod";

export const bookingFormSchema = z.object({
  passengerName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  passengerEmail: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(160, "Email is too long"),
  passengerPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+\d][\d\s().-]+$/, "Use digits, spaces, +, () or - only"),
  notes: z.string().trim().max(500, "Notes are too long").optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export type FieldErrors = Partial<Record<keyof BookingFormValues, string>>;

export function validateBookingForm(values: BookingFormValues): {
  ok: boolean;
  errors: FieldErrors;
} {
  const parsed = bookingFormSchema.safeParse(values);
  if (parsed.success) return { ok: true, errors: {} };
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof BookingFormValues;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
