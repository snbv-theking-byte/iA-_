export interface ThemeTokens {
  bgPrimary: string;
  bgSecondary: string;
  accentPrimary: string;
  accentBright: string;
  accentCyan: string;
  accentCrimson: string;
  textPrimary: string;
  textMuted: string;
  borderPrimary: string;
}

export const THEMES: Record<string, ThemeTokens> = {
  "sovereign-gold": {
    bgPrimary: "#07090e",
    bgSecondary: "rgba(7, 9, 14, 0.95)",
    accentPrimary: "#dfb15b",
    accentBright: "#ffd978",
    accentCyan: "#00f0ff",
    accentCrimson: "#ff3366",
    textPrimary: "#f0f6fc",
    textMuted: "#8b949e",
    borderPrimary: "rgba(223, 177, 91, 0.3)"
  },
  "cyber-cyan": {
    bgPrimary: "#03080e",
    bgSecondary: "rgba(3, 8, 14, 0.95)",
    accentPrimary: "#00f0ff",
    accentBright: "#79f7ff",
    accentCyan: "#00f0ff",
    accentCrimson: "#ff3366",
    textPrimary: "#f0f6fc",
    textMuted: "#8b949e",
    borderPrimary: "rgba(0, 240, 255, 0.3)"
  },
  "royal-crimson": {
    bgPrimary: "#0a0709",
    bgSecondary: "rgba(10, 7, 9, 0.95)",
    accentPrimary: "#ff3366",
    accentBright: "#ff7092",
    accentCyan: "#00f0ff",
    accentCrimson: "#ff3366",
    textPrimary: "#f0f6fc",
    textMuted: "#8b949e",
    borderPrimary: "rgba(255, 51, 102, 0.3)"
  },
  "night-ops": {
    bgPrimary: "#020305",
    bgSecondary: "rgba(2, 3, 5, 0.95)",
    accentPrimary: "#8b949e",
    accentBright: "#c9d1d9",
    accentCyan: "#58a6ff",
    accentCrimson: "#f85149",
    textPrimary: "#f0f6fc",
    textMuted: "#6e7681",
    borderPrimary: "rgba(139, 148, 158, 0.2)"
  }
};
