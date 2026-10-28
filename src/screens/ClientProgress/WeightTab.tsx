import { useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppLoader,
  EmptyState,
  ErrorState,
  MeasurementRow,
  ProgressSummary,
  SegmentedControl,
} from '../../components';
import { colors, strings } from '../../constants';
import { useWeightEntries, type WeightRow } from '../../hooks';
import { spacing } from '../../theme';
import {
  formatDate,
  formatWeight,
  formatWeightChange,
  getErrorMessage,
  getTotalChange,
  withChanges,
  type RangeKey,
  type WeightUnit,
} from '../../utils';
import { AddWeightModal } from './AddWeightModal';
import { getEmptyText } from './emptyMessage';

const UNIT_OPTIONS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
];

const getKg = (entry: WeightRow) => entry.weightKg;

type WeightTabProps = {
  clientId: string;
  range: RangeKey;
  unit: WeightUnit;
  onUnitChange: (unit: WeightUnit) => void;
};

export function WeightTab({
  clientId,
  range,
  unit,
  onUnitChange,
}: WeightTabProps) {
  const {
    entries,
    status,
    errorMessage,
    hasNoData,
    isRefreshing,
    reload,
    refresh,
    addEntry,
    removeEntry,
  } = useWeightEntries(clientId, range);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const rows = useMemo(() => withChanges(entries, getKg), [entries]);

  if (status === 'loading') {
    return <AppLoader fullscreen />;
  }
  if (status === 'error') {
    return (
      <ErrorState
        message={errorMessage ?? strings.errors.generic}
        onRetry={reload}
      />
    );
  }

  const latest = entries[0];
  const totalChange = getTotalChange(entries, getKg);

  const confirmDelete = (entry: WeightRow) => {
    Alert.alert(
      strings.progress.deleteTitle,
      `${formatDate(entry.dateISO)} · ${formatWeight(entry.weightKg, unit)}`,
      [
        { text: strings.progress.deleteCancel, style: 'cancel' },
        {
          text: strings.progress.deleteConfirm,
          style: 'destructive',
          onPress: () => {
            removeEntry(entry).catch(error => {
              Alert.alert(
                strings.progress.deleteFailedTitle,
                `${getErrorMessage(error)} ${strings.progress.deleteFailedMessage}`,
              );
            });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {latest ? (
        <ProgressSummary
          latest={formatWeight(latest.weightKg, unit)}
          right={
            <View style={styles.unitToggle}>
              <SegmentedControl
                onChange={onUnitChange}
                options={UNIT_OPTIONS}
                value={unit}
              />
            </View>
          }
          totalChange={
            totalChange === null ? null : formatWeightChange(totalChange, unit)
          }
        />
      ) : null}

      <FlatList
        contentContainerStyle={rows.length === 0 && styles.emptyContainer}
        data={rows}
        keyExtractor={row => row.entry.id}
        ListEmptyComponent={
          <EmptyState
            {...getEmptyText(
              range,
              hasNoData,
              'weight',
              strings.progress.noWeightHint,
            )}
          />
        }
        refreshControl={
          <RefreshControl onRefresh={refresh} refreshing={isRefreshing} />
        }
        renderItem={({ item }) => (
          <MeasurementRow
            change={
              item.change === null ? null : formatWeightChange(item.change, unit)
            }
            date={formatDate(item.entry.dateISO)}
            isPending={item.entry.isPending}
            note={item.entry.note}
            onLongPress={() => confirmDelete(item.entry)}
            value={formatWeight(item.entry.weightKg, unit)}
          />
        )}
      />

      <View style={styles.footer}>
        <AppButton
          onPress={() => setIsAddOpen(true)}
          title={strings.progress.add}
        />
      </View>

      <AddWeightModal
        onClose={() => setIsAddOpen(false)}
        onSubmit={addEntry}
        visible={isAddOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  unitToggle: {
    width: 100,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
