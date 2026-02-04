export type HazardLevel = 1 | 2 | 3 | 4 | 5;

export type ForecastProblem = {
  type: "Persistent Slab" | "Wind Slab" | "Storm Slab" | "Wet";
  likelihood: "Low" | "Medium" | "High";
  size: "Small" | "Medium" | "Large";
  aspects: Array<"N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW">;
  elevations: Array<"Below Treeline" | "Near Treeline" | "Above Treeline">;
};

export type ForecastZone = {
  id: string;
  name: string;
  region: string;
  hazardLevel: HazardLevel;
  confidenceScore: number;
  polygon: Array<{ x: number; y: number }>;
  problems: ForecastProblem[];
  travelAdvice: string[];
  lastUpdatedISO: string;
};

export type Observation = {
  id: string;
  zoneId: string;
  type:
    | "Avalanche"
    | "Whumpf"
    | "Cracking"
    | "Wind"
    | "Snowfall"
    | "Temp"
    | "Pit";
  severity: "Low" | "Medium" | "High";
  timeISO: string;
  summary: string;
  details: string;
};

export const forecastZones: ForecastZone[] = [
  {
    id: "raven-peak",
    name: "Raven Peak",
    region: "North Summit",
    hazardLevel: 3,
    confidenceScore: 62,
    polygon: [
      { x: 120, y: 120 },
      { x: 340, y: 80 },
      { x: 420, y: 210 },
      { x: 260, y: 280 },
      { x: 140, y: 220 },
    ],
    problems: [
      {
        type: "Persistent Slab",
        likelihood: "Medium",
        size: "Large",
        aspects: ["N", "NE", "E"],
        elevations: ["Near Treeline", "Above Treeline"],
      },
      {
        type: "Wind Slab",
        likelihood: "High",
        size: "Medium",
        aspects: ["NW", "N"],
        elevations: ["Above Treeline"],
      },
    ],
    travelAdvice: [
      "Stay on low-angle ridgelines and avoid convex rolls.",
      "Give wind-loaded bowls extra spacing.",
    ],
    lastUpdatedISO: "2026-02-03T19:30:00Z",
  },
  {
    id: "silver-pass",
    name: "Silver Pass",
    region: "Central Basin",
    hazardLevel: 2,
    confidenceScore: 78,
    polygon: [
      { x: 430, y: 120 },
      { x: 620, y: 110 },
      { x: 700, y: 240 },
      { x: 600, y: 360 },
      { x: 420, y: 300 },
    ],
    problems: [
      {
        type: "Storm Slab",
        likelihood: "Medium",
        size: "Medium",
        aspects: ["W", "SW"],
        elevations: ["Near Treeline", "Above Treeline"],
      },
    ],
    travelAdvice: [
      "Watch for cracking near small test slopes.",
      "Prefer wind-sheltered trees below 30°.",
    ],
    lastUpdatedISO: "2026-02-03T21:10:00Z",
  },
  {
    id: "glacier-gulch",
    name: "Glacier Gulch",
    region: "South Range",
    hazardLevel: 4,
    confidenceScore: 48,
    polygon: [
      { x: 210, y: 350 },
      { x: 420, y: 340 },
      { x: 520, y: 480 },
      { x: 360, y: 610 },
      { x: 190, y: 520 },
    ],
    problems: [
      {
        type: "Persistent Slab",
        likelihood: "High",
        size: "Large",
        aspects: ["N", "NE", "E"],
        elevations: ["Near Treeline", "Above Treeline"],
      },
      {
        type: "Wet",
        likelihood: "Medium",
        size: "Medium",
        aspects: ["S", "SE", "SW"],
        elevations: ["Below Treeline"],
      },
    ],
    travelAdvice: [
      "Avoid steep glacial runouts and terrain traps.",
      "Consider conservative objectives or postpone travel.",
    ],
    lastUpdatedISO: "2026-02-03T22:05:00Z",
  },
  {
    id: "echo-ridge",
    name: "Echo Ridge",
    region: "East Spur",
    hazardLevel: 1,
    confidenceScore: 86,
    polygon: [
      { x: 670, y: 320 },
      { x: 860, y: 290 },
      { x: 920, y: 420 },
      { x: 810, y: 560 },
      { x: 640, y: 470 },
    ],
    problems: [
      {
        type: "Wind Slab",
        likelihood: "Low",
        size: "Small",
        aspects: ["N", "NE"],
        elevations: ["Above Treeline"],
      },
    ],
    travelAdvice: [
      "Enjoy low-angle glades; monitor for isolated wind slabs.",
      "Keep an eye on upper elevation rollovers.",
    ],
    lastUpdatedISO: "2026-02-03T20:45:00Z",
  },
  {
    id: "midnight-bowl",
    name: "Midnight Bowl",
    region: "West Ridge",
    hazardLevel: 3,
    confidenceScore: 58,
    polygon: [
      { x: 740, y: 80 },
      { x: 930, y: 120 },
      { x: 980, y: 260 },
      { x: 840, y: 260 },
      { x: 710, y: 170 },
    ],
    problems: [
      {
        type: "Storm Slab",
        likelihood: "High",
        size: "Medium",
        aspects: ["W", "NW"],
        elevations: ["Near Treeline", "Above Treeline"],
      },
    ],
    travelAdvice: [
      "Expect touchy slabs on cross-loaded features.",
      "Use quick hand pits to check bonding on leeward slopes.",
    ],
    lastUpdatedISO: "2026-02-03T18:20:00Z",
  },
];

export const observations: Observation[] = [
  {
    id: "obs-001",
    zoneId: "raven-peak",
    type: "Wind",
    severity: "Medium",
    timeISO: "2026-02-03T17:45:00Z",
    summary: "Ridgetop winds loading north aspects.",
    details: "Gusts 25-30 mph with active transport above 10k'.",
  },
  {
    id: "obs-002",
    zoneId: "silver-pass",
    type: "Snowfall",
    severity: "Low",
    timeISO: "2026-02-03T18:10:00Z",
    summary: "2-3 inches new snow overnight.",
    details: "Light density snow with minimal wind effect.",
  },
  {
    id: "obs-003",
    zoneId: "glacier-gulch",
    type: "Avalanche",
    severity: "High",
    timeISO: "2026-02-03T19:05:00Z",
    summary: "D2.5 persistent slab on NE face.",
    details: "Crown 2-3 ft deep, triggered remotely from ridge.",
  },
  {
    id: "obs-004",
    zoneId: "echo-ridge",
    type: "Pit",
    severity: "Low",
    timeISO: "2026-02-03T20:25:00Z",
    summary: "ECTP 19 down 40 cm.",
    details: "New snow bonding well over older layers.",
  },
  {
    id: "obs-005",
    zoneId: "midnight-bowl",
    type: "Cracking",
    severity: "Medium",
    timeISO: "2026-02-03T21:15:00Z",
    summary: "Shooting cracks on wind-loaded rollovers.",
    details: "Cracks up to 4 m on SE aspect just below ridge.",
  },
];
