# SherpAI | AvyTS

A premium demo experience for avalanche zone awareness, live observations, and SherpAI companion guidance.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo behaviors

- Click any zone polygon to update the Zone Spotlight, avatar state, and intelligence panel.
- Use the layer toggle or legend chips to switch map overlays (Hazard, Avalanches, Wind, Snow, Temp, Problems).
- Turn on **Simulation** to inject new observations and occasionally shift hazard levels/confidence.
- SherpAI chat can:
  - “show avalanches” (toggles avalanche layer + focuses the observations list)
  - “highest hazard” (highlights the highest hazard zones)
  - “select [zone name]” (selects a zone by name)

## How to extend with real data

- Replace `src/lib/mockData.ts` with live API-backed sources.
- Swap `startSimulation` in `src/lib/simulateUpdates.ts` with websocket or polling updates.
- Replace the SVG map polygons in `MapCanvas.tsx` with geojson-derived shapes.
