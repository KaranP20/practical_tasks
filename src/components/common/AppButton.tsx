import { Pressable, StyleSheet } from 'react-native';

import { colors, dimensions } from '../../constants';
import { spacing } from '../../theme';
import { AppLoader } from './AppLoader';
import { AppText } from './AppText';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: AppButtonProps) {
  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isInactive }}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !isInactive && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <AppLoader color={colors.onPrimary} size="small" />
      ) : (
        <AppText color={disabled ? 'secondary' : 'inverse'} variant="button">
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: dimensions.buttonHeight,
    paddingHorizontal: spacing.lg,
    borderRadius: dimensions.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  pressed: {
    backgroundColor: colors.primaryPressed,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
});
