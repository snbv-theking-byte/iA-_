import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { THEMES } from "./theme.tokens";

export function useThemeSync() {
  const themeName = useAppStore((state) => state.theme);

  useEffect(() => {
    const tokens = THEMES[themeName] || THEMES["sovereign-gold"];
    const root = document.documentElement;

    root.style.setProperty("--bg-primary", tokens.bgPrimary);
    root.style.setProperty("--bg-secondary", tokens.bgSecondary);
    root.style.setProperty("--accent-primary", tokens.accentPrimary);
    root.style.setProperty("--accent-bright", tokens.accentBright);
    root.style.setProperty("--accent-cyan", tokens.accentCyan);
    root.style.setProperty("--accent-crimson", tokens.accentCrimson);
    root.style.setProperty("--text-primary", tokens.textPrimary);
    root.style.setProperty("--text-muted", tokens.textMuted);
    root.style.setProperty("--border-primary", tokens.borderPrimary);

    // Sync body background color
    document.body.style.backgroundColor = tokens.bgPrimary;
  }, [themeName]);
}
