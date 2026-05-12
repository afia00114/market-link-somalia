import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/categories";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <Link
      to={category.href}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-soft transition-all active:scale-[0.97] hover:shadow-card"
    >
      <div
        className={`${category.gradient} flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-soft`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-semibold leading-tight text-foreground line-clamp-2">
          {category.label}
        </div>
        <div className="mt-0.5 text-[10px] text-muted-foreground">
          {category.count.toLocaleString()}
        </div>
      </div>
    </Link>
  );
}
