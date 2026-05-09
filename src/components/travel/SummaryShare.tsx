import { MessageCircle, Phone, ArrowLeft, Mail, Copy, Check, Image as ImageIcon, Share2, Download } from "lucide-react";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { whatsappLink, telLink } from "@/lib/contact";

export function SummaryShare({
  providerName,
  whatsapp,
  phone,
  email,
  subject = "Request from MaalsoorHub",
  summary,
  onBack,
}: {
  providerName: string;
  whatsapp: string;
  phone: string;
  email?: string;
  subject?: string;
  summary: string;
  onBack: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<"share" | "save" | null>(null);
  const [toast, setToast] = useState<string>();

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(undefined), 2200); };

  const mailto = `mailto:${email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  };

  const capture = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: getComputedStyle(document.body).backgroundColor || "#ffffff",
    });
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  const filename = `maalsoorhub-request-${Date.now()}.png`;

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const shareImage = async () => {
    try {
      setBusy("share");
      const blob = await capture();
      if (!blob) return;
      const file = new File([blob], filename, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], title: subject, text: summary });
      } else {
        downloadBlob(blob);
        showToast("Image saved — share it from your gallery");
      }
    } catch (e) {
      const err = e as { name?: string };
      if (err?.name !== "AbortError") showToast("Could not share image");
    } finally {
      setBusy(null);
    }
  };

  const saveImage = async () => {
    try {
      setBusy("save");
      const blob = await capture();
      if (!blob) return;
      downloadBlob(blob);
      showToast("Saved to your downloads");
    } catch {
      showToast("Could not save image");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="px-4 pt-4">
      <button onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <ArrowLeft className="h-3 w-3" /> Edit request
      </button>

      {/* Pre-submission notice */}
      <div className="mb-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-[11px] leading-relaxed text-foreground">
        <div className="mb-1 font-semibold text-primary">Before you submit</div>
        Agencies will first send your official ticket to your <b>email</b>, then follow up on <b>WhatsApp</b> to
        confirm. Make sure your name, email and phone are correct.
      </div>

      {/* Captured card */}
      <div
        ref={cardRef}
        className="rounded-2xl border border-border bg-card p-4 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary">MaalsoorHub</div>
            <div className="text-[10px] text-muted-foreground">Request summary</div>
          </div>
          <div className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Verified lead</div>
        </div>
        <div className="mt-3 text-xs font-semibold text-muted-foreground">Sending to</div>
        <div className="mt-0.5 text-sm font-bold text-foreground">{providerName}</div>
        <div className="mt-3 text-xs font-semibold text-muted-foreground">Message</div>
        <pre className="mt-1 whitespace-pre-wrap rounded-xl bg-secondary p-3 text-xs text-foreground">{summary}</pre>
        <div className="mt-3 border-t border-border pt-2 text-center text-[10px] text-muted-foreground">
          maalsoorhub.com · {new Date().toLocaleDateString()}
        </div>
      </div>

      <a
        href={whatsappLink(whatsapp, summary)}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-whatsapp-foreground shadow-soft active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" /> Send via WhatsApp
      </a>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          onClick={shareImage}
          disabled={busy !== null}
          className="flex h-11 items-center justify-center gap-1 rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-soft active:scale-[0.98] disabled:opacity-60"
        >
          <Share2 className="h-4 w-4" /> {busy === "share" ? "Preparing…" : "Share as image"}
        </button>
        <button
          onClick={saveImage}
          disabled={busy !== null}
          className="flex h-11 items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs font-semibold text-foreground active:scale-[0.98] disabled:opacity-60"
        >
          {busy === "save" ? <><ImageIcon className="h-4 w-4" /> Saving…</> : <><Download className="h-4 w-4" /> Save image</>}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <a href={telLink(phone)} className="flex h-11 items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs font-semibold text-foreground active:scale-[0.98]">
          <Phone className="h-4 w-4" /> Call
        </a>
        <a href={mailto} className="flex h-11 items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs font-semibold text-foreground active:scale-[0.98]">
          <Mail className="h-4 w-4" /> Email
        </a>
        <button onClick={copy} className="flex h-11 items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs font-semibold text-foreground active:scale-[0.98]">
          {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
        </button>
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        MaalsoorHub does not process payments. You'll arrange directly with the provider.
      </p>

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90%] rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
