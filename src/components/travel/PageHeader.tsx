import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function PageHeader({ title, subtitle, back = "/travel" }: { title: string; subtitle?: string; back?: string }) {
  return (
    <header className="grad-travel rounded-b-3xl px-4 pb-5 pt-5 text-white shadow-card">
      <div className="flex items-center gap-3">
        <Link to={back} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold">{title}</h1>
          {subtitle && <p className="truncate text-xs text-white/85">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
