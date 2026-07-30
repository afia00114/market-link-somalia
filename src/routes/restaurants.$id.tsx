import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Star, BadgeCheck, MapPin, Clock, Bike, Plus, Minus,
  MessageCircle, Phone, ShoppingBag, X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RESTAURANTS, MENU_CATEGORIES, type MenuItem, type Restaurant } from "@/data/restaurants";
import { whatsappLink, telLink } from "@/lib/contact";

export const Route = createFileRoute("/restaurants/$id")({
  loader: ({ params }): { restaurant: Restaurant } => {
    const restaurant = RESTAURANTS.find((r) => r.id === params.id);
    if (!restaurant) throw notFound();
    return { restaurant };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.restaurant;
    if (!r) {
      return { meta: [{ title: "Restaurant — MaalsoorHub" }, { name: "robots", content: "noindex" }] };
    }
    const url = `https://market-link-somalia.lovable.app/restaurants/${r.id}`;
    const title = `${r.name} — Food Delivery in ${r.city} | MaalsoorHub`.slice(0, 60);
    const description = `Order from ${r.name} (${r.cuisine}) in ${r.district}, ${r.city}. Delivery in ${r.deliveryMins} for $${r.deliveryFee.toFixed(2)}.`.slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: r.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: r.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: r.name,
            image: r.image,
            servesCuisine: r.cuisine,
            telephone: r.phone,
            address: {
              "@type": "PostalAddress",
              addressLocality: r.district,
              addressRegion: r.city,
              addressCountry: "SO",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: r.rating,
              reviewCount: r.reviews,
            },
          }),
        },
      ],
    };
  },
  component: RestaurantDetail,
});

function RestaurantDetail() {
  const { id } = Route.useParams();
  const restaurant = RESTAURANTS.find((r) => r.id === id)!;
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const cats = useMemo(
    () => MENU_CATEGORIES.filter((c) => restaurant.menu.some((m) => m.category === c.key)),
    [restaurant],
  );

  const shown = activeCat ? restaurant.menu.filter((m) => m.category === activeCat) : restaurant.menu;

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ item: restaurant.menu.find((m) => m.id === id)!, qty }))
    .filter((l) => l.item && l.qty > 0);

  const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = subtotal > 0 ? subtotal + restaurant.deliveryFee : 0;

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const remove = (id: string) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }));

  const orderMessage = () => {
    const l = [
      `Hello ${restaurant.name},`,
      ``,
      `I'd like to order for delivery via MaalsoorHub:`,
      ...lines.map((x) => `• ${x.qty} × ${x.item.name} — $${(x.item.price * x.qty).toFixed(2)}`),
      ``,
      `Subtotal: $${subtotal.toFixed(2)}`,
      `Delivery: $${restaurant.deliveryFee.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
      ``,
      `Please confirm delivery time and my address.`,
    ];
    return l.join("\n");
  };

  const belowMin = subtotal > 0 && subtotal < restaurant.minOrder;

  return (
    <AppShell>
      <div className="relative">
        <img
          src={restaurant.image}
          alt={`${restaurant.name} in ${restaurant.city}`}
          className="h-48 w-full object-cover"
        />
        <Link
          to="/restaurants"
          aria-label="Back to restaurants"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <section className="px-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h1 className="truncate text-xl font-extrabold">{restaurant.name}</h1>
              {restaurant.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />}
            </div>
            <p className="text-[13px] text-muted-foreground">{restaurant.tagline}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[12px] font-bold">
            <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
            {restaurant.rating}
            <span className="font-normal text-muted-foreground">({restaurant.reviews})</span>
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Fact icon={MapPin} label={`${restaurant.district}`} sub={restaurant.city} />
          <Fact icon={Clock} label={restaurant.deliveryMins} sub="Delivery time" />
          <Fact icon={Bike} label={`$${restaurant.deliveryFee.toFixed(2)}`} sub="Delivery fee" />
        </div>
      </section>

      {/* Menu categories */}
      <section className="px-4 pt-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <CatChip active={!activeCat} onClick={() => setActiveCat(null)}>All</CatChip>
          {cats.map(({ key, label }) => (
            <CatChip
              key={key}
              active={activeCat === key}
              onClick={() => setActiveCat(activeCat === key ? null : key)}
            >
              {label}
            </CatChip>
          ))}
        </div>
      </section>

      <section className="px-4 pb-40 pt-4">
        <h2 className="mb-2 text-sm font-bold">Menu</h2>
        <ul className="space-y-3">
          {shown.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-soft"
            >
              <img
                src={m.image}
                alt={m.name}
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-bold">{m.name}</span>
                  {m.popular && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      Popular
                    </span>
                  )}
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{m.description}</p>
                <div className="mt-1 text-sm font-extrabold text-primary">${m.price.toFixed(2)}</div>
              </div>
              <QtyControl qty={cart[m.id] ?? 0} onAdd={() => add(m.id)} onRemove={() => remove(m.id)} item={m} />
            </li>
          ))}
        </ul>
      </section>

      {/* Sticky cart bar */}
      {count > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-20 z-30 mx-auto w-full max-w-md px-4">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-card"
          >
            <span className="flex items-center gap-2 text-sm font-bold">
              <ShoppingBag className="h-4 w-4" />
              {count} item{count === 1 ? "" : "s"}
            </span>
            <span className="text-sm font-extrabold">View cart · ${subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-md rounded-t-3xl bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold">Your order</h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="max-h-56 space-y-2 overflow-y-auto">
              {lines.map((l) => (
                <li key={l.item.id} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 truncate">{l.item.name}</span>
                  <QtyControl
                    qty={l.qty}
                    onAdd={() => add(l.item.id)}
                    onRemove={() => remove(l.item.id)}
                    item={l.item}
                    compact
                  />
                  <span className="w-16 text-right font-bold">
                    ${(l.item.price * l.qty).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Delivery" value={`$${restaurant.deliveryFee.toFixed(2)}`} />
              <div className="flex justify-between pt-1 text-base font-extrabold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {belowMin && (
              <p className="mt-2 rounded-xl bg-destructive/10 p-2 text-[12px] font-medium text-destructive">
                Minimum order is ${restaurant.minOrder.toFixed(2)}. Add ${(restaurant.minOrder - subtotal).toFixed(2)} more.
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 pb-2">
              <a
                href={belowMin ? undefined : whatsappLink(restaurant.whatsapp, orderMessage())}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={belowMin}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white ${
                  belowMin ? "pointer-events-none bg-muted-foreground/40" : "bg-[#25D366]"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp
              </a>
              <a
                href={telLink(restaurant.phone)}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-2.5">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="mt-1 truncate text-[12px] font-bold">{label}</div>
      <div className="truncate text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function CatChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
      }`}
    >
      {children}
    </button>
  );
}

function QtyControl({
  qty,
  onAdd,
  onRemove,
  item,
  compact = false,
}: {
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  item: MenuItem;
  compact?: boolean;
}) {
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add ${item.name} to order`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
      >
        <Plus className="h-4 w-4" />
      </button>
    );
  }
  return (
    <div className={`flex shrink-0 items-center gap-2 ${compact ? "" : "rounded-xl bg-secondary p-1"}`}>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove one ${item.name}`}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-card"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-4 text-center text-sm font-bold">{qty}</span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add one ${item.name}`}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
