import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DetailHeader } from "@/components/travel/DetailHeader";
import { InfoList, ContactBar } from "@/components/travel/InfoList";
import { VISA_SERVICES, COUNTRIES } from "@/data/travel";
import { CheckCircle2, Clock, FileText, Upload, BadgeCheck, Circle } from "lucide-react";

export const Route = createFileRoute("/travel/visa/$id")({
  component: VisaDetail,
  loader: ({ params }) => {
    const v = VISA_SERVICES.find((x) => x.id === params.id);
    if (!v) throw notFound();
    return { v };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.v.name} — Visa Detail` }],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-sm">Visa service not found. <Link to="/travel/visa" className="text-primary">Back</Link></div>
    </AppShell>
  ),
});

const STEPS = ["Submit application", "Document review", "Embassy processing", "Visa issued"];

function VisaDetail() {
  const { id } = useParams({ from: "/travel/visa/$id" });
  const v = VISA_SERVICES.find((x) => x.id === id)!;
  const dest = COUNTRIES.find((c) => c.code === v.destination);

  return (
    <AppShell hideNav>
      <DetailHeader title={`${v.visaType} Visa`} subtitle={`${dest?.flag ?? ""} ${dest?.name ?? v.destination}`} image={v.logo} />

      <section className="space-y-3 px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-bold">
              {v.name}
              {v.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </div>
            <div className="text-xl font-extrabold text-primary">${v.fee}</div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {v.processingDays} · {v.successRate}% success rate
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold"><FileText className="h-4 w-4 text-primary" /> Document checklist</h3>
          <ul className="space-y-1.5">
            {v.requirements.map((r) => (
              <li key={r} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-card p-4 text-center">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-xs font-medium">Upload documents</p>
          <p className="text-[11px] text-muted-foreground">Send via WhatsApp after submission</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-bold">Application status</h3>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-3">
                {i === 0 ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                )}
                <div>
                  <div className="text-xs font-semibold">{s}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {i === 0 ? "Pending submission" : "Awaiting"}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <InfoList
          rows={[
            { icon: Clock, label: "Processing time", value: v.processingDays },
            { icon: FileText, label: "Visa type", value: v.visaType },
          ]}
        />
      </section>

      <section className="sticky bottom-0 z-20 mt-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <ContactBar whatsapp={v.whatsapp} phone={v.phone} label="Submit application" />
      </section>
    </AppShell>
  );
}
