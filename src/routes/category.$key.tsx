import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Construction } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CATEGORIES } from "@/data/categories";

export const Route = createFileRoute("/category/$key")({
  component: CategoryStub,
});

function CategoryStub() {
  const { key } = useParams({ from: "/category/$key" });
  const cat = CATEGORIES.find((c) => c.key === key);
  return (
    <AppShell>
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold">{cat?.label ?? "Category"}</h1>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className={`${cat?.gradient ?? "grad-hero"} mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-card`}>
          <Construction className="h-10 w-10" />
        </div>
        <h2 className="text-lg font-bold">Coming soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {cat?.label} listings are being onboarded. Verified providers will appear here shortly.
        </p>
        <Link to="/real-estate" className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">
          Explore Real Estate
        </Link>
      </div>
    </AppShell>
  );
}
