import { strings } from '../constants';
import { ApiError } from '../services/api/apiClient';
import { ResponseShapeError } from '../services/api/parsers';

export function getErrorMessage(error: unknown): string {
  if (error instanceof ResponseShapeError) {
    return strings.errors.badResponse;
  }
  if (!(error instanceof ApiError)) {
    return strings.errors.generic;
  }
  switch (error.code) {
    case 'NETWORK_ERROR':
      return strings.errors.network;
    case 'TIMEOUT':
      return strings.errors.timeout;
    case 'BAD_RESPONSE':
      return strings.errors.badResponse;
  }
  if (error.status === 401) {
    return strings.errors.sessionExpired;
  }
  if (error.status === 404) {
    return strings.errors.notFound;
  }
  if (error.status >= 500) {
    return strings.errors.serverDown;
  }
  return error.message || strings.errors.generic;
}
