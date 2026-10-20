export type SoundEffectType = 
  | "click" 
  | "blip" 
  | "confirm" 
  | "warning" 
  | "critical" 
  | "pulse";

export interface AudioEngineConfig {
  masterVolume: number;
  enabled: boolean;
}
