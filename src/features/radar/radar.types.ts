export type NodeStatus = "active" | "warning" | "critical" | "offline";

export interface RadarNode {
  id: string;
  name: string;
  x: number; // Normalized coordinate [0..1]
  y: number; // Normalized coordinate [0..1]
  color: string;
  status: NodeStatus;
  classification: string;
  threatLevel: "ALPHA" | "BRAVO" | "CHARLIE" | "DELTA";
  coordinates: string; // e.g. "24.7136° N, 46.6753° E"
  description?: string;
  lastPingMs?: number;
}

export interface HoveredNodeInfo {
  node: RadarNode;
  screenX: number;
  screenY: number;
}
