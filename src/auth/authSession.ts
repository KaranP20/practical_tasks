import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { Alert } from 'react-native';

import { strings } from '../constants';
import {
  setAuthToken,
  setUnauthorizedHandler,
} from '../services/api/apiClient';

export type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

const TOKEN_KEY = 'moltCoach.authToken';

let status: AuthStatus = 'restoring';
const listeners = new Set<() => void>();

function setStatus(next: AuthStatus) {
  status = next;
  listeners.forEach(listener => listener());
}

export async function restoreSession(): Promise<void> {
  let token: string | null = null;
  try {
    token = await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
  }
  setAuthToken(token);
  setStatus(token ? 'signedIn' : 'signedOut');
}

export async function signIn(token: string): Promise<void> {
  setAuthToken(token);
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch {
  }
  setStatus('signedIn');
}

export function signOut(): void {
  setAuthToken(null);
  setStatus('signedOut');
  AsyncStorage.removeItem(TOKEN_KEY).catch(() => { });
}

setUnauthorizedHandler(() => {
  if (status !== 'signedIn') {
    return;
  }
  signOut();
  Alert.alert(strings.errors.sessionExpiredTitle, strings.errors.sessionExpired);
});

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAuthStatus(): AuthStatus {
  return useSyncExternalStore(subscribe, () => status);
}
