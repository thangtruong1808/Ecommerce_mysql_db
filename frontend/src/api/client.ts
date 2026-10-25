import axios, { type AxiosRequestConfig } from "axios";

/**
 * Typed wrappers around the shared Axios instance.
 * Auth interceptors are registered on that same instance, so these calls
 * still refresh cookies and retry 401 responses.
 */
export async function apiGet<TResponse>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axios.get<TResponse>(url, config);
  return response.data;
}

export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axios.post<TResponse>(url, body, config);
  return response.data;
}

export async function apiPut<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axios.put<TResponse>(url, body, config);
  return response.data;
}

export async function apiPatch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axios.patch<TResponse>(url, body, config);
  return response.data;
}

export async function apiDelete<TResponse = void>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const response = await axios.delete<TResponse>(url, config);
  return response.data;
}
