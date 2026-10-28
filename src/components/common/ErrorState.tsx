import { StyleSheet, View } from 'react-native';

import { strings } from '../../constants';
import { spacing } from '../../theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <AppText style={styles.message}>{message}</AppText>
      <AppButton onPress={onRetry} title={strings.errors.retry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
