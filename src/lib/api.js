import axios from "axios";
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});
const REFRESH_TOKEN_STORAGE_KEY = "lumio_refresh_token";
const ACCESS_TOKEN_STORAGE_KEY = "lumio_access_token";
let refreshToken = typeof window !== "undefined" ? window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) : null;
let accessToken = typeof window !== "undefined" ? window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) : null;
export const setRefreshToken = (token) => {
    refreshToken = token;
    if (typeof window !== "undefined") {
        if (token) {
            window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
        }
        else {
            window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        }
    }
};
export const setAccessToken = (token) => {
    accessToken = token;
    if (typeof window !== "undefined") {
        if (token) {
            window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
        }
        else {
            window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        }
    }
};
export const getRefreshToken = () => refreshToken;
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = config.headers ?? {};
        if (!("Authorization" in config.headers)) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
});
api.interceptors.response.use((response) => response, async (error) => {
    const status = error?.response?.status;
    const original = error.config;
    if (status === 401 && !original?._retry && refreshToken) {
        original._retry = true;
        const { data } = await api.post("/auth/refresh", { refreshToken });
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        return api.request(error.config);
    }
    return Promise.reject(error);
});
