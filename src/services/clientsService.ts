import type { Client } from '../types/api';
import { apiClient } from './api/apiClient';
import { endpoints } from './api/endpoints';
import { isClient, parseItems } from './api/parsers';

export async function getClients(): Promise<Client[]> {
  return parseItems(await apiClient(endpoints.clients), isClient);
}
