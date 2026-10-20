import { useAppStore } from "../../store/useAppStore";
import { audioEngine } from "../audio/AudioEngine";
import type { Command } from "./command.types";

export function getCommands(): Command[] {
  const store = useAppStore.getState();

  return [
    {
      id: "pulse",
      title: "Execute Global Pulse",
      shortcut: "Ctrl+P",
      category: "radar",
      execute() {
        store.executeGlobalPulse();
        audioEngine.play("pulse", store.audioEnabled);
      }
    },
    {
      id: "toggle-audio",
      title: "Toggle Audio Synthesis Engine",
      shortcut: "Ctrl+M",
      category: "settings",
      execute() {
        store.toggleAudio();
        audioEngine.play("confirm", true);
      }
    },
    {
      id: "toggle-crt",
      title: "Toggle CRT Scanline Filter",
      shortcut: "Ctrl+T",
      category: "settings",
      execute() {
        store.toggleCrtFilter();
        audioEngine.play("click", store.audioEnabled);
      }
    },
    {
      id: "clear-logs",
      title: "Clear Telemetry Audit Logs",
      shortcut: "Ctrl+L",
      category: "system",
      execute() {
        store.clearLogs();
        audioEngine.play("warning", store.audioEnabled);
      }
    },
    {
      id: "core-warning",
      title: "Set Mukaab Core Status to WARNING",
      category: "mukaab",
      execute() {
        store.setCoreStatus("warning");
        audioEngine.play("warning", store.audioEnabled);
      }
    },
    {
      id: "core-nominal",
      title: "Set Mukaab Core Status to NOMINAL",
      category: "mukaab",
      execute() {
        store.setCoreStatus("nominal");
        audioEngine.play("confirm", store.audioEnabled);
      }
    },
    {
      id: "core-overcharge",
      title: "Set Mukaab Core Status to OVERCHARGE",
      category: "mukaab",
      execute() {
        store.setCoreStatus("overcharge");
        audioEngine.play("critical", store.audioEnabled);
      }
    },
    {
      id: "toggle-wireframe",
      title: "Toggle Mukaab Wireframe Mode",
      category: "mukaab",
      execute() {
        store.toggleWireframe();
        audioEngine.play("click", store.audioEnabled);
      }
    },
    {
      id: "nav-radar",
      title: "Navigate to Strategic Radar",
      category: "radar",
      execute() {
        store.setActiveView("STRATEGIC_RADAR");
        audioEngine.play("blip", store.audioEnabled);
      }
    },
    {
      id: "nav-mukaab",
      title: "Navigate to 3D Mukaab Nexus",
      category: "mukaab",
      execute() {
        store.setActiveView("MUKAAB_NEXUS");
        audioEngine.play("click", store.audioEnabled);
      }
    },
    {
      id: "nav-bioscience",
      title: "Navigate to AlphaFold 3D Molecular Explorer",
      category: "bioscience",
      execute() {
        store.setActiveView("BIOSCIENCE_STRUCTURES");
        audioEngine.play("confirm", store.audioEnabled);
      }
    },
    {
      id: "nav-chemical",
      title: "Navigate to Chemical Defense Scout",
      category: "bioscience",
      execute() {
        store.setActiveView("CHEMICAL_DEFENSE");
        audioEngine.play("confirm", store.audioEnabled);
      }
    },
    {
      id: "nav-totems",
      title: "Navigate to Totemic Resonance Network",
      category: "system",
      execute() {
        store.setActiveView("TOTEMIC_NETWORK");
        audioEngine.play("click", store.audioEnabled);
      }
    },
    {
      id: "nav-terminal",
      title: "Navigate to Telemetry Audit Terminal",
      category: "system",
      execute() {
        store.setActiveView("TELEMETRY_LOGS");
        audioEngine.play("click", store.audioEnabled);
      }
    },
    {
      id: "load-p53",
      title: "Load Protein: TP53 (Guardian of the Genome)",
      category: "bioscience",
      execute() {
        store.setSelectedProtein("P04637");
        store.setActiveView("BIOSCIENCE_STRUCTURES");
        audioEngine.play("confirm", store.audioEnabled);
      }
    },
    {
      id: "load-ace2",
      title: "Load Protein: ACE2 (Pathogen Receptor)",
      category: "bioscience",
      execute() {
        store.setSelectedProtein("Q9BYF1");
        store.setActiveView("BIOSCIENCE_STRUCTURES");
        audioEngine.play("confirm", store.audioEnabled);
      }
    },
    {
      id: "nav-globe",
      title: "Navigate to 3D Sovereign World Globe",
      shortcut: "Ctrl+G",
      category: "world",
      execute() {
        store.setActiveView("WORLD_GLOBE");
        audioEngine.play("blip", store.audioEnabled);
      }
    },
    {
      id: "globe-focus-riyadh",
      title: "Globe: Focus Riyadh Sovereign Core",
      category: "world",
      execute() {
        store.setSelectedNodeId("riyadh");
        audioEngine.play("confirm", store.audioEnabled);
      }
    },
    {
      id: "globe-focus-cairo",
      title: "Globe: Focus Cairo Relay Array",
      category: "world",
      execute() {
        store.setSelectedNodeId("cairo");
        audioEngine.play("confirm", store.audioEnabled);
      }
    },
    {
      id: "globe-focus-london",
      title: "Globe: Focus London Observer",
      category: "world",
      execute() {
        store.setSelectedNodeId("london");
        audioEngine.play("confirm", store.audioEnabled);
      }
    },
    {
      id: "globe-focus-vatican",
      title: "Globe: Focus Vatican Observatory",
      category: "world",
      execute() {
        store.setSelectedNodeId("vatican");
        audioEngine.play("warning", store.audioEnabled);
      }
    }
  ];
}
