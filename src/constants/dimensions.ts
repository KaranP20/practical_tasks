import { Dimensions } from 'react-native';

const window = Dimensions.get('window');

export const dimensions = {
  windowWidth: window.width,
  windowHeight: window.height,
  buttonHeight: 48,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  accentWidth: 40,
  accentHeight: 4,
  maxContentWidth: 480,
} as const;
