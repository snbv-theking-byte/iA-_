/**
 * KINGDOM OF MURABBA™ | SNBV™ COMMAND CORE
 * Google Maps Platform Tactical Theater Types
 */

export type TacticalMapTheme = 'satellite' | 'hybrid' | 'roadmap' | 'terrain';

export interface TacticalMapNode {
  id: string;
  name: string;
  codeName: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  category: 'command' | 'relay' | 'observer' | 'telemetry' | 'quantum';
  status: 'active' | 'warning' | 'critical';
  classification: string;
  frequency: string;
  description: string;
  color: string;
  powerOutputMw: number;
  encryptionProtocol: string;
  signalStrengthPercent: number;
}

export interface TacticalVectorArc {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromCoords: { lat: number; lng: number };
  toCoords: { lat: number; lng: number };
  color: string;
  label: string;
  bandwidthGbps: number;
  latencyMs: number;
}
