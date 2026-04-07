// src/theme/index.ts

export const colors = {
  // Primary Palette - Deep Indigo + Electric Cyan
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  accent: '#06B6D4',
  accentLight: '#67E8F9',

  // Backgrounds
  bg: '#0A0A14',
  bgCard: '#12121F',
  bgElevated: '#1A1A2E',
  bgGlass: 'rgba(255,255,255,0.05)',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Priority Colors
  priorityLow: '#10B981',
  priorityMedium: '#F59E0B',
  priorityHigh: '#EF4444',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderFocus: '#4F46E5',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#4F46E5', '#7C3AED'] as const,
  gradientAccent: ['#06B6D4', '#3B82F6'] as const,
  gradientDark: ['#0A0A14', '#12121F'] as const,
  gradientCard: ['#1A1A2E', '#12121F'] as const,
};

export const typography = {
  // Font families
  fontBold: 'System',
  fontMedium: 'System',
  fontRegular: 'System',

  // Sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
};
