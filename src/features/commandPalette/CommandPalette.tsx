import React, { useState, useEffect, useMemo, useRef } from "react";
import { getCommands } from "./commandRegistry";
import { CommandPaletteItem } from "./CommandPaletteItem";
import { audioEngine } from "../audio/AudioEngine";
import { useAppStore } from "../../store/useAppStore";
import styles from "./commandPalette.module.css";
import type { Command } from "./command.types";

export default function CommandPalette() {
  const isOpen = useAppStore((state) => state.commandPaletteOpen);
  const setIsOpen = useAppStore((state) => state.setCommandPaletteOpen);
  const audioEnabled = useAppStore((state) => state.audioEnabled);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo(() => getCommands(), [isOpen]);

  const filteredCommands = useMemo(() => {
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [commands, query]);

  // Global keyboard shortcut listener for Ctrl+K / Cmd+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setIsOpen(!useAppStore.getState().commandPaletteOpen);
      }
      if (e.key === "Escape" && useAppStore.getState().commandPaletteOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  // Focus input when opened and reset query
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      audioEngine.play("click", audioEnabled);
    }
  }, [isOpen, audioEnabled]);

  // Keyboard navigation inside the palette modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  };

  const executeCommand = (cmd: Command) => {
    cmd.execute();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.paletteModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <span className={styles.searchIcon}>Φ</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Type a command or search modules... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={styles.resultsList}>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <CommandPaletteItem
                key={cmd.id}
                command={cmd}
                isSelected={idx === selectedIndex}
                onSelect={() => setSelectedIndex(idx)}
                onExecute={() => executeCommand(cmd)}
              />
            ))
          ) : (
            <div className={styles.empty}>NO COMMANDS FOUND MATCHING QUERY</div>
          )}
        </div>

        <div className={styles.footer}>
          <span>NAVIGATE: [↑↓]</span>
          <span>SELECT: [ENTER]</span>
          <span>DISMISS: [ESC]</span>
        </div>
      </div>
    </div>
  );
}

export { CommandPalette };
