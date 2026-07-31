import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Star, BadgeCheck, MapPin, Clock, Truck, Plus, Minus,
  MessageCircle, Phone, ShoppingBag, X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ImageZoom } from "@/components/ImageZoom";
import { SHOPS, type Shop, type ShopProduct } from "@/data/shops";
import { whatsappLink, telLink } from "@/lib/contact";
import { DeliveryAddressPicker } from "@/components/DeliveryAddressPicker";
import {
  EMPTY_ADDRESS,
  formatAddress,
  isAddressComplete,
  type DeliveryAddress,
} from "@/lib/delivery-address";

export const Route = createFileRoute("/shops/$id")({
  loader: ({ params }): { shop: Shop } => {
    const shop = SHOPS.find((s) => s.id === params.id);
    if (!shop) throw notFound();
    return { shop };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.shop;
    if (!s) {
      return { meta: [{ title: "Shop — MaalsoorHub" }, { name: "robots", content: "noindex" }] };
    }
    const url = `https://market-link-somalia.lovable.app/shops/${s.id}`;
    const title = `${s.name} — ${s.type} in ${s.city}`.slice(0, 60);
    const description = `Shop ${s.products.length}+ ${s.type.toLowerCase()} items from ${s.name} in ${s.city}. Prices, stock and delivery in ${s.deliveryMins}. Order on WhatsApp.`.slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: s.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: s.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: s.name,
            image: s.image,
            telephone: s.phone,
            address: {
              "@type": "PostalAddress",
              addressLocality: s.district ?? s.city,
              addressRegion: s.city,
              addressCountry: "SO",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: s.rating,
              reviewCount: s.reviews,
            },
            makesOffer: s.products.slice(0, 20).map((p) => ({
              "@type": "Offer",
              price: p.price,
              priceCurrency: "USD",
              availability: p.inStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemOffered: { "@type": "Product", name: p.name },
            })),
          }),
        },
      ],
    };
  },
  component: ShopDetail,
});

