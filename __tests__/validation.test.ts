import { ApiError } from '../src/services/api/apiClient';
import { getRangeStartISO, isInRange } from '../src/utils/dateRange';
import { toEntryISO } from '../src/utils/date';
import { getErrorMessage } from '../src/utils/errors';
import { parseWeightKg, validateLogin } from '../src/utils/validation';
import { strings } from '../src/constants';

describe('parseWeightKg', () => {
  it('accepts valid numbers', () => {
    expect(parseWeightKg('85.4')).toEqual({ ok: true, value: 85.4 });
    expect(parseWeightKg(' 72,5 ')).toEqual({ ok: true, value: 72.5 });
  });

  it('rejects empty, non-numeric and out of range values', () => {
    expect(parseWeightKg('').ok).toBe(false);
    expect(parseWeightKg('abc').ok).toBe(false);
    expect(parseWeightKg('8o').ok).toBe(false);
    expect(parseWeightKg('19.9').ok).toBe(false);
    expect(parseWeightKg('400.1').ok).toBe(false);
    expect(parseWeightKg('20').ok).toBe(true);
    expect(parseWeightKg('400').ok).toBe(true);
  });
});

describe('validateLogin', () => {
  it('catches empty and badly formatted input', () => {
    expect(validateLogin('', '')).toEqual({
      email: strings.login.emailRequired,
      password: strings.login.passwordRequired,
    });
    expect(validateLogin('coach@', 'x').email).toBe(strings.login.emailInvalid);
    expect(validateLogin(' coach@molt.app ', 'molt1234')).toEqual({});
  });
});

describe('date range', () => {
  const now = new Date('2026-07-29T09:00:00.000Z');

  it('sends from = now minus N days', () => {
    expect(getRangeStartISO('30D', now)).toBe('2026-06-29T09:00:00.000Z');
    expect(getRangeStartISO('ALL', now)).toBeUndefined();
  });

  it('checks if a date falls in the range', () => {
    expect(isInRange('2026-07-25T09:00:00.000Z', '7D', now)).toBe(true);
    expect(isInRange('2026-07-01T09:00:00.000Z', '7D', now)).toBe(false);
    expect(isInRange('2020-01-01T09:00:00.000Z', 'ALL', now)).toBe(true);
  });
});

describe('toEntryISO', () => {
  it('never returns a time in the future', () => {
    const now = new Date(2026, 6, 29, 8, 0);
    expect(Date.parse(toEntryISO(now, now))).toBeLessThanOrEqual(now.getTime());
  });

  it('uses midday for past days', () => {
    const now = new Date(2026, 6, 29, 8, 0);
    const picked = new Date(2026, 6, 20, 23, 30);
    expect(new Date(toEntryISO(picked, now)).getHours()).toBe(12);
  });
});

describe('getErrorMessage', () => {
  it('gives different messages for different failures', () => {
    expect(getErrorMessage(new ApiError('x', 0, 'NETWORK_ERROR'))).toBe(
      strings.errors.network,
    );
    expect(getErrorMessage(new ApiError('x', 503, 'SERVICE_UNAVAILABLE'))).toBe(
      strings.errors.serverDown,
    );
    expect(
      getErrorMessage(
        new ApiError('Weight must be between 20 and 400 kg.', 422, 'VALIDATION_FAILED'),
      ),
    ).toBe('Weight must be between 20 and 400 kg.');
    expect(getErrorMessage(new Error('boom'))).toBe(strings.errors.generic);
  });
});
