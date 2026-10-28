import { strings, WEIGHT_MAX_KG, WEIGHT_MIN_KG } from '../constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMBER_PATTERN = /^(\d+\.?\d*|\.\d+)$/;

export type LoginErrors = {
  email?: string;
  password?: string;
};

export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = strings.login.emailRequired;
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = strings.login.emailInvalid;
  }
  if (!password) {
    errors.password = strings.login.passwordRequired;
  }
  return errors;
}

export type ParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

export function parseWeightKg(input: string): ParseResult {
  // some keyboards give a comma as the decimal separator
  const text = input.trim().replace(',', '.');

  if (!text) {
    return { ok: false, error: strings.addWeight.weightRequired };
  }
  if (!NUMBER_PATTERN.test(text)) {
    return { ok: false, error: strings.addWeight.weightNotNumber };
  }
  const value = Number(text);
  if (value < WEIGHT_MIN_KG || value > WEIGHT_MAX_KG) {
    return {
      ok: false,
      error: `Weight must be between ${WEIGHT_MIN_KG} and ${WEIGHT_MAX_KG} kg.`,
    };
  }
  return { ok: true, value };
}
