import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/categories";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <Link
      to={category.href}
      className={`${category.gradient} group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-card transition-all active:scale-[0.98]`}
    >
      {/* decorative circles */}
      <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -right-2 -top-2 h-10 w-10 rounded-full bg-white/10" />

      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
        <Icon className="h-5 w-5" />
      </div>

      <div className="relative">
        <div className="text-base font-bold leading-tight">{category.label}</div>
        <div className="mt-0.5 text-xs text-white/80 line-clamp-1">{category.short}</div>
        <div className="mt-2 inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          {category.count.toLocaleString()} listings
        </div>
      </div>
    </Link>
  );
}
