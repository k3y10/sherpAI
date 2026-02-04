"use client";

import type { ForecastZone, Observation } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObservationsFeed } from "@/components/ObservationsFeed";

export function RightPanel({
  zone,
  observations,
  focusedObservationType,
  activeTab = "overview",
  onTabChange,
}: {
  zone?: ForecastZone;
  observations: Observation[];
  focusedObservationType?: Observation["type"];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}) {
  return (
    <div className="card h-full w-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Zone Spotlight</p>
          <h2 className="text-2xl font-semibold">
            {zone ? zone.name : "Select a zone"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {zone ? `${zone.region} • Updated ${new Date(zone.lastUpdatedISO).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}` : "Pick a polygon to see detailed intelligence."}
          </p>
        </div>
        {zone && (
          <div className="rounded-2xl bg-[var(--panel-muted)] px-4 py-3 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Hazard</p>
            <p className="text-xl font-semibold">{zone.hazardLevel}</p>
          </div>
        )}
      </div>
      <Tabs value={activeTab} onValueChange={onTabChange} className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Confidence</p>
              <p className="mt-3 text-3xl font-semibold">
                {zone ? `${zone.confidenceScore}%` : "--"}
              </p>
              <p className="mt-2 text-xs text-muted">
                AI consensus and observer density.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Primary Problems</p>
              <ul className="mt-3 space-y-2 text-sm">
                {zone?.problems.map((problem) => (
                  <li key={problem.type} className="flex items-center justify-between">
                    <span>{problem.type}</span>
                    <span className="text-xs text-muted">{problem.likelihood}</span>
                  </li>
                )) ?? <li className="text-muted">No zone selected.</li>}
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="observations">
          <ObservationsFeed observations={observations} focusedType={focusedObservationType} />
        </TabsContent>
        <TabsContent value="forecast">
          <div className="space-y-4">
            {zone?.problems.map((problem, index) => (
              <div
                key={`${problem.type}-${index}`}
                className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{problem.type}</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted">{problem.size}</span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  Likelihood {problem.likelihood} • Aspects {problem.aspects.join(", ")} • {problem.elevations.join(", ")}
                </p>
              </div>
            )) ?? <p className="text-sm text-muted">Select a zone to view forecast problems.</p>}
          </div>
        </TabsContent>
        <TabsContent value="guidance">
          <div className="space-y-3">
            {zone?.travelAdvice.map((advice) => (
              <div key={advice} className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-sm">
                {advice}
              </div>
            )) ?? <p className="text-sm text-muted">Select a zone for travel guidance.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
