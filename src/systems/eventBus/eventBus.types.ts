import type { RadarNode } from "../../features/radar/radar.types";
import type { CoreStatus, ThemePreset } from "../../store/store.types";
import type { TotemId } from "../../types";

export type EventMap = {
  // Radar Events
  "radar:node:selected": RadarNode;
  "radar:node:hovered": RadarNode | null;
  "radar:pulse:executed": { timestamp: number; origin: string };

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
}
