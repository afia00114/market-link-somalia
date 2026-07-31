import { useCallback, useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Extra classes for the clickable wrapper */
  wrapperClassName?: string;
  caption?: string;
  loading?: "lazy" | "eager";
};

export function ImageZoom({ src, alt, className, wrapperClassName, caption, loading = "lazy" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open larger photo: ${alt}`}
        className={`group relative overflow-hidden ${wrapperClassName ?? ""}`}
      >
        <img src={src} alt={alt} loading={loading} className={className} />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100 group-active:bg-black/25 group-active:opacity-100">
          <ZoomIn className="h-4 w-4 text-white drop-shadow" />
        </span>
      </button>
      {open && <Lightbox src={src} alt={alt} caption={caption ?? alt} onClose={() => setOpen(false)} />}
    </>
  );
}

function Lightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption: string;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stateRef = useRef({ zoom, offset });
  stateRef.current = { zoom, offset };

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const zoomAt = useCallback((next: number, px: number, py: number) => {
    const { zoom: z, offset: o } = stateRef.current;
    const nz = clamp(next, MIN_ZOOM, MAX_ZOOM);
    const k = nz / z;
    const no = nz === MIN_ZOOM ? { x: 0, y: 0 } : { x: px - (px - o.x) * k, y: py - (py - o.y) * k };
    setZoom(nz);
    setOffset(no);
  }, []);

  const zoomAtCenter = useCallback(
    (factor: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      zoomAt(stateRef.current.zoom * factor, (rect?.width ?? 0) / 2, (rect?.height ?? 0) / 2);
    },
    [zoomAt],
  );

  // Wheel / trackpad pinch (non-passive so preventDefault works)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      zoomAt(stateRef.current.zoom * Math.exp(-dy * 0.0018), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Escape + lock body scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: stateRef.current.zoom };
      dragRef.current = null;
    } else if (pointers.current.size === 1) {
      const o = stateRef.current.offset;
      dragRef.current = { x: e.clientX, y: e.clientY, ox: o.x, oy: o.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const rect = containerRef.current?.getBoundingClientRect();
    if (pointers.current.size === 2 && pinchRef.current && rect) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const cx = (a.x + b.x) / 2 - rect.left;
      const cy = (a.y + b.y) / 2 - rect.top;
      zoomAt((pinchRef.current.zoom * dist) / pinchRef.current.dist, cx, cy);
    } else if (dragRef.current && stateRef.current.zoom > 1) {
      const d = dragRef.current;
      setOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0) dragRef.current = null;
  };

  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={caption}
    >
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <p className="truncate text-sm font-semibold text-foreground">{caption}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onDoubleClick={(e) => {
          const rect = containerRef.current!.getBoundingClientRect();
          zoomAt(stateRef.current.zoom > 1 ? 1 : 2.5, e.clientX - rect.left, e.clientY - rect.top);
        }}
        className="relative flex-1 select-none overflow-hidden"
        style={{ touchAction: "none", cursor: zoom > 1 ? "grab" : "zoom-in" }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 object-contain"
          style={{
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
            transition: dragRef.current || pinchRef.current ? "none" : "transform 120ms ease-out",
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <button
          type="button"
          onClick={() => zoomAtCenter(1 / 1.5)}
          aria-label="Zoom out"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground disabled:opacity-40"
          disabled={zoom <= MIN_ZOOM}
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="min-w-14 text-center text-xs font-bold text-muted-foreground">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => zoomAtCenter(1.5)}
          aria-label="Zoom in"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground disabled:opacity-40"
          disabled={zoom >= MAX_ZOOM}
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset zoom"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default ImageZoom;
