import { create } from "zustand";

interface ThemeState {
  light: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  light: false,
  toggle: () => {
    const next = !get().light;
    if (next) document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
    set({ light: next });
  }
}));
