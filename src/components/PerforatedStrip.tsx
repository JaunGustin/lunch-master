const ROW_SIZE = 10;

const DOT_CLASSES = {
  amber: "bg-accent border-accent",
  teal: "bg-accent2 border-accent2",
} as const;

export function PerforatedStrip({
  total,
  remaining,
  low,
  color,
}: {
  total: number;
  remaining: number;
  low: boolean;
  color: "amber" | "teal";
}) {
  return (
    <div
      className="grid justify-center gap-x-1.5 gap-y-2.5"
      style={{ gridTemplateColumns: `repeat(${ROW_SIZE}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, i) => {
        const filled = i < remaining;
        return (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full border transition-colors ${
              filled
                ? low
                  ? "bg-danger border-danger"
                  : DOT_CLASSES[color]
                : "border-muted/40 bg-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}
