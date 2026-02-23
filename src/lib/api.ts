import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

const REFRESH_TOKEN_STORAGE_KEY = "lumio_refresh_token";

let refreshToken: string | null =
  typeof window !== "undefined" ? window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) : null;

export const setRefreshToken = (token: string | null): void => {
  refreshToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  }
};

export const getRefreshToken = (): string | null => refreshToken;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status as number | undefined;
    const original = error.config as { _retry?: boolean };

    if (status === 401 && !original?._retry && refreshToken) {
      original._retry = true;
      const { data } = await api.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", { refreshToken });
      setRefreshToken(data.refreshToken);
      return api.request(error.config);
    }

    return Promise.reject(error);
  }
);
