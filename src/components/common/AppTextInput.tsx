import type { Ref } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { colors, dimensions } from '../../constants';
import { spacing, typography } from '../../theme';
import { AppText } from './AppText';

type AppTextInputProps = TextInputProps & {
  label: string;
  error?: string | null;
  ref?: Ref<TextInputInstance>;
};

export function AppTextInput({
  label,
  error,
  style,
  ref,
  ...rest
}: AppTextInputProps) {
  return (
    <View style={styles.container}>
      <AppText color="secondary" style={styles.label} variant="caption">
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        ref={ref}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? (
        <AppText color="error" style={styles.error} variant="caption">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    minHeight: dimensions.buttonHeight,
    paddingHorizontal: spacing.md,
    borderRadius: dimensions.radiusSm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: spacing.xs,
  },
});
