import http from '@/lib/http';
import type { AxiosRequestConfig } from 'axios';

/**
 * Tüm servis sınıfları için temel sınıf.
 * Extend ederek proje servislerinizi oluşturun:
 *
 * @example
 * class UserService extends BaseService {
 *   constructor() { super('/users'); }
 *   getAll() { return this.get<User[]>(); }
 *   getById(id: string) { return this.get<User>(`/${id}`); }
 * }
 * export const userService = new UserService();
 */
export abstract class BaseService {
  protected readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  protected get<T>(path = '', config?: AxiosRequestConfig) {
    return http.get<T>(`${this.basePath}${path}`, config);
  }

  protected post<T>(path = '', data?: unknown, config?: AxiosRequestConfig) {
    return http.post<T>(`${this.basePath}${path}`, data, config);
  }

  protected put<T>(path = '', data?: unknown, config?: AxiosRequestConfig) {
    return http.put<T>(`${this.basePath}${path}`, data, config);
  }

  protected patch<T>(path = '', data?: unknown, config?: AxiosRequestConfig) {
    return http.patch<T>(`${this.basePath}${path}`, data, config);
  }

  protected delete<T>(path = '', config?: AxiosRequestConfig) {
    return http.delete<T>(`${this.basePath}${path}`, config);
  }
}
