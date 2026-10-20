import type { WorldNode, GlobeArcData } from "./world.types";

export const GLOBE_RADIUS = 2.0;

export const WORLD_NODES: WorldNode[] = [
  {
    id: "riyadh",
    name: "RIYADH CORE",
    latitude: 24.7136,
    longitude: 46.6753,
    color: "#ffd978",
    category: "command",
    status: "active",
    classification: "Laser Core",
    description: "Primary sovereign command node",
  },
  {
    id: "cairo",
    name: "CAIRO RELAY",
    latitude: 30.0444,
    longitude: 31.2357,
    color: "#dfb15b",
    category: "relay",
    status: "active",
    classification: "Resonance Array",
    description: "Regional relay and signal mesh",
  },
  {
    id: "london",
    name: "LONDON OBSERVER",
    latitude: 51.5074,
    longitude: -0.1278,
    color: "#00f0ff",
    category: "observer",
    status: "active",
    classification: "Naval Telemetry",
    description: "Maritime and orbital observation layer",
  },
  {
    id: "vatican",
    name: "VATICAN ARRAY",
    latitude: 41.9029,
    longitude: 12.4534,
    color: "#ffe600",
    category: "telemetry",
    status: "warning",
    classification: "Observer Node",
    description: "Deep acoustic observatory",
  },
];

export const WORLD_ARCS: GlobeArcData[] = [
  {
    id: "arc-riyadh-cairo",
    startLat: 24.7136,
    startLng: 46.6753,
    endLat: 30.0444,
    endLng: 31.2357,
    color: "#ffd978",
    label: "Sovereign Uplink Alpha",
  },
  {
    id: "arc-riyadh-london",
    startLat: 24.7136,
    startLng: 46.6753,
    endLat: 51.5074,
    endLng: -0.1278,
    color: "#00f0ff",
    label: "Naval Telemetry Link",
  },
  {
    id: "arc-riyadh-vatican",
    startLat: 24.7136,
    startLng: 46.6753,
    endLat: 41.9029,
    endLng: 12.4534,
    color: "#ffe600",
    label: "Acoustic Resonance Mesh",
  },
];
