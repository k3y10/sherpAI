"use client";

import { useMemo } from "react";
import type { ForecastZone } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const hazardFill: Record<ForecastZone["hazardLevel"], string> = {
  1: "fill-emerald-400/50",
  2: "fill-lime-400/45",
  3: "fill-amber-400/45",
  4: "fill-orange-500/50",
  5: "fill-rose-500/55",
};

export type MapLayer =
  | "Hazard"
  | "Avalanches"
  | "Wind"
  | "Snow"
  | "Temp"
  | "Problems";

export function MapCanvas({
  zones,
  selectedZoneId,
  highlightedZoneIds,
  zoom,
  onSelect,
  activeLayer,
  className,
}: {
  zones: ForecastZone[];
  selectedZoneId?: string;
  highlightedZoneIds?: string[];
  zoom: number;
  onSelect: (zoneId: string) => void;
  activeLayer: MapLayer;
  className?: string;
}) {
  const transform = useMemo(() => `scale(${zoom})`, [zoom]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        viewBox="0 0 1040 720"
        className="h-full w-full"
        style={{ transform, transformOrigin: "center" }}
      >
        <defs>
          <linearGradient id="terrain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#121826" />
            <stop offset="50%" stopColor="#0b0f16" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="1040" height="720" fill="url(#terrain)" rx="36" />
        <g opacity="0.35">
          {[120, 260, 380, 520, 660].map((y) => (
            <path
              key={y}
              d={`M 80 ${y} C 280 ${y - 60}, 680 ${y + 40}, 980 ${y - 20}`}
              stroke="#1f2a44"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </g>
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          const isHighlighted = highlightedZoneIds?.includes(zone.id);
          const polygonPoints = zone.polygon
            .map((point) => `${point.x},${point.y}`)
            .join(" ");

          return (
            <g key={zone.id} className="cursor-pointer">
              <polygon
                points={polygonPoints}
                className={cn(
                  "transition",
                  hazardFill[zone.hazardLevel],
                  isSelected && "stroke-white/80 stroke-[3px]",
                  isHighlighted && "stroke-white/80 stroke-[3px]"
                )}
                filter={isSelected || isHighlighted ? "url(#glow)" : undefined}
                onClick={() => onSelect(zone.id)}
              />
              <text
                x={zone.polygon[0].x + 20}
                y={zone.polygon[0].y + 30}
                fill="#fff"
                fontSize="18"
                fontWeight="600"
                opacity={0.75}
              >
                {zone.name}
              </text>
              {activeLayer !== "Hazard" && (
                <circle
                  cx={zone.polygon[0].x + 40}
                  cy={zone.polygon[0].y + 70}
                  r={activeLayer === "Avalanches" ? 12 : 8}
                  fill={activeLayer === "Avalanches" ? "#f87171" : "#38bdf8"}
                  opacity={0.8}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
