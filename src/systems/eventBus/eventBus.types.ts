import type { RadarNode } from "../../features/radar/radar.types";
import type { CoreStatus, ThemePreset } from "../../store/store.types";
import type { TotemId } from "../../types";

export interface NodeEventPayload {
  id: string;
  source: "radar" | "globe" | "campaign" | "commandPalette" | string;
  timestamp?: number;
}

export type EventMap = {
  // Radar Events
  "radar:node:selected": RadarNode | (NodeEventPayload & Partial<RadarNode>);
  "radar:node:hovered": RadarNode | null | { id: string | null; source: string };
  "radar:pulse:executed": { timestamp: number; origin: string };

  // World Globe Events
  "world:node:selected": NodeEventPayload;
  "world:camera:focus": { latitude: number; longitude: number; name: string };

  // Mukaab Core Events
  "mukaab:status:changed": { previous: CoreStatus; current: CoreStatus };
  "mukaab:core:clicked": { timestamp: number };

  // Totemic Network Events
  "totem:toggled": { id: TotemId; active: boolean };

  // System & Settings Events
  "system:pulse": { timestamp: number };
  "system:theme:changed": { theme: ThemePreset };
  "system:crt:toggled": { enabled: boolean };
  "system:audio:toggled": { enabled: boolean };

  // Telemetry & Command Events
  "telemetry:log:added": { category: string; message: string; level: string };
  "telemetry:logs:cleared": { timestamp: number };
  "command:executed": { commandId: string; title: string };
};
