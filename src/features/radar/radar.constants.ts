import type { RadarNode } from "./radar.types";

export const GOLDEN_RATIO_PHI = 1.61803398875;

export const RADAR_NODES: RadarNode[] = [
  {
    id: "riyadh",
    name: "RIYADH CORE",
    x: 0.58,
    y: 0.52,
    color: "#ffd978",
    status: "active",
    classification: "Laser Core",
    threatLevel: "ALPHA",
    coordinates: "24.7136° N, 46.6753° E",
    description: "Sovereign Command Core node operating at nominal frequency."
  },
  {
    id: "cairo",
    name: "CAIRO RELAY",
    x: 0.52,
    y: 0.49,
    color: "#dfb15b",
    status: "active",
    classification: "Resonance Array",
    threatLevel: "BRAVO",
    coordinates: "30.0444° N, 31.2357° E",
    description: "Telemetry repeater for North African sovereign sector."
  },
  {
    id: "london",
    name: "LONDON NODE",
    x: 0.46,
    y: 0.32,
    color: "#00f0ff",
    status: "active",
    classification: "Naval Telemetry",
    threatLevel: "CHARLIE",
    coordinates: "51.5074° N, 0.1278° W",
    description: "Maritime sub-surface acoustic monitoring array."
  },
  {
    id: "vatican",
    name: "VATICAN OBSERVER",
    x: 0.49,
    y: 0.38,
    color: "#ffe600",
    status: "warning",
    classification: "Observer",
    threatLevel: "DELTA",
    coordinates: "41.9029° N, 12.4534° E",
    description: "Intermittent frequency fluctuations detected. Audit required."
  },
  {
    id: "murabba-prime",
    name: "MURABBA PRIME",
    x: 0.50,
    y: 0.50,
    color: "#ff3366",
    status: "active",
    classification: "Mukaab Central",
    threatLevel: "ALPHA",
    coordinates: "24.7116° N, 46.6744° E",
    description: "Central Nexus Node. Golden Ratio sync locked."
  },
  {
    id: "bio-sanctuary",
    name: "AL-MURABBA BIO-HUB",
    x: 0.65,
    y: 0.42,
    color: "#00f0ff",
    status: "active",
    classification: "AlphaFold Synthesis",
    threatLevel: "ALPHA",
    coordinates: "24.7500° N, 46.7100° E",
    description: "High-throughput macromolecular screening & pathogen defense station."
  },
  {
    id: "gulf-sentinel",
    name: "GULF SENTINEL",
    x: 0.63,
    y: 0.58,
    color: "#dfb15b",
    status: "active",
    classification: "Orbital Uplink",
    threatLevel: "BRAVO",
    coordinates: "26.2285° N, 50.5860° E",
    description: "Perimeter early warning radar and satellite telemetry antenna."
  }
];
