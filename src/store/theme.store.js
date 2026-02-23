import { create } from "zustand";
export const useThemeStore = create((set, get) => ({
    light: false,
    toggle: () => {
        const next = !get().light;
        if (next)
            document.documentElement.classList.add("light");
        else
            document.documentElement.classList.remove("light");
        set({ light: next });
    }
}));
