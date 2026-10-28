import { Platform } from 'react-native';

// Android emulator can't see the host machine as localhost.
// For a real device, replace this with your computer's LAN IP.
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export const REQUEST_TIMEOUT_MS = 15000;
