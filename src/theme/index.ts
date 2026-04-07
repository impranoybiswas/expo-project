// src/theme/index.ts

export const colors = {
  // Primary Palette - Deep Indigo + Electric Cyan
  primary: "#5E5CE6", // More vibrant indigo
  primaryLight: "#8B8AF0",
  primaryDark: "#3F3D89",
  accent: "#00D2FF", // Electric Cyan
  accentLight: "#60EFFF",

  // Backgrounds
  bg: "#050510",
  bgCard: "#0C0C1A",
  bgElevated: "#16162C",
  bgGlass: "rgba(255, 255, 255, 0.03)",
  bgGlassBorder: "rgba(255, 255, 255, 0.08)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0C0",
  textMuted: "#505070",

  // Status
  success: "#34C759",
  warning: "#FFCC00",
  error: "#FF3B30",
  info: "#007AFF",

  // Priority Colors
  priorityLow: "#34C759",
  priorityMedium: "#FF9500",
  priorityHigh: "#FF3B30",

  // Borders
  border: "rgba(255, 255, 255, 0.06)",
  borderFocus: "#5E5CE6",

  // Gradients
  gradientPrimary: ["#5E5CE6", "#BF5AF2"] as const,
  gradientAccent: ["#00D2FF", "#007AFF"] as const,
  gradientDark: ["#050510", "#0C0C1A"] as const,
  gradientCard: ["#16162C", "#0C0C1A"] as const,
  gradientGlass: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.01)"] as const,
};

export const typography = {
  // Font families
  fontBold: "System",
  fontMedium: "System",
  fontRegular: "System",

  // Sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  "2xl": 30,
  "3xl": 36,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 28,
  "3xl": 36,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: "#5E5CE6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#5E5CE6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#5E5CE6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};
