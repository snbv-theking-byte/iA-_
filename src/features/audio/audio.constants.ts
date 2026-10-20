import type { AudioEngineConfig } from "./audio.types";

export const DEFAULT_AUDIO_CONFIG: AudioEngineConfig = {
  masterVolume: 0.7,
  enabled: true,
};

export const SOLFEGGIO_FREQUENCIES = {
  AL_BAYAN: 432,   // Node A - Primordial Order
  AL_MIZAN: 528,   // Node B - Transformation / Balance
  AL_NUR: 639,     // Node C - High Telemetry / Connection
  AL_HISN: 741,    // Node D - Defense & Intuition
  AL_FATH: 852,    // Node E - Sovereign Expansion
  AL_HIKMA: 963,   // Node F - Pure Computation / Consciousness
  AL_MUKAAB: 1074, // Node G - Sovereign Nexus Convergence
} as const;

export const SOUND_FREQUENCIES = {
  CLICK_START: 800,
  CLICK_END: 200,
  BLIP_START: 1200,
  BLIP_END: 2400,
  CONFIRM_LOW: 523.25, // C5
  CONFIRM_HIGH: 659.25, // E5
  WARNING_HIGH: 440,
  WARNING_LOW: 330,
  CRITICAL_HIGH: 880,
  CRITICAL_LOW: 440,
  PULSE_SUB: 65.41,
  PULSE_SUB_END: 32.7,
} as const;
