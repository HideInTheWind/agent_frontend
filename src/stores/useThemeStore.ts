import { CACHED_OSS_THEME_KEY } from "@/constants";
import { DEFAULT_THEME_KEY, THEME_PRESETS_MAP } from "@/theme/themeOptions";
import { getStorageItem, setStorageItem } from "@/utils/storage";
import { create } from "zustand";

interface ThemeState {
  themeKey: ThemeKey;
  setThemeKey: (themeKey: ThemeKey) => void;
  themes: ThemeOption[];
}

const resolveInitialThemeKey = () => {
  const saved = getStorageItem(CACHED_OSS_THEME_KEY);
  if (saved && THEME_PRESETS_MAP.has(saved)) return saved;
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches)
    return "orange-dark";
  return DEFAULT_THEME_KEY;
};
const getThemeOption = (key: ThemeKey): ThemeOption =>
  THEME_PRESETS_MAP.get(key) ?? THEME_PRESETS_MAP.get(DEFAULT_THEME_KEY)!;

const applyThemeCss = (option: ThemeOption) => {
  document.documentElement.style.setProperty(
    "--ant-color-primary",
    option.colorPrimary,
  );
};

const initialThemeKey = resolveInitialThemeKey();
applyThemeCss(getThemeOption(initialThemeKey));

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeKey: initialThemeKey,
  setThemeKey: (key) => {
    if (!THEME_PRESETS_MAP.has(key)) return;
    if (get().themeKey === key) return;
    setStorageItem(CACHED_OSS_THEME_KEY, key);
    applyThemeCss(getThemeOption(key));
    set({ themeKey: key });
  },
  themes: Array.from(THEME_PRESETS_MAP.values()),
}));

export const selectThemeOption = (state: ThemeState) =>
  getThemeOption(state.themeKey);
