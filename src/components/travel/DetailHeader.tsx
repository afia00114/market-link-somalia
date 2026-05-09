import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  title: string;
  subtitle?: string;
  image?: string;
  backTo?: string;
}

export function DetailHeader({ title, subtitle, image, backTo }: Props) {
  const navigate = useNavigate();
  return (
    <header className="relative">
      {image ? (
        <div className="relative h-44 w-full overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
          <button
            onClick={() => (backTo ? navigate({ to: backTo as any }) : history.back())}
            className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h1 className="text-lg font-bold leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-white/85">{subtitle}</p>}
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (backTo ? navigate({ to: backTo as any }) : history.back())}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold leading-tight">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
