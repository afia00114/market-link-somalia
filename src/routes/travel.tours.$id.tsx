import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DetailHeader } from "@/components/travel/DetailHeader";
import { InfoList, ContactBar } from "@/components/travel/InfoList";
import { TOUR_PACKAGES, COUNTRIES } from "@/data/travel";
import { BadgeCheck, Star, MapPin, Utensils, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/travel/tours/$id")({
  component: TourDetail,
  loader: ({ params }) => {
    const t = TOUR_PACKAGES.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return { t };
  },
  head: ({ loaderData, params }) => {
    const t = loaderData?.t;
    const url = `https://market-link-somalia.lovable.app/travel/tours/${params.id}`;
    const title = t ? `${t.tourType} Tour — ${t.name}` : "Tour package";
    const desc = t
      ? `${t.tourType} tour by ${t.name}: ${t.days} days, ${t.private ? "private" : "shared"}, from $${t.pricePerPerson}/person. Itinerary: ${t.itinerary.join(" → ")}.`.slice(0, 300)
      : "Tour package on MaalsoorHub.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(t?.logo ? [{ property: "og:image", content: t.logo }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: t
        ? [{
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristTrip",
              name: `${t.tourType} Tour — ${t.name}`,
              description: desc,
              image: t.logo,
              itinerary: t.itinerary,
              touristType: t.private ? "Private" : "Group",
              offers: {
                "@type": "Offer",
                price: t.pricePerPerson,
                priceCurrency: "USD",
                url,
              },
              provider: { "@type": "TravelAgency", name: t.name },
            }),
          }]
        : [],
    };
  },
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-sm">Tour not found. <Link to="/travel/tours" className="text-primary">Back</Link></div>
    </AppShell>
  ),
});

function TourDetail() {
  const { id } = useParams({ from: "/travel/tours/$id" });
  const t = TOUR_PACKAGES.find((x) => x.id === id)!;
  const dest = COUNTRIES.find((c) => c.code === t.destinationCountry);

  // Build day-by-day from itinerary, padding to t.days
  const dayPlan = Array.from({ length: t.days }, (_, i) => {
    const stop = t.itinerary[i % t.itinerary.length];
    return {
      day: i + 1,
      title: stop,
      desc: i === 0 ? "Arrival, transfer & check-in" : i === t.days - 1 ? "Final activities, departure" : "Guided tour, meals & free time",
    };
  });

  return (
    <AppShell hideNav>
      <DetailHeader title={`${t.tourType} in ${dest?.name ?? t.destinationCountry}`} subtitle={`${t.days} days · ${t.private ? "Private" : "Shared"}`} image={t.logo} />

      <section className="space-y-3 px-4 pt-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-bold">
              {t.name}
              {t.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </div>
            <div className="text-2xl font-extrabold text-primary">${t.pricePerPerson}<span className="text-xs font-medium text-muted-foreground">/pp</span></div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-semibold">{t.rating}</span>
            <span className="text-muted-foreground">({t.reviews})</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">{t.tourType}</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{t.days} days</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{t.private ? "Private" : "Shared"}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <h3 className="mb-3 text-sm font-bold">Day-by-day itinerary</h3>
          <ol className="space-y-3">
            {dayPlan.map((d) => (
              <li key={d.day} className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{d.day}</div>
                <div className="flex-1 border-b border-border pb-3 last:border-0">
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <MapPin className="h-3 w-3 text-primary" /> {d.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{d.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-bold">Activities & inclusions</h3>
          <div className="flex flex-wrap gap-1">
            {t.inclusions.map((i) => (
              <span key={i} className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">{i}</span>
            ))}
          </div>
        </div>

        <InfoList
          title="What to expect"
          rows={[
            { icon: Calendar, label: "Duration", value: `${t.days} days` },
            { icon: Users, label: "Group", value: t.private ? "Private tour" : "Small group" },
            { icon: Utensils, label: "Meals", value: t.inclusions.find((i) => i.toLowerCase().includes("meal")) ? "Included" : "Breakfast only" },
            { icon: MapPin, label: "Stops", value: t.itinerary.length },
          ]}
        />
      </section>

      <section className="sticky bottom-0 z-20 mt-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <ContactBar whatsapp={t.whatsapp} phone={t.phone} label="Book tour" />
      </section>
    </AppShell>
  );
}
