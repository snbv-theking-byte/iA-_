/**
 * KINGDOM OF MURABBA™ | SNBV™ COMMAND CORE & BIOSCIENCE DIVISION
 * Comprehensive Domain Definitions & Types
 */

export const PHI = 1.61803398875;

export type ModuleView = 
  | 'COMMAND_CORE'
  | 'MUKAAB_NEXUS'
  | 'STRATEGIC_RADAR'
  | 'BIOSCIENCE_STRUCTURES'
  | 'CHEMICAL_DEFENSE'
  | 'TOTEMIC_NETWORK'
  | 'TELEMETRY_LOGS';

export type TotemId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type SystemStatus = 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' | 'ISOLATED' | 'BIO_SCAN';

export type EventSeverity = 'INFO' | 'WARN' | 'CRITICAL' | 'SOVEREIGN' | 'BIO';

export type ThemePreset = 'sovereign-gold' | 'cyber-cyan' | 'royal-crimson' | 'night-ops';

export interface TelemetryEvent {
  id: string;
  timestamp: number;
  severity: EventSeverity;
  source: string;
  message: string;
  payload?: Record<string, unknown>;
}

export interface TotemNode {
  id: TotemId;
  name: string;
  arabicName: string;
  designation: string;
  frequencyHz: number;
  isActive: boolean;
  pulseIntensity: number;
  coordinates: [number, number, number]; // Vector3 for Three.js
  symbolicAttribute: string;
  bioResonanceBand: string;
}

export interface RadarTarget {
  id: string;
  bearingDeg: number;
  distancePct: number; // 0 to 1
  label: string;
  classification: 'SOVEREIGN' | 'ALLIED' | 'UNIDENTIFIED' | 'HOSTILE' | 'BIO_ENTITY';
  elevationAngle: number;
  signalStrength: number;
  notes: string;
}

export interface SystemMetrics {
  uptimeMs: number;
  pulseCount: number;
  eventCount: number;
  activeNodes: number;
  resonanceRatio: number;
  systemStatus: SystemStatus;
  bioThreatLevel: 'NOMINAL' | 'ELEVATED' | 'CONTAINED' | 'SOVEREIGN_IMMUNITY';
  totalCompoundsScanned: number;
}

export interface UserPreferences {
  theme: ThemePreset;
  audioEnabled: boolean;
  audioVolume: number; // 0 to 1
  crtFilterActive: boolean;
  reducedMotion: boolean;
  highDpiRadar: boolean;
  radarSweepSpeed: number; // 1x, 2x, etc.
}

// ================= BIOSCIENCE TYPES =================
export interface AlphaFoldPredictionMeta {
  entryId: string;
  gene: string;
  uniprotAccession: string;
  uniprotId: string;
  uniprotDescription: string;
  taxId: number;
  organismScientificName: string;
  uniprotStart: number;
  uniprotEnd: number;
  uniprotSequence: string;
  cifUrl: string;
  bcifUrl: string;
  pdbUrl: string;
  paeImageUrl?: string;
  paeDocUrl?: string;
  globalPlddt?: number;
}

export interface ProteinFeature {
  type: string;
  description: string;
  begin: number;
  end: number;
}

export interface ChemicalCompound {
  cid: number;
  name: string;
  iupacName: string;
  molecularFormula: string;
  molecularWeight: number;
  canonicalSmiles: string;
  xLogP?: number;
  hBondDonorCount?: number;
  hBondAcceptorCount?: number;
  rotatableBondCount?: number;
  topologicalPolarSurfaceArea?: number;
  classification: 'ANTIDOTE' | 'THERAPEUTIC' | 'NEUROTRANSMITTER' | 'PROTOTYPE' | 'DEFENSE_LIGAND';
  description: string;
  lipinskiCompliant: boolean;
}
