import React from "react";
import type { Command } from "./command.types";
import styles from "./commandPalette.module.css";

interface Props {
  command: Command;
  isSelected: boolean;
  onSelect: () => void;
  onExecute: () => void;
}

export const CommandPaletteItem: React.FC<Props> = React.memo(({
  command,
  isSelected,
  onSelect,
  onExecute
}) => {
  return (
    <div
      className={`${styles.item} ${isSelected ? styles.selected : ""}`}
      onMouseEnter={onSelect}
      onClick={onExecute}
    >
      <div className={styles.itemContent}>
        <span className={styles.categoryBadge} data-category={command.category}>
          {command.category.toUpperCase()}
        </span>
        <span className={styles.title}>{command.title}</span>
      </div>
      {command.shortcut && <span className={styles.shortcut}>{command.shortcut}</span>}
    </div>
  );
});

CommandPaletteItem.displayName = "CommandPaletteItem";
