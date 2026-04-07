// src/theme/index.ts

// src/theme/index.ts

export type ThemeMode = "dark" | "light";

export const darkColors = {
  primary: "#5E5CE6",
  primaryLight: "#8B8AF0",
  primaryDark: "#3F3D89",
  accent: "#5AC8FA",
  accentLight: "#60EFFF",
  bg: "#050510",
  bgCard: "#0C0C1A",
  bgElevated: "#16162C",
  bgGlass: "rgba(255, 255, 255, 0.05)",
  bgGlassBorder: "rgba(255, 255, 255, 0.1)",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0C0",
  textMuted: "#505070",
  success: "#32D74B",
  warning: "#FF9F0A",
  error: "#FF453A",
  info: "#0A84FF",
  border: "rgba(255, 255, 255, 0.08)",
  gradientDark: ["#050510", "#0C0C1A"] as const,
  gradientPrimary: ["#5E5CE6", "#BF5AF2"] as const,
  gradientAccent: ["#00D2FF", "#007AFF"] as const,
  tabBar: "rgba(12, 12, 26, 0.95)",
};

export const lightColors = {
  primary: "#5E5CE6",
  primaryLight: "#8B8AF0",
  primaryDark: "#3F3D89",
  accent: "#007AFF",
  accentLight: "#00D2FF",
  bg: "#F2F2F7",
  bgCard: "#FFFFFF",
  bgElevated: "#FFFFFF",
  bgGlass: "rgba(0, 0, 0, 0.05)",
  bgGlassBorder: "rgba(0, 0, 0, 0.08)",
  textPrimary: "#000000",
  textSecondary: "#3C3C43",
  textMuted: "#8E8E93",
  success: "#28CD41",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#007AFF",
  border: "rgba(0, 0, 0, 0.12)",
  gradientDark: ["#F2F2F7", "#E5E5EA"] as const,
  gradientPrimary: ["#5E5CE6", "#BF5AF2"] as const,
  gradientAccent: ["#00D2FF", "#007AFF"] as const,
  tabBar: "rgba(255, 255, 255, 0.9)",
};

export const colors = darkColors; // Temporary backward compatibility

export const priorityColors = {
  low: "#34C759",
  medium: "#FF9500",
  high: "#FF3B30",
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
