/**
 * KINGDOM OF MURABBA™ | SNBV™ COMMAND CORE
 * Google Maps Strategic Nodes & Telemetry Constants
 */

import type { TacticalMapNode, TacticalVectorArc } from './maps.types';

export const RIYADH_COORDINATES = { lat: 24.7136, lng: 46.6753 };
export const MUKAAB_COORDINATES = { lat: 24.7950, lng: 46.5700 };

export const STRATEGIC_MAP_NODES: TacticalMapNode[] = [
  {
    id: 'riyadh',
    name: 'RIYADH SOVEREIGN CORE',
    codeName: 'SOV-HQ-01',
    latitude: 24.7136,
    longitude: 46.6753,
    altitudeMeters: 612,
    category: 'command',
    status: 'active',
    classification: 'TOP SECRET // SOVEREIGN DIRECTIVE',
    frequency: '14.204 GHz [CRYPTO-6]',
    description: 'Central Sovereign Command Apex & High-Power Optical Uplink Hub.',
    color: '#ffd978',
    powerOutputMw: 4850,
    encryptionProtocol: 'QUANTUM-LATTICE-v9',
    signalStrengthPercent: 99.8
  },
  {
    id: 'mukaab',
    name: 'NEW MURABBA™ MUKAAB NEXUS',
    codeName: 'CUBE-PRIME-00',
    latitude: 24.7950,
    longitude: 46.5700,
    altitudeMeters: 640,
    category: 'quantum',
    status: 'active',
    classification: 'COSMIC GRADE // ARCHITECTURAL ZERO',
    frequency: '21.492 GHz [HOLOGRAPHIC MESH]',
    description: '400m cubic geometric singularity, dome projection & quantum bio-resonator.',
    color: '#dfb15b',
    powerOutputMw: 9200,
    encryptionProtocol: 'MURABBA-SINGULARITY-x1',
    signalStrengthPercent: 100.0
  },
  {
    id: 'cairo',
    name: 'CAIRO HARMONIC RELAY',
    codeName: 'RELAY-DELTA-03',
    latitude: 30.0444,
    longitude: 31.2357,
    altitudeMeters: 23,
    category: 'relay',
    status: 'active',
    classification: 'RESTRICTED // ALLIED MESH',
    frequency: '12.880 GHz [OPTICAL BRIDGING]',
    description: 'Nile Basin optical relay linking Near East sovereign sensor array.',
    color: '#eab308',
    powerOutputMw: 2400,
    encryptionProtocol: 'RSA-8192-SHARD',
    signalStrengthPercent: 96.4
  },
  {
    id: 'redsea',
    name: 'RED SEA MARITIME SENTINEL',
    codeName: 'SENTINEL-MAR-07',
    latitude: 21.4858,
    longitude: 39.1925,
    altitudeMeters: 12,
    category: 'observer',
    status: 'active',
    classification: 'SECRET // MARITIME SHIELD',
    frequency: '9.450 GHz [RADAR X-BAND]',
    description: 'Sub-sea acoustic array and coastal laser defense monitoring station.',
    color: '#06b6d4',
    powerOutputMw: 1850,
    encryptionProtocol: 'NAVAL-AES-256GCM',
    signalStrengthPercent: 94.2
  },
  {
    id: 'london',
    name: 'LONDON OBSERVER POST',
    codeName: 'OBS-THAMES-12',
    latitude: 51.5074,
    longitude: -0.1278,
    altitudeMeters: 35,
    category: 'observer',
    status: 'active',
    classification: 'CONFIDENTIAL // TRANSIT CORRIDOR',
    frequency: '18.105 GHz [NORTH SEA FEED]',
    description: 'Western Europe telemetry listener & diplomatic cryptographic bridge.',
    color: '#00f0ff',
    powerOutputMw: 1250,
    encryptionProtocol: 'CHACHA20-POLY1305',
    signalStrengthPercent: 91.7
  },
  {
    id: 'vatican',
    name: 'VATICAN ASTRONOMICAL ARRAY',
    codeName: 'ASTR-VATICAN-09',
    latitude: 41.9029,
    longitude: 12.4534,
    altitudeMeters: 75,
    category: 'telemetry',
    status: 'warning',
    classification: 'COSMIC ARCHIVE // UNCLASSIFIED ACCESS',
    frequency: '29.740 GHz [DEEP SPACE SPECTRA]',
    description: 'Acoustic and spectral telescope array tracking celestial energetic anomalies.',
    color: '#f59e0b',
    powerOutputMw: 3100,
    encryptionProtocol: 'ARCHIVUM-SECRETUM-v3',
    signalStrengthPercent: 88.3
  },
  {
    id: 'dubai',
    name: 'GULF QUANTUM EXCHANGE',
    codeName: 'QUANT-DUB-05',
    latitude: 25.2048,
    longitude: 55.2708,
    altitudeMeters: 15,
    category: 'quantum',
    status: 'active',
    classification: 'COMMERCIAL // HIGH SPEED SECURE',
    frequency: '40.120 GHz [TERABIT BACKBONE]',
    description: 'Eastern Arabian financial telemetry & high-speed packet router.',
    color: '#10b981',
    powerOutputMw: 4100,
    encryptionProtocol: 'QUANTUM-BB84-EMULATED',
    signalStrengthPercent: 98.9
  }
];

