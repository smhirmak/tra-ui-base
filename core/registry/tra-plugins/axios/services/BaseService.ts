/* eslint-disable @typescript-eslint/no-explicit-any */
import RequestService from "@/lib/axios-config";
import type { CustomAxiosResponse } from "@/lib/axios-config";
import type { AxiosRequestConfig } from "axios";

/**
 * Servis oluşturma kalıbı.
 * Her controller için bir servis objesi tanımlayın.
 *
 * @example
 * // services/UserService.ts
 * import { createService } from '@/services/BaseService';
 *
 * const UserService = createService('User/', {
 *   login: (data) => UserService.post('Login', data),
 *   detail: () => UserService.get(''),
 *   list: () => UserService.get('List'),
 *   create: (data) => UserService.post('Create', data),
 *   update: (data) => UserService.patch('Update', data),
 * });
 *
 * export default UserService;
 */

interface ServiceMethods {
  get: <T = any>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ) => Promise<CustomAxiosResponse<T>>;
  post: <T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<CustomAxiosResponse<T>>;
  put: <T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<CustomAxiosResponse<T>>;
  patch: <T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<CustomAxiosResponse<T>>;
  delete: <T = any>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ) => Promise<CustomAxiosResponse<T>>;
}

/**
 * Controller bazlı servis oluşturur.
 * İkinci parametre ile özel servis metodlarını tanımlayabilirsiniz.
 */
export function createService<
  T extends Record<string, (...args: any[]) => any>,
>(
  controller: string,
  methods: (service: ServiceMethods) => T,
): T & ServiceMethods {
  const baseMethods: ServiceMethods = {
    get: (endpoint, config) =>
      RequestService.get(
        `${controller}${endpoint}`,
        config,
      ) as Promise<CustomAxiosResponse>,
    post: (endpoint, data, config) =>
      RequestService.post(
        `${controller}${endpoint}`,
        data,
        config,
      ) as Promise<CustomAxiosResponse>,
    put: (endpoint, data, config) =>
      RequestService.put(
        `${controller}${endpoint}`,
        data,
        config,
      ) as Promise<CustomAxiosResponse>,
    patch: (endpoint, data, config) =>
      RequestService.patch(
        `${controller}${endpoint}`,
        data,
        config,
      ) as Promise<CustomAxiosResponse>,
    delete: (endpoint, config) =>
      RequestService.delete(
        `${controller}${endpoint}`,
        config,
      ) as Promise<CustomAxiosResponse>,
  };

  const customMethods = methods(baseMethods);

  return { ...baseMethods, ...customMethods };
}

/**
 * Response başarılı mı kontrolü.
 */
export function isResponseSuccessful(
  response: CustomAxiosResponse<any>,
): boolean {
  return (
    response &&
    response.status >= 200 &&
    response.status < 300 &&
    !response.error
  );
}

export default RequestService;
