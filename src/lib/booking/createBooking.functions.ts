import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const inputSchema = z.object({
  ref: z.string().min(3).max(40),
  service: z.enum(["flight", "listing", "hotel"]),
  offerId: z.string().min(1).max(120),
  providerName: z.string().min(1).max(160),
  providerPhone: z.string().max(40).optional(),
  providerWhatsapp: z.string().max(40).optional(),
  title: z.string().max(200).optional(),
  details: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  passengerName: z.string().min(2).max(80),
  passengerEmail: z.string().email().max(160),
  passengerPhone: z.string().min(7).max(20),
  notes: z.string().max(500).optional(),
  unitPrice: z.number().nullable().optional(),
  total: z.number().nullable().optional(),
  currency: z.string().max(8).optional(),
  channel: z.enum(["whatsapp", "call", "email"]),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const { error, data: row } = await supabaseAdmin
      .from("bookings")
      .insert({
        ref: data.ref,
        service: data.service,
        offer_id: data.offerId,
        provider_name: data.providerName,
        provider_phone: data.providerPhone ?? null,
        provider_whatsapp: data.providerWhatsapp ?? null,
        details: { title: data.title, ...(data.details ?? {}) },
        passenger_name: data.passengerName,
        passenger_email: data.passengerEmail,
        passenger_phone: data.passengerPhone,
        notes: data.notes ?? null,
        unit_price: data.unitPrice ?? null,
        total: data.total ?? null,
        currency: data.currency ?? "USD",
        channel: data.channel,
      })
      .select("id, ref")
      .single();

    if (error) {
      console.error("createBooking error", error);
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const, id: row.id, ref: row.ref };
  });
