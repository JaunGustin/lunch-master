export function PerforatedStrip({
  total,
  remaining,
  low,
}: {
  total: number;
  remaining: number;
  low: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const filled = i < remaining;
        return (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full border transition-colors ${
              filled
                ? low
                  ? "bg-danger border-danger"
                  : "bg-accent border-accent"
                : "border-muted/40 bg-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}
