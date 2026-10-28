import type { Nullable } from '../types/common';

export interface KeyValueStorage {
  getItem(key: string): Promise<Nullable<string>>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export function createMemoryStorage(): KeyValueStorage {
  const store = new Map<string, string>();

  return {
    async getItem(key) {
      const value = store.get(key);
      return value === undefined ? null : value;
    },
    async setItem(key, value) {
      store.set(key, value);
    },
    async removeItem(key) {
      store.delete(key);
    },
  };
}

let activeStorage: KeyValueStorage = createMemoryStorage();

export const storage: KeyValueStorage = {
  getItem: key => activeStorage.getItem(key),
  setItem: (key, value) => activeStorage.setItem(key, value),
  removeItem: key => activeStorage.removeItem(key),
};

export function setStorage(next: KeyValueStorage): void {
  activeStorage = next;
}
