import type { ForecastZone, Observation } from "./mockData";

export type ObservationUpdater = (
  updater: (prev: Observation[]) => Observation[]
) => void;
export type ZoneUpdater = (
  updater: (prev: ForecastZone[]) => ForecastZone[]
) => void;

export type SimulationEvent =
  | { type: "observation"; observation: Observation }
  | { type: "zone"; zoneId: string; hazardLevel: ForecastZone["hazardLevel"] };

const observationTemplates: Array<
  Pick<Observation, "type" | "summary" | "details"> & { severity: Observation["severity"] }
> = [
  {
    type: "Avalanche",
    severity: "High",
    summary: "D2 slab released on steep northerly.",
    details: "Observer noted whumpf and wide propagation.",
  },
  {
    type: "Whumpf",
    severity: "Medium",
    summary: "Audible collapse in low-angle meadow.",
    details: "Collapse propagated 15-20 m in soft slab.",
  },
  {
    type: "Wind",
    severity: "Medium",
    summary: "Wind transport increasing along ridgeline.",
    details: "Plumes visible; small pillows forming in start zones.",
  },
  {
    type: "Temp",
    severity: "Low",
    summary: "Rapid warming at mid elevations.",
    details: "Surface snow moist below 9k'.",
  },
  {
    type: "Snowfall",
    severity: "Low",
    summary: "Quick burst of snowfall over the last hour.",
    details: "1-2\" accumulation with moderate density.",
  },
];

const hazardShift = [-1, 0, 0, 0, 1];

export function startSimulation({
  setObservations,
  setZones,
  onEvent,
}: {
  setObservations: ObservationUpdater;
  setZones: ZoneUpdater;
  onEvent?: (event: SimulationEvent) => void;
}) {
  let timeoutId: number | undefined;
  let stopped = false;

  const scheduleNext = () => {
    const delay = 10000 + Math.random() * 5000;
    timeoutId = window.setTimeout(tick, delay);
  };

  const tick = () => {
    if (stopped) return;

    setZones((prevZones) => {
      if (prevZones.length === 0) return prevZones;
      const zone = prevZones[Math.floor(Math.random() * prevZones.length)];
      const shift = hazardShift[Math.floor(Math.random() * hazardShift.length)];
      const nextLevel = Math.min(5, Math.max(1, zone.hazardLevel + shift)) as ForecastZone["hazardLevel"];
      const nextConfidence = Math.max(35, Math.min(92, zone.confidenceScore + (Math.random() * 10 - 5)));
      const updatedZones = prevZones.map((item) =>
        item.id === zone.id
          ? {
              ...item,
              hazardLevel: nextLevel,
              confidenceScore: Math.round(nextConfidence),
              lastUpdatedISO: new Date().toISOString(),
            }
          : item
      );
      if (shift !== 0) {
        onEvent?.({ type: "zone", zoneId: zone.id, hazardLevel: nextLevel });
      }
      return updatedZones;
    });

    const template =
      observationTemplates[Math.floor(Math.random() * observationTemplates.length)];
    setObservations((prev) => {
      const zoneId = prev[Math.floor(Math.random() * prev.length)]?.zoneId ?? "raven-peak";
      const observation: Observation = {
        id: `obs-${Math.random().toString(36).slice(2, 8)}`,
        zoneId,
        type: template.type,
        severity: template.severity,
        timeISO: new Date().toISOString(),
        summary: template.summary,
        details: template.details,
      };
      onEvent?.({ type: "observation", observation });
      return [observation, ...prev].slice(0, 30);
    });

    scheduleNext();
  };

  timeoutId = window.setTimeout(tick, 5000);

  return () => {
    stopped = true;
    if (timeoutId) window.clearTimeout(timeoutId);
  };
}
