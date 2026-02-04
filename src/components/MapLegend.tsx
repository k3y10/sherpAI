import { cn } from "@/lib/utils";
import type { HazardLevel } from "@/lib/mockData";

const hazardLabels: Record<HazardLevel, string> = {
  1: "Low",
  2: "Moderate",
  3: "Considerable",
  4: "High",
  5: "Extreme",
};

const hazardColors: Record<HazardLevel, string> = {
  1: "bg-emerald-400",
  2: "bg-lime-400",
  3: "bg-amber-400",
  4: "bg-orange-500",
  5: "bg-rose-500",
};

export function MapLegend({
  activeLayer,
  layers,
  onSelectLayer,
  className,
}: {
  activeLayer: string;
  layers?: string[];
  onSelectLayer?: (layer: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 text-xs", className)}>
      <div className="flex items-center justify-between">
        <span className="text-muted uppercase tracking-[0.2em]">Layer</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
          {activeLayer}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {([1, 2, 3, 4, 5] as const).map((level) => (
          <div
            key={level}
            className="flex items-center gap-2 rounded-full bg-[var(--panel-muted)] px-3 py-2"
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", hazardColors[level])} />
            <span className="text-[11px] font-medium text-muted">
              {hazardLabels[level]}
            </span>
          </div>
        ))}
      </div>
      {layers && (
        <div className="flex flex-wrap gap-2 pt-2">
          {layers.map((layer) => (
            <button
              key={layer}
              onClick={() => onSelectLayer?.(layer)}
              className={cn(
                "rounded-full border border-[var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] transition",
                layer === activeLayer
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--panel-muted)] text-muted"
              )}
            >
              {layer}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
