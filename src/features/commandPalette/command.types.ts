export type CommandCategory = "system" | "radar" | "world" | "mukaab" | "settings" | "bioscience";

export interface Command {
  id: string;
  title: string;
  shortcut?: string;
  category: CommandCategory;
  execute: () => void;
}
