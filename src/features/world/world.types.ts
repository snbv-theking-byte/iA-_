export interface WorldNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  category: "command" | "observer" | "relay" | "telemetry";
  status: "active" | "warning" | "critical";
  classification: string;
  description?: string;
}

export interface GlobeArcData {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  label: string;
}
