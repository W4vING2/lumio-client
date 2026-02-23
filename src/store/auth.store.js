import { create } from "zustand";
import { api, getRefreshToken, setAccessToken, setRefreshToken } from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";
export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    refreshToken: getRefreshToken(),
    loading: false,
    login: async (email, password) => {
        set({ loading: true });
        try {
            const { data } = await api.post("/auth/login", { email, password });
            setAccessToken(data.accessToken);
            const me = await api.get("/users/me");
            setRefreshToken(data.refreshToken);
            connectSocket(data.accessToken);
            set({ user: me.data, accessToken: data.accessToken, refreshToken: data.refreshToken });
        }
        finally {
            set({ loading: false });
        }
    },
    register: async (payload) => {
        set({ loading: true });
        try {
            const { data } = await api.post("/auth/register", payload, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            connectSocket(data.accessToken);
            set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
        }
        finally {
            set({ loading: false });
        }
    },
    fetchMe: async () => {
        set({ loading: true });
        const refresh = getRefreshToken();
        if (refresh) {
            try {
                const refreshed = await api.post("/auth/refresh", {
                    refreshToken: refresh
                });
                setAccessToken(refreshed.data.accessToken);
                setRefreshToken(refreshed.data.refreshToken);
                const me = await api.get("/users/me");
                connectSocket(refreshed.data.accessToken);
                set({
                    user: me.data,
                    accessToken: refreshed.data.accessToken,
                    refreshToken: refreshed.data.refreshToken
                });
                set({ loading: false });
                return;
            }
            catch {
                setAccessToken(null);
                setRefreshToken(null);
            }
        }
        try {
            const { data } = await api.get("/users/me");
            const token = useAuthStore.getState().accessToken ?? undefined;
            connectSocket(token);
            set({ user: data, refreshToken: getRefreshToken() });
        }
        catch {
            setAccessToken(null);
            set({ user: null, accessToken: null, refreshToken: null });
        }
        finally {
            set({ loading: false });
        }
    },
    logout: async () => {
        const refresh = useAuthStore.getState().refreshToken;
        await api.post("/auth/logout", { refreshToken: refresh });
        disconnectSocket();
        setAccessToken(null);
        setRefreshToken(null);
        set({ user: null, accessToken: null, refreshToken: null });
    }
}));
