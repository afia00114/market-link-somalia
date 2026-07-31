import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PayDialog } from "./PayDialog";

interface PayButtonProps {
  vendorId: string;
  postId?: string;
  bookingRef?: string;
  defaultAmount?: number;
  defaultCurrency?: "USD" | "SOS";
  className?: string;
  label?: string;
}

interface VendorRow {
  id: string;
  business_name: string;
  evc_number: string | null;
  edahab_number: string | null;
  zaad_number: string | null;
}

export function PayButton({ vendorId, postId, bookingRef, defaultAmount, defaultCurrency, className, label = "Pay with mobile money" }: PayButtonProps) {
  const [vendor, setVendor] = useState<VendorRow | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Mobile-money numbers are not publicly readable; they come from a
      // signed-in-only security definer function scoped to this vendor.
      const [{ data: base }, { data: nums }] = await Promise.all([
        supabase.from("vendor_profiles").select("id,business_name").eq("id", vendorId).maybeSingle(),
        supabase.rpc("get_vendor_payment_numbers", { _vendor_id: vendorId }),
      ]);
      if (cancelled || !base) return;
      const n = (nums as { evc_number: string | null; edahab_number: string | null; zaad_number: string | null }[] | null)?.[0];
      setVendor({
        id: base.id,
        business_name: base.business_name,
        evc_number: n?.evc_number ?? null,
        edahab_number: n?.edahab_number ?? null,
        zaad_number: n?.zaad_number ?? null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [vendorId]);


  if (!vendor) return null;
  const hasAny = vendor.evc_number || vendor.edahab_number || vendor.zaad_number;
  if (!hasAny) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? "flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"}
      >
        <Wallet className="h-4 w-4" /> {label}
      </button>
      {open && (
        <PayDialog
          vendor={vendor}
          postId={postId}
          bookingRef={bookingRef}
          defaultAmount={defaultAmount}
          defaultCurrency={defaultCurrency}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
