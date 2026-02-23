import { create } from "zustand";
const STORAGE_KEY = "lumio_theme";
const THEME_CLASSES = ["theme-dark", "theme-light", "theme-green", "theme-blue"];
const applyThemeClass = (theme) => {
    if (typeof document === "undefined")
        return;
    const root = document.documentElement;
    root.classList.remove("light");
    THEME_CLASSES.forEach((className) => root.classList.remove(className));
    root.classList.add(`theme-${theme}`);
};
const readInitialTheme = () => {
    if (typeof window === "undefined")
        return "dark";
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "green" || raw === "blue")
        return raw;
    return "dark";
};
export const initTheme = () => {
    applyThemeClass(readInitialTheme());
};
export const useThemeStore = create((set) => ({
    mode: readInitialTheme(),
    setMode: (mode) => {
        applyThemeClass(mode);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, mode);
        }
        set({ mode });
    }
}));
