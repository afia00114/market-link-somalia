import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/categories";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <Link
      to={category.href}
      className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-soft transition-all active:scale-[0.97]"
    >
      <div className={`${category.gradient} flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-soft`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-sm font-semibold leading-tight text-foreground">{category.label}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{category.short}</div>
      </div>
      <div className="text-[11px] font-medium text-primary">{category.count.toLocaleString()} listings</div>
    </Link>
  );
}
