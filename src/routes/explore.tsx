import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CATEGORIES } from "@/data/categories";
import { CategoryCard } from "@/components/CategoryCard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => {
    const url = "https://market-link-somalia.lovable.app/explore";
    const title = "Explore Categories — MaalsoorHub";
    const description = "Explore all service categories: real estate, travel, health, jobs, and more across Somalia.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: CATEGORIES.map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: c.label,
                url: `https://market-link-somalia.lovable.app${c.href}`,
              })),
            },
          }),
        },
      ],
    };
  },
  component: Explore,
});

function Explore() {
  return (
    <AppShell>
      <header className="border-b border-border bg-card px-4 py-4">
        <h1 className="text-lg font-bold">Explore Categories</h1>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input aria-label="Search categories" placeholder="Search categories, cities…" className="w-full bg-transparent text-sm outline-none" />
        </div>
      </header>
      <section className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((c) => <CategoryCard key={c.key} category={c} />)}
        </div>
      </section>
    </AppShell>
  );
}
