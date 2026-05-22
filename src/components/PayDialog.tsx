import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Vendor {
  id: string;
  business_name: string;
  evc_number: string | null;
  edahab_number: string | null;
}

interface PayDialogProps {
  vendor: Vendor;
  postId?: string;
  bookingRef?: string;
  defaultAmount?: number;
  defaultCurrency?: "USD" | "SOS";
  onClose: () => void;
  onSubmitted?: () => void;
}

export function PayDialog({ vendor, postId, bookingRef, defaultAmount, defaultCurrency = "USD", onClose, onSubmitted }: PayDialogProps) {
  const { user } = useAuth();
  const methods: Array<"evc" | "edahab"> = [];
  if (vendor.evc_number) methods.push("evc");
  if (vendor.edahab_number) methods.push("edahab");

  const [method, setMethod] = useState<"evc" | "edahab" | null>(methods[0] ?? null);
  const [amount, setAmount] = useState(defaultAmount?.toString() ?? "");
  const [currency, setCurrency] = useState<"USD" | "SOS">(defaultCurrency);
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);

  const payTo = method === "evc" ? vendor.evc_number : method === "edahab" ? vendor.edahab_number : null;

  const copy = async () => {
    if (!payTo) return;
    await navigator.clipboard.writeText(payTo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!user) return setErr("Please sign in to record your payment.");
    if (!method) return setErr("Choose a payment method.");
    const amt = Number(amount);
    if (!amt || amt <= 0) return setErr("Enter the amount you paid.");
    if (reference.trim().length < 3) return setErr("Enter the transaction reference from your SMS.");
    setSubmitting(true);
    const { error } = await supabase.from("payments").insert({
      customer_id: user.id,
      vendor_id: vendor.id,
      post_id: postId ?? null,
      booking_ref: bookingRef ?? null,
      amount: amt,
      currency,
      method,
      reference: reference.trim(),
    });
    setSubmitting(false);
    if (error) return setErr(error.message);
    setDone(true);
    onSubmitted?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-t-3xl bg-card p-4 pb-6">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">Pay {vendor.business_name}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-6 w-6" /></div>
            <h3 className="text-sm font-semibold">Payment submitted</h3>
            <p className="mt-1 text-xs text-muted-foreground">The vendor will confirm your transaction shortly.</p>
            <button onClick={onClose} className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Done</button>
          </div>
        ) : methods.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">This vendor hasn't added mobile money details yet.</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Payment method</label>
              <div className="flex gap-2">
                {methods.map((m) => (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold ${method === m ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"}`}>
                    {m === "evc" ? "EVC Plus" : "eDahab"}
                  </button>
                ))}
              </div>
            </div>

            {payTo && (
              <div className="rounded-xl bg-secondary p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Send to this number</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-lg font-bold tabular-nums">{payTo}</span>
                  <button type="button" onClick={copy} className="flex items-center gap-1 rounded-lg bg-card px-2.5 py-1.5 text-xs font-semibold">
                    {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {method === "evc"
                    ? "Dial *712*number*amount# on your phone, then paste the SMS reference below."
                    : "Use the eDahab app or USSD, then paste the SMS reference below."}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Amount paid *</label>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value as "USD" | "SOS")}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
                  <option value="USD">USD</option>
                  <option value="SOS">SOS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Transaction reference *</label>
              <input value={reference} onChange={(e) => setReference(e.target.value)} required maxLength={64}
                placeholder="e.g. EVC1234567 from SMS"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
            </div>

            {err && <p className="text-xs text-destructive">{err}</p>}
            <button type="submit" disabled={submitting}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {submitting ? "Submitting…" : "I've paid"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">The vendor will verify and mark it confirmed.</p>
          </form>
        )}
      </div>
    </div>
  );
}
