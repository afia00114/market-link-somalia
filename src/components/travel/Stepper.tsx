export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-1 px-4 pb-3 pt-1">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                done ? "bg-whatsapp text-whatsapp-foreground" :
                active ? "bg-primary text-primary-foreground" :
                "bg-secondary text-muted-foreground"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 rounded-full ${done ? "bg-whatsapp" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
