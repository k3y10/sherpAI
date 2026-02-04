"use client";

import { cn } from "@/lib/utils";
import type { ForecastZone, Observation } from "@/lib/mockData";

const expressions = {
  1: { label: "Playful", accent: "#22c55e", brow: "translateY(0)", mouth: "M48 66 C54 72 66 72 72 66" },
  2: { label: "Curious", accent: "#84cc16", brow: "translateY(2)", mouth: "M48 66 C55 70 65 70 72 66" },
  3: { label: "Alert", accent: "#f59e0b", brow: "translateY(4)", mouth: "M48 66 C56 64 64 64 72 66" },
  4: { label: "Worried", accent: "#f97316", brow: "translateY(6)", mouth: "M48 66 C56 60 64 60 72 66" },
  5: { label: "Urgent", accent: "#ef4444", brow: "translateY(8)", mouth: "M48 66 C56 58 64 58 72 66" },
};

export function SherpAIAvatar({
  zone,
  activeObservation,
  pulse = false,
  className,
}: {
  zone?: ForecastZone;
  activeObservation?: Observation;
  pulse?: boolean;
  className?: string;
}) {
  const hazardLevel = zone?.hazardLevel ?? 2;
  const isHighSeverityAvalanche =
    activeObservation?.type === "Avalanche" && activeObservation.severity === "High";
  const isLowConfidence = (zone?.confidenceScore ?? 80) < 45;
  const stateLevel = Math.min(
    5,
    Math.max(1, hazardLevel + (isLowConfidence || isHighSeverityAvalanche ? 1 : 0))
  ) as keyof typeof expressions;
  const expression = expressions[stateLevel];

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 transition",
        pulse && "animate-pulse",
        className
      )}
    >
      <div className="relative h-20 w-20">
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full transition"
          style={{ filter: isHighSeverityAvalanche ? "drop-shadow(0 0 12px rgba(239,68,68,0.6))" : undefined }}
        >
          <circle cx="60" cy="60" r="48" fill="#1f2937" />
          <circle cx="60" cy="68" r="34" fill="#f8fafc" />
          <circle cx="42" cy="60" r="10" fill="#111827" />
          <circle cx="78" cy="60" r="10" fill="#111827" />
          <circle cx="42" cy="60" r="4" fill="#f8fafc" />
          <circle cx="78" cy="60" r="4" fill="#f8fafc" />
          <path
            d={expression.mouth}
            stroke="#111827"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M32 44 C40 36 52 36 60 44"
            stroke="#111827"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="transition-transform duration-500"
            style={{ transform: expression.brow, transformOrigin: "center" }}
          />
          <path
            d="M60 44 C68 36 80 36 88 44"
            stroke="#111827"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="transition-transform duration-500"
            style={{ transform: expression.brow, transformOrigin: "center" }}
          />
          <path
            d="M30 30 L60 18 L90 30 L86 42 L60 34 L34 42 Z"
            fill="#111827"
          />
          <path
            d="M38 38 L60 30 L82 38"
            stroke={expression.accent}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="30" r="4" fill={expression.accent} />
        </svg>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          SherpAI
        </p>
        <h3 className="text-lg font-semibold">{expression.label} mode</h3>
        <p className="text-xs text-muted">
          {isLowConfidence
            ? "Confidence dip detected — stay conservative."
            : zone
            ? `${zone.name} • ${zone.confidenceScore}% confidence`
            : "Awaiting zone selection"}
        </p>
      </div>
    </div>
  );
}
