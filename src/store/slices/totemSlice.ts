import type { StateCreator } from "zustand";
import type { AppState, TotemSlice } from "../store.types";
import type { TotemId, TotemNode } from "../../types";
import { AudioManager } from "../../systems/AudioManager";
import { EventBus } from "../../systems/EventBus";

const INITIAL_TOTEMS: Record<TotemId, TotemNode> = {
  A: {
    id: 'A',
    name: 'Al-Bayan',
    arabicName: 'البيان',
    designation: 'Totem of Primordial Order & Bio-Genomic Template',
    frequencyHz: 432,
    isActive: true,
    pulseIntensity: 1.0,
    coordinates: [0, 1.618, 0],
    symbolicAttribute: 'Foundational Harmony & DNA Repair Resonance',
    bioResonanceBand: 'Genomic Integrity Harmonic (432 Hz)',
  },
  B: {
    id: 'B',
    name: 'Al-Mizan',
    arabicName: 'الميزان',
    designation: 'Totem of Absolute Balance & Homeostasis',
    frequencyHz: 528,
    isActive: false,
    pulseIntensity: 0.0,
    coordinates: [1.618, 0, 0],
    symbolicAttribute: 'Structural Equilibrium & Cellular Regeneration',
    bioResonanceBand: 'Cellular Homeostasis Axis (528 Hz)',
  },
  C: {
    id: 'C',
    name: 'Al-Nur',
    arabicName: 'النور',
    designation: 'Totem of High Telemetry & Molecular Luminescence',
    frequencyHz: 639,
    isActive: true,
    pulseIntensity: 0.85,
    coordinates: [0, 0, 1.618],
    symbolicAttribute: 'Spectral Radiance & Receptor Binding Conformation',
    bioResonanceBand: 'Intercellular Signaling Matrix (639 Hz)',
  },
  D: {
    id: 'D',
    name: 'Al-Hisn',
    arabicName: 'الحصن',
    designation: 'Totem of Defensive Shielding & Pathogen Neutralization',
    frequencyHz: 741,
    isActive: false,
    pulseIntensity: 0.0,
    coordinates: [-1.618, 0, 0],
    symbolicAttribute: 'Bastion Security & Immunological Countermeasures',
    bioResonanceBand: 'Antiviral / Antigen Defense Vector (741 Hz)',
  },
  E: {
    id: 'E',
    name: 'Al-Fath',
    arabicName: 'الفتح',
    designation: 'Totem of Sovereign Expansion & Therapeutic Vectoring',
    frequencyHz: 852,
    isActive: false,
    pulseIntensity: 0.0,
    coordinates: [0, -1.618, 0],
    symbolicAttribute: 'Strategic Vector & Targeted Drug Delivery Orbit',
    bioResonanceBand: 'Bio-Molecular Transport Channel (852 Hz)',
  },
  F: {
    id: 'F',
    name: 'Al-Hikma',
    arabicName: 'الحكمة',
    designation: 'Totem of Deep Computation & AlphaFold Structural Insight',
    frequencyHz: 963,
    isActive: true,
    pulseIntensity: 0.92,
    coordinates: [0, 0, -1.618],
    symbolicAttribute: 'Cognitive Matrix & De Novo Protein Design',
    bioResonanceBand: 'Neural & AlphaFold Deep Compute (963 Hz)',
  },
  G: {
    id: 'G',
    name: 'Al-Mukaab',
    arabicName: 'المكعب',
    designation: 'Sovereign Nexus Totem & Macromolecular Crystal Lattice',
    frequencyHz: 1074,
    isActive: true,
    pulseIntensity: 1.618,
    coordinates: [1, 1, 1],
    symbolicAttribute: 'Cubic Convergence & Sovereign Golden Ratio Sanctuary',
    bioResonanceBand: 'Universal Murabba Convergence (1074 Hz)',
  },
};

export const createTotemSlice: StateCreator<AppState, [], [], TotemSlice> = (set, get) => ({
  totems: INITIAL_TOTEMS,
  selectedTotemId: 'G',

  toggleTotem: (id: TotemId) => {
    const current = get().totems[id];
    const updatedActive = !current.isActive;

    AudioManager.playTotemTone(current.frequencyHz);

    set((state) => {
      const updatedTotems = {
        ...state.totems,
        [id]: {
          ...current,
          isActive: updatedActive,
          pulseIntensity: updatedActive ? 1.0 : 0.0,
        },
      };

      const activeCount = Object.values(updatedTotems).filter((t) => t.isActive).length;
      const status = activeCount >= 4 ? 'OPTIMAL' : activeCount >= 2 ? 'DEGRADED' : 'CRITICAL';

      EventBus.emit('totem:toggled', { id, active: updatedActive });

      return {
        totems: updatedTotems,
        selectedTotemId: id,
        metrics: {
          ...state.metrics,
          activeNodes: activeCount,
          systemStatus: status,
        },
      };
    });

    get().addLog(
      'SYSTEM',
      `Totem ${id} [${current.name}] ${updatedActive ? 'RESONATING' : 'DORMANT'} at ${current.frequencyHz} Hz`,
      updatedActive ? 'sovereign' : 'warning'
    );
  },
});
