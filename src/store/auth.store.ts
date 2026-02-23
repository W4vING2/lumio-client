import { create } from "zustand";
import type { AuthUser } from "@lumio/shared";
import { api, getRefreshToken, setAccessToken, setRefreshToken } from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: FormData) => Promise<{ requiresEmailVerification: boolean; email: string }>;
  setSession: (payload: { user: AuthUser; accessToken: string; refreshToken: string }) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: getRefreshToken(),
  loading: false,
  setSession: ({ user, accessToken, refreshToken }) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    connectSocket(accessToken);
    set({ user, accessToken, refreshToken });
  },
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post<{ accessToken: string; refreshToken: string }>("/auth/login", { email, password });
      setAccessToken(data.accessToken);
      const me = await api.get<AuthUser>("/users/me");
      useAuthStore.getState().setSession({
        user: me.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
    } finally {
      set({ loading: false });
    }
  },
  register: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post<{ requiresEmailVerification: boolean; email: string }>("/auth/register", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return data;
    } finally {
      set({ loading: false });
    }
  },
  fetchMe: async () => {
    set({ loading: true });
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        const refreshed = await api.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
          refreshToken: refresh
        });
        setAccessToken(refreshed.data.accessToken);
        setRefreshToken(refreshed.data.refreshToken);
        const me = await api.get<AuthUser>("/users/me");
        connectSocket(refreshed.data.accessToken);
        set({
          user: me.data,
          accessToken: refreshed.data.accessToken,
          refreshToken: refreshed.data.refreshToken
        });
        set({ loading: false });
        return;
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
      }
    }

    try {
      const { data } = await api.get<AuthUser>("/users/me");
      const token = useAuthStore.getState().accessToken ?? undefined;
      connectSocket(token);
      set({ user: data, refreshToken: getRefreshToken() });
    } catch {
      setAccessToken(null);
      set({ user: null, accessToken: null, refreshToken: null });
    } finally {
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
