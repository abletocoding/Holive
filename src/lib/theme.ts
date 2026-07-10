export type ThemeMode = "light" | "dark";

export const themeModes: ThemeMode[] = ["light", "dark"];

export const themeClass = {
  light: "theme-light",
  dark: "theme-dark",
} as const;

export const THEME_STORAGE_KEY = "holive-theme";

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove(themeClass.light, themeClass.dark);
  root.classList.add(themeClass[mode]);
  root.style.colorScheme = mode;
}

export function readStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function storeTheme(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}
