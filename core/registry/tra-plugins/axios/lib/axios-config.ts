/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AxiosResponse } from "axios";
import Environment from "@/utilities/Environment";

// ─── Custom Response Type ────────────────────────────────────────────────────
export interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
  data: T;
  error?: boolean;
  message?: string | null;
}

// ─── Logout Ref (interceptor'dan AuthContext.logout tetiklemek için) ─────────
let logoutCallback: (() => void) | null = null;

export function setAxiosLogoutCallback(callback: () => void) {
  logoutCallback = callback;
}

// ─── Axios Instance ──────────────────────────────────────────────────────────
const RequestService = axios.create({
  baseURL: Environment.getBaseUrl(),
  timeout: 30_000,
});

RequestService.defaults.headers.head["Content-Type"] = "application/json";
RequestService.defaults.validateStatus = (status) => status < 500;

// ─── Auth Token Management ───────────────────────────────────────────────────
export function setAxiosAuthToken(token: string | null) {
  if (token) {
    RequestService.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete RequestService.defaults.headers.common.Authorization;
  }
}

// ─── Response Interceptor ────────────────────────────────────────────────────
RequestService.interceptors.response.use(
  (response) => {
    // 401 Unauthorized → otomatik logout
    if (response.status === 401 && logoutCallback) {
      logoutCallback();
    }

    return {
      ...response,
      message: (response.data as any)?.message ?? null,
      error: (response.data as any)?.error ?? false,
      data:
        (response.data as any)?.data ??
        (response.data as any)?.Result ??
        response.data,
    };
  },
  (error) => {
    // Network error veya 5xx durumlarında da 401 kontrolü
    if (error?.response?.status === 401 && logoutCallback) {
      logoutCallback();
    }
    console.error("[Axios Error]", error);
    return Promise.reject(error);
  },
);

// ─── Request Interceptor ─────────────────────────────────────────────────────
RequestService.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error),
);

export default RequestService;
