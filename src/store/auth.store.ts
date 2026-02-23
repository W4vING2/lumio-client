import { create } from "zustand";
import type { AuthUser } from "@lumio/shared";
import { api, getRefreshToken, setRefreshToken } from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: FormData) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: getRefreshToken(),
  loading: false,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post<{ accessToken: string; refreshToken: string }>("/auth/login", { email, password });
      const me = await api.get<AuthUser>("/users/me", {
        headers: { Authorization: `Bearer ${data.accessToken}` }
      });
      setRefreshToken(data.refreshToken);
      connectSocket(data.accessToken);
      set({ user: me.data, accessToken: data.accessToken, refreshToken: data.refreshToken });
    } finally {
      set({ loading: false });
    }
  },
  register: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post<{ user: AuthUser; accessToken: string; refreshToken: string }>("/auth/register", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setRefreshToken(data.refreshToken);
      connectSocket(data.accessToken);
      set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
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
        setRefreshToken(refreshed.data.refreshToken);
        const me = await api.get<AuthUser>("/users/me", {
          headers: { Authorization: `Bearer ${refreshed.data.accessToken}` }
        });
        connectSocket(refreshed.data.accessToken);
        set({
          user: me.data,
          accessToken: refreshed.data.accessToken,
          refreshToken: refreshed.data.refreshToken
        });
        set({ loading: false });
        return;
      } catch {
        setRefreshToken(null);
      }
    }

    try {
      const { data } = await api.get<AuthUser>("/users/me");
      const token = useAuthStore.getState().accessToken ?? undefined;
      connectSocket(token);
      set({ user: data, refreshToken: getRefreshToken() });
    } catch {
      set({ user: null, accessToken: null, refreshToken: null });
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    const refresh = useAuthStore.getState().refreshToken;
    await api.post("/auth/logout", { refreshToken: refresh });
    disconnectSocket();
    setRefreshToken(null);
    set({ user: null, accessToken: null, refreshToken: null });
  }
}));
