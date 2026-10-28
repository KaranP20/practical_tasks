import { StyleSheet, View } from 'react-native';

import { spacing } from '../../theme';
import { AppText } from './AppText';

type EmptyStateProps = {
  title: string;
  message?: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText style={styles.center} variant="title">
        {title}
      </AppText>
      {message ? (
        <AppText color="secondary" style={[styles.center, styles.message]}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  center: {
    textAlign: 'center',
  },
  message: {
    marginTop: spacing.sm,
  },
});