export const STRATEGIC_MAP_VECTORS: TacticalVectorArc[] = [
  {
    id: 'vec-mukaab-riyadh',
    fromNodeId: 'mukaab',
    toNodeId: 'riyadh',
    fromCoords: { lat: 24.7950, lng: 46.5700 },
    toCoords: { lat: 24.7136, lng: 46.6753 },
    color: '#dfb15b',
    label: 'MUKAAB-COMMAND DIRECT FIBER',
    bandwidthGbps: 800,
    latencyMs: 0.18
  },
  {
    id: 'vec-riyadh-cairo',
    fromNodeId: 'riyadh',
    toNodeId: 'cairo',
    fromCoords: { lat: 24.7136, lng: 46.6753 },
    toCoords: { lat: 30.0444, lng: 31.2357 },
    color: '#ffd978',
    label: 'TRANS-ARABIAN MICROWAVE',
    bandwidthGbps: 120,
    latencyMs: 14.2
  },
  {
    id: 'vec-riyadh-redsea',
    fromNodeId: 'riyadh',
    toNodeId: 'redsea',
    fromCoords: { lat: 24.7136, lng: 46.6753 },
    toCoords: { lat: 21.4858, lng: 39.1925 },
    color: '#06b6d4',
    label: 'HEJAZ OPTICAL TRUNK',
    bandwidthGbps: 240,
    latencyMs: 6.8
  },
  {
    id: 'vec-riyadh-dubai',
    fromNodeId: 'riyadh',
    toNodeId: 'dubai',
    fromCoords: { lat: 24.7136, lng: 46.6753 },
    toCoords: { lat: 25.2048, lng: 55.2708 },
    color: '#10b981',
    label: 'GULF QUANTUM TRUNK',
    bandwidthGbps: 400,
    latencyMs: 4.5
  },
  {
    id: 'vec-cairo-vatican',
    fromNodeId: 'cairo',
    toNodeId: 'vatican',
    fromCoords: { lat: 30.0444, lng: 31.2357 },
    toCoords: { lat: 41.9029, lng: 12.4534 },
    color: '#f59e0b',
    label: 'MEDITERRANEAN CABLE LINK',
    bandwidthGbps: 85,
    latencyMs: 22.4
  },
  {
    id: 'vec-vatican-london',
    fromNodeId: 'vatican',
    toNodeId: 'london',
    fromCoords: { lat: 41.9029, lng: 12.4534 },
    toCoords: { lat: 51.5074, lng: -0.1278 },
    color: '#00f0ff',
    label: 'EUROPEAN BACKBONE',
    bandwidthGbps: 150,
    latencyMs: 18.1
  }
];
