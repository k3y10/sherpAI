"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  forecastZones,
  observations as initialObservations,
  type ForecastZone,
  type Observation,
} from "@/lib/mockData";
import { startSimulation } from "@/lib/simulateUpdates";
import { MapCanvas, type MapLayer } from "@/components/MapCanvas";
import { MapLegend } from "@/components/MapLegend";
import { RightPanel } from "@/components/RightPanel";
import { SherpAIWidget } from "@/components/SherpAIWidget";
import { SherpAIAvatar } from "@/components/SherpAIAvatar";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  Layers,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  LocateFixed,
} from "lucide-react";

const layers: MapLayer[] = ["Hazard", "Avalanches", "Wind", "Snow", "Temp", "Problems"];

const hazardWord: Record<ForecastZone["hazardLevel"], string> = {
  1: "Low",
  2: "Moderate",
  3: "Considerable",
  4: "High",
  5: "Extreme",
};

export default function Home() {
  const [zones, setZones] = useState<ForecastZone[]>(forecastZones);
  const [observations, setObservations] = useState<Observation[]>(initialObservations);
  const [selectedZoneId, setSelectedZoneId] = useState(forecastZones[0]?.id ?? "");
  const [activeLayer, setActiveLayer] = useState<MapLayer>("Hazard");
  const [zoom, setZoom] = useState(1);
  const [simulationOn, setSimulationOn] = useState(false);
  const [focusedObservationType, setFocusedObservationType] = useState<Observation["type"]>();
  const [highlightedZones, setHighlightedZones] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [panelTab, setPanelTab] = useState("overview");
  const [avatarPulse, setAvatarPulse] = useState(false);

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId);
  const latestObservation = observations[0];

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (value: "light" | "dark" | "system") => {
      const resolved = value === "system" ? (media.matches ? "dark" : "light") : value;
      root.classList.toggle("dark", resolved === "dark");
    };
    applyTheme(theme);
    if (theme === "system") {
      const handleChange = () => applyTheme("system");
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }
  }, [theme]);

  useEffect(() => {
    if (!simulationOn) return;
    return startSimulation({
      setObservations,
      setZones,
      onEvent: (event) => {
        if (event.type === "observation") {
          if (event.observation.type === "Avalanche") {
            setFocusedObservationType("Avalanche");
            setAvatarPulse(true);
            window.setTimeout(() => setAvatarPulse(false), 1200);
          }
        }
        if (event.type === "zone") {
          setAvatarPulse(true);
          window.setTimeout(() => setAvatarPulse(false), 1200);
        }
      },
    });
  }, [simulationOn]);

  const zoneMatches = useMemo(() => {
    if (!searchValue) return zones;
    return zones.filter((zone) =>
      zone.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, zones]);

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setHighlightedZones([]);
  };

  const handleSelectByName = (zoneName: string) => {
    const match = zones.find((zone) =>
      zone.name.toLowerCase().includes(zoneName.toLowerCase())
    );
    if (match) handleSelectZone(match.id);
  };

  const handleToggleAvalanches = () => {
    setActiveLayer("Avalanches");
    setPanelTab("observations");
  };

  const handleHighlightHighest = () => {
    const maxHazard = Math.max(...zones.map((zone) => zone.hazardLevel));
    setHighlightedZones(
      zones.filter((zone) => zone.hazardLevel === maxHazard).map((zone) => zone.id)
    );
  };

  return (
    <div className="min-h-screen bg-topo text-foreground">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[var(--panel)] px-4 py-2 text-lg font-semibold">
              SherpAI <span className="text-xs uppercase tracking-[0.3em] text-muted">AvyTS</span>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-xs text-muted lg:flex">
              <Activity className="h-4 w-4" /> Live avalanche intelligence
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search zones"
                className="w-48 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm"
              />
              {searchValue && (
                <div className="absolute left-0 mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-2 shadow-xl">
                  {zoneMatches.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => handleSelectZone(zone.id)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-[var(--panel-muted)]"
                    >
                      <span>{zone.name}</span>
                      <span className="text-xs text-muted">{hazardWord[zone.hazardLevel]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveLayer((prev) => layers[(layers.indexOf(prev) + 1) % layers.length])}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-xs font-semibold"
            >
              <Layers className="h-4 w-4" /> {activeLayer}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-xs font-semibold">
              <span className="text-muted">Simulation</span>
              <Switch checked={simulationOn} onCheckedChange={setSimulationOn} />
            </div>
            <button
              onClick={() =>
                setTheme((prev) =>
                  prev === "system" ? "dark" : prev === "dark" ? "light" : "system"
                )
              }
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-xs font-semibold"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "system" ? "System" : theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col gap-4">
          <div className="card overflow-hidden p-0">
            <Image
              src="/terrasatch-banner.png"
              alt="TerraSatch ridgeline banner"
              width={1319}
              height={362}
              sizes="100vw"
              priority
              className="h-36 w-full object-cover sm:h-40"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[var(--panel)] px-4 py-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/terrasatch-logo.png"
                  alt="TerraSatch logo"
                  width={40}
                  height={40}
                  sizes="40px"
                  className="h-10 w-10 rounded-xl bg-white/90 p-1"
                />
                <div>
                  <p className="text-sm font-semibold">TerraSatch</p>
                  <p className="text-xs text-muted">SherpAI AvyTS intelligence suite</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/transparent-logo.png"
                  alt="TerraSatch mark"
                  width={32}
                  height={32}
                  sizes="32px"
                  className="h-8 w-8"
                />
                <Image
                  src="/avyrisk.png"
                  alt="AvyRisk"
                  width={1536}
                  height={813}
                  sizes="140px"
                  className="h-8 w-auto max-w-[140px] object-contain"
                />
              </div>
            </div>
          </div>
          <div className="card relative h-[520px] overflow-hidden p-4">
            <MapCanvas
              zones={zones}
              selectedZoneId={selectedZoneId}
              highlightedZoneIds={highlightedZones}
              zoom={zoom}
              onSelect={handleSelectZone}
              activeLayer={activeLayer}
            />
            <div className="absolute left-6 top-6 flex flex-col gap-3">
              <button
                onClick={() => setZoom((prev) => Math.min(1.4, prev + 0.1))}
                className="rounded-full bg-[var(--panel)] p-2 shadow"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(0.8, prev - 0.1))}
                className="rounded-full bg-[var(--panel)] p-2 shadow"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="rounded-full bg-[var(--panel)] p-2 shadow"
              >
                <LocateFixed className="h-4 w-4" />
              </button>
            </div>
            <MapLegend
              activeLayer={activeLayer}
              layers={layers}
              onSelectLayer={(layer) => setActiveLayer(layer as MapLayer)}
              className="absolute right-6 top-6 w-56"
            />
          </div>
          <SherpAIAvatar zone={selectedZone} activeObservation={latestObservation} pulse={avatarPulse} />
        </section>
        <section className="hidden flex-col gap-6 lg:flex">
          <RightPanel
            zone={selectedZone}
            observations={observations}
            focusedObservationType={focusedObservationType}
            activeTab={panelTab}
            onTabChange={setPanelTab}
          />
        </section>
      </main>

      <div className="fixed bottom-6 right-6 hidden w-[360px] lg:block">
        <SherpAIWidget
          zone={selectedZone}
          observations={observations}
          onSelectZone={handleSelectByName}
          onToggleAvalanches={handleToggleAvalanches}
          onHighlightHighest={handleHighlightHighest}
          onFocusObservationType={setFocusedObservationType}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 block rounded-t-3xl border border-[var(--border)] bg-[var(--background)]/90 p-4 backdrop-blur lg:hidden">
        <RightPanel
          zone={selectedZone}
          observations={observations}
          focusedObservationType={focusedObservationType}
          activeTab={panelTab}
          onTabChange={setPanelTab}
        />
        <div className="mt-4">
          <SherpAIWidget
            zone={selectedZone}
            observations={observations}
            onSelectZone={handleSelectByName}
            onToggleAvalanches={handleToggleAvalanches}
            onHighlightHighest={handleHighlightHighest}
            onFocusObservationType={setFocusedObservationType}
          />
        </div>
      </div>
    </div>
  );
}
