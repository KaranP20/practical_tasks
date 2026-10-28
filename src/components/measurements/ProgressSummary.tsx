import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, strings } from '../../constants';
import { spacing } from '../../theme';
import { AppText } from '../common/AppText';

type ProgressSummaryProps = {
  latest: string;
  /** Already formatted. null when there's nothing to compare against. */
  totalChange: string | null;
  right?: ReactNode;
};

export function ProgressSummary({
  latest,
  totalChange,
  right,
}: ProgressSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <AppText variant="heading">{latest}</AppText>
        {totalChange === null ? (
          <AppText color="secondary" variant="caption">
            — {strings.progress.noChange}
          </AppText>
        ) : (
          <AppText color="secondary">
            {totalChange} {strings.progress.sinceFirst}
          </AppText>
        )}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  text: {
    flex: 1,
  },
});
