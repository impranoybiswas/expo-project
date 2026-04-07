// src/hooks/useTheme.ts
import { useThemeStore } from "../store";
import { darkColors, lightColors, ThemeMode } from "../theme";

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  const colors = theme === "dark" ? darkColors : lightColors;
  const isDark = theme === "dark";

  return {
    theme,
    colors,
    isDark,
    toggleTheme,
    setTheme,
  };
}
