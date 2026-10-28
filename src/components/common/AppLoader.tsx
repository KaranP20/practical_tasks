import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { ActivityIndicatorProps } from 'react-native';

import { colors } from '../../constants';

type AppLoaderProps = {
  size?: ActivityIndicatorProps['size'];
  color?: string;
  fullscreen?: boolean;
};

export function AppLoader({
  size = 'large',
  color = colors.primary,
  fullscreen = false,
}: AppLoaderProps) {
  const indicator = <ActivityIndicator color={color} size={size} />;

  if (!fullscreen) {
    return indicator;
  }

  return <View style={styles.fullscreen}>{indicator}</View>;
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
