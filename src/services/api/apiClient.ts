import { REQUEST_TIMEOUT_MS } from '../../config/env';
import type { JsonValue } from '../../types/common';
import { readErrorBody } from './parsers';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly field?: string;

  constructor(message: string, status: number, code: string, field?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  body?: JsonValue;
  headers?: Record<string, string>;
  authenticated?: boolean;
};

const jsonHeaders: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

let baseUrl = '';
let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setBaseUrl(url: string): void {
  baseUrl = url.replace(/\/+$/, '');
}

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export async function apiClient(
  path: string,
  options: RequestOptions = {},
): Promise<unknown> {
  if (!baseUrl) {
    throw new ApiError('API base URL is not configured', 0, 'NETWORK_ERROR');
  }

  const { method = 'GET', body, headers, authenticated = true } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  let text: string;
  try {
    response = await fetch(`${baseUrl}${normalizePath(path)}`, {
      method,
      headers: {
        ...jsonHeaders,
        ...(authenticated && authToken
          ? { Authorization: `Bearer ${authToken}` }
          : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    text = await response.text();
  } catch {
    if (controller.signal.aborted) {
      throw new ApiError('Request timed out', 0, 'TIMEOUT');
    }
    throw new ApiError('Network request failed', 0, 'NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
  }

  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
    if (response.ok) {
      throw new ApiError(
        'Response was not valid JSON',
        response.status,
        'BAD_RESPONSE',
      );
    }
  }

  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      onUnauthorized?.();
    }
    const error = readErrorBody(data);
    throw new ApiError(
      error?.message ?? `Request failed with status ${response.status}`,
      response.status,
      error?.code ?? 'HTTP_ERROR',
      error?.field,
    );
  }

  return data;
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}
