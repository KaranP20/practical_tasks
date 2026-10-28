import type { JsonValue } from '../../types/common';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  body?: JsonValue;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

const jsonHeaders: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

let baseUrl = '';

export function setBaseUrl(url: string): void {
  baseUrl = url.replace(/\/+$/, '');
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  if (!baseUrl) {
    throw new ApiError('API base URL is not configured', 0);
  }

  const { method = 'GET', body, headers, signal } = options;
  const response = await fetch(`${baseUrl}${normalizePath(path)}`, {
    method,
    headers: {
      ...jsonHeaders,
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
    );
  }

  const text = await response.text();

  try {
    const value: unknown = text ? JSON.parse(text) : undefined;
    return value as T;
  } catch {
    throw new ApiError('Response was not valid JSON', response.status);
  }
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}
