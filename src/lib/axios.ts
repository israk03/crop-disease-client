import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { appConfig } from "@/config/app.config";

// ── In-memory access token (safe for XSS vs localStorage) ─────────────────────
let _accessToken: string | null = null;

export const getAccessToken = () => _accessToken;
export const setAccessToken = (token: string) => {
  _accessToken = token;
};
export const clearAccessToken = () => {
  _accessToken = null;
};

// ── Axios instance ────────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Refresh state ──────────────────────────────────────────────────────────────
let isRefreshing = false;

type QueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original) return Promise.reject(error);

    const isUnauthorized = error.response?.status === 401;

    if (isUnauthorized && !original._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && original.headers) {
              original.headers.Authorization = `Bearer ${token}`;
            }
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${appConfig.api.baseUrl}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken: string = data?.data?.accessToken;

        setAccessToken(newToken);
        processQueue(null, newToken);

        if (original.headers) {
          original.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();

        // safe browser-only redirect
        if (typeof window !== "undefined") {
          document.cookie =
            "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
           if (
  window.location.pathname !== "/login" &&
  window.location.pathname !== "/register"
) {
  window.location.replace("/login");
}
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);