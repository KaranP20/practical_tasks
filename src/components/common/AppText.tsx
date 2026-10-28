import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors } from '../../constants';
import { typography, type TextVariant } from '../../theme';

const textColors = StyleSheet.create({
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  inverse: { color: colors.onPrimary },
  error: { color: colors.error },
});

type TextColor = keyof typeof textColors;

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: TextColor;
};

export function AppText({
  variant = 'body',
  color = 'primary',
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text style={[typography[variant], textColors[color], style]} {...rest} />
  );
}
