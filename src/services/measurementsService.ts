import type {
  GirthEntry,
  GirthSite,
  NewWeightEntry,
  WeightEntry,
} from '../types/api';
import { apiClient } from './api/apiClient';
import { endpoints, withQuery } from './api/endpoints';
import {
  isGirthEntry,
  isWeightEntry,
  parseItems,
  parseOne,
} from './api/parsers';

// Note: lists come back unsorted. Sorting is done in the hooks.

export async function getWeightEntries(
  clientId: string,
  fromISO?: string,
): Promise<WeightEntry[]> {
  const path = withQuery(endpoints.clientWeight(clientId), { from: fromISO });
  return parseItems(await apiClient(path), isWeightEntry);
}

export async function createWeightEntry(
  clientId: string,
  entry: NewWeightEntry,
): Promise<WeightEntry> {
  const data = await apiClient(endpoints.clientWeight(clientId), {
    method: 'POST',
    body: entry,
  });
  return parseOne(data, isWeightEntry);
}

export async function deleteWeightEntry(entryId: string): Promise<void> {
  await apiClient(endpoints.weightEntry(entryId), { method: 'DELETE' });
}

export async function getGirthEntries(
  clientId: string,
  site: GirthSite,
  fromISO?: string,
): Promise<GirthEntry[]> {
  const path = withQuery(endpoints.clientGirth(clientId), {
    site,
    from: fromISO,
  });
  return parseItems(await apiClient(path), isGirthEntry);
}
