import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { colors } from '../../constants';
import { spacing } from '../../theme';
import { AppText } from '../common/AppText';

type MeasurementRowProps = {
  date: string;
  value: string;
  /** Already formatted. null for the oldest row. */
  change: string | null;
  note?: string | null;
  isPending?: boolean;
  onLongPress?: () => void;
};

export function MeasurementRow({
  date,
  value,
  change,
  note,
  isPending = false,
  onLongPress,
}: MeasurementRowProps) {
  return (
    <Pressable
      disabled={!onLongPress || isPending}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.row,
        isPending && styles.pending,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.dateColumn}>
        <AppText>{date}</AppText>
        {note ? (
          <AppText color="secondary" numberOfLines={1} variant="caption">
            {note}
          </AppText>
        ) : null}
      </View>
      <AppText style={styles.value}>{value}</AppText>
      <View style={styles.changeColumn}>
        {isPending ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <AppText color="secondary" variant="caption">
            {change ?? '—'}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pending: {
    opacity: 0.5,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  dateColumn: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  value: {
    fontWeight: '600',
  },
  changeColumn: {
    width: 80,
    alignItems: 'flex-end',
  },
});
