import type { Coach, LoginResponse } from '../types/api';
import { apiClient } from './api/apiClient';
import { endpoints } from './api/endpoints';
import { isCoach, isLoginResponse, parseOne } from './api/parsers';

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const data = await apiClient(endpoints.login, {
    method: 'POST',
    body: { email, password },
    authenticated: false,
  });
  return parseOne(data, isLoginResponse);
}

export async function getMe(): Promise<Coach> {
  return parseOne(await apiClient(endpoints.me), isCoach);
}