function ShopDetail() {
  const { id } = Route.useParams();
  const shop = SHOPS.find((s) => s.id === id)!;
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [address, setAddress] = useState<DeliveryAddress>(EMPTY_ADDRESS);
  const addressReady = isAddressComplete(address);

  const shown = useMemo(
    () => (activeDept ? shop.products.filter((p) => p.category === activeDept) : shop.products),
    [shop, activeDept],
  );

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ item: shop.products.find((p) => p.id === id)!, qty }))
    .filter((l) => l.item && l.qty > 0);

  const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = subtotal > 0 ? subtotal + shop.deliveryFee : 0;
  const belowMin = subtotal > 0 && subtotal < shop.minOrder;

  const add = (p: ShopProduct) =>
    setCart((c) => ({ ...c, [p.id]: Math.min(p.inStock, (c[p.id] ?? 0) + 1) }));
  const remove = (p: ShopProduct) =>
    setCart((c) => ({ ...c, [p.id]: Math.max(0, (c[p.id] ?? 0) - 1) }));

  const orderMessage = () =>
    [
      `Hello ${shop.name},`,
      ``,
      `I'd like to order from your shop via MaalsoorHub:`,
      ...lines.map((x) => `• ${x.qty} × ${x.item.name} (${x.item.unit}) — $${(x.item.price * x.qty).toFixed(2)}`),
      ``,
      `Subtotal: $${subtotal.toFixed(2)}`,
      `Delivery: $${shop.deliveryFee.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
      ``,
      `Deliver to: ${formatAddress(address)}`,
      `Phone: ${address.phone}`,
      ...(address.notes ? [`Notes: ${address.notes}`] : []),
      ``,
      `Please confirm availability and delivery time.`,
    ].join("\n");


  return (
    <AppShell>
      <div className="relative">
        <ImageZoom
          src={shop.image}
          alt={`${shop.name} in ${shop.city}`}
          caption={shop.name}
          loading="eager"
          wrapperClassName="block h-48 w-full"
          className="h-48 w-full object-cover"
        />
        <Link
          to="/category/$key"
          params={{ key: "shops" }}
          aria-label="Back to shops"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <section className="px-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h1 className="truncate text-xl font-extrabold">{shop.name}</h1>
              {shop.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />}
            </div>
            <p className="text-[13px] text-muted-foreground">{shop.tagline}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[12px] font-bold">
            <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
            {shop.rating}
            <span className="font-normal text-muted-foreground">({shop.reviews})</span>
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Fact icon={MapPin} label={shop.district ?? shop.city} sub={shop.city} />
          <Fact icon={Clock} label={shop.deliveryMins} sub="Delivery time" />
          <Fact
            icon={Truck}
            label={shop.deliveryFee === 0 ? "Free" : `$${shop.deliveryFee.toFixed(2)}`}
            sub="Delivery fee"
          />
        </div>
      </section>

      <section className="px-4 pt-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!activeDept} onClick={() => setActiveDept(null)}>All items</Chip>
          {shop.departments.map(({ key, label }) => (
            <Chip
              key={key}
              active={activeDept === key}
              onClick={() => setActiveDept(activeDept === key ? null : key)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </section>

      <section className="px-4 pb-40 pt-4">
        <h2 className="mb-2 text-sm font-bold">
          Items <span className="font-normal text-muted-foreground">· {shown.length}</span>
        </h2>
        <ul className="space-y-3">
          {shown.map((p) => {
            const qty = cart[p.id] ?? 0;
            const out = p.inStock === 0;
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-soft"
              >
                <ImageZoom
                  src={p.image}
                  alt={p.name}
                  caption={`${p.name} — $${p.price.toFixed(2)} / ${p.unit}`}
                  wrapperClassName="h-16 w-16 shrink-0 rounded-xl"
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-bold">{p.name}</span>
                    {p.popular && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{p.description}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-extrabold text-primary">${p.price.toFixed(2)}</span>
                    <span className="text-[11px] text-muted-foreground">/ {p.unit}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        out
                          ? "bg-destructive/10 text-destructive"
                          : p.inStock < 10
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      {out ? "Out of stock" : `${p.inStock} in stock`}
                    </span>
                  </div>
                </div>
                {!out && <Qty qty={qty} onAdd={() => add(p)} onRemove={() => remove(p)} name={p.name} />}
              </li>
            );
          })}
        </ul>
      </section>

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
            <span className="text-sm font-extrabold">View basket · ${subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold">Your basket</h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close basket"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="max-h-56 space-y-2 overflow-y-auto">
              {lines.map((l) => (
                <li key={l.item.id} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 truncate">{l.item.name}</span>
                  <Qty
                    qty={l.qty}
                    onAdd={() => add(l.item)}
                    onRemove={() => remove(l.item)}
                    name={l.item.name}
                    compact
                  />
                  <span className="w-16 text-right font-bold">${(l.item.price * l.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Delivery" value={shop.deliveryFee === 0 ? "Free" : `$${shop.deliveryFee.toFixed(2)}`} />
              <div className="flex justify-between pt-1 text-base font-extrabold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <DeliveryAddressPicker
              defaultCity={shop.city}
              value={address}
              onChange={setAddress}
            />

            {belowMin && (
              <p className="mt-2 rounded-xl bg-destructive/10 p-2 text-[12px] font-medium text-destructive">
                Minimum order is ${shop.minOrder.toFixed(2)}. Add ${(shop.minOrder - subtotal).toFixed(2)} more.
              </p>
            )}

            {!addressReady && (
              <p className="mt-2 rounded-xl bg-secondary p-2 text-[12px] font-medium text-muted-foreground">
                Add and save your delivery address to place the order.
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 pb-2">
              <a
                href={belowMin || !addressReady ? undefined : whatsappLink(shop.whatsapp, orderMessage())}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={belowMin || !addressReady}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white ${
                  belowMin || !addressReady ? "pointer-events-none bg-muted-foreground/40" : "bg-[#25D366]"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp
              </a>

              <a
                href={telLink(shop.phone)}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold"
              >
                <Phone className="h-4 w-4" />
                Call shop
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

function Chip({
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

function Qty({
  qty,
  onAdd,
  onRemove,
  name,
  compact = false,
}: {
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  name: string;
  compact?: boolean;
}) {
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add ${name} to basket`}
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
        aria-label={`Remove one ${name}`}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-card"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-4 text-center text-sm font-bold">{qty}</span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add one ${name}`}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
