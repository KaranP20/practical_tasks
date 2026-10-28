/**
 * Relative API paths only. Keep hosts and credentials out of this file.
 */
const id = (value: string) => encodeURIComponent(value);

export const endpoints = {
  login: '/auth/login',
  me: '/me',
  clients: '/clients',
  clientWeight: (clientId: string) => `/clients/${id(clientId)}/weight`,
  clientGirth: (clientId: string) => `/clients/${id(clientId)}/girth`,
  weightEntry: (entryId: string) => `/weight/${id(entryId)}`,
};

/** Builds "?a=1&b=2", skipping params that are undefined. */
export function withQuery(
  path: string,
  params: Record<string, string | undefined>,
): string {
  const query = Object.entries(params)
    .filter((pair): pair is [string, string] => pair[1] !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return query ? `${path}?${query}` : path;
}
