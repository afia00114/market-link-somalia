import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CATEGORIES } from "@/data/categories";
import { CategoryCard } from "@/components/CategoryCard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Categories — MaalsoorHub" },
      { name: "description", content: "Explore all service categories: real estate, travel, health, jobs, and more across Somalia." },
      { property: "og:title", content: "Explore Categories — MaalsoorHub" },
      { property: "og:description", content: "Explore all service categories on MaalsoorHub." },
      { property: "og:url", content: "https://market-link-somalia.lovable.app/explore" },
    ],
    links: [
      { rel: "canonical", href: "https://market-link-somalia.lovable.app/explore" },
    ],
  }),
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
