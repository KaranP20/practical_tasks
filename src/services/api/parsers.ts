import { GIRTH_SITES, GOAL_LABELS } from '../../constants/measurements';
import type {
  ApiErrorBody,
  Client,
  ClientGoal,
  Coach,
  GirthEntry,
  GirthSite,
  LoginResponse,
  WeightEntry,
} from '../../types/api';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string =>
  typeof value === 'string';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isDateString = (value: unknown): value is string =>
  isString(value) && !Number.isNaN(Date.parse(value));

const isClientGoal = (value: unknown): value is ClientGoal =>
  isString(value) && Object.prototype.hasOwnProperty.call(GOAL_LABELS, value);

const isGirthSite = (value: unknown): value is GirthSite =>
  GIRTH_SITES.some(site => site === value);

export function isCoach(value: unknown): value is Coach {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isString(value.email) &&
    isString(value.role) &&
    isString(value.gymName) &&
    isNumber(value.clientCount)
  );
}

export function isClient(value: unknown): value is Client {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isClientGoal(value.goal) &&
    isDateString(value.startDateISO) &&
    isNumber(value.heightCm) &&
    isString(value.avatarColor)
  );
}

export function isWeightEntry(value: unknown): value is WeightEntry {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.clientId) &&
    isDateString(value.dateISO) &&
    isNumber(value.weightKg) &&
    (value.note === null || isString(value.note)) &&
    isString(value.source)
  );
}

export function isGirthEntry(value: unknown): value is GirthEntry {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.clientId) &&
    isDateString(value.dateISO) &&
    isGirthSite(value.site) &&
    isNumber(value.valueMm) &&
    isString(value.source)
  );
}

export function isLoginResponse(value: unknown): value is LoginResponse {
  return isRecord(value) && isString(value.token) && isCoach(value.coach);
}

export function readErrorBody(value: unknown): ApiErrorBody['error'] | null {
  if (!isRecord(value) || !isRecord(value.error)) {
    return null;
  }
  const { code, message, field } = value.error;
  if (!isString(code) || !isString(message)) {
    return null;
  }
  return { code, message, field: isString(field) ? field : undefined };
}

export class ResponseShapeError extends Error { }

export function parseOne<T>(
  value: unknown,
  guard: (item: unknown) => item is T,
): T {
  if (!guard(value)) {
    throw new ResponseShapeError('Unexpected response shape');
  }
  return value;
}

export function parseItems<T>(
  value: unknown,
  guard: (item: unknown) => item is T,
): T[] {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new ResponseShapeError('Unexpected response shape');
  }
  return value.items.filter(guard);
}
