import type { StateCreator } from "zustand";
import type { AppState, BioSlice } from "../store.types";
import type { AlphaFoldPredictionMeta, ChemicalCompound } from "../../types";
import { AudioManager } from "../../systems/AudioManager";

export const createBioSlice: StateCreator<AppState, [], [], BioSlice> = (set, get) => ({
  selectedProteinAccession: 'P04637', // TP53
  selectedProteinMeta: null,
  selectedCompound: null,
  isBioScanning: false,

  setSelectedProtein: (accession: string, meta?: AlphaFoldPredictionMeta) => {
    AudioManager.playBioScanChirp();
    set({
      selectedProteinAccession: accession,
      selectedProteinMeta: meta || null,
    });

    get().addLog(
      'BIO',
      `AlphaFold 3D structure loaded: UniProt [${accession}]. 4-tier pLDDT confidence gradient active.`,
      'info'
    );
  },

  setSelectedCompound: (compound: ChemicalCompound) => {
    AudioManager.playBioScanChirp();
    set((state) => ({
      selectedCompound: compound,
      metrics: {
        ...state.metrics,
        totalCompoundsScanned: state.metrics.totalCompoundsScanned + 1,
      },
    }));

    get().addLog(
      'BIO',
      `PubChem compound resolved: ${compound.name} [CID: ${compound.cid}]. Lipinski: ${compound.lipinskiCompliant ? 'COMPLIANT' : 'VIOLATION DETECTED'}`,
      'info'
    );
  },

  setBioScanning: (scanning: boolean) => {
    set({ isBioScanning: scanning });
  },
});
