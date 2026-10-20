export type CommandCategory = "system" | "radar" | "world" | "map" | "mukaab" | "settings" | "bioscience" | "drive";

export interface Command {
  id: string;
  title: string;
  shortcut?: string;
  category: CommandCategory;
  execute: () => void;
}
