"use client";

import { useEffect, useRef } from "react";
import type { Observation } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const severityStyles: Record<Observation["severity"], string> = {
  Low: "bg-emerald-400/20 text-emerald-200",
  Medium: "bg-amber-400/20 text-amber-200",
  High: "bg-rose-400/25 text-rose-200",
};

export function ObservationsFeed({
  observations,
  focusedType,
}: {
  observations: Observation[];
  focusedType?: Observation["type"];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!focusedType || !containerRef.current) return;
    const target = containerRef.current.querySelector<HTMLElement>(
      `[data-observation-type="${focusedType}"]`
    );
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusedType, observations]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4"
      data-observations-feed
    >
      {observations.map((observation) => {
        const isFocused = focusedType ? observation.type === focusedType : true;
        return (
          <article
            key={observation.id}
            data-observation-type={observation.type}
            className={cn(
              "rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 transition",
              isFocused ? "opacity-100" : "opacity-40"
            )}
          >
            <header className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
              <span>{observation.type}</span>
              <span className={cn("rounded-full px-2 py-1 text-[10px] font-semibold", severityStyles[observation.severity])}>
                {observation.severity}
              </span>
            </header>
            <h4 className="mt-3 text-sm font-semibold text-foreground">
              {observation.summary}
            </h4>
            <p className="mt-2 text-xs text-muted">{observation.details}</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted">
              {new Date(observation.timeISO).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </article>
        );
      })}
    </div>
  );
}
