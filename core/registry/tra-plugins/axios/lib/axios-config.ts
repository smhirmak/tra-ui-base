/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { AxiosResponse } from 'axios';

// ─── Custom Response Type ────────────────────────────────────────────────────
export interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
  data: T;
  error?: boolean;
  message?: string | null;
}

// ─── Axios Instance ──────────────────────────────────────────────────────────
const RequestService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30_000,
});

RequestService.defaults.headers.head['Content-Type'] = 'application/json';
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
  (response) => ({
    ...response,
    message: (response.data as any)?.message ?? null,
    error: (response.data as any)?.error ?? false,
    data: (response.data as any)?.data ?? (response.data as any)?.Result ?? response.data,
  }),
  (error) => {
    console.error('[Axios Error]', error);
    return Promise.reject(error);
  },
);

// ─── Request Interceptor ─────────────────────────────────────────────────────
RequestService.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error),
);

export default RequestService;
